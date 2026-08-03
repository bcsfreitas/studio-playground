# Curriculum Accordion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `ProgramCurriculumAccordion.vue` from a plain divided list into card-style modules, open by default, with a numbered/colored accent per module.

**Architecture:** Single-file change. `UAccordion`'s `ui` prop overrides the `item`/`trigger`/`label` slots to get the card look; a computed `items` array gains a per-module color (cycled through a 4-color palette by index) consumed by the new leading-number badge and the title's text color; `default-value` is set to every item's `value` so all modules start expanded.

**Tech Stack:** Vue 3 `<script setup>`, Nuxt UI v4 (`UAccordion`, `UBadge`), Tailwind CSS v4. No test framework in this repo — verification is manual via `npm run dev`.

## Global Constraints

- Use Nuxt UI components, not hand-rolled HTML, per `CLAUDE.md`'s "Building UI" section.
- Use semantic Nuxt UI `color` props on components (`primary`/`secondary`/`purple`/`blue` are all registered in `app/app.config.ts`); raw Tailwind palette classes (`text-purple-600`) are only for plain elements that aren't Nuxt UI components — this matches the existing pattern in `ProgramFactsStrip.vue`.
- No test suite exists (`CLAUDE.md`) — verify by running the dev server and viewing `/learn/[programId]` in the browser, per `CLAUDE.md`'s UI-change rule.

---

### Task 1: Restyle `ProgramCurriculumAccordion.vue`

**Files:**
- Modify: `app/components/ProgramCurriculumAccordion.vue`

**Interfaces:**
- Consumes: `CurriculumModule[]` / `CurriculumItemType` from `~/composables/useProgramMockData` (unchanged).
- Produces: nothing consumed elsewhere — this component is a leaf, rendered only from `app/pages/learn/[programId].vue` as `<ProgramCurriculumAccordion :modules="template.curriculum" />` (unchanged usage).

- [ ] **Step 1: Add the color palette and update the `items` computed**

Replace the script block with:

```vue
<script setup lang="ts">
import type { CurriculumModule, CurriculumItemType } from '~/composables/useProgramMockData'

const props = defineProps<{
  modules: CurriculumModule[]
}>()

const { t } = useI18n()

const ITEM_TYPE_ICON: Record<CurriculumItemType, string> = {
  task: 'lucide:circle-check',
  topic: 'lucide:file-text',
  survey: 'lucide:message-square-text',
  resource: 'lucide:link'
}

// Cycled by module index so each card reads as visually distinct; same
// 4-color family as ProgramFactsStrip's stat accents.
const MODULE_COLORS = ['primary', 'secondary', 'purple', 'blue'] as const

const items = computed(() => props.modules.map((m, index) => ({
  label: m.title,
  value: m.id,
  moduleItems: m.items,
  color: MODULE_COLORS[index % MODULE_COLORS.length],
  number: index + 1
})))
</script>
```

This adds `MODULE_COLORS`, and `color`/`number` fields on each item — no changes to `ITEM_TYPE_ICON` or the props/import shape.

- [ ] **Step 2: Restyle the template**

Replace the template block with:

```vue
<template>
  <UAccordion
    :items="items"
    :default-value="items.map(item => item.value)"
    type="multiple"
    :ui="{
      root: 'flex flex-col gap-3',
      item: 'rounded-2xl border border-default px-5',
      trigger: 'py-4'
    }"
  >
    <template #leading="{ item }">
      <UBadge
        :label="item.number"
        :color="item.color"
        variant="soft"
        class="rounded-full size-7 justify-center p-0 shrink-0"
      />
    </template>
    <template #default="{ item }">
      <span class="font-heading font-bold text-base" :class="`text-${item.color}-600`">
        {{ item.label }}
      </span>
    </template>
    <template #content="{ item }">
      <ul class="flex flex-col gap-2.5 pb-4">
        <li
          v-for="task in item.moduleItems"
          :key="task.id"
          class="flex items-center gap-2.5 text-sm text-default"
        >
          <UIcon :name="ITEM_TYPE_ICON[task.type as CurriculumItemType]" class="size-4 text-dimmed shrink-0" />
          <span class="flex-1">{{ task.title }}</span>
          <UBadge
            v-if="task.type === 'task'"
            :label="t('program.curriculum.xpBadge', { xp: task.xp })"
            color="neutral"
            variant="soft"
            size="sm"
          />
        </li>
      </ul>
    </template>
  </UAccordion>
</template>
```

Note: `text-${item.color}-600` is a dynamic class built from a fixed, known set of 4 literal color names (`primary`, `secondary`, `purple`, `blue`) — all 4 already appear as literal Tailwind classes elsewhere in this codebase (`ProgramFactsStrip.vue`), so Tailwind's scanner will generate them regardless of this dynamic reference.

- [ ] **Step 3: Manual verification**

Run: `npm run dev` (add `-- --port <n>` if 3000 is taken)

Visit `/learn/<programId>` for a program with more than one curriculum module (e.g. `ship-your-first-game`, which has multiple modules per `app/composables/useProgramMockData.ts`).

Expected:
- All curriculum modules render already expanded.
- Each module is its own rounded, bordered card with visible gap between cards.
- Each module has a numbered circle badge before its title, and the title text is colored — colors cycle (module 1 primary/orange, module 2 secondary/cornflower, module 3 purple, module 4+ blue then repeats).
- Clicking a module's header still collapses/expands it.
- Item rows (icon, title, XP badge) inside each module look unchanged aside from slightly more vertical spacing.

If anything looks off (spacing, wrong color, collapse not working), fix in this same file before moving on.

- [ ] **Step 4: Commit**

```bash
git add app/components/ProgramCurriculumAccordion.vue
git commit -m "Restyle curriculum accordion as colored, numbered cards open by default"
```
