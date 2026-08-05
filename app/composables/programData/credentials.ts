import type { Microcredential } from './types'

// Learners earn eligibility on this platform but claim the credential on ASU's
// external issuer site — never promise in-platform issuance in copy.
const ASU = 'Arizona State University'

// SYNTHESIZED: 02-programs-and-offerings.md gives each microcredential's name
// and criteria count (7 and 3) but no criteria text. Labels below are written
// to match the counts and the programs' stated outcomes; replace when the real
// criteria arrive.
export const microcredentials: Record<string, Microcredential> = {
  'community-game-making': {
    id: 'community-game-making',
    name: 'Community Game Making',
    issuer: ASU,
    criteria: [
      { id: 'cgm-1', label: 'Communicate a game idea others can understand and build on' },
      { id: 'cgm-2', label: 'Build a playable StoryQuest prototype in Godot' },
      { id: 'cgm-3', label: 'Use version control to track and share your work' },
      { id: 'cgm-4', label: 'Submit your work upstream through a pull request' },
      { id: 'cgm-5', label: 'Run a playtest and gather feedback from players' },
      { id: 'cgm-6', label: 'Refine your game in response to that feedback' },
      { id: 'cgm-7', label: 'Present and pitch your finished StoryQuest' }
    ]
  },
  'intro-game-making': {
    id: 'intro-game-making',
    name: 'Intro to Game Making',
    issuer: ASU,
    criteria: [
      { id: 'igm-1', label: 'Identify the elements that make a game a game' },
      { id: 'igm-2', label: 'Modify an existing game project using industry tools' },
      { id: 'igm-3', label: 'Share what you made and explain the choices behind it' }
    ]
  }
}
