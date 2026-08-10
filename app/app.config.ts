export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      secondary: 'cornflower',
      neutral: 'slate',
      warning: 'amber',
      purple: 'purple',
      blue: 'blue',
      rose: 'rose'
    },
    dashboardPanel: {
      slots: {
        // Ambient brand glow on the page canvas — see main.css `.page-glow`.
        // Pages set their own `bg-slate-50` via the `ui` prop; that's a
        // background-color utility so it merges alongside this background-image
        // class rather than replacing it.
        root: 'page-glow',
        // This body is the app's only vertical scroller (UDashboardGroup is
        // `fixed inset-0 overflow-hidden`). Reserve the scrollbar gutter
        // whether or not a scrollbar shows, so a short page and a long one lay
        // out at the same width instead of nudging centred content sideways.
        // Arbitrary property: Tailwind v4 has no scrollbar-gutter utility.
        body: '[scrollbar-gutter:stable]'
      }
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
    },
    navigationMenu: {
      // Nuxt UI's default vertical nav only colors the leading icon/label on
      // `active` — hover falls back to a neutral highlight, and active itself
      // uses a neutral (not colored) background tint. The sidebar's Figma spec
      // (Design System — Custom Components, node 242:413) wants each item's own
      // color on both hover and active, so add the missing states here rather
      // than per-link.
      variants: {
        active: {
          false: {
            link: 'text-default',
            linkLeadingIcon: 'text-default',
            childLink: 'text-default',
            childLinkIcon: 'text-default'
          }
        }
      },
      // Sidebar items each get their own color (see AppSidebar.vue). Classes
      // are written out per color (not built from a template string) because
      // Tailwind's scanner needs the literal class name in source to
      // generate it — a `${color}`-interpolated string never matches.
      compoundVariants: [
        {
          color: 'primary',
          variant: 'pill',
          active: false,
          class: {
            link: 'hover:text-primary hover:before:bg-slate-100',
            linkLeadingIcon: 'group-hover:text-primary',
            childLink: 'hover:text-primary hover:before:bg-slate-100',
            childLinkIcon: 'group-hover:text-primary'
          }
        },
        {
          color: 'primary',
          variant: 'pill',
          active: true,
          class: {
            link: 'text-primary-600 before:bg-primary-50',
            linkLeadingIcon: 'text-primary-600',
            childLink: 'text-primary-600 before:bg-primary-50',
            childLinkIcon: 'text-primary-600'
          }
        },
        {
          color: 'warning',
          variant: 'pill',
          active: false,
          class: {
            link: 'hover:text-warning hover:before:bg-slate-100',
            linkLeadingIcon: 'group-hover:text-warning',
            childLink: 'hover:text-warning hover:before:bg-slate-100',
            childLinkIcon: 'group-hover:text-warning'
          }
        },
        {
          color: 'warning',
          variant: 'pill',
          active: true,
          class: {
            link: 'text-warning-600 before:bg-warning-50',
            linkLeadingIcon: 'text-warning-600',
            childLink: 'text-warning-600 before:bg-warning-50',
            childLinkIcon: 'text-warning-600'
          }
        },
        {
          color: 'purple',
          variant: 'pill',
          active: false,
          class: {
            link: 'hover:text-purple hover:before:bg-slate-100',
            linkLeadingIcon: 'group-hover:text-purple',
            childLink: 'hover:text-purple hover:before:bg-slate-100',
            childLinkIcon: 'group-hover:text-purple'
          }
        },
        {
          color: 'purple',
          variant: 'pill',
          active: true,
          class: {
            link: 'text-purple-600 before:bg-purple-50',
            linkLeadingIcon: 'text-purple-600',
            childLink: 'text-purple-600 before:bg-purple-50',
            childLinkIcon: 'text-purple-600'
          }
        },
        {
          color: 'blue',
          variant: 'pill',
          active: false,
          class: {
            link: 'hover:text-blue hover:before:bg-slate-100',
            linkLeadingIcon: 'group-hover:text-blue',
            childLink: 'hover:text-blue hover:before:bg-slate-100',
            childLinkIcon: 'group-hover:text-blue'
          }
        },
        {
          color: 'blue',
          variant: 'pill',
          active: true,
          class: {
            link: 'text-blue-600 before:bg-blue-50',
            linkLeadingIcon: 'text-blue-600',
            childLink: 'text-blue-600 before:bg-blue-50',
            childLinkIcon: 'text-blue-600'
          }
        },
        {
          color: 'rose',
          variant: 'pill',
          active: false,
          class: {
            link: 'hover:text-rose hover:before:bg-slate-100',
            linkLeadingIcon: 'group-hover:text-rose',
            childLink: 'hover:text-rose hover:before:bg-slate-100',
            childLinkIcon: 'group-hover:text-rose'
          }
        },
        {
          color: 'rose',
          variant: 'pill',
          active: true,
          class: {
            link: 'text-rose-600 before:bg-rose-50',
            linkLeadingIcon: 'text-rose-600',
            childLink: 'text-rose-600 before:bg-rose-50',
            childLinkIcon: 'text-rose-600'
          }
        }
      ]
    }
  }
})
