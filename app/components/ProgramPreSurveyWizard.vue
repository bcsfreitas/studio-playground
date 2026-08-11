<script setup lang="ts">
import type { PreSurveyQuestion } from '~/composables/useProgramMockData'

const props = defineProps<{
  questions: PreSurveyQuestion[]
}>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  complete: []
  exit: []
}>()

const { t } = useI18n()

// In-memory only — there's no backend to submit answers to yet (see the
// plan's "Known limitations"), so only completion state persists, via the
// caller's own progress.markComplete() after the `complete` event. Exiting
// or refreshing loses whatever was filled in, by design for this pass.
const currentIndex = ref(0)
const answers = ref<Record<string, string | number>>({})

watch(open, (isOpen) => {
  if (!isOpen) return
  currentIndex.value = 0
  answers.value = {}
})

const currentQuestion = computed<PreSurveyQuestion | undefined>(() => props.questions[currentIndex.value])
const isLastQuestion = computed(() => currentIndex.value === props.questions.length - 1)
const progressPercent = computed(() =>
  props.questions.length === 0 ? 0 : Math.round(((currentIndex.value + 1) / props.questions.length) * 100)
)

const scaleValues = computed(() => {
  const q = currentQuestion.value
  if (!q || q.type !== 'scale') return []
  const min = q.scaleMin ?? 1
  const max = q.scaleMax ?? 10
  return Array.from({ length: max - min + 1 }, (_, i) => min + i)
})

// A getter/setter computed keyed off the current question, rather than
// binding UInput's v-model straight to `answers[currentQuestion.id]` —
// that expression's type is `string | number | undefined`, which UInput's
// v-model (string) doesn't accept, and this also gives text fields a clean
// empty default instead of `undefined` on first render.
const textAnswer = computed<string>({
  get: () => {
    const q = currentQuestion.value
    if (!q) return ''
    const value = answers.value[q.id]
    return typeof value === 'string' ? value : ''
  },
  set: (value) => {
    const q = currentQuestion.value
    if (q) answers.value[q.id] = value
  }
})

// A select question's "Other" option (e.g. country) needs its own answer
// slot alongside the picked option itself, not instead of it — the option
// stays "Other" so `selectOption` below doesn't need special-casing, and
// this key just carries what the learner typed to specify it.
function otherKey(id: string) {
  return `${id}__other`
}

const otherAnswer = computed<string>({
  get: () => {
    const q = currentQuestion.value
    if (!q) return ''
    const value = answers.value[otherKey(q.id)]
    return typeof value === 'string' ? value : ''
  },
  set: (value) => {
    const q = currentQuestion.value
    if (q) answers.value[otherKey(q.id)] = value
  }
})

function selectOption(option: string) {
  const q = currentQuestion.value
  if (q) answers.value[q.id] = option
}

function selectScale(value: number) {
  const q = currentQuestion.value
  if (q) answers.value[q.id] = value
}

const canAdvance = computed(() => {
  const q = currentQuestion.value
  if (!q) return false
  if (q.required === false) return true
  const value = answers.value[q.id]
  if (q.type === 'text') return typeof value === 'string' && value.trim().length > 0
  if (value === undefined) return false
  if (q.type === 'select' && q.otherOption && value === q.otherOption) {
    const other = answers.value[otherKey(q.id)]
    return typeof other === 'string' && other.trim().length > 0
  }
  return true
})

function back() {
  if (currentIndex.value > 0) currentIndex.value--
}

function advance() {
  if (!canAdvance.value) return
  if (isLastQuestion.value) {
    emit('complete')
    return
  }
  currentIndex.value++
}
</script>

<template>
  <!-- Teleported to <body> rather than living inside the dashboard layout:
       UDashboardGroup is `fixed inset-0 overflow-hidden`, so a `fixed
       inset-0` panel nested inside it would still be clipped to that shell
       instead of covering the sidebar/topbar too. `z-[260]` is one above
       ProgramStepDrawer's `z-[250]` (itself above DevPreviewBar's
       `z-[200]`), keeping this app's existing stacking convention rather
       than inventing a new one. -->
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[260] bg-default flex flex-col overflow-hidden">
      <div class="shrink-0 flex items-center gap-4 px-6 py-4">
        <UProgress :model-value="progressPercent" color="primary" class="flex-1" />
        <span class="text-xs text-muted tabular-nums shrink-0">{{ currentIndex + 1 }} / {{ questions.length }}</span>
        <UButton
          icon="lucide:x"
          color="neutral"
          variant="ghost"
          :aria-label="t('program.preSurvey.wizard.exit')"
          @click="emit('exit')"
        />
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto flex items-center justify-center px-6 py-10">
        <div v-if="currentQuestion" class="w-full max-w-2xl flex flex-col gap-6">
          <div>
            <div class="text-xs font-heading font-bold uppercase tracking-wide text-primary">
              {{ t(`program.preSurvey.wizard.sections.${currentQuestion.section}`) }}
            </div>
            <h2 class="mt-2 font-heading font-bold text-2xl text-highlighted text-pretty">
              {{ currentQuestion.prompt }}
            </h2>
          </div>

          <UInput
            v-if="currentQuestion.type === 'text'"
            v-model="textAnswer"
            size="xl"
            :placeholder="t('program.preSurvey.wizard.textPlaceholder')"
          />

          <div v-else-if="currentQuestion.type === 'select'" class="flex flex-col gap-2">
            <UButton
              v-for="option in currentQuestion.options"
              :key="option"
              :label="option"
              block
              size="lg"
              :color="answers[currentQuestion.id] === option ? 'primary' : 'neutral'"
              :variant="answers[currentQuestion.id] === option ? 'solid' : 'outline'"
              class="justify-start"
              @click="selectOption(option)"
            />
            <UInput
              v-if="currentQuestion.otherOption && answers[currentQuestion.id] === currentQuestion.otherOption"
              v-model="otherAnswer"
              size="xl"
              :placeholder="currentQuestion.otherPlaceholder ?? t('program.preSurvey.wizard.otherPlaceholder')"
              class="mt-1"
            />
          </div>

          <!-- `flex-nowrap` + `flex-1` buttons rather than `flex-wrap` + a
               min-width: with 10 options, wrapping splits 9 and 10 onto
               their own line instead of keeping the scale on one row —
               shrinking evenly to fit keeps it a single row at any width. -->
          <div v-else-if="currentQuestion.type === 'scale'" class="flex flex-nowrap gap-2">
            <UButton
              v-for="value in scaleValues"
              :key="value"
              :label="String(value)"
              size="lg"
              :color="answers[currentQuestion.id] === value ? 'primary' : 'neutral'"
              :variant="answers[currentQuestion.id] === value ? 'solid' : 'outline'"
              class="flex-1 justify-center px-0"
              @click="selectScale(value)"
            />
          </div>
        </div>
      </div>

      <div class="shrink-0 border-t border-default px-6 py-4 flex items-center justify-between">
        <UButton
          :label="t('program.preSurvey.wizard.back')"
          variant="outline"
          color="neutral"
          :disabled="currentIndex === 0"
          @click="back"
        />
        <UButton
          :label="isLastQuestion ? t('program.preSurvey.wizard.finish') : t('program.preSurvey.wizard.continue')"
          color="primary"
          :disabled="!canAdvance"
          @click="advance"
        />
      </div>
    </div>
  </Teleport>
</template>
