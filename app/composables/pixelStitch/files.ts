// Browser file in/out for Pixel Stitch. The original shipped as a Tauri desktop
// app and branched between native dialogs and these DOM fallbacks; running
// inside the platform there is no native side, so only the browser paths
// survive.

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export async function downloadDataUrl(dataUrl: string, fileName: string) {
  const response = await fetch(dataUrl)
  downloadBlob(await response.blob(), fileName)
}

// Resolves to null when the picker is dismissed. `oncancel` isn't universally
// supported, so a dismissed dialog can leave this promise pending — harmless
// here, since the caller only ever awaits it to decide whether to import.
export function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = () => resolve(input.files?.[0] ?? null)
    input.oncancel = () => resolve(null)
    input.click()
  })
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image failed to load'))
    image.src = src
  })
}
