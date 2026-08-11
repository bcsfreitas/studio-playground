<script setup lang="ts">
import type { ProgramTemplate } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'
import { useProgramProgress } from '~/composables/useProgramProgress'
import { useProgramTabs } from '~/composables/useProgramTabs'

const props = withDefaults(defineProps<{
  template: ProgramTemplate
  // The classroom already shows which module and lesson you're on, and the
  // lesson is open right beside this card — so there it renders as progress
  // only, without the "where you are" block or the jump-to-lesson button.
  showCurrentLesson?: boolean
}>(), {
  showCurrentLesson: true
})

const { t } = useI18n()

const progress = useProgramProgress(props.template)
const items = flattenCurriculum(props.template)

// The current lesson is the first one not yet finished. When everything is
// done there is no "next", which is what drives the completed state below.
const currentItem = computed(() => items.find(item => !progress.isCompleted(item.id)))

const isComplete = computed(() => !currentItem.value && items.length > 0)

// Tabs are front-end state, so this asks the shell to switch rather than
// navigating. The lesson id still goes through the route, which is where the
// classroom reads it from.
const { setTab, openLesson } = useProgramTabs()

function goToCurrentLesson() {
  if (currentItem.value) openLesson(currentItem.value.id)
  else setTab('classroom')
}
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

    <template v-if="currentItem && showCurrentLesson">
      <USeparator class="mt-4" />

      <div class="mt-4">
        <div class="text-xs text-dimmed">{{ t('program.home.upNext') }}</div>
        <div class="font-heading font-bold text-sm text-highlighted mt-0.5 break-words">
          {{ t('program.home.currentStep', { module: currentItem.moduleTitle, step: currentItem.title }) }}
        </div>
      </div>

      <UButton
        :label="t('program.home.continue')"
        icon="lucide:play"
        color="primary"
        block
        class="mt-4"
        @click="goToCurrentLesson"
      />
    </template>

    <template v-else-if="isComplete">
      <p class="text-sm text-muted mt-4">{{ t('program.home.completedBody') }}</p>
      <UButton
        v-if="showCurrentLesson"
        :label="t('program.home.reviewClassroom')"
        icon="lucide:book-open"
        color="neutral"
        variant="outline"
        block
        class="mt-4"
        @click="goToCurrentLesson"
      />
    </template>
  </UPageCard>
</template>
