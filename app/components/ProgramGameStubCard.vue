<script setup lang="ts">
import type { LinkedGame } from '~/composables/useProgramMockData'

defineProps<{
  game: LinkedGame
}>()

const { t } = useI18n()
</script>

<template>
  <UPageCard
    :to="game.to"
    :title="t('program.game.playLabel', { name: game.name })"
    reverse
    variant="outline"
    class="cursor-pointer transition-shadow duration-250 hover:shadow-xl rounded-2xl"
  >
    <img :src="game.image" alt="" class="w-full h-56 object-cover bg-slate-100 rounded-2xl">

    <template #footer>
      <div class="flex items-center gap-2 text-sm text-dimmed">
        <UIcon name="lucide:gamepad-2" class="size-4" />
        <span>{{ game.name }}</span>
        <UIcon name="lucide:arrow-right" class="size-4 ml-auto" />
      </div>
    </template>
  </UPageCard>
</template>
