import type { MaybeRefOrGetter } from 'vue'
import type { EnrollmentRecord, ProgramTemplate } from '~/composables/useProgramMockData'
import { enrollmentsByPhase, programInstances, programTemplates } from '~/composables/useProgramMockData'
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

const SELF_PACED_STORAGE_KEY = 'self-paced-started'

// One hydration per page load, same reasoning as usePreviewState's `hydrated`
// flag: every program-shell component calls this composable, and only the
// first needs to touch localStorage.
let selfPacedHydrated = false

/**
 * A self-paced instance has no seat or roster, so pressing "Start Learning" is
 * its only enrollment event. There's no backend to record it, so — like
 * useProgramProgress's completed-item set — it's a client-only fake, shared
 * across the page via `useState` and persisted so a reload doesn't undo it.
 */
function useSelfPacedStarted() {
  const startedProgramIds = useState<Set<string>>(SELF_PACED_STORAGE_KEY, () => new Set())

  onMounted(() => {
    if (selfPacedHydrated || !import.meta.client) return
    selfPacedHydrated = true
    const raw = localStorage.getItem(SELF_PACED_STORAGE_KEY)
    if (!raw) return
    try {
      startedProgramIds.value = new Set(JSON.parse(raw))
    } catch {
      // Corrupt/old localStorage value — ignore and start fresh.
    }
  })

  function start(programId: string) {
    if (startedProgramIds.value.has(programId)) return
    startedProgramIds.value = new Set(startedProgramIds.value).add(programId)
    if (import.meta.client) {
      localStorage.setItem(SELF_PACED_STORAGE_KEY, JSON.stringify([...startedProgramIds.value]))
    }
  }

  return { startedProgramIds, start }
}

// The self-paced cohort a program offers, if any — a program can carry both a
// cohort and a self-paced instance side by side, so this picks the one with no
// start date rather than assuming the program's only instance is self-paced.
function selfPacedCohortFor(programId: string) {
  return programInstances
    .filter(i => i.programId === programId)
    .flatMap(i => i.cohorts)
    .find(c => c.startDate === null)
}

/**
 * Reactive form for components. Defaults to the program in the current route,
 * which is what every caller inside the program shell wants.
 */
export function useProgramEnrollment(programId?: MaybeRefOrGetter<string>) {
  const route = useRoute()
  const { state } = usePreviewState()
  const { startedProgramIds, start } = useSelfPacedStarted()

  const id = computed(() => toValue(programId) ?? (route.params.programId as string))

  // The fixture covers cohort enrollment; a self-paced start is layered on top
  // as a synthesized record so every reader of `enrollment` — the tab gate
  // here, the enrollment card's "Resume" state, the progress card — agrees
  // it happened, without either one overwriting a real fixture record.
  const enrollment = computed<EnrollmentRecord | undefined>(() => {
    const seeded = enrollmentFor(state.value, id.value)
    if (seeded) return seeded

    const cohort = selfPacedCohortFor(id.value)
    if (!cohort || !startedProgramIds.value.has(id.value)) return undefined

    return {
      programId: id.value,
      instanceId: cohort.instanceId,
      cohortId: cohort.id,
      phase: state.value,
      progress: 0,
      enrolledAt: new Date().toISOString()
    }
  })
  const isEnrolled = computed(() => Boolean(enrollment.value))

  // Only meaningful for a self-paced program — call it once the learner
  // presses "Start Learning" and every reader above updates immediately.
  function startSelfPaced() {
    start(id.value)
  }

  const percent = computed(() => {
    const template = programTemplates.find(candidate => candidate.id === id.value)
    if (!template || !enrollment.value) return 0
    return enrollmentPercent(template, enrollment.value.progress)
  })

  return { enrollment, isEnrolled, percent, startSelfPaced }
}
