# "About this Program" section design

## Purpose

Add a short "About this Program" section to the Program page (`app/pages/learn/[programId].vue`) giving learners a fuller sense of what the course covers, beyond the one-line tagline already shown in the hero.

## Scope

One new field on the existing `ProgramTemplate` mock data model, one new presentational component, and its placement on the existing Program page. No new page, no backend, no i18n content translation (matching this page's existing precedent of leaving mock program *content* untranslated — only UI chrome goes through i18n).

## Data model

New field on `ProgramTemplate` (`app/composables/useProgramMockData.ts`):

```ts
about: string
```

A 2-4 sentence paragraph, distinct from the existing `description` field (which stays as-is, the short tagline rendered in `ProgramHero`). Authored for all 4 existing mock programs (`pixel-art-foundations`, `ship-your-first-game`, `level-design-lab`, `creature-rigging-crash-course`).

## Component

New `app/components/ProgramAbout.vue`, following the same shape as the page's other section components (`ProgramToolsList`, `ProgramPrerequisites`): a single prop (`about: string`), rendered as a plain paragraph (`text-default`/`text-dimmed`, matching the hero's typography scale) under a `SectionTitle`. No Nuxt UI component needed beyond `SectionTitle` — it's plain text, not a data structure needing a table/list/accordion.

## Placement

In `[programId].vue`, a new `<section>` immediately after `ProgramFactsStrip` and before the mobile-only `ProgramEnrollmentCard` — i.e. first among the scrollable content sections, right after the hero/facts-strip identity block and before curriculum/tools/prerequisites/testimonials/certificate.

## i18n

New key `program.sections.about` = "About this Program" in `i18n/locales/en.json` and `es.json`, alongside the existing `program.sections.*` keys (`curriculum`, `tools`, `prerequisites`, `testimonials`, `certificate`).

## Out of scope

- Retrofitting `about` copy for programs beyond the 4 existing fixtures.
- Any richer content in this section (images, video, structured bullets) — plain paragraph only, matching what was asked for.

## Verification

- `npm run dev`, visit each of the 4 fixture programs, confirm the new section renders with correct copy, right after the facts strip.
- Switch locale to Spanish, confirm the section title translates and layout doesn't clip.
- `npm run build` — no type errors.
