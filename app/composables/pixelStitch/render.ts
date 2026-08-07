import type { Frame, Layer } from './types'

// Every export path and every preview flattens the same way — visible layers
// bottom-up, each at its own opacity — so the compositing lives here once
// rather than being re-derived in the canvas, the previews and three exporters.
export function compositeLayers(
  ctx: CanvasRenderingContext2D,
  layers: Layer[],
  canvasSize: number,
  pixelSize = 1,
  // `tint` flattens every pixel to one color and `alpha` scales the whole
  // stack — together they're what turns a frame into an onion-skin ghost.
  // `alpha` has to multiply into each layer's own opacity rather than be set
  // beforehand, since the loop below assigns globalAlpha per layer.
  tint?: string,
  alpha = 1
) {
  for (const layer of layers) {
    if (!layer.visible) continue
    ctx.globalAlpha = layer.opacity * alpha
    for (let y = 0; y < canvasSize; y++) {
      for (let x = 0; x < canvasSize; x++) {
        const color = layer.data[y]?.[x]
        if (!color) continue
        ctx.fillStyle = tint ?? color
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
      }
    }
  }
  ctx.globalAlpha = 1
}

// The transparency checkerboard. Light-on-light to match the platform's light
// surfaces — the original drew near-black squares for its dark theme, which
// would read as a filled background here.
export function drawCheckerboard(ctx: CanvasRenderingContext2D, width: number, height: number, squareSize: number) {
  for (let y = 0; y < height; y += squareSize) {
    for (let x = 0; x < width; x += squareSize) {
      const evenRow = (y / squareSize) % 2 === 0
      const evenColumn = (x / squareSize) % 2 === 0
      ctx.fillStyle = evenRow === evenColumn ? '#f8fafc' : '#e2e8f0'
      ctx.fillRect(x, y, squareSize, squareSize)
    }
  }
}

// Flattens one frame onto an offscreen canvas at 1 pixel per pixel, which is
// what PNG/GIF/sprite-sheet export all need before they diverge.
export function renderFrameToCanvas(frame: Frame, canvasSize: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = canvasSize
  canvas.height = canvasSize
  const ctx = canvas.getContext('2d')
  if (ctx) compositeLayers(ctx, frame.layers, canvasSize)
  return canvas
}

export function frameToBlob(frame: Frame, canvasSize: number): Promise<Blob | null> {
  return new Promise(resolve => renderFrameToCanvas(frame, canvasSize).toBlob(resolve))
}
