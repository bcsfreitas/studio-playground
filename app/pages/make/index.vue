<script setup lang="ts">
import { webTools, tailorApps, externalTools, type ToolCardData } from '~/composables/useMakeMockData'
import { userName, userAvatar, topbarStatsFor } from '~/composables/useHomeMockData'
import { useXpBalance } from '~/composables/useXpBalance'
import { usePreviewState } from '~/composables/usePreviewState'

definePageMeta({ layout: 'dashboard' })

// One drawer for the whole page rather than one per card — the cards only report
// which tool was launched. Only tools carrying an `embedUrl` ever emit.
const activeTool = ref<ToolCardData | null>(null)
const toolDrawerOpen = ref(false)

function launchTool(tool: ToolCardData) {
  activeTool.value = tool
  toolDrawerOpen.value = true
}

const { isLoggedIn, isOnboarded } = usePreviewState()
const { total: xpTotal } = useXpBalance()
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value, xpTotal.value))
</script>

<template>
  <!-- `sm:p-0`/`sm:gap-0` as well as the bare ones — see index.vue for why. -->
  <UDashboardPanel :ui="{ body: 'relative p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <div class="absolute z-[-1] rounded-full bg-amber-500 blur-[220px] size-72 sm:size-80 transform left-2/3 -translate-x-1/2 -translate-y-80"></div>
      <div class="absolute z-[-1] inset-x-0 top-0 h-[420px] overflow-hidden pointer-events-none">
        <StarsBackground color="var(--color-amber-500)" />
      </div>
      <!-- Signed in, not just active: a new learner gets the same bar, with
           counters that start at zero. Guests get the same band too, carrying
           the sign-in pair instead of an account. -->
      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer class="mt-10">

        <section class="pt-2">
          <UBadge
            label="Make"
            color="warning"
            variant="soft"
            size="md"
            class="uppercase tracking-wide"
          />
          <h1 class="mt-3 max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl text-amber-950">
            Your first game, or your fiftieth. Every tool you need is right here.
          </h1>
          <p class="mt-4 max-w-2xl text-lg font-light leading-relaxed text-muted">
            Everything you need to make games — the tools below run right inside Endless Studios, so your work stays connected to your programs and portfolio.
          </p>
        </section>

        <section class="mt-10">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard v-for="tool in webTools" :key="tool.id" :tool="tool" @launch="launchTool" />
          </div>
        </section>

        <USeparator class="my-12" />

        <section>
          <SectionTitle
            title="Threadbare Tailor"
            subtitle="A suite of creation apps for the Threadbare world — make assets and drop them straight into a quest."
          />
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <ToolCard v-for="tool in tailorApps" :key="tool.id" :tool="tool" @launch="launchTool" />
          </div>
        </section>

        <USeparator class="my-12" />

        <section class="pb-16">
          <SectionTitle title="More game-making tools" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <UButton
              v-for="tool in externalTools"
              :key="tool.id"
              :to="tool.url"
              target="_blank"
              variant="ghost"
              color="neutral"
              block
              class="justify-start h-auto py-3 gap-3"
            >
              <span class="size-9 rounded-lg flex items-center justify-center shrink-0" :style="{ background: tool.logoBg }">
                <img :src="tool.logo" :alt="tool.name" class="size-5">
              </span>
              <span class="flex-1 text-left min-w-0">
                <span class="block text-sm font-semibold text-highlighted">{{ tool.name }}</span>
                <span class="block text-xs text-dimmed truncate">{{ tool.blurb }}</span>
              </span>
              <UIcon name="lucide:external-link" class="size-4 text-dimmed shrink-0" />
            </UButton>
          </div>
        </section>
      </UContainer>
    </template>
  </UDashboardPanel>

  <!-- A page-level overlay, so it sits beside the panel rather than inside the
       content container — it only renders correctly nested because the drawer
       portals itself to <body>. -->
  <ToolDrawer v-model:open="toolDrawerOpen" :tool="activeTool" />

  <DevPreviewBar />
</template>
