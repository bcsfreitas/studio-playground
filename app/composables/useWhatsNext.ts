import { continueLearningFor, continueLearningTemplate } from '~/composables/useHomeMockData'
import { usePreviewState } from '~/composables/usePreviewState'
import { useOnboardingChecklist } from '~/composables/useOnboardingChecklist'
import { useProgramProgress } from '~/composables/useProgramProgress'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'

export type WhatsNextState =
  | { kind: 'guest' }
  | { kind: 'checklist', contextId: string, context: string, to: string }
  | { kind: 'next-step', label: string, to: string }
  | { kind: 'vacuum' }

/**
 * One state machine, exactly one state true at a time, in the doc's stated
 * precedence: guest intent cards -> checklist mirror -> next scheduled step
 * -> post-completion recommendation. No prior art exists for this anywhere
 * in the app or the original design handoff — every branch below is new.
 *
 * `continueLearningTemplate` is a module-level constant, not per-state (see
 * useHomeMockData.ts's own comment: both signed-in preview states share one
 * program), so the checklist and progress composables below are called once,
 * unconditionally, exactly like index.vue already calls useProgramProgress —
 * not lazily inside the returned computed, where onMounted/useState would run
 * outside the component's setup context.
 */
export function useWhatsNext() {
  const { isGuest, state } = usePreviewState()

  const checklist = continueLearningTemplate
    ? useOnboardingChecklist('2a', continueLearningTemplate.id)
    : null
  const progress = continueLearningTemplate ? useProgramProgress(continueLearningTemplate) : null
  const curriculumItems = continueLearningTemplate ? flattenCurriculum(continueLearningTemplate) : []

  const resumeItem = computed(() =>
    curriculumItems.find(item => !progress?.isCompleted(item.id)) ?? curriculumItems[0]
  )

  return computed<WhatsNextState>(() => {
    if (isGuest.value) return { kind: 'guest' }

    const continueLearning = continueLearningFor(state.value)
    if (!continueLearning) return { kind: 'vacuum' }

    if (checklist && !checklist.isComplete.value) {
      return {
        kind: 'checklist',
        contextId: continueLearning.id,
        context: continueLearning.name,
        to: `/learn/${continueLearning.id}`
      }
    }

    return {
      kind: 'next-step',
      label: resumeItem.value?.title ?? continueLearning.name,
      to: resumeItem.value ? `/learn/${continueLearning.id}?item=${resumeItem.value.id}` : `/learn/${continueLearning.id}`
    }
  })
}
