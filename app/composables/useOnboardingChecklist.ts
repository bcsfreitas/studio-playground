import { useXpBalance } from '~/composables/useXpBalance'

export type OnboardingFlowId = '2a' | '4' | '5' | '6'

/** The reward every flow's checklist claims once complete — see ChecklistCard.vue. */
export const CLAIM_XP_REWARD = 200

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
  /** The item whose completion is the flow's first win — see DESIGN.md's celebration-state note. */
  isFirstWin?: boolean
}

function claimedStorageKey(flowId: OnboardingFlowId, contextId: string) {
  return `onboarding-checklist-claimed:${flowId}:${contextId}`
}

interface FlowItemDef {
  id: string
  labelKey: string
  isFirstWin?: boolean
  /** Already satisfied by the time this flow's widget can mount — e.g. account
   * creation happened at the signup wall, before any checklist renders. */
  preChecked?: boolean
}

// One item set per flow, matched to that flow's exact checklist in
// docs/brain/onboarding-flows-boundary-consent.md. Hardcoded per flow rather
// than a generic rules engine — flows 1a/1b/1c/3 aren't built yet, and
// guessing their shape now would just be dead code to maintain.
const FLOW_ITEMS: Record<OnboardingFlowId, FlowItemDef[]> = {
  '2a': [
    { id: 'account-created', labelKey: 'onboarding.checklist.items.accountCreated', preChecked: true },
    { id: 'code-of-conduct', labelKey: 'onboarding.checklist.items.codeOfConduct' },
    { id: 'introduce-yourself', labelKey: 'onboarding.checklist.items.introduceYourself' },
    { id: 'first-task', labelKey: 'onboarding.checklist.items.submitFirstTask', isFirstWin: true }
  ],
  '4': [
    { id: 'account-created', labelKey: 'onboarding.checklist.items.accountCreated', preChecked: true },
    { id: 'code-of-conduct', labelKey: 'onboarding.checklist.items.codeOfConduct' },
    { id: 'first-comment', labelKey: 'onboarding.checklist.items.postFirstComment', isFirstWin: true }
  ],
  // Flow 5 — Educator. Its widget only ever mounts on a program's Home tab,
  // which itself only renders post-enrollment — so "join the program" is
  // already true by construction the moment this checklist can appear.
  '5': [
    { id: 'account-created', labelKey: 'onboarding.checklist.items.accountCreated', preChecked: true },
    { id: 'code-of-conduct', labelKey: 'onboarding.checklist.items.codeOfConduct' },
    { id: 'join-educator-program', labelKey: 'onboarding.checklist.items.joinEducatorProgram', isFirstWin: true, preChecked: true }
  ],
  // Flow 6 — Contributor. Renders only past the game page's VpcGate, so no
  // extra per-item gating is needed here for the GitHub-connect step.
  '6': [
    { id: 'account-created', labelKey: 'onboarding.checklist.items.accountCreated', preChecked: true },
    { id: 'code-of-conduct', labelKey: 'onboarding.checklist.items.codeOfConduct' },
    { id: 'connect-github', labelKey: 'onboarding.checklist.items.connectGithub' },
    { id: 'claim-first-task', labelKey: 'onboarding.checklist.items.claimFirstTask', isFirstWin: true }
  ]
}

/**
 * A flow-scoped checklist, keyed by `(flowId, contextId)` so every mount of
 * `ChecklistCard` for the same flow/context shares one piece of state.
 *
 * `contextId` scopes storage per enrollment/comment-thread — there's one
 * mock-learner concept in this app, so this only needs to distinguish which
 * program or game the flow is attached to, the same reasoning
 * useProgramProgress uses for keying by programId alone.
 */
export function useOnboardingChecklist(flowId: OnboardingFlowId, contextId: string, options: { startComplete?: () => boolean } = {}) {
  const { t } = useI18n()
  const { addXp } = useXpBalance()
  const claimed = useState<boolean>(`onboarding-checklist-claimed-${flowId}-${contextId}`, () => false)
  // A getter, not a plain boolean: callers pass a reactive source (e.g. a prop
  // tied to isOnboarded) whose value can change after this composable's setup
  // runs.
  const startComplete = computed(() => options.startComplete?.() ?? false)

  onMounted(() => {
    if (!import.meta.client) return
    if (localStorage.getItem(claimedStorageKey(flowId, contextId)) === '1') claimed.value = true
  })

  const items = computed<ChecklistItem[]>(() =>
    FLOW_ITEMS[flowId].map(item => ({
      id: item.id,
      label: t(item.labelKey),
      done: startComplete.value || !!item.preChecked,
      isFirstWin: item.isFirstWin
    }))
  )

  const completedCount = computed(() => items.value.filter(i => i.done).length)
  const totalCount = computed(() => items.value.length)
  const isComplete = computed(() => completedCount.value === totalCount.value)
  const nextItem = computed(() => items.value.find(i => !i.done))

  function claim() {
    if (claimed.value || !isComplete.value) return
    claimed.value = true
    if (import.meta.client) localStorage.setItem(claimedStorageKey(flowId, contextId), '1')
    addXp(CLAIM_XP_REWARD)
  }

  return { items, completedCount, totalCount, isComplete, nextItem, claimed, claim }
}
