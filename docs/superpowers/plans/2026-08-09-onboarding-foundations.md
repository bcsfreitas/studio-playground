# Onboarding flows — boundary consent model (foundations) — Implementation Plan

**Goal:** Build the consent-matrix data model, a flow-scoped mountable checklist, and the "What's Next" home-page state machine described in `docs/superpowers/specs/2026-08-09-onboarding-foundations-design.md`, proven through two flows (2a, cold arrival joining an open cohort; 4, commenting on a game) rather than left abstract.

**Architecture:** New `programData/consent.ts` holds the account-status axis and the gating composable. `Cohort` gains a `type` field. The existing single global checklist becomes a flow-scoped composable rendered by two components. A new `useWhatsNext()` composable and `WhatsNextSlot.vue` replace three ad hoc home-page widgets with one state machine. Two new minimal game pages give Flow 4 (and Flow 6's entry point) somewhere to live.

**Tech stack:** Nuxt 4.5, Vue 3.5, Nuxt UI v4, Tailwind v4, `@nuxtjs/i18n` v10, TypeScript.

## Verification approach

This repo has no test runner. Every task verifies against the running dev server with `scripts/check-route.sh` (already exists, built for the program-page-shell plan) plus manual walkthroughs of the preview-bar state matrix. Start the dev server once and leave it running:

```bash
npm run dev
```

## Global constraints

Copied from the design spec, apply to every task:

- Never use "cohort" in learner-facing copy or any i18n key/value. Use "your group" / "live session". `Cohort` stays a data-model term.
- Every user-facing string goes through `useI18n()`, in both `i18n/locales/en.json` and `i18n/locales/es.json` (real Spanish, not copies).
- Check the `nuxt-ui` skill before writing markup. Use `USeparator`, not border divs.
- Follow `DESIGN.md`: semantic `color` props only, `UPageCard` as the card primitive, hairline border before shadow.
- Comments explain **why**, never **what**.
- No AI trailers in commit messages.

---

### Task 1: Consent data model

**Files:**
- Modify: `app/composables/programData/types.ts` (`Cohort.type`)
- Modify: `app/composables/programData/instances.ts` (backfill every seed cohort)
- Create: `app/composables/programData/consent.ts`

**Interfaces:**
- Produces: `AccountStatus`, `PREVIEW_ACCOUNT_STATUSES`, `BoundaryAction`, `useConsentBoundary()`.

- [ ] **Step 1:** Add `type: 'closed' | 'open'` to the `Cohort` interface in `types.ts`.
- [ ] **Step 2:** Backfill every existing `Cohort` literal in `instances.ts` with a real value — base the choice on each cohort's existing `accessCode`/`maxLearners` shape (an access-code cohort is closed; a scheduled public one is open) rather than defaulting all to one value, so the matrix has real variety to walk in Task 6.
- [ ] **Step 3:** Write `consent.ts`:

```ts
export type AccountStatus = 'restricted' | 'young-learner' | 'adult'

export const PREVIEW_ACCOUNT_STATUSES: { id: AccountStatus, label: string }[] = [
  { id: 'restricted', label: 'Restricted (NDPA)' },
  { id: 'young-learner', label: 'Young Learner' },
  { id: 'adult', label: 'Adult' }
]

export type BoundaryAction = 'join-open-cohort' | 'publish-portfolio' | 'github-connect' | 'post-outward'

export interface ConsentCheck {
  gated: boolean
  reason: 'not-required' | 'deferred' | 'pending-vpc'
}

// The matrix from docs/brain/onboarding-flows-boundary-consent.md's own
// table: only `join-open-cohort` reads cohort type -- the other three
// boundary actions gate a young learner regardless of which cohort they're
// in, per that doc's M2b.
export function checkConsentBoundary(
  status: AccountStatus,
  cohortType: 'closed' | 'open',
  action: BoundaryAction
): ConsentCheck {
  if (status === 'restricted' || status === 'adult') return { gated: false, reason: 'not-required' }
  // status === 'young-learner'
  if (action === 'join-open-cohort') {
    return cohortType === 'open'
      ? { gated: true, reason: 'pending-vpc' }
      : { gated: false, reason: 'deferred' }
  }
  return { gated: true, reason: 'pending-vpc' }
}

export function useConsentBoundary() {
  return { check: checkConsentBoundary }
}
```

- [ ] **Step 4:** Verify nothing broke:

```bash
scripts/check-route.sh /learn "Programs"
```

- [ ] **Step 5:** Commit:

```bash
git add app/composables/programData/types.ts app/composables/programData/instances.ts app/composables/programData/consent.ts
git commit -m "Add the account-status x cohort-type consent matrix

New consent.ts centralizes the doc's boundary-consent table in one
function so no component computes the matrix inline. Cohort gains a
type field (closed/open) distinct from ProgramInstance.visibility,
which governs instance discovery rather than individual consent."
```

---

### Task 2: AccountStatus preview storage

**Files:**
- Modify: `app/composables/usePreviewState.ts`

**Interfaces:**
- Produces: `useAccountStatus()` (new export, or an addition to `usePreviewState`'s return) mirroring the existing `state`/`isGuest`/etc. shape.

- [ ] **Step 1:** Add a second `useState` + localStorage slot (`STORAGE_KEY = 'account-status'`) following the exact pattern already in the file — same hydration guard, same `watch`-to-localStorage. Decide during implementation whether this lives in `usePreviewState.ts` itself or a sibling `useAccountStatus.ts`; either is fine as long as `reset()` clears both keys.
- [ ] **Step 2:** Extend `reset()`'s key filter to also remove the new storage key.
- [ ] **Step 3:** Verify:

```bash
scripts/check-route.sh / "Programs"
```

- [ ] **Step 4:** Commit:

```bash
git add app/composables/
git commit -m "Add AccountStatus as a preview axis independent of PreviewState

PreviewState keeps narrating the mock-session lifecycle (guest/fresh/
new/onboarded); AccountStatus narrates the doc's consent tier
(restricted/young-learner/adult). Conflating the two was how the
project-page-shell plan's PreviewState/LearnerPhase split went wrong
the first time -- keeping them separate here from the start."
```

---

### Task 3: Flow-scoped checklist

**Files:**
- Create: `app/composables/useOnboardingChecklist.ts`
- Create: `app/components/ChecklistCard.vue`
- Create: `app/components/ChecklistMirror.vue`
- Modify: `i18n/locales/en.json`, `i18n/locales/es.json`

**Interfaces:**
- Produces: `useOnboardingChecklist(flowId, contextId)` → `{ items, progress, toggle(itemId) }`.

- [ ] **Step 1:** Write the composable. Item sets for `'2a'` and `'4'` per the design spec's "Checklist system" section — hardcode these two for now, keyed by a small `Record<'2a' | '4', ChecklistItem[]>`, not a generic rules engine; a third flow's items get added when that flow is built, not guessed at now.
- [ ] **Step 2:** Persist toggled state to `localStorage` under `onboarding-checklist:${flowId}:${contextId}`, same key-prefix convention `useProgramProgress` already uses for `program-progress:`.
- [ ] **Step 3:** Build `ChecklistCard.vue` by copying `GettingStartedCard.vue`'s markup (conic-gradient ring, dashed→solid check circles, strikethrough done rows) verbatim, swapping its data source for the new composable's `items`/`toggle`.
- [ ] **Step 4:** Build `ChecklistMirror.vue` — one line, e.g. `{{ programTitle }} — {{ done }} of {{ total }} done, next: {{ nextItem.label }}`, linking to the program page.
- [ ] **Step 5:** Add i18n keys under `onboarding.checklist.*` for both flows' item labels — English and real Spanish, not copies. "Introduce yourself to your cohort" becomes "your group", not "cohort" (naming rule).
- [ ] **Step 6:** Verify both components render with each flow's items — mount `ChecklistCard` on a scratch route or Storybook story if one exists for the pattern, otherwise verify in place once Task 6 wires it into a real page.
- [ ] **Step 7:** Commit:

```bash
git add app/composables/useOnboardingChecklist.ts app/components/ChecklistCard.vue app/components/ChecklistMirror.vue i18n/
git commit -m "Replace the global getting-started checklist with a flow-scoped one

GettingStartedItem/gettingStartedItemsFor was one fixed 5-item list
keyed only to PreviewState. The doc's checklists differ per flow and
need to render on two surfaces in sync -- ChecklistCard (full, program
page) and ChecklistMirror (compact, home) now share one composable
instead of duplicating state."
```

---

### Task 4: What's Next state machine

**Files:**
- Create: `app/composables/useWhatsNext.ts`
- Create: `app/components/WhatsNextSlot.vue`
- Modify: `i18n/locales/en.json`, `i18n/locales/es.json`

**Interfaces:**
- Consumes: `usePreviewState()`, `useOnboardingChecklist()` (Task 3), `enrollmentsByPhase` (existing).
- Produces: `useWhatsNext()` → a `ComputedRef<WhatsNextState>` per the design spec's four-variant union.

- [ ] **Step 1:** Write the composable exactly as sketched in the design spec — a computed with an early-return chain in precedence order (guest → checklist-incomplete → next-step → vacuum), so exactly one branch is ever reachable.
- [ ] **Step 2:** Build `WhatsNextSlot.vue` rendering each variant: guest → `<PathChoiceCards>` (existing, unchanged); checklist → `<ChecklistMirror>` (Task 3); next-step → a compact card with the label and a link; vacuum → the real "Have you made a game before?" question (No / A little / Yes), each answer navigating to the workshop catalog or the Threadbare contribute section respectively.
- [ ] **Step 3:** The vacuum answer has no field to persist to — store it in a plain `ref` for the session and say so with a comment; do not invent a mock-data field for it.
- [ ] **Step 4:** Add i18n keys under `onboarding.whatsNext.*`.
- [ ] **Step 5:** Verify:

```bash
scripts/check-route.sh / "brings you here"
```

(or whatever guest-state string is stable — confirm the exact copy once written).

- [ ] **Step 6:** Commit:

```bash
git add app/composables/useWhatsNext.ts app/components/WhatsNextSlot.vue i18n/
git commit -m "Add the What's Next state machine

New architecture, not an extension -- no prior art for this exists
anywhere in the app or the original design handoff. One slot renders
exactly one of four states in the doc's stated precedence: guest
intent cards, checklist mirror, next scheduled step, or the
post-completion recommendation question."
```

---

### Task 5: VPC gate component

**Files:**
- Create: `app/components/VpcGate.vue`
- Modify: `i18n/locales/en.json`, `i18n/locales/es.json`

**Interfaces:**
- Consumes: `useConsentBoundary()` (Task 1).
- Props: `{ reason: string, exits: { label: string, to: string }[] }` — the "ungated alternatives" the doc requires (play, comment, waitlist).

- [ ] **Step 1:** Build the component following `AuthGuestPrompt.vue`'s in-place-replacement convention (message + CTA row), extended with the exit links row below it.
- [ ] **Step 2:** Add i18n keys under `onboarding.vpcGate.*`.
- [ ] **Step 3:** Commit:

```bash
git add app/components/VpcGate.vue i18n/
git commit -m "Add the VPC gate component for unconsented youth boundary hits

Follows AuthGuestPrompt's convention of replacing the gated control in
place. Ungated exits are a first-class prop, not an afterthought --
Flow 6's requirement is explicitly that the dead end has exits."
```

---

### Task 6: Minimal game pages

**Files:**
- Create: `app/composables/gameData.ts`
- Create: `app/pages/games/[gameId].vue`
- Modify: `i18n/locales/en.json`, `i18n/locales/es.json`

**Interfaces:**
- Produces: `Game`, `games: Game[]`.
- Consumes: `PostCard.vue`'s comment composer pattern, `AuthGuestPrompt`, `VpcGate` (Task 5), `useConsentBoundary()` (Task 1).

- [ ] **Step 1:** Write `gameData.ts` — `Game { id, name, image, description, hasContribute? }`, two seed entries (Threadbare with `hasContribute: true`, one more without).
- [ ] **Step 2:** Build `[gameId].vue`: header (name/image/description), a play placeholder using `ToolDrawer.vue`'s existing iframe-embed pattern, and a comment section reusing `PostCard.vue`'s composer + `AuthGuestPrompt` gate (`canComment="isLoggedIn"`, `signUpTo` with a `next` back to this page's comment box — same mechanism `PostCard` already uses on the feed).
- [ ] **Step 3:** For the game with `hasContribute`, add a "Contribute" section: a stub task list, gated via `useConsentBoundary().check(accountStatus, 'closed', 'github-connect')` (contribution is account-status-gated regardless of cohort, per the matrix) — render `VpcGate` with exits to play/comment/waitlist when gated.
- [ ] **Step 4:** Wire the flow-4 checklist (Task 3) — posting the first comment on a game page checks off that flow's first-win item.
- [ ] **Step 5:** Add i18n keys under `games.*`.
- [ ] **Step 6:** Verify:

```bash
scripts/check-route.sh /games/threadbare "Threadbare"
scripts/check-route.sh /games/threadbare "Contribute"
```

- [ ] **Step 7:** Commit:

```bash
git add app/composables/gameData.ts "app/pages/games/[gameId].vue" i18n/
git commit -m "Add minimal game pages for Flow 4 and Flow 6's entry point

No games library or game page existed anywhere in the app. Built to
the minimum this pass needs: two seed games, a play placeholder reusing
ToolDrawer's existing embed pattern, and a comment wall reusing
PostCard's composer and guest-wall gate verbatim rather than inventing
a second version of either."
```

---

### Task 7: Wiring — index.vue, useAuthIntent, DevPreviewBar

**Files:**
- Modify: `app/pages/index.vue`
- Modify: `app/composables/useAuthIntent.ts`
- Modify: `app/components/DevPreviewBar.vue`

- [ ] **Step 1:** In `useAuthIntent.ts`, add `build: '/games/threadbare#contribute'` (or the resolved anchor/section path from Task 6) to `PATH_DESTINATIONS`, removing the comment noting the path "isn't designed yet."
- [ ] **Step 2:** In `index.vue`, remove the guest `PathChoiceCards` block, the `GettingStartedCard` block, and the "Continue learning" resume card, replacing all three with a single `<WhatsNextSlot />`.
- [ ] **Step 3:** In `DevPreviewBar.vue`, add the `AccountStatus` pill row beside the existing `PreviewState` pills (reusing `PREVIEW_ACCOUNT_STATUSES` from Task 1), and — scoped to whichever page is exercising Flow 2a's join screen — a way to flip the cohort's `type` for that demo without hand-editing mock data (a local toggle is fine; this does not need to be global).
- [ ] **Step 4:** Verify:

```bash
scripts/check-route.sh / "Programs"
```

Then manually cycle every preview-bar combination on `/` and on Flow 2a's join screen.

- [ ] **Step 5:** Commit:

```bash
git add app/pages/index.vue app/composables/useAuthIntent.ts app/components/DevPreviewBar.vue
git commit -m "Wire What's Next, AccountStatus, and the build path into the app

index.vue's guest cards, checklist card, and resume card collapse into
one WhatsNextSlot. The guest 'build' intent card finally has a real
destination. The preview bar gains the AccountStatus axis so every
consent-matrix cell is reachable without editing mock data by hand."
```

---

### Task 8: Full verification pass

**Files:** none — this task only finds and fixes.

- [ ] **Step 1:** Run every route check:

```bash
scripts/check-route.sh / "Programs"
scripts/check-route.sh /games/threadbare "Threadbare"
scripts/check-route.sh /games/threadbare "Contribute"
```

- [ ] **Step 2:** Matrix walk — for each of `restricted` / `young-learner` / `adult` × `closed` / `open`, confirm the `join-open-cohort` gate on Flow 2a's join screen matches the design spec's table exactly (6 combinations, 2 of them N/A for `restricted`).
- [ ] **Step 3:** Cycle all four `WhatsNextSlot` states in order and confirm exactly one renders each time, including the vacuum question actually routing on each of its three answers.
- [ ] **Step 4:** Toggle a checklist item on `ChecklistCard` (program page) and confirm `ChecklistMirror` (home) updates without a reload, and the reverse.
- [ ] **Step 5:** Naming check:

```bash
grep -rin "cohort" i18n/locales/ && echo "VIOLATION" || echo "clean"
```

- [ ] **Step 6:** Read the dev server log for new Vue Router warnings or hydration mismatches.
- [ ] **Step 7:** Production build:

```bash
npm run build
```

- [ ] **Step 8:** Commit any fixes:

```bash
git add -A
git commit -m "Fix issues found in the onboarding-foundations verification pass"
```

Skip if nothing needed fixing.

---

## What this slice does not build

Flows 1a/1b/1c (partner/NDPA join-code entry), Flow 3 (workshop registration), Flow 5 (educator), Flow 6's real GitHub-connect and task-claim mechanics (the `VpcGate` stub only), waitlist lead capture (Flow 2b), the pre-survey (M7), and every "Plan Later" item the source doc itself defers (workshops as independent joinable objects, Loom Lounge, Story Quests, Lore Jam, tutorials-out-of-GitHub, asset library, portfolio pages, domain-filtered recommendations). Each gets its own spec and plan once these foundations exist to build on.
