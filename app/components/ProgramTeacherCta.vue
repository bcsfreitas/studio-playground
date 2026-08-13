<script setup lang="ts">
const { t } = useI18n()

const drawerOpen = ref(false)
</script>

<template>
  <UPageCard
    variant="subtle"
    icon="lucide:graduation-cap"
    :title="t('program.teacherCta.title')"
    :description="t('program.teacherCta.description')"
  >
    <template #footer>
      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        trailing-icon="lucide:arrow-right"
        @click="drawerOpen = true"
      >
        {{ t('program.teacherCta.cta') }}
      </UButton>
    </template>
  </UPageCard>

  <CreateCohortDrawer v-model:open="drawerOpen" />
</template>
