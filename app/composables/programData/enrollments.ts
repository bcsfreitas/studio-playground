import type { EnrollmentRecord, LearnerPhase } from './types'

// One fixture per LearnerPhase, each pointing at a real instance/cohort from
// instances.ts, so the enrollment card and the tabbed shell have something
// real to key off while previewing a phase. These are independent preview
// scenarios, not one learner's history — the cohort a record points to won't
// always line up with "today" the way instances.ts's own schedule data does.
// Educator Training has no instances (see instances.ts) so it can't appear
// here; every other program does.
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
  // Onboarded is a placeholder phase: nothing branches on it yet, so it
  // resolves exactly like `enrolled`. It points at the one instance with a
  // real, already-finished date range (instances.ts's May 12 – June 11, 2026
  // cohort) so it is at least distinguishable while previewing.
  onboarded: [
    {
      learnerId: 'active',
      programId: 'explore-godot',
      instanceId: 'instance-explore-godot-2026-05',
      cohortId: 'cohort-explore-godot-pioneers',
      phase: 'onboarded',
      progress: 100,
      enrolledAt: '2026-05-04'
    }
  ]
}
