<script setup lang="ts">
import type {
  ProgramTemplate,
  DeliveringInstitution
} from '~/composables/useProgramMockData'

defineProps<{
  template: ProgramTemplate
  institution?: DeliveringInstitution
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-5">
    <img :src="template.image" alt="" class="w-full h-72 object-cover rounded-2xl bg-slate-100">

    <div>
      <h1 class="text-5xl font-heading font-bold text-highlighted text-pretty">{{ template.title }}</h1>
      <p v-if="institution" class="text-sm text-dimmed mt-2">
        {{ t('program.hero.deliveredWith', { institution: institution.name }) }}
      </p>
      <p class="text-lg text-dimmed mt-2">{{ template.description }}</p>
    </div>
  </div>
</template>
