# Enrollment Confirmation Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the "Enroll in this session" button in `ProgramEnrollmentCard.vue` a working confirm-then-success modal flow, so clicking it no longer does nothing.

**Architecture:** Single `UModal` instance added to `ProgramEnrollmentCard.vue`, controlled by a local `ref` for open/closed and a local `ref` for which of its two views (`'confirm' | 'success'`) to show. Confirming sets a second local `ref` (`justEnrolledCohortId`) that `statusOf()` checks before falling back to `cohortStatusFor()` — this flips that cohort to `already-enrolled` for the rest of the browser session, reusing the card's existing progress-bar/"Resume learning" branch. No shared mock-data mutation, no backend call.

**Tech Stack:** Vue 3 `<script setup>`, Nuxt UI v4 (`UModal`, `UIcon`, `UButton`), Tailwind CSS v4, `@nuxtjs/i18n`. No test framework in this repo — verification is manual via the running dev server.

## Global Constraints

- Use Nuxt UI components, not hand-rolled HTML, per `CLAUDE.md`'s "Building UI" section.
- Use semantic Nuxt UI colors. `success` has no numbered shade ramp in this app's theme (`app/assets/css/main.css:147`, `--ui-success: var(--color-lime-500)` — a single flat token, not a `50`–`900` scale) — soft backgrounds must use the opacity-modifier form `bg-success/10 text-success`, exactly how Nuxt UI's own `Badge` soft variant does it (`.nuxt/ui/badge.ts`: `"class": "bg-success/10 text-success"` for `color: success, variant: soft`). The same applies to `primary`.
- No real email is sent — this app has no backend. The email-notice line in the success view is copy only.
- All UI-chrome strings go in `i18n/locales/en.json` / `es.json` under `program.enrollment.*`, consumed via `t()` — matching the existing pattern in this file.
- No test suite exists — verify by running the dev server and viewing `/learn/[programId]` in the browser.

---

### Task 1: Add i18n strings for both modal views

**Files:**
- Modify: `i18n/locales/en.json`
- Modify: `i18n/locales/es.json`

**Interfaces:**
- Produces: `program.enrollment.confirmModal.title`, `program.enrollment.confirmModal.body` (takes `{ program, range }`), `program.enrollment.confirmModal.cancel`, `program.enrollment.confirmModal.confirm`, `program.enrollment.successModal.title`, `program.enrollment.successModal.starts` (takes `{ date }`), `program.enrollment.successModal.emailNotice`, `program.enrollment.successModal.done` — all consumed by Task 2.

- [ ] **Step 1: Edit `i18n/locales/en.json`**

Find the existing `"enrollment"` block under `"program"` (it currently ends right after `"cohortDescription"`, just before the closing braces of `"program"`). Add two new sibling keys, `confirmModal` and `successModal`, inside `"enrollment"`, after `"cohortDescription"`:

```json
      "cohortDescription": {
        "open": "{taken} of {max} seats - {range}",
        "closed": "Closed - {range}",
        "requiresCode": "Requires an access code",
        "selfPaced": "Self-paced - start anytime",
        "alreadyEnrolled": "You're enrolled - {progress}% complete"
      },
      "confirmModal": {
        "title": "Lock in your seat?",
        "body": "You're about to enroll in {program}, {range}.",
        "cancel": "Cancel",
        "confirm": "Yes, enroll me"
      },
      "successModal": {
        "title": "You're in!",
        "starts": "Starts {date}",
        "emailNotice": "We've sent a confirmation to your email - keep an eye on your inbox for reminders as the session gets closer.",
        "done": "Got it"
      }
    }
```

(The trailing `}` closes `"enrollment"`; keep whatever came after it in the file — `cohortDescription` is currently the last key in `"enrollment"`, so this just adds two more siblings before that closing brace.)

- [ ] **Step 2: Edit `i18n/locales/es.json`**

Find the matching Spanish `"cohortDescription"` block inside `"enrollment"` and add the same two new sibling keys after it, in Spanish:

```json
      "cohortDescription": {
        "open": "{taken} de {max} cupos - {range}",
        "closed": "Cerrado - {range}",
        "requiresCode": "Requiere un código de acceso",
        "selfPaced": "A tu propio ritmo - comienza cuando quieras",
        "alreadyEnrolled": "Ya estás inscrito - {progress}% completado"
      },
      "confirmModal": {
        "title": "¿Reservar tu lugar?",
        "body": "Estás a punto de inscribirte en {program}, {range}.",
        "cancel": "Cancelar",
        "confirm": "Sí, inscríbeme"
      },
      "successModal": {
        "title": "¡Ya estás dentro!",
        "starts": "Comienza el {date}",
        "emailNotice": "Enviamos una confirmación a tu correo - revisa tu bandeja de entrada para recordatorios a medida que se acerque la sesión.",
        "done": "Entendido"
      }
    }
```

- [ ] **Step 3: Commit**

```bash
git add i18n/locales/en.json i18n/locales/es.json
git commit -m "Add i18n strings for enrollment confirmation modal"
```

---

### Task 2: Add the modal to `ProgramEnrollmentCard.vue`

**Files:**
- Modify: `app/components/ProgramEnrollmentCard.vue`

**Interfaces:**
- Consumes: the i18n keys from Task 1; `formatCohortRange` from `~/composables/useLearnMockData` (already imported); `Cohort`, `EnrollmentStatus` types (already imported).
- Produces: nothing consumed elsewhere — rendered only from `app/pages/learn/[programId].vue` as `<ProgramEnrollmentCard :template :instance :enrollment />` (unchanged usage, no prop/emit changes).

- [ ] **Step 1: Add local state and the enrollment-flip check to `statusOf`**

In the `<script setup>` block, find:

```ts
const unlockedCohortIds = ref<string[]>([])
const enteredCode = ref('')
const codeError = ref(false)

function isUnlocked(cohortId: string) {
  return unlockedCohortIds.value.includes(cohortId)
}

function statusOf(cohort: Cohort): EnrollmentStatus {
  return cohortStatusFor(cohort, props.enrollment, isUnlocked(cohort.id))
}
```

Replace it with:

```ts
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
```

- [ ] **Step 2: Add the modal's own state and actions**

Find the `submitCode` function at the end of the `<script setup>` block:

```ts
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
```

Add the following after it, still inside `<script setup>`:

```ts
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
```

- [ ] **Step 3: Wire the enroll button and add the modal markup**

Find the final `v-else` template branch:

```vue
      <template v-else>
        <p v-if="selectedCohort.maxLearners !== null" class="text-xs text-muted mb-3">
          {{ t('program.enrollment.seats.filled', { taken: selectedCohort.seatsTaken, max: selectedCohort.maxLearners }) }}
        </p>
        <UButton :label="t('program.enrollment.cta.enroll')" icon="lucide:circle-check" color="primary" block />
      </template>
    </div>
  </UPageCard>
</template>
```

Replace it with:

```vue
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
```

Note: the confirm view's condition is `enrollModalStep === 'confirm' && selectedCohort` (not just `enrollModalStep === 'confirm'`) so `cohortLabel(selectedCohort)` never runs against `undefined` — `selectedCohort` is only unset in the all-cohorts-full edge case, and this whole branch already sits inside the existing `<div v-if="selectedCohort" class="mt-4">` wrapper a few lines up, so it can't actually be reached with `selectedCohort` unset. The extra guard here just means Vue's template type-checking doesn't have to prove that fact across sibling scopes on its own.

- [ ] **Step 4: Manual verification**

Run: `npm run dev` (or use the already-running dev server)

Visit `/learn/ship-your-first-game` (has an `open-with-seats` cohort today) and:

1. Confirm the session picker has the "Tue/Thu" or "late summer" cohort selected (an open one), then click "Enroll in this session".
2. Expected: modal opens showing the confirm view — primary-colored calendar icon, "Lock in your seat?", a body line naming the program and the selected cohort's date range, "Cancel" and "Yes, enroll me" buttons.
3. Click "Cancel". Expected: modal closes, card is unchanged (still shows the enroll button, not enrolled).
4. Click "Enroll in this session" again, then click "Yes, enroll me". Expected: same modal, content swaps in place to the success view — green checkmark icon, "You're in!", a bordered card with the program title and a "Starts {weekday, month day}" line matching the cohort's actual start date, the email-notice line, and a single "Got it" button.
5. Click "Got it". Expected: modal closes. The card (still showing, no page reload) now renders the `already-enrolled` branch for that cohort — a 0% progress bar and a "Resume learning" button — without a page reload.
6. Reload the page. Expected: back to the original enroll button (local-only state, as designed — matches how the access-code unlock already behaves).
7. Switch locale to Spanish (`ULocaleSelect` on the page) and repeat steps 1–5, confirming all new strings translate.

If anything looks off, fix in this same file before moving on.

- [ ] **Step 5: Commit**

```bash
git add app/components/ProgramEnrollmentCard.vue
git commit -m "Add confirm-then-success modal to the enrollment flow"
```
