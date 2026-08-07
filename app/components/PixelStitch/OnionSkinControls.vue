<script setup lang="ts">
import { usePixelStitchContext } from '~/composables/usePixelStitchContext'

const editor = usePixelStitchContext()
const { t } = useI18n()
</script>

<template>
  <UPageCard variant="outline" :ui="{ root: 'rounded-2xl', container: 'p-4 sm:p-4 gap-3' }">
    <div class="flex items-center justify-between">
      <h3 class="font-heading font-bold text-sm text-highlighted">{{ t('pixelStitch.onion.title') }}</h3>
      <UTooltip :text="t('pixelStitch.onion.tooltip')">
        <USwitch v-model="editor.onionSkin.value.enabled" :aria-label="t('pixelStitch.onion.title')" />
      </UTooltip>
    </div>

    <template v-if="editor.onionSkin.value.enabled">
      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between text-xs text-dimmed">
          <span>{{ t('pixelStitch.onion.previousFrames') }}</span>
          <span class="tabular-nums">{{ editor.onionSkin.value.previousFrames }}</span>
        </div>
        <USlider v-model="editor.onionSkin.value.previousFrames" :min="0" :max="5" :step="1" size="xs" />
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between text-xs text-dimmed">
          <span>{{ t('pixelStitch.onion.nextFrames') }}</span>
          <span class="tabular-nums">{{ editor.onionSkin.value.nextFrames }}</span>
        </div>
        <USlider v-model="editor.onionSkin.value.nextFrames" :min="0" :max="5" :step="1" size="xs" />
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between text-xs text-dimmed">
          <span>{{ t('pixelStitch.onion.opacity') }}</span>
          <span class="tabular-nums">{{ Math.round(editor.onionSkin.value.opacity * 100) }}%</span>
        </div>
        <USlider v-model="editor.onionSkin.value.opacity" :min="0.1" :max="0.8" :step="0.1" size="xs" />
      </div>

      <!-- Which tint means what: the ghosts are drawn in flat brand colors, so
           without this the two directions are indistinguishable. -->
      <div class="flex items-center gap-4 text-xs text-dimmed">
        <span class="flex items-center gap-1.5">
          <span class="size-2.5 rounded-full bg-primary" />{{ t('pixelStitch.onion.legendPrevious') }}
        </span>
        <span class="flex items-center gap-1.5">
          <span class="size-2.5 rounded-full bg-secondary" />{{ t('pixelStitch.onion.legendNext') }}
        </span>
      </div>
    </template>
  </UPageCard>
</template>
