<script setup lang="ts">
import { projectsForProgram } from '~/composables/useProgramMockData'

const route = useRoute()
const { t } = useI18n()

const programId = computed(() => route.params.programId as string)
const projects = computed(() => projectsForProgram(programId.value))
</script>

<template>
  <UContainer class="pt-10 pb-16">
    <SectionTitle :title="t('program.projects.libraryTitle', projects.length, { count: projects.length })" />

    <div v-if="projects.length" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <ProgramProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </div>

    <div
      v-else
      class="border-[1.5px] border-dashed border-default flex flex-col items-center gap-2 text-center rounded-2xl mt-2"
      style="padding: 32px 24px"
    >
      <UIcon name="lucide:gamepad-2" class="size-[22px] text-primary" />
      <div class="font-heading text-[15px] font-bold text-default">{{ t('program.projects.empty') }}</div>
      <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">
        {{ t('program.projects.emptyBody') }}
      </p>
    </div>
  </UContainer>
</template>
