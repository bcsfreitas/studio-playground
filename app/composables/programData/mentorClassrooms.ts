import type { PreviewState } from '~/composables/usePreviewState'
import type { Cohort } from './types'

export interface ClassroomLearner {
  name: string
  completion: number
}

export type MentorClassroomAgeRange = '8-10' | '10-12' | '12-14' | '14-16' | '16-18' | 'mixed'

// A mentor's private classroom is a Cohort (same fields: name, dates, seat
// cap, access token) that never enters the public catalog and is reached
// only through a magic link the mentor shares directly — never listed for
// browsing, so `type` is always 'closed'. `programId`/`createdAt`/`learners`
// are the mentor-ownership fields Cohort itself has no use for.
export interface MentorClassroom extends Cohort {
  programId: string
  createdAt: string
  learners: ClassroomLearner[]
  ageRange: MentorClassroomAgeRange
  // Whether students in this classroom are barred from interacting with other
  // users on the platform — a per-classroom setting, independent of:
  //  - Cohort.type: public *catalog discoverability*, already always 'closed'.
  //  - AccountStatus === 'restricted' (programData/consent.ts): a per-*account*
  //    NDPA consent tier, not a per-classroom toggle.
  //  - ProgramTemplate.minAge: the course's own age floor, not cross-validated
  //    against this in the create-classroom wizard (prototype scope).
  siloed: boolean
}

// This file is a static seed, same convention as enrollments.ts — the mutable
// layer (classrooms created via the /teach/new wizard) lives in
// useMentorClassrooms.ts, which merges its own useState/localStorage-backed
// list on top of this one rather than this file carrying persistence itself.
export const mentorClassroomsByPhase: Record<PreviewState, MentorClassroom[]> = {
  guest: [],
  fresh: [],
  new: [],
  onboarded: [
    {
      id: 'mentor-classroom-threadbare-night-owls',
      instanceId: 'instance-core-threadbare-mentor',
      programId: 'core-threadbare',
      name: 'Night Owls',
      type: 'closed',
      startDate: '2026-09-01',
      endDate: '2026-10-29',
      maxLearners: 24,
      seatsTaken: 18,
      accessCode: 'NIGHTOWL9',
      createdAt: '2026-08-05',
      ageRange: '12-14',
      siloed: false,
      learners: [
        { name: 'Amara Diallo', completion: 62 },
        { name: 'Ravi Chandra', completion: 48 },
        { name: 'Nia Fitzgerald', completion: 71 },
        { name: 'Tomas Berg', completion: 20 },
        { name: 'Leila Haddad', completion: 55 }
      ]
    },
    {
      id: 'mentor-classroom-godot-afterschool',
      instanceId: 'instance-explore-godot-mentor',
      programId: 'explore-godot',
      name: 'Afterschool Coders',
      type: 'closed',
      startDate: '2026-08-31',
      endDate: '2026-09-30',
      maxLearners: 16,
      seatsTaken: 9,
      accessCode: 'AFTRSCHL',
      createdAt: '2026-07-20',
      ageRange: '10-12',
      siloed: false,
      learners: [
        { name: 'Sofia Marchetti', completion: 80 },
        { name: 'Desmond Cole', completion: 33 },
        { name: 'Hana Kimura', completion: 45 },
        { name: 'Owen Pryce', completion: 12 }
      ]
    },
    {
      id: 'mentor-classroom-threadbare-selfpaced',
      instanceId: 'instance-explore-threadbare-mentor',
      programId: 'explore-threadbare',
      name: 'Summer Workshop Group',
      type: 'closed',
      startDate: null,
      endDate: null,
      maxLearners: null,
      seatsTaken: 6,
      accessCode: 'SUMMERWG',
      createdAt: '2026-06-28',
      ageRange: 'mixed',
      siloed: true,
      learners: [
        { name: 'Yuki Tanabe', completion: 90 },
        { name: 'Elena Rossi', completion: 64 },
        { name: 'Ines Vargas', completion: 30 }
      ]
    }
  ]
}
