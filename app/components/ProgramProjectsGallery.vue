<script setup lang="ts">
import type { LearnerProject } from '~/composables/useProgramMockData'
import { useProgramTabs } from '~/composables/useProgramTabs'
import { avatarForName } from '~/composables/useProgramMockData'

const props = defineProps<{
  projects: LearnerProject[]
}>()

// Tabs are front-end state, so these switch tabs rather than navigating.
const { setTab } = useProgramTabs()

const { t } = useI18n()

// A teaser, not the library — the Projects tab holds the full set. Three keeps
// the gallery to one row at the Overview column's width.
const TEASER_COUNT = 3

const visible = computed(() => props.projects.slice(0, TEASER_COUNT))
const hasMore = computed(() => props.projects.length > TEASER_COUNT)
</script>

<template>
  <div v-if="projects.length" class="flex flex-col gap-4">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UPageCard
        v-for="project in visible"
        :key="project.id"
        variant="outline"
        :ui="{ root: 'rounded-2xl', body: 'p-0', container: 'p-0 gap-0' }"
        class="overflow-hidden cursor-pointer transition-shadow duration-250 hover:shadow-xl"
        @click="setTab('projects')"
      >
        <img :src="project.image" alt="" class="w-full h-32 object-cover bg-slate-100">
        <div class="flex flex-col gap-1 p-4">
          <div class="font-heading font-bold text-sm text-highlighted">{{ project.title }}</div>
          <p class="text-xs text-muted line-clamp-2">{{ project.blurb }}</p>
          <div class="flex items-center gap-2 mt-1">
            <UAvatar :src="avatarForName(project.authorName)" :alt="project.authorName" :text="project.authorName.charAt(0)" size="2xs" />
            <span class="text-xs text-dimmed">{{ project.authorName }}</span>
          </div>
        </div>
      </UPageCard>
    </div>

    <UButton
      v-if="hasMore"
      :label="t('program.projects.seeAll', { count: projects.length })"
      color="neutral"
      variant="outline"
      trailing-icon="lucide:arrow-right"
      class="self-start"
      @click="setTab('projects')"
    />
  </div>

  <p v-else class="text-sm text-muted">{{ t('program.projects.empty') }}</p>
</template>
