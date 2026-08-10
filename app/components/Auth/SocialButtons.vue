<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

// The page decides what a provider does, the same way it handles the email
// path — this component only reports which one was picked.
const emit = defineEmits<{
  select: [provider: 'google' | 'microsoft' | 'apple']
}>()

const { t } = useI18n()

// Microsoft rather than GitHub: the people signing in here are learners and
// their teachers, and schools run on Microsoft accounts.
const PROVIDERS = ['google', 'microsoft', 'apple'] as const
</script>

<template>
  <div class="flex flex-col gap-2">
    <UButton
      v-for="provider in PROVIDERS"
      :key="provider"
      block
      color="neutral"
      variant="outline"
      size="lg"
      :disabled="disabled"
      :label="t(`auth.social.${provider}`)"
      @click="emit('select', provider)"
    >
      <template #leading>
        <!-- Raw SVG, which CLAUDE.md asks be called out. Only the `lucide`
             Iconify collection is bundled (nuxt.config.ts) and lucide carries
             no brand marks; the obvious alternative, `simple-icons`, is
             monochrome, and Google's mark is the one logo people actually read
             by colour. Three inline paths beat a dependency plus a worse
             rendering. Everything around them is still UButton. -->
        <svg v-if="provider === 'google'" viewBox="0 0 48 48" class="size-5 shrink-0" aria-hidden="true">
          <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1z" />
          <path fill="#34A853" d="M24 46c6 0 11-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.6-3.9-12.3-9.1H4.4v5.7C7.9 41 15.4 46 24 46z" />
          <path fill="#FBBC05" d="M11.7 28.1c-.4-1.3-.7-2.7-.7-4.1s.2-2.8.7-4.1v-5.7H4.4A22 22 0 0 0 2 24c0 3.6.9 6.9 2.4 9.8l7.3-5.7z" />
          <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C35 4.2 30 2 24 2 15.4 2 7.9 7 4.4 14.2l7.3 5.7c1.7-5.2 6.6-9.1 12.3-9.1z" />
        </svg>

        <svg v-else-if="provider === 'microsoft'" viewBox="0 0 23 23" class="size-5 shrink-0" aria-hidden="true">
          <path fill="#F25022" d="M1 1h10v10H1z" />
          <path fill="#7FBA00" d="M12 1h10v10H12z" />
          <path fill="#00A4EF" d="M1 12h10v10H1z" />
          <path fill="#FFB900" d="M12 12h10v10H12z" />
        </svg>

        <!-- `currentColor` so Apple's monochrome mark follows the button's own
             text colour into dark mode, where solid black would disappear. -->
        <svg v-else viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M17.05 12.53c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.61-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.84.86-3.6 2.18-1.54 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.51-.71 2.84-.71s1.7.71 2.86.69c1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.32-3.5zM14.9 5.98c.6-.73 1-1.75.89-2.76-.86.03-1.9.57-2.52 1.3-.56.64-1.05 1.68-.92 2.67.96.07 1.94-.49 2.55-1.21z" />
        </svg>
      </template>
    </UButton>
  </div>
</template>
