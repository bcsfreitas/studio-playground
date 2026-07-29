import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AppSidebar from './AppSidebar.vue'

const meta = {
  title: 'Components/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [() => ({ template: '<UDashboardGroup><story /></UDashboardGroup>' })]
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoAdmin: Story = {
  args: {
    showAdmin: false
  }
}
