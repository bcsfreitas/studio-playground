<script setup lang="ts">
import type { ProgramSessionUnit } from '~/composables/programData/types'

const props = withDefaults(defineProps<{
  image?: string
  name?: string
  description?: string
  sessionCount?: number
  sessionUnit?: ProgramSessionUnit
  status?: string
  // The card has always styled itself as clickable; without this it wasn't.
  to?: string
}>(), {
  name: 'Program',
  description: ''
})

const { t } = useI18n()

const sessionsLabel = computed(() => props.sessionCount == null || !props.sessionUnit
  ? undefined
  : t(`program.sideInfo.${props.sessionUnit}Count`, props.sessionCount, { count: props.sessionCount }))
</script>

<template>
  <UPageCard
    :to="to"
    :title="name"
    :description="description"
    reverse
    variant="outline"
    class="cursor-pointer transition-shadow duration-250 hover:shadow-xl rounded-2xl"
    :ui="{ title: 'font-bold line-clamp-2', description: 'line-clamp-2' }"
  >
    <img
      :src="image"
      alt=""
      class="w-full h-36 object-cover bg-slate-100 rounded-2xl"
    >

    <template #footer>
      <div class="flex items-center gap-3">
        <UBadge v-if="status" :label="status" color="neutral" size="md" variant="soft" />
        <span v-if="sessionsLabel" class="inline-flex items-center gap-1.5 text-xs text-dimmed">
          <UIcon name="lucide:calendar-days" class="size-4" />
          {{ sessionsLabel }}
        </span>
      </div>
    </template>
  </UPageCard>
</template>
