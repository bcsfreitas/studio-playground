import type { CohortType } from './types'

// Independent of PreviewState (the mock-session lifecycle) on purpose — this
// is the doc's other axis, the individual's consent tier, and conflating the
// two axes is exactly the mistake the earlier PreviewState/LearnerPhase split
// was written to avoid repeating.
export type AccountStatus = 'restricted' | 'young-learner' | 'adult'

export const PREVIEW_ACCOUNT_STATUSES: { id: AccountStatus, label: string }[] = [
  { id: 'restricted', label: 'Restricted (NDPA)' },
  { id: 'young-learner', label: 'Young Learner' },
  { id: 'adult', label: 'Adult' }
]

// The moments where work or identity would cross a boundary out of its
// cohort. `join-open-cohort` is the only one that reads cohort type — the
// other three gate a young learner regardless of which cohort they're in,
// per the doc's M2b ("once, covers everything").
export type BoundaryAction = 'join-open-cohort' | 'publish-portfolio' | 'github-connect' | 'post-outward'

export interface ConsentCheck {
  gated: boolean
  reason: 'not-required' | 'deferred' | 'pending-vpc'
}

/**
 * The doc's own consent-matrix table, as one function instead of scattered
 * inline checks. Restricted and adult accounts are never gated — a
 * restricted account's work never leaves its institution's container at all,
 * an adult's consent is never required. A young learner is gated at
 * `join-open-cohort` only if the cohort is actually open; every other
 * boundary action gates them unconditionally, since those are personal
 * visibility moments the cohort's own openness doesn't change.
 */
export function checkConsentBoundary(
  status: AccountStatus,
  cohortType: CohortType,
  action: BoundaryAction
): ConsentCheck {
  if (status !== 'young-learner') return { gated: false, reason: 'not-required' }
  if (action === 'join-open-cohort') {
    return cohortType === 'open'
      ? { gated: true, reason: 'pending-vpc' }
      : { gated: false, reason: 'deferred' }
  }
  return { gated: true, reason: 'pending-vpc' }
}

export function useConsentBoundary() {
  return { check: checkConsentBoundary }
}
