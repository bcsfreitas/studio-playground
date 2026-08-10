import type { Meta, StoryObj } from '@nuxtjs/storybook'
import ColorPicker from './ColorPicker.vue'
import { withEditor } from './storyEditor'

const INSPECTOR_WIDTH = 'w-[340px]'

const meta = {
  title: 'Components/PixelStitch/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  decorators: [withEditor({ width: INSPECTOR_WIDTH })]
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Below full opacity the preview swatch shows the checkerboard through the
// brush colour — the palette itself still stores opaque hex.
export const TranslucentBrush: Story = {
  decorators: [withEditor({
    width: INSPECTOR_WIDTH,
    seed: (editor) => {
      editor.brushOpacity.value = 0.35
      editor.currentColor.value = '#1E00FF'
    }
  })]
}

// Picking a palette colour rings that swatch, so the artist can see where in
// the ramp they are.
export const PaletteColourSelected: Story = {
  decorators: [withEditor({
    width: INSPECTOR_WIDTH,
    seed: editor => (editor.currentColor.value = '#ffa200')
  })]
}
