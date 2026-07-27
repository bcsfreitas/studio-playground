import type { Meta, StoryObj } from '@nuxtjs/storybook'
import SectionTitle from './SectionTitle.vue'

const meta = {
  title: 'Components/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  render: args => ({
    components: { SectionTitle },
    setup() {
      return { args }
    },
    template: `
      <SectionTitle v-bind="args">
        <template v-if="args.trailingLabel" #trailing>
          <UButton color="secondary" variant="ghost" size="xs">{{ args.trailingLabel }}</UButton>
        </template>
      </SectionTitle>
    `
  })
} satisfies Meta<typeof SectionTitle & { trailingLabel: string }>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Continue learning'
  }
}

export const WithSubtitle: Story = {
  args: {
    title: 'Start learning',
    subtitle: 'Pick a program to begin your journey — every task you finish earns XP.'
  }
}

export const WithTrailingButton: Story = {
  args: {
    title: 'Your open tasks',
    trailingLabel: 'All open tasks'
  }
}

export const WithSubtitleAndTrailingButton: Story = {
  args: {
    title: 'Start learning',
    subtitle: 'Pick a program to begin your journey — every task you finish earns XP.',
    trailingLabel: 'Browse all programs'
  }
}
