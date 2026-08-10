import type { Meta, StoryObj } from '@nuxtjs/storybook'
import ToolCard from './ToolCard.vue'
import { webTools, tailorApps } from '../composables/useMakeMockData'

function tool(id: string) {
  return [...webTools, ...tailorApps].find(entry => entry.id === id)!
}

const meta = {
  title: 'Components/ToolCard',
  component: ToolCard,
  tags: ['autodocs'],
  // The Make page runs these in a 3-up grid; a full-width card stretches the
  // thumbnail into a band and the blurb onto one line.
  decorators: [() => ({ template: '<div class="w-[340px]"><story /></div>' })]
} satisfies Meta<typeof ToolCard>

export default meta
type Story = StoryObj<typeof meta>

// A tool rebuilt natively on this stack. `route` outranks `embedUrl` and `url`,
// so the footer becomes an in-app link with a forward arrow.
export const NativeRoute: Story = {
  args: {
    tool: tool('pixel-stitch')
  }
}

// Framed in-platform: the footer stays a real button and the card emits
// `launch` for the page's shared drawer to pick up.
export const Embeddable: Story = {
  args: {
    tool: tool('patchworkshop')
  }
}

// No embed, so the card keeps its outward link and the icon marks that the
// learner is leaving the platform.
export const ExternalLink: Story = {
  args: {
    tool: tool('godot-web')
  }
}

export const Download: Story = {
  args: {
    tool: tool('endstar')
  }
}

// Neither a route, an embed, nor a URL — the footer disables rather than
// pretending to go somewhere.
export const NoDestination: Story = {
  args: {
    tool: tool('baby-godot')
  }
}
