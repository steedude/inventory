import process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-09',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxtjs/i18n', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: ['@supabase/supabase-js'],
    },
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    inventoryCronSecret: process.env.INVENTORY_CRON_SECRET ?? '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseKey: process.env.SUPABASE_KEY ?? '',
    },
  },
  i18n: {
    defaultLocale: 'zh-tw',
    strategy: 'no_prefix',
    locales: [
      {
        code: 'zh-tw',
        name: '繁體中文',
        file: 'zh-tw.json',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  typescript: {
    typeCheck: true,
  },
})
