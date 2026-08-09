export type OnboardingFlowId = '2a' | '4'

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
  /** The item whose completion is the flow's first win — see DESIGN.md's celebration-state note. */
  isFirstWin?: boolean
}

interface StoredChecklist {
  version: 1
  doneIds: string[]
}

function storageKey(flowId: OnboardingFlowId, contextId: string) {
  return `onboarding-checklist:${flowId}:${contextId}`
}

// One item set per flow, matched to that flow's exact checklist in
// docs/brain/onboarding-flows-boundary-consent.md. Hardcoded per flow rather
// than a generic rules engine — flows 1a/1b/1c/3/5/6 aren't built yet, and
// guessing their shape now would just be dead code to maintain.
const FLOW_ITEMS: Record<OnboardingFlowId, { id: string, labelKey: string, isFirstWin?: boolean }[]> = {
  '2a': [
    { id: 'account-created', labelKey: 'onboarding.checklist.items.accountCreated' },
    { id: 'code-of-conduct', labelKey: 'onboarding.checklist.items.codeOfConduct' },
    { id: 'introduce-yourself', labelKey: 'onboarding.checklist.items.introduceYourself' },
    { id: 'first-task', labelKey: 'onboarding.checklist.items.submitFirstTask', isFirstWin: true }
  ],
  '4': [
    { id: 'account-created', labelKey: 'onboarding.checklist.items.accountCreated' },
    { id: 'code-of-conduct', labelKey: 'onboarding.checklist.items.codeOfConduct' },
    { id: 'first-comment', labelKey: 'onboarding.checklist.items.postFirstComment', isFirstWin: true }
  ]
}

/**
 * A flow-scoped, multi-mount checklist. Two components (`ChecklistCard`,
 * `ChecklistMirror`) call this with the same `(flowId, contextId)` pair and
 * share one piece of state — ticking an item from either surface updates
 * both instantly, per the doc's explicit requirement that the checklist be
 * "one component with one state, rendered in two places."
 *
 * `contextId` scopes storage per enrollment/comment-thread — there's one
 * mock-learner concept in this app, so this only needs to distinguish which
 * program or game the flow is attached to, the same reasoning
 * useProgramProgress uses for keying by programId alone.
 */
export function useOnboardingChecklist(flowId: OnboardingFlowId, contextId: string) {
  const { t } = useI18n()
  const doneIds = useState<Set<string>>(`onboarding-checklist-${flowId}-${contextId}`, () => new Set(['account-created']))

  onMounted(() => {
    if (!import.meta.client) return
    const raw = localStorage.getItem(storageKey(flowId, contextId))
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Partial<StoredChecklist>
      doneIds.value = new Set(parsed.doneIds ?? ['account-created'])
    } catch {
      // Corrupt/old localStorage value — ignore and start fresh.
    }
  })

  function persist() {
    if (!import.meta.client) return
    const payload: StoredChecklist = { version: 1, doneIds: [...doneIds.value] }
    localStorage.setItem(storageKey(flowId, contextId), JSON.stringify(payload))
  }

  const items = computed<ChecklistItem[]>(() =>
    FLOW_ITEMS[flowId].map(item => ({
      id: item.id,
      label: t(item.labelKey),
      done: doneIds.value.has(item.id),
      isFirstWin: item.isFirstWin
    }))
  )

  function toggle(itemId: string) {
    if (doneIds.value.has(itemId)) return
    doneIds.value = new Set(doneIds.value).add(itemId)
    persist()
  }

  const completedCount = computed(() => items.value.filter(i => i.done).length)
  const totalCount = computed(() => items.value.length)
  const isComplete = computed(() => completedCount.value === totalCount.value)
  const nextItem = computed(() => items.value.find(i => !i.done))

  return { items, toggle, completedCount, totalCount, isComplete, nextItem }
}
