<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <UContainer class="pt-10 pb-16">
    <SectionTitle :title="t('program.tabs.resources')" />
    <p class="text-sm text-muted">{{ t('program.tabs.notBuiltYet') }}</p>
  </UContainer>
</template>
