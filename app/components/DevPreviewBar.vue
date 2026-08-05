<script setup lang="ts">
import type { LearnerPhase } from '~/composables/useProgramMockData'

defineProps<{
  modelValue: LearnerPhase
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LearnerPhase]
}>()

// `onboarded` is a placeholder: nothing branches on it yet, so it currently
// resolves the same as `enrolled`.
const phases: { id: LearnerPhase, label: string }[] = [
  { id: 'interested', label: 'Interested' },
  { id: 'enrolled', label: 'Enrolled' },
  { id: 'onboarded', label: 'Onboarded' }
]
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
      <div
        v-for="p in phases"
        :key="p.id"
        class="px-3 py-1.5 rounded-full text-[12.5px] font-semibold cursor-pointer select-none transition-all duration-150"
        :class="modelValue === p.id ? 'bg-white text-slate-900' : 'text-slate-300'"
        @click="emit('update:modelValue', p.id)"
      >
        {{ p.label }}
      </div>
    </div>
  </div>
</template>
