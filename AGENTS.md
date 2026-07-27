# AGENTS.md

Guidance for any coding agent (or human) working in this repository.

## What this is

A Nuxt 4 app implementing the Endless Studios "Studio Home" page, built from a Claude Design handoff (`Home page platform design-handoff.zip`, extracted under `project/` for reference). The design system readme in `project/` documents the real production stack this mirrors: Nuxt 3 + Vue, Tailwind CSS v4, `@nuxt/ui` v4.

See `DESIGN.md` for the full design-token reference (colors, typography, spacing, shadows, component conventions) and `docs/animation.md` for the motion/easing playbook.

## Commands

- `npm install --legacy-peer-deps` — required in this environment; a plain `npm install` hits an npm/arborist bug (`Cannot read properties of null (reading 'edgesOut')`) unrelated to this project's dependencies.
- `npm run dev` — start the dev server (`nuxt dev`, port 3000 by default; pass `-- --port <n>` to override).
- `npm run build` — production build.
- `npm run storybook` — Storybook dev server (port 6006) for component-level development/QA.
- `npm run build-storybook` — static Storybook build.
- No test suite yet.

## Architecture

- Nuxt 4 default layout: app code lives under `app/` (`app/pages`, `app/components`, `app/composables`, `app/assets/css`, `app/app.config.ts`). `nuxt.config.ts` and `package.json` stay at the repo root.
- `app/assets/css/main.css` — design tokens ported verbatim from the handoff's design system (`project/_ds/.../tokens/*.css`). Color ramps live in a Tailwind v4 `@theme static` block (so `bg-orange-500` etc. work); spacing/radius/shadow/semantic (`--ui-*`) tokens are plain CSS custom properties, kept separate from Tailwind's own scale to preserve the platform's exact values.
- `app/app.config.ts` — Nuxt UI theme: `primary: orange`, `secondary: cornflower`, `neutral: slate`.
- `nuxt.config.ts` registers `kids` as an extra Nuxt UI theme color alongside the standard set, and bundles the `lucide` icon collection server-side via `@nuxt/icon`.
- Icons: `@nuxt/icon` with the `lucide` collection, used via `<Icon name="lucide:xxx" />` (some older components use `<UIcon name="lucide:xxx" />` instead — both work, but don't mix the two within one new component; see DESIGN.md's Do's and Don'ts).
- `app/components/{ProgramTile,TaskTile,PostCard}.vue` — brand components ported from the design system's React source (`_ds_bundle.js`) into Vue SFCs.
- `app/components/{AppSidebar,AppTopbar}.vue` — the fixed left nav and top bar.
- Every component under `app/components/` has a matching `*.stories.ts` file for Storybook — add one when creating a new component.
- `app/pages/index.vue` — the Studio Home page. Renders 3 states (Active learner / New learner / Guest) driven by mock data in `app/composables/useHomeMockData.ts`, matching the original prototype's `sc-if` branches. A "PREVIEW AS" pill (bottom of screen) lets you switch states for manual QA — kept intentionally since there's no real auth/backend yet. The original design source explicitly marks the equivalent control as preview-only; revisit whether to keep it once real session state exists.
- `project/` — the original Claude Design handoff (raw `.dc.html` prototype + design system bundle + source images), kept for reference only. Not part of the app build.
- `patches/` — a patch applied to the installed `nuxt` package via `postinstall` (see `patch:nuxt` script in `package.json`). Don't hand-edit `node_modules/nuxt`; edit the patch file and reinstall instead.

## Building UI — use Nuxt UI, don't hand-roll

This app runs on `@nuxt/ui` v4. Before writing markup for a new component or page section, check whether an existing Nuxt UI component already covers it (buttons, cards, badges, inputs, modals, tooltips, tables, menus, etc.) — reaching past it means duplicating and drifting from an existing accessible, themed component.

- Check the current `@nuxt/ui` v4 docs (https://ui.nuxt.com) for a component's props/slots/variants/sizes/states before guessing from memory — v4's API has moved fast and training data lags it.
- Only fall back to raw HTML when no Nuxt UI component/slot combination fits, and say so explicitly rather than silently hand-rolling.
- Component color/shape choices should follow `DESIGN.md` (semantic color roles, spacing/radius/typography tokens, which variants are actually adopted vs. legacy), not ad hoc values.
- Card primitive is `UPageCard`, not `UCard` — it's globally overridden in `app.config.ts` (`rounded-3xl` root, `items-stretch` wrapper, opaque `soft` variant). Lean on that override rather than re-adding the same classes per instance.
- Always set component color through Nuxt UI's semantic `color` prop (`primary`, `secondary`, `neutral`, `warning`, `success`, `info`, `kids`) — never a raw palette name. `kids` (teal) is reserved for youth-gated/parental-consent-gated surfaces specifically, not a general accent.

## Writing style

Applies to commit messages, PR descriptions, review replies, code comments, and any documentation written in this repo.

- No AI jargon or filler ("Let's dive into", "It's worth noting", "In summary", "Certainly!", etc.) — state the thing directly.
- No AI attribution trailers (e.g. `Co-Authored-By: Claude`) in any committed artifact, unless explicitly asked for.
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

## General principles

- Prefer editing existing files to creating new ones. Don't add features, refactor, or introduce abstractions beyond what a task requires.
- Don't add error handling, fallbacks, or validation for scenarios that can't happen. Trust internal code and framework guarantees; validate only at real system boundaries.
- Be careful not to introduce security vulnerabilities (XSS, injection, etc.). If you notice you've written something insecure, fix it immediately.
