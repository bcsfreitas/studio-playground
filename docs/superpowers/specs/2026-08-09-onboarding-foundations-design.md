# Onboarding flows — boundary consent model (foundations)

## Context

`docs/brain/onboarding-flows-boundary-consent.md` specifies the onboarding spine for Endless Studios: guest intent capture → commitment-triggered signup wall → personalized checklist → first win = onboarding complete, with consent gated not at signup but at the moment work or identity crosses a boundary out of its cohort.

The full doc is six-plus enrollment flows, a legal consent matrix, an M1–M7 data-moment table, and sixteen prototype screens — too much to build or specify honestly in one pass. **This spec covers foundations only**: the consent data model, a generalized flow-scoped checklist, the "What's Next" state machine, and the two smallest possible proof flows needed to exercise them (Flow 2a, cold arrival joining an open cohort, and Flow 4, commenting on a game). Every other flow in the source doc, and everything it marks "Plan Later," is out of scope here and gets its own spec once these primitives exist to build on.

This mirrors how `docs/superpowers/specs/2026-08-05-program-page-shell-design.md` scoped its own "slice 1" — shared dependencies first, so later slices plug into settled shapes instead of retrofitting them.

### Sequence after this slice

Foundations (this spec) → Flow 1a/1b/1c (partner/NDPA join-code entry) → Flow 5 (educator) → Flow 6 full GitHub-connect path → Flow 3 (workshop registration) → Plan Later unbundling epic.

## Decisions taken

| Decision | Choice |
|---|---|
| Account-status axis | New, orthogonal to `PreviewState` — not folded into it |
| Cohort openness | New `Cohort.type: 'closed' \| 'open'` field, distinct from `ProgramInstance.visibility` |
| Gating logic | Centralized in one composable, `useConsentBoundary()` — no component computes the matrix inline |
| Age-based guardian alert (`signup.vue`) | Unchanged — it already doesn't block, which is the correct shape for a boundary model |
| Checklist scope | Flow-scoped and multi-mount (program page + home mirror), not global |
| "What's Next" | New component/composable, not an extension of any existing widget — confirmed no prior art exists |
| Proof flows | 2a and 4 only, chosen to touch every new primitive with the least net-new surface |
| Games | Minimal `Game` type + 2 seed entries + one dynamic page, reusing `LinkedGame`'s shape |
| Terminology | "cohort" stays a data-model term only, per the existing repo-wide rule (confirmed still enforced: zero hits in `i18n/locales/en.json`) |

## The consent matrix

Source: `onboarding-flows-boundary-consent.md`'s own table. Two independent axes:

- `AccountStatus`: `'restricted' | 'young-learner' | 'adult'` — governs whether *that person's* work/identity is visible outside their cohort.
- `Cohort.type`: `'closed' | 'open'` — governs whether the *container itself* is discoverable.

| Account status | Closed cohort | Open cohort |
|---|---|---|
| `restricted` | Never gated. Work stays in-cohort, no outside visibility ever. | N/A — restricted accounts are institution-locked; open enrollment doesn't apply |
| `young-learner` | Deferred, not gated. Private until a boundary action (portfolio publish, GitHub connect, post-outward) fires `M2b`. | Gated at join (`join-open-cohort` boundary action, `M2a` — legal constraint, before participation) |
| `adult` | Never gated. Public by default; can be kept private as a partner choice, not a legal requirement. | Never gated. Public after cohort-level visibility, no individual consent needed. |

`useConsentBoundary()` takes `(accountStatus, cohortType, action)` where `action` is one of `'join-open-cohort' | 'publish-portfolio' | 'github-connect' | 'post-outward'`, and returns `{ gated: boolean, reason: 'not-required' | 'deferred' | 'pending-vpc' }`. `join-open-cohort` reads both axes; the other three actions gate `young-learner` regardless of `cohortType`, per `M2b`.

## Data model

```ts
// programData/types.ts — Cohort gains one field
export interface Cohort {
  // ...existing fields unchanged
  type: 'closed' | 'open'
}
```

```ts
// programData/consent.ts — new file
export type AccountStatus = 'restricted' | 'young-learner' | 'adult'

export const PREVIEW_ACCOUNT_STATUSES: { id: AccountStatus, label: string }[] = [
  { id: 'restricted', label: 'Restricted (NDPA)' },
  { id: 'young-learner', label: 'Young Learner' },
  { id: 'adult', label: 'Adult' }
]

export type BoundaryAction = 'join-open-cohort' | 'publish-portfolio' | 'github-connect' | 'post-outward'

export function useConsentBoundary() { /* returns a `check(accountStatus, cohortType, action)` function per the matrix above */ }
```

`AccountStatus` storage follows `usePreviewState.ts` exactly: a `useState` keyed by its own localStorage slot, hydrated once, written on every change, wiped by the existing `reset()` alongside the `preview-state` and `program-progress:` keys — one reset clears the whole mock session, both axes.

## Checklist system

Today's `GettingStartedItem[]` / `gettingStartedItemsFor(state)` (`useHomeMockData.ts`) is a single fixed 5-item list keyed only to `PreviewState`, rendered by one component on one page. The doc requires flow-specific items, mounted on two surfaces (program page primary, home mirror), sharing one state so checking an item on either updates both instantly.

```ts
// useOnboardingChecklist.ts — new file
export interface ChecklistItem { id: string, label: string, done: boolean, isFirstWin?: boolean }

export function useOnboardingChecklist(flowId: '2a' | '4', contextId: string) {
  // items + a toggle(itemId) that persists to localStorage under
  // `onboarding-checklist:${flowId}:${contextId}`, same pattern useProgramProgress
  // already uses for per-enrollment state.
}
```

Flow 2a items (`docs/brain/onboarding-flows-boundary-consent.md`, "Flow 2a"): account created (pre-checked) → agree to the code of conduct → introduce yourself to your group → submit your first task to the group feed (first win). Note "cohort" → "group" per the naming rule.

Flow 4 items: account created → agree to the code of conduct → post your first comment (first win).

`GettingStartedCard.vue` splits into two components sharing this composable:
- `ChecklistCard.vue` — the existing conic-gradient-ring + row-list visual, unchanged, now driven by flow items instead of the hardcoded five.
- `ChecklistMirror.vue` — new, compact single-line state ("Explore: Threadbare — 3 of 5 done, next: join your first live session"), linking into the program page rather than duplicating the full list.

## What's Next slot

No prior art anywhere in `app/` or `project/` — this is new architecture, not an extension. Four states, in precedence order, exactly one true at a time:

```ts
// useWhatsNext.ts — new file
type WhatsNextState =
  | { kind: 'guest' }                                            // renders PathChoiceCards
  | { kind: 'checklist', flowId: string, contextId: string }     // renders ChecklistMirror
  | { kind: 'next-step', label: string, to: string }             // "Next: session 3, Tuesday 4pm"
  | { kind: 'vacuum' }                                            // "Have you made a game before?"

export function useWhatsNext(): ComputedRef<WhatsNextState> { /* ... */ }
```

The vacuum state's question ("Have you made a game before?", No / A little / Yes) is built for real, not stubbed — it's the one state with no existing widget to lean on, and skipping it would leave the state machine unproven for 3 of its 4 branches. Answering routes beginners to the workshop catalog and non-beginners to the Threadbare contribute tab (per `M5`); the answer itself has nowhere to persist yet (no profile field exists) so it's read once per session from a local ref, not written to any mock data store — a known, named gap, not an oversight.

`WhatsNextSlot.vue` mounts once on `index.vue`, replacing `PathChoiceCards`, `GettingStartedCard`, and the "Continue learning" resume card in that one slot.

## Consent UI

`VpcGate.vue` — new component for Flow 6's decided requirement: state what's behind the gate, offer the ungated exits (play / comment / waitlist) so the dead end has exits. Follows `AuthGuestPrompt.vue`'s established convention: replaces the gated control in place, not an interstitial overlay.

`signup.vue`'s `needsGuardian` alert is unchanged. It already doesn't block — exactly the right shape, since the boundary model never gates at signup.

## Minimal games

No games library or game page exists in this app at all today (confirmed — no dedicated data module, no page, only a `Play` sidebar stub). Built to the minimum this pass needs:

```ts
// app/composables/gameData.ts — new file
export interface Game {
  id: string
  name: string
  image: string
  description: string
  hasContribute?: boolean   // Threadbare only, for now
}
export const games: Game[] = [ /* Threadbare + one more */ ]
```

`app/pages/games/[gameId].vue` — play placeholder (same iframe-embed pattern `ToolDrawer.vue` already uses on `make/index.vue`, not a new pattern) + a comment section reusing `PostCard.vue`'s existing comment composer and `AuthGuestPrompt` gate verbatim. Threadbare's page additionally gets a "Contribute" section: a stub task list, and `VpcGate.vue` for a gated young learner reached via the guest "build" intent card or Flow 6.

## Wiring

- `useAuthIntent.ts`: `PATH_DESTINATIONS.build` currently absent (falls through to home, per its own comment that the path "isn't designed yet"). Point it at the Threadbare contribute section.
- `DevPreviewBar.vue`: add the `AccountStatus` toggle beside the existing `PreviewState` pills, plus a way to flip the cohort `type` being exercised — every matrix cell needs to be reachable without hand-editing mock data.

## Naming rule

Unchanged from the existing repo convention: "cohort" never appears in learner-facing copy or i18n keys/values. The source doc's own copy ("Introduce yourself to your cohort") is translated through this rule as "your group" — this is not a deviation from the source doc's intent, just from its literal wording, consistent with how the program-page-shell spec handled the same word.

## Component reuse

Survive unchanged or near-unchanged: `PathChoiceCards.vue`, `AuthGuestPrompt.vue`, `useAuthIntent.ts`'s context-survival mechanism, `ProgramEnrollmentCard.vue`, `PostCard.vue`'s comment composer, `ToolDrawer.vue`'s embed pattern, the conic-gradient-ring visual currently in `GettingStartedCard.vue`.

Per `CLAUDE.md`: check the `nuxt-ui` skill before writing markup, `USeparator` not border divs, semantic `color` props only, `UPageCard` as the card primitive.

## Copy and i18n

All new user-facing strings go through `useI18n()`, landing in both `i18n/locales/en.json` and `i18n/locales/es.json` — Spanish values are real translations. New key groups: `onboarding.checklist.*`, `onboarding.whatsNext.*`, `onboarding.vpcGate.*`, `games.*`. No key or value may contain "cohort".

## Known gaps, named rather than papered over

- The vacuum-state answer ("Have you made a game before?") has no profile field to persist to yet — it's session-local. Flagged in the code, not hidden.
- Flow 6's GitHub-connect step is a `VpcGate.vue` stub only; the actual GitHub OAuth/task-claim flow and its instrumentation gap (doc's own ⚑) are out of scope.
- Two seed games is enough to prove the page works, not a games library — Flow 4's "Games Landing page" from the doc's screens list is not built this pass.

## Verification

1. `npm run dev`, then `scripts/check-route.sh` against every new route: `/games/threadbare`, `/games/<second-game-id>`.
2. Preview-bar matrix walk: for each `AccountStatus` × `Cohort.type` pairing, confirm `useConsentBoundary()`'s `join-open-cohort` check matches the table above exactly, on Flow 2a's join screen.
3. Cycle all four `WhatsNextSlot` states (guest → checklist-incomplete → activated → vacuum) and confirm exactly one renders each time.
4. Toggle a checklist item from `ChecklistCard` on the program page; confirm `ChecklistMirror` on home reflects it without a reload, and vice versa.
5. `grep -rin "cohort" i18n/locales/` stays clean.
6. `npm run build` completes with no errors.
