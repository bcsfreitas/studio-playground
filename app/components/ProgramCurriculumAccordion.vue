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

const items = computed(() => props.modules.map(m => ({
  label: m.title,
  value: m.id,
  moduleItems: m.items
})))
</script>

<template>
  <UAccordion :items="items" type="multiple">
    <template #content="{ item }">
      <ul class="flex flex-col gap-2 pb-3.5">
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
