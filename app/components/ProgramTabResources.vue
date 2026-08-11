<script setup lang="ts">
import { programTemplates } from '~/composables/useProgramMockData'

const route = useRoute()
const { t } = useI18n()

const programId = computed(() => route.params.programId as string)
const template = computed(() => programTemplates.find(p => p.id === programId.value))
</script>

<template>
  <UContainer v-if="template" class="pt-10 pb-16">
    <SectionTitle :title="t('program.tabs.resources')" />

    <div v-if="template.resources?.length" class="flex flex-col gap-6 mt-6">
      <UPageCard
        v-for="section in template.resources"
        :key="section.id"
        :title="section.title"
      >
        <ProgramSessionBody :blocks="section.body" />
      </UPageCard>
    </div>

    <p v-else class="text-sm text-muted mt-6">{{ t('program.tabs.notBuiltYet') }}</p>
  </UContainer>
</template>
