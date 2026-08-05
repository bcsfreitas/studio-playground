import type { EnrollmentRecord, LearnerPhase } from './types'

// One fixture per LearnerPhase, each pointing at a real instance/cohort from
// instances.ts, so the enrollment card and the tabbed shell have something
// real to key off while previewing a phase. These are independent
// preview scenarios, not one learner's history — the cohort a record points
// to won't always line up with "today" the way instances.ts's own schedule
// data does (e.g. game-owner points at a cohort that hasn't started yet by
// the calendar). Educator Training has no instances (see instances.ts) so it
// can't appear here; every other program does.
export const enrollmentsByPhase: Record<LearnerPhase, EnrollmentRecord[]> = {
  interested: [
    {
      learnerId: 'active',
      programId: 'explore-threadbare',
      instanceId: 'instance-explore-threadbare-fall2026',
      cohortId: 'cohort-explore-threadbare-loom-weavers',
      phase: 'interested',
      progress: 0,
      enrolledAt: '2026-08-04'
    }
  ],
  enrolled: [
    {
      learnerId: 'active',
      programId: 'explore-godot',
      instanceId: 'instance-explore-godot-2026-08-am',
      cohortId: 'cohort-explore-godot-dawn-patrol',
      phase: 'enrolled',
      progress: 40,
      enrolledAt: '2026-07-15'
    }
  ],
  completed: [
    {
      learnerId: 'active',
      // The one instance with a real, already-finished date range
      // (instances.ts's May 12 – June 11, 2026 cohort).
      programId: 'explore-godot',
      instanceId: 'instance-explore-godot-2026-05',
      cohortId: 'cohort-explore-godot-pioneers',
      phase: 'completed',
      progress: 100,
      enrolledAt: '2026-05-04'
    }
  ],
  'game-owner': [
    {
      learnerId: 'active',
      // Core: Threadbare completion ships a StoryQuest PR into the live
      // Threadbare repo — the one program whose completion makes the
      // learner an owner of a real, published game.
      programId: 'core-threadbare',
      instanceId: 'instance-core-threadbare-utp',
      cohortId: 'cohort-core-threadbare-night-owls',
      phase: 'game-owner',
      progress: 100,
      enrolledAt: '2026-05-01'
    }
  ]
}
