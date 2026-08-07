<script setup lang="ts">
import { NuxtLink } from '#components'
import type { PathChoice } from '~/composables/useHomeMockData'

defineProps<{
  choices: PathChoice[]
}>()
</script>

<template>
  <div class="flex flex-col gap-12 lg:flex-row">
    <!-- NuxtLink imported from #components rather than looked up with
         resolveComponent: the runtime lookup fails inside `:is` here, which
         silently rendered every card as an inert <div> — the cards looked
         right and did nothing. -->
    <component
      :is="choice.to ? NuxtLink : 'div'"
      v-for="choice in choices"
      :key="choice.id"
      :to="choice.to"
      class="group relative block min-w-0 flex-1 basis-0
             transition-transform duration-500 ease-out
             hover:z-10 hover:scale-[1.03] focus-within:z-10 focus-within:scale-[1.03]"
    >
      <!-- The growth is a transform on the hovered card itself, not `flex-grow`:
           a transform is off the layout path, so the other two cards hold their
           positions exactly. It lives on the group rather than the card inside
           it so that hit-testing grows too — otherwise the cursor entering the
           extra few pixels would fall outside the hover target and the card
           would flicker between sizes. `z-10` keeps the grown card and its glow
           above the neighbour that paints after it. -->
      <!-- The glow is the card's own tint, handed to CSS as a variable because
           a Tailwind hover variant cannot read a per-item value any other way —
           `:style` has no hover. `overflow-hidden` below crops the artwork but
           not the element's own box-shadow, so the colour spills outside. -->
      <div
        :style="{ '--glow': `${choice.tint}80` }"
        class="relative h-[140px] overflow-hidden rounded-2xl px-6 py-5 ring-1 ring-black/5
               shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]
               transition-shadow duration-500 ease-out
               group-hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35),0_18px_48px_-10px_var(--glow)]
               group-focus-within:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35),0_18px_48px_-10px_var(--glow)]"
      >
        <!-- The only motion on the card: the artwork pushes in behind fixed
             copy. `overflow-hidden` on the parent is what crops it, and scaling
             a transform keeps this off the layout path entirely. -->
        <img
          :src="choice.image"
          alt=""
          class="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out
                 group-hover:scale-150 group-focus-within:scale-110"
        >

        <!-- Two stacked gradients, painted top layer first.

             The tint runs `to bottom`, not the reference's `to top`: the
             reference puts its solid end under bottom-aligned copy, and this
             layout is top-aligned, so it flips or the white text lands on the
             transparent end.

             The black scrim above it is what makes the copy readable. White on
             the light blue tint is only 2.4:1 — well under WCAG AA — and the
             painterly art bleeding through the 90% opacity can lighten it
             further. At 0.4, the worst case (blue over a white pixel) is
             4.8:1, and it fades out by 72% so the artwork stays vivid below. -->
        <div
          class="absolute inset-0 opacity-90"
          :style="{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 72%),`
              + `linear-gradient(to bottom, ${choice.tint} 0%, ${choice.tint}CC 55%, ${choice.tint}66 100%)`
          }"
        />

        <div class="relative z-10 flex flex-col gap-1.5">
          <!-- One heading, two lines: the shared "I want to" sits above in a
               lighter, smaller face so the part that differs between the three
               cards is what the eye lands on. -->
          <h3 class="font-heading text-white">
            <span class="block text-sm font-normal text-white/90">{{ choice.lead }}</span>
            <span class="block text-2xl font-extrabold tracking-[-0.5px]">{{ choice.title }}</span>
          </h3>
          <p class="text-sm leading-5 text-white/85">{{ choice.description }}</p>
        </div>
      </div>
    </component>
  </div>
</template>
