<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  message: string
  // Always built with signUpTo()/signInTo() so the intent rides along — a guest
  // who came here to do something should land back on it.
  to: RouteLocationRaw
}>()

const { t } = useI18n()
</script>

<template>
  <!-- The prompt takes the place of the control it gates rather than hiding it
       away: platform-architecture.md treats these moments as the commitment
       trigger, so they stay in the flow of the page. -->
  <div class="flex items-center justify-between gap-3">
    <p class="text-sm text-muted">{{ message }}</p>
    <UButton :to="to" :label="t('auth.wall.cta')" color="primary" variant="soft" size="sm" class="shrink-0" />
  </div>
</template>
