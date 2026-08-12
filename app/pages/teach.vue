<script setup lang="ts">
import { userName, userAvatar, topbarStatsFor } from '~/composables/useHomeMockData'
import { useXpBalance } from '~/composables/useXpBalance'
import { usePreviewState } from '~/composables/usePreviewState'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
const { isLoggedIn, isOnboarded } = usePreviewState()
const { total: xpTotal } = useXpBalance()
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value, xpTotal.value))
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer>
        <div
          class="border-[1.5px] border-dashed border-slate-300 flex flex-col items-center gap-2 text-center rounded-2xl mt-10 mb-16"
          style="padding: 32px 24px"
        >
          <Icon name="lucide:graduation-cap" class="size-[22px] text-primary" />
          <div class="font-heading text-[15px] font-bold text-default">{{ t('teach.title') }}</div>
          <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">{{ t('teach.body') }}</p>
          <UButton :label="t('teach.backHome')" to="/" color="neutral" variant="outline" class="mt-2" />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
