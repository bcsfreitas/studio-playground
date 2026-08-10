<script setup lang="ts">
import type { ProgramTemplate } from '~/composables/useProgramMockData'
import { useProgramStats } from '~/composables/useProgramStats'

const props = defineProps<{
  template: ProgramTemplate
}>()

const { t, n } = useI18n()

const stats = useProgramStats(props.template)

const rows = computed(() => [
  {
    key: 'lessons',
    icon: 'lucide:book-open',
    label: t('program.metrics.lessonsCompleted'),
    value: `${stats.lessonsCompleted.value} / ${stats.lessonsTotal}`
  },
  {
    key: 'tasks',
    icon: 'lucide:upload',
    label: t('program.metrics.tasksDelivered'),
    value: `${stats.tasksDelivered.value} / ${stats.tasksTotal}`
  },
  {
    key: 'xp',
    icon: 'lucide:sparkles',
    label: t('program.metrics.xpEarned'),
    value: n(stats.progress.totalXpEarned.value)
  }
])
</script>

<template>
  <section>
    <h3 class="text-xs font-semibold text-dimmed uppercase tracking-wide">
      {{ t('program.metrics.title') }}
    </h3>

    <dl class="flex flex-col gap-3 mt-3">
      <div v-for="row in rows" :key="row.key" class="flex items-center gap-2.5">
        <UIcon :name="row.icon" class="size-4 shrink-0 text-dimmed" />
        <dt class="text-sm text-default flex-1 min-w-0">{{ row.label }}</dt>
        <dd class="text-sm font-semibold text-highlighted tabular-nums shrink-0">{{ row.value }}</dd>
      </div>
    </dl>
  </section>
</template>
