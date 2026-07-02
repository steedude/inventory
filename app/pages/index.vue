<script setup lang="ts">
const auth = useAuthStore()
const { t } = useI18n()
const config = useRuntimeConfig()

const startTo = computed(() => auth.isLogin ? '/dashboard' : '/login')
const siteUrl = computed(() => String(config.public.siteUrl).replace(/\/$/, ''))

useSeoMeta({
  title: () => t('home.seoTitle'),
  description: () => t('home.description'),
  ogTitle: () => t('home.seoTitle'),
  ogDescription: () => t('home.description'),
  ogUrl: () => siteUrl.value,
  twitterTitle: () => t('home.seoTitle'),
  twitterDescription: () => t('home.description'),
})

const features = computed(() => [
  {
    icon: 'i-lucide-table-2',
    title: t('home.features.googleSheets.title'),
    description: t('home.features.googleSheets.description'),
  },
  {
    icon: 'i-lucide-database-zap',
    title: t('home.features.database.title'),
    description: t('home.features.database.description'),
  },
  {
    icon: 'i-lucide-layers-3',
    title: t('home.features.stack.title'),
    description: t('home.features.stack.description'),
  },
])

const previewItems = [
  {
    name: 'Tuna cans',
    badge: '1 / 2',
    color: 'warning' as const,
  },
  {
    name: 'Laundry refill',
    badge: '12',
    color: 'success' as const,
  },
]
</script>

<template>
  <UContainer class="py-8 lg:py-12">
    <section class="grid min-h-[calc(100dvh-8rem)] content-center gap-8">
      <div class="app-page-intro overflow-hidden rounded-md p-5 lg:p-8">
        <div class="space-y-8">
          <div class="max-w-3xl space-y-5">
            <UBadge color="primary" variant="soft">
              {{ t('home.badge') }}
            </UBadge>
            <h1 class="text-4xl font-semibold tracking-normal text-highlighted lg:text-5xl">
              {{ t('home.title') }}
            </h1>
            <p class="max-w-2xl text-base leading-7 text-muted">
              {{ t('home.description') }}
            </p>
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <UButton icon="i-lucide-arrow-right" trailing :to="startTo">
                {{ t('home.start') }}
              </UButton>
            </div>
          </div>

          <div class="app-surface rounded-md p-4">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-highlighted">
                  {{ t('home.preview.title') }}
                </div>
                <div class="text-xs text-muted">
                  {{ t('home.preview.subtitle') }}
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-2">
                <div class="rounded-md border border-default bg-elevated p-3">
                  <div class="text-xs text-muted">
                    {{ t('home.preview.items') }}
                  </div>
                  <div class="mt-1 text-xl font-semibold text-highlighted">
                    128
                  </div>
                </div>
                <div class="rounded-md border border-default bg-elevated p-3">
                  <div class="text-xs text-warning">
                    {{ t('home.preview.lowStock') }}
                  </div>
                  <div class="mt-1 text-xl font-semibold text-highlighted">
                    6
                  </div>
                </div>
                <div class="rounded-md border border-default bg-elevated p-3">
                  <div class="text-xs text-primary">
                    {{ t('home.preview.logs') }}
                  </div>
                  <div class="mt-1 text-xl font-semibold text-highlighted">
                    42
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <div
                  v-for="item in previewItems"
                  :key="item.name"
                  class="app-list-row flex items-center justify-between rounded-md px-3 py-2"
                >
                  <span class="text-sm font-medium text-highlighted">
                    {{ item.name }}
                  </span>
                  <UBadge :color="item.color" variant="soft">
                    {{ item.badge }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="grid gap-4 lg:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="app-metric-card rounded-md p-5"
        >
          <span class="mb-4 grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
            <UIcon :name="feature.icon" class="size-5" />
          </span>
          <h2 class="text-base font-semibold text-highlighted">
            {{ feature.title }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-muted">
            {{ feature.description }}
          </p>
        </div>
      </section>
    </section>
  </UContainer>
</template>
