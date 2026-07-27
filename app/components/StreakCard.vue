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
  <UPageCard variant="soft" :ui="{ footer: 'flex items-center gap-2 pt-3.5 mt-4 border-t border-muted' }">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="m-0 font-heading font-bold tracking-[-0.5px] text-highlighted text-lg h-7">
            {{ title }}
          </h3>
          <p class="text-sm text-dimmed mt-[3px]">Mon–Fri only · weekends are free</p>
        </div>
        <Icon name="lucide:zap" class="size-[37px] shrink-0 text-orange-300" />
      </div>
    </template>

    <div class="flex justify-between">
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
    </div>

    <template #footer>
      <span v-for="i in skipsTotal" :key="i" class="inline-flex size-4 rounded-full bg-sky-50" />
      <span class="text-xs text-muted">{{ skipsLeft }} skips left this week</span>
      <span class="ml-auto text-xs text-dimmed">{{ meta }}</span>
    </template>
  </UPageCard>
</template>
