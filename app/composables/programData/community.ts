import type { ChannelPost, ProgramChannel, ProgramMember } from './types'
import { programInstances } from './instances'

// SYNTHESIZED: none of this exists in the Knowledge Base docs, which describe
// what programs teach rather than any community activity around them. The
// channel set below comes from the product spec; posts and members are written
// to sound like the programs they belong to.

// Announcements and Introductions are enrolled-only per the product spec, as
// are the per-group channels. General, Questions, Showcase and Resources are
// open to anyone browsing the program.
const SHARED_CHANNELS: ProgramChannel[] = [
  { id: 'announcements', name: 'Announcements', icon: 'lucide:megaphone', restricted: true },
  { id: 'introductions', name: 'Introductions', icon: 'lucide:hand', restricted: true },
  { id: 'general', name: 'General', icon: 'lucide:messages-square', restricted: false },
  { id: 'questions', name: 'Questions', icon: 'lucide:circle-help', restricted: false },
  { id: 'showcase', name: 'Showcase', icon: 'lucide:sparkles', restricted: false },
  { id: 'resources', name: 'Resources', icon: 'lucide:link', restricted: false }
]

/**
 * Channels for a program: the shared set, plus one per learner group.
 *
 * Group channels are named after the group itself ("Night Owls"), never
 * "#cohort-3" — "cohort" is a data-model term and must not reach learner-facing
 * copy. They are restricted for the same reason Announcements is: they belong
 * to the people actually in that group.
 */
export function channelsForProgram(programId: string): ProgramChannel[] {
  const groupChannels: ProgramChannel[] = programInstances
    .filter(instance => instance.programId === programId)
    .flatMap(instance => instance.cohorts)
    // A workshop series carries a placeholder group with no name; there is no
    // real group behind it, so it gets no channel.
    .filter(cohort => Boolean(cohort.name))
    .map(cohort => ({
      id: `group-${cohort.id}`,
      name: cohort.name,
      icon: 'lucide:users',
      restricted: true
    }))

  return [...SHARED_CHANNELS, ...groupChannels]
}

const POSTS: ChannelPost[] = [
  {
    id: 'post-ct-1',
    programId: 'core-threadbare',
    channelId: 'announcements',
    author: 'Carlos Medina',
    time: '2 days ago',
    isMentor: true,
    likes: 14,
    body: 'Milestone 3 working sessions start Monday. Bring whatever you have — half-built is exactly the right amount of built.',
    comments: [
      { id: 'c-ct-1a', author: 'Nia Fitzgerald', time: '1 day ago', body: 'Mine is more like a quarter built but I will be there.' }
    ]
  },
  {
    id: 'post-ct-2',
    programId: 'core-threadbare',
    channelId: 'showcase',
    author: 'Amara Diallo',
    time: '4 days ago',
    likes: 31,
    image: '/images/img/games/game-built.png',
    body: 'First playable build of The Lantern Keeper. The lighting still fights me but the loop works.',
    comments: [
      { id: 'c-ct-2a', author: 'Ravi Chandra', time: '3 days ago', body: 'The lantern glow is so good. How did you do the falloff?' },
      { id: 'c-ct-2b', author: 'Ana Ibarra', time: '3 days ago', isMentor: true, body: 'Really strong sense of place already. Ship it to the board when you can.' }
    ]
  },
  {
    id: 'post-ct-3',
    programId: 'core-threadbare',
    channelId: 'questions',
    author: 'Tomas Berg',
    time: '5 days ago',
    likes: 6,
    body: 'Does the pull request need to pass every check before review, or can I open it early for feedback?',
    comments: [
      { id: 'c-ct-3a', author: 'Carlos Medina', time: '5 days ago', isMentor: true, body: 'Open it early. Draft PRs are the whole point.' }
    ]
  },
  {
    id: 'post-ct-4',
    programId: 'core-threadbare',
    channelId: 'general',
    author: 'Leila Haddad',
    time: '1 week ago',
    likes: 9,
    body: 'Anyone else keep a notebook of ideas that will absolutely not fit in one StoryQuest?',
    comments: []
  },
  {
    id: 'post-eg-1',
    programId: 'explore-godot',
    channelId: 'general',
    author: 'Priya Sundaram',
    time: '3 days ago',
    isMentor: true,
    likes: 11,
    body: 'Reminder that Godot 4 and Godot 3 tutorials look almost identical and will absolutely waste your afternoon. Check the version first.',
    comments: [
      { id: 'c-eg-1a', author: 'Desmond Cole', time: '2 days ago', body: 'Learned this the hard way last night.' }
    ]
  },
  {
    id: 'post-eg-2',
    programId: 'explore-godot',
    channelId: 'showcase',
    author: 'Sofia Marchetti',
    time: '6 days ago',
    likes: 22,
    image: '/images/img/generic-image.png',
    body: 'Tower of Odds — every platform rolls a die when you land on it. Session 5 level design ideas, taken slightly too far.',
    comments: [
      { id: 'c-eg-2a', author: 'Hana Kimura', time: '5 days ago', body: 'This is delightful and also I fell off immediately.' }
    ]
  },
  {
    id: 'post-eg-3',
    programId: 'explore-godot',
    channelId: 'questions',
    author: 'Owen Pryce',
    time: '1 week ago',
    likes: 4,
    body: 'My Pong paddle moves twice as fast in the exported build as it does in the editor. Is that a delta time thing?',
    comments: [
      { id: 'c-eg-3a', author: 'Priya Sundaram', time: '1 week ago', isMentor: true, body: 'Almost certainly. Multiply your movement by delta in _process.' }
    ]
  },
  {
    id: 'post-et-1',
    programId: 'explore-threadbare',
    channelId: 'general',
    author: 'Yuki Tanabe',
    time: '2 days ago',
    likes: 8,
    body: 'Did the Narrative & Storytelling workshop yesterday with no prior sessions and it stood completely on its own. Recommended.',
    comments: []
  },
  {
    id: 'post-et-2',
    programId: 'explore-threadbare',
    channelId: 'showcase',
    author: 'Elena Rossi',
    time: '1 week ago',
    likes: 17,
    body: 'Driftwood Market, built across three workshops. Still no idea what the currency is.',
    comments: []
  }
]

export function postsForChannel(programId: string, channelId: string): ChannelPost[] {
  return POSTS.filter(post => post.programId === programId && post.channelId === channelId)
}

// SYNTHESIZED: XP totals have no source. Values are spread across a plausible
// range so the members list has visible ordering.
const MEMBERS: Record<string, ProgramMember[]> = {
  'core-threadbare': [
    { id: 'm-ct-1', name: 'Amara Diallo', xp: 2840 },
    { id: 'm-ct-2', name: 'Ravi Chandra', xp: 2310 },
    { id: 'm-ct-3', name: 'Nia Fitzgerald', xp: 1975 },
    { id: 'm-ct-4', name: 'Tomas Berg', xp: 1640 },
    { id: 'm-ct-5', name: 'Leila Haddad', xp: 1425 },
    { id: 'm-ct-6', name: 'Jonah Whitfield', xp: 1180 },
    { id: 'm-ct-7', name: 'Sana Qureshi', xp: 940 }
  ],
  'explore-godot': [
    { id: 'm-eg-1', name: 'Sofia Marchetti', xp: 1520 },
    { id: 'm-eg-2', name: 'Desmond Cole', xp: 1290 },
    { id: 'm-eg-3', name: 'Hana Kimura', xp: 1105 },
    { id: 'm-eg-4', name: 'Owen Pryce', xp: 860 },
    { id: 'm-eg-5', name: 'Zara Nkemdi', xp: 720 },
    { id: 'm-eg-6', name: 'Felix Andersen', xp: 505 }
  ],
  'explore-threadbare': [
    { id: 'm-xt-1', name: 'Yuki Tanabe', xp: 980 },
    { id: 'm-xt-2', name: 'Elena Rossi', xp: 815 },
    { id: 'm-xt-3', name: 'Marcus Idowu', xp: 640 },
    { id: 'm-xt-4', name: 'Priya Sundaram', xp: 590 },
    { id: 'm-xt-5', name: 'Ines Vargas', xp: 430 }
  ],
  'educator-training': []
}

export function membersForProgram(programId: string): ProgramMember[] {
  return MEMBERS[programId] ?? []
}
