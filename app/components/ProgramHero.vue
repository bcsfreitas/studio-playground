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
  <!-- No title here: the program title is the page header and lives in the
       shell, so it stays put across tab switches. This is the Overview tab's
       own opening block — image and description. -->
  <div class="flex flex-col gap-5">
    <img :src="template.image" alt="" class="w-full h-72 object-cover rounded-2xl bg-slate-100">

    <div>
      <p v-if="institution" class="text-sm text-dimmed">
        {{ t('program.hero.deliveredWith', { institution: institution.name }) }}
      </p>
      <p class="text-lg text-dimmed mt-2">{{ template.description }}</p>
    </div>
  </div>
</template>
