# Endless Studios — Design System

A round, playful, depth-rich design system for **Endless Studios**, an online game-making learning community where young creators build, play, and ship real games together. The platform blends a **social feed**, guided **learning programs**, a **games library**, an **XP / levels / skills** system, **credentials**, and **profiles** — anchored by community games like *Threadbare* and the *Endstar* collaborative game builder.

This design system is a recreation of the platform's real front end, distilled into tokens, components, foundation specimens, and a UI kit you can design with.

---

## Sources

Everything here was reverse-engineered from the product front end. If you have access, explore these to go deeper — they are the ground truth:

- **GitHub — `Endless-Game-Making-Studio/studio`** (branch `dev`, `frontend/` subtree): a **Nuxt 3 + Vue** app styled with **@nuxt/ui v4** on **Tailwind CSS v4**.
  - Design tokens: `frontend/app/assets/css/main.css` (the `@theme static` block — color ramps, type scale, spacing) and `base.css`.
  - Theme roles: `frontend/app/app.config.ts` (`primary: orange`, `secondary: cornflower`, `kids: teal`, plus button/card/badge overrides).
  - Components: `frontend/app/components/**` (Vue SFCs — `App/`, `CommunityFeed/`, `Dashboard/`, `Program/`, `Project/`, `Profile/`, `Task/`).
  - Copy: `frontend/i18n/locales/en.json`.
- Public deployments: `studio.endlessstudios.com` (prod), `studio-dev.endlessstudios.com` (dev). Marketing: `endlessstudios.com`, `about.endlessstudios.com`.

> The upstream app uses @nuxt/ui components (`UButton`, `UCard`, `UBadge`, `UNavigationMenu`, `UCarousel`, `UAvatar`…). This system re-implements the brand-specific behavior of those primitives as framework-free React so they render anywhere, and reproduces the platform's own composite components (game/program tiles, task cards, skill tokens, feed posts) faithfully.

---

## Content fundamentals

How Endless Studios writes.

- **Second person, warm and encouraging.** Copy talks *to* the creator: "Your journey starts here", "You are ready to collaborate with others in the Endless Studios community", "Complete your page to start collaborating in your game-making!" The tone is a supportive mentor, never corporate.
- **Action-first, imperative CTAs.** "Discover Games", "Start Learning", "Create Your Game", "Download", "Join Game", "Share with the world!"
- **Sentence case almost everywhere.** Headings, body, and most labels are sentence case ("Community games", "Latest certificates"). Buttons and short UI labels are commonly Title Case ("New post", "Log in", "Edit Profile"). Tiny status pills go UPPERCASE sparingly ("ALPHA RELEASE").
- **Celebrate progress.** Exclamation points appear at milestones — "Congratulations! You now have a game page!", "You got this! Now, prepare yourself for your next challenge." Encouragement over instruction.
- **Plain, concrete vocabulary.** Games, programs, tasks, skills, XP, levels, members, collaborators, feed, mentor. Kids/youth audience → no jargon, no buzzwords, short sentences.
- **No emoji in product UI.** The brand's warmth comes from color, rounded shapes, and voice — not emoji. Don't add them.
- **"Games", not "projects", in the UI.** Internally the code says *project*; the user-facing word is **Game** (note `"project": "Game"` in the locale). Use "Game" in anything a learner sees.

---

## Visual foundations

- **Color.** Brand **orange** (`#ff6900`, `--ui-primary`) drives primary actions, active nav, likes, and section accents; a legacy warmer orange (`#f76e40`) tags game genres. **Cornflower** (`#6556f0`, `--ui-secondary`) is the indigo-violet used for Join/Collaborate actions, feed-source links, and interest badges. **Teal** (`#00bba7`, "kids") tints gated youth surfaces. Status: sky (info), lime (success), amber (warning), red (error). Neutrals are **slate**; deep sections and the footer use near-black **midnight** (`#01070a`). Backgrounds are mostly clean white / very light slate — color arrives through content, tags, and hero art, not big flat fills.
- **Type.** **Figtree** (rounded geometric sans) for all headings, tile titles, and hero copy, semibold–bold; large display sizes get tight tracking (down to −4px on the biggest hero line). **Inter** for body, labels, buttons, and meta, regular–medium. Default UI body is 14/24.
- **Shape & radius.** Rounded is the brand personality. Cards use **16px** (rounded-2xl); tiles, programs, and task cards use **24px** (rounded-3xl); heroes/carousels **32px**; CTAs on hero art and status chips are **fully rounded pills**. Nothing is sharp-cornered.
- **Backgrounds & imagery.** Full-bleed photographic/illustrated hero banners (Threadbare, Endstar) inside big rounded frames, with content centered over a darkened image. A palette of flat solid-color repeating background tiles (`assets/img/…`, e.g. `F76E40`, `6C5DD3`) stands in for missing game art. Imagery is warm and saturated, game-world flavored — never grayscale or grainy. A soft kids-tinted radial glow (`bg-gating-gradient`) backs youth / verified-parental-consent surfaces.
- **Shadows.** Soft, cool-grey **ambient** lifts, never hard black drops. Cards rest flat with a hairline border (`--ui-border #dcdce9`) and lift on hover with `0 10px 19px 7px rgb(156 161 165 / 15%)`. Elevated menus use a light `0 4px 16px` shadow.
- **Borders.** Hairline 1px in a cool lavender-grey (`#dcdce9`) or slate-200. Cards, tiles, inputs, and dividers all share it. Tag/status pills sometimes use a 1px border instead of a fill.
- **Motion.** Short and restrained. Cards ease box-shadow over \~0.25s; fades are \~0.15s linear. **Nothing bounces or springs.** Respect `prefers-reduced-motion`.
- **Hover / press.** Solid buttons darken one step (500 → 600). Soft/ghost buttons deepen their tint. Cards lift with the ambient shadow. Likes flip from grey to orange. There is no scale-down "press" animation.
- **Layout.** Centered max-width container (`--container 82.4rem`). Sticky white top nav (`min-h 16`, z-50). Generous vertical rhythm; the footer is a tall midnight band. Transparency + blur appears only on chips overlaid on hero imagery.
- **Legacy tokens (deprecated — do not use in new work).** A handful of one-off hex accents carried over from the pre-token codebase — `--color-orange-endless`, `--color-orange-primary`, `--color-orange-title`, `--color-orange-button-hover`, `--color-purple-primary`, `--color-blue-status`, `--color-green-light`, `--color-yellow-main`. They map to **neither** a Tailwind ramp (`--color-{name}-{shade}`) **nor** a Nuxt UI semantic alias (`--ui-*`), and survive only so existing tiles/tags keep rendering. Reach for the `--ui-*` equivalent instead (→ `--ui-primary` / `--ui-primary-hover` / `--ui-secondary` / `--ui-info` / `--ui-success` / `--ui-warning`). See the **Legacy accents** card in the Colors group.

---

## Iconography

- **Primary set: Lucide.** The app ships Lucide via `@iconify-json/lucide` and uses it for all UI glyphs (`i-lucide-gamepad-2`, `-folder`, `-book-open`, `-bell`, `-user-round`, `-settings`, `-log-out`, `-calendar`, `-message-circle`, `-menu`, `-x`…). **Use Lucide** for new UI. In cards and kits here it is loaded from the Iconify CDN (`https://code.iconify.design/3/…`) — class form `class="iconify i-lucide-NAME"`.
- **Brand marks & simple-icons.** `@iconify-json/simple-icons` supplies brand logos (Discord, GitHub, Google). Font Awesome 5 is still linked from CDN for a few legacy glyphs; prefer Lucide.
- **Custom SVGs (copied into `assets/`).** The platform hand-draws a handful of domain-specific glyphs: the skill **subdomain** icons (`assets/skills/*.svg`), the rounded **skill hexagon** + **level star** (`skill-background.svg`, `skill-level-icon.svg`), the five **skill-domain** icons (`Art`, `Design`, `Engineering`, `Sound`), plus `controller`, `certificate`, `joystick`, `lightning`, `key`, `hands`, and feed glyphs. These are real product assets — reuse them, don't redraw them.
- **No emoji, no unicode-as-icons.** Icons are always Lucide or a real SVG asset.

---

## What's in here (index)

Root:

- `styles.css` — the entry point consumers link. `@import`s only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Agent-Skills-compatible loader.

**Components** (`components/`) — reusable primitives, exported on `window.EndlessStudiosDesignSystem_579f42`:

- Core (`components/core/`): **Button**, **Badge**, **Card**, **Avatar**.
- Brand (`components/brand/`): **GameTile**, **ProgramTile**, **TaskTile**, **SkillToken**, **PostCard**.

**Foundations** (`guidelines/`) — specimen cards for the Design System tab: Colors (primary, secondary, status, neutral, semantic), Type (typefaces, display, body), Spacing (scale, radius, shadows), Brand (logos, voice & tone).

**UI kit** (`ui_kits/studio/`) — an interactive click-through recreation of the Studio platform: the community feed / dashboard, games library, and a learner profile. See its `README.md`.

**Assets** (`assets/`) — logos (`logo-endless.svg` swoosh mark, `logo-white.svg`, `logo-endless-studios-orange.svg`, `black-endless-logo.png`, Endless Access marks), hero/background imagery (`img/`), game art (`img/games/`), skill glyphs (`skills/`), and UI icons (`icons/`).

### Intentional additions

- **Avatar** — the app uses `UAvatar` (a Nuxt UI primitive) rather than a bespoke component; it's re-implemented here so recreations have a self-contained circular avatar with initial fallback.

### Notes & substitutions

- **Fonts load from Google Fonts.** Inter and Figtree are the platform's real typefaces and both are on Google Fonts, so `tokens/fonts.css` `@import`s them (no substitution). If you need offline/self-hosted binaries, swap those `@import`s for local `@font-face` rules.
