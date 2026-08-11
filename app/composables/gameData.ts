import type { PostComment } from '~/composables/useHomeMockData'

// No games library exists anywhere in this app yet — this is the minimum
// Flow 4 (comment on a game) and Flow 6 (contribute) need to have somewhere
// to live. `LinkedGame` (programData/types.ts) is the shape this borrows
// from rather than inventing a second, parallel one.
export interface Game {
  id: string
  name: string
  image: string
  description: string
  /** Threadbare only, for now — Flow 6's entry point. */
  hasContribute?: boolean
  comments: PostComment[]
}

export const games: Game[] = [
  {
    id: 'threadbare',
    name: 'Threadbare',
    image: '/images/img/bg-threadbare.png',
    description: 'The narrative adventure engine every Core: Threadbare learner builds their first StoryQuest in.',
    hasContribute: true,
    comments: [
      { id: 'threadbare-c1', author: 'mika.builds', time: '2h ago', body: 'The stitching mechanic in the second act genuinely surprised me.' },
      { id: 'threadbare-c2', author: 'Mx. Rivera', time: '1h ago', body: 'Glad it landed! That was the hardest sequence to playtest.', isMentor: true }
    ]
  },
  {
    id: 'endstar',
    name: 'Endstar',
    image: '/images/img/games/endstar-avatar.png',
    description: 'Our flagship adventure — build, remix, and share games from inside the world.',
    comments: [
      { id: 'endstar-c1', author: 'Endstar team', time: '5h ago', body: 'Loom minigame looks great, congrats on the ship!' }
    ]
  }
]

export function gameById(id: string) {
  return games.find(g => g.id === id)
}
