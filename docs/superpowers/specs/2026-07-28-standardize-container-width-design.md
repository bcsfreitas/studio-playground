# Standardize page container width

## Problem

`index.vue` and `learn.vue` each hand-roll their own body container with different, inconsistent measurements:

- `index.vue`: inline `style="max-width: 1080px; min-width: 1080px; width: 1080px"` — hard-pinned, never shrinks below 1080px, causing horizontal overflow on narrower viewports.
- `learn.vue`: `max-w-5xl w-full px-6` — 1024px max-width, fluid, 24px side padding at all breakpoints.

Neither uses Nuxt UI's own `UContainer` primitive, which exists exactly for this (`w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8`, driven by the `--ui-container` CSS var, default `80rem`/1280px).

## Decision

- Set `--ui-container: 1080px` once in `app/assets/css/main.css` (`:root` block, alongside the other `--ui-*` tokens), matching the home page's existing 1080px design width.
- Replace both pages' bespoke container divs with `<UContainer>`, dropping the inline styles and the `max-w-5xl`/`px-6` combo.

Result: both pages get the same 1080px max-width with Nuxt UI's standard responsive padding (16px / 24px / 32px at `default`/`sm`/`lg`), and the container becomes fluid — no more hard floor that overflows on narrow viewports. Any future page reaches for `<UContainer>` and gets the platform width for free.

## Scope

In scope: the two pages' outer container element and the `--ui-container` token.

Out of scope: everything inside the container (grid gaps, right-rail width, sidebar width, hero banner) — not part of what was asked, no reported inconsistency there.

## Verification

- Visual check of both pages at desktop width (content should still measure 1080px) and at a narrow viewport (content should shrink with padding, no horizontal scrollbar on either page).
