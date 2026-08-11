<script setup lang="ts">
withDefaults(defineProps<{
  image?: string
  name?: string
  description?: string
  to?: string
}>(), {
  name: 'Game',
  description: ''
})
</script>

<template>
  <UPageCard
    :to="to"
    :title="name"
    :description="description"
    reverse
    variant="outline"
    class="cursor-pointer transition-shadow duration-250 hover:shadow-xl rounded-2xl"
    :ui="{ title: 'font-bold line-clamp-2', description: 'line-clamp-2' }"
  >
    <img
      :src="image"
      alt=""
      class="w-full h-36 object-cover bg-slate-100 rounded-2xl"
    >
  </UPageCard>
</template>
