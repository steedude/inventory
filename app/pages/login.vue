<script setup lang="ts">
import { AuthMode } from '~~/config/authConfig'

definePageMeta({
  layout: 'auth',
})

const auth = useAuthStore()
const authService = useAuth()
const appToast = useAppToast()
const { t } = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow',
})

const email = ref('')
const password = ref('')
const authMode = ref<AuthMode>(AuthMode.Login)
const passwordVisible = ref(false)

const authModeOptions = computed(() => [
  {
    label: t('auth.login'),
    value: AuthMode.Login,
  },
  {
    label: t('auth.signup'),
    value: AuthMode.Signup,
  },
])
const isLoginMode = computed(() => authMode.value === AuthMode.Login)
const passwordInputType = computed(() => passwordVisible.value ? 'text' : 'password')
const passwordIcon = computed(() => passwordVisible.value ? 'i-lucide-eye-off' : 'i-lucide-eye')

async function submit() {
  const result = isLoginMode.value
    ? await authService.signIn(email.value, password.value)
    : await authService.signUp(email.value, password.value)

  if (result.error) {
    appToast.setError(result.error)
    return
  }

  if (auth.isLogin) {
    appToast.setSuccess(isLoginMode.value ? t('auth.loginSuccess') : t('auth.signupSignedIn'))
    return navigateTo('/dashboard')
  }

  appToast.setSuccess(t('auth.signupSuccess'))
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value
}

function selectAuthMode(mode: AuthMode) {
  authMode.value = mode
}

async function signInWithGoogle() {
  const { error } = await authService.signInWithGoogle()

  if (error !== null) {
    appToast.setError(error)
  }
}
</script>

<template>
  <UContainer class="grid min-h-dvh place-items-center py-12">
    <form class="app-surface w-full max-w-sm space-y-5 rounded-md p-6" @submit.prevent="submit">
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <NuxtLink to="/" class="inline-flex min-w-0 items-center gap-3">
            <span class="app-brand-mark grid size-9 shrink-0 place-items-center rounded-md text-white">
              <UIcon name="i-lucide-boxes" class="size-5" />
            </span>
            <span class="truncate font-semibold text-highlighted">{{ t('app.name') }}</span>
          </NuxtLink>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-arrow-left"
            size="sm"
            to="/"
          >
            {{ t('navigation.home') }}
          </UButton>
        </div>
        <div class="grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
          <UButton
            v-for="option in authModeOptions"
            :key="option.value"
            type="button"
            :color="authMode === option.value ? 'primary' : 'neutral'"
            :variant="authMode === option.value ? 'solid' : 'ghost'"
            class="justify-center"
            @click="selectAuthMode(option.value)"
          >
            {{ option.label }}
          </UButton>
        </div>
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
            {{ isLoginMode ? t('auth.loginTitle') : t('auth.signupTitle') }}
          </h1>
          <p class="text-sm leading-6 text-muted">
            {{ t('home.description') }}
          </p>
        </div>
      </div>

      <UFormField :label="t('auth.email')">
        <UInput
          v-model="email"
          type="email"
          autocomplete="email"
          required
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('auth.password')">
        <UInput
          v-model="password"
          :type="passwordInputType"
          autocomplete="current-password"
          required
          minlength="6"
          class="w-full"
        >
          <template #trailing>
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              size="xs"
              :icon="passwordIcon"
              :aria-label="passwordVisible ? t('auth.hidePassword') : t('auth.showPassword')"
              @click="togglePasswordVisible"
            />
          </template>
        </UInput>
      </UFormField>

      <UButton
        type="button"
        color="neutral"
        variant="soft"
        icon="i-simple-icons-google"
        block
        :loading="auth.loading"
        @click="signInWithGoogle"
      >
        {{ t('auth.googleLogin') }}
      </UButton>

      <div class="flex items-center gap-3">
        <UButton type="submit" :loading="auth.loading">
          {{ isLoginMode ? t('auth.login') : t('auth.signup') }}
        </UButton>
      </div>
    </form>
  </UContainer>
</template>
