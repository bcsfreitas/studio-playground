<script setup lang="ts">
import type { ProgramTemplate } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'
import { useProgramProgress } from '~/composables/useProgramProgress'

const props = defineProps<{
  template: ProgramTemplate
}>()

const { t } = useI18n()

const progress = useProgramProgress(props.template)
const items = flattenCurriculum(props.template)

// The current lesson is the first one not yet finished. When everything is
// done there is no "next", which is what drives the completed state below.
const currentItem = computed(() => items.find(item => !progress.isCompleted(item.id)))

const isComplete = computed(() => !currentItem.value && items.length > 0)

const currentModuleNumber = computed(() => {
  if (!currentItem.value) return 0
  return props.template.curriculum.findIndex(mod => mod.id === currentItem.value!.moduleId) + 1
})

const currentLessonNumber = computed(() => {
  if (!currentItem.value) return 0
  return items.indexOf(currentItem.value) + 1
})

const ctaTo = computed(() => {
  const base = `/learn/${props.template.id}?tab=classroom`
  return currentItem.value ? `${base}&item=${currentItem.value.id}` : base
})
</script>

<template>
  <UPageCard
    variant="soft"
    :class="isComplete ? 'ring-2 ring-success' : ''"
  >
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-xs font-semibold text-dimmed uppercase tracking-wide">
        {{ t('program.home.yourProgress') }}
      </h3>
      <UBadge
        v-if="isComplete"
        :label="t('program.home.completed')"
        color="success"
        variant="soft"
        size="sm"
        icon="lucide:party-popper"
      />
    </div>

    <div class="mt-3">
      <div class="flex items-baseline justify-between gap-2">
        <span class="text-2xl font-heading font-bold text-highlighted tabular-nums">
          {{ progress.progressPercent.value }}%
        </span>
        <span class="text-xs text-muted tabular-nums">
          {{ t('program.home.xpEarned', {
            earned: progress.totalXpEarned.value,
            available: progress.totalXpAvailable.value
          }) }}
        </span>
      </div>
      <UProgress
        :model-value="progress.progressPercent.value"
        :color="isComplete ? 'success' : 'primary'"
        class="mt-2"
      />
    </div>

    <template v-if="currentItem">
      <USeparator class="mt-4" />

      <div class="mt-4">
        <div class="text-xs text-dimmed">
          {{ t('program.home.moduleLabel', {
            number: currentModuleNumber,
            total: template.curriculum.length
          }) }}
        </div>
        <div class="font-heading font-bold text-sm text-primary-600 mt-0.5">
          {{ currentItem.moduleTitle }}
        </div>

        <div class="mt-3 text-xs text-dimmed">
          {{ t('program.home.lessonLabel', { number: currentLessonNumber, total: items.length }) }}
        </div>
        <div class="text-sm text-highlighted mt-0.5">{{ currentItem.title }}</div>
      </div>

      <UButton
        :label="t('program.home.continue')"
        icon="lucide:play"
        color="primary"
        block
        class="mt-4"
        :to="ctaTo"
      />
    </template>

    <template v-else-if="isComplete">
      <p class="text-sm text-muted mt-4">{{ t('program.home.completedBody') }}</p>
      <UButton
        :label="t('program.home.reviewClassroom')"
        icon="lucide:book-open"
        color="neutral"
        variant="outline"
        block
        class="mt-4"
        :to="ctaTo"
      />
    </template>
  </UPageCard>
</template>
