import type { CurriculumItem, ProgramTemplate } from '~/composables/useProgramMockData'

export interface FlatCurriculumItem extends CurriculumItem {
  moduleId: string
  moduleTitle: string
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
