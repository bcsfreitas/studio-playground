<script setup lang="ts">
import { userName, userAvatar, topbarStatsFor } from '~/composables/useHomeMockData'
import { useXpBalance } from '~/composables/useXpBalance'
import { usePreviewState } from '~/composables/usePreviewState'
import { learnProgramsFor, cohortTimingOf, type CohortTiming } from '~/composables/useLearnMockData'
import { programTemplates, hasAvailableCohort, type ProgramAudience, type ProgramDifficulty } from '~/composables/useProgramMockData'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
const { state, isLoggedIn, isOnboarded } = usePreviewState()

// Joins catalog scheduling/enrollment state to the same programTemplates the
// cover page and program content read from, so title/description/image/
// difficulty/module count can never drift from what's actually inside.
const catalogPrograms = computed(() => learnProgramsFor(state.value).map(p => ({
  ...p,
  template: programTemplates.find(template => template.id === p.id)!
})))

const { total: xpTotal } = useXpBalance()
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value, xpTotal.value))

const timingFilter = ref<CohortTiming | 'all'>('all')
const difficultyFilter = ref<ProgramDifficulty | 'all'>('all')

const AUDIENCE_VALUES: ProgramAudience[] = ['learner', 'educator']

// The one filter that lives in the URL: the sign-up flow lands here with
// `?audience=` to answer what brought the learner in, and a shared link should
// open the same catalog.
function audienceFromQuery(value: unknown): ProgramAudience | 'all' {
  const candidate = String(value ?? '')
  return AUDIENCE_VALUES.includes(candidate as ProgramAudience) ? (candidate as ProgramAudience) : 'all'
}

const route = useRoute()
const audienceFilter = ref<ProgramAudience | 'all'>(audienceFromQuery(route.query.audience))

// `replace` rather than push: filtering is not a step to back out of one
// selection at a time.
watch(audienceFilter, (value) => {
  const { audience, ...rest } = route.query
  navigateTo({
    query: value === 'all' ? rest : { ...rest, audience: value }
  }, { replace: true })
})

// A link into the page while it is already open (the topbar's Learn entry, say)
// changes the query without remounting.
watch(() => route.query.audience, (value) => {
  const fromQuery = audienceFromQuery(value)
  if (fromQuery !== audienceFilter.value) audienceFilter.value = fromQuery
})

const sortedPrograms = computed(() => [...catalogPrograms.value].sort((a, b) => {
  if (a.enrolled !== b.enrolled) return a.enrolled ? -1 : 1
  if (a.enrolled) return (b.progress ?? 0) - (a.progress ?? 0)
  // Cohortless programs have no start date to sort on, so they sit after the
  // dated runs rather than at the epoch.
  const startOf = (p: typeof a) => p.cohortStart ? new Date(p.cohortStart).getTime() : Infinity
  return startOf(a) - startOf(b)
}))

const filteredPrograms = computed(() => sortedPrograms.value.filter((p) => {
  if (!hasAvailableCohort(p.id)) return false
  if (audienceFilter.value !== 'all' && p.template.audience !== audienceFilter.value) return false
  if (difficultyFilter.value !== 'all' && p.template.difficulty !== difficultyFilter.value) return false
  if (timingFilter.value !== 'all' && cohortTimingOf(p) !== timingFilter.value) return false
  return true
}))

</script>

<template>
  <!-- `sm:p-0`/`sm:gap-0` as well as the bare ones — see index.vue for why. -->
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <div class="absolute z-[-1] rounded-full bg-blue-500 blur-[220px] size-72 sm:size-80 transform left-2/3 -translate-x-1/2 -translate-y-80"></div>
      <div class="absolute z-[-1] inset-x-0 top-0 h-[420px] overflow-hidden pointer-events-none">
        <StarsBackground color="var(--color-blue-500)" />
      </div>
      <!-- Signed in, not just active: a new learner gets the same bar, with
           counters that start at zero. Guests get the same band too, carrying
           the sign-in pair instead of an account. -->
      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer class="mt-10">

        <section class="pt-2">
          <UBadge
            :label="t('learn.hero.eyebrow')"
            color="blue"
            variant="soft"
            size="md"
            class="uppercase tracking-wide"
          />
          <h1 class="mt-3 max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl text-blue-950">
            {{ t('learn.hero.title') }}
          </h1>
          <p class="mt-4 max-w-2xl text-lg font-light leading-relaxed text-muted">
            {{ t('learn.hero.subtitle') }}
          </p>
        </section>

        <div class="mt-12 grid gap-8 pb-16 lg:grid-cols-[270px_minmax(0,1fr)] lg:items-start">
          <LearnFilterSidebar
            v-model:timing="timingFilter"
            v-model:audience="audienceFilter"
            v-model:difficulty="difficultyFilter"
          />

          <div class="min-w-0">
            <p class="text-xs font-bold uppercase tracking-wide text-blue-900">{{ t('learn.list.eyebrow') }}</p>
            <h2 class="mt-1 font-heading text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
              {{ t('learn.list.count', filteredPrograms.length) }}
            </h2>

            <div v-if="filteredPrograms.length" class="mt-7 grid gap-6">
              <LearnProgramRow
                v-for="p in filteredPrograms"
                :key="p.id"
                :program="p"
              />
            </div>

            <div
              v-else
              class="border-[1.5px] border-dashed border-slate-300 flex flex-col items-center gap-2 text-center rounded-2xl mb-16"
              style="padding: 32px 24px"
            >
              <Icon name="lucide:search-x" class="size-[22px] text-blue-900" />
              <div class="font-heading text-[15px] font-bold text-default">No programs match your filters</div>
              <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">
                Clear a filter to see more programs.
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>

  <DevPreviewBar />
</template>
