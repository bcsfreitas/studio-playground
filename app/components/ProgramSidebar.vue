<script setup lang="ts">
import type { ProgramTemplate, CurriculumItemType } from '~/composables/useProgramMockData'
import type { FlatCurriculumItem } from '~/composables/useProgramCurriculum'

const props = defineProps<{
  template: ProgramTemplate
  items: FlatCurriculumItem[]
  activeItemId: string | undefined
  isCompleted: (itemId: string) => boolean
  isModuleLocked: (moduleId: string) => boolean
  progressPercent: number
  totalXpEarned: number
  totalXpAvailable: number
}>()

defineEmits<{
  'select-item': [itemId: string]
}>()

const { t } = useI18n()

const ITEM_TYPE_ICON: Record<CurriculumItemType, string> = {
  task: 'lucide:circle-check',
  topic: 'lucide:file-text',
  survey: 'lucide:message-square-text',
  resource: 'lucide:link',
  deliverable: 'lucide:upload'
}

const modules = computed(() => props.template.curriculum.map(mod => ({
  label: mod.title,
  value: mod.id,
  moduleItems: mod.items,
  isLocked: props.isModuleLocked(mod.id)
})))

// Unlocked modules start expanded so the learner immediately sees where they
// can go; locked ones stay collapsed since there's nothing actionable inside.
const expandedModules = computed(() => modules.value.filter(mod => !mod.isLocked).map(mod => mod.value))
</script>

<template>
  <div class="w-80 shrink-0 border-r border-default p-4 flex flex-col gap-4 overflow-y-auto">
    <NuxtLink :to="`/learn/${template.id}`" class="text-sm text-primary">
      {{ t('program.viewer.exit.label') }}
    </NuxtLink>

    <div>
      <div class="font-heading font-bold text-highlighted">{{ template.title }}</div>
      <UProgress :model-value="progressPercent" color="primary" class="mt-2" />
      <div class="text-xs text-muted mt-1">
        {{ t('program.viewer.sidebar.xpProgress', { earned: totalXpEarned, available: totalXpAvailable }) }}
      </div>
    </div>

    <UAccordion
      :items="modules"
      :default-value="expandedModules"
      type="multiple"
      :ui="{
        root: 'flex flex-col gap-3',
        item: 'rounded-2xl border border-default px-3',
        trigger: 'py-3'
      }"
    >
      <template #leading="{ item }">
        <UIcon
          v-if="item.isLocked"
          name="lucide:lock"
          class="size-7 p-1.5 shrink-0 text-dimmed"
        />
      </template>
      <template #default="{ item }">
        <span
          class="font-heading font-bold text-sm"
          :class="item.isLocked ? 'text-dimmed' : 'text-primary-600'"
        >
          {{ item.label }}
        </span>
      </template>
      <template #content="{ item }">
        <ul class="flex flex-col gap-1 pb-3">
          <li v-for="lesson in item.moduleItems" :key="lesson.id">
            <button
              type="button"
              class="w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="lesson.id === activeItemId ? 'bg-primary/10 text-primary' : 'text-default'"
              :disabled="item.isLocked"
              @click="$emit('select-item', lesson.id)"
            >
              <UIcon
                :name="isCompleted(lesson.id) ? 'lucide:check-circle' : 'lucide:circle'"
                class="size-4 shrink-0"
              />
              <span class="truncate flex-1">{{ lesson.title }}</span>
              <UIcon :name="ITEM_TYPE_ICON[lesson.type]" class="size-3.5 text-dimmed shrink-0" />
            </button>
          </li>
        </ul>
      </template>
    </UAccordion>
  </div>
</template>
