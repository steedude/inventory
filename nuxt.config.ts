import process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-09',
  devtools: { enabled: true },
  modules: ['@sentry/nuxt/module', '@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxtjs/i18n', '@nuxt/eslint'],
  sentry: {
    sourcemaps: {
      disable: true,
    },
    telemetry: false,
  },
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: [
        '@supabase/supabase-js',
        '@zxing/browser',
        '@zxing/library',
        'browser-image-compression',
      ],
    },
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    inventoryCronSecret: process.env.INVENTORY_CRON_SECRET ?? '',
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    lowStockFromEmail: process.env.LOW_STOCK_FROM_EMAIL ?? '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseKey: process.env.SUPABASE_KEY ?? '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN ?? '',
      sentryEnabled: process.env.NUXT_PUBLIC_SENTRY_ENABLED === 'true',
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
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },
})
