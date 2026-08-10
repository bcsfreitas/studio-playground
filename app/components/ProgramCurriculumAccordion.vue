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
  resource: 'lucide:link',
  deliverable: 'lucide:upload'
}

const items = computed(() => props.modules.map(m => ({
  label: m.title,
  value: m.id,
  moduleItems: m.items
})))
</script>

<template>
  <UAccordion
    :items="items"
    :default-value="items.map(item => item.value)"
    type="multiple"
    :ui="{
      root: 'flex flex-col gap-3',
      // bg-default, not transparent: these sit on the page canvas, which is
      // tinted, so without it the cards read as part of the background rather
      // than as cards. Matches the classroom's step cards.
      item: 'rounded-2xl border border-default bg-default px-5',
      trigger: 'py-4'
    }"
  >
    <template #default="{ item }">
      <span class="font-heading font-bold text-base text-primary-600">
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
            v-if="task.xp"
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
