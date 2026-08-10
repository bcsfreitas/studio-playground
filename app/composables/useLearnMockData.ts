import type { PreviewState } from '~/composables/usePreviewState'
import { programTemplates } from '~/composables/programData/templates'
import { enrollmentFor, enrollmentPercent } from '~/composables/useProgramEnrollment'

// Catalog-only scheduling state, keyed to a programTemplates id. Display fields
// (title, description, image, difficulty, module count) come from
// useProgramMockData.ts's programTemplates, and enrollment comes from the
// enrollment fixtures — so the catalog card can't drift from what the cover
// page and program content actually show.
export interface LearnProgram {
  id: string
  // Null on a program with no cohort at all: there is no run to start or end,
  // so the card says self-paced instead of showing a date range. A program that
  // runs cohorts *and* offers self-paced still shows its soonest run here.
  cohortStart: string | null
  cohortEnd: string | null
  enrolled: boolean
  progress?: number
}

type LearnProgramSchedule = Pick<LearnProgram, 'id' | 'cohortStart' | 'cohortEnd'>

const PROGRAM_SCHEDULES: LearnProgramSchedule[] = [
  // Dates mirror each program's real instance(s) in programData/instances.ts.
  // Explore: Godot lists 3 instances there; the catalog card only has room for
  // one range, so this uses the soonest upcoming one (Dawn Patrol, Aug 11).
  { id: 'explore-godot', cohortStart: '2026-08-11', cohortEnd: '2026-09-10' },
  { id: 'core-threadbare', cohortStart: '2026-09-01', cohortEnd: '2026-10-29' },
  // Explore: Threadbare runs no cohort at all — enroll and start the same day.
  { id: 'explore-threadbare', cohortStart: null, cohortEnd: null },
  // SYNTHESIZED: Educator Training has no ProgramInstance (it's facilitator-
  // facing, not an open learner cohort — see instances.ts) so there's no real
  // date to draw from; a single placeholder session date fills the required
  // range field.
  { id: 'educator-training', cohortStart: '2026-09-15', cohortEnd: '2026-09-15' }
]

/**
 * The catalog as a preview state sees it. Enrollment and progress are read from
 * the same records the program shell gates on, so a card claiming 33% is a card
 * whose program opens on the lesson that percentage leaves you at.
 */
export function learnProgramsFor(state: PreviewState): LearnProgram[] {
  return PROGRAM_SCHEDULES.map((schedule) => {
    const enrollment = enrollmentFor(state, schedule.id)
    const template = programTemplates.find(candidate => candidate.id === schedule.id)
    return {
      ...schedule,
      enrolled: Boolean(enrollment),
      progress: enrollment && template ? enrollmentPercent(template, enrollment.progress) : undefined
    }
  })
}

export type CohortTiming = 'in-progress' | 'starting-soon' | 'open-enrollment'

const STARTING_SOON_WINDOW_DAYS = 14

export function cohortTimingOf(program: LearnProgram, today = new Date()): CohortTiming {
  if (program.enrolled) return 'in-progress'
  // Self-paced: nothing to start soon, since it's open every day.
  if (!program.cohortStart) return 'open-enrollment'
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
