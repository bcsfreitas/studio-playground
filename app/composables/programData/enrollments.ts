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
      programId: 'explore-threadbare',
      instanceId: 'instance-explore-threadbare-fall2026',
      cohortId: 'cohort-explore-threadbare-loom-weavers',
      phase: 'interested',
      progress: 0,
      enrolledAt: '2026-08-04'
    }
  ],
  // Order matters: the home page's continue-learning card resumes the first
  // record, so the flagship program leads.
  enrolled: [
    {
      programId: 'core-threadbare',
      instanceId: 'instance-core-threadbare-utp',
      cohortId: 'cohort-core-threadbare-night-owls',
      phase: 'enrolled',
      progress: 35,
      enrolledAt: '2026-07-02'
    },
    // A second enrolled program, so this phase isn't a single-program fixture.
    // Explore: Godot is the useful one to double up on: it's the only program
    // with three instances, so it's what would exercise "already enrolled" in a
    // multi-session enrollment card — though that card lives on the Overview
    // tab, which only non-enrolled visitors see, so the branch is unreachable
    // until an enrolled surface renders it.
    {
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
      programId: 'explore-godot',
      instanceId: 'instance-explore-godot-2026-05',
      cohortId: 'cohort-explore-godot-pioneers',
      phase: 'onboarded',
      progress: 100,
      enrolledAt: '2026-05-04'
    }
  ]
}
