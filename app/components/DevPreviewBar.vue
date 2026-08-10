<script setup lang="ts">
import { PREVIEW_STATES, usePreviewState } from '~/composables/usePreviewState'

// No props: every page shows the same bar and the state is global, so passing
// it in would just be four chances for two pages to disagree.
const { state, reset } = usePreviewState()
</script>

<template>
  <!-- Dev-only preview state (not part of the product's real UI) — see
       DESIGN.md's "Don't" list: this stays scaffolding, not a pattern to
       replicate, until real session state exists. -->
  <div class="fixed right-[18px] bottom-[18px] z-[200] flex items-center gap-2">
    <div
      class="flex items-center gap-1"
      style="background: rgba(2,6,24,0.92); border-radius: 100px; padding: 5px 6px 5px 14px; box-shadow: var(--shadow-menu)"
    >
      <span class="text-[10px] font-bold tracking-[0.08em] text-slate-400 mr-1.5">PREVIEW AS</span>

      <UButton
        v-for="preview in PREVIEW_STATES"
        :key="preview.id"
        color="neutral"
        variant="ghost"
        size="xs"
        class="px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-all duration-150"
        :class="state === preview.id
          ? 'bg-white text-slate-900 hover:bg-white'
          : 'text-slate-300 hover:bg-white/10 hover:text-white'"
        @click="state = preview.id"
      >
        {{ preview.label }}
      </UButton>

      <USeparator orientation="vertical" class="h-5 mx-1" :ui="{ border: 'border-white/15' }" />

      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="lucide:rotate-ccw"
        aria-label="Reset preview session"
        title="Back to Guest, and wipe saved lesson progress"
        class="rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
        @click="reset"
      />
    </div>
  </div>
</template>
