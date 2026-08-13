<script setup lang="ts">
import type { MentorClassroom } from '~/composables/useProgramMockData'
import { userName } from '~/composables/useHomeMockData'

defineProps<{
  classroom: MentorClassroom
}>()

const { t } = useI18n()

const inviteModalOpen = ref(false)

interface ChecklistStep {
  key: string
  done: boolean
  title: string
  description?: string
  button?: { label: string, to?: string, onClick?: () => void }
}

// Step 1 is always done — the classroom exists, that's a derived fact, not
// stored state. Steps 2/3 always render as not-done in this prototype: there
// is no way to check them off (see useMentorClassrooms.ts's addLearners — the
// only real signal, a CSV import, replaces this whole checklist with the
// normal tabs rather than ticking step 3, since the classroom stops being
// student-less at that point). Step 2's real completion depends on training-
// completion tracking that doesn't exist yet.
const steps = computed<ChecklistStep[]>(() => [
  {
    key: 'create',
    done: true,
    title: t('teach.hub.welcome.steps.create.title')
  },
  {
    key: 'training',
    done: false,
    title: t('teach.hub.welcome.steps.training.title'),
    description: t('teach.hub.welcome.steps.training.description'),
    button: { label: t('teach.hub.welcome.steps.training.cta'), to: '/learn/educator-training' }
  },
  {
    key: 'invite',
    done: false,
    title: t('teach.hub.welcome.steps.invite.title'),
    description: t('teach.hub.welcome.steps.invite.description'),
    button: { label: t('teach.hub.welcome.steps.invite.cta'), onClick: () => { inviteModalOpen.value = true } }
  }
])
</script>

<template>
  <div class=" flex flex-col gap-8">
    <h3 class="font-heading text-2xl font-bold tracking-tight sm:text-3xl text-highlighted mt-4">
      {{ t('teach.hub.welcome.title', { name: userName }) }}
    </h3>
    

    <div class="flex flex-col">
      <div v-for="(step, index) in steps" :key="step.key" class="flex gap-5">
        <!-- Connector column: flex's default align-items:stretch makes this
             column match the content column's height, so the line fills the
             gap down to the next circle with no absolute positioning. -->
        <div class="flex flex-col items-center">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-full"
            :class="step.done ? 'bg-success text-white' : 'bg-secondary/10 text-cornflower-700'"
          >
            <UIcon v-if="step.done" name="lucide:check" class="size-5" />
            <span v-else class="font-heading text-xl font-bold">{{ index + 1 }}</span>
          </div>
          <div v-if="index < steps.length - 1" class="my-2 w-0.5 flex-1 bg-accented/75" />
        </div>

        <div class="flex-1" :class="index < steps.length - 1 ? 'pb-8 pt-1' : ''">
          <h4 class="font-heading text-xl font-bold text-cornflower-900">{{ step.title }}</h4>
          <p v-if="step.description" class="mt-1 max-w-md text-sm text-muted">{{ step.description }}</p>
          <UButton
            v-if="step.button"
            :label="step.button.label"
            :to="step.button.to"
            size="lg"
            color="secondary"
            class="mt-4"
            @click="step.button.onClick?.()"
          />
        </div>
      </div>
    </div>

    <TeachClassroomInviteModal v-model:open="inviteModalOpen" :classroom="classroom" />
  </div>
</template>
