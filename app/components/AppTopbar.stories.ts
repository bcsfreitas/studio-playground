import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AppTopbar from './AppTopbar.vue'

const meta = {
  title: 'Components/AppTopbar',
  component: AppTopbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AppTopbar>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveLearner: Story = {
  args: {
    xpLabel: '2,450 XP',
    streakDays: 6,
    userName: 'Nova'
  }
}

export const NoStreak: Story = {
  args: {
    xpLabel: '150 XP',
    streakDays: 0,
    userName: 'Nova'
  }
}
