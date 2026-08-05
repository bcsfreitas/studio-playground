import type { Meta, StoryObj } from '@nuxtjs/storybook'
import DevPreviewBar from './DevPreviewBar.vue'

const meta = {
  title: 'Dev/DevPreviewBar',
  component: DevPreviewBar,
  tags: ['autodocs']
} satisfies Meta<typeof DevPreviewBar>

export default meta
type Story = StoryObj<typeof meta>

export const Interested: Story = {
  args: { modelValue: 'interested' }
}

export const Enrolled: Story = {
  args: { modelValue: 'enrolled' }
}

export const Onboarded: Story = {
  args: { modelValue: 'onboarded' }
}
