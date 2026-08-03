<script setup lang="ts">
import type { ProgramTemplate } from '~/composables/useProgramMockData'
import type { FlatCurriculumItem } from '~/composables/usePlayerCurriculum'

defineProps<{
  template: ProgramTemplate
  items: FlatCurriculumItem[]
  activeItemId: string | undefined
  isCompleted: (itemId: string) => boolean
  progressPercent: number
  totalXpEarned: number
  totalXpAvailable: number
}>()

defineEmits<{
  'select-item': [itemId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="w-72 shrink-0 border-r border-default p-4 flex flex-col gap-4 overflow-y-auto">
    <NuxtLink :to="`/learn/${template.id}`" class="text-sm text-primary">
      {{ t('player.exit.label') }}
    </NuxtLink>

    <div>
      <div class="font-heading font-bold text-highlighted">{{ template.title }}</div>
      <UProgress :model-value="progressPercent" color="primary" class="mt-2" />
      <div class="text-xs text-muted mt-1">
        {{ t('player.sidebar.xpProgress', { earned: totalXpEarned, available: totalXpAvailable }) }}
      </div>
    </div>

    <ul class="flex flex-col gap-1">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-1.5"
          :class="item.id === activeItemId ? 'bg-primary/10 text-primary' : 'text-default'"
          @click="$emit('select-item', item.id)"
        >
          <UIcon :name="isCompleted(item.id) ? 'lucide:check-circle' : 'lucide:circle'" class="size-4 shrink-0" />
          <span class="truncate">{{ item.title }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>
