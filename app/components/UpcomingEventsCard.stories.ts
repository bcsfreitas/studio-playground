import type { Meta, StoryObj } from '@nuxtjs/storybook'
import UpcomingEventsCard from './UpcomingEventsCard.vue'
import { upcomingEvents } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/UpcomingEventsCard',
  component: UpcomingEventsCard,
  tags: ['autodocs']
} satisfies Meta<typeof UpcomingEventsCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    events: upcomingEvents
  }
}

export const Empty: Story = {
  args: {
    events: []
  }
}
