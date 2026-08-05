# Carried forward from slice 1 (program page shell)

Findings raised during slice 1's task reviews and the final whole-branch review that were deliberately **not** fixed. Each was triaged as safe to carry. Pick these up in the slice that owns the surrounding code rather than as a separate cleanup pass.

Branch: `program-rework`. Slice 1 spec: `2026-08-05-program-page-shell-design.md`.

## Blocks nothing, but fix when you touch the file

| Item | Location | Why it was carried |
|---|---|---|
| Workshop join records nothing — the same workshop can be joined repeatedly with no feedback | `ProgramEnrollmentCard.vue` `confirmEnrollment` | Nothing in the mock persists enrollment; cohort enrollment is equally session-only. Belongs with the real enrollment backend. |
| `cohortStatusFor` returns `already-enrolled` for a record whose `phase` is `interested` | `useProgramMockData.ts` | Unreachable today — the only `interested` fixture points at a workshop-series program, which bypasses this path. Fix alongside the real enrollment model. |
| Classroom's sticky aside has no collapse affordance below `lg`, so the whole module accordion precedes lesson content | `classroom.vue` | The Classroom rework is its own slice; a collapse built now gets thrown away with it. |
| `learn/index.vue` uses no `useI18n()` at all — every string is hardcoded | `app/pages/learn/index.vue` | Pre-existing and page-wide, outside slice 1's scope. The "Dificulty" typo in it *was* fixed. |
| Mobile and sticky-rail `ProgramEnrollmentCard` instances hold fully independent state — unlocking an access code on one leaves the other locked across a viewport change | `[programId]/index.vue` | Structural; wants one card repositioned with CSS `order`, or the state lifted into the page. |
| `EnrollmentRecord.learnerId: PreviewState` is never read, and is the only thing making `programData/` depend on `useHomeMockData` | `programData/types.ts` | Dropping it makes the data layer self-contained. Safe but touches shared types. |
| Eight orphaned i18n keys: `program.facts.{difficulty,language,learningType,totalXp}`, `program.hero.facilitatedBy`, and `program.badges.tier.*` if the tier badge is ever removed | both locale files | Pre-existing; verified unused at merge-base too. |
| `DevPreviewBar` phase chips are `<div @click>` with no `role`/`tabindex` — mouse-only | `DevPreviewBar.vue` | Dev-only scaffolding. Three near-identical copies also live in `pages/{index,learn/index,make/index}.vue`, keyed on `PreviewState`, and will drift independently. |
| `NO_TESTIMONIALS` is one shared array referenced by all four templates | `programData/templates.ts` | Nothing mutates it today. Use `readonly Testimonial[]` or a literal per template. |
| Explore: Godot's one real instance is both past (ended 2026-06-11) and full (68/68) | `programData/instances.ts` | Working as designed — it is filtered out of the picker and reappears correctly for the `completed` phase. Keeping the one genuinely-dated cohort is worth more than picker symmetry. |
| `explore-godot` deliverable ids are module-numbered while sibling ids are session-numbered | `programData/curriculum.ts` | Internal ids, never rendered. |
| "Content Guidelines" is title-cased; the source deck says lowercase "content guidelines" | `programData/curriculum.ts` | One resource title's capitalization. |

## Needs a decision, not just a fix

**No route guard on learner-only tabs.** Gating is nav-level only: with phase `interested`, Classroom, Resources, and About are absent from the tab strip, but navigating directly to `/learn/<slug>/classroom` renders the full page, and the three-item nav then highlights nothing. There is no auth layer in the app at all, so this is a gap the phase work exposed rather than one it created. Add a real guard when session state lands.

## Source-document bugs (upstream, not code)

- `Explore-Threadbare/curriculum.md:3` says "five disciplines" but only four discipline headings exist in that file or its `sessions.md`. The data follows the four actual headings.
- `02-programs-and-offerings.md:12` says Explore: Godot runs 90-minute sessions; `Explore-Godot/curriculum.md:3` says 60. The data uses 60, with the conflict recorded in `instances.ts`.
- Neither microcredential's criteria text exists in any source doc — only the counts (7 and 3). The criteria labels in `credentials.ts` are synthesized and marked as such.
