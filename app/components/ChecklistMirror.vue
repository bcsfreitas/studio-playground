<script setup lang="ts">
import { useOnboardingChecklist, type OnboardingFlowId } from '~/composables/useOnboardingChecklist'

const props = defineProps<{
  flowId: OnboardingFlowId
  contextId: string
  /** What to call the enrollment in the mirror line — a program or game title. */
  context: string
  to: string
}>()

const { t } = useI18n()
const { completedCount, totalCount, isComplete, nextItem } = useOnboardingChecklist(props.flowId, props.contextId)
</script>

<template>
  <UPageCard
    v-if="!isComplete && nextItem"
    :to="to"
    variant="outline"
    class="cursor-pointer transition-shadow duration-250 hover:shadow-xl rounded-2xl"
  >
    <div class="flex items-center gap-3">
      <div class="size-9 rounded-full bg-primary-50 text-primary flex items-center justify-center shrink-0">
        <Icon name="lucide:list-checks" class="size-4" />
      </div>
      <p class="text-sm text-default">
        {{ t('onboarding.checklist.mirror', { context, completed: completedCount, total: totalCount, next: nextItem.label }) }}
      </p>
      <Icon name="lucide:chevron-right" class="size-4 text-dimmed ml-auto shrink-0" />
    </div>
  </UPageCard>
</template>
