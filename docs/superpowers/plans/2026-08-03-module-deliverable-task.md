# Module Deliverable Task Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every curriculum module a capstone "deliverable" item where the learner reads acceptance criteria, starts the task, submits a description + links, and completes it — same completion/XP/unlock mechanics as every other item type.

**Architecture:** One new `CurriculumItemType` (`'deliverable'`) plus one new optional field (`acceptanceCriteria`) on `CurriculumItem`. `ProgramContentViewer.vue` branches its template on `item.type === 'deliverable'` to render an overview (instructions, milestone, acceptance criteria, XP) and an inline submission form (textarea + `UInputTags` for links), instead of the generic placeholder-box layout. `useProgramProgress.ts`'s existing localStorage-backed completion tracking gains a parallel `submissions` map, bumping its stored schema to `version: 2` (additive, no migration needed).

**Tech Stack:** Vue 3 `<script setup>`, `@nuxt/ui` v4 (`UTextarea`, `UInputTags`, `UBadge`, `UButton`), `@nuxtjs/i18n`. No test framework exists in this repo (per `CLAUDE.md`) — verification is manual, via the dev server.

## Global Constraints

- No backend: submissions are links (URLs) only, stored client-side in `localStorage` alongside completion state — no real file upload.
- Submitting a deliverable completes it immediately (same as every other item type) — no "pending review" status.
- No skills/badges taxonomy — rewards stay XP-only.
- Use existing `@nuxt/ui` components; never hand-roll what the library already provides (project rule, `CLAUDE.md`).
- Follow the spec at `docs/superpowers/specs/2026-08-03-module-deliverable-task-design.md`.

---

### Task 1: Curriculum data model + mock deliverables + type icons

**Files:**
- Modify: `app/composables/useProgramMockData.ts:6` (type union), `:26-32` (interface), after `:122` (new constants), all 5 `curriculum` arrays, all 5 `totalXp` fields
- Modify: `app/components/ProgramSidebar.vue:23-28` (`ITEM_TYPE_ICON`)
- Modify: `app/components/ProgramCurriculumAccordion.vue:11-16` (`ITEM_TYPE_ICON`)

**Interfaces:**
- Produces: `CurriculumItemType` now includes `'deliverable'`. `CurriculumItem.acceptanceCriteria?: string[]`. Every module's `items` array ends with one item of `type: 'deliverable'`.

- [ ] **Step 1: Extend the type union and interface**

In `app/composables/useProgramMockData.ts`, change line 6:

```ts
export type CurriculumItemType = 'topic' | 'survey' | 'task' | 'resource' | 'deliverable'
```

And the `CurriculumItem` interface (lines 26-32):

```ts
export interface CurriculumItem {
  id: string
  type: CurriculumItemType
  title: string
  xp: number
  contentType: CurriculumContentType
  acceptanceCriteria?: string[]
}
```

- [ ] **Step 2: Add shared constants for generically-templated deliverables**

Immediately after the `MODULE_COLORS` export (currently line 122), add:

```ts
// Shared by every generically-templated module deliverable (every module
// outside Intro to Game Design, which gets bespoke deliverable copy).
const GENERIC_DELIVERABLE_XP = 200
const GENERIC_ACCEPTANCE_CRITERIA = [
  'Your work for this module is shared with a link to a screenshot, short video, or playable build.',
  'The submission explains what you built or changed and why.',
  'The result works without breaking the rest of the project.'
]
```

- [ ] **Step 3: Append the Intro to Game Design deliverables (bespoke copy) and bump its totalXp**

Change `totalXp: 500` to `totalXp: 950` for the `intro-game-design` program.

Append to `module-igd-design-basics`'s `items` array (after `item-igd-paper-prototype`):

```ts
{
  id: 'item-igd-concept-deliverable',
  type: 'deliverable',
  title: 'Submit Your Paper Prototype',
  xp: 200,
  contentType: 'text',
  acceptanceCriteria: [
    'A core-loop sketch and a playable paper prototype are both shared, with a photo or short video of the prototype in action.',
    'The submission explains the core loop and what the prototype is meant to test.',
    'Another person can play the prototype start to finish without extra explanation from you.'
  ]
}
```

Append to `module-igd-build-your-prototype`'s `items` array (after `item-igd-playtest-survey`):

```ts
{
  id: 'item-igd-first-level-deliverable',
  type: 'deliverable',
  title: 'Submit Your First Playable Level',
  xp: 250,
  contentType: 'text',
  acceptanceCriteria: [
    'A playable build or a video walkthrough of your first level is shared.',
    'The submission notes which engine you used and one thing that was hard to get working.',
    'The level can be played from start to finish without crashing.'
  ]
}
```

- [ ] **Step 4: Append generic deliverables to every other program's modules, bump their totalXp**

For each program below, change `totalXp` to the new value and append one item (using `GENERIC_DELIVERABLE_XP` and `GENERIC_ACCEPTANCE_CRITERIA` from Step 2) to the end of each listed module's `items` array.

**`pixel-art-foundations`** — `totalXp: 900` → `totalXp: 1500`

```ts
// append to module-pixel-fundamentals
{ id: 'item-pixel-fundamentals-deliverable', type: 'deliverable', title: 'Submit your Pixel Fundamentals work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
// append to module-palettes-shading
{ id: 'item-palettes-shading-deliverable', type: 'deliverable', title: 'Submit your Palettes & Shading work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
// append to module-export-reuse
{ id: 'item-export-reuse-deliverable', type: 'deliverable', title: 'Submit your Export & Reuse work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
```

**`ship-your-first-game`** — `totalXp: 1400` → `totalXp: 2200`

```ts
// append to module-prototype-to-playable
{ id: 'item-prototype-to-playable-deliverable', type: 'deliverable', title: 'Submit your Prototype to Playable work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
// append to module-systems-polish
{ id: 'item-systems-polish-deliverable', type: 'deliverable', title: 'Submit your Systems & Polish work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
// append to module-team-workflow
{ id: 'item-team-workflow-deliverable', type: 'deliverable', title: 'Submit your Team Workflow work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
// append to module-ship-it
{ id: 'item-ship-it-deliverable', type: 'deliverable', title: 'Submit your Ship It work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
```

**`level-design-lab`** — `totalXp: 1050` → `totalXp: 1650`

```ts
// append to module-layout-fundamentals
{ id: 'item-layout-fundamentals-deliverable', type: 'deliverable', title: 'Submit your Layout Fundamentals work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
// append to module-encounter-design
{ id: 'item-encounter-design-deliverable', type: 'deliverable', title: 'Submit your Encounter Design work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
// append to module-polish-ship
{ id: 'item-polish-ship-deliverable', type: 'deliverable', title: 'Submit your Polish & Ship work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
```

**`creature-rigging-crash-course`** — `totalXp: 800` → `totalXp: 1400`

```ts
// append to module-skeleton-basics
{ id: 'item-skeleton-basics-deliverable', type: 'deliverable', title: 'Submit your Skeleton Basics work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
// append to module-weight-painting
{ id: 'item-weight-painting-deliverable', type: 'deliverable', title: 'Submit your Weight Painting work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
// append to module-animate
{ id: 'item-animate-deliverable', type: 'deliverable', title: 'Submit your Animate work', xp: GENERIC_DELIVERABLE_XP, contentType: 'text', acceptanceCriteria: GENERIC_ACCEPTANCE_CRITERIA }
```

- [ ] **Step 5: Add the deliverable icon everywhere `ITEM_TYPE_ICON` is defined**

In both `app/components/ProgramSidebar.vue` and `app/components/ProgramCurriculumAccordion.vue`, the `ITEM_TYPE_ICON` record is typed `Record<CurriculumItemType, string>` — TypeScript requires every key, so both need the new entry:

```ts
const ITEM_TYPE_ICON: Record<CurriculumItemType, string> = {
  task: 'lucide:circle-check',
  topic: 'lucide:file-text',
  survey: 'lucide:message-square-text',
  resource: 'lucide:link',
  deliverable: 'lucide:upload'
}
```

- [ ] **Step 6: Verify**

Start the dev server (`npm run dev`), open `/learn/intro-game-design/program`, clear `localStorage` (devtools → Application, or `localStorage.clear()` in the console) and reload. Confirm:
- The sidebar's "Design Basics" module now lists 4 items, the last being "Submit Your Paper Prototype" with an upload icon.
- The sidebar's "Build Your Prototype" module lists 4 items, ending in "Submit Your First Playable Level".
- The XP line under the program title reads `0 / 950 XP`.
- Open `/learn/intro-game-design` (the program detail page) and expand the curriculum accordion — the same two deliverable items appear there with the upload icon, no console errors.

- [ ] **Step 7: Commit**

```bash
git add app/composables/useProgramMockData.ts app/components/ProgramSidebar.vue app/components/ProgramCurriculumAccordion.vue
git commit -m "Add deliverable curriculum item type and module-ending deliverables"
```

---

### Task 2: i18n copy for the deliverable UI

**Files:**
- Modify: `i18n/locales/en.json` (inside the existing `program.viewer` object)
- Modify: `i18n/locales/es.json` (inside the existing `program.viewer` object)

**Interfaces:**
- Produces: translation keys under `program.viewer.deliverable.*` that Task 3 consumes: `startTask`, `descriptionHeading`, `introBody`, `shareIntro`, `shareScreenshots`, `shareVideo`, `shareBuild`, `submitStepsHeading`, `submitStep1`, `submitStep2`, `submitStep3`, `milestone` (params `number`, `total`, `title`), `acceptanceCriteria`, `descriptionPlaceholder`, `linksPlaceholder`, `submit`, `yourSubmission`.

- [ ] **Step 1: Add the English keys**

In `i18n/locales/en.json`, inside `program.viewer` (as a sibling of `exit`/`sidebar`/`actions`/`content`/`notFound`), add:

```json
"deliverable": {
  "startTask": "Start this task",
  "descriptionHeading": "Description",
  "introBody": "Share proof of what you built for this module - a link to screenshots, a short video, or a playable build if you have one.",
  "shareIntro": "You can share:",
  "shareScreenshots": "A link to screenshots",
  "shareVideo": "A link to a short video",
  "shareBuild": "A link to a playable build (such as a zipped export of your game)",
  "submitStepsHeading": "To submit your work:",
  "submitStep1": "Click Start this task to open the submission form.",
  "submitStep2": "Add one or more links to what you built.",
  "submitStep3": "In the description field, explain what you changed and why.",
  "milestone": "Milestone {number} of {total}: {title}",
  "acceptanceCriteria": "Acceptance Criteria:",
  "descriptionPlaceholder": "Describe what you changed and how it affected the player experience...",
  "linksPlaceholder": "Paste a link and press Enter",
  "submit": "Submit for completion",
  "yourSubmission": "Your submission"
}
```

(Follow this project's writing-style rule of plain hyphens, not em dashes, in copy — matching the existing `"emailNotice"` string's `-` usage a few lines up.)

- [ ] **Step 2: Add the Spanish keys**

In `i18n/locales/es.json`, inside `program.viewer`, add:

```json
"deliverable": {
  "startTask": "Iniciar esta tarea",
  "descriptionHeading": "Descripción",
  "introBody": "Comparte evidencia de lo que construiste para este módulo: un enlace a capturas de pantalla, un video corto o una versión jugable si la tienes.",
  "shareIntro": "Puedes compartir:",
  "shareScreenshots": "Un enlace a capturas de pantalla",
  "shareVideo": "Un enlace a un video corto",
  "shareBuild": "Un enlace a una versión jugable (como un export comprimido de tu juego)",
  "submitStepsHeading": "Para enviar tu trabajo:",
  "submitStep1": "Haz clic en Iniciar esta tarea para abrir el formulario de envío.",
  "submitStep2": "Agrega uno o más enlaces a lo que construiste.",
  "submitStep3": "En el campo de descripción, explica qué cambiaste y por qué.",
  "milestone": "Hito {number} de {total}: {title}",
  "acceptanceCriteria": "Criterios de aceptación:",
  "descriptionPlaceholder": "Describe qué cambiaste y cómo afectó la experiencia del jugador...",
  "linksPlaceholder": "Pega un enlace y presiona Enter",
  "submit": "Enviar para completar",
  "yourSubmission": "Tu envío"
}
```

- [ ] **Step 3: Verify**

```bash
node -e "JSON.parse(require('fs').readFileSync('i18n/locales/en.json'));JSON.parse(require('fs').readFileSync('i18n/locales/es.json'));console.log('ok')"
```
Expected: `ok` (both files still parse as valid JSON).

- [ ] **Step 4: Commit**

```bash
git add i18n/locales/en.json i18n/locales/es.json
git commit -m "Add i18n copy for the deliverable submission UI"
```

---

### Task 3: Deliverable content viewer, persistence, and page wiring (end-to-end)

**Why one task:** the content viewer's props/emit (this task's Step 1) and the composable's return shape (Step 2) and the page wiring (Step 3) only make sense — and can only be verified — together. Splitting them into separate tasks would leave every one of them unverifiable in isolation (Step 1 alone: the parent doesn't pass its new props yet; Step 2 alone: nothing calls it; Step 3 alone: the component it wires doesn't exist yet), which violates "each task ends with an independently testable deliverable." This task's single end-to-end verify step (Step 4) is the first point any of this is actually testable.

**Files:**
- Modify: `app/components/ProgramContentViewer.vue` (full rewrite)
- Modify: `app/composables/useProgramProgress.ts` (full rewrite)
- Modify: `app/pages/learn/[programId]/program.vue` (template only)

**Interfaces:**
- Consumes: `FlatCurriculumItem` (from `useProgramCurriculum`, unchanged — `acceptanceCriteria` flows through automatically since `FlatCurriculumItem extends CurriculumItem`).
- Produces (internal to this task, not consumed by any other task in this plan): `DeliverableSubmission` interface (`{ description: string; links: string[] }`), exported from `useProgramProgress.ts`. `ProgramContentViewer` gains props `totalModules: number`, `submission: DeliverableSubmission | undefined` and emit `'submit-deliverable': [payload: DeliverableSubmission]`. `useProgramProgress(template)`'s return value gains `getSubmission(itemId: string): DeliverableSubmission | undefined` and `submitDeliverable(itemId: string, submission: DeliverableSubmission): void`.

- [ ] **Step 1: Rewrite `ProgramContentViewer.vue`**

Replace the entire contents of `app/components/ProgramContentViewer.vue` with:

```vue
<script setup lang="ts">
import type { FlatCurriculumItem } from '~/composables/useProgramCurriculum'
import type { DeliverableSubmission } from '~/composables/useProgramProgress'

const props = defineProps<{
  item: FlatCurriculumItem
  isCompleted: boolean
  totalModules: number
  submission: DeliverableSubmission | undefined
}>()

const emit = defineEmits<{
  'mark-complete': []
  'next-item': []
  'submit-deliverable': [payload: DeliverableSubmission]
}>()

const { t } = useI18n()

const isStarted = ref(false)
const description = ref('')
const links = ref<string[]>([])

function submitDeliverable() {
  const trimmed = description.value.trim()
  if (!trimmed) return
  emit('submit-deliverable', { description: trimmed, links: links.value.filter(Boolean) })
}
</script>

<template>
  <div class="flex-1 p-8 overflow-y-auto">
    <!-- Mirrors ProgramCurriculumAccordion's module container (rounded-2xl
         border, color-tinted badge/title) so the active module's identity
         carries over from the sidebar into the content viewer. -->
    <div class="rounded-2xl border border-default p-8">
      <div class="flex items-center gap-2.5">
        <UBadge
          :label="item.moduleNumber"
          :color="item.moduleColor"
          variant="soft"
          class="rounded-full size-7 justify-center p-0 shrink-0"
        />
        <span class="font-heading font-bold text-sm" :class="`text-${item.moduleColor}-600`">
          {{ item.moduleTitle }}
        </span>
        <span v-if="item.type !== 'deliverable'" class="text-xs text-muted uppercase">· {{ item.contentType }}</span>
      </div>

      <template v-if="item.type === 'deliverable'">
        <div class="flex items-start justify-between gap-4 mt-3">
          <h1 class="text-2xl font-heading font-bold text-highlighted">{{ item.title }}</h1>
          <UButton
            v-if="!isCompleted && !isStarted"
            :label="t('program.viewer.deliverable.startTask')"
            color="primary"
            class="shrink-0"
            @click="isStarted = true"
          />
        </div>

        <div class="mt-6">
          <div class="font-heading font-bold text-highlighted">{{ t('program.viewer.deliverable.descriptionHeading') }}</div>
          <p class="mt-2 text-sm text-default">{{ t('program.viewer.deliverable.introBody') }}</p>
          <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.shareIntro') }}</p>
          <ul class="mt-1 list-disc pl-5 text-sm text-default">
            <li>{{ t('program.viewer.deliverable.shareScreenshots') }}</li>
            <li>{{ t('program.viewer.deliverable.shareVideo') }}</li>
            <li>{{ t('program.viewer.deliverable.shareBuild') }}</li>
          </ul>
          <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.submitStepsHeading') }}</p>
          <ul class="mt-1 list-disc pl-5 text-sm text-default">
            <li>{{ t('program.viewer.deliverable.submitStep1') }}</li>
            <li>{{ t('program.viewer.deliverable.submitStep2') }}</li>
            <li>{{ t('program.viewer.deliverable.submitStep3') }}</li>
          </ul>
        </div>

        <div class="mt-6 rounded-xl border border-default p-6">
          <div class="font-heading font-bold text-highlighted">
            {{ t('program.viewer.deliverable.milestone', { number: item.moduleNumber, total: totalModules, title: item.moduleTitle }) }}
          </div>
          <div class="mt-3 text-sm font-bold text-default">{{ t('program.viewer.deliverable.acceptanceCriteria') }}</div>
          <ul class="mt-1 list-disc pl-5 text-sm text-default">
            <li v-for="criterion in item.acceptanceCriteria" :key="criterion">{{ criterion }}</li>
          </ul>
        </div>

        <div class="mt-4 text-sm text-muted">+{{ item.xp }} XP</div>

        <div v-if="isCompleted" class="mt-6 flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <UBadge :label="t('program.viewer.actions.completed')" color="success" variant="soft" />
            <UButton :label="t('program.viewer.actions.nextItem')" variant="outline" @click="$emit('next-item')" />
          </div>
          <div v-if="submission" class="rounded-xl border border-default p-4">
            <div class="text-sm font-bold text-highlighted">{{ t('program.viewer.deliverable.yourSubmission') }}</div>
            <p class="mt-2 text-sm text-default">{{ submission.description }}</p>
            <ul v-if="submission.links.length" class="mt-2 list-disc pl-5 text-sm">
              <li v-for="link in submission.links" :key="link">
                <a :href="link" target="_blank" rel="noopener" class="text-primary underline break-all">{{ link }}</a>
              </li>
            </ul>
          </div>
        </div>

        <div v-else-if="isStarted" class="mt-6 flex flex-col gap-3">
          <UTextarea
            v-model="description"
            :placeholder="t('program.viewer.deliverable.descriptionPlaceholder')"
            :rows="4"
          />
          <UInputTags
            v-model="links"
            :placeholder="t('program.viewer.deliverable.linksPlaceholder')"
          />
          <UButton
            :label="t('program.viewer.deliverable.submit')"
            color="primary"
            class="self-start"
            :disabled="!description.trim()"
            @click="submitDeliverable"
          />
        </div>
      </template>

      <template v-else>
        <h1 class="text-2xl font-heading font-bold text-highlighted mt-3">{{ item.title }}</h1>

        <div class="mt-6 rounded-xl border border-dashed border-default p-12 text-center text-muted">
          {{ t('program.viewer.content.placeholder', { contentType: item.contentType }) }}
        </div>

        <div class="mt-6 flex items-center gap-3">
          <span v-if="item.xp" class="text-sm text-muted">+{{ item.xp }} XP</span>

          <UButton
            v-if="!isCompleted"
            :label="t('program.viewer.actions.markComplete')"
            color="primary"
            @click="$emit('mark-complete')"
          />
          <template v-else>
            <UBadge :label="t('program.viewer.actions.completed')" color="success" variant="soft" />
            <UButton :label="t('program.viewer.actions.nextItem')" variant="outline" @click="$emit('next-item')" />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
```

Note `props` is declared but template accesses `item`/`isCompleted`/etc. directly (unwrapped) — this matches the existing file's style (Vue's `<script setup>` template compiler auto-unwraps `defineProps` results referenced by name), so no `props.` prefix needed in the template, consistent with how `item` and `isCompleted` were already used before this change.

- [ ] **Step 2: Rewrite `useProgramProgress.ts`**

Replace the entire contents of `app/composables/useProgramProgress.ts` with:

```ts
import type { ProgramTemplate } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'

export interface DeliverableSubmission {
  description: string
  links: string[]
}

interface StoredProgress {
  version: 2
  completedItemIds: string[]
  submissions: Record<string, DeliverableSubmission>
}

function storageKey(programId: string) {
  return `program-progress:${programId}`
}

// Per-item completion has no backend to live in, so it's tracked entirely
// client-side in localStorage, keyed by programId only — there's one
// mock-learner concept in this app (the dev-only "PREVIEW AS" toggle isn't
// a real multi-account system), so finer keying would be unused complexity.
export function useProgramProgress(template: ProgramTemplate) {
  const completedItemIds = useState<Set<string>>(`program-progress-${template.id}`, () => new Set())
  const submissions = useState<Record<string, DeliverableSubmission>>(
    `program-submissions-${template.id}`,
    () => ({})
  )

  onMounted(() => {
    if (!import.meta.client) return
    const raw = localStorage.getItem(storageKey(template.id))
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Partial<StoredProgress>
      completedItemIds.value = new Set(parsed.completedItemIds ?? [])
      submissions.value = parsed.submissions ?? {}
    } catch {
      // Corrupt/old localStorage value — ignore and start fresh.
    }
  })

  function persist() {
    if (!import.meta.client) return
    const payload: StoredProgress = {
      version: 2,
      completedItemIds: [...completedItemIds.value],
      submissions: submissions.value
    }
    localStorage.setItem(storageKey(template.id), JSON.stringify(payload))
  }

  function isCompleted(itemId: string) {
    return completedItemIds.value.has(itemId)
  }

  function markComplete(itemId: string) {
    if (completedItemIds.value.has(itemId)) return
    completedItemIds.value = new Set(completedItemIds.value).add(itemId)
    persist()
  }

  function getSubmission(itemId: string) {
    return submissions.value[itemId]
  }

  // Deliverables complete the same way every other item does — submitting
  // just also stashes what was submitted so it can be shown back to the
  // learner on revisit.
  function submitDeliverable(itemId: string, submission: DeliverableSubmission) {
    submissions.value = { ...submissions.value, [itemId]: submission }
    completedItemIds.value = new Set(completedItemIds.value).add(itemId)
    persist()
  }

  const items = flattenCurriculum(template)

  const completedCount = computed(() => items.filter(item => completedItemIds.value.has(item.id)).length)
  const totalXpAvailable = computed(() => items.reduce((sum, item) => sum + item.xp, 0))
  const totalXpEarned = computed(() =>
    items.filter(item => completedItemIds.value.has(item.id)).reduce((sum, item) => sum + item.xp, 0)
  )
  const progressPercent = computed(() =>
    items.length === 0 ? 0 : Math.round((completedCount.value / items.length) * 100)
  )

  // A module unlocks once every item in the module before it is complete —
  // the first module is always unlocked. Lessons within an unlocked module
  // can be visited in any order; locked modules can't be jumped into.
  function isModuleLocked(moduleId: string) {
    const moduleIndex = template.curriculum.findIndex(mod => mod.id === moduleId)
    if (moduleIndex <= 0) return false
    const previousModule = template.curriculum[moduleIndex - 1]!
    return !previousModule.items.every(item => completedItemIds.value.has(item.id))
  }

  return {
    isCompleted,
    markComplete,
    getSubmission,
    submitDeliverable,
    isModuleLocked,
    progressPercent,
    totalXpEarned,
    totalXpAvailable
  }
}
```

- [ ] **Step 3: Wire the new props/emit in the page**

In `app/pages/learn/[programId]/program.vue`, find the `<ProgramContentViewer>` tag and replace it with:

```vue
    <ProgramContentViewer
      v-if="activeItem"
      :key="activeItem.id"
      :item="activeItem"
      :is-completed="progress.isCompleted(activeItem.id)"
      :total-modules="template.curriculum.length"
      :submission="progress.getSubmission(activeItem.id)"
      @mark-complete="progress.markComplete(activeItem.id)"
      @next-item="goToNextItem"
      @submit-deliverable="payload => progress.submitDeliverable(activeItem.id, payload)"
    />
```

The added `:key="activeItem.id"` forces the component to remount when the active item changes, so `ProgramContentViewer`'s local `isStarted`/`description`/`links` refs (added in Step 1) reset cleanly when the learner navigates to a different item — without it, those refs would leak from one deliverable into the next since Vue reuses the component instance across prop changes.

- [ ] **Step 4: Verify — full end-to-end flow**

Start the dev server, open `/learn/intro-game-design/program`, clear `localStorage`, reload.

1. Click through module 1 to "Submit Your Paper Prototype". Confirm you see: the description/share-instructions text, "Milestone 1 of 2: Design Basics", the 3 acceptance criteria bullets, "+200 XP", and a "Start this task" button (top-right of the title).
2. Click "Start this task" — a textarea and a links input appear below, with a "Submit for completion" button.
3. Click "Submit for completion" with the textarea empty — nothing happens (button stays visible, item stays incomplete): the button is `disabled` while the trimmed description is empty.
4. Type a description, press Enter after typing a URL in the links field to add it as a tag, click "Submit for completion".
5. Confirm: a "Completed" badge and "Go to next item" button appear, plus a "Your submission" recap showing the description text and the link as a clickable anchor. The sidebar's XP line increases by 200. The sidebar checkmarks this item.
6. Reload the page (full browser reload, not client nav). Re-navigate to the same deliverable item via the sidebar. Confirm the completed state and the "Your submission" recap still show the same description/link — proving `localStorage` persistence survived the reload.
7. Complete the remaining item(s) in module 1 (if any aren't done yet) and confirm module 2 unlocks exactly as before this change (module-lock behavior from the earlier lock/skip feature is unaffected).
8. Check the browser console for errors throughout — expect none.

- [ ] **Step 5: Commit**

```bash
git add app/components/ProgramContentViewer.vue app/composables/useProgramProgress.ts "app/pages/learn/[programId]/program.vue"
git commit -m "Add deliverable submission UI, persistence, and page wiring"
```
