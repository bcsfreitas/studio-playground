import type { Meta, StoryObj } from '@nuxtjs/storybook'
import PathChoiceCards from './PathChoiceCards.vue'
import { pathChoices } from '../composables/useHomeMockData'

const meta = {
  title: 'Components/PathChoiceCards',
  component: PathChoiceCards,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  // Generous padding rather than none: the hover state grows the card past its
  // own box and spills a coloured glow outside it, both of which a flush canvas
  // would clip.
  decorators: [() => ({ template: '<div class="p-12 bg-default"><story /></div>' })]
} satisfies Meta<typeof PathChoiceCards>

export default meta
type Story = StoryObj<typeof meta>

// The signed-out home row. Each card links to sign-up carrying its own `?path=`,
// which the sign-up screen reads to change its subheading.
export const Default: Story = {
  args: {
    choices: pathChoices
  }
}

// A choice without `to` renders as a plain block instead of a link — the
// component's way of not claiming to navigate when there's nowhere to go.
export const WithoutDestinations: Story = {
  args: {
    choices: pathChoices.map(choice => ({ ...choice, to: undefined }))
  }
}
