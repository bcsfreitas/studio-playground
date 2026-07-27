import type { Meta, StoryObj } from '@nuxtjs/storybook'
import BountiesCard from './BountiesCard.vue'
import { bounties } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/BountiesCard',
  component: BountiesCard,
  tags: ['autodocs']
} satisfies Meta<typeof BountiesCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    bounties
  }
}

export const Empty: Story = {
  args: {
    bounties: []
  }
}
