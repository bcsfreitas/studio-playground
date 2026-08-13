<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useMentorStatus } from '~/composables/useMentorStatus'

const { isMentor } = useMentorStatus()

const mainItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Home', icon: 'lucide:home', to: '/', color: 'primary' },
  { label: 'Play', icon: 'lucide:gamepad-2', to: '/play', color: 'purple' },
  { label: 'Learn', icon: 'lucide:brain', to: '/learn', color: 'blue' },
  { label: 'Make', icon: 'lucide:wrench', to: '/make', color: 'warning' },
  // Only granted once someone completes the mentor qualification drawer —
  // see useMentorStatus.ts.
  ...(isMentor.value ? [{ label: 'Teach', icon: 'lucide:graduation-cap', to: '/teach', color: 'secondary' }] : []),
  {
    label: 'Contribute',
    icon: 'lucide:blocks',
    trailingIcon: 'lucide:external-link',
    to: '#',
    color: 'rose'
  }
])

// Shared across every per-item <UNavigationMenu> below — each item gets its
// own instance so its `color` prop can drive independent hover/active states
// (see app.config.ts's navigationMenu compoundVariants).
const navMenuUi = {
  link: 'gap-2.5 px-3 py-2.5 font-semibold before:rounded-xl',
  linkTrailingIcon: 'size-4 opacity-50',
  linkLeadingAvatar: 'rounded-none',
  childList: 'ms-0 ps-[31px] border-s-0',
  childItem: 'ps-0 ms-0',
  childLink: 'gap-2.5 px-2.5 py-1.5 text-muted before:rounded-lg'
}
</script>

<template>
  <UDashboardSidebar
    :ui="{
      root: 'w-[232px] bg-default',
      header: 'px-3.5',
      body: 'px-3.5 py-3'
    }"
  >
    <template #header>
      <img src="/images/endless-logo-horizontal.svg" alt="Endless Studios" width="114" height="31" class="dark:hidden">
      <img src="/images/endless-logo-horizontal-dark.svg" alt="Endless Studios" width="114" height="31" class="hidden dark:block">
    </template>

    <template #default="{ collapsed }">
      <div class="flex flex-col gap-0.5">
        <UNavigationMenu
          v-for="item in mainItems"
          :key="item.label"
          :collapsed="collapsed"
          :items="[[item]]"
          orientation="vertical"
          :color="item.color"
          :ui="navMenuUi"
        />
      </div>
    </template>

    <template #footer>
      <div class="w-full flex justify-start">
        <UColorModeButton color="neutral" variant="outline" />
      </div>
    </template>
  </UDashboardSidebar>
</template>
