<script setup lang="ts">
import type { ProgramTemplate, ProgramInstance, EnrollmentRecord, Cohort, EnrollmentStatus } from '~/composables/useProgramMockData'
import { cohortStatusFor } from '~/composables/useProgramMockData'
import { formatCohortRange } from '~/composables/useLearnMockData'

const props = defineProps<{
  template: ProgramTemplate
  instance: ProgramInstance
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

function statusOf(cohort: Cohort): EnrollmentStatus {
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
  if (status === 'full') return t('program.enrollment.cohortDescription.full', { range })
  return t('program.enrollment.cohortDescription.open', { taken: cohort.seatsTaken, max: cohort.maxLearners, range })
}

const cohortItems = computed(() => props.instance.cohorts.map(cohort => ({
  value: cohort.id,
  label: cohortLabel(cohort),
  description: cohortDescription(cohort),
  disabled: statusOf(cohort) === 'closed'
})))

const defaultCohortId = computed(() => {
  const firstOpen = props.instance.cohorts.find(c => statusOf(c) === 'open-with-seats')
  return (firstOpen ?? props.instance.cohorts[0])?.id
})

const selectedCohortId = ref(defaultCohortId.value)

const selectedCohort = computed(() =>
  props.instance.cohorts.find(c => c.id === selectedCohortId.value) ?? props.instance.cohorts[0]
)

const selectedStatus = computed(() => statusOf(selectedCohort.value))

function submitCode() {
  if (enteredCode.value.trim() === selectedCohort.value.accessCode) {
    unlockedCohortIds.value.push(selectedCohort.value.id)
    enteredCode.value = ''
    codeError.value = false
  } else {
    codeError.value = true
  }
}
</script>

<template>
  <UPageCard variant="soft">
    <div class="flex items-center gap-3">
      <img :src="template.image" alt="" class="size-14 rounded-xl object-cover bg-slate-100 shrink-0">
      <div class="font-heading font-bold text-highlighted line-clamp-2">{{ template.title }}</div>
    </div>

    <URadioGroup
      v-if="instance.cohorts.length > 1"
      v-model="selectedCohortId"
      variant="card"
      :legend="t('program.enrollment.sessionPickerLabel')"
      :items="cohortItems"
      class="mt-4"
    />

    <div class="mt-4 border-t border-default pt-4">
      <template v-if="selectedStatus === 'already-enrolled'">
        <div class="flex items-center gap-3 mb-3">
          <UProgress :model-value="enrollment?.progress" color="primary" />
          <span class="text-xs text-default">{{ enrollment?.progress }}%</span>
        </div>
        <UButton :label="t('program.enrollment.cta.resume')" icon="lucide:play" color="primary" block />
      </template>

      <template v-else-if="selectedStatus === 'self-paced-always-open'">
        <UBadge :label="t('program.enrollment.cohortDescription.selfPaced')" color="neutral" variant="soft" class="mb-3" />
        <UButton :label="t('program.enrollment.cta.startLearning')" icon="lucide:play" color="primary" block />
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

      <template v-else-if="selectedStatus === 'full'">
        <UBadge :label="t('program.enrollment.seats.full')" color="warning" variant="soft" class="mb-3" />
        <div class="flex flex-col gap-2">
          <UButton :label="t('program.enrollment.cta.cohortFull')" color="primary" block disabled />
          <UButton :label="t('program.enrollment.cta.joinWaitlist')" color="neutral" variant="outline" block />
        </div>
      </template>

      <template v-else>
        <p v-if="selectedCohort.maxLearners !== null" class="text-xs text-muted mb-3">
          {{ t('program.enrollment.seats.filled', { taken: selectedCohort.seatsTaken, max: selectedCohort.maxLearners }) }}
        </p>
        <UButton :label="t('program.enrollment.cta.enroll')" icon="lucide:circle-check" color="primary" block />
      </template>
    </div>
  </UPageCard>
</template>
