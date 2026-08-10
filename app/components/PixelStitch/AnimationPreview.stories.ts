import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AnimationPreview from './AnimationPreview.vue'
import { addFrames, paintSample, withEditor } from './storyEditor'

const INSPECTOR_WIDTH = 'w-[340px]'

const meta = {
  title: 'Components/PixelStitch/AnimationPreview',
  component: AnimationPreview,
  tags: ['autodocs'],
  decorators: [withEditor({ width: INSPECTOR_WIDTH, seed: editor => paintSample(editor) })]
} satisfies Meta<typeof AnimationPreview>

export default meta
type Story = StoryObj<typeof meta>

export const SingleFrame: Story = {}

// Playback drives the shared frame cursor, so this preview, the frame strip and
// the main canvas all advance together — it isn't a separate player.
export const Playing: Story = {
  decorators: [withEditor({
    width: INSPECTOR_WIDTH,
    seed: (editor) => {
      paintSample(editor)
      addFrames(editor, 5)
      editor.isPlaying.value = true
    }
  })]
}

export const SlowPlayback: Story = {
  decorators: [withEditor({
    width: INSPECTOR_WIDTH,
    seed: (editor) => {
      paintSample(editor)
      addFrames(editor, 5)
      editor.fps.value = 2
      editor.isPlaying.value = true
    }
  })]
}
