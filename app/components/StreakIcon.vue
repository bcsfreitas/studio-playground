<script setup lang="ts">
// The platform's streak flame. A plain <img>, not <Icon>: this is a five-colour
// brand mark, and the Iconify components in this repo render single-colour
// glyphs that inherit `currentColor` — they would flatten it.
//
// It exists as a component so the asset path lives in one place. Callers set
// the size with a `class` (`size-4`, `size-[37px]`, …), which falls through to
// the root here.
withDefaults(defineProps<{
  // Decorative by default: every place this appears sits beside the streak
  // count or a "N-day streak" heading, which already says it out loud.
  alt?: string
}>(), {
  alt: ''
})
</script>

<template>
  <img src="/images/icons/streak.svg" :alt="alt" class="shrink-0">
</template>
