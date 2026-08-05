<script setup lang="ts">
import { programTemplates, type CurriculumItemType } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'
import { useProgramProgress } from '~/composables/useProgramProgress'

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

const ITEM_TYPE_ICON: Record<CurriculumItemType, string> = {
  task: 'lucide:circle-check',
  topic: 'lucide:file-text',
  survey: 'lucide:message-square-text',
  resource: 'lucide:link',
  deliverable: 'lucide:upload'
}

function isOpenable(itemId: string) {
  const item = flatItems.find(candidate => candidate.id === itemId)
  return Boolean(item) && !progress?.isModuleLocked(item!.moduleId)
}

// The step the learner should be on: the first one they haven't finished.
function firstUnfinishedId() {
  return flatItems.find(item => !progress?.isCompleted(item.id))?.id ?? flatItems[0]?.id
}

// Exactly one step is open at a time, across the whole classroom rather than
// per module — so this is a single ref rather than UAccordion's own per-group
// state. A `?item=` deep link (the Home dashboard's CTA) wins if it points
// somewhere reachable.
const queryItem = route.query.item as string | undefined
const openItemId = ref<string | undefined>(
  queryItem && isOpenable(queryItem) ? queryItem : firstUnfinishedId()
)

function setOpen(itemId: string, open: boolean) {
  if (open && !isOpenable(itemId)) return
  openItemId.value = open ? itemId : undefined
  if (!open) return
  // Keep the URL pointing at the open step so a refresh or a shared link
  // lands in the same place. Spread the query — the active tab lives in
  // `?tab` and dropping it would bounce the learner out of the classroom.
  navigateTo({ path: route.path, query: { ...route.query, item: itemId } }, { replace: true })
}

// Completing a step advances to the next one, which is the checklist rhythm:
// finish, tick, move on.
function completeAndAdvance(itemId: string) {
  progress?.markComplete(itemId)
  const next = flatItems[flatItems.findIndex(item => item.id === itemId) + 1]
  if (next && isOpenable(next.id)) setOpen(next.id, true)
  else openItemId.value = undefined
}

const modules = computed(() => (template?.curriculum ?? []).map((mod, index) => ({
  id: mod.id,
  number: index + 1,
  title: mod.title,
  items: mod.items,
  isLocked: progress!.isModuleLocked(mod.id),
  completedCount: mod.items.filter(item => progress!.isCompleted(item.id)).length
})))

// One draft at a time is enough: only one step is ever open, so the form can
// reset whenever the open step changes rather than tracking state per item.
const isStarted = ref(false)
const description = ref('')
const links = ref<string[]>([])
watch(openItemId, () => {
  isStarted.value = false
  description.value = ''
  links.value = []
})

function submitDeliverable(itemId: string) {
  if (!progress) return
  const trimmed = description.value.trim()
  if (!trimmed) return
  progress.submitDeliverable(itemId, { description: trimmed, links: links.value.filter(Boolean) })
  // Submitting completes the step, so it advances like any other — and this is
  // the moment the next module unlocks, since deliverables close each one.
  const next = flatItems[flatItems.findIndex(item => item.id === itemId) + 1]
  if (next && isOpenable(next.id)) setOpen(next.id, true)
}

// Submissions are free-text pasted by the learner into localStorage, so guard
// against non-http(s) values (e.g. a stray `javascript:` URL) before linkifying.
function isHttpLink(link: string) {
  return /^https?:\/\//i.test(link)
}
</script>

<template>
  <UContainer v-if="template && progress" class="pt-10 pb-16">
    <div class="max-w-3xl">
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="font-heading font-bold text-highlighted">{{ t('program.viewer.yourPath') }}</h2>
        <span class="text-xs text-muted tabular-nums">
          {{ t('program.viewer.sidebar.xpProgress', {
            earned: progress.totalXpEarned.value,
            available: progress.totalXpAvailable.value
          }) }}
        </span>
      </div>
      <UProgress :model-value="progress.progressPercent.value" color="primary" class="mt-2" />

      <section v-for="mod in modules" :key="mod.id" class="mt-10">
        <!-- Module heading sits outside the accordion: it groups the steps and
             carries their tally, but is not itself something to open. -->
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
          <UCollapsible
            v-for="item in mod.items"
            :key="item.id"
            :open="openItemId === item.id"
            :disabled="mod.isLocked"
            :ui="{ root: 'rounded-2xl border border-default bg-default' }"
            @update:open="value => setOpen(item.id, value)"
          >
            <button
              type="button"
              class="w-full flex items-center gap-3 px-4 py-3 text-left disabled:cursor-not-allowed"
              :disabled="mod.isLocked"
            >
              <UIcon
                :name="progress.isCompleted(item.id)
                  ? 'lucide:check-circle-2'
                  : mod.isLocked ? 'lucide:lock' : 'lucide:circle'"
                class="size-5 shrink-0"
                :class="progress.isCompleted(item.id)
                  ? 'text-success'
                  : mod.isLocked ? 'text-dimmed' : 'text-muted'"
              />
              <span
                class="flex-1 min-w-0 text-sm"
                :class="[
                  mod.isLocked ? 'text-dimmed' : 'text-highlighted',
                  progress.isCompleted(item.id) ? 'line-through decoration-1 text-muted' : ''
                ]"
              >{{ item.title }}</span>
              <UIcon :name="ITEM_TYPE_ICON[item.type]" class="size-3.5 shrink-0 text-dimmed" />
              <span v-if="item.xp" class="text-xs text-dimmed tabular-nums shrink-0">+{{ item.xp }} XP</span>
              <UIcon
                v-if="!mod.isLocked"
                name="lucide:chevron-down"
                class="size-4 shrink-0 text-dimmed transition-transform duration-200"
                :class="openItemId === item.id ? 'rotate-180' : ''"
              />
            </button>

            <template #content>
              <div class="px-4 pb-4 pt-1">
                <template v-if="item.type === 'deliverable'">
                  <p class="text-sm text-default">{{ t('program.viewer.deliverable.introBody') }}</p>
                  <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.shareIntro') }}</p>
                  <ul class="mt-1 list-disc pl-5 text-sm text-default">
                    <li>{{ t('program.viewer.deliverable.shareScreenshots') }}</li>
                    <li>{{ t('program.viewer.deliverable.shareVideo') }}</li>
                    <li>{{ t('program.viewer.deliverable.shareBuild') }}</li>
                  </ul>

                  <div v-if="item.acceptanceCriteria?.length" class="mt-4 rounded-xl border border-default p-4">
                    <h4 class="text-sm font-bold text-default">{{ t('program.viewer.deliverable.acceptanceCriteria') }}</h4>
                    <ul class="mt-1 list-disc pl-5 text-sm text-default">
                      <li v-for="criterion in item.acceptanceCriteria" :key="criterion">{{ criterion }}</li>
                    </ul>
                  </div>

                  <div v-if="progress.isCompleted(item.id)" class="mt-4 flex flex-col gap-3">
                    <UBadge :label="t('program.viewer.actions.completed')" color="success" variant="soft" class="self-start" />
                    <div v-if="progress.getSubmission(item.id)" class="rounded-xl border border-default p-4">
                      <h4 class="text-sm font-bold text-highlighted">{{ t('program.viewer.deliverable.yourSubmission') }}</h4>
                      <p class="mt-2 text-sm text-default">{{ progress.getSubmission(item.id)!.description }}</p>
                      <ul v-if="progress.getSubmission(item.id)!.links.length" class="mt-2 list-disc pl-5 text-sm">
                        <li v-for="link in progress.getSubmission(item.id)!.links" :key="link">
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
                    </div>
                  </div>

                  <div v-else-if="isStarted" class="mt-4 flex flex-col gap-3">
                    <UTextarea
                      v-model="description"
                      :placeholder="t('program.viewer.deliverable.descriptionPlaceholder')"
                      :rows="4"
                    />
                    <UInputTags v-model="links" :placeholder="t('program.viewer.deliverable.linksPlaceholder')" />
                    <UButton
                      :label="t('program.viewer.deliverable.submit')"
                      color="primary"
                      class="self-start"
                      :disabled="!description.trim()"
                      @click="submitDeliverable(item.id)"
                    />
                  </div>

                  <UButton
                    v-else
                    :label="t('program.viewer.deliverable.startTask')"
                    color="primary"
                    class="mt-4"
                    @click="isStarted = true"
                  />
                </template>

                <template v-else>
                  <div class="rounded-xl border border-dashed border-default p-10 text-center text-muted text-sm">
                    {{ t('program.viewer.content.placeholder', { contentType: item.contentType }) }}
                  </div>

                  <div class="mt-4 flex items-center gap-3">
                    <UButton
                      v-if="!progress.isCompleted(item.id)"
                      :label="t('program.viewer.actions.markComplete')"
                      icon="lucide:check"
                      color="primary"
                      @click="completeAndAdvance(item.id)"
                    />
                    <UBadge
                      v-else
                      :label="t('program.viewer.actions.completed')"
                      color="success"
                      variant="soft"
                    />
                  </div>
                </template>
              </div>
            </template>
          </UCollapsible>
        </div>
      </section>
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
</template>
