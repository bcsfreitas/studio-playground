export default defineNuxtConfig({
  compatibilityDate: '2026-07-21',
  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'kids', 'purple', 'blue', 'rose']
    }
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
  }
})