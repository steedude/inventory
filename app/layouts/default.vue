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
    <div class="min-h-dvh bg-default text-default">
      <header class="sticky top-0 z-40 border-b border-default bg-default/95 backdrop-blur">
        <UContainer class="flex h-16 items-center justify-between gap-4">
          <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
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
            />
          </div>
        </UContainer>
      </header>

      <main>
        <slot />
      </main>
    </div>
  </UApp>
</template>
