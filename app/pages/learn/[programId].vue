<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { programTemplates, programInstances, enrollmentsByPhase, type LearnerPhase } from '~/composables/useProgramMockData'
import { provideProgramPhase } from '~/composables/useProgramPhase'
import { provideProgramTabs } from '~/composables/useProgramTabs'
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

// Read from the enrollment fixtures rather than assumed: a learner who is
// enrolled in this program should land on the enrolled view, not the pitch.
// DevPreviewBar still overrides it, which is the point of the preview bar.
function phaseForProgram(id: string): LearnerPhase {
  const found = (Object.keys(enrollmentsByPhase) as LearnerPhase[])
    .find(key => enrollmentsByPhase[key].some(record => record.programId === id))
  return found ?? 'interested'
}

const phase = ref<LearnerPhase>(phaseForProgram(programId.value))
provideProgramPhase(phase)

// The shell is not remounted when the route param changes, so a preview
// override must not leak from one program onto the next.
watch(programId, (id) => {
  phase.value = phaseForProgram(id)
})

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
// a locked tab you cannot open is noise. The first entry is the default.
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

// Plain component state, not a route param: these behave like tabs, so
// switching one leaves the URL and history alone.
//
// `?item=` is the one exception, and it isn't a tab: it names a lesson, and a
// lesson only exists in the classroom. Arriving with one — the home page's
// "Resume learning" — opens there rather than on the default tab.
function initialTab(): TabId {
  const wantsLesson = Boolean(route.query.item)
  const canOpenClassroom = visibleTabs.value.some(tab => tab.id === 'classroom')
  return wantsLesson && canOpenClassroom ? 'classroom' : visibleTabs.value[0]!.id
}

const activeTab = ref<TabId>(initialTab())

// Changing phase changes which tabs exist, and can pull the open one out from
// under the learner — fall back rather than rendering a tab that is no longer
// listed. This also stands in for the validation the `?tab=` query needed.
watch(visibleTabs, (list) => {
  if (!list.some(tab => tab.id === activeTab.value)) activeTab.value = list[0]!.id
})

watch(programId, () => {
  activeTab.value = initialTab()
})

const tabItems = computed<TabsItem[]>(() =>
  visibleTabs.value.map(tab => ({ label: tab.label, value: tab.id }))
)

function setTab(tabId: string) {
  if (visibleTabs.value.some(tab => tab.id === tabId)) activeTab.value = tabId as TabId
}

// A tab's content can't link to another tab any more, so the shell hands
// children these instead. The lesson id still travels in `?item=` because the
// classroom reads it from the route.
provideProgramTabs({
  setTab,
  openLesson: (itemId: string) => {
    setTab('classroom')
    navigateTo({ path: route.path, query: { ...route.query, item: itemId } }, { replace: true })
  }
})
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
          <h1 class="text-5xl font-heading font-bold text-highlighted text-pretty">
            {{ template.title }}
          </h1>

          <!-- `content: false` — UTabs renders only the strip here. Each tab's
               panel is a separate async component below, outside the container,
               so tabs can own their own width and rail. -->
          <UTabs
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
            v-model="activeTab"
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
