# Make page design

## Purpose

Build `/make`, the maker-tools hub. Learners browse the game-making tools available to them — engines/editors that run in-browser, the Threadbare Tailor creation suite, and links out to industry-standard external tools — and launch or download them.

## Reference

Claude Design project "Vision document development" (`Tools.jsx` + `data.js`), reached via `DesignSync`. Its "Maker Tools" view has three sections: embedded web tools, "Threadbare Tailor" sub-apps, and external tool links.

Dropped from the reference (per explicit decision, this app has no accounts/backend yet):

- Account-state gating (`gated` flag, `LockedButton`, `openGate`).
- In-platform iframe tool frame (`ToolFrame`) and the sidebar-collapse-on-launch behavior.
- The "Endless Launcher" promo modal for Endstar.

Every tool card in this app is a plain link: `Launch`/`Download` opens `tool.url` in a new tab, same as this app's existing external-link patterns.

## Scope

Listing/launch page only. No embedded tool workspace, no gating, no admin management of the tool catalog.

## Domain model

New composable `app/composables/useMakeMockData.ts`:

```ts
export interface ToolCardData {
  id: string
  name: string
  tag: string           // e.g. 'Game engine', 'Sprite & pixel art'
  blurb: string
  badge: 'Live' | 'Beta'
  image?: string         // screenshot/hero image (thumb fills the card header)
  logo?: string          // small logo shown on a colored background instead of an image
  logoBg?: string        // background color behind `logo`; falls back to a neutral surface
  url?: string           // absent = no working link yet (e.g. Baby Godot in the reference)
  isDownload?: boolean   // true = button reads 'Download' instead of 'Launch'
}

export interface ExternalTool {
  id: string
  name: string
  blurb: string
  logo: string
  logoBg: string
  url: string
}

export const webTools: ToolCardData[]     // Godot Web Editor, Baby Godot, Endstar
export const tailorApps: ToolCardData[]   // Pixel Stitch, PatchWorkShop, Whispering Well, Melody Loom, Patches, Builder's Bench, Swag Lab
export const externalTools: ExternalTool[] // Unity, Blender, Aseprite, GitHub
```

Content ported verbatim (names/tags/blurbs/badges/urls) from the reference `data.js`'s `webTools`, `tailorApps`, and `externalTools` arrays.

## Assets

Pulled via `DesignSync.get_file` from the reference project into `public/images/`:

- `public/images/tools/godot-mark.svg` (used by both Godot Web Editor and Baby Godot)
- `public/images/tools/endstar-hero.png`
- `public/images/tools/pixel-stitch.jpeg`, `patchworkshop.jpeg`, `whispering-well.jpeg`
- `public/images/tools/bg-01.png`, `bg-11.png`, `bg-27.png`, `bg-38.png` (Melody Loom / Patches / Builder's Bench / Swag Lab thumbs — these are generic background art in the reference, reused as tool-card thumbnails)
- `public/images/tools/unity-mark.svg`, `blender-mark.svg`, `aseprite-mark.svg`

`github-mark.svg` already exists at `public/images/icons/github-mark.svg` — reused as-is, not re-downloaded.

## Page structure

`app/pages/make/index.vue`, `definePageMeta({ layout: 'dashboard' })` — same shell as `/learn`: `UDashboardPanel` with `#body` containing `AppTopbar` followed by `UContainer` (identical structure to `learn/index.vue`), including that page's local `PreviewState` ref, `isActive` computed gating `AppTopbar`, and the fixed-position "PREVIEW AS" switcher pill — Make's own content doesn't branch on preview state, but every other dashboard-layout page carries this chrome, so Make matches for visual consistency.

Sections, each introduced by the existing `SectionTitle` component:

1. Page heading "Maker Tools" + one-line intro (ported from the reference's intro paragraph).
2. Web tools grid — `ToolCard` per entry in `webTools`.
3. "Threadbare Tailor" section, with the reference's one-line sub-app suite description, then a grid of `ToolCard` per entry in `tailorApps`.
4. "More game-making tools" section — a plain list of rows (logo, name, blurb, external-link icon), one per `externalTools` entry, each wrapped in a `UButton` (`variant="ghost"`, block, `:to="tool.url"` `target="_blank"`) — no new component, mirrors the reference's `ExternalToolRow` inline.

## Tool card component

New `app/components/ToolCard.vue`, reused for both the web-tools and Tailor grids (same shape in the reference, only content differs) — same kind of small reusable presentational component as `LearnProgramCard`/`ProgramTile`/`PostCard`, not a page-layout container:

- Header: `image` if present, else `logo` centered on a `logoBg`-colored block (matches the reference's image-or-logo fallback).
- `UBadge` (top-right overlay on the header) for `badge` ('Live' → success/soft, 'Beta' → warning/soft).
- Body: `tag` (small uppercase label), `name` (title), `blurb`.
- Footer: one `UButton` — `block`, `variant="soft"`, `color="neutral"`, icon `lucide:download` when `isDownload`, else `lucide:maximize`; label "Download" or "Launch tool". If `url` is absent, the button is `disabled` (Baby Godot in the reference has no working link yet).

Built on `UCard` (its `#header`/body/`#footer` slots are unopinionated, unlike `UPageCard`'s fixed icon+title+description layout — a better fit for a full-bleed image/logo thumbnail), consistent with how `LearnProgramCard`/cover-page cards already wrap Nuxt UI card primitives rather than hand-rolled bordered divs.

## Navigation change

`app/components/AppSidebar.vue`: the `Make` nav entry's `to` changes from `'#'` to `'/make'` (icon/color/label unchanged).

## Out of scope

- Any real tool embedding, launching, or account/session awareness.
- Gating or locked states.
- Editing the tool catalog (admin).
- The Endstar launcher promo modal.
