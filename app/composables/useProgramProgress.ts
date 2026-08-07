import type { ProgramTemplate } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'
import { seededItemIds, useProgramEnrollment } from '~/composables/useProgramEnrollment'

export interface DeliverableSubmission {
  description: string
  links: string[]
}

interface StoredProgress {
  version: 2
  completedItemIds: string[]
  submissions: Record<string, DeliverableSubmission>
}

function storageKey(programId: string) {
  return `program-progress:${programId}`
}

// Per-item completion has no backend to live in, so it's tracked entirely
// client-side in localStorage, keyed by programId only — there's one
// mock-learner concept in this app (the dev-only "PREVIEW AS" toggle isn't
// a real multi-account system), so finer keying would be unused complexity.
export function useProgramProgress(template: ProgramTemplate) {
  const completedItemIds = useState<Set<string>>(`program-progress-${template.id}`, () => new Set())
  const submissions = useState<Record<string, DeliverableSubmission>>(
    `program-submissions-${template.id}`,
    () => ({})
  )

  onMounted(() => {
    if (!import.meta.client) return
    const raw = localStorage.getItem(storageKey(template.id))
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Partial<StoredProgress>
      completedItemIds.value = new Set(parsed.completedItemIds ?? [])
      submissions.value = parsed.submissions ?? {}
    } catch {
      // Corrupt/old localStorage value — ignore and start fresh.
    }
  })

  function persist() {
    if (!import.meta.client) return
    const payload: StoredProgress = {
      version: 2,
      completedItemIds: [...completedItemIds.value],
      submissions: submissions.value
    }
    localStorage.setItem(storageKey(template.id), JSON.stringify(payload))
  }

  // Where the learner already was when the preview state picked them up. It is
  // derived, never stored: switching states re-derives it, and a reset drops
  // back to whatever the new state implies rather than to an empty course.
  const { enrollment } = useProgramEnrollment(template.id)
  const seeded = computed(() => new Set(seededItemIds(template, enrollment.value?.progress ?? 0)))

  // Ticked lessons layer on top of the seed, so both count as done while only
  // the ticked ones are ever written to storage.
  const effectiveCompleted = computed(() => new Set([...seeded.value, ...completedItemIds.value]))

  function isCompleted(itemId: string) {
    return effectiveCompleted.value.has(itemId)
  }

  function markComplete(itemId: string) {
    if (completedItemIds.value.has(itemId)) return
    completedItemIds.value = new Set(completedItemIds.value).add(itemId)
    persist()
  }

  function getSubmission(itemId: string) {
    return submissions.value[itemId]
  }

  // Deliverables complete the same way every other item does — submitting
  // just also stashes what was submitted so it can be shown back to the
  // learner on revisit.
  function submitDeliverable(itemId: string, submission: DeliverableSubmission) {
    submissions.value = { ...submissions.value, [itemId]: submission }
    completedItemIds.value = new Set(completedItemIds.value).add(itemId)
    persist()
  }

  const items = flattenCurriculum(template)

  const completedCount = computed(() => items.filter(item => effectiveCompleted.value.has(item.id)).length)
  const totalXpAvailable = computed(() => items.reduce((sum, item) => sum + item.xp, 0))
  const totalXpEarned = computed(() =>
    items.filter(item => effectiveCompleted.value.has(item.id)).reduce((sum, item) => sum + item.xp, 0)
  )
  const progressPercent = computed(() =>
    items.length === 0 ? 0 : Math.round((completedCount.value / items.length) * 100)
  )

  // A module unlocks once every item in the module before it is complete —
  // the first module is always unlocked. Lessons within an unlocked module
  // can be visited in any order; locked modules can't be jumped into.
  function isModuleLocked(moduleId: string) {
    const moduleIndex = template.curriculum.findIndex(mod => mod.id === moduleId)
    if (moduleIndex <= 0) return false
    const previousModule = template.curriculum[moduleIndex - 1]!
    return !previousModule.items.every(item => effectiveCompleted.value.has(item.id))
  }

  return {
    isCompleted,
    markComplete,
    getSubmission,
    submitDeliverable,
    isModuleLocked,
    progressPercent,
    totalXpEarned,
    totalXpAvailable
  }
}
