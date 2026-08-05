import { programTemplates } from '~/composables/programData/templates'
import { enrollmentsByPhase } from '~/composables/programData/enrollments'

export type PreviewState = 'active' | 'new' | 'guest'

export const userName = 'Nova'
export const streakDays = 6
export const xpLabel = '2,450 XP'
export const notificationCount = 13

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

// The in-progress program shown at the top of home for an active learner,
// read from the same enrollment fixture the program page uses so the two can't
// disagree about which program they're in or how far along they are.
// First record wins — see the ordering note in programData/enrollments.ts.
const activeEnrollment = enrollmentsByPhase.enrolled[0]

export const continueLearningTemplate = programTemplates.find(
  t => t.id === activeEnrollment?.programId
)

export const continueLearning = (() => {
  if (!continueLearningTemplate || !activeEnrollment) return undefined
  return {
    id: continueLearningTemplate.id,
    name: continueLearningTemplate.title,
    image: continueLearningTemplate.image,
    progress: activeEnrollment.progress
  }
})()

// Derived from the real catalog rather than restated, so the home page can
// never drift from what /learn and the program pages show. Educator Training
// is excluded: it trains facilitators to run programs, so it has no place in a
// learner's recommendations.
export const programRecs = programTemplates
  .filter(template => template.id !== 'educator-training')
  .map(template => ({
    id: template.id,
    name: template.title,
    description: template.description,
    tasksCount: template.curriculum.reduce((sum, mod) => sum + mod.items.length, 0),
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

export const gettingStartedItems: GettingStartedItem[] = [
  { label: 'Create your account', done: true },
  { label: 'Complete your profile', done: true },
  { label: 'Join your first program', done: false },
  { label: 'Play a community game', done: false },
  { label: 'Say hi in the community feed', done: false }
]

export interface WeekCell {
  letter: string
  kind: 'done' | 'today' | 'up' | 'off'
}

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function weekCellsFor(isActive: boolean): WeekCell[] {
  const kinds: WeekCell['kind'][] = isActive
    ? ['done', 'today', 'up', 'up', 'up', 'off', 'off']
    : ['today', 'up', 'up', 'up', 'up', 'off', 'off']
  return WEEKDAY_LETTERS.map((letter, i) => ({ letter, kind: kinds[i] }))
}
