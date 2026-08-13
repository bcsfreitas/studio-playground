<script setup lang="ts">
import { programTemplates } from '~/composables/useProgramMockData'

const selectedTemplateId = defineModel<string | null>({ required: true })

const emit = defineEmits<{
  next: []
}>()

const { t } = useI18n()

// Educator Training is facilitator-facing, not a course a mentor runs a
// classroom on — excluded by audience rather than by id, so any future
// educator-only program is excluded the same way without another edit here.
const templates = computed(() => programTemplates.filter(template => template.audience !== 'educator'))

const programs = computed(() => templates.value.map(template => ({
  id: template.id,
  cohortStart: null,
  cohortEnd: null,
  enrolled: false,
  template
})))
</script>

<template>
  <div class="max-w-2xl mx-auto flex flex-col gap-6 py-4">
    <h2 class="font-heading text-2xl font-bold text-highlighted">{{ t('teach.new.wizard.course.title') }}</h2>

    <div class="flex flex-col gap-4">
      <LearnProgramRow
        v-for="program in programs"
        :key="program.id"
        :program="program"
        selectable
        :selected="program.id === selectedTemplateId"
        @select="selectedTemplateId = program.id"
      />
    </div>

    <UButton
      :label="t('teach.new.wizard.course.continue')"
      color="primary"
      size="lg"
      block
      :disabled="!selectedTemplateId"
      @click="emit('next')"
    />
  </div>
</template>
