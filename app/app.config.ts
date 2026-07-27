export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      secondary: 'cornflower',
      neutral: 'slate'
    },
    pageCard: {
      slots: {
        // Nuxt UI defaults this to items-start, which shrinks header/body/footer
        // content to its intrinsic width instead of filling the card — override
        // once here instead of patching `:ui="{ wrapper: '...' }"` on every card.
        wrapper: 'items-stretch',
        // Platform-wide card radius (see DESIGN.md) — override once instead of
        // adding `class="rounded-3xl"` to every instance.
        root: 'rounded-3xl'
      },
      variants: {
        variant: {
          // Default `soft` background is bg-elevated/50 — too low-contrast for
          // standalone surfaces (as opposed to e.g. subtle hover backgrounds).
          soft: {
            root: 'bg-elevated'
          }
        }
      }
    }
  }
})
