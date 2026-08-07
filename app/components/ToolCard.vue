<script setup lang="ts">
import type { ToolCardData } from '~/composables/useMakeMockData'

defineProps<{
  tool: ToolCardData
}>()

// The card stays presentational and hands the tool back up — the drawer is a
// single instance owned by the page, not one per card.
const emit = defineEmits<{
  launch: [tool: ToolCardData]
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
      <!-- One button, not a set: with no `to`, UButton already falls through to
           a real `<button>`. Native tools navigate in-app, embeddable ones open
           the drawer, everything else keeps its outward link. The label stays
           the same throughout — all three launch the tool, and only the icon
           marks which of them leaves the platform. -->
      <UButton
        block
        variant="soft"
        color="neutral"
        :icon="tool.isDownload
          ? 'lucide:download'
          : tool.route ? 'lucide:arrow-right' : tool.embedUrl ? 'lucide:maximize' : 'lucide:external-link'"
        :disabled="!tool.route && !tool.embedUrl && !tool.url"
        :to="tool.route ?? (tool.embedUrl ? undefined : tool.url)"
        :target="tool.route || tool.embedUrl ? undefined : '_blank'"
        @click="!tool.route && tool.embedUrl && emit('launch', tool)"
      >
        {{ tool.isDownload ? 'Download' : 'Launch tool' }}
      </UButton>
    </template>
  </UCard>
</template>
