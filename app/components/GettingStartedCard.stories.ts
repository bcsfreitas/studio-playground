import type { Meta, StoryObj } from '@nuxtjs/storybook'
import GettingStartedCard from './GettingStartedCard.vue'
import { gettingStartedItemsFor } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/GettingStartedCard',
  component: GettingStartedCard,
  tags: ['autodocs']
} satisfies Meta<typeof GettingStartedCard>

export default meta
type Story = StoryObj<typeof meta>

// A new learner has joined a program; a fresh account hasn't, which is the
// checklist's own two states.
export const InProgress: Story = {
  args: {
    items: gettingStartedItemsFor('new')
  }
}

export const FreshAccount: Story = {
  args: {
    items: gettingStartedItemsFor('fresh')
  }
}

export const AllDone: Story = {
  args: {
    items: gettingStartedItemsFor('new').map(i => ({ ...i, done: true }))
  }
}
