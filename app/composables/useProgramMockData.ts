import type { Cohort, EnrollmentRecord, EnrollmentStatus } from './programData/types'
import { programInstances } from './programData/instances'

export * from './programData/types'
export * from './programData/credentials'
export * from './programData/curriculum'
export * from './programData/templates'
export * from './programData/instances'
export * from './programData/enrollments'
export * from './programData/projects'

/**
 * Precedence order matters: already-enrolled and self-paced both bypass the
 * seat/date/access-code logic entirely, since they're determined by the
 * learner's relationship to the program, not the cohort's own scheduling.
 */
export function cohortStatusFor(
  cohort: Cohort,
  enrollment: EnrollmentRecord | undefined,
  unlocked: boolean,
  today = new Date()
): EnrollmentStatus {
  if (enrollment && enrollment.cohortId === cohort.id) return 'already-enrolled'
  if (cohort.startDate === null) return 'self-paced-always-open'
  if (cohort.accessCode && !unlocked) return 'requires-access-code'

  // Date-only ISO strings, parsed as UTC midnight — same normalization
  // useLearnMockData.ts's cohortTimingOf uses, to avoid a server-timezone
  // skew putting "today" on the wrong side of the cohort's end date.
  const todayUtcMidnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const endsAt = cohort.endDate ? new Date(cohort.endDate).getTime() : Infinity
  if (endsAt < todayUtcMidnight) return 'closed'

  if (cohort.maxLearners !== null && cohort.seatsTaken >= cohort.maxLearners) return 'full'
  return 'open-with-seats'
}

// A cohort with no start date (self-paced) is always "started"; otherwise
// compare against today using the same UTC-midnight normalization
// cohortStatusFor's closed-date check uses, to avoid a server-timezone skew.
export function cohortHasStarted(cohort: Cohort, today = new Date()): boolean {
  if (cohort.startDate === null) return true
  const todayUtcMidnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const startsAt = new Date(cohort.startDate).getTime()
  return startsAt <= todayUtcMidnight
}

// Whether a new learner could book into this program at all — used to keep
// fully-booked programs (every cohort full) out of the /learn catalog.
// Programs with no matching instance (catalog-only mock entries) are treated
// as available, since there's no cohort data to say otherwise.
export function hasAvailableCohort(programId: string): boolean {
  const cohorts = programInstances.filter(i => i.programId === programId).flatMap(i => i.cohorts)
  if (!cohorts.length) return true
  return cohorts.some(c => cohortStatusFor(c, undefined, false) !== 'full')
}
