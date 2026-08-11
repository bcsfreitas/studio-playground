<script setup lang="ts">
import { userName, userAvatar, topbarStatsFor } from '~/composables/useHomeMockData'
import { useXpBalance } from '~/composables/useXpBalance'
import { usePreviewState } from '~/composables/usePreviewState'
import { learnProgramsFor, cohortTimingOf, type CohortTiming } from '~/composables/useLearnMockData'
import { programTemplates, hasAvailableCohort, type ProgramAudience } from '~/composables/useProgramMockData'

definePageMeta({ layout: 'dashboard' })

const { state, isLoggedIn, isOnboarded } = usePreviewState()

// Joins catalog scheduling/enrollment state to the same programTemplates the
// cover page and program content read from, so title/description/image/
// difficulty/module count can never drift from what's actually inside.
const catalogPrograms = computed(() => learnProgramsFor(state.value).map(p => ({
  ...p,
  template: programTemplates.find(t => t.id === p.id)!
})))

const { total: xpTotal } = useXpBalance()
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value, xpTotal.value))

const search = ref('')

const timingFilter = ref<CohortTiming[]>([])
const timingItems: { value: CohortTiming, label: string }[] = [
  { value: 'in-progress', label: 'In Progress' },
  { value: 'starting-soon', label: 'Starting Soon' },
  { value: 'open-enrollment', label: 'Open Enrollment' }
]

const audienceItems: { value: ProgramAudience, label: string }[] = [
  { value: 'learner', label: 'For learners' },
  { value: 'educator', label: 'For educators' }
]

// The one filter that lives in the URL: the sign-up flow lands here with
// `?audience=` to answer what brought the learner in, and a shared link should
// open the same catalog. `?audience=learner,educator` is accepted for symmetry
// with the multi-select, though no link generates it.
function audienceFromQuery(value: unknown): ProgramAudience[] {
  return String(value ?? '')
    .split(',')
    .filter((entry): entry is ProgramAudience => audienceItems.some(item => item.value === entry))
}

const route = useRoute()
const audienceFilter = ref<ProgramAudience[]>(audienceFromQuery(route.query.audience))

// `replace` rather than push: filtering is not a step to back out of one
// selection at a time.
watch(audienceFilter, (value) => {
  const { audience, ...rest } = route.query
  navigateTo({
    query: value.length ? { ...rest, audience: value.join(',') } : rest
  }, { replace: true })
})

// A link into the page while it is already open (the topbar's Learn entry, say)
// changes the query without remounting.
watch(() => route.query.audience, (value) => {
  const fromQuery = audienceFromQuery(value)
  if (fromQuery.join(',') !== audienceFilter.value.join(',')) audienceFilter.value = fromQuery
})

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
const difficultyFilter = ref<Difficulty[]>([])
const difficultyItems: { value: Difficulty, label: string }[] = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' }
]

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
  if (search.value && !p.template.title.toLowerCase().includes(search.value.toLowerCase())) return false
  if (audienceFilter.value.length && !audienceFilter.value.includes(p.template.audience)) return false
  if (difficultyFilter.value.length && !difficultyFilter.value.includes(p.template.difficulty)) return false
  if (timingFilter.value.length && !timingFilter.value.includes(cohortTimingOf(p))) return false
  return true
}))

</script>

<template>
  <!-- `sm:p-0`/`sm:gap-0` as well as the bare ones — see index.vue for why. -->
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <!-- Signed in, not just active: a new learner gets the same bar, with
           counters that start at zero. Guests get the same band too, carrying
           the sign-in pair instead of an account. -->
      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer class="mt-10">

        <PageTitle
          title="Learn"
          description="Browse programs, track what you're enrolled in, and find your next program."
          color="blue"
        />

        <div class="flex flex-wrap items-center gap-3 my-8">

          <USelectMenu
            v-model="timingFilter"
            multiple
            value-key="value"
            icon="lucide:calendar-clock"
            placeholder="Timing"
            :items="timingItems"
            size="lg"
            class="w-48"
          />

          <USelectMenu
            v-model="audienceFilter"
            multiple
            value-key="value"
            icon="lucide:users"
            placeholder="Audience"
            :items="audienceItems"
            size="lg"
            class="w-48"
          />

          <USelectMenu
            v-model="difficultyFilter"
            multiple
            value-key="value"
            icon="lucide:bar-chart-3"
            placeholder="Difficulty"
            :items="difficultyItems"
            size="lg"
            class="w-48"
          />

          <UInput
            v-model="search"
            icon="lucide:search"
            placeholder="Search programs..."
            size="lg"
            class="max-w-sm"
          />
        </div>

        <div v-if="filteredPrograms.length" class="grid grid-cols-3 gap-6 pb-16">
          <LearnProgramCard
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
          <Icon name="lucide:search-x" class="size-[22px] text-primary" />
          <div class="font-heading text-[15px] font-bold text-default">No programs match your filters</div>
          <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">
            Try a different search term or clear a filter to see more programs.
          </p>
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>

  <DevPreviewBar />
</template>
