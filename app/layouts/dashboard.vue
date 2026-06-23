<script setup lang="ts">
import { toasterConfig } from '~~/config/toastConfig'

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
    exact: true,
    value: 'dashboard',
  },
  {
    label: t('navigation.profile'),
    icon: 'i-lucide-user',
    to: '/dashboard/profile',
    exact: true,
    value: 'profile',
  },
  {
    label: t('quickUse.title'),
    icon: 'i-lucide-scan-barcode',
    to: '/dashboard/quick-use',
    exact: true,
    value: 'quick-use',
  },
  {
    label: t('data.pages.createItem'),
    icon: 'i-lucide-package-plus',
    to: '/dashboard/create-item',
    exact: true,
    value: 'data-create-item',
  },
  {
    label: t('data.pages.itemList'),
    icon: 'i-lucide-list',
    to: '/dashboard/item-list',
    exact: true,
    value: 'data-item-list',
  },
  {
    label: t('logs.title'),
    icon: 'i-lucide-history',
    to: '/dashboard/logs',
    exact: true,
    value: 'inventory-logs',
  },
  {
    label: t('data.sections.category'),
    icon: 'i-lucide-tags',
    to: '/dashboard/category-settings',
    exact: true,
    value: 'data-settings',
  },
])

const bottomNavigationItems = computed(() => navigationItems.value.map(item => ({
  ...item,
  label: undefined,
})))
</script>

<template>
  <UApp :toaster="toasterConfig">
    <div class="app-shell min-h-dvh text-default">
      <header class="app-header sticky top-0 z-40">
        <div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <NuxtLink to="/dashboard" class="flex min-w-0 items-center gap-3">
            <div class="app-brand-mark grid size-9 shrink-0 place-items-center rounded-md text-white">
              <UIcon name="i-lucide-boxes" class="size-5" />
            </div>
            <div class="min-w-0">
              <span class="hidden truncate text-base font-semibold text-highlighted sm:block">
                {{ t('app.name') }}
              </span>
              <span class="hidden text-xs text-muted lg:block">
                Inventory control
              </span>
            </div>
          </NuxtLink>

          <div class="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <USelect
              :model-value="locale"
              :items="localeOptions"
              :aria-label="t('home.language')"
              class="hidden w-36 sm:block"
              @update:model-value="setLocale"
            />
            <UButton
              icon="i-lucide-circle-user-round"
              color="neutral"
              variant="ghost"
              to="/dashboard/profile"
              :aria-label="t('navigation.profile')"
              class="hidden sm:inline-flex"
            />
          </div>
        </div>
      </header>

      <div class="mx-auto grid w-[calc(100vw-2rem)] max-w-7xl gap-6 pb-24 pt-6 sm:w-full sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8 lg:pb-8">
        <aside class="hidden lg:sticky lg:top-22 lg:block lg:h-[calc(100dvh-7rem)]">
          <div class="app-sidebar rounded-md border border-default p-2">
            <UNavigationMenu
              :items="navigationItems"
              orientation="vertical"
              class="w-full"
            />
          </div>
        </aside>

        <main class="min-w-0 overflow-hidden">
          <slot />
        </main>
      </div>

      <nav class="app-header fixed inset-x-0 bottom-0 z-40 px-4 py-2 lg:hidden">
        <UNavigationMenu
          :items="bottomNavigationItems"
          class="mx-auto max-w-md justify-center"
        />
      </nav>
    </div>
  </UApp>
</template>
