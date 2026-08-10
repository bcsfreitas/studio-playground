<script setup lang="ts">
import { programTemplates } from '~/composables/useProgramMockData'
import { flattenCurriculum, type FlatCurriculumItem } from '~/composables/useProgramCurriculum'
import { useProgramProgress, type DeliverableSubmission } from '~/composables/useProgramProgress'

const route = useRoute()
const { t } = useI18n()

// Resolved once, non-reactively, at setup time. Safe because the shell keys
// the rendered tab on programId, so this component remounts instead of being
// reused when the program changes — and it lets us call useProgramProgress
// (which registers an onMounted hook) conditionally without violating Vue's
// "call hooks unconditionally on every render" rule, since Vue's setup() runs
// once per instance, not once per render like React.
const programId = route.params.programId as string
const template = programTemplates.find(p => p.id === programId)
const flatItems = template ? flattenCurriculum(template) : []
const progress = template ? useProgramProgress(template) : null

function openableItem(itemId: string) {
  const item = flatItems.find(candidate => candidate.id === itemId)
  return item && !progress?.isModuleLocked(item.moduleId) ? item : undefined
}

// The step the learner should be on: the first one they haven't finished. A
// computed rather than a one-shot value, so the highlight moves down the list
// as steps get ticked off.
const currentItemId = computed(() =>
  flatItems.find(item => !progress?.isCompleted(item.id))?.id ?? flatItems[0]?.id
)

// Two refs rather than one derived from the other: the drawer animates out on
// close, and clearing the item at the same moment would blank its content
// mid-slide. Same split as the Make page's tool drawer.
const queryItem = route.query.item as string | undefined
const activeItem = ref<FlatCurriculumItem | null>(queryItem ? openableItem(queryItem) ?? null : null)
const drawerOpen = ref(Boolean(activeItem.value))

function openStep(itemId: string) {
  const item = openableItem(itemId)
  if (!item) return
  activeItem.value = item
  drawerOpen.value = true
}

// Keep the URL pointing at the step being read, so a refresh or a shared link
// lands in the same place. It stays put when the drawer closes: the shell picks
// the classroom tab off `?item=` alone (see `initialTab` in
// `pages/learn/[programId].vue`), so clearing it would drop a refreshing
// learner back onto the program's Home tab.
watch(activeItem, (item) => {
  if (!item) return
  navigateTo({ path: route.path, query: { ...route.query, item: item.id } }, { replace: true })
})

// Completing a step advances to the next one, which is the checklist rhythm:
// finish, tick, move on. The drawer stays open and swaps its content; it only
// closes when there's nothing left to advance into.
function advanceFrom(itemId: string) {
  const next = flatItems[flatItems.findIndex(item => item.id === itemId) + 1]
  const openable = next && openableItem(next.id)
  if (openable) activeItem.value = openable
  else drawerOpen.value = false
}

function completeAndAdvance(itemId: string) {
  progress?.markComplete(itemId)
  advanceFrom(itemId)
}

function submitDeliverable(itemId: string, submission: DeliverableSubmission) {
  if (!progress) return
  progress.submitDeliverable(itemId, submission)
  // Submitting completes the step, so it advances like any other — and this is
  // the moment the next module unlocks, since deliverables close each one.
  advanceFrom(itemId)
}

const modules = computed(() => (template?.curriculum ?? []).map((mod, index) => ({
  id: mod.id,
  number: index + 1,
  title: mod.title,
  items: mod.items,
  isLocked: progress!.isModuleLocked(mod.id),
  completedCount: mod.items.filter(item => progress!.isCompleted(item.id)).length
})))
</script>

<template>
  <UContainer v-if="template && progress" class="pt-10 pb-16">
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_324px] gap-8 lg:gap-12">
      <div class="min-w-0">
        <h2 class="font-heading font-bold text-highlighted">{{ t('program.viewer.yourPath') }}</h2>

        <section v-for="mod in modules" :key="mod.id" class="mt-8">
          <!-- Module heading groups the steps and carries their tally, but is
               not itself something to open. -->
          <div class="flex items-center gap-2.5">
            <h3
              class="font-heading font-bold text-sm uppercase tracking-wide"
              :class="mod.isLocked ? 'text-dimmed' : 'text-primary-600'"
            >
              {{ t('program.viewer.moduleHeading', { number: mod.number, title: mod.title }) }}
            </h3>
            <UIcon v-if="mod.isLocked" name="lucide:lock" class="size-3.5 shrink-0 text-dimmed" />
            <span class="ml-auto text-xs text-muted tabular-nums shrink-0">
              {{ mod.completedCount }}/{{ mod.items.length }}
            </span>
          </div>

          <div class="flex flex-col gap-2 mt-3">
            <ProgramStepCard
              v-for="item in mod.items"
              :key="item.id"
              :item="item"
              :completed="progress.isCompleted(item.id)"
              :locked="mod.isLocked"
              :current="item.id === currentItemId"
              @open="openStep"
            />
          </div>
        </section>
      </div>

      <!-- Course progress and badges live on the Home tab: they are the
           standing summary of the program, not something to read while working
           through the step list. -->
      <div class="lg:sticky lg:top-6 lg:self-start">
        <ProgramProgressCard :template="template" :show-current-lesson="false" />
      </div>
    </div>
  </UContainer>

  <UContainer v-else class="pb-16">
    <div
      class="border-[1.5px] border-dashed border-slate-300 flex flex-col items-center gap-2 text-center rounded-2xl"
      style="padding: 32px 24px"
    >
      <Icon name="lucide:file-question" class="size-[22px] text-primary" />
      <div class="font-heading text-[15px] font-bold text-default">{{ t('program.viewer.notFound') }}</div>
      <UButton :label="t('program.notFound.backToLearn')" to="/learn" color="neutral" variant="outline" class="mt-2" />
    </div>
  </UContainer>

  <!-- One drawer for the whole classroom, outside the container: it portals
       itself to <body>, so it only needs to sit somewhere it can see the
       active step. -->
  <ProgramStepDrawer
    v-if="template && progress"
    v-model:open="drawerOpen"
    :item="activeItem"
    :progress="progress"
    @complete="completeAndAdvance"
    @submit="submitDeliverable"
  />
</template>
