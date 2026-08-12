<script setup lang="ts">
// Ambient rising-dots backdrop, ported from Nuxt UI's own marketing site
// (ui.nuxt.com/templates hero — their `StarsBg` component). Three layers of
// randomly placed dots drift upward at different speeds/opacities for a
// subtle parallax depth; a vertical mask fades them out at both edges so the
// field has no hard top/bottom line.
withDefaults(defineProps<{
  color?: string
}>(), {
  color: 'var(--ui-primary)'
})

// Each layer scrolls the height below before its instant animation-loop
// reset — with 90-120 randomly placed dots and a 100-200s cycle, the reset
// isn't perceptible, so there's no need for the field to tile seamlessly.
const FIELD_HEIGHT = 2000

const LAYERS = [
  { duration: '100s', opacity: 1, count: 300 },
  { duration: '150s', opacity: 0.75, count: 200 },
  { duration: '200s', opacity: 0.5, count: 200 }
].map(layer => ({
  ...layer,
  stars: Array.from({ length: layer.count }, () => {
    const size = `${(1 + Math.random()).toFixed(2)}px`
    return { left: `${Math.random() * 100}%`, top: `${Math.random() * FIELD_HEIGHT}px`, size }
  })
}))
</script>

<template>
  <div class="stars size-full absolute inset-x-0 top-0" :style="{ '--star-color': color }">
    <div
      v-for="(layer, i) in LAYERS"
      :key="i"
      class="star-layer"
      :style="{ '--star-duration': layer.duration, '--star-opacity': layer.opacity }"
    >
      <div
        v-for="(star, j) in layer.stars"
        :key="j"
        class="star absolute rounded-full"
        :style="{ left: star.left, top: star.top, width: star.size, height: star.size }"
      />
    </div>
  </div>
</template>

<style scoped>
.stars {
  mask-image: linear-gradient(#d9d9d900, #d9d9d9cc 25%, #d9d9d9 50%, #d9d9d9cc 75%, #d9d9d900);
  mask-size: cover;
}

.star-layer {
  position: absolute;
  inset: 0;
  animation: rising-stars linear infinite;
  animation-duration: var(--star-duration);
  will-change: transform;
}

.star {
  background-color: var(--star-color);
  opacity: var(--star-opacity);
}

@keyframes rising-stars {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-2000px);
  }
}
</style>
