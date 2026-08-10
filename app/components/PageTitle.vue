<script setup lang="ts">
// A page's title carries the colour its sidebar item wears when active (see
// app.config.ts's navigationMenu compoundVariants), so the page reads as
// belonging to the section you clicked. Written out per colour rather than
// built from `text-${color}-600` — Tailwind's scanner only generates classes
// it can find literally in source.
const TITLE_COLOR = {
  primary: 'text-primary-600',
  purple: 'text-purple-600',
  blue: 'text-blue-600',
  warning: 'text-warning-600',
  rose: 'text-rose-600'
} as const

withDefaults(defineProps<{
  title: string
  description?: string
  color?: keyof typeof TITLE_COLOR
}>(), {
  color: 'primary'
})
</script>

<template>
  <!-- UPageHeader's own frame is meant for docs pages: it rules a border under
       itself and pads top and bottom. Pages here space their sections with
       margins instead, so both are dropped. -->
  <UPageHeader
    :title="title"
    :description="description"
    :ui="{
      root: 'border-b-0 py-0',
      title: [
        TITLE_COLOR[color]
      ]
    }"
  >
    <template v-if="$slots.links" #links>
      <slot name="links" />
    </template>
  </UPageHeader>
</template>
