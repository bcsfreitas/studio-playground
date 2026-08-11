<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  /** What's actually behind the gate — caller-supplied, already translated. */
  body: string
  /** The ungated alternatives: Flow 6 requires the dead end to have exits. */
  exits: { label: string, to: RouteLocationRaw }[]
}>()

const { t } = useI18n()
</script>

<template>
  <!-- Same convention as AuthGuestPrompt: replaces the gated control in
       place, states plainly what's behind it, and — unlike the guest wall —
       always offers a way out, per Flow 6's explicit requirement. -->
  <UPageCard variant="outline" class="rounded-2xl">
    <div class="flex items-start gap-3">
      <div class="size-9 rounded-full bg-kids-50 text-kids flex items-center justify-center shrink-0">
        <Icon name="lucide:shield-check" class="size-4" />
      </div>
      <div>
        <h3 class="m-0 font-heading text-sm font-bold text-highlighted">{{ t('onboarding.vpcGate.title') }}</h3>
        <p class="mt-1 text-sm text-muted">{{ body }}</p>
      </div>
    </div>

    <template #footer>
      <p class="text-xs font-semibold text-dimmed mb-2">{{ t('onboarding.vpcGate.exitsLabel') }}</p>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="exit in exits"
          :key="exit.label"
          :to="exit.to"
          :label="exit.label"
          color="neutral"
          variant="outline"
          size="sm"
        />
      </div>
    </template>
  </UPageCard>
</template>
