import type { Meta, StoryObj } from '@nuxtjs/storybook'
import FrameStrip from './FrameStrip.vue'
import { addFrames, paintSample, withEditor } from './storyEditor'

const meta = {
  title: 'Components/PixelStitch/FrameStrip',
  component: FrameStrip,
  tags: ['autodocs'],
  decorators: [withEditor({ seed: editor => paintSample(editor) })]
} satisfies Meta<typeof FrameStrip>

export default meta
type Story = StoryObj<typeof meta>

// A new project holds one frame; delete is disabled until there's a second.
export const SingleFrame: Story = {}

// Thumbnails are drawn to their own canvases and redraw as the artwork changes.
// Each is draggable — dropping one on another reorders the animation.
export const Animation: Story = {
  decorators: [withEditor({
    seed: (editor) => {
      paintSample(editor)
      addFrames(editor, 5)
    }
  })]
}

// The strip scrolls horizontally rather than wrapping, so a long animation
// keeps its timeline reading left to right.
export const ManyFrames: Story = {
  decorators: [withEditor({
    seed: (editor) => {
      paintSample(editor)
      addFrames(editor, 14)
    }
  })]
}

export const Playing: Story = {
  decorators: [withEditor({
    seed: (editor) => {
      paintSample(editor)
      addFrames(editor, 3)
      editor.isPlaying.value = true
    }
  })]
}
