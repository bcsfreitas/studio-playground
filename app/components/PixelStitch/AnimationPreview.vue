<script setup lang="ts">
import { compositeLayers, drawCheckerboard } from '~/composables/pixelStitch/render'
import { usePixelStitchContext } from '~/composables/usePixelStitchContext'

const editor = usePixelStitchContext()
const { t } = useI18n()

const PREVIEW_SIZE = 128
const canvasRef = ref<HTMLCanvasElement | null>(null)

function draw() {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE)
  drawCheckerboard(ctx, PREVIEW_SIZE, PREVIEW_SIZE, 8)
  const frame = editor.currentFrame.value
  if (frame) compositeLayers(ctx, frame.layers, editor.canvasSize.value, PREVIEW_SIZE / editor.canvasSize.value)
}

watch(
  [() => editor.currentFrameIndex.value, () => editor.frames.value, () => editor.canvasSize.value],
  () => nextTick(draw),
  { deep: true }
)

// Playback advances the shared frame cursor, so the main canvas and the frame
// strip follow along — the preview isn't a separate player.
let timer: ReturnType<typeof setInterval> | null = null

function stop() {
  if (timer) clearInterval(timer)
  timer = null
}

watch(
  [() => editor.isPlaying.value, () => editor.fps.value, () => editor.frames.value.length],
  ([playing, fps, frameCount]) => {
    stop()
    if (!playing || frameCount < 2) return
    timer = setInterval(() => {
      editor.currentFrameIndex.value = (editor.currentFrameIndex.value + 1) % editor.frames.value.length
    }, 1000 / fps)
  },
  { immediate: true }
)

onMounted(() => nextTick(draw))
onBeforeUnmount(stop)
</script>

<template>
  <UPageCard variant="outline" :ui="{ root: 'rounded-2xl', container: 'p-4 sm:p-4 gap-3' }">
    <h3 class="font-heading font-bold text-sm text-highlighted">{{ t('pixelStitch.preview.title') }}</h3>

    <div class="flex justify-center">
      <canvas
        ref="canvasRef"
        :width="PREVIEW_SIZE"
        :height="PREVIEW_SIZE"
        class="rounded-xl ring-1 ring-default"
        :style="{ imageRendering: 'pixelated' }"
      />
    </div>

    <div class="flex flex-col gap-1">
      <div class="flex items-center justify-between text-xs text-dimmed">
        <span class="tabular-nums">{{ t('pixelStitch.preview.fps') }}: {{ editor.fps.value }}</span>
        <span class="tabular-nums">
          {{ t('pixelStitch.frames.frame') }} {{ editor.currentFrameIndex.value + 1 }} / {{ editor.frames.value.length }}
        </span>
      </div>
      <UTooltip :text="t('pixelStitch.preview.fpsTooltip')">
        <USlider v-model="editor.fps.value" :min="1" :max="30" :step="1" size="xs" class="w-full" />
      </UTooltip>
    </div>
  </UPageCard>
</template>
