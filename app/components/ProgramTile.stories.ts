import type { Meta, StoryObj } from '@nuxtjs/storybook'
import ProgramTile from './ProgramTile.vue'
import { programRecs } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/ProgramTile',
  component: ProgramTile,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['Beginner', 'Intermediate', 'Advanced']
    }
  }
} satisfies Meta<typeof ProgramTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: programRecs[0]
}

export const Intermediate: Story = {
  args: programRecs[2]
}

export const NoStatusOrCount: Story = {
  args: {
    name: 'Ship Your First Game',
    description: 'Take a project from idea to a shared, playable build.',
    image: '/images/img/games/game-built.png'
  }
}
