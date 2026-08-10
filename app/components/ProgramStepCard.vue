<script setup lang="ts">
import type { CurriculumItem, CurriculumItemType } from '~/composables/useProgramMockData'

defineProps<{
  item: CurriculumItem
  completed: boolean
  locked: boolean
  current: boolean
}>()

// The card stays presentational and hands the step back up — the drawer is a
// single instance owned by the classroom, not one per card.
const emit = defineEmits<{
  open: [itemId: string]
}>()

// Typed lookup, not an inline ternary — see DESIGN.md's STATUS_COLOR convention (TaskTile.vue).
const ITEM_TYPE_ICON: Record<CurriculumItemType, string> = {
  task: 'lucide:circle-check',
  topic: 'lucide:file-text',
  survey: 'lucide:message-square-text',
  resource: 'lucide:link',
  deliverable: 'lucide:upload'
}
</script>

<template>
  <!-- `as="button"` rather than UPageCard's own `to`: opening a step is a state
       change, not a navigation, and a real button carries the disabled state
       for locked modules plus keyboard focus and the pointer cursor.
       `highlight` is the component's own ring, so the current step doesn't need
       a hand-rolled one. Binding `@click` also flips UPageCard into its
       interactive variant (it checks `onClick` as well as `to`), which is where
       the hover background comes from. Its focus ring only targets a nested
       link, though, so the button needs `focus-visible:outline-3` itself.

       The `ui` overrides turn UPageCard's marketing layout into a single row:
       its wrapper stacks leading above body with `p-4 sm:p-6` around it, which
       is right for a tile and far too tall for a checklist line. `rounded-2xl`
       is the compact-card radius from DESIGN.md, one step below the platform's
       `rounded-3xl` UPageCard shell. -->
  <UPageCard
    as="button"
    type="button"
    :disabled="locked"
    :highlight="current"
    highlight-color="primary"
    class="rounded-2xl text-left transition-shadow duration-250 focus-visible:outline-3 disabled:cursor-not-allowed"
    :class="locked ? '' : 'hover:shadow-xl'"
    :ui="{
      container: 'p-0 sm:p-0',
      wrapper: 'flex-row items-center gap-3 px-6 py-4',
      leading: 'mb-0',
      body: 'flex-1 min-w-0',
      title: 'text-sm font-normal',
      footer: 'pt-0 mt-0 flex items-center gap-3'
    }"
    @click="emit('open', item.id)"
  >
    <template #leading>
      <UIcon
        :name="completed
          ? 'lucide:check-circle-2'
          : locked ? 'lucide:lock' : current ? 'lucide:play' : 'lucide:circle'"
        class="size-5 shrink-0"
        :class="completed
          ? 'text-success'
          : locked ? 'text-dimmed' : current ? 'text-primary' : 'text-muted'"
      />
    </template>

    <template #title>
      <span
        :class="[
          locked ? 'text-dimmed' : 'text-highlighted',
          completed ? 'line-through decoration-1 text-muted' : ''
        ]"
      >{{ item.title }}</span>
    </template>

    <template #footer>
      <UIcon :name="ITEM_TYPE_ICON[item.type]" class="size-3.5 shrink-0 text-dimmed" />
      <span v-if="item.xp" class="text-xs text-dimmed tabular-nums shrink-0">+{{ item.xp }} XP</span>
      <UIcon v-if="!locked" name="lucide:chevron-right" class="size-4 shrink-0 text-dimmed" />
    </template>
  </UPageCard>
</template>
