<script setup lang="ts">
import type { ProgramTemplate, ProgramInstance, EnrollmentRecord, Cohort, EnrollmentStatus } from '~/composables/useProgramMockData'
import { cohortStatusFor, cohortHasStarted, isBookableStatus, useConsentBoundary } from '~/composables/useProgramMockData'
import { formatCohortRange } from '~/composables/useLearnMockData'
import { useProgramTabs } from '~/composables/useProgramTabs'
import { usePreviewState } from '~/composables/usePreviewState'
import { useProgramEnrollment } from '~/composables/useProgramEnrollment'
import { signUpTo } from '~/composables/useAuthIntent'

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

// The program's own facts, above the picker: true of every session, so they
// frame the card rather than sit inside one option. Each gets a fixed accent
// (not tied to its value, unlike difficulty's severity coloring in ProgramHero)
// so the list reads as distinct categories. Classes are written out per color,
// not built from a template string — Tailwind's scanner needs the literal class
// name in source.
//
// Meetings are named in the program's own terms: Explore: Threadbare runs
// workshops, and only a program built around milestones has a milestone row.
const facts = computed(() => {
  const { totalXp, difficulty, sessionCount, sessionUnit, milestoneCount } = props.template

  const rows = [
    {
      key: 'totalXp',
      icon: undefined as string | undefined,
      iconClass: '',
      image: '/images/icons/xp.svg' as string | undefined,
      value: `${totalXp} XP`
    },
    {
      key: 'difficulty',
      icon: undefined,
      iconClass: '',
      image: '/images/icons/Level.svg',
      value: t(`program.badges.difficulty.${difficulty}`)
    },
    {
      key: 'sessions',
      icon: undefined,
      iconClass: '',
      image: '/images/icons/calendar.svg',
      value: t(`program.sideInfo.${sessionUnit}Count`, sessionCount, { count: sessionCount })
    }
  ]

  if (milestoneCount) {
    rows.push({
      key: 'milestones',
      icon: undefined,
      iconClass: '',
      image: '/images/icons/flag.svg',
      value: t('program.sideInfo.milestoneCount', milestoneCount, { count: milestoneCount })
    })
  }

  return rows
})

// Tabs are front-end state, so resuming switches tab rather than navigating.
const { setTab } = useProgramTabs()
const { startSelfPaced } = useProgramEnrollment(computed(() => props.template.id))

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

// Cancelling is the same fake in reverse: the seeded enrollment records are
// static per preview state, so dropping a seat only holds inside this card.
// The classroom tab and the home resume card keep reading the record.
const cancelledCohortIds = ref<string[]>([])

function statusOf(cohort: Cohort): EnrollmentStatus {
  if (cancelledCohortIds.value.includes(cohort.id)) {
    return cohortStatusFor(cohort, undefined, isUnlocked(cohort.id))
  }
  if (justEnrolledCohortId.value === cohort.id) return 'already-enrolled'
  return cohortStatusFor(cohort, props.enrollment, isUnlocked(cohort.id))
}

// The picker names a session by the day it starts, not by its span: a learner
// choosing between groups is choosing when to begin. The end date is still in
// the confirmation modal, which is where the commitment is made.
// UTC to match how the date-only ISO string is parsed — see formatCohortRange.
function cohortStartLabel(cohort: Cohort) {
  // The self-paced option sits in the same list as the dated runs, so it needs
  // a label as short as a date — its description carries the rest.
  if (!cohort.startDate) return t('program.enroll.selfPacedOption.label')
  return new Date(cohort.startDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

function cohortRangeLabel(cohort: Cohort) {
  return cohort.startDate
    ? formatCohortRange(cohort.startDate, cohort.endDate!)
    : t('program.enroll.sessionDescription.selfPaced')
}

// Seats are the badge's job now, so an open session needs no description line —
// its date and its spots already say everything the option has to say.
function cohortDescription(cohort: Cohort) {
  const status = statusOf(cohort)
  if (status === 'already-enrolled') {
    return t('program.enroll.sessionDescription.alreadyEnrolled', { progress: props.enrollment?.progress ?? 0 })
  }
  if (status === 'self-paced-always-open') return t('program.enroll.selfPacedOption.description')
  if (status === 'requires-access-code') return t('program.enroll.sessionDescription.requiresCode')
  return undefined
}

// Only groups with a cap can report how full they are; a self-paced or
// uncapped group has no denominator to count against.
function cohortSpotsLabel(cohort: Cohort) {
  if (!cohort.maxLearners) return undefined
  return t('program.enroll.spotsFilled', { taken: cohort.seatsTaken, max: cohort.maxLearners })
}

// A cohort nobody can book isn't offered as an option at all — full ones have
// no waitlist flow, ended ones nothing to join. The learner's own cohort is the
// exception: already-enrolled outranks both in cohortStatusFor, so Explore:
// Godot's enrolled learner keeps seeing their group after it fills or ends.
const availableCohorts = computed(() =>
  props.instances.flatMap(i => i.cohorts).filter(c => isBookableStatus(statusOf(c)))
)

// A learner holds one seat per program at a time, so once they're in a session
// the other sessions stop being offers. The picker gives way to their own
// session's dates, and it only comes back if they cancel.
const enrolledCohort = computed(() => availableCohorts.value.find(c => statusOf(c) === 'already-enrolled'))

const cohortItems = computed(() => availableCohorts.value.map(cohort => ({
  value: cohort.id,
  label: cohortStartLabel(cohort),
  description: cohortDescription(cohort),
  spots: cohortSpotsLabel(cohort)
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

// The card is not remounted when the DevPreviewBar changes state — <NuxtPage>
// is keyed on programId, so only the `enrollment` prop changes. Without this
// the ref keeps the session that was default at setup, and an enrolled learner
// lands back on someone else's session with an "Enroll" button.
watch(defaultCohortId, (id) => {
  selectedCohortId.value = id
})

// The enrolled session wins outright, not just as a default: with no picker to
// change it back, anything that moves the selection (the `?enroll=` intent, a
// stale ref) would otherwise strand the learner on a session they don't hold.
const selectedCohort = computed(() =>
  enrolledCohort.value
  ?? availableCohorts.value.find(c => c.id === selectedCohortId.value)
  ?? availableCohorts.value[0]
)

const selectedStatus = computed(() => selectedCohort.value ? statusOf(selectedCohort.value) : undefined)

// Educator Training has no instances at all, and a program whose every group is
// full or finished has nothing bookable either — both get the notify-me capture
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
const enrollModalStep = ref<'confirm' | 'success' | 'cancel' | 'vpc-gate' | 'self-paced-confirm' | 'access-code'>('confirm')

function openEnrollModal() {
  enrollModalStep.value = 'confirm'
  enrollModalOpen.value = true
}

// The discrete "I have an access code" link redeems a code against any of
// this program's gated cohorts, not just whichever one happens to be
// selected — the default pick favors an open or self-paced session (see
// defaultCohortId above), so a learner's private cohort can sit unselected
// further down the picker even though they already have its code.
const joinCode = ref('')
const joinCodeError = ref(false)

function openAccessCodeModal() {
  joinCode.value = ''
  joinCodeError.value = false
  enrollModalStep.value = 'access-code'
  enrollModalOpen.value = true
}

function submitJoinCode() {
  const cohort = props.instances
    .flatMap(i => i.cohorts)
    .find(c => c.accessCode === joinCode.value.trim())

  if (!cohort || cohortStatusFor(cohort, props.enrollment, false) !== 'requires-access-code') {
    joinCodeError.value = true
    return
  }

  unlockedCohortIds.value.push(cohort.id)
  selectedCohortId.value = cohort.id
  enrollModalStep.value = 'confirm'
}

function openSelfPacedConfirmModal() {
  enrollModalStep.value = 'self-paced-confirm'
  enrollModalOpen.value = true
}

// The visible heading lives in the body, styled; this is the accessible name
// the dialog is announced by, so it has to track whichever step is showing.
const modalTitle = computed(() => {
  if (enrollModalStep.value === 'cancel') return t('program.enroll.cancelModal.title')
  if (enrollModalStep.value === 'confirm') return t('program.enroll.confirmModal.title')
  if (enrollModalStep.value === 'vpc-gate') return t('onboarding.vpcGate.title')
  if (enrollModalStep.value === 'self-paced-confirm') return t('program.enroll.selfPacedConfirmModal.title')
  if (enrollModalStep.value === 'access-code') return t('program.enroll.accessCodeModal.title')
  return t('program.enroll.successModal.title')
})

function openCancelModal() {
  enrollModalStep.value = 'cancel'
  enrollModalOpen.value = true
}

function confirmCancellation() {
  if (!selectedCohort.value) return
  if (justEnrolledCohortId.value === selectedCohort.value.id) justEnrolledCohortId.value = null
  cancelledCohortIds.value.push(selectedCohort.value.id)
  enrollModalOpen.value = false
}

const route = useRoute()
const { isLoggedIn, accountStatus } = usePreviewState()

// Flow 2a's join screen: an unconsented young learner joining an open cohort
// is exactly the doc's "VPC at join" case (M2a) — the one boundary action
// that reads cohort type, not just account status. See consent.ts.
//
// Self-paced cohorts (startDate === null) are excluded on purpose: the
// consent matrix is about a *group's* visibility, and a self-paced instance
// has no roster to be seen with — starting one alone crosses no boundary,
// so it's never gated regardless of its `type`.
const { check } = useConsentBoundary()
const joinGate = computed(() => {
  if (!selectedCohort.value || selectedCohort.value.startDate === null) return { gated: false, reason: 'not-required' as const }
  return check(accountStatus.value, selectedCohort.value.type, 'join-open-cohort')
})

// A guest pressing Enroll is a guest telling us what they want. Sign-up carries
// the program and the session they picked, and the query it comes back with is
// what reopens this modal on the other side.
const signUpToEnroll = computed(() => signUpTo(
  selectedCohort.value ? `${route.path}?enroll=${selectedCohort.value.id}` : route.path
))

// Same intent-carrying trick as signUpToEnroll, for the self-paced CTA: a
// guest's `next` marks that they meant to start, not just "come back here."
const signUpToStartSelfPaced = computed(() => signUpTo(`${route.path}?startSelfPaced=1`))

// The access-code link has no intent worth carrying: the code itself never
// survives the round trip, so a guest just lands back here and clicks again.
const signUpToAccessCode = computed(() => signUpTo(route.path))

function onEnrollClick() {
  // Guests follow the `to` link instead; nothing to do here for them.
  if (!isLoggedIn.value) return
  if (joinGate.value.gated) {
    enrollModalStep.value = 'vpc-gate'
    enrollModalOpen.value = true
    return
  }
  openEnrollModal()
}

function onStartLearningClick() {
  // Guests follow the `to` link instead; nothing to do here for them.
  if (!isLoggedIn.value) return
  openSelfPacedConfirmModal()
}

function onAccessCodeLinkClick() {
  // Guests follow the `to` link instead; nothing to do here for them.
  if (!isLoggedIn.value) return
  openAccessCodeModal()
}

function confirmSelfPaced() {
  startSelfPaced()
  enrollModalOpen.value = false
  setTab('classroom')
}

// Resuming the intent, once. Waits for a signed-in state rather than firing on
// mount: usePreviewState only reads storage on mount, so "signed in" isn't
// known yet at setup, and a stray `?enroll=`/`?startSelfPaced=` must never
// open a modal for a guest who was merely linked here.
const resumedIntent = ref(false)
watch(isLoggedIn, (signedIn) => {
  if (!signedIn || resumedIntent.value) return

  const cohort = availableCohorts.value.find(c => c.id === route.query.enroll)
  if (!cohort) return

  resumedIntent.value = true
  selectedCohortId.value = cohort.id
  openEnrollModal()
}, { immediate: true })

const resumedSelfPacedIntent = ref(false)
watch(isLoggedIn, (signedIn) => {
  if (!signedIn || resumedSelfPacedIntent.value) return
  if (route.query.startSelfPaced !== '1') return

  resumedSelfPacedIntent.value = true
  openSelfPacedConfirmModal()
}, { immediate: true })

function confirmEnrollment() {
  if (!selectedCohort.value) return
  justEnrolledCohortId.value = selectedCohort.value.id
  enrollModalStep.value = 'success'
}

// Start-date line in the success view — one specific date ("Starts Tuesday,
// Aug 4"), not the full range already shown in the picker.
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

// The clock only starts after mount. The server's timezone isn't the learner's,
// so a day count rendered on both sides can disagree across a midnight boundary
// — until this is set, the button falls back to the plain start-date label.
const now = ref<number | null>(null)
onMounted(() => {
  now.value = Date.now()
})

const daysUntilStart = computed(() => {
  const startDate = selectedCohort.value?.startDate
  if (!startDate || now.value === null) return undefined
  const days = Math.ceil((Date.parse(`${startDate}T00:00:00Z`) - now.value) / 86_400_000)
  return days > 0 ? days : undefined
})

const waitingCtaLabel = computed(() => daysUntilStart.value
  ? t('program.enroll.cta.startsIn', daysUntilStart.value, { count: daysUntilStart.value })
  : t('program.enroll.cta.startsOn', { date: enrollModalStartDateLabel.value }))

// The invite covers the whole run as an all-day span, which is as precise as
// the mock cohorts get — they carry dates, no meeting times or timezone.
function addToCalendar() {
  const cohort = selectedCohort.value
  if (!cohort?.startDate) return

  downloadIcs({
    uid: `${cohort.id}@endlessstudios.com`,
    title: props.template.title,
    description: props.template.description,
    url: `${window.location.origin}${route.path}`,
    startDate: cohort.startDate,
    endDate: cohort.endDate ?? cohort.startDate
  }, `${props.template.id}-${cohort.id}`)
}
</script>

<template>
  <UPageCard
    variant="outline"
    spotlight
    class="[--spotlight-color:var(--color-orange-200)]"
    :ui="{ spotlight: 'absolute inset-px rounded-[inherit] pointer-events-none bg-default' }"
  >
    <ul class="flex flex-col gap-3">
      <li v-for="fact in facts" :key="fact.key" class="flex items-center gap-3">
        <img v-if="fact.image" :src="fact.image" alt="" class="size-8 shrink-0" />
        <div v-else class="flex items-center justify-center size-8 shrink-0" :class="fact.iconClass">
          <Icon :name="fact.icon!" class="size-5" />
        </div>
        <span class="text-md font-heading font-semibold text-muted">{{ fact.value }}</span>
      </li>
    </ul>

    <USeparator class="my-6" />

    <div v-if="showNotifyCapture">
      <div class="font-heading font-bold text-highlighted line-clamp-2">{{ t('program.enroll.notify.title') }}</div>
      <p class="text-sm text-default mt-1 mb-6">{{ t('program.enroll.notify.body') }}</p>
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
      <div v-if="enrolledCohort" class="mb-4">
        <div class="text-xs font-semibold text-dimmed uppercase tracking-wide">
          {{ t('program.enroll.yourSession') }}
        </div>
        <div class="text-sm text-default mt-1">{{ cohortRangeLabel(enrolledCohort) }}</div>
      </div>

      <UFormField
        v-else-if="cohortItems.length > 1"
        :label="t('program.enroll.sessionPickerLabel')"
      >
        <URadioGroup
          v-model="selectedCohortId"
          variant="card"
          color="primary"
          value-key="value"
          :items="cohortItems"
          :ui="{ fieldset: 'w-full gap-2' }"
        >
          <!-- The label slot spans the card's full width, which is what puts
               the spots badge against its right edge. -->
          <template #label="{ item }">
            <span class="flex items-center justify-between gap-2 w-full">
              {{ item.label }}
              <UBadge
                v-if="item.spots"
                :label="item.spots"
                color="neutral"
                variant="soft"
                size="sm"
                class="shrink-0 font-normal"
              />
            </span>
          </template>
        </URadioGroup>
      </UFormField>

      <div v-if="selectedCohort">
        <template v-if="selectedStatus === 'already-enrolled'">
          <div class="flex items-center gap-3 mb-3">
            <UProgress :model-value="enrollment?.progress ?? 0" color="primary" />
            <span class="text-xs text-default">{{ enrollment?.progress ?? 0 }}%</span>
          </div>
          <UButton
            v-if="cohortHasStarted(selectedCohort)"
            :label="t('program.enroll.cta.resume')"
            icon="lucide:play"
            color="primary"
            size="xl"
            block
            @click="setTab('classroom')"
          />
          <!-- Enrolled, but the session hasn't started: the seat is booked and
               there's nothing to open yet, so the CTA counts down instead of
               resuming and the two things still worth doing sit under it. -->
          <div v-else class="flex flex-col gap-2">
            <UButton :label="waitingCtaLabel" icon="lucide:play" color="primary" size="xl" block disabled />
            <UButton
              :label="t('program.enroll.waiting.addToCalendar')"
              icon="lucide:calendar-plus"
              color="neutral"
              variant="outline"
              block
              @click="addToCalendar"
            />
            <UButton
              :label="t('program.enroll.waiting.cancel')"
              color="neutral"
              variant="outline"
              block
              @click="openCancelModal"
            />
            <p class="text-xs text-muted mt-1">{{ t('program.enroll.waiting.helper') }}</p>
          </div>
        </template>

        <template v-else-if="selectedStatus === 'self-paced-always-open'">
          <!-- No seat or start date to pick, but starting still opens the
               classroom immediately — worth a confirmation rather than a
               silent one-click commit. A guest's intent survives the sign-up
               round trip via `?startSelfPaced=1` and reopens this same modal
               on return (see the resumedSelfPacedIntent watcher above). -->
          <UButton
            :label="t('program.enroll.cta.startLearning')"
            icon="lucide:play"
            color="primary"
            size="xl"
            block
            :to="isLoggedIn ? undefined : signUpToStartSelfPaced"
            @click="onStartLearningClick"
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
            size="xl"
            block
            :disabled="!enteredCode.trim()"
            @click="submitCode"
          />
        </template>

        <template v-else>
          <UButton
            :label="t('program.enroll.cta.enroll')"
            icon="lucide:circle-check"
            color="primary"
            size="xl"
            block
            :to="isLoggedIn ? undefined : signUpToEnroll"
            @click="onEnrollClick"
          />
        </template>
      </div>

      <UButton
        v-if="!enrolledCohort && selectedStatus !== 'requires-access-code'"
        :label="t('program.enroll.hasAccessCode')"
        variant="link"
        color="neutral"
        size="sm"
        block
        class="justify-center mt-2"
        :to="isLoggedIn ? undefined : signUpToAccessCode"
        @click="onAccessCodeLinkClick"
      />
    </template>

    <UModal v-model:open="enrollModalOpen">
      <template #title>
        <span class="sr-only">{{ modalTitle }}</span>
      </template>
      <template #body>
        <div v-if="enrollModalStep === 'cancel' && selectedCohort" class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-error/10 text-error">
            <UIcon name="lucide:calendar-x" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('program.enroll.cancelModal.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('program.enroll.cancelModal.body', { program: template.title, range: cohortRangeLabel(selectedCohort) }) }}
          </p>
        </div>

        <div v-else-if="enrollModalStep === 'confirm' && selectedCohort" class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
            <UIcon name="lucide:calendar-check" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('program.enroll.confirmModal.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('program.enroll.confirmModal.body', { program: template.title, range: cohortRangeLabel(selectedCohort) }) }}
          </p>
        </div>

        <div v-else-if="enrollModalStep === 'self-paced-confirm'" class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
            <UIcon name="lucide:play" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('program.enroll.selfPacedConfirmModal.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('program.enroll.selfPacedConfirmModal.body', { program: template.title }) }}
          </p>
        </div>

        <div v-else-if="enrollModalStep === 'access-code'" class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
            <UIcon name="lucide:key-round" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('program.enroll.accessCodeModal.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('program.enroll.accessCodeModal.body', { program: template.title }) }}
          </p>
          <UFormField
            :error="joinCodeError ? t('program.enroll.accessCodeModal.error') : undefined"
            class="w-full text-left"
          >
            <UInput
              v-model="joinCode"
              icon="lucide:key-round"
              :placeholder="t('program.enroll.accessCode.placeholder')"
              class="w-full"
              @keydown.enter="submitJoinCode"
            />
          </UFormField>
        </div>

        <div v-else-if="enrollModalStep === 'vpc-gate'" class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-kids-50 text-kids">
            <UIcon name="lucide:shield-check" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('onboarding.vpcGate.title') }}
          </div>
          <p class="text-sm text-muted">
            {{ t('program.enroll.vpcGate.body', { program: template.title }) }}
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
              {{ template.title }}
            </div>
            <div class="text-sm text-muted">{{ t('program.enroll.successModal.starts', { date: enrollModalStartDateLabel }) }}</div>
          </div>
          <p class="text-sm text-muted">
            {{ t('program.enroll.successModal.emailNotice') }}
          </p>
        </div>
      </template>

      <template #footer>
        <template v-if="enrollModalStep === 'cancel'">
          <UButton :label="t('program.enroll.cancelModal.keep')" color="neutral" variant="outline" @click="enrollModalOpen = false" />
          <UButton :label="t('program.enroll.cancelModal.confirm')" color="error" @click="confirmCancellation" />
        </template>
        <template v-else-if="enrollModalStep === 'confirm'">
          <UButton :label="t('program.enroll.confirmModal.cancel')" color="neutral" variant="outline" @click="enrollModalOpen = false" />
          <UButton :label="t('program.enroll.confirmModal.confirm')" color="primary" @click="confirmEnrollment" />
        </template>
        <template v-else-if="enrollModalStep === 'vpc-gate'">
          <UButton :label="t('onboarding.vpcGate.exits.play')" color="neutral" variant="outline" to="/" @click="enrollModalOpen = false" />
          <UButton :label="t('onboarding.vpcGate.exits.waitlist')" color="neutral" variant="outline" to="/learn" @click="enrollModalOpen = false" />
        </template>
        <template v-else-if="enrollModalStep === 'self-paced-confirm'">
          <UButton :label="t('program.enroll.selfPacedConfirmModal.cancel')" color="neutral" variant="outline" @click="enrollModalOpen = false" />
          <UButton :label="t('program.enroll.selfPacedConfirmModal.confirm')" color="primary" @click="confirmSelfPaced" />
        </template>
        <template v-else-if="enrollModalStep === 'access-code'">
          <UButton :label="t('program.enroll.accessCodeModal.cancel')" color="neutral" variant="outline" @click="enrollModalOpen = false" />
          <UButton :label="t('program.enroll.accessCodeModal.confirm')" color="primary" :disabled="!joinCode.trim()" @click="submitJoinCode" />
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
