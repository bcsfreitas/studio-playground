<script setup lang="ts">
import type { Bounty } from '~/composables/useHomeMockData'

withDefaults(defineProps<{
  bounties: Bounty[]
  source?: string
}>(), {
  source: 'BountyBoard'
})
</script>

<template>
  <UPageCard variant="soft">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="m-0 font-heading font-bold tracking-[-0.5px] text-highlighted text-lg h-7">
          Bounties
        </h3>
        <span class="text-[11px] text-dimmed">via {{ source }}</span>
      </div>
      <p class="text-sm text-dimmed w-full mt-1">Paid tasks posted by game teams.</p>
    </template>

    <div class="flex flex-col gap-2 w-full">
      <div
        v-for="b in bounties"
        :key="b.title"
        class="flex items-center gap-3 cursor-pointer w-full rounded-lg p-2 -mx-2 transition-colors duration-150 hover:bg-white"
      >
        <img :src="b.img" alt="" class="size-[34px] rounded-[10px] object-cover shrink-0">
        <div class="flex-1 min-w-0 w-full">
          <div class="text-[13px] font-semibold text-default truncate w-full">{{ b.title }}</div>
          <div class="text-xs text-dimmed w-full">{{ b.game }}</div>
        </div>
        <UBadge color="success" variant="soft" size="sm">{{ b.amt }}</UBadge>
      </div>
    </div>

    <template #footer>
      <a href="#" class="inline-flex items-center gap-1.5 text-xs font-semibold">
        Browse all bounties<Icon name="lucide:external-link" class="size-3" />
      </a>
    </template>
  </UPageCard>
</template>
