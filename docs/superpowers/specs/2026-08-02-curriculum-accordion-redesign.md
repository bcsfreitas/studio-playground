# Curriculum accordion redesign

## Problem

`ProgramCurriculumAccordion.vue` currently renders as a plain, thin-divided accordion (`border-b` rows) with an unstyled title. It reads as flat and low-priority compared to the rest of the Program page.

## Design

**Container** — each module becomes its own card instead of a divided row: `rounded-2xl border border-default`, `px-5` trigger padding, `gap-3` between cards (replacing the `border-b`/`last:border-b-0` divider style).

**Numbering + color** — each module gets a small numbered circle badge (1, 2, 3…) before its title. Badge and title share one color, cycling through 4 accents by module index (`index % 4`): `primary`, `secondary`, `purple`, `blue` — the same family already used in `ProgramFactsStrip`.

**Open by default** — `UAccordion` already uses `type="multiple"`; add `:default-value="items.map(i => i.value)"` so every module starts expanded. Still collapsible.

**Content list** — unchanged data (type icon, item title, XP badge for tasks), just a bit more breathing room: `gap-2.5` and `pb-4` instead of `gap-2`/`pb-3.5`, to match the larger container.

## Out of scope

- Module `description` field (exists on `CurriculumModule` but isn't populated in mock data) — not surfaced in this pass.
- Any change to the underlying curriculum data model.
