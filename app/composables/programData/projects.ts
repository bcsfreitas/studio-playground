import type { LearnerProject } from './types'

// SYNTHESIZED: no learner project records exist in the Knowledge Base docs —
// they describe what programs teach, not what individual learners shipped.
// Titles and blurbs below are written to match each program's actual
// deliverable (a StoryQuest for Core: Threadbare, a modded level for
// Explore: Godot) so the gallery reads as plausible output of that program.
//
// Thumbnails reuse existing assets; there is no per-project artwork yet.
const PLACEHOLDER_IMAGES = [
  '/images/img/games/game-built.png',
  '/images/img/generic-image.png',
  '/images/img/games/endstar-avatar.png',
  '/images/img/default-image.png'
] as const

export const learnerProjects: LearnerProject[] = [
  {
    id: 'proj-ct-lantern',
    programId: 'core-threadbare',
    title: 'The Lantern Keeper',
    image: PLACEHOLDER_IMAGES[0],
    authorName: 'Amara Diallo',
    blurb: 'A StoryQuest about relighting a village one lantern at a time.'
  },
  {
    id: 'proj-ct-stitch',
    programId: 'core-threadbare',
    title: 'Stitch & Seek',
    image: PLACEHOLDER_IMAGES[1],
    authorName: 'Ravi Chandra',
    blurb: 'Hide-and-seek where the world unravels behind you.'
  },
  {
    id: 'proj-ct-thread',
    programId: 'core-threadbare',
    title: 'Threadbound',
    image: PLACEHOLDER_IMAGES[2],
    authorName: 'Nia Fitzgerald',
    blurb: 'A puzzle quest built around a needle that rewrites terrain.'
  },
  {
    id: 'proj-eg-tower',
    programId: 'explore-godot',
    title: 'Tower of Odds',
    image: PLACEHOLDER_IMAGES[1],
    authorName: 'Sofia Marchetti',
    blurb: 'A vertical level where every platform rolls a die.'
  },
  {
    id: 'proj-eg-pong',
    programId: 'explore-godot',
    title: 'Pong, But Haunted',
    image: PLACEHOLDER_IMAGES[3],
    authorName: 'Desmond Cole',
    blurb: 'The Pong mod from Session 1, taken somewhere strange.'
  },
  {
    id: 'proj-et-drift',
    programId: 'explore-threadbare',
    title: 'Driftwood Market',
    image: PLACEHOLDER_IMAGES[0],
    authorName: 'Yuki Tanabe',
    blurb: 'A trading scene built across three workshop sessions.'
  },
  {
    id: 'proj-ct-mend',
    programId: 'core-threadbare',
    title: 'The Mending Hour',
    image: PLACEHOLDER_IMAGES[3],
    authorName: 'Tomas Berg',
    blurb: 'Every night the town unravels. You have until dawn to stitch it back.'
  },
  {
    id: 'proj-ct-spool',
    programId: 'core-threadbare',
    title: 'Spooltown',
    image: PLACEHOLDER_IMAGES[1],
    authorName: 'Leila Haddad',
    blurb: 'A village sim where the currency is thread and everyone owes someone.'
  },
  {
    id: 'proj-eg-cavern',
    programId: 'explore-godot',
    title: 'Cavern Run',
    image: PLACEHOLDER_IMAGES[2],
    authorName: 'Hana Kimura',
    blurb: 'Ten rooms, one torch, and a light meter that never stops dropping.'
  },
  {
    id: 'proj-eg-orbit',
    programId: 'explore-godot',
    title: 'Low Orbit Delivery',
    image: PLACEHOLDER_IMAGES[0],
    authorName: 'Zara Nkemdi',
    blurb: 'Physics-driven parcel drops. The parcels are not happy about it.'
  },
  {
    id: 'proj-et-signal',
    programId: 'explore-threadbare',
    title: 'Signal Garden',
    image: PLACEHOLDER_IMAGES[2],
    authorName: 'Elena Rossi',
    blurb: 'A one-hour build from the Game Feel workshop that grew legs.'
  },
  {
    id: 'proj-et-relay',
    programId: 'explore-threadbare',
    title: 'Relay',
    image: PLACEHOLDER_IMAGES[1],
    authorName: 'Marcus Idowu',
    blurb: 'Two players, one keyboard, no talking allowed.'
  }
]

export function projectsForProgram(programId: string): LearnerProject[] {
  return learnerProjects.filter(project => project.programId === programId)
}

// SYNTHESIZED: the docs give enrollment counts but never learner names, and
// there is no avatar artwork in the repo. Names feed initial-based UAvatars,
// matching how ProgramSocialProof already renders testimonial authors.
const SAMPLE_LEARNER_NAMES: Record<string, string[]> = {
  'core-threadbare': ['Amara Diallo', 'Ravi Chandra', 'Nia Fitzgerald', 'Tomas Berg', 'Leila Haddad'],
  'explore-threadbare': ['Yuki Tanabe', 'Marcus Idowu', 'Elena Rossi', 'Priya Sundaram'],
  'explore-godot': ['Sofia Marchetti', 'Desmond Cole', 'Hana Kimura', 'Owen Pryce', 'Zara Nkemdi'],
  'educator-training': []
}

export function sampleLearnersForProgram(programId: string): string[] {
  return SAMPLE_LEARNER_NAMES[programId] ?? []
}
