<script setup lang="ts">
import type { CohortTiming } from '~/composables/useLearnMockData'
import type { ProgramAudience, ProgramDifficulty } from '~/composables/useProgramMockData'

const props = defineProps<{
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

// Each item carries its own active-state look in `ui.label` (rather than a
// has-[data-state=checked] selector in the shared `ui` prop below) because
// `label` sits beside the radio input, not above it — :has() can't reach
// sideways to a sibling's checked state.
function itemUi(active: boolean) {
  return {
    label: active
      ? 'block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-highlighted shadow-sm bg-default transition-colors'
      : 'block w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-default/70 hover:text-highlighted'
  }
}

const timingOptions = computed(() => ([
  { value: 'all' as const, label: t('learn.filters.timingAll'), ui: itemUi(props.timing === 'all') },
  { value: 'in-progress' as const, label: 'In Progress', ui: itemUi(props.timing === 'in-progress') },
  { value: 'starting-soon' as const, label: 'Starting Soon', ui: itemUi(props.timing === 'starting-soon') },
  { value: 'open-enrollment' as const, label: 'Open Enrollment', ui: itemUi(props.timing === 'open-enrollment') }
]))

const audienceOptions = computed(() => ([
  { value: 'all' as const, label: t('learn.filters.audienceAll'), ui: itemUi(props.audience === 'all') },
  { value: 'learner' as const, label: 'For learners', ui: itemUi(props.audience === 'learner') },
  { value: 'educator' as const, label: 'For educators', ui: itemUi(props.audience === 'educator') }
]))

const difficultyOptions = computed(() => ([
  { value: 'all' as const, label: t('learn.filters.difficultyAll'), ui: itemUi(props.difficulty === 'all') },
  { value: 'Beginner' as const, label: 'Beginner', ui: itemUi(props.difficulty === 'Beginner') },
  { value: 'Intermediate' as const, label: 'Intermediate', ui: itemUi(props.difficulty === 'Intermediate') },
  { value: 'Advanced' as const, label: 'Advanced', ui: itemUi(props.difficulty === 'Advanced') }
]))

// Shared look for every group: no radio dot (indicator hidden — the active
// state reads entirely from itemUi above), legend styled as a small-caps
// label instead of the default bold heading.
const radioUi = {
  legend: 'mb-2 text-xs font-bold uppercase tracking-wide text-dimmed',
  fieldset: 'gap-1'
}
</script>

<template>
  <UCard as="aside" variant="subtle" class="rounded-[20px] lg:sticky lg:top-24" :ui="{ root: 'bg-elevated/55', body: 'flex flex-col gap-5 p-5' }">
    <URadioGroup
      :model-value="timing"
      :legend="t('learn.filters.timing')"
      indicator="hidden"
      :items="timingOptions"
      :ui="radioUi"
      @update:model-value="emit('update:timing', $event)"
    />

    <USeparator />

    <URadioGroup
      :model-value="audience"
      :legend="t('learn.filters.audience')"
      indicator="hidden"
      :items="audienceOptions"
      :ui="radioUi"
      @update:model-value="emit('update:audience', $event)"
    />

    <USeparator />

    <URadioGroup
      :model-value="difficulty"
      :legend="t('learn.filters.difficulty')"
      indicator="hidden"
      :items="difficultyOptions"
      :ui="radioUi"
      @update:model-value="emit('update:difficulty', $event)"
    />
  </UCard>
</template>
