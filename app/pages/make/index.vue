<script setup lang="ts">
import { webTools, tailorApps, externalTools } from '~/composables/useMakeMockData'
import { userName, streakDays, xpLabel, notificationCount, type PreviewState } from '~/composables/useHomeMockData'

definePageMeta({ layout: 'dashboard' })

const state = ref<PreviewState>('active')
const isActive = computed(() => state.value === 'active')

const previewStates: { id: PreviewState, label: string }[] = [
  { id: 'new', label: 'New learner' },
  { id: 'active', label: 'Active learner' },
  { id: 'guest', label: 'Guest' }
]
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 gap-0 overflow-x-auto' }">
    <template #body>
      <AppTopbar v-if="isActive" :xp-label="xpLabel" :streak-days="streakDays" :user-name="userName" :notification-count="notificationCount" />

      <UContainer>

        <h1 class="text-6xl font-heading font-semibold text-highlighted text-pretty">Maker Tools</h1>
        <h2 class="text-lg text-dimmed mt-2 max-w-2xl">
          Everything you need to make games — the tools below run right inside Endless Studios, so your work stays connected to your programs and portfolio.
        </h2>

        <section class="mt-10">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard v-for="tool in webTools" :key="tool.id" :tool="tool" />
          </div>
        </section>

        <USeparator class="my-12" />

        <section>
          <SectionTitle
            title="Threadbare Tailor"
            subtitle="A suite of creation apps for the Threadbare world — make assets and drop them straight into a quest."
          />
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <ToolCard v-for="tool in tailorApps" :key="tool.id" :tool="tool" />
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

  <!-- Dev-only preview state switcher (not part of the product's real UI) -->
  <div
    class="fixed right-[18px] bottom-[18px] z-[200] flex items-center gap-1"
    style="background: rgba(2,6,24,0.92); border-radius: 100px; padding: 5px 6px 5px 14px; box-shadow: var(--shadow-menu)"
  >
    <span class="text-[10px] font-bold tracking-[0.08em] text-slate-400 mr-1.5">PREVIEW AS</span>
    <div
      v-for="p in previewStates"
      :key="p.id"
      class="px-3 py-1.5 rounded-full text-[12.5px] font-semibold cursor-pointer select-none transition-all duration-150"
      :class="state === p.id ? 'bg-white text-slate-900' : 'text-slate-300'"
      @click="state = p.id"
    >
      {{ p.label }}
    </div>
  </div>
</template>
