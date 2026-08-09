import { PREVIEW_ACCOUNT_STATUSES, type AccountStatus } from '~/composables/programData/consent'

export type PreviewState = 'guest' | 'fresh' | 'new' | 'onboarded'

// Ordered as the story runs: signed out, signed in with nothing, joined a
// program, well into it.
export const PREVIEW_STATES: { id: PreviewState, label: string }[] = [
  { id: 'guest', label: 'Guest' },
  { id: 'fresh', label: 'Fresh Account' },
  { id: 'new', label: 'New Learner' },
  { id: 'onboarded', label: 'Onboarded' }
]

const STORAGE_KEY = 'preview-state'
const ACCOUNT_STATUS_STORAGE_KEY = 'account-status'

// Everything useProgramProgress writes, so a reset clears the whole mock
// session rather than just the state pill.
const PROGRESS_KEY_PREFIX = 'program-progress:'

function isPreviewState(value: unknown): value is PreviewState {
  return PREVIEW_STATES.some(s => s.id === value)
}

function isAccountStatus(value: unknown): value is AccountStatus {
  return PREVIEW_ACCOUNT_STATUSES.some(s => s.id === value)
}

// Four pages read this state, and each would otherwise re-read storage on its
// own mount — the first read wins and the rest are noise.
let hydrated = false
let accountStatusHydrated = false

/**
 * The dev-only "PREVIEW AS" state, shared by every page. There is no auth or
 * backend yet, so this one switch stands in for the session: who is signed in,
 * what they have earned, and whether they are enrolled.
 *
 * `useState` keeps it alive across client navigation; localStorage keeps it
 * across a reload. Both are needed — a state that resets when you move from
 * home to a program page cannot be used to walk through a flow.
 *
 * `AccountStatus` (below) rides the same file because it shares this exact
 * storage/hydration pattern and the same `reset()` — but it is a second,
 * independent axis, not a fifth `PreviewState` value. `PreviewState` narrates
 * where someone is in the mock-session lifecycle; `AccountStatus` narrates
 * their consent tier per docs/brain/onboarding-flows-boundary-consent.md.
 * Conflating the two would make either axis impossible to switch on its own.
 */
export function usePreviewState() {
  const state = useState<PreviewState>(STORAGE_KEY, () => 'guest')
  const accountStatus = useState<AccountStatus>(ACCOUNT_STATUS_STORAGE_KEY, () => 'adult')

  onMounted(() => {
    if (hydrated || !import.meta.client) return
    hydrated = true
    const stored = localStorage.getItem(STORAGE_KEY)
    // Anything unrecognised is a value from an older state set (`active`,
    // `enrolled`) or a hand-edit — fall through to the default rather than
    // rendering a state no page branches on.
    if (isPreviewState(stored)) state.value = stored
  })

  onMounted(() => {
    if (accountStatusHydrated || !import.meta.client) return
    accountStatusHydrated = true
    const stored = localStorage.getItem(ACCOUNT_STATUS_STORAGE_KEY)
    if (isAccountStatus(stored)) accountStatus.value = stored
  })

  watch(state, (value) => {
    if (!import.meta.client) return
    localStorage.setItem(STORAGE_KEY, value)
  })

  watch(accountStatus, (value) => {
    if (!import.meta.client) return
    localStorage.setItem(ACCOUNT_STATUS_STORAGE_KEY, value)
  })

  const isGuest = computed(() => state.value === 'guest')
  const isFresh = computed(() => state.value === 'fresh')
  const isNew = computed(() => state.value === 'new')
  const isOnboarded = computed(() => state.value === 'onboarded')
  const isLoggedIn = computed(() => !isGuest.value)

  // Signed in with nothing banked yet — a fresh account has joined nothing, a
  // new learner has joined one program but not started it. Both get the
  // beginner surfaces on home.
  const isStarting = computed(() => isFresh.value || isNew.value)

  /** Back to a first-ever visit: signed out, with no lesson progress banked. */
  function reset() {
    if (!import.meta.client) return
    Object.keys(localStorage)
      .filter(key => key === STORAGE_KEY || key === ACCOUNT_STATUS_STORAGE_KEY || key.startsWith(PROGRESS_KEY_PREFIX))
      .forEach(key => localStorage.removeItem(key))
    // Reload rather than assign `guest` here: useProgramProgress reads storage
    // once on mount, so its in-memory copy has to go with the page for the wipe
    // to show, and a fresh load already starts on the default state.
    window.location.reload()
  }

  return { state, isGuest, isFresh, isNew, isStarting, isOnboarded, isLoggedIn, accountStatus, reset }
}
