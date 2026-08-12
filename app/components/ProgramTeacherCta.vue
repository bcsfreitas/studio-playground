<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <UPageCard
    variant="subtle"
    icon="lucide:graduation-cap"
    :title="t('program.teacherCta.title')"
    :description="t('program.teacherCta.description')"
    :ui="{ leadingIcon: 'text-dimmed', title: 'text-sm', description: 'text-sm' }"
  >
    <template #footer>
      <UButton
        to="/learn/educator-training"
        color="neutral"
        variant="outline"
        size="sm"
        trailing-icon="lucide:arrow-right"
      >
        {{ t('program.teacherCta.cta') }}
      </UButton>
    </template>
  </UPageCard>
</template>
