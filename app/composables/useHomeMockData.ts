import { programTemplates } from '~/composables/programData/templates'
import { enrollmentsByPhase } from '~/composables/programData/enrollments'
import { enrollmentPercent } from '~/composables/useProgramEnrollment'
import type { PreviewState } from '~/composables/usePreviewState'
// Straight from the module, not the useProgramMockData barrel, which re-exports
// this file's own consumers.
import { avatarForName } from '~/composables/programData/avatars'

export const userName = 'Nova'
// Resolved through the same registry every other face on the platform uses, so
// the signed-in user looks like herself wherever she turns up.
export const userAvatar = avatarForName(userName)
export const streakDays = 6
export const notificationCount = 13

export interface TopbarStats {
  xpLabel: string
  streakDays: number
  notificationCount: number
}

// The bare consts above are the onboarded learner's numbers. A new learner is
// signed in and gets the same bar, but has not earned any of it yet — so the
// counters start at zero rather than inheriting someone else's streak. Same
// split `weekCellsFor` makes for the streak card.
//
// `xpTotal` comes from the caller's own useXpBalance() call (see
// useXpBalance.ts) rather than being read in here, so this stays a plain
// function safely callable from inside a computed rather than a composable
// that needs its own onMounted hydration.
export function topbarStatsFor(isOnboarded: boolean, xpTotal: number): TopbarStats {
  return isOnboarded
    ? { xpLabel: `${xpTotal.toLocaleString()} XP`, streakDays, notificationCount }
    : { xpLabel: '0 XP', streakDays: 0, notificationCount: 0 }
}

export interface PostComment {
  id: string
  author: string
  avatar?: string
  time: string
  body: string
  isMentor?: boolean
}

export interface FeedPost {
  id: string
  cat: 'announce' | 'game' | 'program'
  author: string
  avatar?: string
  time: string
  image?: string
  likes: number
  comments: PostComment[]
  body: string
  isMentor?: boolean
}

export const feedPosts: FeedPost[] = [
  {
    id: 'p1',
    cat: 'announce',
    author: 'Endless Studios',
    avatar: '/images/logo-endless.svg',
    time: 'Today',
    likes: 132,
    comments: [
      { id: 'p1-c1', author: 'mika.builds', time: '2h ago', body: 'Count me in! Anyone looking for an artist teammate?' },
      { id: 'p1-c2', author: 'Mx. Rivera', time: '1h ago', body: '@mika.builds I might have a team for you, DMing now.', isMentor: true }
    ],
    body: 'Creator Jam 2026 registration is open! Team up, build a game in 48 hours, and demo it at the summer showcase. Spots are limited — grab yours.'
  },
  {
    id: 'p2',
    cat: 'game',
    author: 'Threadbare team',
    time: 'Yesterday',
    image: '/images/img/bg-threadbare.png',
    likes: 87,
    comments: [
      { id: 'p2-c1', author: 'Endstar team', time: '5h ago', body: 'Loom minigame looks great, congrats on the ship!' }
    ],
    body: 'v0.9 "Loom" is live — the weaving minigame ships today, plus smoother sheep pathfinding and 12 community-made quilt patterns.'
  },
  {
    id: 'p3',
    cat: 'program',
    author: 'Mx. Rivera',
    time: 'Yesterday',
    likes: 24,
    isMentor: true,
    comments: [
      { id: 'p3-c1', author: 'creator', time: '3h ago', body: 'Does grey-boxing mean no textures at all?' }
    ],
    body: 'Week 3 brief is up: block out one core mechanic in grey boxes before Friday’s playtest. Bring one question about your game loop to the session.'
  },
  {
    id: 'p4',
    cat: 'program',
    author: 'mika.builds',
    time: '2 days ago',
    image: '/images/img/generic-image.png',
    likes: 56,
    comments: [
      { id: 'p4-c1', author: 'Endless Studios', time: '1d ago', body: 'The gradient sky is gorgeous, nice work @mika.builds!' }
    ],
    body: 'First pass at my sunset title screen — built the whole scene in Endstar’s editor. Palette feedback welcome!'
  },
  {
    id: 'p5',
    cat: 'game',
    author: 'Endstar team',
    time: '3 days ago',
    likes: 63,
    comments: [
      { id: 'p5-c1', author: 'Threadbare team', time: '2d ago', body: 'Remixable worlds is huge, trying this today.' }
    ],
    body: 'Endstar 1.4 adds remixable sample worlds — open any featured world, press Remix, and make it yours.'
  }
]

/**
 * The resume card for a preview state, or nothing when that state isn't
 * enrolled anywhere. Read from the same enrollment fixture the program page
 * uses, so home can't disagree about which program they're in or how far along.
 */
export function continueLearningFor(state: PreviewState) {
  const enrollment = enrollmentsByPhase[state][0]
  const template = programTemplates.find(t => t.id === enrollment?.programId)
  if (!template || !enrollment) return undefined
  return {
    id: template.id,
    name: template.title,
    image: template.image,
    progress: enrollmentPercent(template, enrollment.progress)
  }
}

// Derived from the real catalog rather than restated, so the home page can
// never drift from what /learn and the program pages show. Educator programs
// are excluded: they train facilitators to run programs, so they have no place
// in a learner's recommendations.
export const programRecs = programTemplates
  .filter(template => template.audience !== 'educator')
  .map(template => ({
    id: template.id,
    name: template.title,
    description: template.description,
    sessionCount: template.sessionCount,
    sessionUnit: template.sessionUnit,
    status: template.difficulty,
    image: template.image
  }))

export const openTasks = [
  { name: 'Fix ladder-climb collision', status: 'New', project: 'threadbare · GitHub', projectImage: '/images/icons/github-mark.svg', due: '3 days', dueSoon: false },
  { name: 'Grey-box your first level', status: 'In Progress', project: 'Explore: Godot', projectImage: '/images/img/bg-threadbare.png', due: 'Friday', dueSoon: true },
  { name: 'Draft your StoryQuest idea', status: 'Feedback', project: 'Core: Threadbare', projectImage: '/images/img/bg-threadbare.png', due: 'Today', dueSoon: true },
  { name: 'Balance enemy spawn rates', status: 'In Review', project: 'threadbare · GitHub', projectImage: '/images/icons/github-mark.svg', due: 'Next week', dueSoon: false }
]

export interface Bounty {
  title: string
  game: string
  amt: string
  img: string
}

export const bounties: Bounty[] = [
  { title: 'Design a boss intro cutscene', game: 'Ink Drinker', amt: '$40', img: '/images/img/games/endstar-avatar.png' },
  { title: 'Fix double-jump collision bug', game: 'Pixel Racer', amt: '$25', img: '/images/img/generic-image.png' },
  { title: 'Compose a 30s title theme', game: 'Star Weaver', amt: '$60', img: '/images/img/default-image.png' }
]

export interface UpcomingEvent {
  mon: string
  day: string
  title: string
  meta: string
  kind: 'community' | 'program' | 'github'
}

export const upcomingEvents: UpcomingEvent[] = [
  { mon: 'JUL', day: '22', title: 'Creator Jam kickoff', meta: 'Community event · 4:00 PM', kind: 'community' },
  { mon: 'JUL', day: '24', title: 'Playtest build due', meta: 'Core: Threadbare · task deadline', kind: 'program' },
  { mon: 'JUL', day: '28', title: 'Threadbare v1.0 milestone', meta: 'GitHub · threadbare', kind: 'github' },
  { mon: 'AUG', day: '01', title: 'Summer Show & Tell', meta: 'Community event · live demos', kind: 'community' }
]

export interface GettingStartedItem {
  label: string
  done: boolean
}

/**
 * The checklist reads back what the state has actually done. A fresh account
 * has only the account itself; a new learner has filled in a profile and joined
 * a program, which is exactly what makes them a new learner rather than a fresh
 * account.
 */
export function gettingStartedItemsFor(state: PreviewState): GettingStartedItem[] {
  const joinedAProgram = enrollmentsByPhase[state].length > 0
  return [
    { label: 'Create your account', done: true },
    { label: 'Complete your profile', done: joinedAProgram },
    { label: 'Join your first program', done: joinedAProgram },
    { label: 'Play a community game', done: false },
    { label: 'Say hi in the community feed', done: false }
  ]
}

export interface PathChoice {
  id: string
  // Split from `title` rather than baked into it: the card sets the shared
  // "I want to" on its own line, smaller and lighter, so the part that differs
  // between the three carries the weight.
  lead: string
  title: string
  description: string
  image: string
  // Overlay colour as a literal hex, not a platform token: these are the
  // Endless Studios marketing site's art-directed pairings for these exact
  // paintings, so they answer to the artwork rather than to a brand role.
  tint: string
  // A choice with `to` renders as a link; without one it renders as a plain
  // block, so nothing claims to navigate when it doesn't.
  to?: string
}

// The signed-out "What brings you here?" row. Three reasons someone arrives at
// Endless Studios, each pointing at a different part of the platform — the
// real content, not a signup wall. Guests browse freely; the wall (via
// signUpTo/PATH_DESTINATIONS in useAuthIntent.ts, which encodes these exact
// same destinations) only shows up once they try to commit to something
// inside — enrolling, commenting, joining Threadbare's build effort.
export const pathChoices: PathChoice[] = [
  {
    id: 'learn',
    lead: 'I want to',
    to: '/learn?audience=learner',
    title: 'Learn to make games',
    description: 'Join a program or workshop and learn alongside other creators',
    image: '/images/img/paths/path-learn.jpg',
    tint: '#BA3852'
  },
  {
    id: 'teach',
    lead: 'I want to',
    to: '/learn?audience=educator',
    title: 'Teach game making',
    description: 'Bring game making to your learners with training, materials, and fellow educators',
    image: '/images/img/paths/path-teach.jpg',
    tint: '#7857E4'
  },
  {
    id: 'build',
    lead: 'I want to',
    to: '/play/threadbare#contribute',
    title: 'Help make the games',
    description: 'Contribute to real games alongside the makers behind them',
    image: '/images/img/paths/path-build.jpg',
    tint: '#5AAEE8'
  }
]

export interface WeekCell {
  letter: string
  kind: 'done' | 'today' | 'up' | 'off'
}

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function weekCellsFor(isOnboarded: boolean): WeekCell[] {
  const kinds: WeekCell['kind'][] = isOnboarded
    ? ['done', 'today', 'up', 'up', 'up', 'off', 'off']
    : ['today', 'up', 'up', 'up', 'up', 'off', 'off']
  return WEEKDAY_LETTERS.map((letter, i) => ({ letter, kind: kinds[i] }))
}
