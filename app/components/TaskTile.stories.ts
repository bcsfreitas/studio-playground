import type { Meta, StoryObj } from '@nuxtjs/storybook'
import TaskTile from './TaskTile.vue'
import { openTasks } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/TaskTile',
  component: TaskTile,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['In Review', 'In Progress', 'Need help', 'Feedback', 'Done', 'New']
    }
  }
} satisfies Meta<typeof TaskTile>

export default meta
type Story = StoryObj<typeof meta>

export const New: Story = {
  args: openTasks[0]
}

export const InProgressDueSoon: Story = {
  args: openTasks[1]
}

export const Feedback: Story = {
  args: openTasks[2]
}

export const Done: Story = {
  args: {
    name: 'Publish devlog #4',
    status: 'Done',
    project: 'Intro to Game Design',
    due: 'Last week'
  }
}

export const NeedHelp: Story = {
  args: {
    name: 'Debug save/load crash',
    status: 'Need help',
    project: 'threadbare · GitHub',
    due: 'Today',
    dueSoon: true
  }
}
