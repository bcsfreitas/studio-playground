<script setup lang="ts">
import { programTemplates } from '~/composables/useProgramMockData'
import { flattenCurriculum } from '~/composables/useProgramCurriculum'
import { useProgramProgress } from '~/composables/useProgramProgress'

definePageMeta({ layout: 'program' })

const route = useRoute()
const { t } = useI18n()

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
  const item = queryItem ? flatItems.find(candidate => candidate.id === queryItem) : undefined
  if (item && !progress?.isModuleLocked(item.moduleId)) return item.id
  return flatItems[0]?.id
})

const activeItem = computed(() => flatItems.find(item => item.id === activeItemId.value))

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
</script>

<template>
  <template v-if="template && progress">
    <ProgramSidebar
      :template="template"
      :items="flatItems"
      :active-item-id="activeItemId"
      :is-completed="progress.isCompleted"
      :is-module-locked="progress.isModuleLocked"
      :progress-percent="progress.progressPercent.value"
      :total-xp-earned="progress.totalXpEarned.value"
      :total-xp-available="progress.totalXpAvailable.value"
      @select-item="selectItem"
    />
    <ProgramContentViewer
      v-if="activeItem"
      :key="activeItem.id"
      :item="activeItem"
      :is-completed="progress.isCompleted(activeItem.id)"
      :module-number="template.curriculum.findIndex(mod => mod.id === activeItem.moduleId) + 1"
      :total-modules="template.curriculum.length"
      :submission="progress.getSubmission(activeItem.id)"
      @mark-complete="progress.markComplete(activeItem.id)"
      @next-item="goToNextItem"
      @submit-deliverable="payload => progress.submitDeliverable(activeItem.id, payload)"
    />
  </template>
  <p v-else class="p-8">{{ t('program.viewer.notFound') }}</p>
</template>
