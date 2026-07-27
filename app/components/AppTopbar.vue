<script setup lang="ts">
defineProps<{
  xpLabel: string
  streakDays: number
  userName: string
}>()
</script>

<template>
  <header
    class="fixed top-0 left-[232px] right-0 h-16 z-40 bg-white border-b border-default flex items-center justify-end gap-3.5 box-border"
    style="padding: 0 32px"
  >
    <div class="inline-flex items-center gap-1.5">
      <Icon name="lucide:zap" class="size-[15px] text-primary" />
      <span class="text-sm font-semibold text-default h-5">{{ xpLabel }}</span>
    </div>
    <div class="inline-flex items-center gap-1.5">
      <Icon name="lucide:flame" class="size-[15px] text-primary" />
      <span class="text-sm font-semibold text-default h-5">{{ streakDays }}</span>
    </div>
    <UAvatar :text="userName.charAt(0).toUpperCase()" size="md" />
  </header>
</template>
