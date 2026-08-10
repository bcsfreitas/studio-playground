<script setup lang="ts">
import { hexToRgba, isHexColor } from '~/composables/pixelStitch/project'
import { usePixelStitchContext } from '~/composables/usePixelStitchContext'

const editor = usePixelStitchContext()
const { t } = useI18n()

// The swatch preview shows the brush as it will actually paint, opacity
// included — the palette itself always stores opaque hex.
const previewColor = computed(() =>
  editor.brushOpacity.value < 1 && isHexColor(editor.currentColor.value)
    ? hexToRgba(editor.currentColor.value, editor.brushOpacity.value)
    : editor.currentColor.value
)

const draggedColor = ref<string | null>(null)

function onDragStart(event: DragEvent, color: string) {
  draggedColor.value = color
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'
}

function onDrop(index: number) {
  const color = draggedColor.value
  draggedColor.value = null
  if (color && isHexColor(color)) editor.setPaletteColor(index, color)
}

// Four rows of ten: the base hue ramp, two darker shades, and a pastel
// highlight row. The labels are what tell the artist which row is which.
const ROWS = ['base', 'shade1', 'shade2', 'highlight'] as const
const ROW_LENGTH = 10
</script>

<template>
  <UPageCard variant="outline" :ui="{ root: 'rounded-2xl', container: 'p-4 sm:p-4 gap-4' }">
    <h3 class="font-heading font-bold text-sm text-highlighted">{{ t('pixelStitch.color.title') }}</h3>

    <div class="flex items-center gap-3">
      <UTooltip :text="t('pixelStitch.color.dragToSave')">
        <!-- Draggable so a mixed color can be dropped into a palette slot;
             the checker sits behind it so a translucent brush reads as
             translucent rather than as a lighter solid. -->
        <div
          class="size-14 shrink-0 rounded-xl ring-1 ring-default cursor-grab active:cursor-grabbing pixel-checker"
          draggable="true"
          @dragstart="onDragStart($event, editor.currentColor.value)"
          @dragend="draggedColor = null"
        >
          <div class="size-full rounded-xl" :style="{ backgroundColor: previewColor }" />
        </div>
      </UTooltip>

      <div class="flex-1 min-w-0 flex flex-col gap-2">
        <UTooltip :text="t('pixelStitch.color.pickerTooltip')">
          <!-- A native color input: no Nuxt UI component wraps the OS color
               picker, and `p-1` keeps the swatch from being clipped by the
               input's own padding. -->
          <UInput
            v-model="editor.currentColor.value"
            type="color"
            size="md"
            :ui="{ base: 'h-9 p-1 cursor-pointer' }"
            :aria-label="t('pixelStitch.color.pickerTooltip')"
          />
        </UTooltip>
        <UTooltip :text="t('pixelStitch.color.hexTooltip')">
          <UInput
            v-model="editor.currentColor.value"
            placeholder="#000000"
            size="sm"
            :ui="{ base: 'font-mono' }"
            :aria-label="t('pixelStitch.color.hexTooltip')"
          />
        </UTooltip>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted">{{ t('pixelStitch.color.brushOpacity') }}</span>
        <span class="text-xs tabular-nums text-dimmed">{{ Math.round(editor.brushOpacity.value * 100) }}%</span>
      </div>
      <USlider v-model="editor.brushOpacity.value" :min="0" :max="1" :step="0.01" />
    </div>

    <div class="flex flex-col gap-3">
      <p class="text-xs text-dimmed">{{ t('pixelStitch.color.dragToCustomize') }}</p>
      <div v-for="(row, rowIndex) in ROWS" :key="row" class="flex flex-col gap-1">
        <p class="text-[10px] font-semibold uppercase tracking-wider text-dimmed">
          {{ t(`pixelStitch.color.row.${row}`) }}
        </p>
        <div class="grid grid-cols-10 gap-1.5">
          <UTooltip
            v-for="slot in ROW_LENGTH"
            :key="`${row}-${slot}`"
            :text="t('pixelStitch.color.swatchTooltip', { color: editor.palette.value[rowIndex * ROW_LENGTH + slot - 1] ?? '' })"
          >
            <button
              type="button"
              class="aspect-square w-full rounded-md ring-1 ring-default transition-transform duration-150 hover:scale-110"
              :class="editor.currentColor.value === editor.palette.value[rowIndex * ROW_LENGTH + slot - 1]
                ? 'ring-2 ring-primary'
                : ''"
              :style="{ backgroundColor: editor.palette.value[rowIndex * ROW_LENGTH + slot - 1] }"
              :aria-label="editor.palette.value[rowIndex * ROW_LENGTH + slot - 1]"
              @click="editor.currentColor.value = editor.palette.value[rowIndex * ROW_LENGTH + slot - 1] ?? '#000000'"
              @dragover.prevent
              @drop.prevent="onDrop(rowIndex * ROW_LENGTH + slot - 1)"
            />
          </UTooltip>
        </div>
      </div>
    </div>
  </UPageCard>
</template>
