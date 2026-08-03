import type { NuxtPage } from '@nuxt/schema'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-21',
  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'kids', 'purple', 'blue', 'rose']
    },
    // @nuxt/fonts' Storybook dev-handler crashes the whole process (passes a
    // bare {path} object instead of a real h3 event to setResponseHeader).
    // Fonts here load via a plain @import in main.css, so the module isn't
    // needed — disable it only under Storybook to dodge the crash.
    fonts: process.env.STORYBOOK === 'true' ? false : undefined
  },
  icon: {
    provider: 'server',
    serverBundle: {
      collections: ['lucide']
    }
  },
  colorMode: {
    preference: 'light'
  },
  i18n: {
    defaultLocale: 'en',
    // Keeps existing routes (/, /learn, /learn/[programId]) unprefixed — only
    // the Program page's own copy is translated so far, not the whole app.
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'es', name: 'Español', file: 'es.json' }
    ]
  },
  hooks: {
    // app/pages/learn/[programId]/program.vue lives in a directory whose name
    // exactly matches the sibling app/pages/learn/[programId].vue file. Nuxt's
    // file-based router treats that as parent/child nesting (a page file +
    // same-named directory = nested route), which would silently swallow the
    // content route unless [programId].vue rendered a <NuxtPage/> outlet — it
    // doesn't, and we don't want to add one just for this. Promote the
    // scanned content page back to an independent top-level route instead, so
    // it renders on its own rather than inside the program detail page.
    'pages:extend'(pages) {
      function extractContentPage(list: NuxtPage[]): NuxtPage | undefined {
        for (let i = 0; i < list.length; i++) {
          const page = list[i]!
          if (page.file?.endsWith('pages/learn/[programId]/program.vue')) {
            list.splice(i, 1)
            return page
          }
          if (page.children?.length) {
            const found = extractContentPage(page.children)
            if (found) return found
          }
        }
        return undefined
      }

      const contentPage = extractContentPage(pages)
      if (contentPage) {
        contentPage.path = '/learn/:programId/program'
        pages.push(contentPage)
      }
    }
  }
})