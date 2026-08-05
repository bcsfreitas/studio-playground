import type { ProgramTemplate } from '~/composables/useProgramMockData'
import type { BadgeProgressStats } from '~/composables/programData/badges'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'
import { useProgramProgress } from '~/composables/useProgramProgress'

/**
 * The learner's counts for one program, derived from the same progress store
 * the classroom writes to. Both the metrics panel and the badge list read
 * these, so a badge can never disagree with the number that unlocked it.
 *
 * "Lessons" and "tasks" split on item type: a deliverable is something the
 * learner submits, everything else is something they work through.
 */
export function useProgramStats(template: ProgramTemplate) {
  const progress = useProgramProgress(template)
  const items = flattenCurriculum(template)

  const lessonsCompleted = computed(() =>
    items.filter(item => item.type !== 'deliverable' && progress.isCompleted(item.id)).length
  )
  const lessonsTotal = items.filter(item => item.type !== 'deliverable').length

  const tasksDelivered = computed(() =>
    items.filter(item => item.type === 'deliverable' && progress.isCompleted(item.id)).length
  )
  const tasksTotal = items.filter(item => item.type === 'deliverable').length

  const modulesCompleted = computed(() =>
    template.curriculum.filter(mod => mod.items.every(item => progress.isCompleted(item.id))).length
  )

  const badgeStats = computed<BadgeProgressStats>(() => ({
    lessonsCompleted: lessonsCompleted.value,
    tasksDelivered: tasksDelivered.value,
    xpEarned: progress.totalXpEarned.value,
    progressPercent: progress.progressPercent.value,
    modulesCompleted: modulesCompleted.value
  }))

  return {
    progress,
    lessonsCompleted,
    lessonsTotal,
    tasksDelivered,
    tasksTotal,
    modulesCompleted,
    badgeStats
  }
}
