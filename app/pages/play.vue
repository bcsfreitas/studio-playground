<script setup lang="ts">
import { games } from '~/composables/gameData'
import { usePreviewState } from '~/composables/usePreviewState'
import { topbarStatsFor, userName, userAvatar } from '~/composables/useHomeMockData'
import { useXpBalance } from '~/composables/useXpBalance'

definePageMeta({ layout: 'dashboard' })

const { isLoggedIn, isOnboarded } = usePreviewState()
const { total: xpTotal } = useXpBalance()
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value, xpTotal.value))
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer class="mt-10">
        <PageTitle
          title="Play"
          description="Every game here was made by a kid. Play as many as you like, then leave a comment."
          color="purple"
        />

        <div class="grid grid-cols-3 gap-4 my-8">
          <GameTile
            v-for="g in games"
            :key="g.id"
            :to="`/play/${g.id}`"
            :image="g.image"
            :name="g.name"
            :description="g.description"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
