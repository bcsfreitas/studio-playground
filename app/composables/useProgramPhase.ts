import type { InjectionKey, Ref } from 'vue'
import type { LearnerPhase } from '~/composables/useProgramMockData'

const PROGRAM_PHASE_KEY: InjectionKey<Ref<LearnerPhase>> = Symbol('program-phase')

/**
 * The learner's phase is owned by the program shell (`learn/[programId].vue`)
 * because that's where DevPreviewBar lives and where tab visibility is decided.
 * Tab pages read it through inject rather than each holding their own ref, so
 * flipping the preview bar re-renders the active tab instead of leaving it on a
 * stale phase.
 */
export function provideProgramPhase(phase: Ref<LearnerPhase>) {
  provide(PROGRAM_PHASE_KEY, phase)
}

/**
 * Returns the phase ref provided by the shell. The `interested` fallback keeps
 * a tab page renderable outside the shell (Storybook, a direct component
 * mount): unenrolled is the safe default, since it hides learner-only content
 * rather than inventing enrollment that isn't there.
 */
export function useProgramPhase(): Ref<LearnerPhase> {
  return inject(PROGRAM_PHASE_KEY, () => ref<LearnerPhase>('interested'), true)
}
