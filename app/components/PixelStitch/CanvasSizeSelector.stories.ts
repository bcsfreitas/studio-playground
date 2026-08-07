import type { Meta, StoryObj } from '@nuxtjs/storybook'
import CanvasSizeSelector from './CanvasSizeSelector.vue'
import { withEditor } from './storyEditor'

const meta = {
  title: 'Components/PixelStitch/CanvasSizeSelector',
  component: CanvasSizeSelector,
  tags: ['autodocs'],
  decorators: [withEditor({ width: 'w-[520px]' })]
} satisfies Meta<typeof CanvasSizeSelector>

export default meta
type Story = StoryObj<typeof meta>

// 32×32 is where a new project starts.
export const Default: Story = {}

export const SmallestCanvas: Story = {
  decorators: [withEditor({ width: 'w-[520px]', seed: editor => editor.setCanvasSize(16) })]
}

export const LargestCanvas: Story = {
  decorators: [withEditor({ width: 'w-[520px]', seed: editor => editor.setCanvasSize(128) })]
}
