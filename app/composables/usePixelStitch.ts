import type {
  Frame,
  OnionSkinSettings,
  PixelGrid,
  PixelTool,
  Point,
  ProjectData,
  Selection,
  SelectionMode
} from '~/composables/pixelStitch/types'
import { MAX_HISTORY_STEPS } from '~/composables/pixelStitch/types'
import {
  DEFAULT_PALETTE,
  cloneGrid,
  createFrame,
  createLayer,
  emptyGrid,
  hexToRgb
} from '~/composables/pixelStitch/project'
import {
  loadPalette,
  loadProject,
  savePalette,
  saveProject
} from '~/composables/pixelStitch/persistence'

interface HistoryEntry {
  frameIndex: number
  layerIndex: number
  data: PixelGrid
}

/**
 * All of Pixel Stitch's editor state and the operations that mutate it. The
 * page owns a single instance and hands slices of it to the panels, mirroring
 * the original's single-container-component shape — every tool acts on the same
 * frame/layer cursor, so splitting the state per panel would just mean threading
 * it back together.
 */
export interface PixelStitchOptions {
  /**
   * Restore the saved project on mount and autosave to localStorage. Off for
   * Storybook, where a story seeding its own artwork would otherwise overwrite
   * whatever the developer had actually drawn.
   */
  persist?: boolean
}

export function usePixelStitch(options: PixelStitchOptions = {}) {
  const { persist = true } = options
  const { t } = useI18n()
  const toast = useToast()

  function notify(key: string, color: 'success' | 'error' | 'info' = 'success') {
    toast.add({ title: t(`pixelStitch.toast.${key}`), color })
  }

  // ─── Document state ───────────────────────────────────────────────────────

  const canvasSize = ref(32)
  const frames = ref<Frame[]>([createFrame(32, 1)])
  const currentFrameIndex = ref(0)
  const currentLayerIndex = ref(0)
  const fps = ref(8)

  const currentFrame = computed(() => frames.value[currentFrameIndex.value])
  const currentLayer = computed(() => currentFrame.value?.layers[currentLayerIndex.value])

  // ─── Tool state ───────────────────────────────────────────────────────────

  const currentColor = ref('#FF00FF')
  const brushOpacity = ref(1)
  const currentTool = ref<PixelTool>('pencil')
  const brushSize = ref(1)
  const eraserSize = ref(1)
  const gridVisible = ref(true)
  const zoom = ref(1)
  const palette = ref<string[]>([...DEFAULT_PALETTE])

  const isPlaying = ref(false)
  const onionSkin = ref<OnionSkinSettings>({
    enabled: false,
    previousFrames: 1,
    nextFrames: 1,
    opacity: 0.3
  })

  const selection = ref<Selection | null>(null)
  const clipboard = ref<PixelGrid | null>(null)
  const pastePreview = ref<Point | null>(null)
  const selectionMode = ref<SelectionMode>(null)

  // ─── History ──────────────────────────────────────────────────────────────

  const history = ref<HistoryEntry[]>([])
  const historyIndex = ref(-1)
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  function pushHistory(data: PixelGrid) {
    const trimmed = history.value.slice(0, historyIndex.value + 1)
    trimmed.push({
      frameIndex: currentFrameIndex.value,
      layerIndex: currentLayerIndex.value,
      data: cloneGrid(data)
    })
    // Keep one extra entry: the oldest is the state undo returns *to*, not a
    // step of its own.
    history.value = trimmed.length > MAX_HISTORY_STEPS + 1
      ? trimmed.slice(trimmed.length - MAX_HISTORY_STEPS - 1)
      : trimmed
    historyIndex.value = history.value.length - 1
  }

  function resetHistory(data: PixelGrid) {
    history.value = [{ frameIndex: 0, layerIndex: 0, data: cloneGrid(data) }]
    historyIndex.value = 0
  }

  function applyHistoryEntry(entry: HistoryEntry) {
    const layer = frames.value[entry.frameIndex]?.layers[entry.layerIndex]
    if (!layer) return
    layer.data = cloneGrid(entry.data)
  }

  function undo() {
    if (!canUndo.value) return
    historyIndex.value -= 1
    applyHistoryEntry(history.value[historyIndex.value]!)
  }

  function redo() {
    if (!canRedo.value) return
    historyIndex.value += 1
    applyHistoryEntry(history.value[historyIndex.value]!)
  }

  // ─── Drawing ──────────────────────────────────────────────────────────────

  // The single write path for pixel data. `commit` marks the end of a gesture:
  // a drag paints continuously but only lands one undo step, when the pointer
  // comes up.
  function setLayerData(data: PixelGrid, commit = false) {
    const layer = currentLayer.value
    if (!layer) return
    layer.data = data
    if (commit) pushHistory(data)
  }

  function commitCurrentLayer() {
    const layer = currentLayer.value
    if (layer) pushHistory(layer.data)
  }

  // ─── Layers ───────────────────────────────────────────────────────────────

  function addLayer() {
    const frame = currentFrame.value
    if (!frame) return
    frame.layers.push(createLayer(canvasSize.value, Date.now()))
    currentLayerIndex.value = frame.layers.length - 1
    notify('layerAdded')
  }

  function deleteLayer(index: number) {
    const frame = currentFrame.value
    if (!frame) return
    if (frame.layers.length === 1) {
      notify('cannotDeleteLastLayer', 'error')
      return
    }
    frame.layers.splice(index, 1)
    currentLayerIndex.value = Math.min(currentLayerIndex.value, frame.layers.length - 1)
    notify('layerDeleted')
  }

  function toggleLayerVisibility(index: number) {
    const layer = currentFrame.value?.layers[index]
    if (layer) layer.visible = !layer.visible
  }

  function setLayerOpacity(index: number, opacity: number) {
    const layer = currentFrame.value?.layers[index]
    if (layer) layer.opacity = opacity
  }

  function renameLayer(index: number, name: string) {
    const layer = currentFrame.value?.layers[index]
    if (layer) layer.name = name
  }

  // "Up" is toward the top of the stack, which is the end of the array, since
  // later layers composite over earlier ones.
  function moveLayer(index: number, direction: 1 | -1) {
    const layers = currentFrame.value?.layers
    const target = index + direction
    if (!layers || target < 0 || target >= layers.length) return
    const [moved] = layers.splice(index, 1)
    layers.splice(target, 0, moved!)
    currentLayerIndex.value = target
  }

  function clearLayer() {
    setLayerData(emptyGrid(canvasSize.value), true)
    notify('layerCleared')
  }

  // Undo only brings back the layer that was selected: a history entry names a
  // single frame and layer, so a change spanning the whole stack can't be
  // recorded as one step. Inherited from the original, and the reason this is
  // offered as a separate menu item rather than as the default clear.
  function clearAllLayers() {
    const frame = currentFrame.value
    if (!frame) return
    for (const layer of frame.layers) layer.data = emptyGrid(canvasSize.value)
    commitCurrentLayer()
    notify('allLayersCleared')
  }

  // ─── Frames ───────────────────────────────────────────────────────────────

  function addFrame() {
    frames.value.push(createFrame(canvasSize.value, Date.now()))
    currentFrameIndex.value = frames.value.length - 1
    currentLayerIndex.value = 0
    notify('frameAdded')
  }

  function deleteFrame(index: number) {
    if (frames.value.length === 1) {
      notify('cannotDeleteLastFrame', 'error')
      return
    }
    frames.value.splice(index, 1)
    currentFrameIndex.value = Math.min(currentFrameIndex.value, frames.value.length - 1)
    currentLayerIndex.value = 0
    notify('frameDeleted')
  }

  function duplicateFrame(index: number) {
    const source = frames.value[index]
    if (!source) return
    frames.value.splice(index + 1, 0, {
      id: Date.now(),
      layers: source.layers.map((layer, offset) => ({
        ...layer,
        id: Date.now() + offset,
        data: cloneGrid(layer.data)
      }))
    })
    currentFrameIndex.value = index + 1
    notify('frameDuplicated')
  }

  function reorderFrames(from: number, to: number) {
    if (from === to) return
    const [moved] = frames.value.splice(from, 1)
    if (!moved) return
    frames.value.splice(to, 0, moved)
    // Follow whichever frame the artist was editing rather than the index.
    if (currentFrameIndex.value === from) currentFrameIndex.value = to
    else if (from < currentFrameIndex.value && to >= currentFrameIndex.value) currentFrameIndex.value -= 1
    else if (from > currentFrameIndex.value && to <= currentFrameIndex.value) currentFrameIndex.value += 1
  }

  function selectFrame(index: number) {
    currentFrameIndex.value = index
    currentLayerIndex.value = 0
  }

  // ─── Canvas transforms ────────────────────────────────────────────────────

  function flipHorizontal() {
    const layer = currentLayer.value
    if (!layer) return
    setLayerData(layer.data.map(row => [...row].reverse()), true)
    notify('flippedHorizontal')
  }

  function flipVertical() {
    const layer = currentLayer.value
    if (!layer) return
    setLayerData([...layer.data].reverse().map(row => [...row]), true)
    notify('flippedVertical')
  }

  // Removes whichever color dominates the layer's border, plus anything close
  // enough to it to be an anti-aliased edge of the same background — an
  // imported PNG rarely has one exact background value.
  const BACKGROUND_TOLERANCE = 48

  function removeBackground() {
    const layer = currentLayer.value
    if (!layer) return
    const size = canvasSize.value
    const counts: Record<string, number> = {}
    const tally = (color?: string) => {
      if (!color) return
      const key = color.toUpperCase()
      counts[key] = (counts[key] ?? 0) + 1
    }

    const last = size - 1
    for (let i = 0; i < size; i++) {
      tally(layer.data[0]?.[i])
      tally(layer.data[last]?.[i])
      tally(layer.data[i]?.[0])
      tally(layer.data[i]?.[last])
    }

    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1])
    if (ranked.length === 0) {
      notify('nothingToRemove', 'info')
      return
    }

    const backgroundColor = ranked[0]![0]
    const backgroundRgb = hexToRgb(backgroundColor)

    setLayerData(
      layer.data.map(row => row.map((color) => {
        if (!color) return color
        if (color.toUpperCase() === backgroundColor) return ''
        const rgb = backgroundRgb && hexToRgb(color)
        if (!rgb || !backgroundRgb) return color
        const distance = Math.hypot(rgb[0] - backgroundRgb[0], rgb[1] - backgroundRgb[1], rgb[2] - backgroundRgb[2])
        return distance <= BACKGROUND_TOLERANCE ? '' : color
      })),
      true
    )
    notify('backgroundRemoved')
  }

  // ─── Canvas size ──────────────────────────────────────────────────────────

  // Resizing starts over: pixel art can't be rescaled between grids without
  // either resampling or cropping, and the original chose a clean slate.
  function setCanvasSize(size: number) {
    if (size === canvasSize.value) return
    canvasSize.value = size
    for (const frame of frames.value) {
      for (const layer of frame.layers) layer.data = emptyGrid(size)
    }
    resetHistory(currentLayer.value?.data ?? emptyGrid(size))
    toast.add({ title: t('pixelStitch.toast.canvasSizeChanged', { size: `${size}×${size}` }), color: 'success' })
  }

  // ─── Palette ──────────────────────────────────────────────────────────────

  function setPaletteColor(index: number, color: string) {
    palette.value[index] = color
    notify('colorAddedToPalette')
  }

  // ─── Selection / clipboard ────────────────────────────────────────────────

  function cancelSelection() {
    selection.value = null
    pastePreview.value = null
    clipboard.value = null
    selectionMode.value = null
  }

  function copySelection(cut = false) {
    const area = selection.value
    const layer = currentLayer.value
    if (!area || !layer || selectionMode.value !== 'selected') return

    const copied: PixelGrid = []
    for (let y = area.y; y < area.y + area.height; y++) {
      const row: string[] = []
      for (let x = area.x; x < area.x + area.width; x++) row.push(layer.data[y]?.[x] ?? '')
      copied.push(row)
    }

    if (cut) {
      const data = cloneGrid(layer.data)
      for (let y = area.y; y < area.y + area.height; y++) {
        for (let x = area.x; x < area.x + area.width; x++) {
          if (data[y]?.[x] !== undefined) data[y]![x] = ''
        }
      }
      setLayerData(data, true)
    }

    clipboard.value = copied
    selectionMode.value = 'pasting'
    pastePreview.value = { x: area.x, y: area.y }
    notify(cut ? 'cutMoveToPos' : 'copiedMoveToPos')
  }

  function beginPaste() {
    if (!clipboard.value || currentTool.value !== 'select') return
    selectionMode.value = 'pasting'
    pastePreview.value = { x: 0, y: 0 }
    notify('moveMouseToPaste')
  }

  // Pasting keeps the clipboard so the same stamp can be dropped repeatedly.
  function commitPaste() {
    const layer = currentLayer.value
    const stamp = clipboard.value
    const at = pastePreview.value
    if (!layer || !stamp || !at) return

    const size = canvasSize.value
    const data = cloneGrid(layer.data)
    for (let y = 0; y < stamp.length; y++) {
      for (let x = 0; x < stamp[y]!.length; x++) {
        const color = stamp[y]![x]
        if (!color) continue
        const targetX = at.x + x
        const targetY = at.y + y
        if (targetX >= 0 && targetX < size && targetY >= 0 && targetY < size) data[targetY]![targetX] = color
      }
    }
    setLayerData(data, true)
    selection.value = null
  }

  // Leaving the select tool drops any in-flight selection — every other tool
  // draws, and a stale marquee would sit on the canvas with nothing acting on it.
  watch(currentTool, (tool) => {
    if (tool !== 'select') cancelSelection()
  })

  watch(selectionMode, (mode) => {
    if (mode === 'selected') notify('selectionMade')
  })

  // ─── Load / save ──────────────────────────────────────────────────────────

  function toProjectData(): ProjectData {
    return {
      version: 1,
      canvasSize: canvasSize.value,
      fps: fps.value,
      currentFrameIndex: currentFrameIndex.value,
      frames: frames.value
    }
  }

  function applyProjectData(data: ProjectData) {
    frames.value = data.frames
    canvasSize.value = data.canvasSize
    fps.value = data.fps
    currentFrameIndex.value = Math.min(data.currentFrameIndex, data.frames.length - 1)
    currentLayerIndex.value = 0
    resetHistory(data.frames[0]!.layers[0]!.data)
  }

  // Restoring happens on mount rather than in the refs' initialisers because
  // localStorage doesn't exist during SSR — the server would render one
  // document and the client would hydrate a different one. The history still
  // needs seeding when persistence is off, or the first undo has nothing to
  // return to.
  onMounted(() => {
    const saved = persist ? loadProject() : null
    if (saved) applyProjectData(saved)
    else resetHistory(currentLayer.value?.data ?? emptyGrid(canvasSize.value))

    const savedPalette = persist ? loadPalette() : null
    if (savedPalette?.length) palette.value = savedPalette
  })

  // Autosave is debounced because it serialises every pixel of every frame, and
  // a drag mutates the grid on each pointer move.
  let autoSaveTimer: ReturnType<typeof setTimeout> | null = null
  watch([frames, canvasSize, fps, currentFrameIndex], () => {
    if (!persist) return
    if (autoSaveTimer) clearTimeout(autoSaveTimer)
    autoSaveTimer = setTimeout(() => saveProject(toProjectData()), 1000)
  }, { deep: true })

  watch(palette, (value) => {
    if (persist) savePalette([...value])
  }, { deep: true })

  onBeforeUnmount(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer)
  })

  return {
    // document
    canvasSize,
    frames,
    currentFrameIndex,
    currentLayerIndex,
    currentFrame,
    currentLayer,
    fps,
    // tools
    currentColor,
    brushOpacity,
    currentTool,
    brushSize,
    eraserSize,
    gridVisible,
    zoom,
    palette,
    isPlaying,
    onionSkin,
    selection,
    clipboard,
    pastePreview,
    selectionMode,
    // history
    canUndo,
    canRedo,
    undo,
    redo,
    setLayerData,
    commitCurrentLayer,
    resetHistory,
    // layers
    addLayer,
    deleteLayer,
    toggleLayerVisibility,
    setLayerOpacity,
    renameLayer,
    moveLayer,
    clearLayer,
    clearAllLayers,
    // frames
    addFrame,
    deleteFrame,
    duplicateFrame,
    reorderFrames,
    selectFrame,
    // transforms
    flipHorizontal,
    flipVertical,
    removeBackground,
    setCanvasSize,
    setPaletteColor,
    // selection
    cancelSelection,
    copySelection,
    beginPaste,
    commitPaste,
    // project
    toProjectData,
    applyProjectData,
    notify
  }
}
