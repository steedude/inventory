export default defineNuxtConfig({
  compatibilityDate: "2026-06-09",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
  ],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || "",
      supabaseKey: process.env.SUPABASE_KEY || "",
    },
  },
  i18n: {
    defaultLocale: "zh-TW",
    strategy: "no_prefix",
    locales: [
      {
        code: "zh-TW",
        name: "繁體中文",
        file: "zh-TW.ts",
      },
      {
        code: "en",
        name: "English",
        file: "en.ts",
      },
    ],
  },
  typescript: {
    typeCheck: true,
  },
});
