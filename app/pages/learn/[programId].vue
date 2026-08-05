<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { programTemplates, programInstances, type LearnerPhase } from '~/composables/useProgramMockData'
import { provideProgramPhase } from '~/composables/useProgramPhase'
import { userName, streakDays, xpLabel, notificationCount } from '~/composables/useHomeMockData'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { t } = useI18n()

const programId = computed(() => route.params.programId as string)
const template = computed(() => programTemplates.find(p => p.id === programId.value))

// Educator Training has zero instances by design (facilitator-facing, no open
// learner enrollment), so the page must render off the template alone —
// gating on an instance too would 404 a program that exists.
const instances = computed(() => programInstances.filter(i => i.programId === programId.value))

// Matches useProgramPhase()'s inject fallback, and every learnPrograms entry
// has `enrolled: false` — a first-time visitor is the state to open in.
const phase = ref<LearnerPhase>('interested')
provideProgramPhase(phase)

const isEnrolled = computed(() => phase.value !== 'interested')

// Each tab's component is loaded the first time that tab is opened, so a
// visitor who never leaves the Overview never downloads the classroom.
const TAB_COMPONENTS = {
  overview: defineAsyncComponent(() => import('~/components/ProgramTabOverview.vue')),
  home: defineAsyncComponent(() => import('~/components/ProgramTabHome.vue')),
  community: defineAsyncComponent(() => import('~/components/ProgramTabCommunity.vue')),
  classroom: defineAsyncComponent(() => import('~/components/ProgramTabClassroom.vue')),
  projects: defineAsyncComponent(() => import('~/components/ProgramTabProjects.vue')),
  resources: defineAsyncComponent(() => import('~/components/ProgramTabResources.vue'))
} as const

type TabId = keyof typeof TAB_COMPONENTS

// Learner-only tabs are absent for people who haven't enrolled, not disabled —
// a locked tab you cannot open is noise. The first entry is the default, and
// is also the fallback for a `?tab=` value this phase isn't allowed to open.
//
// Overview and Home swap rather than coexist: Overview is the pitch, Home is
// the dashboard, and a learner is only ever in one of those situations.
const visibleTabs = computed<{ id: TabId, label: string }[]>(() =>
  isEnrolled.value
    ? [
        { id: 'home', label: t('program.tabs.home') },
        { id: 'community', label: t('program.tabs.community') },
        { id: 'classroom', label: t('program.tabs.classroom') },
        { id: 'projects', label: t('program.tabs.projects') },
        { id: 'resources', label: t('program.tabs.resources') }
      ]
    : [
        { id: 'overview', label: t('program.tabs.overview') },
        { id: 'community', label: t('program.tabs.community') },
        { id: 'projects', label: t('program.tabs.projects') }
      ]
)

// Validating against the visible set rather than trusting the query closes the
// hole the old nested routes had: `?tab=classroom` while not enrolled falls
// back to the first tab instead of rendering a learner-only surface.
const activeTab = computed<TabId>(() => {
  const requested = route.query.tab as string | undefined
  const match = visibleTabs.value.find(tab => tab.id === requested)
  return match?.id ?? visibleTabs.value[0]!.id
})

// The default tab carries no `?tab` so the canonical program URL stays clean.
// Which tab that is depends on phase — Overview before enrolling, Home after.
const defaultTabId = computed(() => visibleTabs.value[0]!.id)

const tabItems = computed<TabsItem[]>(() =>
  visibleTabs.value.map(tab => ({ label: tab.label, value: tab.id }))
)

// UTabs is controlled rather than self-managing: the query string is the
// source of truth for which tab is open, so selecting one navigates and the
// new URL feeds back in through `activeTab`.
//
// `replace`, not push: switching tabs is changing the view of one page, not
// moving to a new one. Pushing made every tab click a history entry, so Back
// walked backwards through tabs instead of leaving the program.
function goToTab(value: string | number) {
  const tabId = String(value)
  navigateTo({
    path: `/learn/${programId.value}`,
    query: tabId === defaultTabId.value ? {} : { tab: tabId }
  }, { replace: true })
}
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 gap-0 overflow-x-auto' }">
    <template #body>
      <AppTopbar
        :xp-label="xpLabel"
        :streak-days="streakDays"
        :user-name="userName"
        :notification-count="notificationCount"
      />

      <UContainer>

        <template v-if="template">
          <!-- The title is the page header and stays across tab switches. The
               program image and description belong to the Overview tab, which
               renders them itself. -->
          <h1 class="text-5xl font-heading font-bold text-highlighted text-pretty pt-10">
            {{ template.title }}
          </h1>

          <!-- `content: false` — UTabs renders only the strip here. Each tab's
               panel is a separate async component below, outside the container,
               so tabs can own their own width and rail. -->
          <UTabs
            :model-value="activeTab"
            :items="tabItems"
            color="primary"
            variant="pill"
            size="xl"
            :content="false"
            class="mt-8"
            :ui="{
              // UTabs stretches by default: the list is `w-full` and every
              // trigger is `grow`. Sized to its labels instead, and the root
              // left-aligned since it centres its children.
              root: 'items-start',
              list: 'w-fit',
              trigger: 'grow-0'
            }"
            @update:model-value="goToTab"
          />
        </template>

        <div
          v-else
          class="border-[1.5px] border-dashed border-slate-300 flex flex-col items-center gap-2 text-center rounded-2xl mb-16"
          style="padding: 32px 24px"
        >
          <Icon name="lucide:file-question" class="size-[22px] text-primary" />
          <div class="font-heading text-[15px] font-bold text-default">{{ t('program.notFound.title') }}</div>
          <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">{{ t('program.notFound.body') }}</p>
          <UButton :label="t('program.notFound.backToLearn')" to="/learn" color="neutral" variant="outline" class="mt-2" />
        </div>
      </UContainer>

      <!-- Outside the UContainer: each tab owns its own width and rail (the
           classroom is two-column, community is full-width), so the shell must
           not impose one. -->
      <!-- Keyed on the program so a tab can resolve its data once at setup
           instead of tracking the route param (see ProgramTabClassroom.vue). -->
      <component
        :is="TAB_COMPONENTS[activeTab]"
        v-if="template"
        :key="programId"
      />
    </template>
  </UDashboardPanel>

  <DevPreviewBar v-model="phase" />
</template>
