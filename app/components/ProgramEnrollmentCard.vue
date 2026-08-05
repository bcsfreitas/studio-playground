<script setup lang="ts">
import type { ProgramTemplate, ProgramInstance, EnrollmentRecord, Cohort, EnrollmentStatus } from '~/composables/useProgramMockData'
import { cohortStatusFor, cohortHasStarted, sampleLearnersForProgram } from '~/composables/useProgramMockData'
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
    : t('program.enroll.sessionDescription.selfPaced')
}

function cohortDescription(cohort: Cohort) {
  const status = statusOf(cohort)
  const range = cohort.startDate ? formatCohortRange(cohort.startDate, cohort.endDate!) : ''
  if (status === 'already-enrolled') {
    return t('program.enroll.sessionDescription.alreadyEnrolled', { progress: props.enrollment?.progress ?? 0 })
  }
  if (status === 'self-paced-always-open') return t('program.enroll.sessionDescription.selfPaced')
  if (status === 'requires-access-code') return t('program.enroll.sessionDescription.requiresCode')
  if (status === 'closed') return t('program.enroll.sessionDescription.closed', { range })
  return t('program.enroll.sessionDescription.open', { taken: cohort.seatsTaken, max: cohort.maxLearners, range })
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

// An enrolled learner's own session outranks any open one. The picker is a
// collapsed select, so a session the learner isn't looking at is a session
// they can't see — defaulting past their enrollment showed Explore: Godot's
// enrolled learner an "Enroll in this session" button and no sign anywhere
// that they were already in.
const defaultCohortId = computed(() => {
  const firstOpen = availableCohorts.value.find(c => statusOf(c) === 'already-enrolled')
    ?? availableCohorts.value.find(c => statusOf(c) === 'open-with-seats')
  return (firstOpen ?? availableCohorts.value[0])?.id
})

const selectedCohortId = ref(defaultCohortId.value)

// The card is not remounted when the DevPreviewBar changes phase — <NuxtPage>
// is keyed on programId, so only the `enrollment` prop changes. Without this
// the ref keeps the session that was default at setup, and an enrolled learner
// lands back on someone else's session with an "Enroll" button.
watch(defaultCohortId, (id) => {
  selectedCohortId.value = id
})

const selectedCohort = computed(() =>
  availableCohorts.value.find(c => c.id === selectedCohortId.value) ?? availableCohorts.value[0]
)

const selectedStatus = computed(() => selectedCohort.value ? statusOf(selectedCohort.value) : undefined)

// Explore: Threadbare's 13 workshops are each joinable on their own and must
// never be shown as one date range (Explore-Threadbare/curriculum.md:5). The
// single Cohort such an instance carries exists only because ProgramInstance
// requires one, so its enrollment status says nothing about the program —
// this branch takes precedence over the status machinery below.
const workshopInstance = computed(() =>
  props.instances.length === 1 && props.instances[0]!.enrollmentModel === 'workshop-series'
    ? props.instances[0]
    : undefined
)

// startsAt carries an explicit UTC designator (see programData/instances.ts),
// so format in UTC too: any other zone would make the server and the browser
// print different times for the same session and break hydration.
function formatSessionDateTime(iso: string) {
  const at = new Date(iso)
  const date = at.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })
  const time = at.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  })
  return `${date}, ${time}`
}

const workshopItems = computed(() => (workshopInstance.value?.sessions ?? []).map(session => ({
  value: session.id,
  label: session.title,
  description: formatSessionDateTime(session.startsAt)
})))

// Deliberately the first workshop rather than the next upcoming one: picking
// by "now" would resolve differently on the server and in the browser.
const selectedWorkshopId = ref(workshopInstance.value?.sessions[0]?.id)

const selectedWorkshop = computed(() => {
  const sessions = workshopInstance.value?.sessions
  if (!sessions) return undefined
  return sessions.find(s => s.id === selectedWorkshopId.value) ?? sessions[0]
})

const selectedInstance = computed(() =>
  workshopInstance.value ?? props.instances.find(i => i.id === selectedCohort.value?.instanceId)
)

// Session counts, teachers, tools and prerequisites deliberately live in
// ProgramSideInfo beside this card, not in it — the card is the dates, who's
// already here, and the action.
//
// Only workshops need a date row: the cohort picker's own value is the date
// range, so repeating it here would just say the same thing twice.
const detailRows = computed(() => {
  const workshop = selectedWorkshop.value
  if (!workshop) return []
  return [{ label: t('program.enroll.details.schedule'), value: formatSessionDateTime(workshop.startsAt) }]
})

const enrolledCount = computed(() => selectedCohort.value?.seatsTaken ?? 0)

// Initials, not photographs — there is no learner avatar artwork in the repo,
// and ProgramSocialProof already renders authors this way.
const enrolledAvatars = computed(() =>
  sampleLearnersForProgram(props.template.id)
    .slice(0, 4)
    .map(name => ({ alt: name, text: name.charAt(0) }))
)

// Educator Training has no instances at all, and a program whose every group
// is full has nothing bookable either — both get the notify-me capture
// instead of an empty card.
const showNotifyCapture = computed(() => !availableCohorts.value.length)

const notifyEmail = ref('')

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
  // A workshop-series instance has no real cohort to mark as taken (see
  // workshopInstance) — it only advances to the success step.
  if (!workshopInstance.value) {
    if (!selectedCohort.value) return
    justEnrolledCohortId.value = selectedCohort.value.id
  }
  enrollModalStep.value = 'success'
}

// Start-date line in the success view — one specific date ("Starts Tuesday,
// Aug 4"), not the full range already shown in the picker. For a workshop
// series it's the chosen workshop's own date and time.
const enrollModalStartDateLabel = computed(() => {
  if (selectedWorkshop.value) return formatSessionDateTime(selectedWorkshop.value.startsAt)
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

    <div v-if="showNotifyCapture" class="mt-4">
      <div class="font-heading font-semibold text-sm text-default">{{ t('program.enroll.notify.title') }}</div>
      <p class="text-xs text-muted mt-1 mb-3">{{ t('program.enroll.notify.body') }}</p>
      <!-- Mockup: there's no backend to post an address to, so the field and
           button are deliberately inert. -->
      <UFormField :label="t('program.enroll.notify.label')" class="mb-2">
        <UInput
          v-model="notifyEmail"
          type="email"
          icon="lucide:mail"
          :placeholder="t('program.enroll.notify.placeholder')"
          class="w-full"
        />
      </UFormField>
      <UButton
        :label="t('program.enroll.notify.cta')"
        color="primary"
        block
        :disabled="!notifyEmail.trim()"
      />
    </div>

    <template v-else>
      <UFormField
        v-if="workshopInstance"
        :label="t('program.enroll.workshopPickerLabel')"
        class="mt-4"
      >
        <USelectMenu
          v-model="selectedWorkshopId"
          value-key="value"
          :items="workshopItems"
          class="w-full"
        />
      </UFormField>

      <UFormField
        v-else-if="cohortItems.length > 1"
        :label="t('program.enroll.sessionPickerLabel')"
        class="mt-4"
      >
        <USelectMenu
          v-model="selectedCohortId"
          value-key="value"
          :items="cohortItems"
          :search-input="false"
          class="w-full"
        />
      </UFormField>

      <dl v-if="detailRows.length" class="mt-4 flex flex-col gap-2">
        <div
          v-for="row in detailRows"
          :key="row.label"
          class="flex items-baseline justify-between gap-3 text-xs"
        >
          <dt class="text-muted shrink-0">{{ row.label }}</dt>
          <dd class="text-default text-right">{{ row.value }}</dd>
        </div>
      </dl>

      <div v-if="enrolledCount" class="mt-4 flex items-center gap-2.5">
        <UAvatarGroup v-if="enrolledAvatars.length" size="xs" :max="4">
          <UAvatar v-for="learner in enrolledAvatars" :key="learner.alt" :text="learner.text" :alt="learner.alt" />
        </UAvatarGroup>
        <span class="text-xs text-muted">
          {{ t('program.enroll.enrolledCount', enrolledCount, { count: enrolledCount }) }}
        </span>
      </div>

      <USeparator class="mt-4" />

      <div v-if="selectedCohort" class="mt-4">
        <template v-if="workshopInstance">
          <UButton
            :label="t('program.enroll.cta.joinWorkshop')"
            icon="lucide:calendar-plus"
            color="primary"
            block
            @click="openEnrollModal"
          />
        </template>

        <template v-else-if="selectedStatus === 'already-enrolled'">
          <div class="flex items-center gap-3 mb-3">
            <UProgress :model-value="enrollment?.progress ?? 0" color="primary" />
            <span class="text-xs text-default">{{ enrollment?.progress ?? 0 }}%</span>
          </div>
          <UButton
            v-if="cohortHasStarted(selectedCohort)"
            :label="t('program.enroll.cta.resume')"
            icon="lucide:play"
            color="primary"
            block
            :to="`/learn/${template.id}?tab=classroom`"
          />
          <template v-else>
            <p class="text-xs text-muted mb-2">
              {{ t('program.enroll.cta.startsOn', { date: enrollModalStartDateLabel }) }}
            </p>
            <UButton :label="t('program.enroll.cta.resume')" icon="lucide:play" color="primary" block disabled />
          </template>
        </template>

        <template v-else-if="selectedStatus === 'self-paced-always-open'">
          <UBadge :label="t('program.enroll.sessionDescription.selfPaced')" color="neutral" variant="soft" class="mb-3" />
          <UButton
            :label="t('program.enroll.cta.startLearning')"
            icon="lucide:play"
            color="primary"
            block
            :to="`/learn/${template.id}?tab=classroom`"
          />
        </template>

        <template v-else-if="selectedStatus === 'requires-access-code'">
          <p class="text-xs text-muted mb-2">{{ t('program.enroll.accessCode.helper') }}</p>
          <UFormField
            :label="t('program.enroll.accessCode.label')"
            :error="codeError ? t('program.enroll.accessCode.error') : undefined"
            class="mb-2"
          >
            <UInput
              v-model="enteredCode"
              icon="lucide:key-round"
              :placeholder="t('program.enroll.accessCode.placeholder')"
              class="w-full"
            />
          </UFormField>
          <UButton
            :label="t('program.enroll.cta.unlockSession')"
            color="primary"
            block
            :disabled="!enteredCode.trim()"
            @click="submitCode"
          />
        </template>

        <template v-else-if="selectedStatus === 'closed'">
          <UBadge :label="t('program.enroll.cta.enrollmentClosed')" color="neutral" variant="soft" class="mb-3" />
          <UButton :label="t('program.enroll.cta.enrollmentClosed')" color="neutral" variant="soft" block disabled />
        </template>

        <template v-else>
          <UButton
            :label="t('program.enroll.cta.enroll')"
            icon="lucide:circle-check"
            color="primary"
            block
            @click="openEnrollModal"
          />
        </template>
      </div>
    </template>

    <UModal v-model:open="enrollModalOpen">
      <template #title>
        <span class="sr-only">{{ enrollModalStep === 'confirm'
          ? t('program.enroll.confirmModal.title')
          : t('program.enroll.successModal.title') }}</span>
      </template>
      <template #body>
        <div v-if="enrollModalStep === 'confirm' && selectedCohort" class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
            <UIcon name="lucide:calendar-check" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('program.enroll.confirmModal.title') }}
          </div>
          <p class="text-sm text-muted">
            <template v-if="selectedWorkshop">
              {{ t('program.enroll.confirmModal.workshopBody', {
                workshop: selectedWorkshop.title,
                program: template.title,
                date: enrollModalStartDateLabel
              }) }}
            </template>
            <template v-else>
              {{ t('program.enroll.confirmModal.body', { program: template.title, range: cohortLabel(selectedCohort) }) }}
            </template>
          </p>
        </div>

        <div v-else class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-success/10 text-success">
            <UIcon name="lucide:check" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('program.enroll.successModal.title') }}
          </div>
          <div class="w-full rounded-xl border border-default p-4 text-left">
            <div class="font-heading font-semibold text-default">
              {{ selectedWorkshop ? selectedWorkshop.title : template.title }}
            </div>
            <div class="text-sm text-muted">{{ t('program.enroll.successModal.starts', { date: enrollModalStartDateLabel }) }}</div>
          </div>
          <p class="text-sm text-muted">
            {{ t('program.enroll.successModal.emailNotice') }}
          </p>
        </div>
      </template>

      <template #footer>
        <template v-if="enrollModalStep === 'confirm'">
          <UButton :label="t('program.enroll.confirmModal.cancel')" color="neutral" variant="outline" @click="enrollModalOpen = false" />
          <UButton :label="t('program.enroll.confirmModal.confirm')" color="primary" @click="confirmEnrollment" />
        </template>
        <UButton
          v-else
          :label="t('program.enroll.successModal.done')"
          color="primary"
          block
          @click="enrollModalOpen = false"
        />
      </template>
    </UModal>
  </UPageCard>
</template>
