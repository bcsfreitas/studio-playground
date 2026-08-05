# Program page — data layer and tabbed shell (slice 1)

## Context

The internal program page is being redesigned end to end. Today `app/pages/learn/[programId].vue` is a single scrolling marketing page — hero, facts strip, curriculum accordion, tools, prerequisites, testimonials, certificate, and a sticky enrollment card. The redesign turns it into a five-tab surface (Overview, Community, Classroom, Projects, Resources) that changes shape once a learner enrolls, with a project library and a per-program social feed behind it.

That full redesign is six independent subsystems and cannot be specified honestly in one document. It is being built in slices. **This spec covers slice 1 only: the mock data layer every later slice reads from, plus the route shell, program header, and enrollment card.** Later slices get their own specs.

Slice 1 is first because both of its pieces are shared dependencies. Every tab needs somewhere to live, and every tab needs program data that does not exist yet. Building them first means later slices plug into settled shapes instead of retrofitting them.

### Sequence after this slice

Overview tab content → enrolled Home dashboard → Community → Classroom rework → Projects → Resources.

## Decisions taken

| Decision | Choice |
|---|---|
| Program catalog | Replace the 8 invented templates with the 4 real Knowledge Base programs |
| Missing data (dates, XP, testimonials) | Synthesize, and mark every synthesized field in code |
| Learner phase switching | Extend the existing dev-only PREVIEW AS pill |
| Enrollment card | Dropdown picker + detail summary + CTA |
| Tab routing | Real nested routes |
| Learner-only tabs when not enrolled | Hidden entirely |
| Overview once enrolled | Becomes Home; overview content moves to a new About tab |

## Data layer

### File split

`app/composables/useProgramMockData.ts` is 1,180 lines and would roughly double. It becomes a directory:

```
app/composables/programData/
  types.ts         all interfaces and unions
  templates.ts     the 4 program templates
  curriculum.ts    modules and steps per program
  instances.ts     instances, cohorts, session schedules
  credentials.ts   microcredentials and their criteria
  enrollments.ts   one record per learner phase
```

`useProgramMockData.ts` stays as a re-export barrel, so no import anywhere in the app changes. `app/composables/useProgramCurriculum.ts` and `useProgramProgress.ts` are untouched.

### Catalog

Four programs, all content sourced from `docs/brain/Knowledge Base/Programs/`:

| Program | Tier | Structure | Enrollment model | Microcredential | Real proof point |
|---|---|---|---|---|---|
| Core: Threadbare | Core | 18 sessions across 5 milestones | cohort | Community Game Making (7 criteria) | ~234 learners in GameLab 4.0, ~575 in 2025 |
| Explore: Threadbare | Explore | 13 standalone workshops, 4 disciplines | workshop-series | Intro to Game Making (3 criteria) | only NDPA-compatible program in the MVP |
| Explore: Godot | Explore | 10 sessions, 60 min each | cohort | Intro to Game Making (3 criteria) | 68 enrolled / 30 participated, May 12 – Jun 11 2026 |
| Educator Training | — | 4 sections | cohort | none | facilitator-facing, not learner-facing |

Modules map to milestones for Core: Threadbare, to disciplines for Explore: Threadbare, and to sessions for Explore: Godot.

Route slugs: `core-threadbare`, `explore-threadbare`, `explore-godot`, `educator-training`.

### Two enrollment models

`Explore-Threadbare/curriculum.md:5` states plainly: *"this is NOT a cohort. Each of the 13 workshops is a self-contained one-hour session that a learner can attend on its own, in any combination. The platform should present these as 'join a workshop' with a date, not as a cohort date range."*

So `ProgramInstance` carries `enrollmentModel: 'cohort' | 'workshop-series'`:

- **cohort** — one date range, a schedule label, a seat count. The dropdown lists instances ("May 12 – Jun 11", "Jul 7 – Aug 6").
- **workshop-series** — no range. The dropdown lists individual workshops with their own dates, and the CTA reads "Join this workshop" rather than "Enroll".

Both models feed the same card; only the option list and CTA label differ.

### New and changed types

```ts
type LearnerPhase = 'interested' | 'enrolled' | 'completed' | 'game-owner'
type EnrollmentModel = 'cohort' | 'workshop-series'

interface ProgramSession {
  id: string
  index: number
  title: string
  drivingQuestion?: string
  startsAt: string          // ISO
  durationMinutes: number
}

interface MicrocredentialCriterion { id: string, label: string }
```

Extended: `Microcredential.criteria`, `ProgramInstance.{enrollmentModel, visibility, accessCode, scheduleLabel, sessions, mentors}`, `Cohort.name`, `EnrollmentRecord.phase`, `ProgramTemplate.graduateCount`.

`ProgramInstance.visibility: 'public' | 'private'` — private instances are institution-commissioned and need an access code.

### Naming rule

`Cohort.name` holds a human group name — "Night Owls", "Studio B". **The word "cohort" never appears in learner-facing copy or i18n strings.** Learner-facing language is "live session" or "your group". `Cohort` remains the data-model term only. This rule comes from user research and is repeated in `02-programs-and-offerings.md:34`.

### Synthesized data

The Knowledge Base has no XP values, no calendar dates beyond Explore: Godot's real window, no testimonials, and no microcredential criteria text (only the counts, 7 and 3). Those are generated. Every synthesized field carries a comment in this form:

```ts
// SYNTHESIZED: no session dates in the source docs; generated from the
// stated Tue/Thu cadence so the schedule UI has something to render.
```

XP by step type: topic 25, survey 15, resource 10, task 50, deliverable 200 — reusing the existing `GENERIC_DELIVERABLE_XP` constant rather than introducing a second number.

### Source conflicts to preserve, not paper over

1. **Explore: Godot session length.** `02-programs-and-offerings.md:12` says "Tue/Thu, 90 min"; `Explore-Godot/curriculum.md:3` says "Ten sessions, 60 minutes each". Use **60**, closer to the source decks, with a code comment recording the conflict.
2. **Module deliverables.** The requirement that every module ends in a deliverable holds for Core: Threadbare's milestones but has no basis in the Explore material. Those deliverables are synthesized and marked as such.
3. **Core: Threadbare milestones 1–3 are thin.** `Core-Threadbare/curriculum.md:9` warns those decks are visually driven and extracted poorly. Treat as a skeleton; do not invent teaching content to fill them.

## Route shell

```
app/pages/learn/[programId].vue           parent — topbar, program header, tabs, <NuxtPage>
app/pages/learn/[programId]/index.vue     Overview (interested) / Home (enrolled)
app/pages/learn/[programId]/about.vue     enrolled only
app/pages/learn/[programId]/community.vue
app/pages/learn/[programId]/classroom.vue the current program.vue, moved
app/pages/learn/[programId]/projects.vue
app/pages/learn/[programId]/resources.vue enrolled only
```

The parent currently has no `<NuxtPage>`, which is why `[programId].vue` and `[programId]/program.vue` behave as unrelated routes today. Adding it makes the nesting real.

`/learn/:id/program` redirects to `/learn/:id/classroom` so existing links do not 404.

### Tab visibility

| Phase | Tabs |
|---|---|
| interested | Overview · Community · Projects |
| enrolled / completed / game-owner | Home · About · Community · Classroom · Projects · Resources |

Learner-only tabs are absent from the nav for non-enrolled visitors, not disabled.

### Header and rail

- **Full hero on the first tab only** — image, description, tags, graduate count. Other tabs get a compact bar with title and tier badge. A 300px hero above the Classroom on every visit is wasted vertical space.
- **The right rail belongs to each tab, not the shell.** Classroom has its own two-column layout and Community is full-width; a shell-level rail would fight both. Overview keeps its existing `sticky top-6`.

## Enrollment card

`ProgramEnrollmentCard` is rebuilt around four states:

| Instances available | Card body |
|---|---|
| Many (≤3) | `USelectMenu` of instances → detail list → CTA |
| One | Static detail text, same list, same CTA |
| Zero | Email capture — `UInput` + button, not wired to anything |
| Private instance | Access-code `UInput` behind a "Have an access code?" disclosure |

Detail list per selection: schedule, session count and length, seats remaining, mentor. For `workshop-series` instances the list shows the single workshop's date and length instead of a range.

Already-enrolled state (progress summary) is out of scope here — it arrives with the Home dashboard slice.

## Preview control

`PreviewState` becomes `LearnerPhase` with the four values. The bottom-pinned pill moves out of `[programId].vue` into a `DevPreviewBar` component, since every tab needs it now. It stays explicitly dev-only scaffolding, as `DESIGN.md` requires.

## Component reuse

These survive with light or no changes and should not be rewritten: `ProgramHero`, `ProgramFactsStrip`, `ProgramCurriculumAccordion`, `ProgramPrerequisites`, `ProgramSocialProof`, `ProgramCertificateShowcase`, `ProgramToolsList`, `SectionTitle`, `AppTopbar`.

Per `CLAUDE.md`, check the `nuxt-ui` skill for component APIs before writing markup, and use `USeparator` rather than border divs. Follow `DESIGN.md` for color roles — semantic `color` props only, `UPageCard` as the card primitive, hairline borders before shadows.

## Copy and i18n

All new user-facing strings go through `useI18n()` and land in both `i18n/locales/en.json` and `i18n/locales/es.json`, matching how the existing program page already works. No hardcoded English in templates. Spanish strings are translations, not placeholders.

New key groups: `program.tabs.*` (tab labels), `program.enroll.*` (picker, seats, access code, notify-me), `program.sessions.*` (schedule formatting). The learner-facing naming rule applies here specifically — no key or value may contain "cohort".

## Known consequence

`app/composables/useLearnMockData.ts` references the invented program IDs, so `/learn` and the home page will list 4 programs instead of 8 and need updating. Those two files are the only references — the blast radius is small, but the catalog pages will look sparser.

## Verification

1. `npm run dev`, then confirm each route returns 200 and renders: `/learn/core-threadbare`, `/learn/core-threadbare/community`, `/learn/core-threadbare/classroom`, `/learn/core-threadbare/projects`, `/learn/core-threadbare/resources`, `/learn/core-threadbare/about`.
2. `/learn/core-threadbare/program` redirects to `/learn/core-threadbare/classroom`.
3. Cycle all four phases on the preview pill; confirm the tab list changes between interested and enrolled, and that the first tab's heading switches Overview → Home.
4. Exercise all three enrollment-card cases against real programs — many instances, one instance, zero instances — plus a private instance showing the access-code field, and Explore: Threadbare showing workshop dates rather than a range.
5. `/learn` and `/` still render without errors after the catalog swap.
6. Check the dev server log for new Vue or router warnings, particularly around the nested-route change.
