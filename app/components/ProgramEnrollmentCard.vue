<script setup lang="ts">
import type { ProgramTemplate, ProgramInstance, EnrollmentRecord, Cohort, EnrollmentStatus } from '~/composables/useProgramMockData'
import { cohortStatusFor, cohortHasStarted } from '~/composables/useProgramMockData'
import { formatCohortRange } from '~/composables/useLearnMockData'

const props = defineProps<{
  template: ProgramTemplate
  // Every instance of the program, not just one. Explore: Godot runs three,
  // and its earliest has already ended — showing only that one told learners
  // enrollment was closed while the catalog advertised open seats. May be
  // empty: Educator Training has no instances at all.
  instances: ProgramInstance[]
  enrollment: EnrollmentRecord | undefined
}>()

const { t } = useI18n()

// Cohorts gated by an access code stay locked client-side until the right
// code is entered — there's no backend, so "unlocked" just means "the code
// this session was typed into this browser tab matched."
const unlockedCohortIds = ref<string[]>([])
const enteredCode = ref('')
const codeError = ref(false)

function isUnlocked(cohortId: string) {
  return unlockedCohortIds.value.includes(cohortId)
}

// Confirming enrollment in the modal below flips the cohort to
// "already-enrolled" for the rest of the browser session — there's no
// backend to persist it to, same as unlockedCohortIds above.
const justEnrolledCohortId = ref<string | null>(null)

function statusOf(cohort: Cohort): EnrollmentStatus {
  if (justEnrolledCohortId.value === cohort.id) return 'already-enrolled'
  return cohortStatusFor(cohort, props.enrollment, isUnlocked(cohort.id))
}

function cohortLabel(cohort: Cohort) {
  return cohort.startDate
    ? formatCohortRange(cohort.startDate, cohort.endDate!)
    : t('program.enrollment.cohortDescription.selfPaced')
}

function cohortDescription(cohort: Cohort) {
  const status = statusOf(cohort)
  const range = cohort.startDate ? formatCohortRange(cohort.startDate, cohort.endDate!) : ''
  if (status === 'already-enrolled') {
    return t('program.enrollment.cohortDescription.alreadyEnrolled', { progress: props.enrollment?.progress ?? 0 })
  }
  if (status === 'self-paced-always-open') return t('program.enrollment.cohortDescription.selfPaced')
  if (status === 'requires-access-code') return t('program.enrollment.cohortDescription.requiresCode')
  if (status === 'closed') return t('program.enrollment.cohortDescription.closed', { range })
  return t('program.enrollment.cohortDescription.open', { taken: cohort.seatsTaken, max: cohort.maxLearners, range })
}

// A full cohort isn't offered as an option at all — there's no waitlist flow,
// so surfacing it just to show a disabled "full" state serves no purpose.
const availableCohorts = computed(() =>
  props.instances.flatMap(i => i.cohorts).filter(c => statusOf(c) !== 'full')
)

const cohortItems = computed(() => availableCohorts.value.map(cohort => ({
  value: cohort.id,
  label: cohortLabel(cohort),
  description: cohortDescription(cohort),
  disabled: statusOf(cohort) === 'closed'
})))

const defaultCohortId = computed(() => {
  const firstOpen = availableCohorts.value.find(c => statusOf(c) === 'open-with-seats')
  return (firstOpen ?? availableCohorts.value[0])?.id
})

const selectedCohortId = ref(defaultCohortId.value)

const selectedCohort = computed(() =>
  availableCohorts.value.find(c => c.id === selectedCohortId.value) ?? availableCohorts.value[0]
)

const selectedStatus = computed(() => selectedCohort.value ? statusOf(selectedCohort.value) : undefined)

function submitCode() {
  if (!selectedCohort.value) return
  if (enteredCode.value.trim() === selectedCohort.value.accessCode) {
    unlockedCohortIds.value.push(selectedCohort.value.id)
    enteredCode.value = ''
    codeError.value = false
  } else {
    codeError.value = true
  }
}

const enrollModalOpen = ref(false)
const enrollModalStep = ref<'confirm' | 'success'>('confirm')

function openEnrollModal() {
  enrollModalStep.value = 'confirm'
  enrollModalOpen.value = true
}

function confirmEnrollment() {
  if (!selectedCohort.value) return
  justEnrolledCohortId.value = selectedCohort.value.id
  enrollModalStep.value = 'success'
}

// Session-start-date line in the success view — a specific date ("Starts
// Tuesday, Aug 4"), not the full range already shown in the picker.
const enrollModalStartDateLabel = computed(() => {
  const startDate = selectedCohort.value?.startDate
  if (!startDate) return ''
  return new Date(startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })
})
</script>

<template>
  <UPageCard variant="soft">
      <div class="font-heading font-bold text-highlighted line-clamp-2">{{ template.title }}</div>

    <URadioGroup
      v-if="availableCohorts.length > 1"
      v-model="selectedCohortId"
      variant="card"
      :legend="t('program.enrollment.sessionPickerLabel')"
      :items="cohortItems"
      class="mt-4"
    />

    <USeparator class="mt-4" />

    <div v-if="selectedCohort" class="mt-4">
      <template v-if="selectedStatus === 'already-enrolled'">
        <div class="flex items-center gap-3 mb-3">
          <UProgress :model-value="enrollment?.progress ?? 0" color="primary" />
          <span class="text-xs text-default">{{ enrollment?.progress ?? 0 }}%</span>
        </div>
        <UButton
          v-if="selectedCohort && cohortHasStarted(selectedCohort)"
          :label="t('program.enrollment.cta.resume')"
          icon="lucide:play"
          color="primary"
          block
          :to="`/learn/${template.id}/classroom`"
        />
        <template v-else>
          <p class="text-xs text-muted mb-2">
            {{ t('program.enrollment.cta.startsOn', { date: enrollModalStartDateLabel }) }}
          </p>
          <UButton :label="t('program.enrollment.cta.resume')" icon="lucide:play" color="primary" block disabled />
        </template>
      </template>

      <template v-else-if="selectedStatus === 'self-paced-always-open'">
        <UBadge :label="t('program.enrollment.cohortDescription.selfPaced')" color="neutral" variant="soft" class="mb-3" />
        <UButton
          :label="t('program.enrollment.cta.startLearning')"
          icon="lucide:play"
          color="primary"
          block
          :to="`/learn/${template.id}/classroom`"
        />
      </template>

      <template v-else-if="selectedStatus === 'requires-access-code'">
        <p class="text-xs text-muted mb-2">{{ t('program.enrollment.accessCode.helper') }}</p>
        <UInput
          v-model="enteredCode"
          icon="lucide:key-round"
          :placeholder="t('program.enrollment.accessCode.placeholder')"
          class="w-full mb-2"
        />
        <p v-if="codeError" class="text-xs text-error mb-2">{{ t('program.enrollment.accessCode.error') }}</p>
        <UButton
          :label="t('program.enrollment.cta.unlockCohort')"
          color="primary"
          block
          :disabled="!enteredCode.trim()"
          @click="submitCode"
        />
      </template>

      <template v-else-if="selectedStatus === 'closed'">
        <UBadge :label="t('program.enrollment.cta.enrollmentClosed')" color="neutral" variant="soft" class="mb-3" />
        <UButton :label="t('program.enrollment.cta.enrollmentClosed')" color="neutral" variant="soft" block disabled />
      </template>

      <template v-else>
        <p v-if="selectedCohort.maxLearners !== null" class="text-xs text-muted mb-3">
          {{ t('program.enrollment.seats.filled', { taken: selectedCohort.seatsTaken, max: selectedCohort.maxLearners }) }}
        </p>
        <UButton
          :label="t('program.enrollment.cta.enroll')"
          icon="lucide:circle-check"
          color="primary"
          block
          @click="openEnrollModal"
        />
      </template>
    </div>

    <UModal v-model:open="enrollModalOpen">
      <template #title>
        <span class="sr-only">{{ enrollModalStep === 'confirm'
          ? t('program.enrollment.confirmModal.title')
          : t('program.enrollment.successModal.title') }}</span>
      </template>
      <template #body>
        <div v-if="enrollModalStep === 'confirm' && selectedCohort" class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
            <UIcon name="lucide:calendar-check" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('program.enrollment.confirmModal.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('program.enrollment.confirmModal.body', { program: template.title, range: cohortLabel(selectedCohort) }) }}
          </p>
        </div>

        <div v-else class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-success/10 text-success">
            <UIcon name="lucide:check" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('program.enrollment.successModal.title') }}
          </div>
          <div class="w-full rounded-xl border border-default p-4 text-left">
            <div class="font-heading font-semibold text-default">{{ template.title }}</div>
            <div class="text-sm text-muted">{{ t('program.enrollment.successModal.starts', { date: enrollModalStartDateLabel }) }}</div>
          </div>
          <p class="text-sm text-muted">
            {{ t('program.enrollment.successModal.emailNotice') }}
          </p>
        </div>
      </template>

      <template #footer>
        <template v-if="enrollModalStep === 'confirm'">
          <UButton :label="t('program.enrollment.confirmModal.cancel')" color="neutral" variant="outline" @click="enrollModalOpen = false" />
          <UButton :label="t('program.enrollment.confirmModal.confirm')" color="primary" @click="confirmEnrollment" />
        </template>
        <UButton
          v-else
          :label="t('program.enrollment.successModal.done')"
          color="primary"
          block
          @click="enrollModalOpen = false"
        />
      </template>
    </UModal>
  </UPageCard>
</template>
