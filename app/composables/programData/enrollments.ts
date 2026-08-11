import type { PreviewState } from '~/composables/usePreviewState'
import type { EnrollmentRecord } from './types'

// Keyed by the app-wide preview state, so the program shell answers to the same
// switch every other page does. Which programs a state is enrolled in is what
// decides whether the classroom or the pitch renders, and each record's
// `progress` is what seeds how far in (see useProgramEnrollment.ts).
//
// The instances/cohorts pointed at are real ones from instances.ts, but these
// are independent preview scenarios rather than one learner's history — the
// cohort a record names won't always line up with "today" the way instances.ts's
// own schedule data does. Educator Training has no instances (see instances.ts)
// so it can't appear here; every other program does.
export const enrollmentsByPhase: Record<PreviewState, EnrollmentRecord[]> = {
  guest: [],
  // A brand-new account: signed in, joined nothing. Same empty catalog and
  // pitch-everywhere program pages a guest sees, but with an account behind it.
  fresh: [],
  // Joined one program and hasn't started it: the classroom opens on the first
  // lesson, and every other program still shows its pitch. Matches the catalog,
  // where Explore: Godot is the one program a new learner is in.
  new: [
    {
      programId: 'explore-godot',
      instanceId: 'instance-explore-godot-2026-08-am',
      cohortId: 'cohort-explore-godot-dawn-patrol',
      phase: 'new',
      progress: 0,
      enrolledAt: '2026-08-06'
    }
  ],
  // Order matters: the home page's continue-learning card resumes the first
  // record, so the flagship program leads.
  onboarded: [
    {
      programId: 'core-threadbare',
      instanceId: 'instance-core-threadbare-utp',
      cohortId: 'cohort-core-threadbare-night-owls',
      phase: 'onboarded',
      progress: 35,
      enrolledAt: '2026-07-02'
    },
    // Explore: Godot is the only program with three instances, so it's what
    // would exercise "already enrolled" in a multi-session enrollment card —
    // though that card lives on the Overview tab, which only non-enrolled
    // visitors see, so the branch is unreachable until an enrolled surface
    // renders it.
    {
      programId: 'explore-godot',
      instanceId: 'instance-explore-godot-2026-08-am',
      cohortId: 'cohort-explore-godot-dawn-patrol',
      phase: 'onboarded',
      progress: 40,
      enrolledAt: '2026-07-15'
    },
    {
      programId: 'explore-threadbare',
      instanceId: 'instance-explore-threadbare-self-paced',
      cohortId: 'cohort-explore-threadbare-self-paced',
      phase: 'onboarded',
      progress: 15,
      enrolledAt: '2026-08-04'
    }
  ]
}
