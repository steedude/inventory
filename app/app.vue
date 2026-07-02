<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { locale, t } = useI18n()

const siteUrl = computed(() => String(config.public.siteUrl).replace(/\/$/, ''))
const canonicalUrl = computed(() => {
  const path = route.path === '/' ? '' : route.path

  return `${siteUrl.value}${path}`
})

useHead(() => ({
  htmlAttrs: {
    lang: locale.value === 'zh-tw' ? 'zh-TW' : 'en',
  },
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
  ],
  titleTemplate: (title?: string) => title === undefined
    ? t('app.name')
    : `${title} | ${t('app.name')}`,
}))

useSeoMeta({
  title: () => t('app.name'),
  description: () => t('home.description'),
  ogTitle: () => t('app.name'),
  ogDescription: () => t('home.description'),
  ogSiteName: () => t('app.name'),
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary',
  twitterTitle: () => t('app.name'),
  twitterDescription: () => t('home.description'),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
