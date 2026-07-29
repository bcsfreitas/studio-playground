<script setup lang="ts">
defineProps<{
  prerequisites: string[]
}>()

const { t } = useI18n()
</script>

<template>
  <ul v-if="prerequisites.length" class="flex flex-col gap-2.5">
    <li v-for="item in prerequisites" :key="item" class="flex items-start gap-2.5 text-sm text-default">
      <UIcon name="lucide:check-circle-2" class="size-5 text-success shrink-0" />
      <span>{{ item }}</span>
    </li>
  </ul>

  <div
    v-else
    class="border-[1.5px] border-dashed border-slate-300 flex flex-col items-center gap-2 text-center rounded-2xl"
    style="padding: 32px 24px"
  >
    <Icon name="lucide:check-check" class="size-[22px] text-primary" />
    <div class="font-heading text-[15px] font-bold text-default">{{ t('program.prerequisites.emptyTitle') }}</div>
    <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">{{ t('program.prerequisites.emptyBody') }}</p>
  </div>
</template>
