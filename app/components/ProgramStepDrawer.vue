<script setup lang="ts">
import type { CurriculumItem } from '~/composables/useProgramMockData'
import type { CurriculumModuleSummary } from '~/composables/useProgramCurriculum'
import type { DeliverableSubmission, useProgramProgress } from '~/composables/useProgramProgress'

const props = defineProps<{
  item: CurriculumItem | null
  progress: ReturnType<typeof useProgramProgress> | null
  // The whole curriculum, not just the open step — the sidebar nav needs every
  // module to let the learner jump between lessons without leaving the drawer.
  modules: CurriculumModuleSummary[]
  // The drawer's own header names the program, not the step — a learner
  // navigating between lessons via the sidebar shouldn't see the title
  // change underneath them on every click. The step's own title now sits
  // above its content instead, where it belongs to that content.
  programTitle: string
}>()

const open = defineModel<boolean>('open', { required: true })

// The drawer records progress but never decides what to open next — advancing
// is the classroom's job, since only it knows the flat step order. Picking a
// step from the sidebar goes through the same gate (`select`), since only the
// classroom knows which steps are actually openable.
const emit = defineEmits<{
  select: [itemId: string]
  complete: [itemId: string]
  submit: [itemId: string, submission: DeliverableSubmission]
}>()

const { t } = useI18n()

// One draft at a time is enough: only one step is ever open, so the form resets
// on each open and on each step change rather than tracking state per item.
// Both triggers are needed — completing a step swaps `item` for the next one
// without ever closing the drawer, and reopening the same step should start
// clean rather than resume a half-typed submission.
const isStarted = ref(false)
const description = ref('')
const links = ref<string[]>([])
watch([() => props.item?.id, open], ([, isOpen], [, wasOpen]) => {
  if (!isOpen && wasOpen) return
  isStarted.value = false
  description.value = ''
  links.value = []
})

const isDeliverable = computed(() => props.item?.type === 'deliverable')
const isCompleted = computed(() => Boolean(props.item && props.progress?.isCompleted(props.item.id)))
const submission = computed(() => (props.item ? props.progress?.getSubmission(props.item.id) : undefined))

// Revisiting a step that's already done has nothing left to mark complete, so
// its footer offers to move on instead — the same flat, module-aware order
// flattenCurriculum uses, built from `modules` since that's what this drawer
// already has on hand. Undefined at the end of the curriculum: there's
// nothing to advance into, so the button doesn't render at all rather than
// linking nowhere.
const nextItem = computed(() => {
  if (!props.item) return undefined
  const flat = props.modules.flatMap(mod => mod.items.map(item => ({ item, locked: mod.isLocked })))
  const next = flat[flat.findIndex(entry => entry.item.id === props.item!.id) + 1]
  return next && !next.locked ? next.item : undefined
})

function submitDeliverable() {
  const trimmed = description.value.trim()
  if (!props.item || !trimmed) return
  emit('submit', props.item.id, { description: trimmed, links: links.value.filter(Boolean) })
}

// Submissions are free-text pasted by the learner into localStorage, so guard
// against non-http(s) values (e.g. a stray `javascript:` URL) before linkifying.
function isHttpLink(link: string) {
  return /^https?:\/\//i.test(link)
}
</script>

<template>
  <UDrawer
    v-model:open="open"
    :title="programTitle"
    close
    handle-only
    :handle="false"
    :ui="{
      // Fixed `h-[100dvh]`, not `max-h`: the drawer should reach the top of the
      // screen on every step, short or long, not just the ones with enough
      // content to grow into it. `dvh` rather than `%`: a percentage on a fixed
      // element resolves against the large viewport, which hides the drawer's
      // bottom under mobile browser chrome.
      //
      // `z-[250]` because the drawer theme sets no z-index at all, and the
      // program page's DevPreviewBar is `z-[200]` in the same stacking context.
      //
      // The default container scrolls as one column; the sidebar and the
      // lesson pane need to scroll independently of each other instead, so
      // that scrolling a long lesson doesn't carry the nav rail away with it.
      // That only works if height actually cascades down: `container` needs
      // `h-full` to claim content's fixed height at all (a flex-col child
      // hugs its own content by default), and `body` needs `min-h-0` so it
      // can be squeezed by that height instead of growing past it — without
      // both, `overflow-y-auto` below has no bounded box to scroll inside and
      // a long curriculum just pushes the footer off past the viewport.
      content: 'h-[100dvh] max-h-[100dvh] overflow-hidden z-[250]',
      overlay: 'z-[250]',
      container: 'h-full p-0 gap-0 overflow-hidden',
      header: 'px-6 py-4 border-b border-default shrink-0',
      body: 'flex-1 min-h-0 flex overflow-hidden',
      footer: 'px-6 py-4 border-t border-default shrink-0'
    }"
  >
    <!-- Gated on the step rather than on `open`: the drawer slides out over a
         few hundred milliseconds, and tearing the content down the instant it
         starts closing empties the panel mid-animation. -->
    <template v-if="item && progress" #body>
      <!-- Curriculum nav — hidden below lg, the same breakpoint
           ProgramTabOverview's own sticky rail collapses at, since a narrow
           viewport has no room for a second column here either. -->
      <aside class="hidden lg:flex lg:flex-col w-72 shrink-0 border-r border-default overflow-y-auto p-4">
        <section v-for="mod in modules" :key="mod.id" class="mt-4 first:mt-0">
          <div class="flex items-center gap-2 mb-2">
            <h4
              class="font-heading font-bold text-xs uppercase tracking-wide"
              :class="mod.isLocked ? 'text-dimmed' : 'text-primary-600'"
            >
              {{ mod.title }}
            </h4>
            <UIcon v-if="mod.isLocked" name="lucide:lock" class="size-3 shrink-0 text-dimmed" />
            <span class="ml-auto text-xs text-muted tabular-nums shrink-0">{{ mod.completedCount }}/{{ mod.items.length }}</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <ProgramStepCard
              v-for="modItem in mod.items"
              :key="modItem.id"
              :item="modItem"
              :completed="progress.isCompleted(modItem.id)"
              :locked="mod.isLocked"
              :current="modItem.id === item.id"
              compact
              @open="emit('select', $event)"
            />
          </div>
        </section>
      </aside>

      <!-- Lesson pane — the drawer's own scroll region, independent of the
           nav rail beside it. UContainer owns the horizontal padding/max-width
           so this matches every other content surface in the classroom. -->
      <div class="flex-1 min-w-0 overflow-y-auto">
        <UContainer class="py-5">
          <h2 class="font-heading font-bold text-4xl text-highlighted text-pretty mt-2 mb-8">{{ item.title }}</h2>

          <template v-if="isDeliverable">
            <!-- A milestone's own page content sits above the submission form: the
                 learner reads the issues, then hands in. -->
            <div v-if="item.body?.length" class="mb-6 flex flex-col gap-6">
              <ProgramSessionBody :blocks="item.body" />
              <USeparator />
            </div>
            <p class="text-base text-default">{{ t('program.viewer.deliverable.introBody') }}</p>
            <p class="mt-3 text-base text-default">{{ t('program.viewer.deliverable.shareIntro') }}</p>
            <ul class="mt-1 list-disc pl-5 text-base text-default">
              <li>{{ t('program.viewer.deliverable.shareScreenshots') }}</li>
              <li>{{ t('program.viewer.deliverable.shareVideo') }}</li>
              <li>{{ t('program.viewer.deliverable.shareBuild') }}</li>
            </ul>

            <!-- `variant="subtle"` matches the task blocks ProgramSessionBody
                 renders, so a milestone's own criteria don't read as a different
                 kind of surface from the ones inside its body. -->
            <UCard
              v-if="item.acceptanceCriteria?.length"
              variant="subtle"
              :ui="{ root: 'mt-4 rounded-xl', body: 'p-4 sm:p-4' }"
            >
              <h4 class="text-base font-bold text-default">{{ t('program.viewer.deliverable.acceptanceCriteria') }}</h4>
              <ul class="mt-1 list-disc pl-5 text-base text-default">
                <li v-for="criterion in item.acceptanceCriteria" :key="criterion">{{ criterion }}</li>
              </ul>
            </UCard>

            <UCard
              v-if="isCompleted && submission"
              variant="subtle"
              :ui="{ root: 'mt-4 rounded-xl', body: 'p-4 sm:p-4' }"
            >
              <h4 class="text-base font-bold text-highlighted">{{ t('program.viewer.deliverable.yourSubmission') }}</h4>
              <p class="mt-2 text-base text-default">{{ submission.description }}</p>
              <ul v-if="submission.links.length" class="mt-2 list-disc pl-5 text-base">
                <li v-for="link in submission.links" :key="link">
                  <ULink
                    v-if="isHttpLink(link)"
                    :to="link"
                    target="_blank"
                    raw
                    class="text-primary underline break-all"
                  >{{ link }}</ULink>
                  <span v-else class="break-all">{{ link }}</span>
                </li>
              </ul>
            </UCard>

            <div v-else-if="!isCompleted && isStarted" class="mt-4 flex flex-col gap-3">
              <UTextarea
                v-model="description"
                :placeholder="t('program.viewer.deliverable.descriptionPlaceholder')"
                :rows="4"
              />
              <UInputTags v-model="links" :placeholder="t('program.viewer.deliverable.linksPlaceholder')" />
            </div>
          </template>

          <template v-else>
            <ProgramSessionBody v-if="item.body?.length" :blocks="item.body" />
            <!-- Same UEmpty treatment ProgramSessionBody gives an unrendered media
                 block, so a step with no authored content at all looks like the
                 placeholders inside one that has some. -->
            <UEmpty
              v-else
              icon="lucide:file-text"
              :title="t('program.viewer.content.placeholder', { contentType: item.contentType })"
              variant="soft"
              :ui="{ root: 'border border-dashed border-default rounded-xl' }"
            />
          </template>
        </UContainer>
      </div>
    </template>

    <!-- The action lives in the footer so it stays reachable without scrolling
         to the end of a long milestone. Right-aligned rather than the default
         stretched-flex-col — a full-width button here reads as a wall you have
         to click through, not a single action beside a progress figure. -->
    <template v-if="item && progress" #footer>
      <div class="w-full flex items-center justify-end gap-3">
        <UBadge
          v-if="item.xp"
          :label="isCompleted
            ? t('program.viewer.actions.xpEarned', { xp: item.xp })
            : t('program.viewer.actions.xpAvailable', { xp: item.xp })"
          :icon="isCompleted ? 'lucide:check' : undefined"
          :color="isCompleted ? 'success' : 'neutral'"
          variant="soft"
        />

        <UButton
          v-if="isCompleted && nextItem"
          :label="t('program.viewer.actions.nextItem')"
          icon="lucide:arrow-right"
          trailing
          color="primary"
          @click="emit('select', nextItem.id)"
        />
        <UButton
          v-else-if="!isCompleted && !isDeliverable"
          :label="t('program.viewer.actions.markComplete')"
          icon="lucide:check"
          color="primary"
          @click="emit('complete', item.id)"
        />
        <UButton
          v-else-if="!isCompleted && isStarted"
          :label="t('program.viewer.deliverable.submit')"
          color="primary"
          :disabled="!description.trim()"
          @click="submitDeliverable"
        />
        <UButton
          v-else-if="!isCompleted"
          :label="t('program.viewer.deliverable.startTask')"
          color="primary"
          @click="isStarted = true"
        />
      </div>
    </template>
  </UDrawer>
</template>
