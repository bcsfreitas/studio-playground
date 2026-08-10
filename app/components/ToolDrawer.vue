<script setup lang="ts">
import type { ToolCardData } from '~/composables/useMakeMockData'

const props = defineProps<{
  tool: ToolCardData | null
}>()

const open = defineModel<boolean>('open', { required: true })

// A cross-origin frame can't be inspected, so this only tracks "the load event
// fired" — enough to clear the skeleton, not enough to know the tool rendered.
const loaded = ref(false)

// Reset per open rather than per tool: reopening the same tool should show the
// skeleton again, because `v-if` below tears the frame down on close.
watch(open, (isOpen) => {
  if (isOpen) loaded.value = false
})
</script>

<template>
  <UDrawer
    v-model:open="open"
    :title="tool?.name"
    close
    handle-only
    :handle="false"
    :ui="{
      // The theme gives a bottom drawer `h-auto max-h-[96%]`, and an iframe has
      // no intrinsic height, so `h-auto` would collapse it to nothing. `dvh`
      // rather than `%`: a percentage on a fixed element resolves against the
      // large viewport, which hides the drawer's bottom under mobile browser
      // chrome.
      //
      // `!touch-auto` undoes vaul's own global `[data-vaul-drawer]{touch-action:
      // none}`. touch-action intersects down the ancestor chain and across the
      // frame boundary, so without this a touch drag inside Pixel Stitch is
      // swallowed and drawing on a tablet does nothing. It has to be neutralised
      // here, on the element carrying the attribute — a descendant cannot
      // recover it — and `!` because vaul appends its stylesheet at runtime.
      //
      // `z-[250]` because the drawer theme sets no z-index at all, and the Make
      // page's dev preview pill is `z-[200]` in the same stacking context.
      content: 'h-[92dvh] max-h-[92dvh] !touch-auto z-[250]',
      overlay: 'z-[250]',
      // `flex-1 min-h-0` is what makes the frame fill the drawer: the theme's
      // container has no grow, which is fine while the content height is
      // `h-auto` but leaves it content-sized — and so the body's `flex-1`
      // with nothing to fill — once the height above is pinned.
      //
      // `overflow-y-hidden` is spelled out alongside `overflow-hidden` because
      // tailwind-merge treats `overflow-*` and `overflow-y-*` as separate
      // groups — without it the theme's `overflow-y-auto` survives and the
      // container scrolls behind the frame.
      container: 'flex-1 min-h-0 p-0 gap-0 overflow-hidden overflow-y-hidden',
      header: 'px-4 py-3 border-b border-default',
      // `min-h-0` lets this flex child shrink so the frame's `h-full` resolves
      // against a real height; `relative` anchors the loading overlay.
      body: 'flex-1 min-h-0 p-0 relative'
    }"
  >
    <template #actions>
      <!-- Labelled rather than icon-only, and always present by design: a frame
           blocked upstream still fires `load` and renders blank, and nothing
           cross-origin can detect that — so this is the learner's only way out
           and it has to be findable without hovering. -->
      <UButton
        v-if="tool?.url"
        :to="tool.url"
        target="_blank"
        label="Open in a new tab"
        icon="lucide:external-link"
        color="neutral"
        variant="ghost"
        size="sm"
      />
    </template>

    <template #body>
      <!-- Mounted only while open, and keyed on the tool: the frame loads fresh
           each time instead of sitting in the background, and switching tools
           remounts rather than reusing the previous one's session.

           No `sandbox` attribute. These are first-party Endless Studios tools,
           and a sandbox missing `allow-downloads`/`allow-popups`/
           `allow-same-origin` silently breaks export and localStorage in a
           canvas app — on a trusted origin those are what we'd grant anyway. -->
      <iframe
        v-if="open && props.tool?.embedUrl"
        :key="props.tool.id"
        :src="props.tool.embedUrl"
        :title="props.tool.name"
        class="size-full border-0"
        allow="clipboard-read; clipboard-write; fullscreen"
        referrerpolicy="strict-origin-when-cross-origin"
        @load="loaded = true"
      />

      <!-- A spinner rather than a skeleton: a third-party embed can take several
           seconds, and a shimmer that long reads as something broken. -->
      <div v-if="!loaded" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-elevated">
        <UIcon name="lucide:loader-circle" class="size-6 animate-spin text-dimmed" />
        <p class="text-sm text-muted">Loading {{ tool?.name }}…</p>
      </div>
    </template>
  </UDrawer>
</template>
