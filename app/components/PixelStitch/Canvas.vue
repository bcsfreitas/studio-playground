<script setup lang="ts">
import type { PixelGrid, Point } from '~/composables/pixelStitch/types'
import { cloneGrid, hexToRgba, isHexColor } from '~/composables/pixelStitch/project'
import { compositeLayers, drawCheckerboard } from '~/composables/pixelStitch/render'
import { usePixelStitchContext } from '~/composables/usePixelStitchContext'

const editor = usePixelStitchContext()
const { t } = useI18n()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

// Onion-skin ghosts are tinted rather than drawn in their own colors, so past
// and future frames stay distinguishable from the frame being drawn. Brand
// colors instead of the original's magenta/cyan: both read as "not artwork"
// against the light canvas, and they're already the platform's two accents.
const GHOST_PREVIOUS = '#f97316'
const GHOST_NEXT = '#6b8afd'

// Opacity is applied when painting, not stored, so the palette keeps clean hex
// values while a translucent brush still lays down translucent pixels.
const drawColor = computed(() =>
  editor.brushOpacity.value < 1 && isHexColor(editor.currentColor.value)
    ? hexToRgba(editor.currentColor.value, editor.brushOpacity.value)
    : editor.currentColor.value
)

// ─── Sizing ─────────────────────────────────────────────────────────────────

// One artwork pixel in screen pixels. Chosen to fill the panel without
// overflowing the viewport, with a floor per canvas size — a 128×128 grid at
// its natural fit would be unusably small, so it's allowed to overflow and
// scroll instead.
const pixelSize = ref(16)

function measurePixelSize() {
  const container = containerRef.value
  if (!container) return 16
  const size = editor.canvasSize.value
  const maxWidth = container.clientWidth - 64
  const maxHeight = Math.min(window.innerHeight * 0.6, 800)
  const fitted = Math.floor(Math.min(maxWidth / size, maxHeight / size))
  const minimum = size <= 32 ? 12 : size <= 64 ? 6 : size <= 128 ? 3 : 2
  return Math.max(minimum, Math.min(fitted, 48))
}

function updatePixelSize() {
  pixelSize.value = measurePixelSize()
}

const canvasPixels = computed(() => editor.canvasSize.value * pixelSize.value)

// ─── Painting ───────────────────────────────────────────────────────────────

function paint() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  const size = editor.canvasSize.value
  const scale = pixelSize.value

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCheckerboard(ctx, canvas.width, canvas.height, scale * 2)

  const onion = editor.onionSkin.value
  if (onion.enabled) {
    // Each step further from the current frame fades further, so the nearest
    // ghost reads as the one to line up against.
    for (let offset = 1; offset <= onion.previousFrames; offset++) {
      const frame = editor.frames.value[editor.currentFrameIndex.value - offset]
      if (!frame) continue
      const alpha = onion.opacity * (1 - offset / (onion.previousFrames + 1))
      compositeLayers(ctx, frame.layers, size, scale, GHOST_PREVIOUS, alpha)
    }
    for (let offset = 1; offset <= onion.nextFrames; offset++) {
      const frame = editor.frames.value[editor.currentFrameIndex.value + offset]
      if (!frame) continue
      const alpha = onion.opacity * (1 - offset / (onion.nextFrames + 1))
      compositeLayers(ctx, frame.layers, size, scale, GHOST_NEXT, alpha)
    }
  }

  const layers = editor.currentFrame.value?.layers ?? []
  compositeLayers(ctx, layers, size, scale)

  if (editor.gridVisible.value) {
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.18)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= size; i++) {
      ctx.beginPath()
      ctx.moveTo(i * scale, 0)
      ctx.lineTo(i * scale, size * scale)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * scale)
      ctx.lineTo(size * scale, i * scale)
      ctx.stroke()
    }
  }

  const stamp = editor.clipboard.value
  const at = editor.pastePreview.value
  if (stamp && at && editor.selectionMode.value === 'pasting') {
    ctx.globalAlpha = 0.8
    for (let y = 0; y < stamp.length; y++) {
      for (let x = 0; x < stamp[y]!.length; x++) {
        const color = stamp[y]![x]
        if (!color) continue
        const targetX = at.x + x
        const targetY = at.y + y
        if (targetX < 0 || targetX >= size || targetY < 0 || targetY >= size) continue
        ctx.fillStyle = color
        ctx.fillRect(targetX * scale, targetY * scale, scale, scale)
      }
    }
    ctx.globalAlpha = 1
    strokeMarquee(ctx, at.x, at.y, stamp[0]!.length, stamp.length, '#16a34a')
  }

  const area = editor.selection.value
  const mode = editor.selectionMode.value
  if (area && (mode === 'selecting' || mode === 'selected')) {
    if (mode === 'selected') {
      ctx.fillStyle = 'rgba(107, 138, 253, 0.16)'
      ctx.fillRect(area.x * scale, area.y * scale, area.width * scale, area.height * scale)
    }
    strokeMarquee(ctx, area.x, area.y, area.width, area.height, '#3b5bdb')
  }
}

function strokeMarquee(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
  const scale = pixelSize.value
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.setLineDash([8, 4])
  ctx.strokeRect(x * scale, y * scale, width * scale, height * scale)
  ctx.setLineDash([])
}

// ─── Pointer helpers ────────────────────────────────────────────────────────

// The canvas is CSS-transformed by the zoom control, so client coordinates have
// to be scaled back through its rendered size — `pixelSize` alone would be
// wrong at anything but 100%.
function toGrid(clientX: number, clientY: number): Point | null {
  const canvas = canvasRef.value
  if (!canvas) return null
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor(((clientX - rect.left) * (canvas.width / rect.width)) / pixelSize.value)
  const y = Math.floor(((clientY - rect.top) * (canvas.height / rect.height)) / pixelSize.value)
  const size = editor.canvasSize.value
  return x >= 0 && x < size && y >= 0 && y < size ? { x, y } : null
}

// ─── Tools ──────────────────────────────────────────────────────────────────

const isDrawing = ref(false)
const isErasingWithRightButton = ref(false)
const lastPoint = ref<Point | null>(null)
const isSelecting = ref(false)
const selectionStart = ref<Point | null>(null)

function stampBrush(data: PixelGrid, x: number, y: number, radius: number, color: string) {
  const size = editor.canvasSize.value
  const origin = Math.floor(radius / 2)
  for (let dy = 0; dy < radius; dy++) {
    for (let dx = 0; dx < radius; dx++) {
      const px = x - origin + dx
      const py = y - origin + dy
      if (px >= 0 && px < size && py >= 0 && py < size) data[py]![px] = color
    }
  }
}

// Bresenham between pointer samples: a fast drag reports far-apart positions,
// and stamping only those would leave a dotted stroke.
function strokeLine(data: PixelGrid, from: Point, to: Point, radius: number, color: string) {
  const dx = Math.abs(to.x - from.x)
  const dy = Math.abs(to.y - from.y)
  const stepX = from.x < to.x ? 1 : -1
  const stepY = from.y < to.y ? 1 : -1
  let error = dx - dy
  let { x, y } = from

  for (;;) {
    stampBrush(data, x, y, radius, color)
    if (x === to.x && y === to.y) break
    const doubled = 2 * error
    if (doubled > -dy) {
      error -= dy
      x += stepX
    }
    if (doubled < dx) {
      error += dx
      y += stepY
    }
  }
}

function paintAt(point: Point, erase = false) {
  const layer = editor.currentLayer.value
  if (!layer) return
  const radius = erase || editor.currentTool.value === 'eraser' ? editor.eraserSize.value : editor.brushSize.value
  const color = erase || editor.currentTool.value === 'eraser' ? '' : drawColor.value
  const data = cloneGrid(layer.data)

  if (lastPoint.value) strokeLine(data, lastPoint.value, point, radius, color)
  else stampBrush(data, point.x, point.y, radius, color)

  editor.setLayerData(data)
  lastPoint.value = point
}

function floodFill(start: Point) {
  const layer = editor.currentLayer.value
  if (!layer) return
  const target = layer.data[start.y]?.[start.x] ?? ''
  if (target === drawColor.value) return

  const size = editor.canvasSize.value
  const data = cloneGrid(layer.data)
  const stack: Point[] = [start]

  while (stack.length > 0) {
    const { x, y } = stack.pop()!
    if (x < 0 || x >= size || y < 0 || y >= size) continue
    if (data[y]![x] !== target) continue
    data[y]![x] = drawColor.value
    stack.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 })
  }

  editor.setLayerData(data, true)
}

function replaceColor(start: Point) {
  const layer = editor.currentLayer.value
  if (!layer) return
  const target = layer.data[start.y]?.[start.x] ?? ''
  if (target === drawColor.value) return
  editor.setLayerData(
    layer.data.map(row => row.map(color => (color === target ? drawColor.value : color))),
    true
  )
}

// Picks from the topmost visible layer, which is what the artist sees.
function pickColor(point: Point) {
  const layers = editor.currentFrame.value?.layers ?? []
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i]!
    const color = layer.data[point.y]?.[point.x]
    if (layer.visible && color) {
      editor.currentColor.value = color
      return
    }
  }
  editor.currentColor.value = '#000000'
}

function applySingleShotTool(point: Point): boolean {
  switch (editor.currentTool.value) {
    case 'eyedropper':
      pickColor(point)
      return true
    case 'fill':
      floodFill(point)
      return true
    case 'replace':
      replaceColor(point)
      return true
    default:
      return false
  }
}

// ─── Pointer events ─────────────────────────────────────────────────────────

// One pointer path for mouse, pen and touch. The original had parallel mouse
// and touch handlers that had already drifted apart (touch cleared the
// clipboard after a paste, mouse kept it); pointer events collapse them.
function onPointerDown(event: PointerEvent) {
  const point = toGrid(event.clientX, event.clientY)
  if (!point) return
  canvasRef.value?.setPointerCapture(event.pointerId)

  // Right-drag erases whatever the active tool is — the fastest correction
  // while drawing, and the reason erase isn't gated on the eraser tool here.
  if (event.button === 2) {
    event.preventDefault()
    isDrawing.value = true
    isErasingWithRightButton.value = true
    lastPoint.value = null
    paintAt(point, true)
    return
  }

  if (editor.currentTool.value === 'select') {
    if (editor.clipboard.value && editor.selectionMode.value === 'pasting') {
      editor.commitPaste()
      return
    }
    isSelecting.value = true
    selectionStart.value = point
    editor.selection.value = null
    editor.selectionMode.value = 'selecting'
    return
  }

  if (applySingleShotTool(point)) return

  isDrawing.value = true
  lastPoint.value = null
  paintAt(point)
}

function onPointerMove(event: PointerEvent) {
  // Paste tracking runs on the document instead, so the stamp keeps following
  // the cursor past the canvas edge.
  if (editor.selectionMode.value === 'pasting' && !isSelecting.value) return

  const point = toGrid(event.clientX, event.clientY)
  if (!point) return

  if (isSelecting.value && selectionStart.value) {
    const start = selectionStart.value
    editor.selection.value = {
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      width: Math.abs(point.x - start.x) + 1,
      height: Math.abs(point.y - start.y) + 1
    }
    return
  }

  if (!isDrawing.value) return
  if (isErasingWithRightButton.value) {
    paintAt(point, true)
    return
  }
  if (editor.currentTool.value !== 'pencil' && editor.currentTool.value !== 'eraser') return
  paintAt(point)
}

function onPointerUp() {
  if (isSelecting.value && editor.selection.value) {
    editor.selectionMode.value = 'selected'
    isSelecting.value = false
    selectionStart.value = null
    return
  }
  isSelecting.value = false
  selectionStart.value = null

  if (isDrawing.value) editor.commitCurrentLayer()
  isDrawing.value = false
  isErasingWithRightButton.value = false
  lastPoint.value = null
}

function onPointerLeave() {
  // Not during a paste: the cursor is expected to leave and come back while
  // positioning the stamp.
  if (editor.selectionMode.value === 'pasting') return
  onPointerUp()
}

function trackPasteCursor(event: PointerEvent) {
  const canvas = canvasRef.value
  const stamp = editor.clipboard.value
  if (!canvas || !stamp) return
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor(((event.clientX - rect.left) * (canvas.width / rect.width)) / pixelSize.value)
  const y = Math.floor(((event.clientY - rect.top) * (canvas.height / rect.height)) / pixelSize.value)
  // Centre the stamp on the cursor rather than hanging it off the corner.
  editor.pastePreview.value = {
    x: x - Math.floor(stamp[0]!.length / 2),
    y: y - Math.floor(stamp.length / 2)
  }
}

// ─── Zoom ───────────────────────────────────────────────────────────────────

function zoomBy(delta: number) {
  editor.zoom.value = Math.min(4, Math.max(0.25, Number((editor.zoom.value + delta).toFixed(2))))
}

// ─── Lifecycle ──────────────────────────────────────────────────────────────

watch(() => editor.canvasSize.value, () => nextTick(updatePixelSize))

// Deep, because drawing mutates the pixel arrays inside the frames rather than
// replacing them.
watch(
  [
    () => editor.frames.value,
    () => editor.currentFrameIndex.value,
    () => editor.gridVisible.value,
    () => editor.onionSkin.value,
    () => editor.selection.value,
    () => editor.selectionMode.value,
    () => editor.pastePreview.value,
    pixelSize
  ],
  () => nextTick(paint),
  { deep: true }
)

watch(
  () => editor.selectionMode.value === 'pasting' && Boolean(editor.clipboard.value),
  (isPasting) => {
    if (isPasting) document.addEventListener('pointermove', trackPasteCursor)
    else document.removeEventListener('pointermove', trackPasteCursor)
  }
)

// A backgrounded tab can lose its canvas bitmap (screen sharing and some GPU
// driver resets do this), and nothing in the app's own state changes to trigger
// a repaint — so re-run it when the page comes back.
function repaintOnReturn() {
  if (!document.hidden) requestAnimationFrame(paint)
}

onMounted(() => {
  updatePixelSize()
  nextTick(paint)
  window.addEventListener('resize', updatePixelSize)
  document.addEventListener('visibilitychange', repaintOnReturn)
  window.addEventListener('focus', repaintOnReturn)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePixelSize)
  document.removeEventListener('visibilitychange', repaintOnReturn)
  window.removeEventListener('focus', repaintOnReturn)
  document.removeEventListener('pointermove', trackPasteCursor)
})

const selectionHint = computed(() => {
  if (editor.currentTool.value !== 'select') return null
  switch (editor.selectionMode.value) {
    case 'selecting': return t('pixelStitch.canvas.hintSelecting')
    case 'selected': return t('pixelStitch.canvas.hintSelected')
    case 'pasting': return t('pixelStitch.canvas.hintPasting')
    default: return t('pixelStitch.canvas.hintIdle')
  }
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <UAlert
      v-if="selectionHint"
      :description="selectionHint"
      icon="lucide:box-select"
      color="secondary"
      variant="soft"
    />

    <UPageCard variant="outline" :ui="{ root: 'rounded-2xl', container: 'p-3 sm:p-3 gap-3' }">
      <div class="flex items-center justify-center gap-1">
        <UTooltip :text="t('pixelStitch.canvas.zoomOut')">
          <UButton
            icon="lucide:minus"
            color="neutral"
            variant="outline"
            size="sm"
            :aria-label="t('pixelStitch.canvas.zoomOut')"
            @click="zoomBy(-0.25)"
          />
        </UTooltip>
        <UTooltip :text="t('pixelStitch.canvas.zoomReset')">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            class="min-w-[68px] justify-center tabular-nums"
            @click="editor.zoom.value = 1"
          >
            {{ Math.round(editor.zoom.value * 100) }}%
          </UButton>
        </UTooltip>
        <UTooltip :text="t('pixelStitch.canvas.zoomIn')">
          <UButton
            icon="lucide:plus"
            color="neutral"
            variant="outline"
            size="sm"
            :aria-label="t('pixelStitch.canvas.zoomIn')"
            @click="zoomBy(0.25)"
          />
        </UTooltip>
      </div>

      <div ref="containerRef" class="flex items-center justify-center overflow-auto rounded-xl bg-elevated p-4">
        <!-- `touch-none` stops a drawing drag from scrolling the page on a
             tablet; `image-rendering: pixelated` keeps the zoom crisp instead
             of blurring artwork pixels into each other. -->
        <canvas
          ref="canvasRef"
          :width="canvasPixels"
          :height="canvasPixels"
          class="touch-none rounded-sm ring-1 ring-default cursor-crosshair"
          :style="{ imageRendering: 'pixelated', transform: `scale(${editor.zoom.value})`, transformOrigin: 'center center' }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @pointerleave="onPointerLeave"
          @contextmenu.prevent
        />
      </div>
    </UPageCard>
  </div>
</template>
