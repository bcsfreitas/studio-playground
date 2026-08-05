import type { Meta, StoryObj } from '@nuxtjs/storybook'
import ProgramEnrollmentCard from './ProgramEnrollmentCard.vue'
import { programTemplates, programInstances } from '../composables/useProgramMockData'

function templateFor(programId: string) {
  return programTemplates.find(p => p.id === programId)!
}

function instancesFor(programId: string) {
  return programInstances.filter(i => i.programId === programId)
}

const meta = {
  title: 'Components/ProgramEnrollmentCard',
  component: ProgramEnrollmentCard,
  tags: ['autodocs'],
  // The card lives in a 324px right rail on the program page — at full canvas
  // width the picker and detail list read nothing like they do in place.
  decorators: [() => ({ template: '<div class="w-[324px]"><story /></div>' })]
} satisfies Meta<typeof ProgramEnrollmentCard>

export default meta
type Story = StoryObj<typeof meta>

export const ManyInstances: Story = {
  args: {
    template: templateFor('explore-godot'),
    instances: instancesFor('explore-godot'),
    enrollment: undefined
  }
}

export const SingleInstance: Story = {
  args: {
    template: templateFor('core-threadbare'),
    instances: instancesFor('core-threadbare'),
    enrollment: undefined
  }
}

export const NoInstances: Story = {
  args: {
    template: templateFor('educator-training'),
    instances: [],
    enrollment: undefined
  }
}

export const WorkshopSeries: Story = {
  args: {
    template: templateFor('explore-threadbare'),
    instances: instancesFor('explore-threadbare'),
    enrollment: undefined
  }
}
