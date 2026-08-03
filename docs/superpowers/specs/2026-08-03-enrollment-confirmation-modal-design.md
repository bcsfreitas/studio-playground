# Enrollment confirmation modal

## Problem

In `ProgramEnrollmentCard.vue`, the "Enroll in this session" button (shown for a future-dated cohort with open seats — the `open-with-seats` status branch) has no click handler. Clicking it does nothing. We need a confirm-before-committing step (avoid a one-click accidental enrollment), then a clear success state telling the learner they're enrolled, that a confirmation email is coming, and exactly when the session starts.

## Inspiration

Found via Mobbin MCP (web platform):
- [Uxcel — "Confirm enrollment" modal](https://mobbin.com/screens/074a824b-a9f4-4e59-9039-fc5a59eb12c4): icon badge, title, one-line description, Confirm/Cancel footer. Model for the confirm view.
- [Mailchimp — "Your appointment's booked, Sam"](https://mobbin.com/screens/3fd5de80-0538-4a72-84f7-27771fa84c01): checkmark icon, personalized headline, a highlighted card holding the key date fact, single CTA. Model for the success view.
- [Care.com — "Yay, you're verified."](https://mobbin.com/screens/9b935b8e-2f07-4618-9926-a7c18929beca): shows where the "fun" tone lives (icon + short punchy copy), without needing custom illustrations we don't have.

## Design

**Trigger** — the existing enroll button in the `open-with-seats` template branch of `ProgramEnrollmentCard.vue` gets an `@click` that opens a `UModal`. No other status branch (`already-enrolled`, `self-paced-always-open`, `requires-access-code`, `closed`) is touched.

**One modal, two views** — a single `UModal` instance whose body content swaps between "confirm" and "success" based on a local `ref` (e.g. `step: 'confirm' | 'success'`), rather than closing and reopening a second modal. Feels like one continuous action.

**Confirm view:**
- Circular icon badge, `primary` color, `lucide:calendar-check`
- Title: "Lock in your seat?"
- Body: one line combining the program title and the selected cohort's date range, via the existing `formatCohortRange` helper (same format already shown in the session picker) — e.g. "You're about to enroll in *Ship Your First Game*, Aug 4 – Sep 29."
- Footer: "Cancel" (`neutral`, closes the modal, no state change) and "Yes, enroll me" (`primary`, advances to the success view and performs the state change below)

**Success view:**
- Circular icon badge swaps to `success` color, `lucide:check`
- Title: "You're in!"
- A highlighted card (bordered, `rounded-lg`, `bg-elevated` or similar per `DESIGN.md` tokens): program title (bold) + "Starts {weekday, month day}" — a specific start-date line (e.g. "Starts Tuesday, Aug 4"), not just the range, since the ask is to state plainly when the session starts
- One line below the card: "We've sent a confirmation to your email — keep an eye on your inbox for reminders as the session gets closer." (no real email is sent — this app has no backend; the line is copy only, consistent with the rest of this prototype)
- Footer: single "Got it" button, closes the modal

**State change on confirm** — no shared mock-data mutation. Add a local ref in `ProgramEnrollmentCard.vue` (e.g. `justEnrolledCohortId: ref<string | null>(null)`), set to the selected cohort's id when the learner confirms. `statusOf()` checks this ref first (before calling `cohortStatusFor`) and returns `'already-enrolled'` for that cohort id if set. This mirrors the existing `unlockedCohortIds` pattern already in this component (client-only, resets on reload) — no changes to `useProgramMockData.ts` or `enrollmentsByPreviewState`.

Once set, the card's existing `already-enrolled` branch renders (progress bar at 0%, "Resume learning" button) for that cohort — reusing UI that already exists, no new branch needed there.

**Scope of the trigger** — only the `open-with-seats` branch. `self-paced-always-open` cohorts have no session date to confirm against and keep their existing "Start learning" button unchanged.

**i18n** — new keys under `program.enrollment.confirmModal.*` and `program.enrollment.successModal.*` in both `en.json` and `es.json`, following the existing `program.enrollment.*` key structure in this file.

## Out of scope

- Actually sending an email (no backend exists in this app).
- Any change to `already-enrolled`, `self-paced-always-open`, `requires-access-code`, or `closed` branches.
- Persisting the enrollment past a page reload, or writing it into `enrollmentsByPreviewState`.
- A waitlist or any full-cohort interaction (handled separately — full cohorts are already filtered out of the picker).
