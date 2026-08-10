import type { Frame, PixelGrid } from './types'
import { renderFrameToCanvas } from './render'
import { createLayer } from './project'

export interface SpriteSheetConfig {
  columns: number
  rows: number
  frameWidth: number
  frameHeight: number
}

export function exportSpriteSheet(frames: Frame[], canvasSize: number, columns: number): string {
  const rows = Math.ceil(frames.length / columns)
  const sheet = document.createElement('canvas')
  sheet.width = canvasSize * columns
  sheet.height = canvasSize * rows
  const ctx = sheet.getContext('2d')
  if (!ctx) throw new Error('Could not get a 2D context for the sprite sheet')

  frames.forEach((frame, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    ctx.drawImage(renderFrameToCanvas(frame, canvasSize), column * canvasSize, row * canvasSize)
  })

  return sheet.toDataURL('image/png')
}

export function importSpriteSheet(
  imageData: ImageData,
  config: SpriteSheetConfig,
  canvasSize: number
): Frame[] {
  const frames: Frame[] = []
  const totalFrames = config.columns * config.rows

  for (let index = 0; index < totalFrames; index++) {
    const startX = (index % config.columns) * config.frameWidth
    const startY = Math.floor(index / config.columns) * config.frameHeight

    const data: PixelGrid = Array.from({ length: canvasSize }, () => Array(canvasSize).fill(''))

    for (let y = 0; y < config.frameHeight && y < canvasSize; y++) {
      for (let x = 0; x < config.frameWidth && x < canvasSize; x++) {
        const pixel = ((startY + y) * imageData.width + (startX + x)) * 4
        const alpha = imageData.data[pixel + 3]!
        if (alpha === 0) continue
        // rgba() rather than hex: a sprite sheet can carry partial alpha, and
        // flattening it to hex here would harden soft edges into solid pixels.
        const [r, g, b] = [imageData.data[pixel]!, imageData.data[pixel + 1]!, imageData.data[pixel + 2]!]
        data[y]![x] = `rgba(${r},${g},${b},${alpha / 255})`
      }
    }

    frames.push({
      id: Date.now() + index,
      layers: [{ ...createLayer(canvasSize, Date.now() + index), data }]
    })
  }

  return frames
}
