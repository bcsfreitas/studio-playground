<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

// Guests get the same band, so the page below doesn't shift depending on who's
// looking — only the right-hand side changes, and the account props go unused.
defineProps<{
  guest?: boolean
  xpLabel?: string
  streakDays?: number
  userName?: string
  userAvatar?: string
  notificationCount?: number
}>()

const { locale, locales, setLocale } = useI18n()

const languageItems = computed<DropdownMenuItem[]>(() =>
  locales.value.map(l => ({
    label: l.name ?? l.code,
    type: 'checkbox' as const,
    checked: l.code === locale.value,
    // Checkbox items swallow the plain select, so the switch hangs off the
    // checked update — and unchecking the active locale is a no-op, since
    // there's no such thing as "no language".
    onUpdateChecked: (checked: boolean) => {
      if (checked) setLocale(l.code as 'en' | 'es')
    }
  }))
)

// Presentation only apart from Log Out — the rest have no destination yet, so
// no `to`. `target: '_blank'` is what draws UDropdownMenu's external-link arrow,
// which is the design's way of marking the two that leave the platform.
// Grouped so Log Out sits below a separator, away from the destructive-by-accident
// neighbours.
const accountMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    { label: 'Profile', icon: 'lucide:user' },
    { label: 'Settings', icon: 'lucide:settings' },
    { label: 'Language', icon: 'lucide:languages', children: languageItems.value }
  ],
  [
    { label: 'Support', icon: 'lucide:message-circle-more', target: '_blank' },
    { label: 'About Us', icon: 'lucide:info', target: '_blank' }
  ],
  [
    // There's no session to end, so this just returns to the sign-in screen —
    // which is where a real log out would land anyway.
    { label: 'Log Out', icon: 'lucide:log-out', to: '/auth/signin' }
  ]
])
</script>

<template>
  <!-- The tinted band is full-bleed across the panel, but the bar's own contents
       stay inside the page container so they line up with the content below
       instead of hugging the viewport edge. -->
  <div class="w-full bg-default/65 backdrop-blur border-b border-default">
    <UDashboardNavbar :ui="{ root: 'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 border-b-0', right: 'gap-3.5' }">
      <template #right>
        <!-- The language control comes along because a guest reading the
             Spanish copy has no other way to switch. -->
        <template v-if="guest">
          <UDropdownMenu :items="languageItems" :content="{ align: 'end' }" :ui="{ content: 'w-40' }">
            <UButton color="neutral" variant="soft" icon="lucide:languages" aria-label="Change language" />
          </UDropdownMenu>
          <UButton to="/auth/signin" size="lg" color="neutral" variant="outline" label="Log in" />
          <UButton to="/auth/signup" size="lg" color="primary" label="Sign up" />
        </template>

        <template v-else>
          <div class="inline-flex items-center gap-1.5">
            <img src="/images/icons/xp.svg" alt="" class="size-[24px] shrink-0">
            <span class="text-lg font-extrabold tracking-[-0.5px] text-highlighted">{{ xpLabel }}</span>
          </div>
          <div class="inline-flex items-center gap-1">
            <StreakIcon class="size-[32px]" />
            <span class="text-lg font-extrabold tracking-[-0.5px] text-highlighted">{{ streakDays }}</span>
          </div>
          <UButton color="neutral" variant="ghost" icon="lucide:bell" aria-label="Notifications">
            <UBadge v-if="notificationCount" color="neutral" variant="outline" size="sm">{{ notificationCount }}</UBadge>
          </UButton>
          <UDropdownMenu
            :items="accountMenuItems"
            :content="{ align: 'end' }"
            :ui="{ content: 'w-52' }"
          >
            <!-- A button, not a bare avatar: the menu has to be reachable by
                 keyboard, and the ring needs a focus state to land on. Ghost's
                 own background hover is cancelled — the avatar fills the control,
                 so a tinted square behind a circle just looks like a mistake. -->
            <UButton
              color="neutral"
              variant="ghost"
              :aria-label="`Account menu for ${userName}`"
              :ui="{ base: 'group p-0 rounded-full hover:bg-transparent focus-visible:outline-offset-2' }"
            >
              <!-- The initial stays as UAvatar's fallback for a portrait that
                   fails to load, same as the members and testimonial lists. -->
              <UAvatar
                :src="userAvatar"
                :alt="userName"
                :text="userName?.charAt(0).toUpperCase()"
                size="lg"
                :ui="{ root: 'ring-2 ring-transparent transition-shadow duration-200 group-hover:ring-accented group-data-[state=open]:ring-primary' }"
              />
            </UButton>
          </UDropdownMenu>
        </template>
      </template>
    </UDashboardNavbar>
  </div>
</template>
