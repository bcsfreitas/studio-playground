# Program Page Shell & Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the invented program catalog with the four real Knowledge Base programs, and turn the single-scroll program page into a tabbed shell with real nested routes.

**Architecture:** `useProgramMockData.ts` splits into a `programData/` directory of focused modules, re-exported through the original file so no import in the app changes. `[programId].vue` becomes a parent route holding the program header, tab nav, and `<NuxtPage>`; each tab is its own page file. Slice 1 builds the Overview tab fully and stubs the rest.

**Tech Stack:** Nuxt 4.5, Vue 3.5, Nuxt UI v4, Tailwind v4, `@nuxtjs/i18n` v10, TypeScript.

## Verification approach — read this first

**This repo has no test runner.** `package.json` has no `test` or `typecheck` script, and no vitest/vue-tsc dependency. Adding one is out of scope for this slice.

So the test cycle in every task below is a **route assertion against the running dev server**, using the helper built in Task 1, plus **Storybook stories** for components (the repo already uses `*.stories.ts`). The rhythm is unchanged — write the check, watch it fail, implement, watch it pass, commit.

Start the dev server once before Task 2 and leave it running; Vite HMR picks up every change:

```bash
npm run dev
```

If a check fails for reasons unrelated to your change, look at the dev server output before assuming the assertion is wrong.

## Global Constraints

These apply to every task. Copied from `docs/superpowers/specs/2026-08-05-program-page-shell-design.md`.

- **Never use the word "cohort" in learner-facing copy or in any i18n key or value.** Use "live session" or "your group". `Cohort` stays a data-model term only.
- Every user-facing string goes through `useI18n()` and exists in **both** `i18n/locales/en.json` and `i18n/locales/es.json`. Spanish values are real translations, not copies of the English.
- Check the `nuxt-ui` skill for a component's API before writing markup. Never hand-roll what Nuxt UI provides. Use `USeparator`, not border divs.
- Follow `DESIGN.md`: semantic `color` props only (never raw palette names), `UPageCard` as the card primitive, `border-default` hairline before any shadow.
- Every field with no basis in the source docs carries a `// SYNTHESIZED:` comment naming what was invented and why.
- Comments explain **why**, never **what** (`CLAUDE.md`).
- Commit messages: no AI trailers, no `Co-Authored-By`.
- Route slugs are exactly: `core-threadbare`, `explore-threadbare`, `explore-godot`, `educator-training`.

### Source documents

All program content comes from these files. Do not invent teaching content.

| Program | Curriculum | Sessions |
|---|---|---|
| Core: Threadbare | `docs/brain/Knowledge Base/Programs/Core-Threadbare/curriculum.md` | `.../Core-Threadbare/sessions.md` |
| Explore: Threadbare | `.../Explore-Threadbare/curriculum.md` | `.../Explore-Threadbare/sessions.md` |
| Explore: Godot | `.../Explore-Godot/curriculum.md` | `.../Explore-Godot/sessions.md` |
| Educator Training | `.../Educator-Training-Program/curriculum.md` | `.../Educator-Training-Program/sessions.md` |

Portfolio-level facts (graduate counts, NDPA status, microcredential names): `docs/brain/Knowledge Base/02-programs-and-offerings.md`.

---

### Task 1: Route-check helper

The verification tool every later task uses. Build it first so no task has to hand-roll curl.

**Files:**
- Create: `scripts/check-route.sh`

**Interfaces:**
- Produces: `scripts/check-route.sh <path> <expected-substring>` — exit 0 if the route returns HTTP 200 and its HTML contains the substring; exit 1 with a diagnostic otherwise.

- [ ] **Step 1: Write the script**

```bash
#!/usr/bin/env bash
# Smoke-check a route against the running dev server.
#
# The repo has no test runner, so route assertions are how plan tasks verify
# their work. Checks status and body together because Nuxt renders a 200 for
# a page that threw during setup — status alone proves nothing.
#
# Usage: scripts/check-route.sh /learn/explore-godot "Explore: Godot"
set -uo pipefail

BASE="${BASE_URL:-http://localhost:3000}"
path="${1:?usage: check-route.sh <path> <expected-substring>}"
expected="${2:?usage: check-route.sh <path> <expected-substring>}"

body="$(mktemp)"
trap 'rm -f "$body"' EXIT

status="$(curl -sS -o "$body" -w '%{http_code}' "$BASE$path")" || {
  echo "FAIL $path — could not reach $BASE (is 'npm run dev' running?)"
  exit 1
}

if [ "$status" != "200" ]; then
  echo "FAIL $path — HTTP $status (expected 200)"
  exit 1
fi

if ! grep -qF -- "$expected" "$body"; then
  echo "FAIL $path — HTTP 200 but body is missing: $expected"
  exit 1
fi

echo "PASS $path — 200, found: $expected"
```

- [ ] **Step 2: Make it executable and confirm it fails on a route that does not exist yet**

```bash
chmod +x scripts/check-route.sh
scripts/check-route.sh /learn/explore-godot "Explore: Godot"
```

Expected: `FAIL /learn/explore-godot` — the program does not exist yet. If the dev server is not running you get the "could not reach" message instead; start it and re-run.

- [ ] **Step 3: Confirm it passes on a route that does exist**

```bash
scripts/check-route.sh /learn "Programs"
```

Expected: `PASS /learn`.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-route.sh
git commit -m "Add route-check helper for manual verification

The repo has no test runner, so plan tasks verify their work by asserting
against the running dev server. Checks status and body together because
Nuxt still returns 200 for a page that threw during setup."
```

---

### Task 2: Data types

Every later data task depends on these. No behaviour yet, so the check is that the app still compiles and renders.

**Files:**
- Create: `app/composables/programData/types.ts`

**Interfaces:**
- Produces: all types below, imported by Tasks 3–6.

- [ ] **Step 1: Create the types module**

Move every `export type` / `export interface` currently in `app/composables/useProgramMockData.ts:1-117` into the new file verbatim, then apply these additions and changes:

```ts
import type { PreviewState } from '~/composables/useHomeMockData'

// Learner-facing lifecycle. Drives which tabs render and what the first tab
// shows — see docs/superpowers/specs/2026-08-05-program-page-shell-design.md.
export type LearnerPhase = 'interested' | 'enrolled' | 'completed' | 'game-owner'

// Explore: Threadbare is explicitly not a cohort — its curriculum.md:5 says to
// present the 13 workshops as individually joinable sessions with their own
// dates, not as one date range. The enrollment card branches on this.
export type EnrollmentModel = 'cohort' | 'workshop-series'

export type InstanceVisibility = 'public' | 'private'

export interface ProgramSession {
  id: string
  index: number
  title: string
  drivingQuestion?: string
  startsAt: string        // ISO 8601
  durationMinutes: number
}

export interface MicrocredentialCriterion {
  id: string
  label: string
}
```

Then extend the existing interfaces:

```ts
export interface Microcredential {
  id: string
  name: string
  issuer: string
  criteria: MicrocredentialCriterion[]
}

export interface Cohort {
  id: string
  instanceId: string
  // A human group name ("Night Owls"), never "Cohort 3" — the word "cohort" is
  // a data-model term and must not reach learner-facing copy.
  name: string
  startDate: string | null
  endDate: string | null
  maxLearners: number | null
  seatsTaken: number
  accessCode?: string
}

export interface ProgramInstance {
  id: string
  programId: string
  enrollmentModel: EnrollmentModel
  visibility: InstanceVisibility
  scheduleLabel: string
  mentors: string[]
  sessions: ProgramSession[]
  deliveringInstitution?: DeliveringInstitution
  cohorts: Cohort[]
}

export interface EnrollmentRecord {
  learnerId: PreviewState
  programId: string
  instanceId: string
  cohortId: string
  phase: LearnerPhase
  progress: number
  enrolledAt: string
}
```

And add one field to `ProgramTemplate`, keeping every existing field:

```ts
  // Real figures from 02-programs-and-offerings.md where the doc states one.
  graduateCount: number
```

- [ ] **Step 2: Verify the app still renders**

```bash
scripts/check-route.sh /learn "Programs"
```

Expected: PASS. Nothing imports the new file yet, so this only proves you did not break the existing module.

- [ ] **Step 3: Commit**

```bash
git add app/composables/programData/types.ts
git commit -m "Extract program data types into their own module

First step of splitting useProgramMockData.ts, which is 1180 lines and
about to roughly double. Adds the types the tabbed shell needs: learner
phase, the two enrollment models, session schedules, and microcredential
criteria."
```

---

### Task 3: Credentials and curriculum data

**Files:**
- Create: `app/composables/programData/credentials.ts`
- Create: `app/composables/programData/curriculum.ts`

**Interfaces:**
- Consumes: types from Task 2.
- Produces: `microcredentials: Record<string, Microcredential>`, `curriculumByProgram: Record<string, CurriculumModule[]>`.

- [ ] **Step 1: Write credentials.ts**

`02-programs-and-offerings.md:8,14` gives the two microcredential names and their criteria **counts** (7 and 3) but no criteria text, so the labels are synthesized.

```ts
import type { Microcredential } from './types'

// Learners earn eligibility on this platform but claim the credential on ASU's
// external issuer site — never promise in-platform issuance in copy.
const ASU = 'Arizona State University'

// SYNTHESIZED: 02-programs-and-offerings.md gives each microcredential's name
// and criteria count (7 and 3) but no criteria text. Labels below are written
// to match the counts and the programs' stated outcomes; replace when the real
// criteria arrive.
export const microcredentials: Record<string, Microcredential> = {
  'community-game-making': {
    id: 'community-game-making',
    name: 'Community Game Making',
    issuer: ASU,
    criteria: [
      { id: 'cgm-1', label: 'Communicate a game idea others can understand and build on' },
      { id: 'cgm-2', label: 'Build a playable StoryQuest prototype in Godot' },
      { id: 'cgm-3', label: 'Use version control to track and share your work' },
      { id: 'cgm-4', label: 'Submit your work upstream through a pull request' },
      { id: 'cgm-5', label: 'Run a playtest and gather feedback from players' },
      { id: 'cgm-6', label: 'Refine your game in response to that feedback' },
      { id: 'cgm-7', label: 'Present and pitch your finished StoryQuest' }
    ]
  },
  'intro-game-making': {
    id: 'intro-game-making',
    name: 'Intro to Game Making',
    issuer: ASU,
    criteria: [
      { id: 'igm-1', label: 'Identify the elements that make a game a game' },
      { id: 'igm-2', label: 'Modify an existing game project using industry tools' },
      { id: 'igm-3', label: 'Share what you made and explain the choices behind it' }
    ]
  }
}
```

- [ ] **Step 2: Write curriculum.ts**

One `CurriculumModule` per milestone (Core: Threadbare), per discipline (Explore: Threadbare), or per session group (Explore: Godot, Educator Training). Every module ends with a `deliverable` item.

XP by item type — declare these once at the top and use them everywhere:

```ts
import type { CurriculumModule } from './types'

// XP has no source in the Knowledge Base docs.
// SYNTHESIZED: flat per-type values so totals stay predictable across programs.
const XP = { topic: 25, survey: 15, resource: 10, task: 50, deliverable: 200 } as const
```

Extraction rules — follow these for every program rather than improvising:

1. Session/workshop titles come **verbatim** from the source `curriculum.md` session map.
2. `drivingQuestion` comes from the "Driving question:" line where the source has one; omit the field where it does not.
3. Each session becomes one `topic` item. A session whose source shows a Self-Check becomes an extra `survey` item.
4. Named-but-unlinked resources in the source become `resource` items.
5. Each module gets one closing `deliverable` item.

Worked example — Explore: Godot, from `Explore-Godot/curriculum.md:15-24`. Follow this shape for the rest:

```ts
export const curriculumByProgram: Record<string, CurriculumModule[]> = {
  'explore-godot': [
    {
      id: 'mod-eg-1',
      title: 'Getting into Godot',
      description: 'Why we play and mod games, and getting the tools running.',
      items: [
        {
          id: 'item-eg-1',
          type: 'topic',
          title: 'Why do we play games? Why do we mod them?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-1-check',
          type: 'survey',
          title: 'Session 1 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-eg-2',
          type: 'topic',
          title: 'Should game makers also be game players?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-2-check',
          type: 'survey',
          title: 'Session 2 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: the Explore source material has no per-module
          // deliverable. Added because the platform's module model requires
          // one; acceptance criteria mirror the generic checklist.
          id: 'item-eg-1-deliverable',
          type: 'deliverable',
          title: 'Share your modded Pong',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            'Your modified Pong project is shared as a screenshot, short video, or playable build.',
            'The submission explains what you changed and why.',
            'The game still runs without errors.'
          ]
        }
      ]
    }
    // ...remaining modules for explore-godot, then the other three programs,
    // all following the five extraction rules above.
  ]
}
```

**Core: Threadbare caveat.** `Core-Threadbare/curriculum.md:9` warns that milestones 1–3 extracted thinly because those decks are visually driven. Build those modules from the session titles that exist and stop there. Do not invent activities to pad them.

- [ ] **Step 3: Verify nothing broke**

```bash
scripts/check-route.sh /learn "Programs"
```

Expected: PASS. Still unwired.

- [ ] **Step 4: Commit**

```bash
git add app/composables/programData/credentials.ts app/composables/programData/curriculum.ts
git commit -m "Add curriculum and microcredential data from the Knowledge Base

Curriculum content is extracted from the program docs under
docs/brain/Knowledge Base/Programs -- session titles and driving questions
verbatim, one module per milestone or discipline. XP values, module
deliverables, and microcredential criteria text have no source and are
marked SYNTHESIZED where they appear."
```

---

### Task 4: Templates and instances

**Files:**
- Create: `app/composables/programData/templates.ts`
- Create: `app/composables/programData/instances.ts`

**Interfaces:**
- Consumes: `curriculumByProgram` (Task 3), `microcredentials` (Task 3), types (Task 2).
- Produces: `programTemplates: ProgramTemplate[]`, `programInstances: ProgramInstance[]`.

- [ ] **Step 1: Write templates.ts**

Four templates, replacing all invented ones. Facts sourced as noted:

| Slug | Title | Tier | graduateCount | Source |
|---|---|---|---|---|
| `core-threadbare` | Core: Threadbare | Core | 575 | `02-programs-and-offerings.md:8` — "~575 contributed in 2025" |
| `explore-threadbare` | Explore: Threadbare | Explore | 0 | no figure stated; NDPA-compatible per line 11 |
| `explore-godot` | Explore: Godot | Explore | 30 | line 12 — "68 enrolled / 30 participated" |
| `educator-training` | Educator Training Program | More | 0 | facilitator-facing, no figure stated |

Keep every existing `ProgramTemplate` field populated. Reuse the existing `ENDLESS_STUDIOS` constant. Wire `curriculum: curriculumByProgram['<slug>']` and `certificate.microcredentials: [microcredentials['community-game-making']]` for Core, `['intro-game-making']` for both Explore programs, and `[]` for Educator Training.

Existing images under `public/images/img/` are reused — do not add assets.

- [ ] **Step 2: Write instances.ts**

Explore: Godot's real window is the one dated fact available (`02-programs-and-offerings.md:12`):

```ts
// Explore: Godot's first Endless-led online cohort, the one real schedule in
// the source docs (02-programs-and-offerings.md:12): May 12 - June 11 2026,
// Tue/Thu, 68 enrolled / 30 participated.
//
// Session length conflict, resolved deliberately: that same line says 90 min,
// but Explore-Godot/curriculum.md:3 says "Ten sessions, 60 minutes each".
// Using 60 — the curriculum doc sits closer to the source decks.
```

Cover all four card states across the catalog, so the enrollment card can be exercised without editing data:

| Program | Instances | Card state it exercises |
|---|---|---|
| `explore-godot` | 3 public cohort instances | many — the dropdown picker |
| `core-threadbare` | 1 `private` cohort instance with `accessCode` | single, collapsed, plus the access-code path |
| `explore-threadbare` | 1 `workshop-series` instance, 13 sessions | per-workshop dates instead of a range |
| `educator-training` | **zero** instances | the notify-me email capture |

All five card states are reachable across the four programs with no extra fixtures. The assignment is also true to the source material: Core: Threadbare runs at partner sites and commissioned institutions, which is exactly the private case, and Educator Training has no open learner enrollment.

Cohort names are group names — "Night Owls", "Studio B", "Dawn Patrol". Never "Cohort 1".

Generate `sessions` from each cohort's start date and cadence:

```ts
// SYNTHESIZED: only Explore: Godot has real dates. Other schedules are
// generated from each program's stated cadence so the schedule UI has
// something to render.
```

- [ ] **Step 3: Verify nothing broke**

```bash
scripts/check-route.sh /learn "Programs"
```

Expected: PASS — the barrel still exports the old data until Task 5.

- [ ] **Step 4: Commit**

```bash
git add app/composables/programData/templates.ts app/composables/programData/instances.ts
git commit -m "Add the four real program templates and their instances

Replaces the invented catalog with Core: Threadbare, Explore: Threadbare,
Explore: Godot, and the Educator Training Program, built from the
Knowledge Base docs. Instances deliberately cover every enrollment-card
state: many, one, workshop-series, private with an access code.

Records the Explore: Godot session-length conflict between the two source
docs and which one won."
```

---

### Task 5: Enrollments, barrel, and catalog cutover

The switch-on task. After this the app renders the new catalog.

**Files:**
- Create: `app/composables/programData/enrollments.ts`
- Modify: `app/composables/useProgramMockData.ts` (becomes a re-export barrel)
- Modify: `app/composables/useLearnMockData.ts:13-25`

**Interfaces:**
- Consumes: everything from Tasks 2–4.
- Produces: `enrollmentsByPreviewState`, and the unchanged public surface of `useProgramMockData` — `programTemplates`, `programInstances`, `cohortStatusFor`, `cohortHasStarted`, plus all types.

- [ ] **Step 1: Write enrollments.ts**

One record per learner phase, each pointing at a real instance and cohort id from Task 4.

**Key this by `LearnerPhase`, not by `PreviewState`** — the two are different axes and conflating them is how the old data got confusing. `PreviewState` (`new` / `active` / `guest`) stays exactly as it is and keeps driving the home page; it is not extended.

```ts
export const enrollmentsByPhase: Record<LearnerPhase, EnrollmentRecord[]> = { /* ... */ }
```

Keep `enrollmentsByPreviewState` as a deprecated alias re-exporting the same data, so `[programId].vue:19` keeps working until Task 7 rewrites it. Delete the alias in Task 7.

- [ ] **Step 2: Turn useProgramMockData.ts into a barrel**

Delete the moved data and types. Keep the helper functions that already live there (`cohortStatusFor`, `cohortHasStarted`, and the instance lookup at the end of the current file) — they are behaviour, not data. Re-export everything:

```ts
export * from './programData/types'
export * from './programData/credentials'
export * from './programData/curriculum'
export * from './programData/templates'
export * from './programData/instances'
export * from './programData/enrollments'
```

Every existing import across the app keeps working unchanged. Verify with:

```bash
grep -rn "useProgramMockData" app/ --include=*.vue --include=*.ts
```

- [ ] **Step 3: Update useLearnMockData.ts**

Replace all 11 `learnPrograms` entries with the four real slugs. Keep `cohortTimingOf` and `formatCohortRange` exactly as they are — `ProgramEnrollmentCard` imports `formatCohortRange`.

- [ ] **Step 4: Verify the cutover, and that nothing that referenced the old IDs is left**

```bash
scripts/check-route.sh /learn "Explore: Godot"
scripts/check-route.sh / "Programs"
scripts/check-route.sh /learn/explore-godot "Explore: Godot"
grep -rn "intro-game-design\|pixel-art-foundations\|ship-your-first-game" app/ && echo "STALE IDS REMAIN" || echo "clean"
```

Expected: three PASS lines and `clean`. The `/learn/explore-godot` check is the first one that proves the new catalog is live.

- [ ] **Step 5: Commit**

```bash
git add app/composables/
git commit -m "Switch the catalog over to the four real programs

useProgramMockData.ts becomes a re-export barrel over programData/, so no
import anywhere in the app changes. The learn catalog now lists four real
programs instead of eleven invented ones."
```

---

### Task 6: Learner phase and the dev preview bar

**Files:**
- Create: `app/components/DevPreviewBar.vue`
- Create: `app/components/DevPreviewBar.stories.ts`
- Modify: `app/pages/learn/[programId].vue:116-139` (remove the inlined pill)

`useHomeMockData.ts` is **not** touched. `PreviewState` keeps its three values and its job on the home page; `LearnerPhase` is a separate axis that lives in `programData/types.ts`.

**Interfaces:**
- Consumes: `LearnerPhase` (Task 2).
- Produces: `<DevPreviewBar v-model="phase" />` emitting `update:modelValue` with a `LearnerPhase`.

- [ ] **Step 1: Write the Storybook story first**

```ts
import type { Meta, StoryObj } from '@nuxtjs/storybook'
import DevPreviewBar from './DevPreviewBar.vue'

const meta: Meta<typeof DevPreviewBar> = {
  title: 'Dev/DevPreviewBar',
  component: DevPreviewBar
}
export default meta

export const Interested: StoryObj<typeof DevPreviewBar> = {
  args: { modelValue: 'interested' }
}

export const Enrolled: StoryObj<typeof DevPreviewBar> = {
  args: { modelValue: 'enrolled' }
}
```

Match the meta/story shape used by the existing `app/components/AppTopbar.stories.ts` — read it first rather than trusting the sketch above.

- [ ] **Step 2: Run Storybook and confirm the story fails**

```bash
npm run storybook
```

Expected: the story errors — `DevPreviewBar.vue` does not exist.

- [ ] **Step 3: Build the component**

Move the pill markup from `[programId].vue:116-139` verbatim, then swap the three preview states for the four `LearnerPhase` values with labels "Interested", "Enrolled", "Completed", "Game Owner". Keep the `ULocaleSelect` alongside it. Keep the dev-only comment — `DESIGN.md:222` requires this stay marked as scaffolding.

- [ ] **Step 4: Confirm the story renders, then confirm the page still works**

```bash
scripts/check-route.sh /learn/explore-godot "Explore: Godot"
```

Expected: PASS, and both Storybook stories render.

- [ ] **Step 5: Commit**

```bash
git add app/components/DevPreviewBar.vue app/components/DevPreviewBar.stories.ts "app/pages/learn/[programId].vue"
git commit -m "Extract the preview switcher into DevPreviewBar

Every tab needs the phase switcher now, so it moves out of the program
page into its own component and gains the four learner phases. Still
dev-only scaffolding, as DESIGN.md requires."
```

---

### Task 7: Tabbed route shell

The structural change. After this, tabs are real URLs.

**Files:**
- Modify: `app/pages/learn/[programId].vue` (becomes the parent shell)
- Create: `app/pages/learn/[programId]/index.vue`
- Create: `app/pages/learn/[programId]/about.vue`
- Create: `app/pages/learn/[programId]/community.vue`
- Create: `app/pages/learn/[programId]/projects.vue`
- Create: `app/pages/learn/[programId]/resources.vue`
- Rename: `app/pages/learn/[programId]/program.vue` → `app/pages/learn/[programId]/classroom.vue`
- Create: `app/middleware/` redirect or a `definePageMeta` alias for the old `/program` URL
- Modify: `i18n/locales/en.json`, `i18n/locales/es.json`
- Modify: `app/components/ProgramEnrollmentCard.vue:143,161` (the two `/program` links)

**Interfaces:**
- Consumes: `DevPreviewBar` (Task 6), `programTemplates` (Task 5).
- Produces: `useProgramPhase()` — a composable returning the current `LearnerPhase` ref, provided by the shell and injected by each tab page.

- [ ] **Step 1: Write the failing route checks**

```bash
scripts/check-route.sh /learn/explore-godot/community "Community"
scripts/check-route.sh /learn/explore-godot/projects "Projects"
```

Expected: both FAIL — the routes do not exist.

- [ ] **Step 2: Add the i18n tab keys to both locale files**

Under `program.tabs`: `overview`, `home`, `about`, `community`, `classroom`, `projects`, `resources`. **No key or value may contain "cohort".**

- [ ] **Step 3: Convert the parent to a shell**

`[programId].vue` keeps its `UDashboardPanel`, `AppTopbar`, and not-found branch. It drops all the Overview sections (those move to `index.vue` in Task 8) and gains:

- the program header — full hero on the index route only, compact title bar elsewhere, keyed off `route.name`
- `UTabs` in `link` mode driving `NuxtLink` navigation, filtered by phase
- `<NuxtPage />` for the active tab
- `<DevPreviewBar v-model="phase" />`
- `provide()` of the phase ref, consumed via a small `useProgramPhase()` composable

Tab visibility:

```ts
// Learner-only tabs are absent from the nav entirely for non-enrolled
// visitors, not disabled — a locked tab you cannot open is noise.
const isEnrolled = computed(() => phase.value !== 'interested')
```

`interested` → Overview, Community, Projects. Everything else → Home, About, Community, Classroom, Projects, Resources.

- [ ] **Step 4: Create the four stub tabs and move the classroom**

`community.vue`, `projects.vue`, `resources.vue`, `about.vue` each render a `UContainer` with the tab's translated heading and one line saying the tab is not built yet. Use `SectionTitle` for the heading so the stubs match the app.

`git mv` `program.vue` to `classroom.vue` — no content changes, that rework is a later slice. Add `definePageMeta({ alias: ['/learn/:programId()/program'] })` so old links resolve, and update the two `/program` links in `ProgramEnrollmentCard.vue`.

- [ ] **Step 5: Run the checks**

```bash
scripts/check-route.sh /learn/explore-godot/community "Community"
scripts/check-route.sh /learn/explore-godot/projects "Projects"
scripts/check-route.sh /learn/explore-godot/classroom "Explore: Godot"
scripts/check-route.sh /learn/explore-godot/program "Explore: Godot"
```

Expected: four PASS. Then check the dev server output for Vue Router warnings — the nested-route change is exactly where they would appear.

- [ ] **Step 6: Commit**

```bash
git add app/pages/ app/composables/ i18n/ app/components/ProgramEnrollmentCard.vue
git commit -m "Turn the program page into a tabbed shell with nested routes

[programId].vue becomes the parent -- header, tabs, and <NuxtPage> -- with
each tab its own page file. Tabs are real URLs, so they deep-link and the
back button works between them.

Classroom is the old program.vue moved unchanged; its rework is a later
slice. The old /program URL stays alive as a route alias. Community,
Projects, Resources, and About are stubs for now."
```

---

### Task 8: Overview tab

**Files:**
- Create/complete: `app/pages/learn/[programId]/index.vue`

**Interfaces:**
- Consumes: `useProgramPhase()` (Task 7), `programTemplates`/`programInstances` (Task 5).

- [ ] **Step 1: Write the failing check**

```bash
scripts/check-route.sh /learn/explore-godot "What Learners Say"
```

Expected: FAIL.

- [ ] **Step 2: Move the Overview sections in**

Take the section stack from the pre-Task-7 `[programId].vue` — `ProgramFactsStrip`, curriculum accordion, tools, prerequisites, social proof, certificate showcase — plus the two-column grid with the sticky right rail (`sticky top-6`, 324px). All those components already exist and need no changes.

When phase is not `interested`, this route renders the Home dashboard instead — out of scope here, so render the same Overview content for now with a `// Home dashboard lands in the next slice` comment. `about.vue` from Task 7 stays a stub until then.

- [ ] **Step 3: Run the checks**

```bash
scripts/check-route.sh /learn/explore-godot "What Learners Say"
scripts/check-route.sh /learn/core-threadbare "Community Game Making"
```

Expected: both PASS. The second proves the microcredential data is wired through.

- [ ] **Step 4: Commit**

```bash
git add "app/pages/learn/[programId]/index.vue"
git commit -m "Move the Overview sections onto the index tab

Same section stack and sticky right rail as before the shell change, now
living on its own route instead of in the parent."
```

---

### Task 9: Enrollment card rework

**Modification, not a rewrite.** `ProgramEnrollmentCard.vue` already implements the access-code flow, the enroll modal, and the status logic. Keep all of it.

**Files:**
- Modify: `app/components/ProgramEnrollmentCard.vue`
- Create: `app/components/ProgramEnrollmentCard.stories.ts`
- Modify: `i18n/locales/en.json`, `i18n/locales/es.json`

**Interfaces:**
- Consumes: `ProgramInstance.enrollmentModel|sessions|scheduleLabel|mentors` (Task 2/4).

- [ ] **Step 1: Write stories for the four states first**

`ManyInstances`, `SingleInstance`, `NoInstances`, `WorkshopSeries` — each passing a fixture matching the real data from Task 4.

- [ ] **Step 2: Run Storybook, confirm `NoInstances` and `WorkshopSeries` fail**

Expected: those two render wrong or error — neither state exists yet.

- [ ] **Step 3: Make the four changes**

1. **`URadioGroup` → `USelectMenu`** at line 120. Same `cohortItems` computed feeds it; the detail list moves below the menu.
2. **Detail list** under the picker: schedule, session count and length, seats remaining, mentor. Reuse `formatCohortRange` from `useLearnMockData`.
3. **Zero-instance state** — when `props.instance` is undefined or has no cohorts, the body becomes a `UInput` + button email capture. Not wired to anything; add a comment saying so.
4. **`workshop-series` branch** — list individual sessions with their own dates rather than a range, and switch the CTA label to the workshop wording.

New i18n keys under `program.enroll.*`. **No key or value may contain "cohort"** — note the existing `program.enrollment.cohortDescription.*` keys violate this; rename them as part of this task and update every reference.

- [ ] **Step 4: Confirm all four stories render, then check the live states**

```bash
scripts/check-route.sh /learn/explore-godot "Enroll"
scripts/check-route.sh /learn/explore-threadbare "workshop"
grep -rin "cohort" i18n/locales/en.json && echo "NAMING RULE VIOLATED" || echo "clean"
```

Expected: two PASS and `clean`.

- [ ] **Step 5: Commit**

```bash
git add app/components/ProgramEnrollmentCard.vue app/components/ProgramEnrollmentCard.stories.ts i18n/
git commit -m "Rework the enrollment card around a dropdown picker

Swaps the radio group for a select menu with a detail summary, adds the
no-instances email capture, and handles workshop-series programs by
listing individual workshop dates instead of a range.

Renames the enrollment i18n keys that used 'cohort' -- that word is a
data-model term and must not appear in learner-facing copy."
```

---

### Task 10: Full verification pass

**Files:** none — this task only finds and fixes.

- [ ] **Step 1: Run every route check**

```bash
for slug in core-threadbare explore-threadbare explore-godot educator-training; do
  scripts/check-route.sh "/learn/$slug" "$slug" || true
done
scripts/check-route.sh /learn/explore-godot/community "Community"
scripts/check-route.sh /learn/explore-godot/projects "Projects"
scripts/check-route.sh /learn/explore-godot/classroom "Explore: Godot"
scripts/check-route.sh /learn/explore-godot/program "Explore: Godot"
scripts/check-route.sh /learn "Explore: Godot"
scripts/check-route.sh / "Programs"
```

Every line must PASS.

- [ ] **Step 2: Walk all four phases**

With `/learn/explore-godot` open, click each phase on the preview bar. Confirm `interested` shows three tabs and the other three phases show six, and that the first tab's label changes.

- [ ] **Step 3: Exercise every enrollment-card state**

`explore-godot` (many), `core-threadbare` (one), `explore-threadbare` (workshop dates, not a range), `educator-training` (access code), and whichever program has none (email capture).

- [ ] **Step 4: Check the naming rule across everything shipped**

```bash
grep -rin "cohort" i18n/locales/ && echo "VIOLATION" || echo "clean"
```

Expected: `clean`. Occurrences in `.ts`/`.vue` **code** are fine — `Cohort` is the data-model term. Only learner-facing copy is bound by the rule.

- [ ] **Step 5: Check the dev server log**

Read the full dev server output. No new Vue Router warnings, no hydration mismatches, no unresolved-component errors. Pre-existing warnings — such as the `/programs/36189/?progTab=Resources` no-match warning — are not yours to fix.

- [ ] **Step 6: Verify the production build**

```bash
npm run build
```

Expected: completes with no errors. This catches type and import problems the dev server tolerates.

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "Fix issues found in the slice 1 verification pass"
```

Skip if nothing needed fixing.

---

## What this slice does not build

Named so no one mistakes a stub for a gap: the Community feed and channels, the Classroom rework and WYSIWYG deliverable editor, the Projects library and project detail pages, the Resources list, the enrolled Home dashboard, progress and badge cards. Each gets its own spec and plan.
