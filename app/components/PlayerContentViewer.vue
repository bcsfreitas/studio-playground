<script setup lang="ts">
import type { FlatCurriculumItem } from '~/composables/usePlayerCurriculum'

defineProps<{
  item: FlatCurriculumItem
  isCompleted: boolean
}>()

defineEmits<{
  'mark-complete': []
  'next-item': []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex-1 p-8">
    <div class="text-xs text-muted uppercase">{{ item.moduleTitle }} · {{ item.contentType }}</div>
    <h1 class="text-2xl font-heading font-bold text-highlighted mt-1">{{ item.title }}</h1>

    <div class="mt-6 rounded-xl border border-dashed border-default p-12 text-center text-muted">
      {{ t('player.content.placeholder', { contentType: item.contentType }) }}
    </div>

    <div class="mt-6 flex items-center gap-3">
      <span v-if="item.xp" class="text-sm text-muted">+{{ item.xp }} XP</span>

      <UButton
        v-if="!isCompleted"
        :label="t('player.actions.markComplete')"
        color="primary"
        @click="$emit('mark-complete')"
      />
      <template v-else>
        <UBadge :label="t('player.actions.completed')" color="success" variant="soft" />
        <UButton :label="t('player.actions.nextItem')" variant="outline" @click="$emit('next-item')" />
      </template>
    </div>
  </div>
</template>
