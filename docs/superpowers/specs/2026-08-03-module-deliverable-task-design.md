# Module deliverable task

## Problem

Every module ends with a plain `task` item — same content-viewer treatment as everything else (placeholder box + "Mark as complete"). There's no way for a learner to actually submit their work at the end of a module: no description field, no way to attach links to what they built.

## Design

**New item type** — `CurriculumItemType` gains `'deliverable'`. `CurriculumItem` gains an optional `acceptanceCriteria?: string[]`, set only on deliverables.

**Mock data** — every module gets one deliverable item appended after its existing items (in addition to, not replacing, the module's current last task).

- Intro to Game Design's two modules get bespoke deliverables (real titles/XP/criteria matching their actual content: paper prototype, first playable level).
- Every other module across every other program gets a generic templated deliverable: title `Submit your {module title} work`, a flat XP value, and a generic 3-item acceptance-criteria list.
- Each program's `totalXp` increases by the sum of its new deliverables' XP, so `ProgramFactsStrip`'s displayed total stays accurate.

**Milestone numbering** — "Milestone `moduleNumber` of `template.curriculum.length`" is derived at render time from data already on `FlatCurriculumItem` (`moduleNumber`) plus `template.curriculum.length`. No new field.

**Content viewer** (`ProgramContentViewer.vue`) — deliverable items skip the generic placeholder-box layout entirely. Instead, below the existing module-badge eyebrow (module number/color/title — content-type suffix omitted since it doesn't apply to deliverables) and the `h1` title:

1. Fixed instructional copy (static, not per-module): what can be shared (a link to screenshots, a short video, or a playable build) and what the description field should cover.
2. "Milestone X of Y" line.
3. Bulleted acceptance criteria (`item.acceptanceCriteria`).
4. XP reward line (reuses existing `item.xp`).
5. A "Start this task" button, top-right of the title row, shown only when not yet completed and not yet started.

Clicking Start reveals a submission form inline, appended below the above (no route or tab change): a description textarea, a repeatable link field ("Add another link" adds one more input), and a Submit button. Submit requires a non-empty description. On submit, the component emits the same `mark-complete` the rest of the app already uses — same completion/XP/unlock mechanics, no new status like "pending review."

If the item is already completed (including on revisit after a page reload), show the standard completed state (`Completed` badge + "Go to next item") plus a read-only recap of the stored submission (description + links) instead of the Start button/form.

**Persistence** (`useProgramProgress.ts`) — `StoredProgress` bumps to `version: 2`, adding `submissions: Record<string, { description: string; links: string[] }>`. Reading a `version: 1` blob (or a missing `submissions` key) defaults it to `{}` — purely additive, no migration logic needed. New exports: `getSubmission(itemId)` and `submitDeliverable(itemId, payload)` (stores the payload, calls the existing complete-and-persist path) alongside the existing `isCompleted`/`markComplete`.

**Icons** — `ITEM_TYPE_ICON` in both `ProgramSidebar.vue` and `ProgramCurriculumAccordion.vue` gets `deliverable: 'lucide:upload'`.

## Out of scope

- Real file uploads — links only, per explicit decision (no backend to store files against anyway).
- A separate "pending review" status or any facilitator-side review flow — submitting completes the item immediately, same as every other item type.
- A skills/badges taxonomy — rewards stay XP-only, no new "skill" concept.
- Bespoke deliverable copy for programs other than Intro to Game Design — those get the generic template; can be revisited per-program later.
