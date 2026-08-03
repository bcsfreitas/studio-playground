<script setup lang="ts">
defineProps<{
  xpLabel: string
  streakDays: number
  userName: string
  notificationCount?: number
}>()
</script>

<template>
  <UDashboardNavbar :ui="{ root: 'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 border-b-0', right: 'gap-3.5' }">
    <template #right>
      <div class="inline-flex items-center gap-1.5">
        <Icon name="lucide:zap" class="size-[15px] text-primary" />
        <span class="text-sm font-semibold text-default h-5">{{ xpLabel }}</span>
      </div>
      <div class="inline-flex items-center gap-1.5">
        <img src="/images/icons/streak-flame.png" alt="" class="size-[15px]" />
        <span class="text-sm font-semibold text-default h-5">{{ streakDays }}</span>
      </div>
      <LanguageSwitcher />
      <UButton color="neutral" variant="ghost" icon="lucide:bell" aria-label="Notifications">
        <UBadge v-if="notificationCount" color="neutral" variant="outline" size="sm">{{ notificationCount }}</UBadge>
      </UButton>
      <UAvatar :text="userName.charAt(0).toUpperCase()" size="md" />
    </template>
  </UDashboardNavbar>
</template>
