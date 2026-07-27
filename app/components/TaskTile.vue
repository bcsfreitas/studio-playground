<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'

const STATUS_COLOR: Record<string, BadgeProps['color']> = {
  'In Review': 'primary',
  'In Progress': 'primary',
  'Need help': 'primary',
  'Feedback': 'warning',
  'Done': 'success',
  'New': 'info'
}

const props = withDefaults(defineProps<{
  name?: string
  status?: string
  project?: string
  due?: string
  dueSoon?: boolean
}>(), {
  name: 'Task'
})

const statusColor = computed(() => (props.status && STATUS_COLOR[props.status]) || 'neutral')
</script>

<template>
  <UPageCard
    variant="outline"
    :title="name"
    class="w-full cursor-pointer transition-shadow duration-250 hover:shadow-xl rounded-2xl"
    :ui="{ title: 'font-heading font-bold text-lg tracking-[-0.5px]' }"
  >

    <template #footer>
      <div class="flex items-center gap-4">
        <span v-if="project" class="inline-flex items-center gap-2">
          <span class="text-xs text-dimmed max-w-[120px] truncate">{{ project }}</span>
        </span>
        <UBadge v-if="status" :color="statusColor" size="sm" variant="soft" class="shrink-0">
        {{ status }}
      </UBadge>
      </div>
    </template>
  </UPageCard>
</template>
