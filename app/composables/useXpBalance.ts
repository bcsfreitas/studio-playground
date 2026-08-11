const STORAGE_KEY = 'xp-balance'

// The onboarded learner's starting total — matches the old hardcoded
// `xpLabel` constant this composable replaces in useHomeMockData.ts.
const BASE_XP = 2450

let hydrated = false

/**
 * The onboarded learner's XP total: still mock data, but now stateful so
 * claiming a checklist's reward (see useOnboardingChecklist.ts's `claim()`)
 * actually moves the number shown in the top bar. Same useState + localStorage
 * hydration shape as usePreviewState.ts.
 */
export function useXpBalance() {
  const total = useState<number>(STORAGE_KEY, () => BASE_XP)

  onMounted(() => {
    if (hydrated || !import.meta.client) return
    hydrated = true
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? Number(stored) : NaN
    if (Number.isFinite(parsed)) total.value = parsed
  })

  function addXp(amount: number) {
    total.value += amount
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, String(total.value))
  }

  return { total, addXp }
}
