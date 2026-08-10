import type { Meta, StoryObj } from '@nuxtjs/storybook'
import DevPreviewBar from './DevPreviewBar.vue'

const meta = {
  title: 'Dev/DevPreviewBar',
  component: DevPreviewBar,
  tags: ['autodocs']
} satisfies Meta<typeof DevPreviewBar>

export default meta
type Story = StoryObj<typeof meta>

// One story, no per-state variants: the bar reads the app-wide preview state
// from usePreviewState rather than taking a prop, so there is nothing to set
// through args. Click a pill in the story to see the selected look.
export const Default: Story = {}
