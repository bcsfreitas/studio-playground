# Learner Guides

Design and pedagogy standards for interactive learner guides — the single-scroll,
follow-along tutorials learners use beside Godot. Scoped to learner guides only;
facilitator scripts and slide decks have their own conventions.

This is a standing contract, living at repo root alongside `CLAUDE.md` and
`DESIGN.md`: it defers to both and merges them with the guide-family patterns
developed in the reference implementation, `godot-signals-guide-simple.html`
(hosted under `jgbourque.github.io/Guides/` — already restyled to these rules;
use it as the visual target).

**Precedence:** where the two touch the same ground, the platform rules win. They are
marked **[platform — non-negotiable]** throughout. Everything else is guide-family
convention — it exists to preserve what these guides *are*, so treat it as binding for
pedagogy and interaction, and negotiable only where it collides with a platform rule.

---

## The rules, up front

A guide is **done** when it satisfies both lists. Details for every line live in the
numbered sections below.

### Platform rules — non-negotiable

1. **Tokens only.** Every color, spacing, and radius maps to a platform token — no ad
   hoc values. (§6)
2. **Semantic color roles.** Primary orange is the accent. Teal is the reserved `kids`
   semantic — never a general accent (the player sprite inside figures is the sole,
   content-only exception). Checkpoints use `success` (lime). Godot node-icon blue is
   a light `info` (sky) step. Dark figure panels are `midnight` / `--ui-bg-inverted`. (§6)
3. **Contrast.** Never white text on solid primary/warning/info/success — use the soft
   pairing (tinted background + darker text). The step-done circle is soft, not solid. (§5, §6)
4. **Type.** Figtree headings, Inter body, Tailwind's standard scale. No third face —
   monospace only for code, figure labels, and step numbers. (§6)
5. **Nuxt UI first** on platform builds; custom markup only where justified (the
   wire/step-circle system, figure panels) and declared as such. (§7)
6. **Icons.** `lucide:*` for all page chrome; one invocation style, never mixed. (§7)
7. **Elevation.** Hairline `border-default` first; shadows only for hover-lift and
   genuinely floating elements. (§7)
8. **Motion.** Ease-out only — no bounce or overshoot. Animate `transform`/`opacity`
   only. Token durations for UI feedback. `prefers-reduced-motion` is required. (§4, §7)
9. **Layout.** `UContainer` wraps page content; `UPageCard` (3xl) for notes and
   checkpoints; custom cards at 2xl. (§7)
10. **Writing.** No AI filler in any copy, commit, or comment; comments explain the
    *why*. (§2, §7)

### Guide-family rules — preserve these

1. **One scrolling page.** Content is never gated, and never collapsed by default. (§1)
2. **Steps are continuous** across the guide, threaded on the wire; step labels state
   the real range ("Chapter 1 · steps 1–6"). (§1)
3. **One idea per figure**, split into concept figures and locator figures; play once
   on scroll-in, hold the end state, offer Replay; only the payoff animation loops.
   Figure panels are dark because Godot is dark. (§4)
4. **Show, don't tell.** UI affordances are taught by the wire-mounted demo legend
   (mini circle looping 1 → ✓), not by written how-to sentences. (§5)
5. **Click-to-complete.** Hover previews a ✓; clicking fills the circle (soft pairing)
   and collapses the step to its dimmed title; steps that truly complete a checkpoint
   item sync it via an explicit `data-check` id — never positional mapping. (§5)
6. **Natural language before jargon.** No identifier appears before the chapter that
   teaches it; terms are dotted click-to-define buttons with definitions on demand. (§2, §5)
7. **Checkpoints are things you did** — past-tense action verbs, both languages. (§2, §3)
8. **Concrete beats abstract.** Reading level: roughly grade 8–9 (≈1000L Lexile) as a
   suggested target — a feel for complexity and density, not a hard rule. No absolute
   claims; tips carry exactly one job (recovery, location, or why). (§2)
9. **Bilingual by construction.** Paired `.en`/`.es` spans side by side in the markup;
   Spanish tightened, not literal; shared `godot-guide-lang` persistence. (§3)
10. **Reference material ends the guide, un-gated.** (§1)
11. **Make the engine's thinking visible** — explain what Godot is doing and why, not
    just what to type. Each guide stands alone; a pause-before-test beat sits between
    building and running; new concepts arrive as staged reveals, not all at once. (§2)
12. **Figures depict the minimal case** — project extras stripped — and animations pace
    to wall-clock reading: slower plus Replay beats faster plus loop. (§4)
13. **Callouts are three primitives, one sprite.** Point at UI elements with
    `.callout-icon` + `.callout-cursor` + `.callout-pulse`, drawn from a single
    SVG sprite. No inline SVG paths in figure markup. (§4)

---

## 1. Format

One guide = one scrolling page. No step viewer, no autoplay, no hidden content.
The learner scrolls, reads a short block, does the thing in Godot, scrolls on.

Page anatomy, in order:

1. **Hero** — eyebrow (mono, uppercase), title (one accent-colored word max), 1–2 lede
   paragraphs, table of contents.
2. **Chapters** — big numeral + title, one-line goal, short intro paragraph, optional
   concept figure, then the steps.
3. **Steps label** — `Chapter N · steps X–Y` (mono, uppercase). Always state the actual
   range, never just "the steps."
4. **Steps** — numbered continuously across the whole guide (step 1 is the guide's first
   step, not each chapter's). Threaded on the vertical wire.
5. **Notes** — unnumbered concept blocks (tinted cards) for material that isn't a
   do-this step: pattern recaps, layers/masks explainers, "what just happened" traces.
6. **Checkpoints** — one per chapter (or per milestone), interactive checkboxes.
7. **Reference** — rebuild checklist + final script at the end. Never gated behind
   completion.

## 2. Pedagogy, voice, and copy

### Pedagogy

- **Make the engine's thinking visible.** Explain what Godot is doing and why, not just
  what to type — the "what just happened" trace exists for this. A learner should
  finish knowing what fired, who connected it, and where the code did its work.
- **Information on demand, not by default.** Learners can always move forward without
  reading everything; accordions and click-to-define terms serve the curious without
  blocking anyone else.
- **Teach the underlying concept, not a surface activity** that merely resembles it.
- **Tight conceptual frame.** One guide = one loop every learner runs. Variations are
  invitations at the end, never branches in the middle.
- **Pause before test.** Between building and running, insert a deliberate
  "make sure the pieces can find each other" beat (the layers/masks pattern) —
  a check-the-wiring moment before handing over the controls.
- **Staged reveals for new concepts.** Reveal one element at a time; showing everything
  at once reads as a summary for someone who already understands, not teaching for
  someone who doesn't.
- **Each guide stands alone.** Never assume another guide or module was read first.
- **Anticipate the common miss.** Where a step commonly fails (selection state, wrong
  parent), state the prevention in the step and put the recovery in a tip.

### Voice and copy

- Guide voice sits inside the product voice: warm, encouraging, journey-framed — but
  guides earn that warmth through clarity, not exclamation points. Never vague, never
  cheesy, no overclaiming superlatives.
- Reading level: aim for roughly grade 8–9 (≈1000L Lexile). Treat this as a suggested
  target, not a rigid cutoff — it exists to give a shared sense of how complex and
  dense guide text should feel. Short sentences. One idea per sentence where possible.
- **Examples follow abstractions.** State the idea first, then the example; an example
  never replaces the explanation.
- **Every do-step names the job** of the thing being added — why it's needed, not just
  the action ("the Area2D has no shape of its own; this node gives it one").
- **Name relationships precisely.** A root node *is* the object ("the Coin is an
  Area2D") — never phrase it as the object "having" its own root node.
- **Definitions show breadth.** When defining a general-purpose concept, say it has
  many uses and list a few — the guide's example must never read as the concept's
  only purpose.
- **Disambiguate final sentences.** Repeat the concrete noun ("the Player script")
  instead of a pronoun or short form wherever two readings are possible — takeaway
  lines get read fastest and misread easiest.
- **Copy matches the screen.** Never reference UI the learner can't see from where
  they are (line numbers with no gutter, buttons not in view, terms not yet taught).
- **Vary sentence structure and verbs** across neighboring steps — formulaic
  repetition reads as filler and trains skimming.
- **No absolute claims.** Not "all scenes," "every ability," "always." Hedge accurately
  ("most things you see on screen," "a circle works").
- **Invitational, not imperative, outside of steps.** Steps say "Add a Sprite2D."
  Concept text says "you can" / "this lets you."
- **Natural language before jargon.** A term the learner hasn't been taught yet may not
  appear in a figure or explanation — the Area2D figure says "something entered!", not
  `body_entered`, because that identifier hasn't been introduced. The real name arrives
  in the chapter that teaches it.
- **Concrete beats abstract in "why" explanations.** "Add a health pack later? Now it
  needs to know about those too" lands; "that doesn't scale" doesn't. Let the reader
  run the pattern themselves instead of naming the principle.
- **Checkpoints are things you did**, past tense, action verbs: "Opened a new blank
  scene," "Added an Area2D as the root node." Never state descriptions ("Coin is an
  Area2D").
- **Tips** are one or two sentences, styled as the quiet left-border line, and carry
  exactly one of: a recovery path ("if a node lands in the wrong place…"), a location
  ("the ▶ Play button lives top-right"), or a why ("the Area2D never looks at the
  image").
- Explanations that answer a likely learner question but aren't required to proceed go
  in a `<details>` accordion, not inline. Keep the answer under ~90 words.
- No AI filler in any copy, doc, comment, or commit ("let's dive in," "it's worth
  noting," "in summary"). State the thing directly. **[platform — non-negotiable]**

## 3. Localization

- Every piece of text is a paired `.en` / `.es` span, side by side in the markup,
  toggled by CSS (`html[data-lang]`). Editing a step means editing one place. No
  positional override arrays, ever again.
- Spanish is **tightened, not translated literally** — it must fit the same visual
  space and read at the same level. Checkpoint verbs use tú-form past tense
  (Abriste, Añadiste, Conectaste, Viste).
- Language choice persists in `localStorage` under the shared key `godot-guide-lang`
  so it carries across the guide family. Swap `document.title` on toggle.
- Screenshots of English UI are **not** re-shot for Spanish. Keep the English
  screenshot and add a fallback note if the mismatch could confuse; never show
  mismatched content silently.
- Figure labels, captions, legend text, and ARIA labels localize like everything else.

## 4. Figures

Two kinds, and every figure is exactly one of them:

- **Concept figures** teach an idea (what Area2D does, the pickup loop). They sit next
  to the sentence that states the idea — chapter intro concepts go with the intro,
  step mechanics go inside the step.
- **Locator figures** show *where a control lives* in Godot's UI: a slim strip of mock
  chrome with the target control held in a persistent accent outline. Include just
  enough surrounding chrome to orient (the Scene/Import dock tabs anchor the scene-tab
  strip). One control per figure. Steps that reuse a control already located get a
  text back-reference, not a repeat figure.

Rules for both:

- **One idea per figure.** If a figure needs two beats, they must be cause → effect of
  the same idea (attach button pulses → script icon appears).
- Dark panels (`--editor`) on the light page — not a style choice: figures depict
  Godot's dark editor, so dark is *accurate*. Page chrome stays light.
- **Play once on scroll-in** (IntersectionObserver), hold the end state, offer a small
  Replay button in the caption row. Only the guide's single payoff animation loops.
  Locator pulses run twice, then rest on the persistent outline.
- `prefers-reduced-motion`: everything jumps to its end state. The end state must be
  fully legible on its own.
- Godot node icons must match Godot: blue, correct silhouettes (Area2D = selection
  corners, Sprite2D = *rounded square* face, CollisionShape2D = square outline).
  Node names render light, icons blue — like the real Scene dock.
- **Minimal case only.** Strip project extras from mocks *and* screenshots — extra
  collision layers, sound-effect nodes, unrelated Inspector properties. Depict exactly
  the simple case the guide teaches; if a real screenshot carries extras, crop or dim
  them rather than explain them away.
- **Pace to wall-clock reading.** Animation timing is real seconds, never frame counts
  (frame-count timing runs 2–2.4× fast on high-refresh displays). When in doubt:
  slower plus Replay beats faster plus loop.
- Captions are one sentence, sentence case, and never repeat the step text.
- Any locator's mock interior may be swapped for a real screenshot `<img>` later
  without touching CSS/JS — build panels so that swap stays clean.

### Callouts inside figures

A locator's amber outline says *where a panel lives*. Callouts say *what to
click inside it* — an icon, a button, a menu item. Every guide will need to
point at UI elements, so callouts are a family primitive, not a per-guide
invention.

- **Three composable pieces**, no more:
  - **`.callout-icon`** — an inline icon rendered from the guide's SVG sprite.
    Sized in `em` by default so it scales with surrounding text; `.is-tiny`
    for cramped wireframes, `.is-large` for feature callouts. Color defaults
    to node-blue (`info`); override with `.is-amber` when the icon *is* the
    target being highlighted.
  - **`.callout-cursor`** — a small amber cursor arrow. Sits absolute-positioned
    off the bottom-right of its parent, pointing at whatever it's paired with.
    One shape, one size, one color.
  - **`.callout-pulse`** — a class you add to *any* element to make it emit two
    amber ring pulses when the parent `.fig-panel` gets `.play`, then rest.
    Same 1.6s ease-out timing across every guide.
- **Sprite, not inline SVG.** Every callout icon is a `<symbol>` in a hidden
  SVG sprite at the top of `<body>`, referenced via `<svg><use href="#..."/></svg>`.
  Adding a new icon = one `<symbol>` + one variant class. No inline SVG paths
  in figure markup — that's what makes copy-paste between guides safe.
- **The eye moves outline → callout in sequence.** Panel-level outline
  pulses first (delay ~1.0s), interior callout pulses second (delay ~1.6s).
  Same stagger every time; use the `--callout-delay` custom property to
  override only when a figure has more than one callout.
- **Callouts obey the motion rules.** `opacity`, `box-shadow`, and `transform`
  only. No layout-affecting properties. `prefers-reduced-motion` hides the
  pulse and cursor animations but keeps the icon visible, so "click this" is
  legible without motion.
- **One callout per figure by default.** Multiple callouts in one figure are
  allowed only when they're a cause-effect pair on the same idea (attach
  button pulses → script icon appears) — the same rule as figures overall.

## 5. Interaction patterns

- **Step completion.** Each step's number circle is the toggle: hover previews a ✓,
  click fills the circle (white ✓ on accent) and **collapses the step body to its
  dimmed title**. Click the circle or the title to reopen. Content is expanded by
  default — collapse is a consequence of the learner's progress, never a barrier in
  front of instructions.
- **Checkpoint sync.** Steps that genuinely complete a checkpoint item carry a
  `data-check` id pointing at that checkbox; toggling the step toggles the box. The
  mapping is explicit and per-step — never positional. Steps with no matching item
  still fill their circle and sync nothing.
- **The legend teaches by showing.** Each chapter's step list opens with a wire-mounted
  "row zero": a mini circle looping the interaction (1 → fills → ✓) at the same left
  position as the real circles, with at most three words beside it ("click when
  done"). No written how-to sentences for UI affordances.
- **Jargon terms** are dotted-underline buttons; clicking slides a definition card in
  under the paragraph (current language), click again or × to dismiss. Definitions
  live in one dictionary, both languages side by side.
- Keyboard: circles are focusable buttons (Enter/Space toggles) with `aria-pressed`
  and, on collapsible steps, `aria-expanded`. Localized `aria-label`s.
- Completion state is session-only for now. If guides gain persistence, decide it
  family-wide, not per guide.

## 6. Color and type roles

The prototype uses standalone hex values; on the platform, every role maps to a token.
Never introduce ad hoc values in platform builds — map to a ramp or raise it in
`DESIGN.md`. **[platform — non-negotiable]**

| Role | Prototype value | Platform mapping (per `DESIGN.md`) |
|---|---|---|
| Page background | `#f7f4ee` paper | `--ui-bg-muted` (slate-50 canvas) — the warm paper is prototype-only |
| Body ink | `#2b2733` | `--ui-text` (slate-800); headings `--ui-text-highlighted` (slate-950) |
| Interactive / progress / accent | `#e8963a` amber | **`primary` (orange, #ff6900)**. Do not keep the amber — it reads as the `warning` ramp (#e07100) on platform |
| Accent on dark panels | `#ffb454` | a light step of the primary ramp |
| Godot node-icon blue | `#7fb3e0` | a light step of **`info` (sky)** — *not* secondary; cornflower (#6556f0) is violet |
| Editor (figure) panels | `#201f28` | `--ui-bg-inverted` (midnight ramp) |
| Checkpoint / success tint | `#dcebe5` teal | **`success` (lime) soft variant** — tinted bg + darker text |
| Player sprite in figures | `#2e8c74` / `#5ec3a8` teal | **content depiction only** (it's the game's sprite art). Never in UI chrome: teal is the reserved `kids` semantic for youth-gated surfaces |
| Note-card tint | `#f6e3c8` amber | the `badge-primary-soft` pairing: primary-50 bg + primary-900 text |
| Hairline rules | `#e0dacd` | `--ui-border` |

**Contrast rule.** White on solid `primary` fails WCAG AA (~2.9:1) — a known platform-wide
gap. The step-done circle therefore uses the **soft pairing** on platform (primary-50
fill, primary-900 check, primary border), not white-on-solid. Same for any badge or
chip: prefer tinted-bg + darker-text over white-on-solid in `primary`/`warning`/
`info`/`success`.

**Type.** Headings: **Figtree** via `font-heading` (the platform has no third face —
Fraunces does not carry over). Body: Inter via `font-sans`. Sizes use Tailwind's
standard scale (`text-2xl`, `text-sm`, …), never a custom fixed-px scale. Code, figure
labels, and step numbers stay `ui-monospace` — a guide-family addition the platform
doesn't currently define; keep it scoped to those three uses.

## 7. Building on the platform

When a guide graduates from standalone HTML to a platform page, the Studio Home repo
rules apply in full. **[platform — non-negotiable]**

- Stack: Nuxt (Vue), Tailwind CSS v4, `@nuxt/ui` v4. Tokens follow the repo
  convention — color ramps in the Tailwind `@theme static` block, spacing/radius/
  shadow/semantic values as `--ui-*` custom properties.
- **Nuxt UI first.** Check for an existing component before writing markup; never
  hand-roll what `@nuxt/ui` provides. Expected mappings: checkpoint items →
  `UCheckbox`, the why-accordion → `UAccordion`/`UCollapsible`, Replay → `UButton`,
  term definitions → `UPopover` or a collapsible, the language toggle → button group.
  Custom components are justified only for the wire/step-circle system and the figure
  panels — and say so explicitly when hand-rolling.
- Consult the `nuxt-ui` skill for component APIs before guessing; use the
  `nuxt-ui-remote` MCP for anything the skill doesn't cover.
- Icons: `lucide` via `@nuxt/icon` for all *page chrome* (replay, close, chevrons —
  no emoji in platform builds). Godot node icons stay custom, because accuracy to
  Godot's own iconography is the point. The callout sprite pattern (§4) carries
  over verbatim on platform — Godot icons remain `<symbol>` refs; only page-chrome
  icons swap to `lucide`.
- Comments explain the *why* — a constraint, a workaround, an invariant — never the
  *what*. Applies to guide code the same as app code.
- Writing style rules (§2, last bullet) govern commits, PRs, and docs for guide work.
- **Layout:** page content wraps in `<UContainer>` (`--ui-container` 1080px) — never a
  bespoke `max-w-*` div. The guide column reads best well under that; constrain the
  *text measure* with typography, not custom containers.
- **Cards:** `UPageCard` is the card primitive (platform-forced `rounded-3xl`). Notes
  and checkpoints become `UPageCard` variants; figure panels are custom markup and
  follow the custom-card convention (`rounded-2xl`).
- **Elevation:** hierarchy comes from a `border-default` hairline first. Figure
  panels, defboxes, and notes are flat-with-a-border; shadows only for hover-lift and
  genuinely floating elements (menus, popovers) using the named shadow tokens.
- **Motion:** UI feedback uses `--duration-fast`/`--duration-base` — don't invent
  durations. Easing is confident deceleration only (ease-out family); **no overshoot
  or bounce** — the prototype's attach-icon pop easing (`cubic-bezier(.34,1.56,.64,1)`)
  must be replaced with an ease-out on platform. Animate `transform`/`opacity` only:
  the prototype's two `left`-based figure animations (Area2D approach, pickup walk)
  convert to `translateX`, and the step collapse (`grid-template-rows`) becomes
  `UCollapsible`, which owns that problem. Teaching-figure *beat timing* (how long a
  concept holds on screen) is content pacing, not UI motion — those longer durations
  are exempt from the duration tokens but not from the easing/GPU rules.
  `prefers-reduced-motion` support is required, not optional.
- **Icons:** all page-chrome icons are `lucide:*`. Don't mix `<Icon>` and `<UIcon>` —
  adopt whichever invocation the repo standardizes on and use it exclusively in guide
  components.

## 8. QA checklist

Run before every publish of a standalone guide:

- [ ] JS: extract `<script>`, `node -c` passes.
- [ ] HTML: `html5lib.parse()` passes; div/section/figure open–close counts match.
- [ ] i18n: `.en` span count equals `.es` span count.
- [ ] Terms: every `data-t` key exists in the definitions dictionary.
- [ ] Completion: every `data-check` id has a matching checkbox id, and vice versa.
- [ ] Reduced motion: end states legible with animations off.
- [ ] Keyboard: tab to any circle, Enter/Space toggles; terms and replays reachable.
- [ ] Language toggle: no raw placeholder text in either language, title swaps.
- [ ] Figures: each plays once on scroll-in, Replay restarts it, captions localized.
- [ ] Callouts: every icon references the SVG sprite via `<use href="#...">` — no
      inline `<path>` data inside figure markup outside the sprite itself.
- [ ] Motion (platform builds): no overshoot/bounce easing; animations touch only
      `transform`/`opacity`; durations from tokens for UI feedback.
- [ ] Contrast: no white text on solid primary/warning/info/success — soft pairings.
- [ ] No teal outside figure content — `kids` is reserved.

## 9. Files

- One guide = one self-contained `.html` file (fonts via CDN allowed, no local deps).
- Naming: `godot-<topic>-guide-simple.html` while both formats coexist; drop the
  suffix if the simple format becomes the only one. Reference copies stay hosted
  (see above) rather than committed to the app repo.
- Hosted under `jgbourque.github.io/Guides/godot-platformer/<topic>/` until platform
  migration.

## 10. Self-update

When a review round produces a rule that would apply to any future guide (not just the
current edit), add it here — in the section it fits — rather than letting it live only
in a conversation. Before adding, scan for an existing rule covering the same ground
and tighten that instead of duplicating. **[platform convention, adopted here]**
