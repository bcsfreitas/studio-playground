---
version: alpha
name: Endless Studios — Studio Home
description: >-
  Design tokens for the Studio Home Nuxt 4 app, extracted from the live
  Nuxt UI v4 theme (`app/app.config.ts`), Tailwind v4 tokens
  (`app/assets/css/main.css`), and actual component usage in `app/`.
colors:
  primary: "#ff6900"
  secondary: "#6556f0"
  kids: "#00bba7"
  info: "#0084d1"
  warning: "#e07100"
  success: "#55852e"
  error: "#de1b41"
  neutral: "#62748e"
  primary-50: "#fff7ed"
  primary-500: "#ff6900"
  primary-600: "#f54a00"
  primary-900: "#7e2a0c"
  secondary-50: "#e7e5fc"
  secondary-500: "#6556f0"
  secondary-700: "#322b78"
  kids-50: "#f0fdfa"
  kids-500: "#00bba7"
  kids-700: "#00786f"
  neutral-50: "#f8fafc"
  neutral-500: "#62748e"
  neutral-800: "#1d293d"
  neutral-950: "#020618"
  midnight-500: "#0d5b82"
  midnight-950: "#01070a"
typography:
  display:
    fontFamily: Figtree
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1
  heading-lg:
    fontFamily: Figtree
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
  heading-md:
    fontFamily: Figtree
    fontSize: 18px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: -0.5px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  label:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  pill: 100px
spacing:
  base: 16px
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  6: 24px
  8: 32px
  12: 48px
  16: 64px
components:
  card:
    backgroundColor: "#ffffff"
    rounded: "{rounded.3xl}"
    note: "app.config.ts overrides UPageCard's root to rounded-3xl platform-wide"
  card-image:
    rounded: "{rounded.2xl}"
    note: "custom card/image markup (ProgramTile, TaskTile, PostCard) uses rounded-2xl, one step below the UPageCard shell"
  badge-primary-soft:
    backgroundColor: "{colors.primary-50}"
    textColor: "{colors.primary-900}"
    rounded: "{rounded.sm}"
  badge-warning-solid:
    backgroundColor: "{colors.warning}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    note: "white-on-solid falls short of WCAG AA (4.5:1) — see Do's and Don'ts"
  badge-kids-soft:
    backgroundColor: "{colors.kids-50}"
    textColor: "{colors.kids-700}"
    rounded: "{rounded.sm}"
    note: "reserved for youth-gated surfaces, not a general accent"
---

## Overview

Studio Home is the landing dashboard for **Endless Studios**, a youth game-making learning community — young creators build, play, and ship real games together, backed by guided **programs**, a games library, XP/levels, credentials, and a social feed. The product's own voice is warm, encouraging, and journey-framed ("your journey begins here"), and it deliberately spans two audiences on one surface: minors under parental consent, and older/advanced creators and staff. That split shows up directly in this system as a reserved `kids` (teal) semantic color for youth-gated surfaces — treat it as a distinct mode, not a general-purpose accent.

Visually, the app is built entirely on **Nuxt UI v4** over **Tailwind CSS v4**: a warm orange-and-cornflower brand palette expressed exclusively through Nuxt UI's semantic `color` prop (never raw palette names on components), generously rounded surfaces (`UPageCard` is forced to `rounded-3xl` platform-wide), and depth conveyed mostly through a thin `border-default` hairline before any shadow. Two real web fonts load via Google Fonts (`app/assets/css/main.css:1`) — **Figtree** for headings, **Inter** for body — so `font-heading`/`font-sans` render as designed, not as a fallback.

## Colors

> Source: the `@theme static` block in `app/assets/css/main.css` (9 full 50–950 ramps) plus the semantic `--ui-*` alias layer in the same file. Every ramp maps 1:1 to a Nuxt UI theme color registered in `nuxt.config.ts` (`ui.theme.colors`) and `app.config.ts` (`ui.colors`).

### Brand
- **Primary — Orange** (`{colors.primary}` / `--color-orange-500` — #ff6900): the platform's main calls to action. `app.config.ts` maps this to Nuxt UI's `primary` role. Reserve for the single most important action per screen.
- **Secondary — Cornflower** (`{colors.secondary}` / `--color-cornflower-500` — #6556f0): secondary actions and links, mapped to Nuxt UI's `secondary` role. In practice used more as a soft tint (`secondary-50` bg + `secondary-700` text) for badges than as a solid fill.

### Semantic
- **Kids — Teal** (`{colors.kids}` / `--color-teal-500` — #00bba7): reserved for youth-gated and parental-consent-gated surfaces, aliased via `--ui-kids`. Registered as a Nuxt UI theme color (`ui.theme.colors` in `nuxt.config.ts`) so components can use `color="kids"` directly. **Don't use it as a general accent.**
- **Info — Sky** (`{colors.info}` — #0084d1), **Warning — Amber** (`{colors.warning}` — #e07100), **Success — Lime** (`{colors.success}` — #55852e), **Error — Red** (`{colors.error}` — #de1b41): the standard semantic state colors, each a full ramp aliased through `--ui-info/-warning/-success/-error`.
- **Neutral — Slate** (`{colors.neutral}` — #62748e): body text, borders, muted chrome. The `--ui-text*` ladder is tuned darker than the raw ramp (`slate-800` default text, `slate-950` for highlighted) for readability.
- **Midnight**: a deeper accent ramp for dark/inverted sections (`--ui-bg-inverted` uses `midnight-950`); not yet used broadly in shipped components.

### Surface & Text tiers (`--ui-*`, plain CSS custom properties, not Tailwind theme keys)
- Background: `--ui-bg` (white) → `--ui-bg-muted` (slate-50, page canvas) → `--ui-bg-elevated` (slate-100) → `--ui-bg-inverted` (midnight-950).
- Text: `--ui-text` (slate-800, default) → `--ui-text-toned` (slate-700) → `--ui-text-muted` (slate-600) → `--ui-text-dimmed` (slate-500) → `--ui-text-highlighted` (slate-950) → `--ui-text-inverted` (white).
- Border: `--ui-border` (#dcdce9, a standalone literal, not tied to the slate ramp) → `--ui-border-muted` (slate-200) → `--ui-border-accented` (slate-300).

### Known gap — contrast
Because this palette is shared with the wider Endless Studios brand, the same weak spot applies here: white text on solid `primary`/`warning`/`info`/`success` all fall short of WCAG AA's 4.5:1 for normal text (down to ~2.9:1 on `primary`). This affects any solid-variant button or badge in those colors. Prefer soft variants (tinted background + darker text, e.g. `badge-warning-solid` above vs. the safer `badge-primary-soft` pattern) or larger/bolder text as a stopgap; fixing the underlying pairings is a cross-app follow-up, not something to patch per-instance.

## Typography

### Font Family
Two real web fonts load via a single Google Fonts `@import` (`main.css:1`) — no `@font-face` block needed, no missing-font gap. **Figtree** (400–800) drives `font-heading`; **Inter** (400–700) drives `font-sans` and is the default body face (`html, body { font-family: var(--font-sans) }`). There is no third face — no Baloo 2 in this app (it appears only in the original Figma-handoff material, not in what's actually built here).

### Scale
Components use Tailwind's standard type scale directly (`text-5xl`, `text-2xl`, `text-lg`, `text-sm`, `text-xs`, …) rather than a custom fixed-px scale — there is no legacy scale to avoid here. The table below reflects the sizes actually observed in components (`app/pages/index.vue`, `TaskTile.vue`, and others):

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display}` | 48px (`text-5xl`) | 700 | 1 | Hero headline (`index.vue`) |
| `{typography.heading-lg}` | 24px (`text-2xl`) | 700 | 32px | Section headings |
| `{typography.heading-md}` | 18px (`text-lg`) | 700 | 28px | Card titles (`TaskTile`, `PostCard`) |
| `{typography.label}` | 14px (`text-sm`) | 600 | 20px | Emphasized labels, nav |
| `{typography.body-md}` | 14px (`text-sm`) | 400 | 20px | Default body |
| `{typography.body-sm}` | 12px (`text-xs`) | 400 | 16px | Captions, metadata |

Headings pair `font-heading font-bold` at whatever Tailwind size fits the context (e.g. `font-heading font-bold text-lg tracking-[-0.5px]` in `TaskTile.vue`); body text leans on Nuxt UI's semantic text-color utilities (`text-default`, `text-muted`, `text-dimmed`, `text-highlighted`) layered over standard Tailwind size classes, rather than one-off hex colors.

## Layout

The current Studio Home page (`app/pages/index.vue`) is a **fixed-width prototype layout**, not a fluid container:
- A fixed 232px left sidebar (`AppSidebar`) and a conditional 64px top bar (`AppTopbar`, shown only for the active-learner state) offset the content area via inline padding.
- The content column itself is pinned to exactly **1080px** (`max-width/min-width/width: 1080px`) — this is a prototype characteristic to be aware of, not a pattern to defend if the app grows beyond this one page.
- Below the hero, a 2-column grid (`minmax(0,1fr)` main column + a fixed **324px** right rail) with `gap-12`, and `gap-20`/`gap-6` rhythm between sections within each column.

### Spacing System
4px base unit, matching `--space-*` in `main.css`: `{spacing.1}` 4px · `{spacing.2}` 8px · `{spacing.3}` 12px · `{spacing.4}` 16px · `{spacing.6}` 24px · `{spacing.8}` 32px · `{spacing.12}` 48px · `{spacing.16}` 64px (full scale runs to 96px). Applied via Tailwind's standard `p-*`/`gap-*`/`space-y-*` utilities — no separate custom grid layered on top.

## Elevation & Depth

Hierarchy is conveyed primarily through a **hairline border**, not a shadow — `AppSidebar`/`AppTopbar` use plain `border-r border-default` / `border-b border-default`, and only three named shadow tokens exist for the cases that do float:

| Token | Value | Use |
|---|---|---|
| `--shadow-card` | `0 25px 50px -12px rgba(0,0,0,0.08)` | Resting card depth |
| `--shadow-hover` | `0 10px 19px 7px rgb(156 161 165 / 15%)` | Hover-lift state |
| `--shadow-menu` | `0 4px 16px rgba(15,23,43,0.12)` | Menus, floating overlays |

The observed hover pattern is `transition-shadow duration-250 hover:shadow-xl` (or `hover:shadow-2xl` on the hero-adjacent cards in `index.vue`) — a soft lift on interaction, not a resting shadow. Reserve heavier shadows for genuinely floating elements (menus, popovers); default cards should read as flat-with-a-border first.

## Shapes

| Token | Value | Use |
|---|---|---|
| `{rounded.sm}` | 8px | Nuxt UI control defaults (buttons, inputs) — not a deliberate app-level choice to preserve |
| `{rounded.md}` | 12px | — |
| `{rounded.lg}` | 16px | — |
| `{rounded.xl}` | 20px | — |
| `{rounded.2xl}` | 24px | Custom card/image markup (`ProgramTile`, `TaskTile`, `PostCard`) |
| `{rounded.3xl}` | 32px | **Platform-wide `UPageCard` root** (`app.config.ts` override) |
| `{rounded.pill}` | 100px | Pill-shaped indicators, the dev-only "PREVIEW AS" switcher |

Corners are soft and generous by design — nothing in the shipped UI is sharp-cornered. `rounded-full` covers avatars and pill-shaped indicators outside the scale above.

## Motion

`app/assets/css/main.css` currently defines two real duration tokens — `--duration-fast: 0.15s` (press/toggle-scale feedback) and `--duration-base: 0.25s` (hover/shadow transitions, e.g. the `hover:shadow-xl` cards above). The fuller motion system this brand is designed around — a 5-step duration scale and three named easing curves — is documented in **`docs/animation.md`** but is not yet wired into `main.css` as CSS custom properties; treat that file as the target playbook, not a description of what's implemented today.

Key rules from that playbook, worth following now even ahead of the token migration:
- **Confident deceleration only** — ease-out curves (quart/quint/expo); never bounce or elastic easing.
- **GPU-only** — animate `transform` and `opacity`; never animate layout properties (`width`, `height`, `top`, `left`).
- **`prefers-reduced-motion` is required**, not optional, on any animation added.

## Components

The component library is **Nuxt UI v4** — per `CLAUDE.md`'s "Building UI — mandatory tool use" rule, check the `nuxt-ui` skill or the `nuxt-ui-remote` MCP server for a component's baseline API before writing raw markup. This section covers only what Studio Home changes or establishes as a pattern on top of that baseline.

- **Card primitive**: `UPageCard` is used throughout (`ProgramTile`, `TaskTile`, `PostCard`, the home page's section cards) — not `UCard`. It's globally overridden (`app.config.ts`) to `rounded-3xl` root and `items-stretch` wrapper, and its `soft` variant is bumped from Nuxt UI's default `bg-elevated/50` to a fully-opaque `bg-elevated` for standalone-surface legibility.
- **Color props**: always one of the semantic roles (`primary`, `secondary`, `neutral`, `warning`, `success`, `info`, and `kids` where gating applies) — never a raw palette name. Verified consistent across every shipped component.
- **Status → color mapping**: `TaskTile.vue` defines a `STATUS_COLOR` record mapping task-status strings to a Nuxt UI badge color (e.g. `'In Review' → 'primary'`, `'Feedback' → 'warning'`, `'Done' → 'success'`, falling back to `'neutral'`) — replicate this pattern (a typed lookup object, not inline conditionals) for any future status/tag → color mapping.
- **Icons**: all icons are `lucide:*` names, but invocation is inconsistent — `<Icon name="lucide:...">` in `AppSidebar`/`AppTopbar`/`index.vue`, `<UIcon name="lucide:...">` in `ProgramTile`/`PostCard`. Both work; pick one going forward (see Do's and Don'ts).
- **Section titles vs. card titles**: `UPageCard`'s own `title`/`description` props are for a title that lives *inside* a card; `SectionTitle` is for a title that sits *outside*/above a card or list of cards ("Continue learning", "Your open tasks"). Don't duplicate a section's title inside each card it contains.
- **Current inventory**: `ProgramTile`, `TaskTile`, `PostCard`, `BountiesCard`, `GettingStartedCard`, `StreakCard`, `UpcomingEventsCard`, `SectionTitle`, `AppSidebar`, `AppTopbar`.

## Do's and Don'ts

### Do
- Set every component's color through Nuxt UI's semantic `color` prop (`primary`, `secondary`, `neutral`, `warning`, `success`, `info`, `kids`) — this repo already does this consistently; keep it that way.
- Treat `kids` (teal) as reserved for youth-gated / parental-consent-gated surfaces specifically, not a general-purpose accent.
- Use `UPageCard` as the card primitive, and lean on its `app.config.ts` overrides rather than re-adding `rounded-3xl`/`items-stretch` per instance.
- Use a typed status/tag → color lookup object (the `TaskTile` `STATUS_COLOR` pattern), not inline conditional chains, when mapping domain values to badge colors.
- Convey hierarchy with a `border-default` hairline first; reserve `shadow-xl`/`shadow-2xl` for hover-lift and genuinely floating elements (menus, popovers).
- Check contrast before pairing white text with a solid `primary`/`warning`/`info`/`success` fill — prefer the soft (tinted-bg + darker-text) variant instead.

### Don't
- Don't mix `<Icon>` and `<UIcon>` for the same purpose across new components — standardize on one.
- Don't treat the current page's fixed 1080px content width or fixed 324px right rail as a responsive pattern to replicate — it's a known prototype characteristic, not a deliberate breakpoint system.
- Don't treat the bottom-pinned "PREVIEW AS" state switcher as a real UI pattern — it's explicitly dev-only scaffolding in the source, kept only for manual QA until real session state exists.
- Don't add a fixed-px custom type scale — Tailwind's standard scale is the only one in use here; there's no legacy scale to work around.
- Don't invent new duration/easing values for animation — use `--duration-fast`/`--duration-base` where a token already exists, and follow `docs/animation.md`'s easing/GPU/reduced-motion rules for anything new.
