<script setup lang="ts">
import type { WeekCell } from '~/composables/useHomeMockData'

withDefaults(defineProps<{
  title: string
  meta: string
  days: WeekCell[]
  skipsLeft?: number
  skipsTotal?: number
}>(), {
  skipsLeft: 2,
  skipsTotal: 2
})
</script>

<template>
  <UPageCard variant="soft" :ui="{ footer: 'flex flex-col gap-3.5 mt-4', body: 'flex justify-between' }">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <h3 class="m-0 font-heading font-bold tracking-[-0.5px] text-highlighted text-lg h-7">
            {{ title }}
          </h3>
          <UTooltip text="Mon–Fri only · weekends are free">
            <UButton
              icon="lucide:info"
              color="neutral"
              variant="link"
              size="sm"
              aria-label="Streak schedule"
              :ui="{ base: 'p-0' }"
            />
          </UTooltip>
        </div>
        <StreakIcon class="size-[37px]" />
      </div>
    </template>

    <template #body>
      <div v-for="(d, i) in days" :key="i" class="flex flex-col items-center gap-[5px] rounded p-1">
        <span
          class="inline-flex size-[30px] rounded-full items-center justify-center text-[11px] font-bold box-border"
          :class="{
            'bg-primary': d.kind === 'done',
            'border-2 border-primary text-primary bg-orange-50': d.kind === 'today',
            'border-[1.5px] border-dashed border-slate-200 text-slate-300': d.kind === 'off',
            'bg-slate-100 text-dimmed': d.kind === 'up'
          }"
        >
          <Icon v-if="d.kind === 'done'" name="lucide:check" class="size-[13px] text-white" />
          <template v-else>{{ d.letter }}</template>
        </span>
        <span class="text-[10px] font-semibold text-dimmed">{{ d.letter }}</span>
      </div>
    </template>

    <template #footer>
      <USeparator color="neutral" :ui="{ border: 'border-muted' }" />
      <div class="flex items-center gap-2">
        <span v-for="i in skipsTotal" :key="i" class="inline-flex size-4 rounded-full bg-sky-50" />
        <span class="text-xs text-muted">{{ skipsLeft }} skips left this week</span>
        <span class="ml-auto text-xs text-dimmed">{{ meta }}</span>
      </div>
    </template>
  </UPageCard>
</template>
