import type { Meta, StoryObj } from '@nuxtjs/storybook'
import ProgramStepCard from './ProgramStepCard.vue'
import { programTemplates } from '../composables/useProgramMockData'
import { flattenCurriculum } from '../composables/useProgramCurriculum'

// Real curriculum entries rather than invented ones, so the type icons and XP
// values match what the classroom actually renders.
const steps = flattenCurriculum(programTemplates.find(p => p.id === 'core-threadbare')!)
const survey = steps.find(step => step.type === 'survey')!
const topic = steps.find(step => step.type === 'topic')!
const deliverable = steps.find(step => step.type === 'deliverable')!

const meta = {
  title: 'Components/ProgramStepCard',
  component: ProgramStepCard,
  tags: ['autodocs'],
  args: {
    completed: false,
    locked: false,
    current: false
  },
  // The classroom lists these in a single column inside the program page's
  // main content area — full canvas width stretches the row past any real layout.
  decorators: [() => ({ template: '<div class="max-w-[720px]"><story /></div>' })]
} satisfies Meta<typeof ProgramStepCard>

export default meta
type Story = StoryObj<typeof meta>

// The step the learner should be on: primary ring plus a play icon.
export const Current: Story = {
  args: {
    item: survey,
    current: true
  }
}

export const NotStarted: Story = {
  args: {
    item: topic
  }
}

export const Completed: Story = {
  args: {
    item: topic,
    completed: true
  }
}

// A locked module renders its steps as disabled buttons — no chevron, since
// there is nothing to open.
export const Locked: Story = {
  args: {
    item: topic,
    locked: true
  }
}

// Deliverables carry the upload icon and the largest XP award in the program.
export const Deliverable: Story = {
  args: {
    item: deliverable
  }
}
