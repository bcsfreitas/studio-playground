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
