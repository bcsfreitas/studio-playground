import type { CurriculumItem, ProgramTemplate } from '~/composables/useProgramMockData'
import { MODULE_COLORS } from '~/composables/useProgramMockData'

export interface FlatCurriculumItem extends CurriculumItem {
  moduleId: string
  moduleTitle: string
  moduleNumber: number
  moduleColor: typeof MODULE_COLORS[number]
}

// Flattens a program's modules into one ordered list — both the program
// content sidebar nav and its "go to next item" action need the same flat,
// module-aware order, so this is the one place that computes it.
export function flattenCurriculum(template: ProgramTemplate): FlatCurriculumItem[] {
  return template.curriculum.flatMap((mod, moduleIndex) =>
    mod.items.map(item => ({
      ...item,
      moduleId: mod.id,
      moduleTitle: mod.title,
      moduleNumber: moduleIndex + 1,
      moduleColor: MODULE_COLORS[moduleIndex % MODULE_COLORS.length]!
    }))
  )
}
