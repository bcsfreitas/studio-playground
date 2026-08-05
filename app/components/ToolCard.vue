<script setup lang="ts">
import type { ToolCardData } from '~/composables/useMakeMockData'

defineProps<{
  tool: ToolCardData
}>()

// Typed lookup, not an inline ternary — see DESIGN.md's STATUS_COLOR convention (TaskTile.vue).
const BADGE_COLOR: Record<ToolCardData['badge'], 'success' | 'warning'> = {
  Live: 'success',
  Beta: 'warning'
}
</script>

<template>
  <!-- `sm:p-0` is not redundant with `p-0`: UCard's default header padding is
       itself responsive (`sm:px-6`), and a bare `p-0` loses to it above 640px,
       leaving the thumbnail inset from the card edges. -->
  <!-- `divide-y-0` cancels UCard's default dividers between header, body and
       footer — they drew a rule under the thumbnail and another straight above
       the launch button. -->
  <UCard :ui="{ root: 'h-full flex flex-col rounded-3xl divide-y-0', header: 'p-0 sm:p-0 relative', body: 'flex flex-col gap-2 flex-1', footer: 'pt-0' }">
    <template #header>
      <img v-if="tool.image" :src="tool.image" :alt="tool.name" class="h-28 w-full object-cover">
      <div v-else-if="tool.logo" class="h-28 w-full flex items-center justify-center" :style="{ background: tool.logoBg }">
        <img :src="tool.logo" :alt="tool.name" class="h-10 w-auto">
      </div>
      <div v-else class="h-28 w-full flex items-center justify-center" :style="{ background: tool.logoBg }">
        <UIcon :name="tool.icon" class="size-10 text-white" />
      </div>
      <UBadge
        :label="tool.badge"
        :color="BADGE_COLOR[tool.badge]"
        variant="soft"
        size="sm"
        class="absolute top-3 right-3"
      />
    </template>

    <div class="text-xs font-semibold text-dimmed uppercase tracking-wide">{{ tool.tag }}</div>
    <div class="font-heading font-bold text-highlighted">{{ tool.name }}</div>
    <p class="text-sm text-muted flex-1">{{ tool.blurb }}</p>

    <template #footer>
      <UButton
        block
        variant="soft"
        color="neutral"
        :icon="tool.isDownload ? 'lucide:download' : 'lucide:maximize'"
        :disabled="!tool.url"
        :to="tool.url"
        target="_blank"
      >
        {{ tool.isDownload ? 'Download' : 'Launch tool' }}
      </UButton>
    </template>
  </UCard>
</template>
