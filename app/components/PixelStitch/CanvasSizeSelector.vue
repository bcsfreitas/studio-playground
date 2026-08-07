<script setup lang="ts">
import { CANVAS_SIZES } from '~/composables/pixelStitch/types'
import { usePixelStitchContext } from '~/composables/usePixelStitchContext'

const editor = usePixelStitchContext()
const { t } = useI18n()
</script>

<template>
  <UPageCard variant="outline" :ui="{ root: 'rounded-2xl', container: 'p-3 sm:p-3' }">
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm text-muted mr-1">{{ t('pixelStitch.canvasSize.label') }}</span>
      <UTooltip
        v-for="size in CANVAS_SIZES"
        :key="size"
        :text="t('pixelStitch.canvasSize.tooltip', { size: `${size}×${size}` })"
      >
        <UButton
          :label="`${size}×${size}`"
          size="sm"
          :color="editor.canvasSize.value === size ? 'primary' : 'neutral'"
          :variant="editor.canvasSize.value === size ? 'solid' : 'outline'"
          @click="editor.setCanvasSize(size)"
        />
      </UTooltip>
    </div>
  </UPageCard>
</template>
