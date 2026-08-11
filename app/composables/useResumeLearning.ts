import { continueLearningFor } from '~/composables/useHomeMockData'
import { programTemplates } from '~/composables/programData/templates'
import { enrollmentsByPhase } from '~/composables/programData/enrollments'
import { usePreviewState } from '~/composables/usePreviewState'
import { useProgramProgress } from '~/composables/useProgramProgress'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'

/**
 * Resolves the item the home page's "Continue learning" card should link to.
 *
 * New Learner and Onboarded are no longer guaranteed to share a program (see
 * enrollments.ts), so both possible programs are resolved and their progress
 * composables called unconditionally at setup — same shape as the old
 * single-program version, just doubled — and the active one is picked
 * reactively off `state.value` inside the returned computed.
 */
export function useResumeLearning() {
  const { state } = usePreviewState()

  const newTemplate = programTemplates.find(t => t.id === enrollmentsByPhase.new[0]?.programId)
  const onboardedTemplate = programTemplates.find(t => t.id === enrollmentsByPhase.onboarded[0]?.programId)

  const newProgress = newTemplate ? useProgramProgress(newTemplate) : null
  const onboardedProgress = onboardedTemplate ? useProgramProgress(onboardedTemplate) : null

  const newCurriculumItems = newTemplate ? flattenCurriculum(newTemplate) : []
  const onboardedCurriculumItems = onboardedTemplate ? flattenCurriculum(onboardedTemplate) : []

  const activeProgress = computed(() => (state.value === 'new' ? newProgress : onboardedProgress))
  const activeCurriculumItems = computed(() => (state.value === 'new' ? newCurriculumItems : onboardedCurriculumItems))

  const resumeItem = computed(() =>
    activeCurriculumItems.value.find(item => !activeProgress.value?.isCompleted(item.id)) ?? activeCurriculumItems.value[0]
  )

  const resumeTo = computed(() => {
    const continueLearning = continueLearningFor(state.value)
    if (!continueLearning) return undefined
    return resumeItem.value ? `/learn/${continueLearning.id}?item=${resumeItem.value.id}` : `/learn/${continueLearning.id}`
  })

  return { resumeItem, resumeTo }
}
