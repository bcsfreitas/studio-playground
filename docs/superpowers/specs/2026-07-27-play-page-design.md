# Play page design

## Purpose

Build `/play`, the programs catalog. Learners browse cohort-based programs, see progress on ones they're already enrolled in, and filter/search to find new ones.

## Scope

Listing page only: a 2-column grid of program cards plus filter/search. No program detail page in this pass — cards are visually clickable (matches how other mock CTAs in this app, e.g. "Resume learning", already behave) but don't need to navigate anywhere yet.

## Domain model

Programs run in cohorts ("waves"): learners enroll, the cohort runs from a start date to an end date, then the next cohort starts. A program can have multiple cohorts, and cohorts across different programs can overlap in time.

New composable `app/composables/usePlayMockData.ts`:

```ts
export type ProgramLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type ProgramCategory = 'Game Design' | 'Art' | 'Programming' | 'Audio' | 'Business'
export type CohortStatus = 'upcoming' | 'active' | 'completed'

export interface Cohort {
  id: string
  startDate: string   // display-ready, e.g. 'Aug 4' — same style as upcomingEvents in useHomeMockData
  endDate: string     // e.g. 'Sep 26'
  seatsTaken: number
  seatsTotal: number
  status: CohortStatus
}

export interface Program {
  id: string
  name: string
  description: string
  image: string
  category: ProgramCategory
  level: ProgramLevel
  cohorts: Cohort[]   // 1+, can overlap; multiple = the program runs in waves
}

export interface Enrollment {
  programId: string
  cohortId: string
  progress: number // 0-100
}
```

Enrollment is separate from `Program` and keyed by the existing preview state (`active` / `new` / `guest`), the same way `weekCellsFor(isActive)` already works in `useHomeMockData.ts`:

```ts
export const enrollmentsByPreviewState: Record<PreviewState, Enrollment[]>
```

- `active`: ~2 enrollments. One of them is "Intro to Game Design" at 42% progress, matching the hero card already on Home, so the two pages agree.
- `new` / `guest`: empty array — nothing enrolled, browse-only.

Mock data: ~8 programs spanning all 5 categories and all 3 levels. At least one program has 2 cohorts (one active, one upcoming) to demonstrate the wave/overlap concept in the underlying data, even though the card only ever surfaces one relevant cohort (see below).

## Viewer status (per program, per card)

A single derived status drives both the card's badge and the status filter facet:

`'enrolled' | 'upcoming' | 'open' | 'completed'`

Computed from (is the current preview-state persona enrolled in this program?, do its cohorts have anything upcoming/active and joinable?):

- **enrolled** — learner has an enrollment row for this program. Card shows the progress bar (from `Enrollment.progress`), not a cohort date range.
- **upcoming** — not enrolled; the program's next cohort hasn't started yet (regardless of seat count). Card shows "Enrolling now" + the cohort's start date.
- **open** — not enrolled; a cohort is currently active (regardless of seat count). Card shows "Open to join" + the cohort's end date.
- **completed** — not enrolled; every cohort has already ended (none upcoming or active).

Status is entirely about timing (has a cohort started/ended?), never about seat count. Seat fullness ("18/24 enrolled" vs "Full") is independent secondary text shown alongside the `upcoming`/`open` badge — a cohort can be full and still be `upcoming` or `open`.

**Sort order:** enrolled → upcoming → open → completed, alphabetical by name within each tier. This satisfies "enrolled programs are presented first, with the progress bar."

## Page structure

`app/pages/play.vue`, `definePageMeta({ layout: 'dashboard' })` — same shape as `index.vue`:

- `UDashboardPanel`, `#header` slot renders `AppTopbar` only when the active-learner preview state is on (identical condition to Home).
- `#body`: a page heading ("Play"), a filter/search row, then the 2-column card grid.

Filter/search row: a `UInput` (search icon, matches by program name/description) plus three `USelect` dropdowns (category, level, status), each with an "All" default option. All four are independent, client-side, computed filters over the mock program list — no routing/query-param sync in this pass.

## Card component

Extend `ProgramTile.vue` (it's already ~90% of what's needed: image, title, description, status badge) rather than creating a second near-duplicate component:

- Add an optional progress bar (reuse the `UProgress` + percentage-label pattern from the Home hero card) shown only when `status === 'enrolled'`.
- Add a cohort line (dates and/or seat count depending on status, per the rules above).
- Badge color follows a typed `STATUS_COLOR`-style lookup (the existing convention from `TaskTile.vue`), not inline conditionals: enrolled → primary, upcoming → info, open → secondary, completed → neutral.
- Category/level continue to render as the existing soft badge style already used elsewhere on `ProgramTile`.

## Preview-switcher change (consequence of sharing state across pages)

The Active/New/Guest preview state currently lives as a local `ref` inside `index.vue`. Since `/play` now needs to read the same state, it moves to a shared composable:

```ts
// app/composables/usePreviewState.ts
export function usePreviewState() {
  const state = useState<PreviewState>('previewState', () => 'active')
  return {
    state,
    isActive: computed(() => state.value === 'active'),
    isNew: computed(() => state.value === 'new'),
    isGuest: computed(() => state.value === 'guest'),
    isLoggedIn: computed(() => state.value !== 'guest')
  }
}
```

The "PREVIEW AS" switcher UI itself moves out of `index.vue` and into `app/layouts/dashboard.vue` (so it's present on every page using that layout), and is repositioned from bottom-center to bottom-right of the screen, per explicit request.

`index.vue` is updated to consume `usePreviewState()` instead of its local `ref` + computeds; no visual change to Home itself beyond the switcher relocating.

## Out of scope

- Program detail page / routing from cards.
- Persisting filter selections (URL query params, localStorage).
- Real enrollment actions (joining a cohort, waitlisting when full) — this is still a mock-data prototype, consistent with the rest of the app.
- Editing/managing cohorts (that's the existing sidebar's Admin section, unrelated to this page).
