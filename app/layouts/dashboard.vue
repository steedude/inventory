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

      <UContainer class="grid gap-6 pb-24 pt-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:pb-6">
        <aside class="hidden lg:sticky lg:top-22 lg:block lg:h-[calc(100dvh-7rem)]">
          <UNavigationMenu
            :items="navigationItems"
            orientation="vertical"
            class="w-full"
          />
        </aside>

        <main class="min-w-0">
          <slot />
        </main>
      </UContainer>

      <nav class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-default/95 px-4 py-2 backdrop-blur lg:hidden">
        <UNavigationMenu
          :items="bottomNavigationItems"
          class="mx-auto max-w-md justify-center"
        />
      </nav>
    </div>
  </UApp>
</template>
