import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AppTopbar from './AppTopbar.vue'
import { userAvatar } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/AppTopbar',
  component: AppTopbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [() => ({ template: '<UDashboardGroup><UDashboardPanel><template #header><story /></template></UDashboardPanel></UDashboardGroup>' })]
} satisfies Meta<typeof AppTopbar>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveLearner: Story = {
  args: {
    xpLabel: '2,450 XP',
    streakDays: 6,
    userName: 'Nova',
    userAvatar,
    notificationCount: 13
  }
}

export const Guest: Story = {
  args: {
    guest: true
  }
}

export const NoStreak: Story = {
  args: {
    xpLabel: '150 XP',
    streakDays: 0,
    userName: 'Nova',
    userAvatar
  }
}
