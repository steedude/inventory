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
        name: '\u7E41\u9AD4\u4E2D\u6587',
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
