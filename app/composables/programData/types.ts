import type { PreviewState } from '~/composables/useHomeMockData'

// Learner-facing lifecycle. Drives which tabs render and what the first tab
// shows — see docs/superpowers/specs/2026-08-05-program-page-shell-design.md.
export type LearnerPhase = 'interested' | 'enrolled' | 'completed' | 'game-owner'

// Explore: Threadbare is explicitly not a cohort — its curriculum.md:5 says to
// present the 13 workshops as individually joinable sessions with their own
// dates, not as one date range. The enrollment card branches on this.
export type EnrollmentModel = 'cohort' | 'workshop-series'

export type InstanceVisibility = 'public' | 'private'

export interface ProgramSession {
  id: string
  index: number
  title: string
  drivingQuestion?: string
  startsAt: string        // ISO 8601
  durationMinutes: number
}

export interface MicrocredentialCriterion {
  id: string
  label: string
}

export type ProgramTier = 'Explore' | 'Core' | 'More'
export type ProgramDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type LearningType = 'self-paced' | 'moderated'
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

export interface CurriculumItem {
  id: string
  type: CurriculumItemType
  title: string
  xp: number
  contentType: CurriculumContentType
  acceptanceCriteria?: string[]
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
  // Real figures from 02-programs-and-offerings.md where the doc states one.
  graduateCount: number
}

export interface Cohort {
  id: string
  instanceId: string
  // A human group name ("Night Owls"), never "Cohort 3" — the word "cohort" is
  // a data-model term and must not reach learner-facing copy.
  name: string
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
  learnerId: PreviewState
  programId: string
  instanceId: string
  cohortId: string
  phase: LearnerPhase
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
