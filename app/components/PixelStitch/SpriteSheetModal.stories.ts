import type { Meta, StoryObj } from '@nuxtjs/storybook'
import SpriteSheetModal from './SpriteSheetModal.vue'

const meta = {
  title: 'Components/PixelStitch/SpriteSheetModal',
  component: SpriteSheetModal,
  tags: ['autodocs'],
  parameters: {
    // The modal portals to <body> and dims the page behind it.
    layout: 'fullscreen'
  },
  render: args => ({
    components: { SpriteSheetModal },
    setup: () => ({ args }),
    // `:open="true"` rather than v-model: a story is a fixed state, and letting
    // it close would leave an empty canvas with nothing to reopen it.
    template: '<div class="h-dvh bg-elevated"><SpriteSheetModal v-bind="args" :open="true" /></div>'
  })
} satisfies Meta<typeof SpriteSheetModal>

export default meta
type Story = StoryObj<typeof meta>

// Export names a column count and reports the grid the current frames fall into.
export const Export: Story = {
  args: {
    open: true,
    mode: 'export',
    frameCount: 9
  }
}

export const ExportSingleRow: Story = {
  args: {
    open: true,
    mode: 'export',
    frameCount: 4
  }
}

// Import adds a file picker and a row count, and keeps the confirm button
// disabled until a file is chosen — the columns alone can't slice anything.
export const Import: Story = {
  args: {
    open: true,
    mode: 'import',
    frameCount: 1
  }
}
