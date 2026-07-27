import type { Meta, StoryObj } from '@nuxtjs/storybook'
import GettingStartedCard from './GettingStartedCard.vue'
import { gettingStartedItems } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/GettingStartedCard',
  component: GettingStartedCard,
  tags: ['autodocs']
} satisfies Meta<typeof GettingStartedCard>

export default meta
type Story = StoryObj<typeof meta>

export const InProgress: Story = {
  args: {
    items: gettingStartedItems
  }
}

export const AllDone: Story = {
  args: {
    items: gettingStartedItems.map(i => ({ ...i, done: true }))
  }
}

export const NoneDone: Story = {
  args: {
    items: gettingStartedItems.map(i => ({ ...i, done: false }))
  }
}
