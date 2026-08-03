<script setup lang="ts">
import type { FlatCurriculumItem } from '~/composables/useProgramCurriculum'

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
  <div class="flex-1 p-8 overflow-y-auto">
    <!-- Mirrors ProgramCurriculumAccordion's module container (rounded-2xl
         border, color-tinted badge/title) so the active module's identity
         carries over from the sidebar into the content viewer. -->
    <div class="rounded-2xl border border-default p-8">
      <div class="flex items-center gap-2.5">
        <UBadge
          :label="item.moduleNumber"
          :color="item.moduleColor"
          variant="soft"
          class="rounded-full size-7 justify-center p-0 shrink-0"
        />
        <span class="font-heading font-bold text-sm" :class="`text-${item.moduleColor}-600`">
          {{ item.moduleTitle }}
        </span>
        <span class="text-xs text-muted uppercase">· {{ item.contentType }}</span>
      </div>

      <h1 class="text-2xl font-heading font-bold text-highlighted mt-3">{{ item.title }}</h1>

      <div class="mt-6 rounded-xl border border-dashed border-default p-12 text-center text-muted">
        {{ t('program.viewer.content.placeholder', { contentType: item.contentType }) }}
      </div>

      <div class="mt-6 flex items-center gap-3">
        <span v-if="item.xp" class="text-sm text-muted">+{{ item.xp }} XP</span>

        <UButton
          v-if="!isCompleted"
          :label="t('program.viewer.actions.markComplete')"
          color="primary"
          @click="$emit('mark-complete')"
        />
        <template v-else>
          <UBadge :label="t('program.viewer.actions.completed')" color="success" variant="soft" />
          <UButton :label="t('program.viewer.actions.nextItem')" variant="outline" @click="$emit('next-item')" />
        </template>
      </div>
    </div>
  </div>
</template>
