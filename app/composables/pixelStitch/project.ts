import type { Frame, Layer, PixelGrid } from './types'

export function emptyGrid(size: number): PixelGrid {
  return Array.from({ length: size }, () => Array(size).fill(''))
}

export function cloneGrid(grid: PixelGrid): PixelGrid {
  return grid.map(row => [...row])
}

export function createLayer(size: number, id: number, name = `Layer ${id}`): Layer {
  return { id, name, data: emptyGrid(size), visible: true, opacity: 1 }
}

export function createFrame(size: number, id: number): Frame {
  return { id, layers: [createLayer(size, id, 'Layer 1')] }
}

// The artist's starting palette: four rows of ten — a hue ramp, two darker
// shades of it, and a pastel highlight row. Ported verbatim from the original,
// because it's the tool's content rather than platform chrome.
export const DEFAULT_PALETTE = [
  '#FFFFFF', '#73ff00', '#fff700', '#ffa200', '#ff0000', '#ff00a2', '#8c00ff', '#1e00ff', '#00fffb', '#000000',
  '#878787', '#008509', '#828500', '#856100', '#850000', '#850068', '#5b0085', '#0f0085', '#006f85', '#000000',
  '#656565', '#006307', '#616300', '#634900', '#630000', '#63004e', '#440063', '#0b0063', '#005363', '#000000',
  '#FFFFFF', '#c9ff99', '#fffb99', '#ffd899', '#ff9999', '#ff99d8', '#d199ff', '#a399ff', '#99fffd', '#999999'
]

export function hexToRgb(hex: string): [number, number, number] | null {
  const value = hex.replace('#', '').trim()
  if (value.length !== 6) return null
  const parsed = Number.parseInt(value, 16)
  if (Number.isNaN(parsed)) return null
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255]
}

export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  return rgb ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})` : hex
}

export function isHexColor(color: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(color)
}
