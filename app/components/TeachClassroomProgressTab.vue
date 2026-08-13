<script setup lang="ts">
import type { MentorClassroom } from '~/composables/useProgramMockData'
import { avatarForName } from '~/composables/useProgramMockData'

// Prop-driven, not route-driven like ProgramTab*.vue's siblings: the selected
// classroom is local UI state (a sidebar pick), not a URL segment.
const props = defineProps<{
  classroom: MentorClassroom
}>()

const { t } = useI18n()

const averageCompletion = computed(() => {
  const learners = props.classroom.learners
  if (!learners.length) return 0
  return Math.round(learners.reduce((sum, learner) => sum + learner.completion, 0) / learners.length)
})
</script>

<template>
  <div class="mt-8">
    <SectionTitle :title="t('teach.hub.progress.title')" />

    <div class="mt-4 grid gap-4 sm:grid-cols-2">
      <UPageCard :title="t('teach.hub.progress.avgCompletion')" variant="subtle">
        <span class="font-heading text-3xl font-bold text-highlighted">{{ averageCompletion }}%</span>
      </UPageCard>
      <UPageCard
        v-if="classroom.maxLearners"
        :title="t('teach.hub.progress.seatsFilled')"
        variant="subtle"
      >
        <span class="font-heading text-3xl font-bold text-highlighted">
          {{ classroom.seatsTaken }}/{{ classroom.maxLearners }}
        </span>
      </UPageCard>
    </div>

    <div class="mt-6 flex flex-col gap-3">
      <div
        v-for="learner in classroom.learners"
        :key="learner.name"
        class="flex items-center gap-3"
      >
        <UAvatar :src="avatarForName(learner.name)" :alt="learner.name" size="sm" />
        <span class="w-40 truncate text-sm text-default">{{ learner.name }}</span>
        <UProgress :model-value="learner.completion" color="primary" class="flex-1" />
        <span class="w-10 shrink-0 text-right text-xs text-muted">{{ learner.completion }}%</span>
      </div>
    </div>
  </div>
</template>
