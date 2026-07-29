export default defineNuxtConfig({
  compatibilityDate: '2026-07-21',
  modules: ['@nuxt/ui', '@nuxt/icon'],
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
  }
})