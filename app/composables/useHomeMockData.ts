export type PreviewState = 'active' | 'new' | 'guest'

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

export const programRecs = [
  { name: 'Intro to Game Design', description: 'Build your first playable prototype, one task at a time.', tasksCount: 8, status: 'Beginner', image: '/images/img/bg-threadbare.png' },
  { name: 'Pixel Art Foundations', description: 'Draw, animate, and export sprite art for your games.', tasksCount: 6, status: 'Beginner', image: '/images/img/generic-image.png' },
  { name: 'Ship Your First Game', description: 'Take a project from idea to a shared, playable build.', tasksCount: 10, status: 'Intermediate', image: '/images/img/games/game-built.png' }
]

export const openTasks = [
  { name: 'Fix ladder-climb collision', status: 'New', project: 'threadbare · GitHub', projectImage: '/images/icons/github-mark.svg', due: '3 days', dueSoon: false },
  { name: 'Grey-box your first level', status: 'In Progress', project: 'Intro to Game Design', projectImage: '/images/img/default-bg.png', due: 'Friday', dueSoon: true },
  { name: 'Title-screen mockup', status: 'Feedback', project: 'Pixel Art Foundations', projectImage: '/images/img/generic-image.png', due: 'Today', dueSoon: true },
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
  { mon: 'JUL', day: '24', title: 'Playtest build due', meta: 'Intro to Game Design · task deadline', kind: 'program' },
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
