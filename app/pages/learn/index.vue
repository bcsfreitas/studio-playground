<script setup lang="ts">
import { userName, streakDays, xpLabel, notificationCount, type PreviewState } from '~/composables/useHomeMockData'
import { learnPrograms, cohortTimingOf, type CohortTiming } from '~/composables/useLearnMockData'
import { programTemplates, hasAvailableCohort } from '~/composables/useProgramMockData'

definePageMeta({ layout: 'dashboard' })

// Joins catalog scheduling/enrollment state to the same programTemplates the
// cover page and program content read from, so title/description/image/
// difficulty/module count can never drift from what's actually inside.
const catalogPrograms = computed(() => learnPrograms.map(p => ({
  ...p,
  template: programTemplates.find(t => t.id === p.id)!
})))

const state = ref<PreviewState>('active')
const isActive = computed(() => state.value === 'active')

const search = ref('')

const timingFilter = ref<CohortTiming[]>([])
const timingItems: { value: CohortTiming, label: string }[] = [
  { value: 'in-progress', label: 'In Progress' },
  { value: 'starting-soon', label: 'Starting Soon' },
  { value: 'open-enrollment', label: 'Open Enrollment' }
]

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
  return new Date(a.cohortStart).getTime() - new Date(b.cohortStart).getTime()
}))

const filteredPrograms = computed(() => sortedPrograms.value.filter((p) => {
  if (!hasAvailableCohort(p.id)) return false
  if (search.value && !p.template.title.toLowerCase().includes(search.value.toLowerCase())) return false
  if (difficultyFilter.value.length && !difficultyFilter.value.includes(p.template.difficulty)) return false
  if (timingFilter.value.length && !timingFilter.value.includes(cohortTimingOf(p))) return false
  return true
}))

const previewStates: { id: PreviewState, label: string }[] = [
  { id: 'new', label: 'New learner' },
  { id: 'active', label: 'Active learner' },
  { id: 'guest', label: 'Guest' }
]
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 gap-0 overflow-x-auto' }">
    <template #body>
      <AppTopbar v-if="isActive" :xp-label="xpLabel" :streak-days="streakDays" :user-name="userName" :notification-count="notificationCount" />

      <UContainer>
        <div style="height: 40px; width: 100%" />

        <h1 class="text-6xl font-heading font-semibold text-highlighted text-pretty ">Learn</h1>
        <h2 class="text-lg text-dimmed mt-2">Browse programs, track what you're enrolled in, and find your next program.</h2>

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
            v-model="difficultyFilter"
            multiple
            value-key="value"
            icon="lucide:bar-chart-3"
            placeholder="Dificulty"
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

  <!-- Dev-only preview state switcher (not part of the product's real UI) -->
  <div
    class="fixed right-[18px] bottom-[18px] z-[200] flex items-center gap-1"
    style="background: rgba(2,6,24,0.92); border-radius: 100px; padding: 5px 6px 5px 14px; box-shadow: var(--shadow-menu)"
  >
    <span class="text-[10px] font-bold tracking-[0.08em] text-slate-400 mr-1.5">PREVIEW AS</span>
    <div
      v-for="p in previewStates"
      :key="p.id"
      class="px-3 py-1.5 rounded-full text-[12.5px] font-semibold cursor-pointer select-none transition-all duration-150"
      :class="state === p.id ? 'bg-white text-slate-900' : 'text-slate-300'"
      @click="state = p.id"
    >
      {{ p.label }}
    </div>
  </div>
</template>
