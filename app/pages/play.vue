<script setup lang="ts">
import { games } from '~/composables/gameData'
import { usePreviewState } from '~/composables/usePreviewState'
import { topbarStatsFor, userName, userAvatar } from '~/composables/useHomeMockData'
import { useXpBalance } from '~/composables/useXpBalance'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
const { isLoggedIn, isOnboarded } = usePreviewState()
const { total: xpTotal } = useXpBalance()
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value, xpTotal.value))
</script>

<template>
  <!-- `sm:p-0`/`sm:gap-0` as well as the bare ones — see index.vue for why. -->
  <UDashboardPanel :ui="{ body: 'relative p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <div class="absolute z-[-1] rounded-full bg-purple-500 blur-[220px] size-72 sm:size-80 transform left-2/3 -translate-x-1/2 -translate-y-80"></div>
      <div class="absolute z-[-1] inset-x-0 top-0 h-[420px] overflow-hidden pointer-events-none">
        <StarsBackground color="var(--color-purple-500)" />
      </div>
      <!-- Signed in, not just active: a new learner gets the same bar, with
           counters that start at zero. Guests get the same band too, carrying
           the sign-in pair instead of an account. -->
      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer class="mt-10">
        <section class="pt-2">
          <UBadge
            :label="t('play.hero.eyebrow')"
            color="purple"
            variant="soft"
            size="md"
            class="uppercase tracking-wide"
          />
          <h1 class="mt-3 max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl text-purple-950">
            {{ t('play.hero.title') }}
          </h1>
          <p class="mt-4 max-w-2xl text-lg font-light leading-relaxed text-muted">
            {{ t('play.hero.subtitle') }}
          </p>
        </section>

        <section class="mt-10 pb-16">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameTile
              v-for="g in games"
              :key="g.id"
              :to="`/play/${g.id}`"
              :image="g.image"
              :name="g.name"
              :description="g.description"
            />
          </div>
        </section>
      </UContainer>
    </template>
  </UDashboardPanel>

  <DevPreviewBar />
</template>
