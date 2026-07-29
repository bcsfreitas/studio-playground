<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  showAdmin?: boolean
}>(), {
  showAdmin: true
})

const adminItems = ['Games', 'Programs', 'Resources', 'Intake Form', 'Feed Console', 'Users', 'Institutions', 'Events']

const mainItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Home', icon: 'lucide:home', to: '/', color: 'primary' },
  { label: 'Play', icon: 'lucide:gamepad-2', to: '#', color: 'purple' },
  { label: 'Learn', icon: 'lucide:brain', to: '/learn', color: 'blue' },
  { label: 'Make', icon: 'lucide:blocks', to: '#', color: 'warning' },
  {
    label: 'Contribute',
    avatar: { src: '/images/logo-endless.svg', alt: '' },
    trailingIcon: 'lucide:external-link',
    to: '#',
    color: 'rose'
  }
])

const adminGroup = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Admin',
    icon: 'lucide:settings',
    defaultOpen: true,
    children: adminItems.map(label => ({ label, to: '#' }))
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
      <img src="/images/endless-logo-horizontal.svg" alt="Endless Studios" width="114" height="31">
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

      <template v-if="showAdmin">
        <USeparator class="my-2" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="[adminGroup]"
          orientation="vertical"
          color="primary"
          :ui="navMenuUi"
        />
      </template>
    </template>
  </UDashboardSidebar>
</template>
