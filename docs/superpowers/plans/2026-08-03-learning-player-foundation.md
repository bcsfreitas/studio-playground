# Learning Player — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the working (but not yet styled/fun) skeleton of the learning player: a learner can open `/learn/<programId>/player`, see every curriculum item in a plain sidebar list, click any item freely, mark it complete, and see XP/progress update and survive a page reload — and reach that page for real from the existing "Resume learning"/"Start learning" buttons and enrolled catalog cards.

**Architecture:** New mock-data fields (`contentType` per curriculum item) plus a shared `MODULE_COLORS` constant; a `usePlayerCurriculum` helper that flattens a program's modules into one ordered list; a `useProgramProgress` composable backing per-item completion in `localStorage`; a new minimal `player` layout + `/learn/[programId]/player` page wiring it all together with bare (unstyled) sidebar/content components; and prop-level `:to`/`target="_blank"` changes on two existing components to actually reach the new route. This is Plan A of 2 — Plan B (not this document) restyles the sidebar, adds real per-content-type placeholders, and adds celebratory animation/modal.

**Tech Stack:** Vue 3 `<script setup>`, Nuxt 4, Nuxt UI v4 (`UProgress`, `UButton`, `UBadge`, `UIcon`), `@nuxtjs/i18n`, browser `localStorage`. No test framework in this repo — verification is manual via the dev server.

## Global Constraints

- No backend exists anywhere in this app — all state is either static mock data (`app/composables/*.ts`) or client-only browser state. Completion state is `localStorage`-backed and does **not** write back to `EnrollmentRecord.progress` or any other existing progress display (explicit prior decision — see `docs/superpowers/specs`/plan-mode plan at `/home/bcsfreitas/.claude/plans/twinkly-herding-volcano.md`).
- Every item is freely navigable regardless of completion state of other items — no locking/sequencing.
- All new UI-chrome strings go through `i18n/locales/en.json`/`es.json` via `useI18n()`'s `t()`, under a new top-level `"player"` namespace (existing precedent: `"program"` is the only other top-level key) — no hardcoded English strings in new components.
- Use Nuxt UI components, not hand-rolled HTML, wherever one already fits (`UProgress`, `UButton`, `UBadge`, `UIcon`) — per this repo's `CLAUDE.md` "Building UI" rule. Plain `<div>`/`<ul>`/`<button>` markup is fine for structural layout that Nuxt UI has no component for (the sidebar shell, the item list rows) — this plan is explicitly not styling those yet.
- No test suite exists — verify every task by running `npm run dev` (or using the already-running dev server) and checking real behavior in the browser / via `curl`.

---

### Task 1: Data model — `contentType`, `MODULE_COLORS`, and the `intro-game-design` program

**Files:**
- Modify: `app/composables/useProgramMockData.ts`
- Modify: `app/components/ProgramCurriculumAccordion.vue`

**Interfaces:**
- Produces: `CurriculumContentType` type; `CurriculumItem.contentType` field (consumed by Task 2's `usePlayerCurriculum`/`PlayerContentViewer`); `export const MODULE_COLORS` (consumed by Task 2's `usePlayerCurriculum`, and by the modified `ProgramCurriculumAccordion.vue`); a new `intro-game-design` entry in `programTemplates`/`programInstances`/`enrollmentsByPreviewState.active` (consumed by Task 3's trigger wiring, and by anyone visiting `/learn/intro-game-design` or `/learn/intro-game-design/player`).
- Consumes: nothing new — this task only edits existing, already-read files.

- [ ] **Step 1: Add `CurriculumContentType` and the `contentType` field**

In `app/composables/useProgramMockData.ts`, find:

```ts
export type CurriculumItemType = 'topic' | 'survey' | 'task' | 'resource'
```

Replace with:

```ts
export type CurriculumItemType = 'topic' | 'survey' | 'task' | 'resource'
export type CurriculumContentType = 'video' | 'slideshow' | 'text' | 'image' | 'gif'
```

Then find:

```ts
export interface CurriculumItem {
  id: string
  type: CurriculumItemType
  title: string
  xp: number
}
```

Replace with:

```ts
export interface CurriculumItem {
  id: string
  type: CurriculumItemType
  title: string
  xp: number
  contentType: CurriculumContentType
}
```

- [ ] **Step 2: Assign `contentType` to every existing curriculum item**

Add `contentType` to each item literal below, matching each item by its `id` (only the changed line is shown per item — every other field on that item stays exactly as-is; find each `{ id: '...', ... }` line and add `, contentType: '...'` before the closing `}`).

`pixel-art-foundations` curriculum:
- `item-sprite-anatomy` → `contentType: 'video'`
- `item-16x16-character` → `contentType: 'slideshow'`
- `item-walk-cycle` → `contentType: 'gif'`
- `item-palette-libraries` → `contentType: 'image'`
- `item-recolor-sprite` → `contentType: 'image'`
- `item-color-survey` → `contentType: 'text'`
- `item-export-godot` → `contentType: 'video'`
- `item-idle-run-blend` → `contentType: 'gif'`

`ship-your-first-game` curriculum:
- `item-project-structure` → `contentType: 'video'`
- `item-player-movement` → `contentType: 'video'`
- `item-win-lose` → `contentType: 'slideshow'`
- `item-save-load` → `contentType: 'slideshow'`
- `item-juice` → `contentType: 'video'`
- `item-git-cheatsheet` → `contentType: 'text'`
- `item-shared-repo` → `contentType: 'image'`
- `item-pull-request` → `contentType: 'text'`
- `item-publish-build` → `contentType: 'slideshow'`
- `item-ship-survey` → `contentType: 'text'`

`level-design-lab` curriculum:
- `item-pacing-principles` → `contentType: 'video'`
- `item-blockout` → `contentType: 'slideshow'`
- `item-pacing-playtest` → `contentType: 'text'`
- `item-teach-mechanic` → `contentType: 'video'`
- `item-difficulty-curve` → `contentType: 'image'`
- `item-lighting-pack` → `contentType: 'image'`
- `item-lighting-dressing` → `contentType: 'slideshow'`

`creature-rigging-crash-course` curriculum:
- `item-rig-hierarchy` → `contentType: 'video'`
- `item-base-skeleton` → `contentType: 'slideshow'`
- `item-weight-paint` → `contentType: 'video'`
- `item-fix-pinching` → `contentType: 'image'`
- `item-walk-cycle-block` → `contentType: 'gif'`
- `item-rig-survey` → `contentType: 'text'`

Example of the exact edit shape (first item, so there's no ambiguity about format):

Find:
```ts
          { id: 'item-sprite-anatomy', type: 'topic', title: 'Anatomy of a sprite', xp: 0 },
```

Replace with:
```ts
          { id: 'item-sprite-anatomy', type: 'topic', title: 'Anatomy of a sprite', xp: 0, contentType: 'video' },
```

Apply the same shape (append `, contentType: '<value>'` right before the trailing `}`) to all 30 remaining items listed above, using each item's own line.

- [ ] **Step 3: Extract `MODULE_COLORS` as a shared export**

In `app/composables/useProgramMockData.ts`, add this right after the `ENDLESS_STUDIOS` constant declaration (find `const ENDLESS_STUDIOS: StudioOwner = { name: 'Endless Studios', logo: '/images/logo-endless.svg' }` and insert immediately after it):

```ts
// Cycled by module index so each module/curriculum-item-group reads as
// visually distinct. Shared by ProgramCurriculumAccordion.vue and the
// learning player's sidebar nav so both use the exact same cycling.
export const MODULE_COLORS = ['primary', 'secondary', 'purple', 'blue'] as const
```

- [ ] **Step 4: Point `ProgramCurriculumAccordion.vue` at the shared export**

In `app/components/ProgramCurriculumAccordion.vue`, find:

```ts
import type { CurriculumModule, CurriculumItemType } from '~/composables/useProgramMockData'
```

Replace with:

```ts
import type { CurriculumModule, CurriculumItemType } from '~/composables/useProgramMockData'
import { MODULE_COLORS } from '~/composables/useProgramMockData'
```

Then find and delete this now-duplicate local declaration:

```ts
// Cycled by module index so each card reads as visually distinct; same
// 4-color family as ProgramFactsStrip's stat accents.
const MODULE_COLORS = ['primary', 'secondary', 'purple', 'blue'] as const
```

(The `items` computed right below it, which references `MODULE_COLORS`, stays exactly as-is — it now resolves to the imported constant instead of a local one.)

- [ ] **Step 5: Add the `intro-game-design` program**

In `app/composables/useProgramMockData.ts`, add a new entry to the `programTemplates` array. Insert it as the **first** element of the array (find `export const programTemplates: ProgramTemplate[] = [` and insert immediately after that line, before the existing `pixel-art-foundations` entry):

```ts
  {
    id: 'intro-game-design',
    title: 'Intro to Game Design',
    description: 'Build your first playable prototype, one task at a time.',
    image: '/images/img/bg-threadbare.png',
    facilitator: 'Deja Marsh',
    studioOwner: ENDLESS_STUDIOS,
    language: 'English',
    difficulty: 'Beginner',
    minAge: 10,
    totalXp: 500,
    learningType: 'self-paced',
    tier: 'Explore',
    durationLabel: '3 weeks - about 1 hr/week, at your own pace',
    toolsUsed: ['Godot'],
    prerequisites: [],
    studentsCompletedCount: 240,
    testimonials: [],
    certificate: {
      name: 'Intro to Game Design Certificate',
      issuingOrg: 'Endless Studios',
      microcredentials: []
    },
    curriculum: [
      {
        id: 'module-igd-design-basics',
        title: 'Design Basics',
        items: [
          { id: 'item-igd-what-is-a-game', type: 'topic', title: 'What makes a game a game?', xp: 0, contentType: 'video' },
          { id: 'item-igd-core-loop', type: 'task', title: 'Sketch your core gameplay loop', xp: 150, contentType: 'slideshow' },
          { id: 'item-igd-paper-prototype', type: 'task', title: 'Build a paper prototype', xp: 150, contentType: 'image' }
        ]
      },
      {
        id: 'module-igd-build-your-prototype',
        title: 'Build Your Prototype',
        items: [
          { id: 'item-igd-choose-tool', type: 'resource', title: 'Choosing your first game engine', xp: 0, contentType: 'text' },
          { id: 'item-igd-first-level', type: 'task', title: 'Build a playable first level', xp: 200, contentType: 'video' },
          { id: 'item-igd-playtest-survey', type: 'survey', title: 'How did your first playtest go?', xp: 0, contentType: 'text' }
        ]
      }
    ]
  },
```

Then add a matching `ProgramInstance` to the `programInstances` array (find `export const programInstances: ProgramInstance[] = [` and insert immediately after that line, before the existing `instance-pixel-art-foundations` entry):

```ts
  {
    id: 'instance-intro-game-design',
    programId: 'intro-game-design',
    cohorts: [
      {
        id: 'cohort-igd-self-paced',
        instanceId: 'instance-intro-game-design',
        startDate: null,
        endDate: null,
        maxLearners: null,
        seatsTaken: 0
      }
    ]
  },
```

Then add a matching enrollment record. Find:

```ts
export const enrollmentsByPreviewState: Record<PreviewState, EnrollmentRecord[]> = {
  active: [
    {
      learnerId: 'active',
      programId: 'pixel-art-foundations',
      instanceId: 'instance-pixel-art-foundations',
      cohortId: 'cohort-paf-self-paced',
      progress: 30,
      enrolledAt: '2026-07-01'
    }
  ],
```

Replace with:

```ts
export const enrollmentsByPreviewState: Record<PreviewState, EnrollmentRecord[]> = {
  active: [
    {
      learnerId: 'active',
      programId: 'intro-game-design',
      instanceId: 'instance-intro-game-design',
      cohortId: 'cohort-igd-self-paced',
      progress: 65,
      enrolledAt: '2026-06-20'
    },
    {
      learnerId: 'active',
      programId: 'pixel-art-foundations',
      instanceId: 'instance-pixel-art-foundations',
      cohortId: 'cohort-paf-self-paced',
      progress: 30,
      enrolledAt: '2026-07-01'
    }
  ],
```

- [ ] **Step 6: Manual verification**

Run: `npm run dev` (or use the already-running dev server), then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/learn/intro-game-design
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/learn/pixel-art-foundations
```

Expected: both return `200` (confirms the new program resolves correctly and the existing page didn't break).

Also visit `/learn/intro-game-design` and `/learn/pixel-art-foundations` in a browser — confirm both curriculum accordions still render exactly as before (numbered badges, cycling colors, XP badges on task items) — this confirms `ProgramCurriculumAccordion.vue`'s import change didn't break anything.

- [ ] **Step 7: Commit**

```bash
git add app/composables/useProgramMockData.ts app/components/ProgramCurriculumAccordion.vue
git commit -m "Add content types and the missing intro-game-design curriculum"
```

---

### Task 2: Composables + player route + bare sidebar/content components

**Files:**
- Create: `app/composables/usePlayerCurriculum.ts`
- Create: `app/composables/useProgramProgress.ts`
- Create: `app/layouts/player.vue`
- Create: `app/pages/learn/[programId]/player.vue`
- Create: `app/components/PlayerSidebar.vue`
- Create: `app/components/PlayerContentViewer.vue`
- Modify: `i18n/locales/en.json`
- Modify: `i18n/locales/es.json`

**Interfaces:**
- Consumes: `ProgramTemplate`, `CurriculumItem`, `programTemplates`, `MODULE_COLORS` from `~/composables/useProgramMockData` (Task 1).
- Produces: `FlatCurriculumItem` type and `flattenCurriculum(template: ProgramTemplate): FlatCurriculumItem[]` from `usePlayerCurriculum.ts`; `useProgramProgress(template: ProgramTemplate): { isCompleted(itemId: string): boolean, markComplete(itemId: string): void, progressPercent: ComputedRef<number>, totalXpEarned: ComputedRef<number>, totalXpAvailable: ComputedRef<number> }` from `useProgramProgress.ts` — both consumed by Task 3's trigger wiring only indirectly (Task 3 doesn't call these directly, but the route this task creates is Task 3's link target).

- [ ] **Step 1: `usePlayerCurriculum.ts`**

Create `app/composables/usePlayerCurriculum.ts`:

```ts
import type { CurriculumItem, ProgramTemplate } from '~/composables/useProgramMockData'
import { MODULE_COLORS } from '~/composables/useProgramMockData'

export interface FlatCurriculumItem extends CurriculumItem {
  moduleId: string
  moduleTitle: string
  moduleNumber: number
  moduleColor: typeof MODULE_COLORS[number]
}

// Flattens a program's modules into one ordered list — both the player's
// sidebar nav and its "go to next item" action need the same flat,
// module-aware order, so this is the one place that computes it.
export function flattenCurriculum(template: ProgramTemplate): FlatCurriculumItem[] {
  return template.curriculum.flatMap((mod, moduleIndex) =>
    mod.items.map(item => ({
      ...item,
      moduleId: mod.id,
      moduleTitle: mod.title,
      moduleNumber: moduleIndex + 1,
      moduleColor: MODULE_COLORS[moduleIndex % MODULE_COLORS.length]
    }))
  )
}
```

Note: `MODULE_COLORS` is imported as a regular (non-type-only) import since it's used both as a type (`typeof MODULE_COLORS[number]`) and as a runtime value (`MODULE_COLORS[moduleIndex % ...]`) — a type-only import would break the value usage.

- [ ] **Step 2: `useProgramProgress.ts`**

Create `app/composables/useProgramProgress.ts`:

```ts
import type { ProgramTemplate } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/usePlayerCurriculum'

interface StoredProgress {
  version: 1
  completedItemIds: string[]
}

function storageKey(programId: string) {
  return `player-progress:${programId}`
}

// Per-item completion has no backend to live in, so it's tracked entirely
// client-side in localStorage, keyed by programId only — there's one
// mock-learner concept in this app (the dev-only "PREVIEW AS" toggle isn't
// a real multi-account system), so finer keying would be unused complexity.
export function useProgramProgress(template: ProgramTemplate) {
  const completedItemIds = useState<Set<string>>(`player-progress-${template.id}`, () => new Set())

  onMounted(() => {
    if (!import.meta.client) return
    const raw = localStorage.getItem(storageKey(template.id))
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as StoredProgress
      completedItemIds.value = new Set(parsed.completedItemIds)
    } catch {
      // Corrupt/old localStorage value — ignore and start fresh.
    }
  })

  function persist() {
    if (!import.meta.client) return
    const payload: StoredProgress = { version: 1, completedItemIds: [...completedItemIds.value] }
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

  const items = flattenCurriculum(template)

  const totalXpAvailable = computed(() => items.reduce((sum, item) => sum + item.xp, 0))
  const totalXpEarned = computed(() =>
    items.filter(item => completedItemIds.value.has(item.id)).reduce((sum, item) => sum + item.xp, 0)
  )
  const progressPercent = computed(() =>
    items.length === 0 ? 0 : Math.round((completedItemIds.value.size / items.length) * 100)
  )

  return { isCompleted, markComplete, progressPercent, totalXpEarned, totalXpAvailable }
}
```

- [ ] **Step 3: Add the `player` i18n namespace**

In `i18n/locales/en.json`, find the top-level closing of `"program"` — the file currently has exactly one top-level key, so find the very last `}` before the file's final `}` (i.e. the line that closes `"program"`, immediately followed by the file's closing `}`). Add a new top-level `"player"` key as a sibling of `"program"`. Concretely, find:

```json
      "cohortDescription": {
        "open": "{taken} of {max} seats - {range}",
        "closed": "Closed - {range}",
        "requiresCode": "Requires an access code",
        "selfPaced": "Self-paced - start anytime",
        "alreadyEnrolled": "You're enrolled - {progress}% complete"
      },
      "confirmModal": {
```

Do not modify this block — it's shown only so you can locate the file. Instead, find the file's very last two lines (closing braces for `"program"` and the file), which look like:

```json
    }
  }
}
```

Replace those exact final three lines with:

```json
    }
  },
  "player": {
    "exit": {
      "label": "Exit"
    },
    "sidebar": {
      "xpProgress": "{earned} / {available} XP"
    },
    "actions": {
      "markComplete": "Mark as complete",
      "completed": "Completed",
      "nextItem": "Go to next item"
    }
  }
}
```

In `i18n/locales/es.json`, find the same final three lines (closing `"program"` and the file) and replace with the Spanish equivalent:

```json
    }
  },
  "player": {
    "exit": {
      "label": "Salir"
    },
    "sidebar": {
      "xpProgress": "{earned} / {available} XP"
    },
    "actions": {
      "markComplete": "Marcar como completado",
      "completed": "Completado",
      "nextItem": "Ir al siguiente elemento"
    }
  }
}
```

- [ ] **Step 4: `player.vue` layout**

Create `app/layouts/player.vue`:

```vue
<template>
  <div class="min-h-screen flex">
    <slot />
  </div>
</template>
```

- [ ] **Step 5: `PlayerSidebar.vue`**

Create `app/components/PlayerSidebar.vue`:

```vue
<script setup lang="ts">
import type { ProgramTemplate } from '~/composables/useProgramMockData'
import type { FlatCurriculumItem } from '~/composables/usePlayerCurriculum'

defineProps<{
  template: ProgramTemplate
  items: FlatCurriculumItem[]
  activeItemId: string | undefined
  isCompleted: (itemId: string) => boolean
  progressPercent: number
  totalXpEarned: number
  totalXpAvailable: number
}>()

defineEmits<{
  'select-item': [itemId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="w-72 shrink-0 border-r border-default p-4 flex flex-col gap-4 overflow-y-auto">
    <NuxtLink :to="`/learn/${template.id}`" class="text-sm text-primary">
      {{ t('player.exit.label') }}
    </NuxtLink>

    <div>
      <div class="font-heading font-bold text-highlighted">{{ template.title }}</div>
      <UProgress :model-value="progressPercent" color="primary" class="mt-2" />
      <div class="text-xs text-muted mt-1">
        {{ t('player.sidebar.xpProgress', { earned: totalXpEarned, available: totalXpAvailable }) }}
      </div>
    </div>

    <ul class="flex flex-col gap-1">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-1.5"
          :class="item.id === activeItemId ? 'bg-primary/10 text-primary' : 'text-default'"
          @click="$emit('select-item', item.id)"
        >
          <UIcon :name="isCompleted(item.id) ? 'lucide:check-circle' : 'lucide:circle'" class="size-4 shrink-0" />
          <span class="truncate">{{ item.title }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>
```

- [ ] **Step 6: `PlayerContentViewer.vue`**

Create `app/components/PlayerContentViewer.vue`:

```vue
<script setup lang="ts">
import type { FlatCurriculumItem } from '~/composables/usePlayerCurriculum'

defineProps<{
  item: FlatCurriculumItem
  isCompleted: boolean
}>()

defineEmits<{
  'mark-complete': []
  'next-item': []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex-1 p-8">
    <div class="text-xs text-muted uppercase">{{ item.moduleTitle }} · {{ item.contentType }}</div>
    <h1 class="text-2xl font-heading font-bold text-highlighted mt-1">{{ item.title }}</h1>

    <div class="mt-6 rounded-xl border border-dashed border-default p-12 text-center text-muted">
      {{ item.contentType }} placeholder
    </div>

    <div class="mt-6 flex items-center gap-3">
      <span v-if="item.xp" class="text-sm text-muted">+{{ item.xp }} XP</span>

      <UButton
        v-if="!isCompleted"
        :label="t('player.actions.markComplete')"
        color="primary"
        @click="$emit('mark-complete')"
      />
      <template v-else>
        <UBadge :label="t('player.actions.completed')" color="success" variant="soft" />
        <UButton :label="t('player.actions.nextItem')" variant="outline" @click="$emit('next-item')" />
      </template>
    </div>
  </div>
</template>
```

- [ ] **Step 7: `[programId]/player.vue` page**

Create `app/pages/learn/[programId]/player.vue`:

```vue
<script setup lang="ts">
import { programTemplates } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/usePlayerCurriculum'
import { useProgramProgress } from '~/composables/useProgramProgress'

definePageMeta({ layout: 'player' })

const route = useRoute()

// Resolved once, non-reactively, at setup time: the dynamic route segment
// only changes via a full page load in this app (a new tab per Resume
// click), so there's no need to track it as a computed — and doing it this
// way lets us call useProgramProgress (which registers an onMounted hook)
// conditionally without violating Vue's "call hooks unconditionally on
// every render" rule, since Vue's setup() runs once per instance, not once
// per render like React.
const programId = route.params.programId as string
const template = programTemplates.find(p => p.id === programId)
const flatItems = template ? flattenCurriculum(template) : []
const progress = template ? useProgramProgress(template) : null

const activeItemId = computed(() => {
  const queryItem = route.query.item as string | undefined
  if (queryItem && flatItems.some(item => item.id === queryItem)) return queryItem
  return flatItems[0]?.id
})

const activeItem = computed(() => flatItems.find(item => item.id === activeItemId.value))

function selectItem(itemId: string) {
  navigateTo({ path: route.path, query: { item: itemId } }, { replace: true })
}

function goToNextItem() {
  const index = flatItems.findIndex(item => item.id === activeItemId.value)
  const next = flatItems[index + 1]
  if (next) selectItem(next.id)
}
</script>

<template>
  <template v-if="template && progress">
    <PlayerSidebar
      :template="template"
      :items="flatItems"
      :active-item-id="activeItemId"
      :is-completed="progress.isCompleted"
      :progress-percent="progress.progressPercent"
      :total-xp-earned="progress.totalXpEarned"
      :total-xp-available="progress.totalXpAvailable"
      @select-item="selectItem"
    />
    <PlayerContentViewer
      v-if="activeItem"
      :item="activeItem"
      :is-completed="progress.isCompleted(activeItem.id)"
      @mark-complete="progress.markComplete(activeItem.id)"
      @next-item="goToNextItem"
    />
  </template>
  <p v-else class="p-8">Program not found.</p>
</template>
```

- [ ] **Step 8: Manual verification**

Run: `npm run dev` (or use the already-running dev server).

Visit `http://localhost:3000/learn/pixel-art-foundations/player` directly in the browser. Expected:
- A left sidebar lists all 8 items across 3 modules, with an "Exit" link at the top, a progress bar at 0%, and "0 / 900 XP".
- The main area shows the first item's title and a dashed placeholder box saying "video placeholder" (its `contentType`).
- Clicking any other item in the sidebar (in any order, including skipping ahead) changes the main content immediately, and the browser URL's `?item=` query updates to that item's id.
- Clicking "Mark as complete" on an item: the button is replaced by a "Completed" badge + "Go to next item" button, the sidebar's icon for that item switches to a filled checkmark, and the top progress bar/XP text update (a `task`-type item should visibly move the XP number; a `topic`/`survey`/`resource` item won't, since those are 0 xp).
- Reload the page (full browser reload, same URL) — confirm the completed item(s) are still shown as completed and the XP/progress numbers are unchanged (proves `localStorage` persistence).
- Visit `http://localhost:3000/learn/does-not-exist/player` — confirm it shows "Program not found." instead of crashing.

- [ ] **Step 9: Commit**

```bash
git add app/composables/usePlayerCurriculum.ts app/composables/useProgramProgress.ts app/layouts/player.vue app/pages/learn/\[programId\]/player.vue app/components/PlayerSidebar.vue app/components/PlayerContentViewer.vue i18n/locales/en.json i18n/locales/es.json
git commit -m "Add the learning player route with completion tracking"
```

---

### Task 3: Trigger wiring — reach the player from real UI

**Files:**
- Modify: `app/composables/useProgramMockData.ts`
- Modify: `app/components/ProgramEnrollmentCard.vue`
- Modify: `app/components/LearnProgramCard.vue`
- Modify: `i18n/locales/en.json`
- Modify: `i18n/locales/es.json`

**Interfaces:**
- Consumes: the `/learn/[programId]/player` route from Task 2; `cohortStatusFor`, `Cohort` type from `useProgramMockData.ts` (already imported in `ProgramEnrollmentCard.vue`); the existing `enrollModalStartDateLabel` computed already present in `ProgramEnrollmentCard.vue`.
- Produces: `cohortHasStarted(cohort: Cohort, today?: Date): boolean`, exported from `useProgramMockData.ts` — used only within this task, but exported (not module-private) for consistency with `cohortStatusFor`'s existing export style.

- [ ] **Step 1: Add `cohortHasStarted` helper**

In `app/composables/useProgramMockData.ts`, find the end of `cohortStatusFor` (the closing brace right before the `hasAvailableCohort` function):

```ts
  if (cohort.maxLearners !== null && cohort.seatsTaken >= cohort.maxLearners) return 'full'
  return 'open-with-seats'
}
```

Immediately after that closing `}`, insert:

```ts

// A cohort with no start date (self-paced) is always "started"; otherwise
// compare against today using the same UTC-midnight normalization
// cohortStatusFor's closed-date check uses, to avoid a server-timezone skew.
export function cohortHasStarted(cohort: Cohort, today = new Date()): boolean {
  if (cohort.startDate === null) return true
  const todayUtcMidnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const startsAt = new Date(cohort.startDate).getTime()
  return startsAt <= todayUtcMidnight
}
```

- [ ] **Step 2: Add the "starts on" i18n key**

In `i18n/locales/en.json`, find:

```json
      "cta": {
        "resume": "Resume learning",
        "startLearning": "Start learning",
```

Replace with:

```json
      "cta": {
        "resume": "Resume learning",
        "startsOn": "Starts {date}",
        "startLearning": "Start learning",
```

In `i18n/locales/es.json`, find the matching Spanish block:

```json
      "cta": {
        "resume": "Continuar aprendiendo",
        "startLearning": "Comenzar a aprender",
```

Replace with:

```json
      "cta": {
        "resume": "Continuar aprendiendo",
        "startsOn": "Comienza el {date}",
        "startLearning": "Comenzar a aprender",
```

- [ ] **Step 3: Wire `ProgramEnrollmentCard.vue`'s buttons**

Find:

```ts
import { cohortStatusFor } from '~/composables/useProgramMockData'
```

Replace with:

```ts
import { cohortStatusFor, cohortHasStarted } from '~/composables/useProgramMockData'
```

Find the already-enrolled branch:

```vue
      <template v-if="selectedStatus === 'already-enrolled'">
        <div class="flex items-center gap-3 mb-3">
          <UProgress :model-value="enrollment?.progress ?? 0" color="primary" />
          <span class="text-xs text-default">{{ enrollment?.progress ?? 0 }}%</span>
        </div>
        <UButton :label="t('program.enrollment.cta.resume')" icon="lucide:play" color="primary" block />
      </template>
```

Replace with:

```vue
      <template v-if="selectedStatus === 'already-enrolled'">
        <div class="flex items-center gap-3 mb-3">
          <UProgress :model-value="enrollment?.progress ?? 0" color="primary" />
          <span class="text-xs text-default">{{ enrollment?.progress ?? 0 }}%</span>
        </div>
        <UButton
          v-if="selectedCohort && cohortHasStarted(selectedCohort)"
          :label="t('program.enrollment.cta.resume')"
          icon="lucide:play"
          color="primary"
          block
          :to="`/learn/${template.id}/player`"
          target="_blank"
        />
        <template v-else>
          <p class="text-xs text-muted mb-2">
            {{ t('program.enrollment.cta.startsOn', { date: enrollModalStartDateLabel }) }}
          </p>
          <UButton :label="t('program.enrollment.cta.resume')" icon="lucide:play" color="primary" block disabled />
        </template>
      </template>
```

Find the self-paced branch:

```vue
      <template v-else-if="selectedStatus === 'self-paced-always-open'">
        <UBadge :label="t('program.enrollment.cohortDescription.selfPaced')" color="neutral" variant="soft" class="mb-3" />
        <UButton :label="t('program.enrollment.cta.startLearning')" icon="lucide:play" color="primary" block />
      </template>
```

Replace with:

```vue
      <template v-else-if="selectedStatus === 'self-paced-always-open'">
        <UBadge :label="t('program.enrollment.cohortDescription.selfPaced')" color="neutral" variant="soft" class="mb-3" />
        <UButton
          :label="t('program.enrollment.cta.startLearning')"
          icon="lucide:play"
          color="primary"
          block
          :to="`/learn/${template.id}/player`"
          target="_blank"
        />
      </template>
```

- [ ] **Step 4: Wire `LearnProgramCard.vue`'s enrolled cards**

Find:

```vue
  <UPageCard
    :to="`/learn/${program.id}`"
    :title="program.name"
```

Replace with:

```vue
  <UPageCard
    :to="program.enrolled ? `/learn/${program.id}/player` : `/learn/${program.id}`"
    :target="program.enrolled ? '_blank' : undefined"
    :title="program.name"
```

- [ ] **Step 5: Manual verification**

Run: `npm run dev` (or use the already-running dev server).

1. Visit `/learn/intro-game-design` (self-paced, per Task 1) — click "Start learning" on the enrollment card. Expected: a new browser tab opens at `/learn/intro-game-design/player`, showing the two-module curriculum built in Task 1.
2. Visit `/learn/ship-your-first-game`. Select the cohort that starts soonest among the open ones (per `app/composables/useProgramMockData.ts`'s `programInstances`, this is `cohort-syfg-tue-thu`, `startDate: '2026-08-03'`) and click "Enroll in this session" → confirm through the modal. Expected: the card now shows "Resume learning" as a clickable button (not disabled) — that cohort has already started — and clicking it opens `/learn/ship-your-first-game/player` in a new tab. Then select `cohort-syfg-late-summer` (`startDate: '2026-08-10'`, access code `STUDIO-JAM` — unlock it first) and enroll through the modal the same way. Expected: this time "Resume learning" is disabled with a "Starts {date}" caption above it showing that cohort's actual start date, since `2026-08-10` is in the future relative to today.
3. Visit `/learn` (the catalog). Click the `pixel-art-foundations` card (enrolled) — expect it opens `/learn/pixel-art-foundations/player` in a new tab. Click a non-enrolled card (e.g. `ship-your-first-game`) — expect it still opens `/learn/ship-your-first-game` in the *same* tab (no `target`).
4. Switch locale to Spanish (`ULocaleSelect`) and confirm the new "Starts {date}" caption (if you can reach the not-yet-started state) and the catalog/enrollment card strings still render correctly (no missing-key warnings in the browser console).

- [ ] **Step 6: Commit**

```bash
git add app/composables/useProgramMockData.ts app/components/ProgramEnrollmentCard.vue app/components/LearnProgramCard.vue i18n/locales/en.json i18n/locales/es.json
git commit -m "Wire enrollment CTAs and enrolled catalog cards to open the learning player"
```
