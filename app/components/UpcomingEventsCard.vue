<script setup lang="ts">
import type { UpcomingEvent } from '~/composables/useHomeMockData'

defineProps<{
  events: UpcomingEvent[]
}>()

const eventTileClass: Record<UpcomingEvent['kind'], string> = {
  community: 'bg-orange-50 text-orange-700',
  program: 'bg-cornflower-50 text-cornflower-600',
  github: 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <UPageCard 
    title="Upcoming Events"
    variant="soft"
  >

      <div class="flex flex-col gap-2 w-full">
        <div
          v-for="e in events"
          :key="e.title"
          class="flex items-center gap-3 cursor-pointer w-full rounded-lg p-2 -mx-2 transition-colors duration-150 hover:bg-white"
        >
          <div class="flex flex-col items-center justify-center size-10 shrink-0 rounded-xl" :class="eventTileClass[e.kind]">
            <span class="text-[9px] font-bold tracking-[0.04em]">{{ e.mon }}</span>
            <span class="text-base font-bold leading-4">{{ e.day }}</span>
          </div>
          <div class="flex-1 min-w-0 w-full">
            <div class="text-[13px] font-semibold text-default truncate w-full">{{ e.title }}</div>
            <div class="text-xs text-dimmed truncate w-full">{{ e.meta }}</div>
          </div>
        </div>
        <div>
          <UButton color="secondary" variant="ghost" size="sm">Full calendar</UButton>
        </div>
      </div>
  </UPageCard>
</template>
