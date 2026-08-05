// SYNTHESIZED: the Knowledge Base describes what programs teach, never any
// achievement scheme, so the whole badge set is invented.
//
// Icons are placeholders picked from lucide, per the brief — swap them for real
// badge artwork when it exists. Names and requirement text are not here: they
// are learner-facing copy and live in the locale files under
// `program.courseBadges.list.<id>`.

export interface ProgramBadge {
  id: string
  icon: string
}

/** Everything the badge rules can be evaluated against. */
export interface BadgeProgressStats {
  lessonsCompleted: number
  tasksDelivered: number
  xpEarned: number
  progressPercent: number
  modulesCompleted: number
}

export const programBadges: ProgramBadge[] = [
  { id: 'first-lesson', icon: 'lucide:footprints' },
  { id: 'first-delivery', icon: 'lucide:package-check' },
  { id: 'module-cleared', icon: 'lucide:layers' },
  { id: 'halfway', icon: 'lucide:milestone' },
  { id: 'xp-collector', icon: 'lucide:zap' },
  { id: 'finisher', icon: 'lucide:trophy' }
]

const RULES: Record<string, (stats: BadgeProgressStats) => boolean> = {
  'first-lesson': stats => stats.lessonsCompleted >= 1,
  'first-delivery': stats => stats.tasksDelivered >= 1,
  'module-cleared': stats => stats.modulesCompleted >= 1,
  'halfway': stats => stats.progressPercent >= 50,
  'xp-collector': stats => stats.xpEarned >= 500,
  'finisher': stats => stats.progressPercent >= 100
}

export function isBadgeEarned(badgeId: string, stats: BadgeProgressStats): boolean {
  return RULES[badgeId]?.(stats) ?? false
}
