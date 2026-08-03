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
  { id: 'intro-game-design', cohortStart: '2026-06-15', cohortEnd: '2026-08-15', enrolled: true, progress: 65 },
  { id: 'pixel-art-foundations', cohortStart: '2026-07-01', cohortEnd: '2026-08-26', enrolled: true, progress: 30 },
  { id: 'ship-your-first-game', cohortStart: '2026-08-03', cohortEnd: '2026-09-28', enrolled: false },
  { id: 'sound-design-basics', cohortStart: '2026-08-05', cohortEnd: '2026-09-16', enrolled: false },
  { id: 'level-design-lab', cohortStart: '2026-08-10', cohortEnd: '2026-10-05', enrolled: false },
  { id: 'creature-rigging-crash-course', cohortStart: '2026-08-17', cohortEnd: '2026-09-04', enrolled: false },
  { id: 'advanced-shader-programming', cohortStart: '2026-09-01', cohortEnd: '2026-11-03', enrolled: false },
  { id: 'narrative-design-workshop', cohortStart: '2026-09-14', cohortEnd: '2026-11-09', enrolled: false },
  { id: '3d-character-modeling', cohortStart: '2026-09-21', cohortEnd: '2026-11-16', enrolled: false },
  { id: 'multiplayer-networking-fundamentals', cohortStart: '2026-10-05', cohortEnd: '2026-12-07', enrolled: false },
  { id: 'game-audio-music-composition', cohortStart: '2026-10-12', cohortEnd: '2026-12-14', enrolled: false }
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
