export interface LearnProgram {
  id: string
  name: string
  description: string
  image: string
  status: 'Beginner' | 'Intermediate' | 'Advanced'
  tasksCount: number
  cohortStart: string
  cohortEnd: string
  enrolled: boolean
  progress?: number
}

export const learnPrograms: LearnProgram[] = [
  { id: 'intro-game-design', name: 'Intro to Game Design', description: 'Build your first playable prototype, one task at a time.', image: '/images/img/bg-threadbare.png', status: 'Beginner', tasksCount: 8, cohortStart: '2026-06-15', cohortEnd: '2026-08-15', enrolled: true, progress: 65 },
  { id: 'pixel-art-foundations', name: 'Pixel Art Foundations', description: 'Draw, animate, and export sprite art for your games.', image: '/images/img/generic-image.png', status: 'Beginner', tasksCount: 6, cohortStart: '2026-07-01', cohortEnd: '2026-08-26', enrolled: true, progress: 30 },
  { id: 'ship-your-first-game', name: 'Ship Your First Game', description: 'Take a project from idea to a shared, playable build.', image: '/images/img/games/game-built.png', status: 'Intermediate', tasksCount: 10, cohortStart: '2026-08-03', cohortEnd: '2026-09-28', enrolled: false },
  { id: 'sound-design-basics', name: 'Sound Design Basics', description: 'Layer sound effects and ambience that make a scene feel alive.', image: '/images/img/default-bg.png', status: 'Beginner', tasksCount: 5, cohortStart: '2026-08-05', cohortEnd: '2026-09-16', enrolled: false },
  { id: 'level-design-lab', name: 'Level Design Lab', description: 'Pace, teach, and challenge players through hands-on level blocks.', image: '/images/img/default-image.png', status: 'Intermediate', tasksCount: 9, cohortStart: '2026-08-10', cohortEnd: '2026-10-05', enrolled: false },
  { id: 'advanced-shader-programming', name: 'Advanced Shader Programming', description: 'Write custom shaders for stylized lighting and effects.', image: '/images/img/bg-threadbare.png', status: 'Advanced', tasksCount: 12, cohortStart: '2026-09-01', cohortEnd: '2026-11-03', enrolled: false },
  { id: 'narrative-design-workshop', name: 'Narrative Design Workshop', description: 'Branch dialogue and pace story beats around player choice.', image: '/images/img/generic-image.png', status: 'Intermediate', tasksCount: 7, cohortStart: '2026-09-14', cohortEnd: '2026-11-09', enrolled: false },
  { id: '3d-character-modeling', name: '3D Character Modeling', description: 'Sculpt, retopologize, and rig a game-ready character.', image: '/images/img/games/game-built.png', status: 'Advanced', tasksCount: 11, cohortStart: '2026-09-21', cohortEnd: '2026-11-16', enrolled: false },
  { id: 'multiplayer-networking-fundamentals', name: 'Multiplayer Networking Fundamentals', description: 'Sync state across clients without the game feeling laggy.', image: '/images/img/default-bg.png', status: 'Advanced', tasksCount: 10, cohortStart: '2026-10-05', cohortEnd: '2026-12-07', enrolled: false },
  { id: 'game-audio-music-composition', name: 'Game Audio & Music Composition', description: 'Score adaptive music that reacts to what the player does.', image: '/images/img/default-image.png', status: 'Beginner', tasksCount: 6, cohortStart: '2026-10-12', cohortEnd: '2026-12-14', enrolled: false }
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
