import type { PreviewState } from '~/composables/useHomeMockData'

export type ProgramTier = 'Explore' | 'Core' | 'More'
export type ProgramDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type LearningType = 'self-paced' | 'moderated'
export type CurriculumItemType = 'topic' | 'survey' | 'task' | 'resource'
export type CurriculumContentType = 'video' | 'slideshow' | 'text' | 'image' | 'gif'

export interface StudioOwner {
  name: string
  logo: string
}

export interface DeliveringInstitution {
  name: string
  logo?: string
}

export interface LinkedGame {
  id: string
  name: string
  image: string
  to: string
}

export interface CurriculumItem {
  id: string
  type: CurriculumItemType
  title: string
  xp: number
  contentType: CurriculumContentType
}

export interface CurriculumModule {
  id: string
  title: string
  description?: string
  items: CurriculumItem[]
}

export interface Testimonial {
  id: string
  author: string
  avatar?: string
  role?: string
  quote: string
}

export interface Microcredential {
  id: string
  name: string
}

export interface ProgramCertificate {
  name: string
  issuingOrg: string
  microcredentials?: Microcredential[]
}

export interface ProgramTemplate {
  id: string
  title: string
  description: string
  image: string
  facilitator: string
  studioOwner: StudioOwner
  language: string
  difficulty: ProgramDifficulty
  minAge?: number
  totalXp: number
  learningType: LearningType
  linkedGame?: LinkedGame
  tier: ProgramTier
  durationLabel: string
  curriculum: CurriculumModule[]
  toolsUsed: string[]
  prerequisites: string[]
  studentsCompletedCount: number
  testimonials: Testimonial[]
  certificate: ProgramCertificate
}

export interface Cohort {
  id: string
  instanceId: string
  startDate: string | null
  endDate: string | null
  maxLearners: number | null
  seatsTaken: number
  accessCode?: string
}

export interface ProgramInstance {
  id: string
  programId: string
  deliveringInstitution?: DeliveringInstitution
  cohorts: Cohort[]
}

export interface EnrollmentRecord {
  learnerId: PreviewState
  programId: string
  instanceId: string
  cohortId: string
  progress: number
  enrolledAt: string
}

export type EnrollmentStatus =
  | 'already-enrolled'
  | 'self-paced-always-open'
  | 'requires-access-code'
  | 'closed'
  | 'full'
  | 'open-with-seats'

const ENDLESS_STUDIOS: StudioOwner = { name: 'Endless Studios', logo: '/images/logo-endless.svg' }

// Cycled by module index so each module/curriculum-item-group reads as
// visually distinct. Shared by ProgramCurriculumAccordion.vue and the
// learning player's sidebar nav so both use the exact same cycling.
export const MODULE_COLORS = ['primary', 'secondary', 'purple', 'blue'] as const

export const programTemplates: ProgramTemplate[] = [
  {
    id: 'intro-game-design',
    title: 'Intro to Game Design',
    description: 'Build your first playable prototype, one task at a time.',
    image: '/images/img/bg-threadbare.png',
    facilitator: 'Deja Marsh',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Beginner',
    minAge: 10,
    totalXp: 500,
    learningType: 'self-paced',
    tier: 'Explore',
    durationLabel: '3 weeks - about 1 hr/week, at your own pace',
    toolsUsed: ['Godot'],
    prerequisites: [],
    studentsCompletedCount: 240,
    testimonials: [],
    certificate: {
      name: 'Intro to Game Design Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: []
    },
    curriculum: [
      {
        id: 'module-igd-design-basics',
        title: 'Design Basics',
        items: [
          { id: 'item-igd-what-is-a-game', type: 'topic', title: 'What makes a game a game?', xp: 0, contentType: 'video' },
          { id: 'item-igd-core-loop', type: 'task', title: 'Sketch your core gameplay loop', xp: 150, contentType: 'slideshow' },
          { id: 'item-igd-paper-prototype', type: 'task', title: 'Build a paper prototype', xp: 150, contentType: 'image' }
        ]
      },
      {
        id: 'module-igd-build-your-prototype',
        title: 'Build Your Prototype',
        items: [
          { id: 'item-igd-choose-tool', type: 'resource', title: 'Choosing your first game engine', xp: 0, contentType: 'text' },
          { id: 'item-igd-first-level', type: 'task', title: 'Build a playable first level', xp: 200, contentType: 'video' },
          { id: 'item-igd-playtest-survey', type: 'survey', title: 'How did your first playtest go?', xp: 0, contentType: 'text' }
        ]
      }
    ]
  },
  {
    id: 'pixel-art-foundations',
    title: 'Pixel Art Foundations',
    description: 'Draw, animate, and export sprite art for your games.',
    image: '/images/img/generic-image.png',
    facilitator: 'Jules Okafor',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Beginner',
    minAge: 10,
    totalXp: 900,
    learningType: 'self-paced',
    tier: 'Explore',
    durationLabel: '4 weeks - about 2 hrs/week, at your own pace',
    toolsUsed: ['Aseprite', 'Piskel'],
    prerequisites: [],
    studentsCompletedCount: 412,
    testimonials: [
      {
        id: 'testimonial-priya',
        author: 'Priya N.',
        role: 'Completed Pixel Art Foundations',
        quote: 'I went from never touching pixel art to shipping my own sprite sheet in a month.'
      },
      {
        id: 'testimonial-devon',
        author: 'Devon M.',
        role: 'Completed Pixel Art Foundations',
        quote: 'The palette module finally made color theory click for me.'
      }
    ],
    certificate: {
      name: 'Pixel Art Foundations Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: [{ id: 'mc-sprite-sheets', name: 'Sprite Sheet Animation' }]
    },
    curriculum: [
      {
        id: 'module-pixel-fundamentals',
        title: 'Pixel Fundamentals',
        items: [
          { id: 'item-sprite-anatomy', type: 'topic', title: 'Anatomy of a sprite', xp: 0, contentType: 'video' },
          { id: 'item-16x16-character', type: 'task', title: 'Draw a 16x16 character sprite', xp: 150, contentType: 'slideshow' },
          { id: 'item-walk-cycle', type: 'task', title: 'Build a 4-frame walk cycle', xp: 200, contentType: 'gif' }
        ]
      },
      {
        id: 'module-palettes-shading',
        title: 'Palettes & Shading',
        items: [
          { id: 'item-palette-libraries', type: 'resource', title: 'Recommended palette libraries', xp: 0, contentType: 'image' },
          { id: 'item-recolor-sprite', type: 'task', title: 'Recolor your sprite with an 8-color palette', xp: 150, contentType: 'image' },
          { id: 'item-color-survey', type: 'survey', title: 'How comfortable are you with color theory?', xp: 0, contentType: 'text' }
        ]
      },
      {
        id: 'module-export-reuse',
        title: 'Export & Reuse',
        items: [
          { id: 'item-export-godot', type: 'task', title: 'Export a sprite sheet for Godot', xp: 150, contentType: 'video' },
          { id: 'item-idle-run-blend', type: 'task', title: 'Animate an idle-to-run blend', xp: 250, contentType: 'gif' }
        ]
      }
    ]
  },
  {
    id: 'ship-your-first-game',
    title: 'Ship Your First Game',
    description: 'Take a project from idea to a shared, playable build.',
    image: '/images/img/games/game-built.png',
    facilitator: 'Sam Whitfield',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Intermediate',
    minAge: 13,
    totalXp: 1400,
    learningType: 'moderated',
    linkedGame: {
      id: 'endstar',
      name: 'Endstar',
      image: '/images/img/games/endstar-avatar.png',
      to: '#'
    },
    tier: 'Core',
    durationLabel: '8 weeks - live sessions twice a week',
    toolsUsed: ['Godot', 'GitHub', 'Endstar Editor'],
    prerequisites: [
      'Completed Intro to Game Design or equivalent experience',
      'Comfortable with basic version control (git add/commit/push)'
    ],
    studentsCompletedCount: 128,
    testimonials: [
      {
        id: 'testimonial-marcus',
        author: 'Marcus T.',
        role: 'Shipped Threadbare Jam Edition',
        quote: 'This was the first time I actually finished a game instead of abandoning it halfway.'
      },
      {
        id: 'testimonial-aisha',
        author: 'Aisha R.',
        role: 'Completed Ship Your First Game',
        quote: 'Working through GitHub with a real team taught me more than any tutorial.'
      },
      {
        id: 'testimonial-leo',
        author: 'Leo P.',
        role: 'Completed Ship Your First Game',
        quote: 'Our facilitator caught bugs in my save system I would never have noticed alone.'
      }
    ],
    certificate: {
      name: 'Ship Your First Game Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: [
        { id: 'mc-shipped-build', name: 'Shipped a Playable Build' },
        { id: 'mc-team-collab', name: 'Team Collaboration' }
      ]
    },
    curriculum: [
      {
        id: 'module-prototype-to-playable',
        title: 'Prototype to Playable',
        items: [
          { id: 'item-project-structure', type: 'topic', title: 'Godot project structure', xp: 0, contentType: 'video' },
          { id: 'item-player-movement', type: 'task', title: 'Wire up player movement in Godot', xp: 150, contentType: 'video' },
          { id: 'item-win-lose', type: 'task', title: 'Add a win/lose condition', xp: 250, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-systems-polish',
        title: 'Systems & Polish',
        items: [
          { id: 'item-save-load', type: 'task', title: 'Implement a save/load system', xp: 300, contentType: 'slideshow' },
          { id: 'item-juice', type: 'task', title: 'Add sound effects and juice', xp: 250, contentType: 'video' }
        ]
      },
      {
        id: 'module-team-workflow',
        title: 'Team Workflow',
        items: [
          { id: 'item-git-cheatsheet', type: 'resource', title: 'Git basics cheat sheet', xp: 0, contentType: 'text' },
          { id: 'item-shared-repo', type: 'task', title: 'Set up a shared GitHub repo', xp: 200, contentType: 'image' },
          { id: 'item-pull-request', type: 'task', title: "Review a teammate's pull request", xp: 150, contentType: 'text' }
        ]
      },
      {
        id: 'module-ship-it',
        title: 'Ship It',
        items: [
          { id: 'item-publish-build', type: 'task', title: 'Publish a build to the Endstar library', xp: 100, contentType: 'slideshow' },
          { id: 'item-ship-survey', type: 'survey', title: 'Rate your experience shipping a build', xp: 0, contentType: 'text' }
        ]
      }
    ]
  },
  {
    id: 'level-design-lab',
    title: 'Level Design Lab',
    description: 'Pace, teach, and challenge players through hands-on level blocks.',
    image: '/images/img/default-image.png',
    facilitator: 'Renata Oyelaran',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Intermediate',
    minAge: 12,
    totalXp: 1050,
    learningType: 'moderated',
    tier: 'Core',
    durationLabel: '6 weeks - one live workshop per week',
    toolsUsed: ['Godot', 'Tiled'],
    prerequisites: ['Basic familiarity with a game engine (any engine counts)'],
    studentsCompletedCount: 76,
    testimonials: [
      {
        id: 'testimonial-khosi',
        author: 'Khosi J.',
        role: 'Completed Level Design Lab',
        quote: 'Our workshop group play-tested every block live - I fixed pacing issues I never would have caught alone.'
      }
    ],
    certificate: {
      name: 'Level Design Lab Certificate',
      issuingOrg: 'Northgate Youth Arts Center',
      microcredentials: []
    },
    curriculum: [
      {
        id: 'module-layout-fundamentals',
        title: 'Layout Fundamentals',
        items: [
          { id: 'item-pacing-principles', type: 'topic', title: 'Principles of level pacing', xp: 0, contentType: 'video' },
          { id: 'item-blockout', type: 'task', title: 'Block out a level using primitive shapes', xp: 150, contentType: 'slideshow' },
          { id: 'item-pacing-playtest', type: 'task', title: 'Playtest and note pacing issues', xp: 200, contentType: 'text' }
        ]
      },
      {
        id: 'module-encounter-design',
        title: 'Encounter Design',
        items: [
          { id: 'item-teach-mechanic', type: 'task', title: 'Design a challenge teaching a new mechanic', xp: 300, contentType: 'video' },
          { id: 'item-difficulty-curve', type: 'task', title: 'Place enemies to create a difficulty curve', xp: 200, contentType: 'image' }
        ]
      },
      {
        id: 'module-polish-ship',
        title: 'Polish & Ship',
        items: [
          { id: 'item-lighting-pack', type: 'resource', title: 'Lighting reference pack', xp: 0, contentType: 'image' },
          { id: 'item-lighting-dressing', type: 'task', title: 'Add lighting and set dressing', xp: 200, contentType: 'slideshow' }
        ]
      }
    ]
  },
  {
    id: 'creature-rigging-crash-course',
    title: 'Creature Rigging Crash Course',
    description: 'Rig a four-legged creature for walk, run, and idle animation.',
    image: '/images/img/default-bg.png',
    facilitator: 'Toby Kessler',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Advanced',
    minAge: 14,
    totalXp: 800,
    learningType: 'moderated',
    tier: 'More',
    durationLabel: '3 weeks - two live sessions per week',
    toolsUsed: ['Blender'],
    prerequisites: [
      'Comfortable with basic 3D modeling',
      'Completed 3D Character Modeling or equivalent'
    ],
    studentsCompletedCount: 0,
    testimonials: [],
    certificate: {
      name: 'Creature Rigging Crash Course Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: []
    },
    curriculum: [
      {
        id: 'module-skeleton-basics',
        title: 'Skeleton Basics',
        items: [
          { id: 'item-rig-hierarchy', type: 'topic', title: 'Rig hierarchy overview', xp: 0, contentType: 'video' },
          { id: 'item-base-skeleton', type: 'task', title: 'Build a base skeleton for a quadruped', xp: 200, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-weight-painting',
        title: 'Weight Painting',
        items: [
          { id: 'item-weight-paint', type: 'task', title: 'Weight paint a walk-ready mesh', xp: 250, contentType: 'video' },
          { id: 'item-fix-pinching', type: 'task', title: 'Fix pinching at major joints', xp: 200, contentType: 'image' }
        ]
      },
      {
        id: 'module-animate',
        title: 'Animate',
        items: [
          { id: 'item-walk-cycle-block', type: 'task', title: 'Block a walk cycle using the rig', xp: 150, contentType: 'gif' },
          { id: 'item-rig-survey', type: 'survey', title: 'How confident do you feel rigging a biped next?', xp: 0, contentType: 'text' }
        ]
      }
    ]
  }
]

export const programInstances: ProgramInstance[] = [
  {
    id: 'instance-intro-game-design',
    programId: 'intro-game-design',
    cohorts: [
      {
        id: 'cohort-igd-self-paced',
        instanceId: 'instance-intro-game-design',
        startDate: null,
        endDate: null,
        maxLearners: null,
        seatsTaken: 0
      }
    ]
  },
  {
    id: 'instance-pixel-art-foundations',
    programId: 'pixel-art-foundations',
    cohorts: [
      {
        id: 'cohort-paf-self-paced',
        instanceId: 'instance-pixel-art-foundations',
        startDate: null,
        endDate: null,
        maxLearners: null,
        seatsTaken: 0
      }
    ]
  },
  {
    id: 'instance-ship-your-first-game',
    programId: 'ship-your-first-game',
    cohorts: [
      {
        id: 'cohort-syfg-tue-thu',
        instanceId: 'instance-ship-your-first-game',
        startDate: '2026-08-03',
        endDate: '2026-09-28',
        maxLearners: 24,
        seatsTaken: 16
      },
      {
        id: 'cohort-syfg-mon-wed',
        instanceId: 'instance-ship-your-first-game',
        startDate: '2026-08-04',
        endDate: '2026-09-29',
        maxLearners: 20,
        seatsTaken: 20
      },
      {
        id: 'cohort-syfg-late-summer',
        instanceId: 'instance-ship-your-first-game',
        startDate: '2026-08-10',
        endDate: '2026-10-05',
        maxLearners: 24,
        seatsTaken: 9,
        accessCode: 'STUDIO-JAM'
      }
    ]
  },
  {
    id: 'instance-level-design-lab',
    programId: 'level-design-lab',
    deliveringInstitution: { name: 'Northgate Youth Arts Center' },
    cohorts: [
      {
        id: 'cohort-ldl-summer',
        instanceId: 'instance-level-design-lab',
        startDate: '2026-06-01',
        endDate: '2026-07-13',
        maxLearners: 16,
        seatsTaken: 16
      }
    ]
  },
  {
    id: 'instance-creature-rigging-crash-course',
    programId: 'creature-rigging-crash-course',
    cohorts: [
      {
        id: 'cohort-crcc-fall',
        instanceId: 'instance-creature-rigging-crash-course',
        startDate: '2026-08-17',
        endDate: '2026-09-04',
        maxLearners: 12,
        seatsTaken: 0
      }
    ]
  }
]

export const enrollmentsByPreviewState: Record<PreviewState, EnrollmentRecord[]> = {
  active: [
    {
      learnerId: 'active',
      programId: 'intro-game-design',
      instanceId: 'instance-intro-game-design',
      cohortId: 'cohort-igd-self-paced',
      progress: 65,
      enrolledAt: '2026-06-20'
    },
    {
      learnerId: 'active',
      programId: 'pixel-art-foundations',
      instanceId: 'instance-pixel-art-foundations',
      cohortId: 'cohort-paf-self-paced',
      progress: 30,
      enrolledAt: '2026-07-01'
    }
  ],
  new: [],
  guest: []
}

/**
 * Precedence order matters: already-enrolled and self-paced both bypass the
 * seat/date/access-code logic entirely, since they're determined by the
 * learner's relationship to the program, not the cohort's own scheduling.
 */
export function cohortStatusFor(
  cohort: Cohort,
  enrollment: EnrollmentRecord | undefined,
  unlocked: boolean,
  today = new Date()
): EnrollmentStatus {
  if (enrollment && enrollment.cohortId === cohort.id) return 'already-enrolled'
  if (cohort.startDate === null) return 'self-paced-always-open'
  if (cohort.accessCode && !unlocked) return 'requires-access-code'

  // Date-only ISO strings, parsed as UTC midnight — same normalization
  // useLearnMockData.ts's cohortTimingOf uses, to avoid a server-timezone
  // skew putting "today" on the wrong side of the cohort's end date.
  const todayUtcMidnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const endsAt = cohort.endDate ? new Date(cohort.endDate).getTime() : Infinity
  if (endsAt < todayUtcMidnight) return 'closed'

  if (cohort.maxLearners !== null && cohort.seatsTaken >= cohort.maxLearners) return 'full'
  return 'open-with-seats'
}

// Whether a new learner could book into this program at all — used to keep
// fully-booked programs (every cohort full) out of the /learn catalog.
// Programs with no matching instance (catalog-only mock entries) are treated
// as available, since there's no cohort data to say otherwise.
export function hasAvailableCohort(programId: string): boolean {
  const instance = programInstances.find(i => i.programId === programId)
  if (!instance) return true
  return instance.cohorts.some(c => cohortStatusFor(c, undefined, false) !== 'full')
}
