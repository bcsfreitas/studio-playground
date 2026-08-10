import { encode } from 'modern-gif'
import type { Frame } from './types'
import { renderFrameToCanvas } from './render'

// Progress is reported across two halves: rasterising the frames, then
// encoding. Encoding gives no incremental signal, so the bar sits at 50% while
// it runs rather than pretending to advance.
export async function exportAsGif(
  frames: Frame[],
  canvasSize: number,
  fps: number,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const gifFrames = frames.map((frame, index) => {
    const ctx = renderFrameToCanvas(frame, canvasSize).getContext('2d')!
    onProgress(((index + 1) / frames.length) * 0.5)
    return ctx.getImageData(0, 0, canvasSize, canvasSize)
  })

  const output = await encode({
    width: canvasSize,
    height: canvasSize,
    frames: gifFrames.map(imageData => ({
      data: imageData.data,
      delay: Math.round(1000 / fps)
    }))
  })

  onProgress(1)
  return new Blob([output], { type: 'image/gif' })
}
