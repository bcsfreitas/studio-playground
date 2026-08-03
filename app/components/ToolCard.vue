<script setup lang="ts">
import type { ToolCardData } from '~/composables/useMakeMockData'

defineProps<{
  tool: ToolCardData
}>()
</script>

<template>
  <UCard :ui="{ root: 'h-full flex flex-col', header: 'p-0 relative', body: 'flex flex-col gap-2 flex-1', footer: 'pt-0' }">
    <template #header>
      <img v-if="tool.image" :src="tool.image" :alt="tool.name" class="h-28 w-full object-cover">
      <div v-else class="h-28 w-full flex items-center justify-center" :style="{ background: tool.logoBg }">
        <img :src="tool.logo" :alt="tool.name" class="h-10 w-auto">
      </div>
      <UBadge
        :label="tool.badge"
        :color="tool.badge === 'Live' ? 'success' : 'warning'"
        variant="solid"
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
