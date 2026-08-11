import type { ProgramTemplate, StudioOwner } from './types'
import { curriculumByProgram } from './curriculum'
import { resourcesByProgram } from './resources'
import { microcredentials } from './credentials'

// Copied rather than imported from useProgramMockData.ts: that file is the
// barrel and re-exports this module, so importing back from it is a cycle.
const ENDLESS_STUDIOS: StudioOwner = { name: 'Endless Studios', logo: '/images/logo-endless.svg' }

// No learner quote in the Knowledge Base docs is attributable to a real
// person, and every program here replaces a fully invented catalog — so every
// template gets an empty testimonials list rather than putting words in a
// fabricated learner's mouth.
const NO_TESTIMONIALS: ProgramTemplate['testimonials'] = []

export const programTemplates: ProgramTemplate[] = [
  {
    id: 'core-threadbare',
    title: 'Core: Threadbare',
    description: 'A structured, group-based game-making experience. Build and submit a StoryQuest — a playable Godot mini-game for the live Threadbare repo — across five milestones, then open a GitHub pull request to ship it.',
    image: '/images/img/bg-threadbare.png',
    // SYNTHESIZED: no single named facilitator exists in source — Core: Threadbare
    // runs across many partner sites and UTP GameLab cohorts, each with its own
    // local facilitator, so there's no one program-level name to use.
    facilitator: 'Marisol Vega',
    studioOwner: ENDLESS_STUDIOS,
    // Every extracted deck is explicitly the "(English)" source; 03-program-design-lessons.md:47-49
    // notes Spanish is a first-class community language, but no translated deck exists to source from.
    language: 'English',
    audience: 'learner',
    // SYNTHESIZED: no difficulty label exists in source. Inferred from the program's
    // own shape — five milestones, Git/GitHub workflow, a full playable prototype —
    // set against Explore: Threadbare and Explore: Godot below.
    difficulty: 'Intermediate',
    // SYNTHESIZED: no per-program age floor is stated. Uses the platform's own
    // Digital Youth self-signup threshold (01-company-and-platform-overview.md:42),
    // acknowledging that partner-run cohorts (Restricted Partner accounts) can and
    // do include younger learners bulk-enrolled by their school.
    minAge: 13,
    // Sum of this program's curriculum.ts item xp values — see that file's XP
    // constant for why the per-item numbers themselves are synthesized.
    totalXp: 1225,
    // Facilitated cohorts at partner sites, plus a self-paced way in for a
    // learner with no site behind them — see this program's instances.
    tier: 'Core',
    sessionCount: 18,
    sessionUnit: 'session',
    milestoneCount: 5,
    curriculum: curriculumByProgram['core-threadbare']!,
    toolsUsed: ['Discord', 'Git', 'GitHub', 'Godot'],
    // Source: Core-Threadbare/curriculum.md's "Before we start" and "Endless Studios
    // Platform" front-matter slides (lines 78-99) — the program's own stated setup list.
    prerequisites: [
      'A Discord account, and Git, GitHub, and Godot installed on your computer',
      'An Endless Studios Platform account (email learning@endlessaccess.org if you need an access code)'
    ],
    // 02-programs-and-offerings.md:8 — "~575 contributed in 2025", the one real
    // completion figure this program has in source.
    studentsCompletedCount: 575,
    testimonials: NO_TESTIMONIALS,
    certificate: {
      name: 'Core: Threadbare Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: [microcredentials['community-game-making']!]
    }
  },
  {
    id: 'explore-threadbare',
    title: 'Explore: Threadbare',
    description: 'Thirteen one-hour workshops across game design, art, engineering, and go-to-market. Self-paced: start the day you enroll and work through all thirteen at your own pace.',
    image: '/images/img/bg-threadbare.png',
    // SYNTHESIZED: no named facilitator in source — these workshops run through
    // many partner educators (Urban Arts, Glasswing, Wichita, etc.), not one person.
    facilitator: 'Theo Okonkwo',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    audience: 'learner',
    // SYNTHESIZED: no difficulty label in source. Set below Core: Threadbare and
    // Explore: Godot since each workshop is a self-contained one-hour session with
    // no assumed prior game-making experience.
    difficulty: 'Beginner',
    // SYNTHESIZED: 02-programs-and-offerings.md:11 notes "a 5-session variant exists
    // for older learners" — implying the standard 13-workshop version targets a
    // younger band than that variant. No exact floor is stated.
    minAge: 10,
    totalXp: 2765,
    // The one program with no cohort at all: no dates, no facilitated meetings
    // (see its instance in instances.ts).
    tier: 'Explore',
    // Workshops, not sessions: each is a self-contained hour
    // (Explore-Threadbare/curriculum.md:5). All thirteen make up the program.
    sessionCount: 13,
    sessionUnit: 'workshop',
    curriculum: curriculumByProgram['explore-threadbare']!,
    // Godot, Threadbare Pixel Stitch, and the Threadbare Melody Loom are the tools
    // named across the Engineering and Art workshop decks (sessions.md).
    toolsUsed: ['Godot', 'Threadbare Pixel Stitch', 'Threadbare Melody Loom'],
    // No prerequisite is stated anywhere in source — each workshop is designed to
    // be joined cold, per curriculum.md's "standalone" framing.
    prerequisites: [],
    // 02-programs-and-offerings.md:11 states no completion figure for this
    // program (workshops track attendance per session, not a program-level
    // "completed" count). 0 chosen over inventing a plausible-sounding number.
    studentsCompletedCount: 0,
    testimonials: NO_TESTIMONIALS,
    certificate: {
      name: 'Explore: Threadbare Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: [microcredentials['intro-game-making']!]
    }
  },
  {
    id: 'explore-godot',
    title: 'Explore: Godot',
    description: 'Ten sessions modding and building your own Threadbare-world platformer level in Godot — from your first Pong mod through a finished, playtested, and showcased level.',
    image: '/images/img/default-bg.png',
    // SYNTHESIZED: no named facilitator in source for the recurring program; only
    // the one real May-June 2026 cohort is documented, without a facilitator credit.
    facilitator: 'Lena Fitzgerald',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    audience: 'learner',
    // 02-programs-and-offerings.md:54 — "the 'no experience required' promise doesn't
    // match the current Explore: Godot reality -- it fits advanced beginners better
    // than absolute beginners." 'Beginner' is still the closest fit of the three
    // available levels, but that caveat is real, not invented.
    difficulty: 'Beginner',
    // SYNTHESIZED: no age floor stated. Set slightly above Explore: Threadbare's,
    // reflecting the same "fits advanced beginners" caveat above.
    minAge: 12,
    totalXp: 1200,
    // Dated cohorts and a self-paced option — see this program's instances.
    tier: 'Explore',
    // Explore-Godot/curriculum.md:3 — "Ten sessions, 60 minutes each."
    sessionCount: 10,
    sessionUnit: 'session',
    curriculum: curriculumByProgram['explore-godot']!,
    resources: resourcesByProgram['explore-godot']!,
    toolsUsed: ['Godot'],
    // No prerequisite is stated in source; see the difficulty comment above for
    // the one real caveat about who this program actually suits.
    prerequisites: [],
    // 02-programs-and-offerings.md:12 — "68 enrolled / 30 participated". 30 is
    // the one real completion figure this program has in source.
    studentsCompletedCount: 30,
    testimonials: NO_TESTIMONIALS,
    certificate: {
      name: 'Explore: Godot Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: [microcredentials['intro-game-making']!]
    }
  },
  {
    id: 'educator-training',
    title: 'Educator Training Program',
    description: 'Facilitator training for running Core: Threadbare — pedagogy, tools, and access codes, followed by a live walkthrough of Session 1 and the hero-creation activity you’ll model for your own learners.',
    image: '/images/img/default-image.png',
    // Educator-Training-Program/sessions.md:23 — one of the five named presenters
    // of this training deck ("Learning Programs Lead"), the closest thing to a
    // named facilitator this program has in source.
    facilitator: 'Justin Bourque',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    audience: 'educator',
    // SYNTHESIZED: no difficulty label in source. This trains adults to facilitate
    // a five-milestone cohort program, so 'Intermediate' fits better than 'Beginner'.
    difficulty: 'Intermediate',
    // No minAge: this trains adult facilitators, not learners, so the platform's
    // learner age-gate framing doesn't apply here.
    totalXp: 1190,
    tier: 'More',
    // SYNTHESIZED: no session count is stated for the training itself (unlike
    // the learner programs, which state theirs). Counted as its four curriculum
    // modules — Overview, Structure & Tools, Walk the Walk, To Wrap Up — even
    // though the deck runs as one sitting.
    sessionCount: 4,
    sessionUnit: 'session',
    curriculum: curriculumByProgram['educator-training']!,
    // Educator-Training-Program/sessions.md "Tools" slide names these three explicitly.
    toolsUsed: ['GitHub', 'Git', 'Godot'],
    // No prerequisite is stated — the training teaches these tools from scratch.
    prerequisites: [],
    // Facilitator-facing, not learner-facing — no completion tally exists in
    // source for this program, and it has no learner-style "graduates" either.
    studentsCompletedCount: 0,
    testimonials: NO_TESTIMONIALS,
    certificate: {
      name: 'Educator Training Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: []
    }
  }
]
