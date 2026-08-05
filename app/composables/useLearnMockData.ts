// Catalog-only scheduling/enrollment state, keyed to a programTemplates id.
// Display fields (title, description, image, difficulty, module count) come
// from useProgramMockData.ts's programTemplates so the catalog card can never
// drift from what the cover page and program content actually show.
export interface LearnProgram {
  id: string
  cohortStart: string
  cohortEnd: string
  enrolled: boolean
  progress?: number
}

export const learnPrograms: LearnProgram[] = [
  // Dates mirror each program's real instance(s) in programData/instances.ts.
  // Explore: Godot lists 3 instances there; the catalog card only has room for
  // one range, so this uses the soonest upcoming one (Dawn Patrol, Aug 11).
  { id: 'explore-godot', cohortStart: '2026-08-11', cohortEnd: '2026-09-10', enrolled: false },
  { id: 'core-threadbare', cohortStart: '2026-09-01', cohortEnd: '2026-10-29', enrolled: true, progress: 35 },
  { id: 'explore-threadbare', cohortStart: '2026-08-12', cohortEnd: '2026-11-04', enrolled: false },
  // SYNTHESIZED: Educator Training has no ProgramInstance (it's facilitator-
  // facing, not an open learner cohort — see instances.ts) so there's no real
  // date to draw from; a single placeholder session date fills the required
  // range field.
  { id: 'educator-training', cohortStart: '2026-09-15', cohortEnd: '2026-09-15', enrolled: false }
]

export type CohortTiming = 'in-progress' | 'starting-soon' | 'open-enrollment'

const STARTING_SOON_WINDOW_DAYS = 14

export function cohortTimingOf(program: LearnProgram, today = new Date()): CohortTiming {
  if (program.enrolled) return 'in-progress'
  // cohortStart is a date-only ISO string (parsed as UTC midnight) — normalize
  // "today" to UTC midnight too, so the day-diff isn't skewed by the server's
  // local timezone offset or time-of-day.
  const todayUtcMidnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const daysUntilStart = (new Date(program.cohortStart).getTime() - todayUtcMidnight) / (1000 * 60 * 60 * 24)
  return daysUntilStart <= STARTING_SOON_WINDOW_DAYS ? 'starting-soon' : 'open-enrollment'
}

export function formatCohortRange(startIso: string, endIso: string): string {
  // Force UTC when formatting, matching how the date-only ISO string was parsed —
  // otherwise a negative-UTC-offset server renders the date one day early.
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' }
  const startLabel = new Date(startIso).toLocaleDateString('en-US', options)
  const endLabel = new Date(endIso).toLocaleDateString('en-US', options)
  return `${startLabel} – ${endLabel}`
}
