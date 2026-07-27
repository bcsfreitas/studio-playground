import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AppSidebar from './AppSidebar.vue'

const meta = {
  title: 'Components/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
    isGuest: false,
    userName: 'Nova'
  }
}

export const LoggedInNoAdmin: Story = {
  args: {
    isLoggedIn: true,
    isGuest: false,
    userName: 'Nova',
    showAdmin: false
  }
}

export const Guest: Story = {
  args: {
    isLoggedIn: false,
    isGuest: true,
    userName: 'Nova'
  }
}
