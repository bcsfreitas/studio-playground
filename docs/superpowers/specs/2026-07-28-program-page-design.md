# Program page design

## Purpose

Build the Program page — the cover page a learner sees before enrolling in a program. It informs, persuades, and routes the learner into the correct enrollment option, reached by clicking a program card on `/learn`.

## Scope

A single detail page at `/learn/[programId]`, plus the mock data model it's built against. Covers identity, an at-a-glance facts strip, an optional linked-game stub, curriculum, tools, prerequisites, social proof, a certificate/microcredential showcase, a "what's next" pointer, and an enrollment module handling every enrollment state. Not in scope: a real backend, real enrollment actions, editing programs/cohorts (existing sidebar Admin section), or retrofitting i18n onto the rest of the app.

## Domain model

Four layers, in `app/composables/useProgramMockData.ts`:

```ts
ProgramTemplate   // the content: title, curriculum, certificate, etc. — owned by a studio
ProgramInstance    // one delivery of a template — optionally institution-run
Cohort             // a specific enrollment option under an instance: dated or self-paced,
                   // seat-capped or not, optionally access-coded
EnrollmentRecord   // a learner's enrollment in one specific cohort
```

A `ProgramInstance` can have multiple `Cohort`s running simultaneously (e.g. two scheduled groups + one self-paced) — the learner picks one via a session-picker (`URadioGroup variant="card"`) before the enrollment CTA applies to their choice. Institution-run instances are marked by `deliveringInstitution` on the instance; its mere presence drives the "Delivered with {institution}" attribution line, no separate public/institution toggle needed — same data-driven pattern `LearnProgramCard.vue` already uses for `program.enrolled`.

Per the platform rule, "cohort" never appears in learner-facing copy — the UI says "session." (`app/composables/useProgramMockData.ts`'s own field/type names keep "cohort" internally, matching CLAUDE.md's code-vs-copy distinction.)

### Enrollment status precedence

`cohortStatusFor(cohort, enrollment, unlocked, today)` returns one of, in this precedence order:

1. `already-enrolled` — a learner's `EnrollmentRecord` points at this exact cohort.
2. `self-paced-always-open` — `cohort.startDate === null`.
3. `requires-access-code` — `cohort.accessCode` is set and not yet unlocked in this session.
4. `closed` — `cohort.endDate` has passed.
5. `full` — `seatsTaken >= maxLearners`.
6. `open-with-seats` — the default.

Each status maps to distinct rendering + CTA behavior in `ProgramEnrollmentCard.vue` (progress bar / "Self-paced" badge / access-code input / disabled "closed" button / disabled "full" button + a non-functional "Join the waitlist" secondary / the live "Enroll" button).

### Mock fixtures

Four `ProgramTemplate`/`ProgramInstance` pairs, each exercising a different scenario:

- `pixel-art-foundations` — self-paced only. Also carries an `EnrollmentRecord` for the `active` preview persona at 30% progress, so toggling PREVIEW AS demonstrates both `self-paced-always-open` (New/Guest) and `already-enrolled` (Active) off the same fixture.
- `ship-your-first-game` — three simultaneous live sessions: one open with seats, one full, one gated by an access code (`STUDIO-JAM`).
- `level-design-lab` — institution-delivered (Northgate Youth Arts Center, no logo asset — exercises the initial-letter fallback), one cohort already past its end date (`closed`), and a single testimonial (tests the carousel hiding its arrows/dots at length 1) with an empty microcredentials array.
- `creature-rigging-crash-course` — brand new, not in the `/learn` catalog at all, zero completions, zero testimonials, no "what's next" pointer.

3 of the 4 reuse existing `/learn` catalog ids so clicking those specific cards produces a fully populated page immediately; the other 6 existing catalog cards have no matching fixture yet and route to the not-found state below — an intentional, honest incremental-rollout state, not a bug.

## Page structure

`app/pages/learn/[programId].vue`, `definePageMeta({ layout: 'dashboard' })`. Same `UDashboardPanel`/`AppTopbar`/`UContainer` skeleton as `index.vue`/`learn.vue`, with a local `PreviewState` ref (the shared `usePreviewState()` composable proposed in an earlier spec was never actually built — this page follows what's actually shipped, a local ref, not the unshipped proposal).

Two-column responsive grid (`grid-cols-1 lg:grid-cols-[minmax(0,1fr)_324px]`) — a deliberate new precedent, since `DESIGN.md` flags the rest of the app's fixed-width layout as *not* a breakpoint system to replicate. Below `lg`, the enrollment card renders inline right after the hero/facts strip (a second, `lg:hidden` instance — simpler and more robust than CSS `order` tricks across a 3-item reflow); at `lg`+, only the sticky right-rail instance is visible.

Unknown `programId` (or one with no matching fixture) renders this app's existing dashed empty-state pattern with a "Back to Learn" button — no `createError`/`app/error.vue`, matching `learn.vue`'s own "no programs match your filters" precedent rather than standing up global error-page infrastructure for one feature.

### Routing bug caught during implementation

Nuxt's file router treats `pages/learn.vue` + `pages/learn/[programId].vue` as a **parent/child** pair whenever a page file's name matches a sibling directory — not two independent top-level routes as originally assumed. Since `learn.vue` had no `<NuxtPage/>`, the child route silently never rendered; visiting `/learn/pixel-art-foundations` just showed the `/learn` catalog again. Fixed by converting `learn.vue` → `learn/index.vue`, making both routes true siblings with no forced nesting.

## Components

New, all flat in `app/components/` (matching this app's existing no-subfolder convention): `ProgramHero`, `ProgramFactsStrip`, `ProgramGameStubCard`, `ProgramCurriculumAccordion`, `ProgramToolsList`, `ProgramPrerequisites`, `ProgramSocialProof`, `ProgramCertificateShowcase`, `ProgramWhatsNext`, `ProgramEnrollmentCard`. Built entirely from existing Nuxt UI primitives (`UPageCard`, `UBadge`, `UAccordion`, `UCarousel`, `URadioGroup variant="card"`, `UProgress`, `UButton`, `UInput`) — first use of `UAccordion`/`UCarousel`/`URadioGroup` in this app, so no prior override/convention existed to match; consulted the Nuxt UI MCP for each API rather than guessing.

## i18n

`@nuxtjs/i18n` is bootstrapped for real (`nuxt.config.ts`, `strategy: 'no_prefix'` so existing routes stay unprefixed). Every UI-chrome string on this page (button labels, section titles, empty-state copy, badge labels, enrollment states) lives in `i18n/locales/en.json` / `es.json` under a `program.*` namespace, consumed via `useI18n()`'s `t()`. A `ULocaleSelect` sits next to the existing dev-only "PREVIEW AS" pill on this page for QA switching.

**Mock program *content*** (titles, descriptions, testimonial quotes, curriculum item titles) is **not** translated — it's authored English placeholder content, same as every other mock-data string already in this app (`useLearnMockData.ts`, `useHomeMockData.ts` are never translated either). Only the page's own UI chrome went through i18n; retrofitting the rest of the app (`index.vue`, `learn.vue`, `AppSidebar`, `AppTopbar`) is explicitly out of scope.

## Out of scope

- A real backend / real enrollment actions (joining a session, waitlisting) — still a mock-data prototype.
- Editing/managing programs, instances, or cohorts (existing sidebar Admin section).
- Retrofitting i18n onto pages other than this one.
- Full catalog coverage — only 4 of the 10 existing `/learn` cards have a matching Program page fixture; the rest intentionally 404.
- Tier badge colors (Explore/Core/More) and the microcredential-vs-certificate visual distinction are reasoned first passes with no prior precedent in this app to confirm against — flagged for product sign-off, not settled facts.

## Verification

- `npm run dev`, click through the 3 catalog cards with matching fixtures, plus direct-URL visits to the brand-new fixture and a nonexistent id.
- Toggle PREVIEW AS on `pixel-art-foundations` to see both `self-paced-always-open` and `already-enrolled`.
- On `ship-your-first-game`, pick each of the 3 sessions and confirm distinct states; enter a wrong then correct (`STUDIO-JAM`) access code.
- On `level-design-lab`, confirm the closed state and institution attribution without a logo.
- Switch locale to Spanish and confirm no clipping in badges/buttons/enrollment card.
- Resize below `lg` and confirm the enrollment card appears right after the hero, not after the full scroll.
- `npm run build` — no type errors.
