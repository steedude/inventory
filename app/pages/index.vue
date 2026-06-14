<script setup lang="ts">
const auth = useAuthStore()
const { t } = useI18n()

const startTo = computed(() => auth.isLogin ? '/dashboard' : '/login')

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
</script>

<template>
  <UContainer class="py-10 lg:py-14">
    <section class="grid min-h-[calc(100dvh-9rem)] content-center gap-8">
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

      <section class="grid gap-4 lg:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="rounded-md border border-default bg-default p-5"
        >
          <UIcon :name="feature.icon" class="mb-4 size-6 text-primary" />
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
