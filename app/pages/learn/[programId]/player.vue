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
      :progress-percent="progress.progressPercent.value"
      :total-xp-earned="progress.totalXpEarned.value"
      :total-xp-available="progress.totalXpAvailable.value"
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
