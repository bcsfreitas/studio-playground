import type { CurriculumItem, ProgramTemplate } from '~/composables/useProgramMockData'

export interface FlatCurriculumItem extends CurriculumItem {
  moduleId: string
  moduleTitle: string
}

// Shared by the classroom's own step list and the step drawer's sidebar nav,
// so a module's lock state and tally can't drift between the two surfaces.
export interface CurriculumModuleSummary {
  id: string
  number: number
  title: string
  items: CurriculumItem[]
  isLocked: boolean
  completedCount: number
}

// Flattens a program's modules into one ordered list — both the program
// content sidebar nav and its "go to next item" action need the same flat,
// module-aware order, so this is the one place that computes it.
export function flattenCurriculum(template: ProgramTemplate): FlatCurriculumItem[] {
  return template.curriculum.flatMap(mod =>
    mod.items.map(item => ({
      ...item,
      moduleId: mod.id,
      moduleTitle: mod.title
    }))
  )
}
