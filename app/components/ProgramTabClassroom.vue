<script setup lang="ts">
import { preSurveyQuestions, programTemplates } from '~/composables/useProgramMockData'
import { flattenCurriculum, withAwardableXp, type CurriculumModuleSummary, type FlatCurriculumItem } from '~/composables/useProgramCurriculum'
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
const activeItem = ref<FlatCurriculumItem | null>(null)
const drawerOpen = ref(false)

// A 'takeover' item (the pre-survey) never opens the drawer — it launches a
// blocking modal followed by a full-screen wizard instead, gating the rest
// of the curriculum the same way any module boundary already does (see
// mod-eg-pre-survey in curriculum.ts). Every way a step can be opened — a
// click here, a click in the drawer's own sidebar, or the `?item=` deep
// link below — funnels through this one function so that branch can't be
// bypassed by a future call site.
const preSurveyGateOpen = ref(false)
const preSurveyWizardOpen = ref(false)
const pendingTakeoverItem = ref<FlatCurriculumItem | null>(null)

function openItem(item: FlatCurriculumItem) {
  if (item.presentation === 'takeover') {
    pendingTakeoverItem.value = item
    preSurveyGateOpen.value = true
    return
  }
  activeItem.value = item
  drawerOpen.value = true
}

// `?item=` should only auto-open the first time this session lands on the
// classroom — a "Resume learning" link, a refresh, or a shared URL. There's
// no <KeepAlive> around the tab components, so switching to another tab and
// back remounts this one from scratch, and `?item=` is still in the URL
// (see the watcher below, which keeps it there on purpose). Without this
// guard, every trip back to Classroom would reopen whatever step was last
// read, even after the learner closed it deliberately.
const hasOpenedThisSession = useState(`classroom-opened:${programId}`, () => false)
const queryItem = route.query.item as string | undefined
const shouldAutoOpen = Boolean(queryItem) && !hasOpenedThisSession.value
hasOpenedThisSession.value = true
const initialItem = shouldAutoOpen ? openableItem(queryItem!) : undefined
if (initialItem) openItem(initialItem)

function openStep(itemId: string) {
  const item = openableItem(itemId)
  if (item) openItem(item)
}

function onGateStart() {
  preSurveyGateOpen.value = false
  preSurveyWizardOpen.value = true
}

function onWizardExit() {
  preSurveyWizardOpen.value = false
  pendingTakeoverItem.value = null
}

function onWizardComplete() {
  const item = pendingTakeoverItem.value
  preSurveyWizardOpen.value = false
  pendingTakeoverItem.value = null
  if (item) completeAndAdvance(item.id)
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
  if (openable) openItem(openable)
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

const modules = computed<CurriculumModuleSummary[]>(() => withAwardableXp(template?.curriculum ?? []).map(mod => ({
  id: mod.id,
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
              {{ mod.title }}
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

      <div class="lg:sticky lg:top-6 lg:self-start flex flex-col gap-8">
        <ProgramProgressCard :template="template" :show-current-lesson="false" />
        <ProgramCourseMetrics :template="template" />
        <ProgramCourseBadges :template="template" />
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
    :modules="modules"
    :program-title="template.title"
    @select="openStep"
    @complete="completeAndAdvance"
    @submit="submitDeliverable"
  />

  <!-- The 01+03-style gate: a blocking modal (no dismiss, no skip) that
       hands off to a full-screen wizard on its single CTA. Both render
       outside the container for the same reason the drawer does. -->
  <ProgramPreSurveyGateModal
    v-if="template"
    v-model:open="preSurveyGateOpen"
    :program-title="template.title"
    @start="onGateStart"
  />
  <ProgramPreSurveyWizard
    v-model:open="preSurveyWizardOpen"
    :questions="preSurveyQuestions"
    @complete="onWizardComplete"
    @exit="onWizardExit"
  />
</template>
