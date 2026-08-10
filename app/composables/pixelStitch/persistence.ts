import type { ProjectData } from './types'
import { downloadBlob, pickFile } from './files'

const PROJECT_KEY = 'pixel-stitch-project'
const PALETTE_KEY = 'pixel-stitch-palette'

// A project file is user-supplied JSON, so nothing may be trusted: a saved file
// from an older build, a hand-edited one, or an unrelated .json all land here.
function isProjectData(value: unknown): value is ProjectData {
  if (!value || typeof value !== 'object') return false
  const data = value as ProjectData
  return (
    data.version === 1
    && typeof data.canvasSize === 'number'
    && typeof data.fps === 'number'
    && typeof data.currentFrameIndex === 'number'
    && Array.isArray(data.frames)
    && data.frames.length > 0
  )
}

export function loadProject(): ProjectData | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(PROJECT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return isProjectData(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveProject(data: ProjectData) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(PROJECT_KEY, JSON.stringify(data))
  } catch {
    // Quota exceeded or private browsing — autosave is best-effort and must
    // never interrupt drawing.
  }
}

export function loadPalette(): string[] | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(PALETTE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every(entry => typeof entry === 'string') ? parsed : null
  } catch {
    return null
  }
}

export function savePalette(palette: string[]) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(PALETTE_KEY, JSON.stringify(palette))
  } catch {
    // See saveProject.
  }
}

export function downloadProjectFile(data: ProjectData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, 'pixel-stitch-project.tps')
}

export async function openProjectFile(): Promise<ProjectData | null> {
  const file = await pickFile('.tps,.json')
  if (!file) return null
  try {
    const parsed = JSON.parse(await file.text())
    return isProjectData(parsed) ? parsed : null
  } catch {
    return null
  }
}
