import type { Meta, StoryObj } from '@nuxtjs/storybook'
import StreakCard from './StreakCard.vue'
import { weekCellsFor } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/StreakCard',
  component: StreakCard,
  tags: ['autodocs']
} satisfies Meta<typeof StreakCard>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveLearner: Story = {
  args: {
    title: '5-day streak',
    meta: '2 skips left',
    days: weekCellsFor(true)
  }
}

export const NewLearner: Story = {
  args: {
    title: 'Start your streak',
    meta: '2 skips left',
    days: weekCellsFor(false)
  }
}
