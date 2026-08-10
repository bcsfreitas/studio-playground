<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'
import { cohortTimingOf, formatCohortRange, type LearnProgram } from '~/composables/useLearnMockData'
import type { ProgramTemplate } from '~/composables/useProgramMockData'

const props = defineProps<{
  program: LearnProgram & { template: ProgramTemplate }
}>()

const TIMING_LABEL: Record<string, string> = {
  'starting-soon': 'Starting Soon',
  'open-enrollment': 'Open Enrollment'
}

const TIMING_COLOR: Record<string, BadgeProps['color']> = {
  'starting-soon': 'warning',
  'open-enrollment': 'neutral'
}

const timing = computed(() => cohortTimingOf(props.program))

// A program with no cohort has no range to print — what a learner needs to know
// is that there's nothing to wait for.
const scheduleLabel = computed(() => props.program.cohortStart && props.program.cohortEnd
  ? formatCohortRange(props.program.cohortStart, props.program.cohortEnd)
  : 'Self-paced')
</script>

<template>
  <UPageCard
    :to="`/learn/${program.id}`"
    :title="program.template.title"
    :description="program.template.description"
    reverse
    variant="outline"
    class="cursor-pointer transition-shadow duration-250 hover:shadow-xl rounded-2xl"
    :ui="{ title: 'font-bold line-clamp-2', description: 'line-clamp-2' }"
  >
    <img
      :src="program.template.image"
      alt=""
      class="w-full h-56 object-cover bg-slate-100 rounded-2xl"
    >

    <template #footer>
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <UBadge :label="program.template.difficulty" color="neutral" size="md" variant="soft" />
          <span class="inline-flex items-center gap-1.5 text-xs text-dimmed">
            <UIcon name="lucide:layers" class="size-4" />
            {{ program.template.curriculum.length }} Modules
          </span>
        </div>

        <USeparator />

        <div v-if="program.enrolled" class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <UProgress :model-value="program.progress" color="primary" />
            <span class="text-xs text-default">{{ program.progress }}%</span>
          </div>
        </div>

        <div v-else class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <UBadge :label="scheduleLabel" color="neutral" variant="outline" size="sm" />
            <UBadge :label="TIMING_LABEL[timing]" :color="TIMING_COLOR[timing]" variant="soft" size="sm" />
          </div>
        </div>
      </div>
    </template>
  </UPageCard>
</template>
