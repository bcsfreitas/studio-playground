# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Nuxt 3-style app (Nuxt 4) implementing the Endless Studios "Studio Home" page, built from a Claude Design handoff (`Home page platform design-handoff.zip`, extracted under `project/` for reference — the design system readme there documents the real production stack this mirrors: Nuxt 3 + Vue, Tailwind CSS v4, @nuxt/ui v4).

## Commands

- `npm install` — installs dependencies. This repo requires `npm install --legacy-peer-deps` in this environment (a stock `npm install` hits an npm/arborist bug — `Cannot read properties of null (reading 'edgesOut')` — unrelated to this project's dependencies).
- `npm run dev` — start the dev server (`nuxt dev`, defaults to port 3000; pass `-- --port <n>` to override).
- `npm run build` — production build.
- No test suite yet.

## Architecture

- Nuxt 4 default layout: app code lives under `app/` (`app/pages`, `app/components`, `app/composables`, `app/assets/css`, `app/app.config.ts`); `nuxt.config.ts` and `package.json` stay at the repo root.
- `app/assets/css/main.css` — design tokens ported verbatim from the handoff's design system (`project/_ds/.../tokens/*.css`): color ramps live in a Tailwind v4 `@theme static` block (so `bg-orange-500` etc. work), while spacing/radius/shadow/semantic (`--ui-*`) tokens are plain CSS custom properties, kept separate from Tailwind's own scale to preserve the platform's exact values.
- `app/app.config.ts` — Nuxt UI theme: `primary: orange`, `secondary: cornflower`, `neutral: slate`.
- Icons: `@nuxt/icon` with the `lucide` collection (server-bundled), used via `<Icon name="lucide:xxx" />`.
- `app/components/{ProgramTile,TaskTile,PostCard}.vue` — brand components ported from the design system's React source (`_ds_bundle.js`) into Vue SFCs.
- `app/components/{AppSidebar,AppTopbar}.vue` — the fixed left nav and top bar.
- `app/pages/index.vue` — the Studio Home page. Renders 3 states (Active learner / New learner / Guest) driven by mock data in `app/composables/useHomeMockData.ts`, matching the original prototype's `sc-if` branches. A "PREVIEW AS" pill (bottom of screen) lets you switch states for manual QA — kept intentionally, since there's no real auth/backend yet; the original design source explicitly marks the equivalent control as preview-only, so revisit whether to keep it once real session state exists.
- `project/` — the original Claude Design handoff (raw `.dc.html` prototype + design system bundle + source images), kept for reference. Not part of the app build.

## Building UI — mandatory tool use

Before writing any markup for a new component or page section, check for a Nuxt UI component that already covers it. Never hand-write raw HTML/CSS for something Nuxt UI already provides (buttons, cards, badges, inputs, modals, tooltips, tables, menus, dividers, etc.) — this repo runs on `@nuxt/ui` v4, and reaching past it means duplicating and drifting from an existing accessible, themed component. In particular, use `USeparator` instead of a `border-t`/`border-b` div for section dividers.

- Use the `nuxt-ui` skill (installed at `.agents/skills/nuxt-ui`) first for component APIs — props, slots, variants, sizes, states — before guessing from memory or training data, which may lag the installed v4 API.
- Use the `nuxt-ui-remote` MCP server (`https://ui.nuxt.com/mcp`) for anything the skill doesn't cover, or to confirm current behavior straight from the live docs.
- Only fall back to raw HTML when no Nuxt UI component/slot combination fits — and say so explicitly rather than silently hand-rolling.
- See `DESIGN.md` for this app's semantic color roles, spacing/radius/typography tokens, and which Nuxt UI variants are actually adopted vs. legacy — component color/shape choices should follow that, not ad hoc values.

## Writing style

Applies to commit messages, PR descriptions, review replies, code comments, and any documentation written in this repo.

- No AI jargon or filler ("Let's dive into", "It's worth noting", "In summary", "Certainly!", etc.) — state the thing directly.
- No AI trailers (no `Co-Authored-By: Claude`) in any committed artifact, unless the user explicitly asks for one.
- Multi-sentence is fine when each sentence is easy. Don't compress concepts into dense noun chains or drag in tangentially related internals — readability beats density.

## Comments

Explain the *why* — a hidden constraint, a workaround, a non-obvious invariant — never the *what* (identifiers should already say that).

Bad (explains what, restates the code):
```ts
// Sets the pageCard root class to rounded-3xl
root: 'rounded-3xl'
```

Good (explains why — real example, `app/app.config.ts`):
```ts
// Platform-wide card radius (see DESIGN.md) — override once instead of
// adding `class="rounded-3xl"` to every instance.
root: 'rounded-3xl'
```

## Self-update protocol

When the user corrects an approach or gives non-obvious guidance mid-task, ask: is this specific to the current change, or would it apply to any future work in this repo? If it generalizes, propose adding it to this file (in the section it best fits, or a new one) rather than letting it live only in that conversation. Before proposing, scan this file end-to-end for an existing rule that already covers the same ground — tighten that rule instead of adding a duplicate. Show the proposed addition and where it lands before writing it, unless the user already asked for the edit directly.
