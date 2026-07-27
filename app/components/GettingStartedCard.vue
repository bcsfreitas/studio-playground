<script setup lang="ts">
import type { GettingStartedItem } from '~/composables/useHomeMockData'

const props = withDefaults(defineProps<{
  items: GettingStartedItem[]
  xpReward?: number
}>(), {
  xpReward: 1000
})

const completed = computed(() => props.items.filter(i => i.done).length)
const total = computed(() => props.items.length)
const progressDeg = computed(() => total.value ? (completed.value / total.value) * 360 : 0)
</script>

<template>
  <UPageCard>
    <template #header>
      <div class="flex items-center gap-3.5">
        <div
          class="size-12 rounded-full flex items-center justify-center shrink-0"
          :style="{ background: `conic-gradient(var(--ui-primary) ${progressDeg}deg, var(--color-slate-200) ${progressDeg}deg)` }"
        >
          <div class="size-9 rounded-full bg-white flex items-center justify-center text-[11px] font-bold text-default">
            {{ completed }}/{{ total }}
          </div>
        </div>
        <div>
          <h3 class="m-0 font-heading text-base font-bold tracking-[-0.5px] text-highlighted">Getting started</h3>
          <div class="inline-flex items-center gap-1 mt-0.5 text-xs font-semibold text-primary">
            <Icon name="lucide:zap" class="size-[13px]" />Finish all {{ total }} to earn {{ xpReward.toLocaleString() }} XP
          </div>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-0.5">
      <div
        v-for="g in items"
        :key="g.label"
        class="flex items-center gap-2.5 rounded-[10px] px-2 py-[7px] cursor-pointer hover:bg-muted"
      >
        <span
          class="inline-flex size-[18px] rounded-full items-center justify-center shrink-0 box-border"
          :class="g.done ? 'bg-success' : 'border-[1.5px] border-dashed border-slate-300'"
        >
          <Icon v-if="g.done" name="lucide:check" class="size-[11px] text-white" />
        </span>
        <span class="text-[13px]" :class="g.done ? 'text-dimmed line-through' : 'text-default'">{{ g.label }}</span>
        <Icon v-if="!g.done" name="lucide:chevron-right" class="size-3.5 text-dimmed ml-auto" />
      </div>
    </div>
  </UPageCard>
</template>
