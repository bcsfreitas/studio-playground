<script setup lang="ts">
defineProps<{
  programTitle: string
}>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  start: []
}>()

const { t } = useI18n()
</script>

<template>
  <!-- Genuinely non-dismissible: `dismissible` alone only blocks overlay-click
       and Escape, `close` on its own only hides the X button — both are
       needed together, since Nuxt UI defaults each independently. This is
       the "01-style" blocking card: reuses the icon-badge/title/body
       language ProgramEnrollmentCard.vue's vpc-gate step and VpcGate.vue
       both already use, but with a single unavoidable CTA instead of exits. -->
  <UModal v-model:open="open" :dismissible="false" :close="false">
    <template #title>
      <span class="sr-only">{{ t('program.preSurvey.gate.title') }}</span>
    </template>
    <template #body>
      <div class="flex flex-col items-center text-center gap-3">
        <div class="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
          <UIcon name="lucide:message-square-text" class="size-6" />
        </div>
        <div class="font-heading font-bold text-lg text-highlighted">
          {{ t('program.preSurvey.gate.title') }}
        </div>
        <p class="text-sm text-muted">
          {{ t('program.preSurvey.gate.body', { program: programTitle }) }}
        </p>
      </div>
    </template>
    <template #footer>
      <UButton
        :label="t('program.preSurvey.gate.cta')"
        color="primary"
        block
        @click="emit('start')"
      />
    </template>
  </UModal>
</template>
