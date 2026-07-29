<script setup lang="ts">
import type { ProgramCertificate } from '~/composables/useProgramMockData'

defineProps<{
  certificate: ProgramCertificate
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-4">
    <UPageCard variant="outline" class="rounded-2xl">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <UIcon name="lucide:award" class="size-8 text-primary shrink-0" />
          <div>
            <div class="font-heading font-bold text-lg text-highlighted">{{ certificate.name }}</div>
            <div class="text-sm text-dimmed">{{ certificate.issuingOrg }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center gap-2.5">
          <UButton :label="t('program.certificate.shareButton')" icon="lucide:share-2" color="neutral" variant="subtle" />
          <UButton :label="t('program.certificate.downloadButton')" icon="lucide:download" color="neutral" variant="outline" />
        </div>
      </template>
    </UPageCard>

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
