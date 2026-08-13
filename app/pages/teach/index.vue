<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { userName, userAvatar, topbarStatsFor } from '~/composables/useHomeMockData'
import { useXpBalance } from '~/composables/useXpBalance'
import { usePreviewState } from '~/composables/usePreviewState'
import type { MentorClassroom } from '~/composables/useProgramMockData'
import { useMentorClassrooms } from '~/composables/useMentorClassrooms'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
const { state, isLoggedIn, isOnboarded } = usePreviewState()
const { total: xpTotal } = useXpBalance()
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value, xpTotal.value))

const { classroomsFor } = useMentorClassrooms()
const classrooms = computed(() => classroomsFor(state.value))

const selectedClassroomId = ref(classrooms.value[0]?.id ?? '')

// A preview-state switch in the dev bar can make the current selection
// disappear (e.g. flipping to Fresh Account empties the list) — fall back to
// the new first item rather than pointing at a classroom no longer listed.
watch(classrooms, (list) => {
  if (!list.some(c => c.id === selectedClassroomId.value)) {
    selectedClassroomId.value = list[0]?.id ?? ''
  }
})

const selectedClassroom = computed<MentorClassroom | undefined>(() =>
  classrooms.value.find(c => c.id === selectedClassroomId.value)
)

const TAB_COMPONENTS = {
  progress: defineAsyncComponent(() => import('~/components/TeachClassroomProgressTab.vue')),
  settings: defineAsyncComponent(() => import('~/components/TeachClassroomSettingsTab.vue'))
} as const
type TabId = keyof typeof TAB_COMPONENTS

// Plain ref, not URL-driven — same reasoning as learn/[programId].vue:
// switching tabs (or classrooms) must not touch browser history.
const activeTab = ref<TabId>('progress')

const tabItems = computed<TabsItem[]>(() => [
  { label: t('teach.hub.tabs.progress'), value: 'progress' },
  { label: t('teach.hub.tabs.settings'), value: 'settings' }
])
</script>

<template>
  <UDashboardPanel :ui="{ body: 'relative p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <div class="absolute z-[-1] rounded-full bg-cornflower-500 blur-[220px] size-72 sm:size-80 transform left-2/3 -translate-x-1/2 -translate-y-80"></div>
      <div class="absolute z-[-1] inset-x-0 top-0 h-[420px] overflow-hidden pointer-events-none">
        <StarsBackground color="var(--color-cornflower-500)" />
      </div>

      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer class="mt-10">
        <section class="pt-2">
          <UBadge
            :label="t('teach.hub.hero.eyebrow')"
            color="secondary"
            variant="soft"
            size="md"
            class="uppercase tracking-wide"
          />
          <h1 class="mt-3 max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl text-highlighted">
            {{ t('teach.hub.hero.title') }}
          </h1>
          <p class="mt-4 max-w-2xl text-lg font-light leading-relaxed text-muted">
            {{ t('teach.hub.hero.subtitle') }}
          </p>
        </section>

        <div class="mt-12 grid gap-8 pb-16 lg:grid-cols-[270px_minmax(0,1fr)] lg:items-start">
          <TeachClassroomList v-model="selectedClassroomId" :classrooms="classrooms" />

          <UPageCard variant="outline" class="min-w-0">
            <div v-if="selectedClassroom" class="mx-auto w-full max-w-2xl">
              <template v-if="selectedClassroom.learners.length === 0">
                <TeachClassroomWelcomeChecklist :classroom="selectedClassroom" :key="selectedClassroom.id" />
              </template>
              <template v-else>
                <UTabs
                  :items="tabItems"
                  color="primary"
                  variant="pill"
                  size="xl"
                  :content="false"
                  class="mt-8"
                  :ui="{ root: 'items-start', list: 'w-fit', trigger: 'grow-0' }"
                  v-model="activeTab"
                />
                <component
                  :is="TAB_COMPONENTS[activeTab]"
                  :classroom="selectedClassroom"
                  :key="selectedClassroom.id"
                />
              </template>
            </div>

            <div v-else class="flex flex-col items-center gap-2 text-center py-10">
              <Icon name="lucide:graduation-cap" class="size-[22px] text-primary" />
              <div class="font-heading text-[15px] font-bold text-default">{{ t('teach.hub.empty.title') }}</div>
              <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">{{ t('teach.hub.empty.body') }}</p>
              <UButton :label="t('teach.hub.empty.cta')" to="/teach/new" color="primary" class="mt-2" />
            </div>
          </UPageCard>
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>

  <DevPreviewBar />
</template>
