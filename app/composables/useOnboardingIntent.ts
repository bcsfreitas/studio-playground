import type { OnboardingFlowId } from '~/composables/useOnboardingChecklist'

export type OnboardingIntent = 'learner' | 'educator' | 'contributor'

const STORAGE_KEY = 'onboarding-intent'

// Fresh Account's answer to "What brings you here?" (docs/brain/onboarding-flows-boundary-consent.md's
// M4 fallback question), mapped to the checklist flow it unlocks. The
// context ids are sentinels distinct from any real program id, since a Fresh
// Account hasn't enrolled in anything yet — this checklist doesn't carry
// over once they actually enroll and become a New Learner.
export const INTENT_FLOWS: Record<OnboardingIntent, { flowId: OnboardingFlowId, contextId: string }> = {
  learner: { flowId: '2a', contextId: 'fresh-learner' },
  educator: { flowId: '5', contextId: 'fresh-educator' },
  contributor: { flowId: '6', contextId: 'fresh-contributor' }
}

function isOnboardingIntent(value: unknown): value is OnboardingIntent {
  return value === 'learner' || value === 'educator' || value === 'contributor'
}

// One hydration per session, same reasoning as usePreviewState.ts: several
// components read this, and only the first mount needs to touch storage.
let hydrated = false

/**
 * Which of the three "What brings you here?" cards a Fresh Account picked.
 * Persisted like usePreviewState so it survives navigation and reload; wiped
 * by usePreviewState's reset() alongside the rest of the mock session.
 */
export function useOnboardingIntent() {
  const intent = useState<OnboardingIntent | null>(STORAGE_KEY, () => null)

  onMounted(() => {
    if (hydrated || !import.meta.client) return
    hydrated = true
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isOnboardingIntent(stored)) intent.value = stored
  })

  function setIntent(value: OnboardingIntent) {
    intent.value = value
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, value)
  }

  return { intent, setIntent }
}
