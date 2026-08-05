<script setup lang="ts">
import type { LearnerProject } from '~/composables/useProgramMockData'

defineProps<{
  project: LearnerProject
}>()

const { t } = useI18n()
</script>

<template>
  <!-- Not a link: project detail pages don't exist yet, and a card that looks
       clickable but goes nowhere is worse than one that doesn't. -->
  <UPageCard
    variant="outline"
    :ui="{ root: 'rounded-2xl', body: 'p-0', container: 'p-0 gap-0' }"
    class="overflow-hidden"
  >
    <div class="flex items-stretch gap-0">
      <img
        :src="project.image"
        alt=""
        class="w-32 sm:w-40 shrink-0 self-stretch object-cover bg-slate-100"
      >
      <div class="flex flex-col gap-1.5 p-4 min-w-0">
        <h3 class="font-heading font-bold text-highlighted text-pretty">{{ project.title }}</h3>
        <p class="text-sm text-muted line-clamp-2">{{ project.blurb }}</p>
        <div class="flex items-center gap-2 mt-auto pt-2">
          <UAvatar :text="project.authorName.charAt(0)" size="xs" />
          <span class="text-xs text-dimmed truncate">
            {{ t('program.projects.by', { author: project.authorName }) }}
          </span>
        </div>
      </div>
    </div>
  </UPageCard>
</template>
