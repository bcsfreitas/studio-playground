<script setup lang="ts">
import type { ProgramTemplate } from '~/composables/useProgramMockData'

const props = defineProps<{
  template: ProgramTemplate
}>()

const { t } = useI18n()

const stats = computed(() => {
  const list = [
    { key: 'duration', label: t('program.facts.duration'), value: props.template.durationLabel },
    { key: 'totalXp', label: t('program.facts.totalXp'), value: `${props.template.totalXp} XP` },
    {
      key: 'learningType',
      label: t('program.facts.learningType'),
      value: t(`program.badges.learningType.${props.template.learningType}`)
    },
    {
      key: 'difficulty',
      label: t('program.facts.difficulty'),
      value: t(`program.badges.difficulty.${props.template.difficulty}`)
    },
    { key: 'language', label: t('program.facts.language'), value: props.template.language }
  ]
  if (props.template.minAge) {
    list.push({ key: 'minAge', label: t('program.facts.minAge'), value: String(props.template.minAge) })
  }
  return list
})
</script>

<template>
  <UPageCard variant="soft">
    <div class="flex flex-wrap items-stretch gap-x-6 gap-y-4">
      <template v-for="(stat, i) in stats" :key="stat.key">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-muted uppercase tracking-wide">{{ stat.label }}</span>
          <span class="text-lg font-heading font-bold text-highlighted">{{ stat.value }}</span>
        </div>
        <USeparator v-if="i < stats.length - 1" orientation="vertical" class="h-10 hidden sm:block" />
      </template>
    </div>
  </UPageCard>
</template>
