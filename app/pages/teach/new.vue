<script setup lang="ts">
import type { MentorClassroomAgeRange } from '~/composables/useProgramMockData'
import { programTemplates } from '~/composables/useProgramMockData'
import { useMentorClassrooms } from '~/composables/useMentorClassrooms'

definePageMeta({ layout: false })

const { t } = useI18n()
const route = useRoute()
const { createClassroom } = useMentorClassrooms()

type Step = 'course' | 'settings' | 'processing' | 'success'

// A mentor arriving straight from a program page's "Create your own cohort"
// flow (MentorQualificationDrawer.vue) already picked their course — start
// on settings with it pre-selected instead of making them pick it again.
// Validated against the same rule StepChooseCourse.vue's list uses, so a
// stale/bogus query value just falls back to the normal step-1 start.
function initialSelection(): { step: Step, templateId: string | null } {
  const programId = route.query.programId
  if (typeof programId === 'string') {
    const template = programTemplates.find(t => t.id === programId && t.audience !== 'educator')
    if (template) return { step: 'settings', templateId: template.id }
  }
  return { step: 'course', templateId: null }
}

const initial = initialSelection()
const step = ref<Step>(initial.step)

const STEP_ORDER = ['course', 'settings'] as const
const progressIndex = computed(() => (step.value === 'course' ? 0 : 1)) // settings, processing, success
const progressPercent = computed(() => Math.round(((progressIndex.value + 1) / STEP_ORDER.length) * 100))

const selectedTemplateId = ref<string | null>(initial.templateId)
const selectedTemplate = computed(() => programTemplates.find(t => t.id === selectedTemplateId.value))
const classroomName = ref('')
const ageRange = ref<MentorClassroomAgeRange | null>(null)
const consentChecked = ref(false)
const siloed = ref(false)

function onBack() {
  if (step.value === 'course') navigateTo('/teach')
  else if (step.value === 'settings') step.value = 'course'
}

// Deliberately longer than useMockAuth's 900ms and shorter than
// OnboardingIntentPrompt's 5000ms — same tuning rationale as
// MentorQualificationDrawer.vue's processing beat.
const PROCESSING_MS = 2000
// Long enough to register as a real confirmation, short enough that the
// spec's "no user action needed" auto-advance doesn't feel like a stall.
const SUCCESS_DISPLAY_MS = 1200

function onCreate() {
  if (!classroomName.value.trim() || !ageRange.value || !consentChecked.value || !selectedTemplateId.value) return
  step.value = 'processing'
  setTimeout(() => {
    createClassroom({
      name: classroomName.value.trim(),
      programId: selectedTemplateId.value!,
      ageRange: ageRange.value!,
      siloed: siloed.value
    })
    step.value = 'success'
    setTimeout(() => {
      navigateTo('/teach')
    }, SUCCESS_DISPLAY_MS)
  }, PROCESSING_MS)
}
</script>

<template>
  <div class="min-h-dvh flex flex-col bg-default">
    <div class="shrink-0 flex items-center gap-4 px-6 py-4">
      <UButton
        v-if="step === 'course' || step === 'settings'"
        icon="lucide:arrow-left"
        color="neutral"
        variant="ghost"
        :aria-label="t('teach.new.wizard.back')"
        @click="onBack"
      />
      <UProgress :model-value="progressPercent" color="primary" class="flex-1" />
    </div>

    <div class="flex-1 flex flex-col overflow-y-auto px-6 pb-10">
      <TeachNewClassroomStepChooseCourse
        v-if="step === 'course'"
        v-model="selectedTemplateId"
        @next="step = 'settings'"
      />

      <TeachNewClassroomStepSettings
        v-else-if="step === 'settings'"
        :course-title="selectedTemplate?.title"
        v-model:name="classroomName"
        v-model:age-range="ageRange"
        v-model:consent="consentChecked"
        v-model:siloed="siloed"
        @submit="onCreate"
      />

      <div v-else-if="step === 'processing'" class="max-w-lg mx-auto flex flex-col items-center text-center gap-3 py-24">
        <UIcon name="lucide:loader-circle" class="size-8 text-primary animate-spin" />
        <div class="font-heading font-bold text-lg text-highlighted">{{ t('teach.new.wizard.processing.title') }}</div>
        <p class="text-sm text-muted">{{ t('teach.new.wizard.processing.body') }}</p>
      </div>

      <div v-else-if="step === 'success'" class="max-w-lg mx-auto flex flex-col items-center text-center gap-3 py-24">
        <UIcon name="lucide:check-circle-2" class="size-10 text-success" />
        <div class="font-heading font-bold text-lg text-highlighted">{{ t('teach.new.wizard.success.title') }}</div>
      </div>
    </div>
  </div>
</template>
