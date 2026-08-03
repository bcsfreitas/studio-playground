<script setup lang="ts">
import type { ProgramCertificate } from '~/composables/useProgramMockData'

defineProps<{
  certificate: ProgramCertificate
}>()

const { t } = useI18n()

const BENEFITS = ['validateSkills', 'keepForever', 'shareAnywhere'] as const
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div class="rounded-2xl border border-default p-6">
        <div class="rounded-xl border border-dashed border-default p-6 flex flex-col items-center text-center gap-2">
          <span class="text-xs font-semibold text-dimmed uppercase tracking-wide">
            {{ t('program.certificate.eyebrow') }}
          </span>
          <UIcon name="lucide:award" class="size-10 text-primary my-2" />
          <div class="font-heading font-bold text-lg text-highlighted">{{ certificate.name }}</div>
          <div class="text-sm text-dimmed">{{ certificate.issuingOrg }}</div>
        </div>
      </div>

      <ul class="flex flex-col gap-4">
        <li v-for="benefit in BENEFITS" :key="benefit" class="flex items-start gap-3">
          <UIcon name="lucide:check-circle-2" class="size-5 text-primary shrink-0 mt-0.5" />
          <p class="text-sm text-default">
            <span class="font-semibold text-highlighted">{{ t(`program.certificate.benefits.${benefit}.title`) }}</span>
            — {{ t(`program.certificate.benefits.${benefit}.body`, { issuingOrg: certificate.issuingOrg }) }}
          </p>
        </li>
      </ul>
    </div>

    <div v-if="certificate.microcredentials?.length" class="flex flex-col gap-2">
      <span class="text-xs font-semibold text-muted uppercase tracking-wide">
        {{ t('program.certificate.microcredentialsLabel') }}
      </span>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="mc in certificate.microcredentials"
          :key="mc.id"
          :label="mc.name"
          icon="lucide:badge-check"
          color="secondary"
          variant="subtle"
        />
      </div>
    </div>
  </div>
</template>
