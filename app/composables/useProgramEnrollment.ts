import type { MaybeRefOrGetter } from 'vue'
import type { EnrollmentRecord, ProgramTemplate } from '~/composables/useProgramMockData'
import { enrollmentsByPhase, programTemplates } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'
import { usePreviewState, type PreviewState } from '~/composables/usePreviewState'

/**
 * Whether the given preview state is enrolled in this program, and how far in.
 * Enrollment is per program, not per state: a new learner has joined Core:
 * Threadbare and nothing else, so the same switch opens the classroom there and
 * leaves the pitch up everywhere else.
 */
export function enrollmentFor(state: PreviewState, programId: string): EnrollmentRecord | undefined {
  return enrollmentsByPhase[state].find(record => record.programId === programId)
}

/**
 * The lessons a record's percentage implies, in curriculum order — 35% of Core:
 * Threadbare's 18 lessons is the first 6, which puts the learner on Lesson 7.
 *
 * There is no backend to have recorded which lessons were actually done, so the
 * percentage is the input and the lesson list is derived from it, rather than
 * the other way around.
 */
export function seededItemIds(template: ProgramTemplate, percent: number): string[] {
  if (percent <= 0) return []
  const items = flattenCurriculum(template)
  const completed = Math.round((percent / 100) * items.length)
  return items.slice(0, completed).map(item => item.id)
}

/**
 * The percentage every surface displays. Derived from the seeded lessons rather
 * than passed straight through, so the catalog card, the home resume card and
 * the program's own progress card can't disagree — a record saying 35% of 18
 * lessons reads as 33% everywhere, because 6 lessons is what 35% buys.
 */
export function enrollmentPercent(template: ProgramTemplate, percent: number): number {
  const total = flattenCurriculum(template).length
  if (!total) return 0
  return Math.round((seededItemIds(template, percent).length / total) * 100)
}

/**
 * Reactive form for components. Defaults to the program in the current route,
 * which is what every caller inside the program shell wants.
 */
export function useProgramEnrollment(programId?: MaybeRefOrGetter<string>) {
  const route = useRoute()
  const { state } = usePreviewState()

  const id = computed(() => toValue(programId) ?? (route.params.programId as string))
  const enrollment = computed(() => enrollmentFor(state.value, id.value))
  const isEnrolled = computed(() => Boolean(enrollment.value))

  const percent = computed(() => {
    const template = programTemplates.find(candidate => candidate.id === id.value)
    if (!template || !enrollment.value) return 0
    return enrollmentPercent(template, enrollment.value.progress)
  })

  return { enrollment, isEnrolled, percent }
}
