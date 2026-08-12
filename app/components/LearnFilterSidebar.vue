<script setup lang="ts">
import type { CohortTiming } from '~/composables/useLearnMockData'
import type { ProgramAudience, ProgramDifficulty } from '~/composables/useProgramMockData'

defineProps<{
  timing: CohortTiming | 'all'
  audience: ProgramAudience | 'all'
  difficulty: ProgramDifficulty | 'all'
}>()

const emit = defineEmits<{
  'update:timing': [value: CohortTiming | 'all']
  'update:audience': [value: ProgramAudience | 'all']
  'update:difficulty': [value: ProgramDifficulty | 'all']
}>()

const { t } = useI18n()

const timingOptions: { value: CohortTiming | 'all', label: string }[] = [
  { value: 'all', label: t('learn.filters.timingAll') },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'starting-soon', label: 'Starting Soon' },
  { value: 'open-enrollment', label: 'Open Enrollment' }
]

const audienceOptions: { value: ProgramAudience | 'all', label: string }[] = [
  { value: 'all', label: t('learn.filters.audienceAll') },
  { value: 'learner', label: 'For learners' },
  { value: 'educator', label: 'For educators' }
]

const difficultyOptions: { value: ProgramDifficulty | 'all', label: string }[] = [
  { value: 'all', label: t('learn.filters.difficultyAll') },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' }
]

// Active vs. inactive toggle-button treatment, shared by every fieldset below.
function toggleClass(active: boolean) {
  return active
    ? 'bg-white font-semibold text-highlighted shadow-sm'
    : 'text-muted hover:bg-white/70 hover:text-highlighted'
}
</script>

<template>
  <aside class="rounded-[20px] border border-default bg-elevated/55 p-5 lg:sticky lg:top-24">
    <fieldset>
      <legend class="text-xs font-bold uppercase tracking-wide text-dimmed">{{ t('learn.filters.timing') }}</legend>
      <div class="mt-2 grid gap-1">
        <button
          v-for="item in timingOptions"
          :key="item.value"
          type="button"
          :aria-pressed="timing === item.value"
          class="rounded-lg px-3 py-2 text-left text-sm transition-colors"
          :class="toggleClass(timing === item.value)"
          @click="emit('update:timing', item.value)"
        >{{ item.label }}</button>
      </div>
    </fieldset>

    <fieldset class="mt-5 border-t border-default pt-5">
      <legend class="text-xs font-bold uppercase tracking-wide text-dimmed">{{ t('learn.filters.audience') }}</legend>
      <div class="mt-2 grid gap-1">
        <button
          v-for="item in audienceOptions"
          :key="item.value"
          type="button"
          :aria-pressed="audience === item.value"
          class="rounded-lg px-3 py-2 text-left text-sm transition-colors"
          :class="toggleClass(audience === item.value)"
          @click="emit('update:audience', item.value)"
        >{{ item.label }}</button>
      </div>
    </fieldset>

    <fieldset class="mt-5 border-t border-default pt-5">
      <legend class="text-xs font-bold uppercase tracking-wide text-dimmed">{{ t('learn.filters.difficulty') }}</legend>
      <div class="mt-2 grid gap-1">
        <button
          v-for="item in difficultyOptions"
          :key="item.value"
          type="button"
          :aria-pressed="difficulty === item.value"
          class="rounded-lg px-3 py-2 text-left text-sm transition-colors"
          :class="toggleClass(difficulty === item.value)"
          @click="emit('update:difficulty', item.value)"
        >{{ item.label }}</button>
      </div>
    </fieldset>
  </aside>
</template>
