<script setup lang="ts">
withDefaults(defineProps<{
  image?: string
  name?: string
  description?: string
  tasksCount?: number
  status?: string
}>(), {
  name: 'Program',
  description: ''
})
</script>

<template>
  <UPageCard
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

    <template #footer>
      <div class="flex items-center gap-3">
        <UBadge v-if="status" :label="status" color="neutral" size="md" variant="soft" />
        <span v-if="tasksCount != null" class="inline-flex items-center gap-1.5 text-xs text-dimmed">
          <UIcon name="lucide:layers" class="size-4" />
          {{ tasksCount }} Modules
        </span>
      </div>
    </template>
  </UPageCard>
</template>
