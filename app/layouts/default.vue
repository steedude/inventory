<script setup lang="ts">
import { toasterConfig } from '~~/config/toastConfig'

const auth = useAuthStore()
const authService = useAuth()
const { locale, locales, setLocale, t } = useI18n()

onMounted(() => {
  void authService.initialize()
})

const localeOptions = computed(() => locales.value.map(item => ({
  label: item.name ?? item.code,
  value: item.code,
})))
</script>

<template>
  <UApp :toaster="toasterConfig">
    <div class="app-shell min-h-dvh text-default">
      <header class="app-header sticky top-0 z-40">
        <div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
            <div class="app-brand-mark grid size-9 shrink-0 place-items-center rounded-md text-white">
              <UIcon name="i-lucide-boxes" class="size-5" />
            </div>
            <span class="hidden truncate text-base font-semibold text-highlighted sm:block">
              {{ t('app.name') }}
            </span>
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
              v-if="!auth.isLogin"
              icon="i-lucide-log-in"
              to="/login"
            >
              {{ t('auth.login') }}
            </UButton>
            <UButton
              v-else
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

      <main>
        <slot />
      </main>
    </div>
  </UApp>
</template>
