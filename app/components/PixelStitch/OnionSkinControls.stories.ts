import type { Meta, StoryObj } from '@nuxtjs/storybook'
import OnionSkinControls from './OnionSkinControls.vue'
import { withEditor } from './storyEditor'

const INSPECTOR_WIDTH = 'w-[340px]'

const meta = {
  title: 'Components/PixelStitch/OnionSkinControls',
  component: OnionSkinControls,
  tags: ['autodocs'],
  decorators: [withEditor({ width: INSPECTOR_WIDTH })]
} satisfies Meta<typeof OnionSkinControls>

export default meta
type Story = StoryObj<typeof meta>

// Collapsed to a single switch until it's turned on — three sliders for a
// feature most sessions never touch would be noise in the rail.
export const Off: Story = {}

// Enabled reveals the range controls and the legend, which is the only thing
// telling the artist which tint means which direction.
export const Enabled: Story = {
  decorators: [withEditor({
    width: INSPECTOR_WIDTH,
    seed: editor => (editor.onionSkin.value = { enabled: true, previousFrames: 2, nextFrames: 1, opacity: 0.4 })
  })]
}

// Looking only backwards, at the strongest ghost setting.
export const PreviousOnly: Story = {
  decorators: [withEditor({
    width: INSPECTOR_WIDTH,
    seed: editor => (editor.onionSkin.value = { enabled: true, previousFrames: 5, nextFrames: 0, opacity: 0.8 })
  })]
}
