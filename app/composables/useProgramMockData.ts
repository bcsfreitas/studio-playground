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
    totalXp: 600,
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
      },
      {
        id: 'module-igd-share-feedback',
        title: 'Share & Get Feedback',
        items: [
          { id: 'item-igd-devlog', type: 'resource', title: 'Writing a one-paragraph devlog', xp: 0, contentType: 'text' },
          { id: 'item-igd-share-build', type: 'task', title: 'Share your build with two other learners', xp: 100, contentType: 'text' },
          { id: 'item-igd-feedback-survey', type: 'survey', title: 'What feedback surprised you most?', xp: 0, contentType: 'text' }
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
    totalXp: 1100,
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
      },
      {
        id: 'module-pixel-advanced-fx',
        title: 'Advanced Effects',
        items: [
          { id: 'item-parallax-bg', type: 'resource', title: 'Building a parallax background', xp: 0, contentType: 'image' },
          { id: 'item-particle-fx', type: 'task', title: 'Add a simple particle effect (sparks/dust)', xp: 200, contentType: 'gif' },
          { id: 'item-style-survey', type: 'survey', title: 'How would you describe your personal pixel art style now?', xp: 0, contentType: 'text' }
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
    totalXp: 1600,
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
      },
      {
        id: 'module-syfg-marketing-launch',
        title: 'Marketing & Launch',
        items: [
          { id: 'item-syfg-store-page', type: 'resource', title: "Writing a store page that doesn't undersell your game", xp: 0, contentType: 'text' },
          { id: 'item-syfg-trailer', type: 'task', title: 'Cut a 30-second gameplay trailer', xp: 200, contentType: 'video' },
          { id: 'item-syfg-launch-survey', type: 'survey', title: 'How ready do you feel launching your next project solo?', xp: 0, contentType: 'text' }
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
    totalXp: 1300,
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
      },
      {
        id: 'module-ldl-vertical-slice',
        title: 'Vertical Slice',
        items: [
          { id: 'item-ldl-full-level', type: 'task', title: 'Combine three blocks into one full level', xp: 250, contentType: 'video' },
          { id: 'item-ldl-final-survey', type: 'survey', title: 'Which part of level design clicked for you?', xp: 0, contentType: 'text' }
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
    totalXp: 1000,
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
      },
      {
        id: 'module-crcc-facial-rig',
        title: 'Facial Rig Basics',
        items: [
          { id: 'item-crcc-facial-bones', type: 'topic', title: 'Adding basic facial bones to a quadruped head', xp: 0, contentType: 'video' },
          { id: 'item-crcc-blend-expression', type: 'task', title: 'Rig a simple mouth-open blend shape', xp: 200, contentType: 'video' }
        ]
      }
    ]
  },
  {
    id: 'sound-design-basics',
    title: 'Sound Design Basics',
    description: 'Layer sound effects and ambience that make a scene feel alive.',
    image: '/images/img/default-bg.png',
    facilitator: 'Nadia Chen',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Beginner',
    minAge: 10,
    totalXp: 1100,
    learningType: 'self-paced',
    tier: 'Explore',
    durationLabel: '4 weeks - about 2 hrs/week, at your own pace',
    toolsUsed: ['Audacity', 'Freesound'],
    prerequisites: [],
    studentsCompletedCount: 189,
    testimonials: [
      {
        id: 'testimonial-farid',
        author: 'Farid K.',
        role: 'Completed Sound Design Basics',
        quote: 'I never realized how much ambience does until I muted it and my scene went flat.'
      }
    ],
    certificate: {
      name: 'Sound Design Basics Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: []
    },
    curriculum: [
      {
        id: 'module-sdb-listening-basics',
        title: 'Listening Basics',
        items: [
          { id: 'item-sdb-what-is-sfx', type: 'topic', title: 'What makes a sound effect work?', xp: 0, contentType: 'video' },
          { id: 'item-sdb-foley-recording', type: 'task', title: 'Record three foley sounds with household objects', xp: 150, contentType: 'video' },
          { id: 'item-sdb-listening-survey', type: 'survey', title: 'How would you rate your current sound-editing skills?', xp: 0, contentType: 'text' }
        ]
      },
      {
        id: 'module-sdb-editing-fundamentals',
        title: 'Editing Fundamentals',
        items: [
          { id: 'item-sdb-daw-tour', type: 'resource', title: 'Tour of a basic sound editor', xp: 0, contentType: 'text' },
          { id: 'item-sdb-trim-loop', type: 'task', title: 'Trim and loop an ambience clip cleanly', xp: 150, contentType: 'video' },
          { id: 'item-sdb-layering', type: 'task', title: 'Layer three sounds into one effect', xp: 200, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-sdb-scene-ambience',
        title: 'Scene Ambience',
        items: [
          { id: 'item-sdb-mood-boards', type: 'topic', title: 'Building a mood board for a scene', xp: 0, contentType: 'image' },
          { id: 'item-sdb-ambience-bed', type: 'task', title: 'Build an ambience bed for an outdoor scene', xp: 200, contentType: 'video' },
          { id: 'item-sdb-mix-levels', type: 'task', title: 'Balance levels between SFX and ambience', xp: 150, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-sdb-implementation',
        title: 'Implementation',
        items: [
          { id: 'item-sdb-export-formats', type: 'resource', title: 'Export formats and sample rates that matter', xp: 0, contentType: 'text' },
          { id: 'item-sdb-final-scene', type: 'task', title: 'Score sound for a short game scene', xp: 250, contentType: 'video' },
          { id: 'item-sdb-final-survey', type: 'survey', title: 'What part of sound design surprised you most?', xp: 0, contentType: 'text' }
        ]
      }
    ]
  },
  {
    id: 'advanced-shader-programming',
    title: 'Advanced Shader Programming',
    description: 'Write custom shaders for stylized lighting and effects.',
    image: '/images/img/bg-threadbare.png',
    facilitator: 'Yusuf Demir',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Advanced',
    minAge: 15,
    totalXp: 1500,
    learningType: 'moderated',
    tier: 'More',
    durationLabel: '6 weeks - live sessions twice a week',
    toolsUsed: ['Godot', 'GLSL', 'ShaderToy'],
    prerequisites: [
      'Comfortable with GDScript or similar',
      'Basic linear algebra (vectors, dot product)'
    ],
    studentsCompletedCount: 54,
    testimonials: [
      {
        id: 'testimonial-elin',
        author: 'Elin S.',
        role: 'Completed Advanced Shader Programming',
        quote: 'The lighting model module rewired how I think about materials entirely.'
      }
    ],
    certificate: {
      name: 'Advanced Shader Programming Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: [{ id: 'mc-custom-shaders', name: 'Custom Shader Authoring' }]
    },
    curriculum: [
      {
        id: 'module-asp-shader-pipeline',
        title: 'The Shader Pipeline',
        items: [
          { id: 'item-asp-vertex-fragment', type: 'topic', title: 'Vertex vs fragment shaders', xp: 0, contentType: 'video' },
          { id: 'item-asp-first-shader', type: 'task', title: 'Write your first fragment shader', xp: 200, contentType: 'video' },
          { id: 'item-asp-uv-survey', type: 'survey', title: 'How familiar are you with UV coordinates?', xp: 0, contentType: 'text' }
        ]
      },
      {
        id: 'module-asp-lighting-models',
        title: 'Lighting Models',
        items: [
          { id: 'item-asp-lighting-resource', type: 'resource', title: 'Phong vs PBR lighting cheat sheet', xp: 0, contentType: 'text' },
          { id: 'item-asp-toon-shader', type: 'task', title: 'Build a toon/cel-shaded lighting model', xp: 300, contentType: 'video' },
          { id: 'item-asp-rim-light', type: 'task', title: 'Add rim lighting to a character shader', xp: 200, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-asp-procedural-effects',
        title: 'Procedural Effects',
        items: [
          { id: 'item-asp-noise-functions', type: 'topic', title: 'Noise functions for procedural motion', xp: 0, contentType: 'video' },
          { id: 'item-asp-water-shader', type: 'task', title: 'Create an animated water surface shader', xp: 300, contentType: 'video' },
          { id: 'item-asp-dissolve-shader', type: 'task', title: 'Build a dissolve/disintegration effect', xp: 250, contentType: 'gif' }
        ]
      },
      {
        id: 'module-asp-optimization-ship',
        title: 'Optimization & Shipping',
        items: [
          { id: 'item-asp-perf-resource', type: 'resource', title: 'Profiling shader performance', xp: 0, contentType: 'text' },
          { id: 'item-asp-mobile-optimize', type: 'task', title: 'Optimize a shader for mobile GPUs', xp: 250, contentType: 'slideshow' },
          { id: 'item-asp-final-survey', type: 'survey', title: 'Rate your confidence writing custom shaders now', xp: 0, contentType: 'text' }
        ]
      }
    ]
  },
  {
    id: 'narrative-design-workshop',
    title: 'Narrative Design Workshop',
    description: 'Branch dialogue and pace story beats around player choice.',
    image: '/images/img/generic-image.png',
    facilitator: 'Grace Odum',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Intermediate',
    minAge: 12,
    totalXp: 1200,
    learningType: 'moderated',
    tier: 'Core',
    durationLabel: '5 weeks - one live workshop per week',
    toolsUsed: ['Twine', 'Google Docs'],
    prerequisites: ['Comfortable writing dialogue or short fiction'],
    studentsCompletedCount: 97,
    testimonials: [
      {
        id: 'testimonial-omar',
        author: 'Omar F.',
        role: 'Completed Narrative Design Workshop',
        quote: 'Watching classmates get lost in my branch was the best feedback I could have asked for.'
      }
    ],
    certificate: {
      name: 'Narrative Design Workshop Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: []
    },
    curriculum: [
      {
        id: 'module-ndw-story-structure',
        title: 'Story Structure Basics',
        items: [
          { id: 'item-ndw-beats', type: 'topic', title: 'Mapping story beats to player choice', xp: 0, contentType: 'video' },
          { id: 'item-ndw-outline', type: 'task', title: 'Outline a branching story with 3 major choices', xp: 150, contentType: 'slideshow' },
          { id: 'item-ndw-structure-survey', type: 'survey', title: 'How comfortable are you outlining branching stories?', xp: 0, contentType: 'text' }
        ]
      },
      {
        id: 'module-ndw-branching-dialogue',
        title: 'Branching Dialogue',
        items: [
          { id: 'item-ndw-twine-resource', type: 'resource', title: 'Getting started with Twine', xp: 0, contentType: 'text' },
          { id: 'item-ndw-dialogue-tree', type: 'task', title: 'Build a 3-branch dialogue tree in Twine', xp: 200, contentType: 'video' },
          { id: 'item-ndw-voice', type: 'task', title: 'Give two characters distinct dialogue voices', xp: 150, contentType: 'text' }
        ]
      },
      {
        id: 'module-ndw-pacing-consequence',
        title: 'Pacing & Consequence',
        items: [
          { id: 'item-ndw-callback', type: 'task', title: 'Write a choice with a payoff two scenes later', xp: 200, contentType: 'slideshow' },
          { id: 'item-ndw-pacing-playtest', type: 'task', title: 'Playtest your branch for pacing dead spots', xp: 150, contentType: 'text' }
        ]
      },
      {
        id: 'module-ndw-workshop-ship',
        title: 'Workshop & Ship',
        items: [
          { id: 'item-ndw-peer-review', type: 'task', title: "Peer-review a classmate's branching script", xp: 150, contentType: 'text' },
          { id: 'item-ndw-final-branch', type: 'task', title: 'Finalize and format your branching scene for handoff', xp: 200, contentType: 'slideshow' },
          { id: 'item-ndw-final-survey', type: 'survey', title: 'What part of branching narrative was hardest?', xp: 0, contentType: 'text' }
        ]
      }
    ]
  },
  {
    id: '3d-character-modeling',
    title: '3D Character Modeling',
    description: 'Sculpt, retopologize, and rig a game-ready character.',
    image: '/images/img/games/game-built.png',
    facilitator: 'Renee Castillo',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Advanced',
    minAge: 14,
    totalXp: 1650,
    learningType: 'moderated',
    tier: 'More',
    durationLabel: '7 weeks - live sessions twice a week',
    toolsUsed: ['Blender'],
    prerequisites: ['Comfortable with basic 3D navigation (Blender or similar)'],
    studentsCompletedCount: 61,
    testimonials: [
      {
        id: 'testimonial-tessa',
        author: 'Tessa B.',
        role: 'Completed 3D Character Modeling',
        quote: 'Retopology finally made sense once I saw it as redrawing the mesh on top of my sculpt.'
      }
    ],
    certificate: {
      name: '3D Character Modeling Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: [{ id: 'mc-game-ready-character', name: 'Game-Ready Character Model' }]
    },
    curriculum: [
      {
        id: 'module-3dcm-base-mesh',
        title: 'Base Mesh Basics',
        items: [
          { id: 'item-3dcm-topology', type: 'topic', title: 'Topology principles for game-ready meshes', xp: 0, contentType: 'video' },
          { id: 'item-3dcm-blockout', type: 'task', title: 'Block out a base humanoid mesh', xp: 200, contentType: 'video' },
          { id: 'item-3dcm-topology-survey', type: 'survey', title: 'How confident are you with mesh topology?', xp: 0, contentType: 'text' }
        ]
      },
      {
        id: 'module-3dcm-sculpting',
        title: 'Sculpting Detail',
        items: [
          { id: 'item-3dcm-sculpt-resource', type: 'resource', title: 'Sculpting brush reference sheet', xp: 0, contentType: 'image' },
          { id: 'item-3dcm-sculpt-face', type: 'task', title: 'Sculpt facial detail on your base mesh', xp: 250, contentType: 'video' },
          { id: 'item-3dcm-sculpt-clothing', type: 'task', title: 'Sculpt clothing/armor folds', xp: 250, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-3dcm-retopology',
        title: 'Retopology & UVs',
        items: [
          { id: 'item-3dcm-retopo', type: 'task', title: 'Retopologize your sculpt into a game-ready mesh', xp: 300, contentType: 'video' },
          { id: 'item-3dcm-unwrap', type: 'task', title: 'Unwrap UVs with minimal stretching', xp: 200, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-3dcm-texture-rig-prep',
        title: 'Texture & Rig Prep',
        items: [
          { id: 'item-3dcm-bake', type: 'task', title: 'Bake normal and detail maps from your sculpt', xp: 250, contentType: 'video' },
          { id: 'item-3dcm-texture', type: 'task', title: 'Paint a base color texture', xp: 200, contentType: 'image' },
          { id: 'item-3dcm-final-survey', type: 'survey', title: 'How ready do you feel to rig this character next?', xp: 0, contentType: 'text' }
        ]
      }
    ]
  },
  {
    id: 'multiplayer-networking-fundamentals',
    title: 'Multiplayer Networking Fundamentals',
    description: 'Sync state across clients without the game feeling laggy.',
    image: '/images/img/default-bg.png',
    facilitator: 'Owen Vasquez',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Advanced',
    minAge: 14,
    totalXp: 1450,
    learningType: 'moderated',
    tier: 'More',
    durationLabel: '7 weeks - live sessions twice a week',
    toolsUsed: ['Godot', 'ENet'],
    prerequisites: [
      'Completed Ship Your First Game or equivalent project experience',
      'Comfortable with basic networking concepts (client/server)'
    ],
    studentsCompletedCount: 38,
    testimonials: [
      {
        id: 'testimonial-jonas',
        author: 'Jonas R.',
        role: 'Completed Multiplayer Networking Fundamentals',
        quote: 'Simulating packet loss on purpose taught me more than any amount of reading about it.'
      }
    ],
    certificate: {
      name: 'Multiplayer Networking Fundamentals Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: []
    },
    curriculum: [
      {
        id: 'module-mnf-client-server',
        title: 'Client-Server Basics',
        items: [
          { id: 'item-mnf-topology', type: 'topic', title: 'Client-server vs peer-to-peer topology', xp: 0, contentType: 'video' },
          { id: 'item-mnf-first-connection', type: 'task', title: 'Establish a basic client-server connection', xp: 200, contentType: 'video' },
          { id: 'item-mnf-topology-survey', type: 'survey', title: 'How familiar are you with networking before this program?', xp: 0, contentType: 'text' }
        ]
      },
      {
        id: 'module-mnf-state-sync',
        title: 'State Synchronization',
        items: [
          { id: 'item-mnf-sync-resource', type: 'resource', title: 'Authoritative server vs client prediction', xp: 0, contentType: 'text' },
          { id: 'item-mnf-sync-position', type: 'task', title: 'Sync player position across two clients', xp: 250, contentType: 'video' },
          { id: 'item-mnf-interpolation', type: 'task', title: 'Add interpolation to smooth remote movement', xp: 250, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-mnf-latency-lag',
        title: 'Latency & Lag Compensation',
        items: [
          { id: 'item-mnf-lag-compensation', type: 'task', title: 'Implement basic lag compensation for hits', xp: 300, contentType: 'video' },
          { id: 'item-mnf-jitter', type: 'task', title: 'Test your sync under simulated packet loss', xp: 200, contentType: 'text' }
        ]
      },
      {
        id: 'module-mnf-ship-multiplayer',
        title: 'Ship It',
        items: [
          { id: 'item-mnf-matchmaking', type: 'task', title: 'Wire up a simple lobby/matchmaking flow', xp: 250, contentType: 'slideshow' },
          { id: 'item-mnf-final-survey', type: 'survey', title: 'Rate your confidence debugging desync issues now', xp: 0, contentType: 'text' }
        ]
      }
    ]
  },
  {
    id: 'game-audio-music-composition',
    title: 'Game Audio & Music Composition',
    description: 'Score adaptive music that reacts to what the player does.',
    image: '/images/img/default-image.png',
    facilitator: 'Mira Solano',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Beginner',
    minAge: 10,
    totalXp: 1050,
    learningType: 'self-paced',
    tier: 'Explore',
    durationLabel: '4 weeks - about 2 hrs/week, at your own pace',
    toolsUsed: ['LMMS', 'Bosca Ceoil'],
    prerequisites: [],
    studentsCompletedCount: 143,
    testimonials: [
      {
        id: 'testimonial-wren',
        author: 'Wren A.',
        role: 'Completed Game Audio & Music Composition',
        quote: 'Building the combat layer that fades in on its own was the moment this clicked for me.'
      }
    ],
    certificate: {
      name: 'Game Audio & Music Composition Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: []
    },
    curriculum: [
      {
        id: 'module-gamc-music-basics',
        title: 'Music Basics for Games',
        items: [
          { id: 'item-gamc-loops', type: 'topic', title: 'Why game music loops differently than film scores', xp: 0, contentType: 'video' },
          { id: 'item-gamc-first-loop', type: 'task', title: 'Compose a 30-second looping theme', xp: 150, contentType: 'video' },
          { id: 'item-gamc-basics-survey', type: 'survey', title: 'How much music theory do you already know?', xp: 0, contentType: 'text' }
        ]
      },
      {
        id: 'module-gamc-adaptive-music',
        title: 'Adaptive Music',
        items: [
          { id: 'item-gamc-layers-resource', type: 'resource', title: 'Layered vs horizontal re-sequencing explained', xp: 0, contentType: 'text' },
          { id: 'item-gamc-combat-layer', type: 'task', title: 'Add a combat layer that fades in over your theme', xp: 200, contentType: 'video' },
          { id: 'item-gamc-transition', type: 'task', title: 'Build a smooth transition between two music states', xp: 200, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-gamc-sfx-scoring',
        title: 'Scoring to Picture',
        items: [
          { id: 'item-gamc-stinger', type: 'task', title: 'Write a musical stinger for a level-complete moment', xp: 150, contentType: 'video' },
          { id: 'item-gamc-mix', type: 'task', title: 'Mix your score against placeholder game audio', xp: 150, contentType: 'slideshow' }
        ]
      },
      {
        id: 'module-gamc-export-ship',
        title: 'Export & Ship',
        items: [
          { id: 'item-gamc-export-resource', type: 'resource', title: 'Exporting loop-safe audio files', xp: 0, contentType: 'text' },
          { id: 'item-gamc-final-track', type: 'task', title: 'Finalize and export your adaptive music set', xp: 200, contentType: 'video' },
          { id: 'item-gamc-final-survey', type: 'survey', title: 'Which part of adaptive music clicked for you?', xp: 0, contentType: 'text' }
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
  },
  {
    id: 'instance-sound-design-basics',
    programId: 'sound-design-basics',
    cohorts: [
      {
        id: 'cohort-sdb-self-paced',
        instanceId: 'instance-sound-design-basics',
        startDate: null,
        endDate: null,
        maxLearners: null,
        seatsTaken: 0
      }
    ]
  },
  {
    id: 'instance-advanced-shader-programming',
    programId: 'advanced-shader-programming',
    cohorts: [
      {
        id: 'cohort-asp-fall',
        instanceId: 'instance-advanced-shader-programming',
        startDate: '2026-09-01',
        endDate: '2026-11-03',
        maxLearners: 20,
        seatsTaken: 11
      }
    ]
  },
  {
    id: 'instance-narrative-design-workshop',
    programId: 'narrative-design-workshop',
    cohorts: [
      {
        id: 'cohort-ndw-fall',
        instanceId: 'instance-narrative-design-workshop',
        startDate: '2026-09-14',
        endDate: '2026-11-09',
        maxLearners: 18,
        seatsTaken: 6
      }
    ]
  },
  {
    id: 'instance-3d-character-modeling',
    programId: '3d-character-modeling',
    cohorts: [
      {
        id: 'cohort-3dcm-fall',
        instanceId: 'instance-3d-character-modeling',
        startDate: '2026-09-21',
        endDate: '2026-11-16',
        maxLearners: 16,
        seatsTaken: 12
      }
    ]
  },
  {
    id: 'instance-multiplayer-networking-fundamentals',
    programId: 'multiplayer-networking-fundamentals',
    cohorts: [
      {
        id: 'cohort-mnf-fall',
        instanceId: 'instance-multiplayer-networking-fundamentals',
        startDate: '2026-10-05',
        endDate: '2026-12-07',
        maxLearners: 20,
        seatsTaken: 5
      }
    ]
  },
  {
    id: 'instance-game-audio-music-composition',
    programId: 'game-audio-music-composition',
    cohorts: [
      {
        id: 'cohort-gamc-self-paced',
        instanceId: 'instance-game-audio-music-composition',
        startDate: null,
        endDate: null,
        maxLearners: null,
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

// A cohort with no start date (self-paced) is always "started"; otherwise
// compare against today using the same UTC-midnight normalization
// cohortStatusFor's closed-date check uses, to avoid a server-timezone skew.
export function cohortHasStarted(cohort: Cohort, today = new Date()): boolean {
  if (cohort.startDate === null) return true
  const todayUtcMidnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const startsAt = new Date(cohort.startDate).getTime()
  return startsAt <= todayUtcMidnight
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
