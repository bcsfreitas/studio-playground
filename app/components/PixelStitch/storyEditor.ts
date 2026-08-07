import { h } from 'vue'
import { usePixelStitch } from '../../composables/usePixelStitch'
import { providePixelStitch } from '../../composables/usePixelStitchContext'
import { DEFAULT_PALETTE } from '../../composables/pixelStitch/project'
import type { PixelStitchEditor } from '../../composables/usePixelStitchContext'

/**
 * Every Pixel Stitch panel reads the editor out of the page's `provide` rather
 * than taking props, so none of them render standalone. This builds a real
 * editor for a story and provides it, optionally seeding artwork first.
 *
 * `width` frames the panel at roughly the column it occupies on the page —
 * the inspectors live in a 340px rail and the canvas takes the rest.
 */
export function withEditor(options: { width?: string, seed?: (editor: PixelStitchEditor) => void } = {}) {
  return () => ({
    setup() {
      // `persist: false` — otherwise a story's seeded artwork would be written
      // over whatever the developer had drawn in the real editor.
      const editor = usePixelStitch({ persist: false })
      options.seed?.(editor)
      providePixelStitch(editor)
    },
    render(this: { $slots: { default?: () => unknown } }) {
      return h('div', { class: options.width ?? 'w-[900px]' }, this.$slots.default?.() as never)
    }
  })
}

/**
 * Paints a recognisable shape so previews and thumbnails aren't blank. A
 * diagonal band plus a filled corner reads as artwork at 64px, which a scatter
 * of single pixels does not.
 */
export function paintSample(editor: PixelStitchEditor, frameIndex = 0, offset = 0) {
  const size = editor.canvasSize.value
  const layer = editor.frames.value[frameIndex]?.layers[0]
  if (!layer) return
  const ink = DEFAULT_PALETTE[(offset % 8) + 1]!
  for (let i = 0; i < size; i++) {
    const x = (i + offset) % size
    layer.data[i]![x] = ink
    if (i < size / 3) {
      for (let j = 0; j < size / 3; j++) layer.data[i]![j] = DEFAULT_PALETTE[20 + (offset % 8)]!
    }
  }
}

/** Adds frames so the strip, the preview counter and GIF export have something to work with. */
export function addFrames(editor: PixelStitchEditor, count: number) {
  for (let i = 1; i <= count; i++) {
    editor.addFrame()
    paintSample(editor, i, i * 3)
  }
  editor.currentFrameIndex.value = 0
}
