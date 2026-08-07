import type { InjectionKey } from 'vue'
import { usePixelStitch } from '~/composables/usePixelStitch'

export type PixelStitchEditor = ReturnType<typeof usePixelStitch>

const PIXEL_STITCH_KEY: InjectionKey<PixelStitchEditor> = Symbol('pixel-stitch')

/**
 * Pixel Stitch's panels all act on one shared cursor — the current frame, the
 * current layer, the current tool — so the editor is provided once by the page
 * instead of threaded through every panel as props. The original React version
 * held the same state in a single container component and passed roughly thirty
 * props down; this is that container, minus the prop drilling.
 */
export function providePixelStitch(editor: PixelStitchEditor) {
  provide(PIXEL_STITCH_KEY, editor)
}

export function usePixelStitchContext(): PixelStitchEditor {
  const editor = inject(PIXEL_STITCH_KEY, null)
  if (!editor) throw new Error('Pixel Stitch panels must be rendered inside the Pixel Stitch page')
  return editor
}
