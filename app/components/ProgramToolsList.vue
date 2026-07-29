<script setup lang="ts">
defineProps<{
  tools: string[]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UBadge v-for="tool in tools" :key="tool" :label="tool" color="neutral" variant="soft" size="lg" />
  </div>
</template>
