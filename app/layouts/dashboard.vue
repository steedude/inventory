<script setup lang="ts">
import { toasterConfig } from '../../config/toast'

const route = useRoute()
const { locale, locales, setLocale, t } = useI18n()

const localeOptions = computed(() => locales.value.map(item => ({
  label: item.name ?? item.code,
  value: item.code,
})))

const navigationItems = computed(() => [
  {
    label: t('navigation.home'),
    icon: 'i-lucide-house',
    to: '/dashboard',
    value: 'dashboard',
  },
  {
    label: t('navigation.profile'),
    icon: 'i-lucide-user',
    to: '/dashboard/profile',
    value: 'profile',
  },
  {
    label: t('navigation.data'),
    icon: 'i-lucide-database',
    to: '/dashboard/data',
    value: 'data',
  },
])

const activeNavigation = computed(() => {
  if (route.path.startsWith('/dashboard/profile')) {
    return 'profile'
  }

  if (route.path.startsWith('/dashboard/data')) {
    return 'data'
  }

  return 'dashboard'
})
</script>

<template>
  <UApp :toaster="toasterConfig">
    <div class="min-h-dvh bg-default text-default">
      <header class="sticky top-0 z-40 border-b border-default bg-default/95 backdrop-blur">
        <UContainer class="flex h-16 items-center justify-between gap-4">
          <NuxtLink to="/dashboard" class="flex min-w-0 items-center gap-3">
            <div class="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-white">
              <UIcon name="i-lucide-boxes" class="size-5" />
            </div>
            <span class="truncate text-base font-semibold text-highlighted">
              {{ t('app.name') }}
            </span>
          </NuxtLink>

          <div class="flex shrink-0 items-center gap-3">
            <USelect
              :model-value="locale"
              :items="localeOptions"
              :aria-label="t('home.language')"
              class="w-36"
              @update:model-value="setLocale"
            />
            <UButton
              icon="i-lucide-circle-user-round"
              color="neutral"
              variant="ghost"
              to="/dashboard/profile"
              :aria-label="t('navigation.profile')"
            />
          </div>
        </UContainer>
      </header>

      <UContainer class="grid gap-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside class="lg:sticky lg:top-22 lg:h-[calc(100dvh-7rem)]">
          <UNavigationMenu
            :items="navigationItems"
            :model-value="activeNavigation"
            orientation="vertical"
            class="w-full"
          />
        </aside>

        <main class="min-w-0">
          <slot />
        </main>
      </UContainer>
    </div>
  </UApp>
</template>
