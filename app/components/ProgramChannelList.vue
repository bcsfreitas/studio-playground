<script setup lang="ts">
import type { ProgramChannel } from '~/composables/useProgramMockData'

defineProps<{
  channels: ProgramChannel[]
}>()

const selected = defineModel<string>({ required: true })

const { t } = useI18n()
</script>

<template>
  <UPageCard variant="soft" :ui="{ body: 'p-2', container: 'p-0 gap-0' }">
    <h3 class="text-xs font-semibold text-dimmed uppercase tracking-wide px-2 pt-2 pb-1">
      {{ t('program.community.channels') }}
    </h3>
    <nav class="flex flex-col">
      <button
        v-for="channel in channels"
        :key="channel.id"
        type="button"
        class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors"
        :class="channel.id === selected
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-default hover:bg-elevated'"
        :aria-current="channel.id === selected ? 'true' : undefined"
        @click="selected = channel.id"
      >
        <UIcon :name="channel.icon" class="size-4 shrink-0" />
        <span class="truncate flex-1">{{ channel.name }}</span>
        <UIcon
          v-if="channel.restricted"
          name="lucide:lock"
          class="size-3 shrink-0 text-dimmed"
          :aria-label="t('program.community.restricted')"
        />
      </button>
    </nav>
  </UPageCard>
</template>
