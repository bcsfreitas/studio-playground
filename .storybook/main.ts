import type { StorybookConfig } from '@storybook-vue/nuxt';

const config: StorybookConfig = {
  "stories": [
    "../app/components/**/*.mdx",
    "../app/components/**/*.stories.@(js|jsx|ts|tsx|mdx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook-vue/nuxt",
  // @nuxtjs/color-mode's client plugin reads window.__NUXT_COLOR_MODE__ at
  // module-import time, before .storybook/preview.ts runs — Nuxt's server
  // normally injects this via an inline script ahead of hydration, so we
  // replicate that here forced to light.
  "previewHead": (head) => `${head}
    <script>
      window.__NUXT_COLOR_MODE__ = {
        preference: 'light',
        value: 'light',
        getColorScheme: () => 'light',
        addColorScheme: () => {},
        removeColorScheme: () => {},
      };
    </script>
  `,
  "viteFinal": async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve || {}
    viteConfig.resolve.dedupe = [...(viteConfig.resolve.dedupe || []), 'react', 'react-dom']
    // Nuxt sets publicDir: false because Nitro serves app/public/ during
    // `nuxt dev`. Storybook never boots Nitro, so re-enable Vite's own
    // static serving or every asset under public/ (images, icons) 404s.
    viteConfig.publicDir = 'public'
    return viteConfig
  }
};
export default config;