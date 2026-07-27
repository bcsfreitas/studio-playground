<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between w-full" :class="subtitle ? '' : 'mb-3.5'">
      <h2 class="m-0 font-heading font-bold tracking-[-0.5px] text-highlighted text-2xl">
        {{ title }}
      </h2>
      <slot name="trailing" />
    </div>
    <p v-if="subtitle" class="text-sm text-muted mb-3.5">{{ subtitle }}</p>
  </div>
</template>
