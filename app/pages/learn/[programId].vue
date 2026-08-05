<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
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
  about: defineAsyncComponent(() => import('~/components/ProgramTabAbout.vue')),
  community: defineAsyncComponent(() => import('~/components/ProgramTabCommunity.vue')),
  classroom: defineAsyncComponent(() => import('~/components/ProgramTabClassroom.vue')),
  projects: defineAsyncComponent(() => import('~/components/ProgramTabProjects.vue')),
  resources: defineAsyncComponent(() => import('~/components/ProgramTabResources.vue'))
} as const

type TabId = keyof typeof TAB_COMPONENTS

// Learner-only tabs are absent for people who haven't enrolled, not disabled —
// a locked tab you cannot open is noise. The first entry is the default, and
// is also the fallback for a `?tab=` value this phase isn't allowed to open.
const visibleTabs = computed<{ id: TabId, label: string }[]>(() =>
  isEnrolled.value
    ? [
        { id: 'overview', label: t('program.tabs.home') },
        { id: 'about', label: t('program.tabs.about') },
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

const isOverviewTab = computed(() => activeTab.value === 'overview')

// Overview carries no `?tab` so the canonical program URL stays clean.
const tabs = computed<NavigationMenuItem[]>(() =>
  visibleTabs.value.map(tab => ({
    label: tab.label,
    to: tab.id === 'overview'
      ? { path: `/learn/${programId.value}` }
      : { path: `/learn/${programId.value}`, query: { tab: tab.id } },
    // NuxtLink's own active matching ignores the query string, so every tab
    // would highlight at once — drive it off the resolved tab instead.
    active: activeTab.value === tab.id
  }))
)
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
        <div style="height: 40px; width: 100%" />

        <template v-if="template">
          <ProgramHero
            v-if="isOverviewTab"
            :template="template"
            :institution="instances[0]?.deliveringInstitution"
          />
          <!-- Every other tab gets a compact title bar: a 300px hero above the
               classroom on every visit is space the tab's own content needs. -->
          <div v-else class="flex items-center gap-3">
            <h1 class="text-2xl font-heading font-bold text-highlighted text-pretty">
              {{ template.title }}
            </h1>
            <UBadge
              :label="t(`program.badges.tier.${template.tier}`)"
              color="secondary"
              variant="soft"
              size="md"
            />
          </div>

          <!-- UNavigationMenu, not UTabs: UTabs' items take no `to`, so its
               triggers are buttons rather than links. These navigate via the
               router, which keeps the back button and shareable links working
               even though the content itself switches client-side. -->
          <UNavigationMenu
            :items="tabs"
            variant="link"
            highlight
            class="mt-8"
            :ui="{ list: 'flex-1 border-b border-default' }"
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
