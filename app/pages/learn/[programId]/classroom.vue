<script setup lang="ts">
import { programTemplates, type CurriculumItemType } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'
import { useProgramProgress } from '~/composables/useProgramProgress'

// `/learn/:programId/program` was this page's URL before the tabbed shell
// existed; keep it resolving so links already in the wild don't break.
definePageMeta({ alias: ['/learn/:programId()/program'] })

const route = useRoute()
const { t } = useI18n()

// Resolved once, non-reactively, at setup time. Safe because the shell keys
// <NuxtPage> on programId, so this page remounts instead of being reused when
// the program changes — and it lets us call useProgramProgress (which
// registers an onMounted hook) conditionally without violating Vue's "call
// hooks unconditionally on every render" rule, since Vue's setup() runs once
// per instance, not once per render like React.
const programId = route.params.programId as string
const template = programTemplates.find(p => p.id === programId)
const flatItems = template ? flattenCurriculum(template) : []
const progress = template ? useProgramProgress(template) : null

const activeItemId = computed(() => {
  const queryItem = route.query.item as string | undefined
  const item = queryItem ? flatItems.find(candidate => candidate.id === queryItem) : undefined
  if (item && !progress?.isModuleLocked(item.moduleId)) return item.id
  return flatItems[0]?.id
})

const activeItem = computed(() => flatItems.find(item => item.id === activeItemId.value))

const moduleNumber = computed(() => {
  if (!template || !activeItem.value) return 0
  return template.curriculum.findIndex(mod => mod.id === activeItem.value!.moduleId) + 1
})

function selectItem(itemId: string) {
  const item = flatItems.find(candidate => candidate.id === itemId)
  if (!item || progress?.isModuleLocked(item.moduleId)) return
  navigateTo({ path: route.path, query: { item: itemId } }, { replace: true })
}

function goToNextItem() {
  const index = flatItems.findIndex(item => item.id === activeItemId.value)
  const next = flatItems[index + 1]
  if (next) selectItem(next.id)
}

const ITEM_TYPE_ICON: Record<CurriculumItemType, string> = {
  task: 'lucide:circle-check',
  topic: 'lucide:file-text',
  survey: 'lucide:message-square-text',
  resource: 'lucide:link',
  deliverable: 'lucide:upload'
}

const modules = computed(() => template ? template.curriculum.map(mod => ({
  label: mod.title,
  value: mod.id,
  moduleItems: mod.items,
  isLocked: progress!.isModuleLocked(mod.id)
})) : [])

// Unlocked modules start expanded so the learner immediately sees where they
// can go; locked ones stay collapsed since there's nothing actionable inside.
const expandedModules = computed(() => modules.value.filter(mod => !mod.isLocked).map(mod => mod.value))

// Deliverable submission draft — cleared whenever the learner moves to a
// different item, since it's a fresh form each time, not per-item state.
const isStarted = ref(false)
const description = ref('')
const links = ref<string[]>([])
watch(activeItemId, () => {
  isStarted.value = false
  description.value = ''
  links.value = []
})

function submitDeliverable() {
  if (!activeItem.value || !progress) return
  const trimmed = description.value.trim()
  if (!trimmed) return
  progress.submitDeliverable(activeItem.value.id, { description: trimmed, links: links.value.filter(Boolean) })
}

// Submissions are free-text pasted by the learner into localStorage, so guard
// against non-http(s) values (e.g. a stray `javascript:` URL) before linkifying.
function isHttpLink(link: string) {
  return /^https?:\/\//i.test(link)
}
</script>

<template>
  <UContainer v-if="template && progress && activeItem" class="pt-10 pb-16">
    <!-- Two columns owned by this tab, not the shell: the module list is the
         classroom's own navigation and has no counterpart on the other tabs. -->
    <div class="grid grid-cols-1 lg:grid-cols-[288px_minmax(0,1fr)] gap-8 lg:gap-12">
      <aside class="lg:sticky lg:top-6 lg:self-start min-w-0">
        <h3 class="font-heading font-bold text-highlighted">{{ template.title }}</h3>
        <UProgress :model-value="progress.progressPercent.value" color="primary" class="mt-2" />
        <div class="text-xs text-muted mt-1">
          {{ t('program.viewer.sidebar.xpProgress', { earned: progress.totalXpEarned.value, available: progress.totalXpAvailable.value }) }}
        </div>

        <UAccordion
          class="mt-4"
          :items="modules"
          :default-value="expandedModules"
          type="multiple"
          :ui="{
            root: 'flex flex-col gap-3',
            item: 'rounded-2xl border border-default px-3',
            trigger: 'py-3'
          }"
        >
          <template #leading="{ item }">
            <UIcon
              v-if="item.isLocked"
              name="lucide:lock"
              class="size-7 p-1.5 shrink-0 text-dimmed"
            />
          </template>
          <template #default="{ item }">
            <span
              class="font-heading font-bold text-sm"
              :class="item.isLocked ? 'text-dimmed' : 'text-primary-600'"
            >
              {{ item.label }}
            </span>
          </template>
          <template #content="{ item }">
            <ul class="flex flex-col gap-1 pb-3">
              <li v-for="lesson in item.moduleItems" :key="lesson.id">
                <button
                  type="button"
                  class="w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="lesson.id === activeItemId ? 'bg-primary/10 text-primary' : 'text-default'"
                  :disabled="item.isLocked"
                  @click="selectItem(lesson.id)"
                >
                  <UIcon
                    :name="progress.isCompleted(lesson.id) ? 'lucide:check-circle' : 'lucide:circle'"
                    class="size-4 shrink-0"
                  />
                  <span class="truncate flex-1">{{ lesson.title }}</span>
                  <UIcon :name="ITEM_TYPE_ICON[lesson.type]" class="size-3.5 text-dimmed shrink-0" />
                </button>
              </li>
            </ul>
          </template>
        </UAccordion>
      </aside>

      <div class="min-w-0">
        <UPageCard :key="activeItem.id">
          <div class="flex items-center gap-2.5">
            <span class="font-heading font-bold text-sm text-primary-600">{{ activeItem.moduleTitle }}</span>
            <span v-if="activeItem.type !== 'deliverable'" class="text-xs text-muted uppercase">· {{ activeItem.contentType }}</span>
          </div>

          <template v-if="activeItem.type === 'deliverable'">
            <div class="flex items-start justify-between gap-4 mt-3">
              <h1 class="text-2xl font-heading font-bold text-highlighted">{{ activeItem.title }}</h1>
              <UButton
                v-if="!progress.isCompleted(activeItem.id) && !isStarted"
                :label="t('program.viewer.deliverable.startTask')"
                color="primary"
                class="shrink-0"
                @click="isStarted = true"
              />
            </div>

            <div class="mt-6">
              <h2 class="font-heading font-bold text-highlighted">{{ t('program.viewer.deliverable.descriptionHeading') }}</h2>
              <p class="mt-2 text-sm text-default">{{ t('program.viewer.deliverable.introBody') }}</p>
              <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.shareIntro') }}</p>
              <ul class="mt-1 list-disc pl-5 text-sm text-default">
                <li>{{ t('program.viewer.deliverable.shareScreenshots') }}</li>
                <li>{{ t('program.viewer.deliverable.shareVideo') }}</li>
                <li>{{ t('program.viewer.deliverable.shareBuild') }}</li>
              </ul>
              <template v-if="!isStarted && !progress.isCompleted(activeItem.id)">
                <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.submitStepsHeading') }}</p>
                <ul class="mt-1 list-disc pl-5 text-sm text-default">
                  <li>{{ t('program.viewer.deliverable.submitStep1') }}</li>
                  <li>{{ t('program.viewer.deliverable.submitStep2') }}</li>
                  <li>{{ t('program.viewer.deliverable.submitStep3') }}</li>
                </ul>
              </template>
            </div>

            <div class="mt-6 rounded-xl border border-default p-6">
              <h2 class="font-heading font-bold text-highlighted">
                {{ t('program.viewer.deliverable.milestone', { number: moduleNumber, total: template.curriculum.length, title: activeItem.moduleTitle }) }}
              </h2>
              <h3 class="mt-3 text-sm font-bold text-default">{{ t('program.viewer.deliverable.acceptanceCriteria') }}</h3>
              <ul class="mt-1 list-disc pl-5 text-sm text-default">
                <li v-for="criterion in activeItem.acceptanceCriteria" :key="criterion">{{ criterion }}</li>
              </ul>
            </div>

            <div class="mt-4 text-sm text-muted">+{{ activeItem.xp }} XP</div>

            <div v-if="progress.isCompleted(activeItem.id)" class="mt-6 flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <UBadge :label="t('program.viewer.actions.completed')" color="success" variant="soft" />
                <UButton :label="t('program.viewer.actions.nextItem')" variant="outline" @click="goToNextItem" />
              </div>
              <div v-if="progress.getSubmission(activeItem.id)" class="rounded-xl border border-default p-4">
                <h3 class="text-sm font-bold text-highlighted">{{ t('program.viewer.deliverable.yourSubmission') }}</h3>
                <p class="mt-2 text-sm text-default">{{ progress.getSubmission(activeItem.id)!.description }}</p>
                <ul v-if="progress.getSubmission(activeItem.id)!.links.length" class="mt-2 list-disc pl-5 text-sm">
                  <li v-for="link in progress.getSubmission(activeItem.id)!.links" :key="link">
                    <ULink
                      v-if="isHttpLink(link)"
                      :to="link"
                      target="_blank"
                      raw
                      class="text-primary underline break-all"
                    >
                      {{ link }}
                    </ULink>
                    <span v-else class="break-all">{{ link }}</span>
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
            <h1 class="text-2xl font-heading font-bold text-highlighted mt-3">{{ activeItem.title }}</h1>

            <div class="mt-6 rounded-xl border border-dashed border-default p-12 text-center text-muted">
              {{ t('program.viewer.content.placeholder', { contentType: activeItem.contentType }) }}
            </div>

            <div class="mt-6 flex items-center gap-3">
              <span v-if="activeItem.xp" class="text-sm text-muted">+{{ activeItem.xp }} XP</span>

              <UButton
                v-if="!progress.isCompleted(activeItem.id)"
                :label="t('program.viewer.actions.markComplete')"
                color="primary"
                @click="progress.markComplete(activeItem.id)"
              />
              <template v-else>
                <UBadge :label="t('program.viewer.actions.completed')" color="success" variant="soft" />
                <UButton :label="t('program.viewer.actions.nextItem')" variant="outline" @click="goToNextItem" />
              </template>
            </div>
          </template>
        </UPageCard>
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
</template>
