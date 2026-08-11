import type { CurriculumItem, CurriculumModule, ProgramTemplate } from '~/composables/useProgramMockData'

export interface FlatCurriculumItem extends CurriculumItem {
  moduleId: string
  moduleTitle: string
}

// A module's XP is a single payout on completion, not one per item inside
// it — so only the last item (the one that closes the module out) carries
// it, rolled up from what the module's items would otherwise have summed
// to. Every earlier item's `xp` reads as 0 wherever this output is used.
export function withAwardableXp(modules: CurriculumModule[]): CurriculumModule[] {
  return modules.map(mod => {
    const moduleXp = mod.items.reduce((sum, item) => sum + item.xp, 0)
    return {
      ...mod,
      items: mod.items.map((item, index) => ({
        ...item,
        xp: index === mod.items.length - 1 ? moduleXp : 0
      }))
    }
  })
}

// Shared by the classroom's own step list and the step drawer's sidebar nav,
// so a module's lock state and tally can't drift between the two surfaces.
export interface CurriculumModuleSummary {
  id: string
  title: string
  items: CurriculumItem[]
  isLocked: boolean
  completedCount: number
}

// Flattens a program's modules into one ordered list — both the program
// content sidebar nav and its "go to next item" action need the same flat,
// module-aware order, so this is the one place that computes it.
export function flattenCurriculum(template: ProgramTemplate): FlatCurriculumItem[] {
  return withAwardableXp(template.curriculum).flatMap(mod =>
    mod.items.map(item => ({
      ...item,
      moduleId: mod.id,
      moduleTitle: mod.title
    }))
  )
}
