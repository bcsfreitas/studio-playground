import type { Meta, StoryObj } from '@nuxtjs/storybook'
import Toolbar from './Toolbar.vue'
import { withEditor } from './storyEditor'

const meta = {
  title: 'Components/PixelStitch/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  decorators: [withEditor()]
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

// Pencil is the default tool, so the brush-size stepper is showing.
export const Default: Story = {}

// The stepper belongs to the pencil and the eraser — every other tool acts on a
// single click, so it disappears and the row gets shorter.
export const FillToolSelected: Story = {
  decorators: [withEditor({ seed: editor => (editor.currentTool.value = 'fill') })]
}

// Undo and redo both disable until there's history to walk, which is the state
// a freshly opened project is in.
export const NothingToUndo: Story = {
  decorators: [withEditor({ seed: editor => (editor.gridVisible.value = false) })]
}
