import type { Meta, StoryObj } from '@nuxtjs/storybook'
import SocialButtons from './SocialButtons.vue'

const meta = {
  title: 'Components/Auth/SocialButtons',
  component: SocialButtons,
  tags: ['autodocs'],
  // The auth screens run a 400px form column, and these are block buttons —
  // at full canvas width the labels float in the middle of nothing.
  decorators: [() => ({ template: '<div class="w-[400px]"><story /></div>' })]
} satisfies Meta<typeof SocialButtons>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// What the row looks like while a sign-in is in flight — the pages disable it
// alongside the email form so a second provider can't be started mid-request.
export const Disabled: Story = {
  args: {
    disabled: true
  }
}
