// The learner-facing lifecycle is the app-wide preview state — see
// docs/superpowers/specs/2026-08-05-program-page-shell-design.md for what it
// drives here (which tabs render, and what the first tab shows).
import type { PreviewState } from '~/composables/usePreviewState'

// Two ways into the same program, not two kinds of program: a cohort instance
// runs to a schedule with a facilitator and a group, a self-paced one is open
// every day and starts the moment a learner presses the button. A program can
// carry both — one instance each — and the enrollment card lists them side by
// side. Explore: Threadbare carries only the self-paced one, since its
// curriculum.md:5 says never to present it as a date range.
export type EnrollmentModel = 'cohort' | 'self-paced'

export type InstanceVisibility = 'public' | 'private'

export interface ProgramSession {
  id: string
  index: number
  title: string
  drivingQuestion?: string
  // ISO 8601, always with an explicit UTC designator — see instances.ts.
  // Absent on a self-paced instance, which has no schedule to place it on.
  startsAt?: string
  durationMinutes: number
}

export interface MicrocredentialCriterion {
  id: string
  label: string
}

// Who a program is for. Educator Training teaches adults to facilitate a
// program rather than to make a game, which is why it stays out of a learner's
// recommendations and can be filtered for on its own in the catalog.
export type ProgramAudience = 'learner' | 'educator'

// What a program calls its meetings. Explore: Threadbare's are workshops —
// standalone and individually joinable — and calling them sessions would imply
// a series you sign up to as a whole.
export type ProgramSessionUnit = 'session' | 'workshop'

export type ProgramTier = 'Explore' | 'Core' | 'More'
export type ProgramDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type CurriculumItemType = 'topic' | 'survey' | 'task' | 'resource' | 'deliverable'
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

export type CurriculumMediaKind = 'image' | 'slideshow' | 'video'

// A session's page content, authored as blocks rather than one markdown string
// so each piece maps onto a Nuxt UI component instead of needing a markdown
// renderer inside the classroom.
export type CurriculumBlock
  = | { kind: 'heading', text: string }
    | { kind: 'paragraph', text: string }
    | { kind: 'list', items: string[], ordered?: boolean }
    | { kind: 'note', text: string }
    // The source page has these as buttons/links but never spells out a URL,
    // so `href` is optional and the renderer disables the control without one.
    | { kind: 'link', label: string, href?: string }
    // A curated tool list: each entry is a named link with a line about what
    // it is for. The Creator Tools sessions are built entirely out of these.
    | { kind: 'linkList', items: { label: string, href?: string, description: string }[] }
    // Slide decks, screenshots, and video embeds the source page carries but
    // this app has no asset for yet — the scrape marks them `{{image}}`,
    // `{{slideshow}}`, `{{video}}`.
    | { kind: 'media', media: CurriculumMediaKind, caption?: string }
    // One Project Board issue inside a milestone: what to build, and what
    // "done" means for it. `hasTutorial` mirrors the source page's "[tutorial]"
    // marker — the link target itself is not in the scraped content.
    | { kind: 'task', title: string, text: string, acceptanceCriteria: string[], hasTutorial?: boolean }

export interface CurriculumItem {
  id: string
  type: CurriculumItemType
  title: string
  drivingQuestion?: string
  xp: number
  contentType: CurriculumContentType
  /** How a step is presented when opened. Defaults to 'drawer' — only a
   *  gating pre-survey needs the full-screen 'takeover' treatment. */
  presentation?: 'drawer' | 'takeover'
  acceptanceCriteria?: string[]
  body?: CurriculumBlock[]
}

export interface CurriculumModule {
  id: string
  title: string
  description?: string
  items: CurriculumItem[]
}

// A curated link list, not a lesson: no xp, no completion state, and it lives
// on its own Resources tab rather than inside the curriculum a learner steps
// through. Shares CurriculumBlock so the same ProgramSessionBody renderer
// (paragraph/linkList/note/etc.) works for both.
export interface ProgramResourceSection {
  id: string
  title: string
  body: CurriculumBlock[]
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
  issuer: string
  criteria: MicrocredentialCriterion[]
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
  audience: ProgramAudience
  difficulty: ProgramDifficulty
  minAge?: number
  totalXp: number
  linkedGame?: LinkedGame
  tier: ProgramTier
  // The program's own shape, not one instance's schedule: how many meetings it
  // runs, what it calls them, and — where the program is organised around them
  // — how many milestones those meetings are grouped into.
  sessionCount: number
  sessionUnit: ProgramSessionUnit
  milestoneCount?: number
  curriculum: CurriculumModule[]
  // Optional: only programs whose Resources tab has been built out carry
  // this. Others fall back to the tab's "not built yet" placeholder.
  resources?: ProgramResourceSection[]
  toolsUsed: string[]
  prerequisites: string[]
  studentsCompletedCount: number
  testimonials: Testimonial[]
  certificate: ProgramCertificate
}

// Whether the group itself is discoverable to the wider community — separate
// axis from ProgramInstance.visibility, which governs whether the instance is
// listed in the catalog at all. A closed cohort can be a public instance (any
// guest can see "Join — starts Sept 1") while the joined group's roster/feed
// stays invisible outside it once they're in.
export type CohortType = 'closed' | 'open'

export interface Cohort {
  id: string
  instanceId: string
  // A human group name ("Night Owls"), never "Cohort 3" — the word "cohort" is
  // a data-model term and must not reach learner-facing copy.
  name: string
  type: CohortType
  startDate: string | null
  endDate: string | null
  maxLearners: number | null
  seatsTaken: number
  accessCode?: string
}

export interface ProgramInstance {
  id: string
  programId: string
  enrollmentModel: EnrollmentModel
  visibility: InstanceVisibility
  scheduleLabel: string
  mentors: string[]
  sessions: ProgramSession[]
  deliveringInstitution?: DeliveringInstitution
  cohorts: Cohort[]
}

export interface EnrollmentRecord {
  programId: string
  instanceId: string
  cohortId: string
  phase: PreviewState
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

// A finished project a learner shipped through the program. The Overview tab
// shows a teaser gallery of these; the Projects tab is the full library.
export interface LearnerProject {
  id: string
  programId: string
  title: string
  image: string
  authorName: string
  blurb: string
}

// A channel in a program's community feed. `restricted` channels are for
// enrolled learners only — everyone else never sees them listed.
export interface ProgramChannel {
  id: string
  name: string
  icon: string
  restricted: boolean
}

export interface ChannelPost {
  id: string
  programId: string
  channelId: string
  author: string
  avatar?: string
  // Prose label shown to the learner ("2 days ago"), deliberately static —
  // deriving it at render would differ between server and client.
  time: string
  // ISO date, used only for ordering. `time` does not sort.
  postedAt: string
  body: string
  image?: string
  likes: number
  isMentor?: boolean
  comments: { id: string, author: string, time: string, body: string, isMentor?: boolean }[]
}

export interface ProgramMember {
  id: string
  name: string
  xp: number
}
