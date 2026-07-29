<script setup lang="ts">
import type { WhatsNext } from '~/composables/useProgramMockData'

defineProps<{
  whatsNext?: WhatsNext
}>()

const { t } = useI18n()
</script>

<template>
  <UPageCard
    v-if="whatsNext"
    variant="soft"
    :to="whatsNext.to"
    :title="whatsNext.label"
    :description="whatsNext.description"
    class="cursor-pointer"
  >
    <template #footer>
      <UButton
        :label="t('program.whatsNext.viewProgram')"
        variant="ghost"
        color="secondary"
        trailing-icon="lucide:arrow-right"
      />
    </template>
  </UPageCard>
</template>
