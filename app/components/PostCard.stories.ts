import type { Meta, StoryObj } from '@nuxtjs/storybook'
import PostCard from './PostCard.vue'
import { feedPosts } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/PostCard',
  component: PostCard,
  tags: ['autodocs'],
  render: args => ({
    components: { PostCard },
    setup() {
      return { args }
    },
    template: '<PostCard v-bind="args">{{ args.body }}</PostCard>'
  })
} satisfies Meta<typeof PostCard & { body: string }>

export default meta
type Story = StoryObj<typeof meta>

export const Announcement: Story = {
  args: feedPosts[0]
}

export const GameUpdateWithImage: Story = {
  args: feedPosts[1]
}

export const FromInstructor: Story = {
  args: feedPosts[2]
}

export const MinimalPost: Story = {
  args: {
    author: 'creator',
    time: 'just now',
    likes: 0,
    comments: [],
    body: 'A minimal post with no image and no comments yet.'
  }
}
