import type { ProgramTemplate } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/usePlayerCurriculum'

interface StoredProgress {
  version: 1
  completedItemIds: string[]
}

function storageKey(programId: string) {
  return `player-progress:${programId}`
}

// Per-item completion has no backend to live in, so it's tracked entirely
// client-side in localStorage, keyed by programId only — there's one
// mock-learner concept in this app (the dev-only "PREVIEW AS" toggle isn't
// a real multi-account system), so finer keying would be unused complexity.
export function useProgramProgress(template: ProgramTemplate) {
  const completedItemIds = useState<Set<string>>(`player-progress-${template.id}`, () => new Set())

  onMounted(() => {
    if (!import.meta.client) return
    const raw = localStorage.getItem(storageKey(template.id))
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as StoredProgress
      completedItemIds.value = new Set(parsed.completedItemIds)
    } catch {
      // Corrupt/old localStorage value — ignore and start fresh.
    }
  })

  function persist() {
    if (!import.meta.client) return
    const payload: StoredProgress = { version: 1, completedItemIds: [...completedItemIds.value] }
    localStorage.setItem(storageKey(template.id), JSON.stringify(payload))
  }

  function isCompleted(itemId: string) {
    return completedItemIds.value.has(itemId)
  }

  function markComplete(itemId: string) {
    if (completedItemIds.value.has(itemId)) return
    completedItemIds.value = new Set(completedItemIds.value).add(itemId)
    persist()
  }

  const items = flattenCurriculum(template)

  const completedCount = computed(() => items.filter(item => completedItemIds.value.has(item.id)).length)
  const totalXpAvailable = computed(() => items.reduce((sum, item) => sum + item.xp, 0))
  const totalXpEarned = computed(() =>
    items.filter(item => completedItemIds.value.has(item.id)).reduce((sum, item) => sum + item.xp, 0)
  )
  const progressPercent = computed(() =>
    items.length === 0 ? 0 : Math.round((completedCount.value / items.length) * 100)
  )

  return { isCompleted, markComplete, progressPercent, totalXpEarned, totalXpAvailable }
}
