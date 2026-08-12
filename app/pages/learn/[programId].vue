<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { programTemplates, programInstances } from '~/composables/useProgramMockData'
import { usePreviewState } from '~/composables/usePreviewState'
import { useProgramEnrollment } from '~/composables/useProgramEnrollment'
import { provideProgramTabs } from '~/composables/useProgramTabs'
import { userName, userAvatar, topbarStatsFor } from '~/composables/useHomeMockData'
import { useXpBalance } from '~/composables/useXpBalance'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { t } = useI18n()

const programId = computed(() => route.params.programId as string)
const template = computed(() => programTemplates.find(p => p.id === programId.value))

// Educator Training has zero instances by design (facilitator-facing, no open
// learner enrollment), so the page must render off the template alone —
// gating on an instance too would 404 a program that exists.
const instances = computed(() => programInstances.filter(i => i.programId === programId.value))

// The preview state picks the enrollment set; this program's id picks the
// record out of it. A new learner is in Core: Threadbare and nothing else, so
// the classroom opens there and the pitch stays up on every other program.
const { isLoggedIn, isOnboarded } = usePreviewState()
const { isEnrolled } = useProgramEnrollment()

// Counters are earned across the platform rather than in this program, so they
// follow the state, not this page's enrollment — a new learner enrolled here
// still has nothing banked.
const { total: xpTotal } = useXpBalance()
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value, xpTotal.value))

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

// Plain component state, not a route param: switching a tab leaves the URL and
// history alone. The query only speaks on arrival, and only for a link that
// means a particular place:
//
// `?item=` names a lesson, and a lesson only exists in the classroom — the home
// page's "Resume learning" arrives that way. `?tab=` names a tab outright,
// which is how a guest sent to sign up from the Community tab gets back to it.
// Both are checked against the tabs this learner actually has.
function initialTab(): TabId {
  const canOpen = (id: string) => visibleTabs.value.some(tab => tab.id === id)
  if (route.query.item && canOpen('classroom')) return 'classroom'
  const wantedTab = route.query.tab
  if (typeof wantedTab === 'string' && canOpen(wantedTab)) return wantedTab as TabId
  return visibleTabs.value[0]!.id
}

const activeTab = ref<TabId>(initialTab())

// Changing phase changes which tabs exist, and can pull the open one out from
// under the learner — fall back rather than rendering a tab that is no longer
// listed.
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
  <!-- `sm:p-0`/`sm:gap-0` as well as the bare ones — see index.vue for why. -->
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <!-- <div class="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_85%_12%,rgba(255,107,0,0.12),transparent_30%),radial-gradient(circle_at_15%_28%,rgba(120,87,228,0.09),transparent_28%)]"></div> -->
      <!-- Signed in, not just enrolled: a new learner gets the same bar, with
           counters that start at zero. Guests get the same band too, carrying
           the sign-in pair instead of an account. -->
      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer>
        <template v-if="template">
          <!-- The title is the page header and stays across tab switches. The
               program image and description belong to the Overview tab, which
               renders them itself. -->
          <h1 class="text-6xl font-heading font-bold text-highlighted text-pretty mt-10">
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

  <DevPreviewBar />
</template>
