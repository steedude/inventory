<script setup lang="ts">
const auth = useAuthStore()
const appToast = useAppToast()
const authLang = useAuthLang()
const { t } = useI18n()

const email = ref('')
const password = ref('')

await auth.initialize()

async function submit() {
  const result = auth.isLogin
    ? await auth.signIn(email.value, password.value)
    : await auth.signUp(email.value, password.value)

  if (result.error) {
    appToast.setError(result.error)
    return
  }

  if (auth.isAuthenticated) {
    appToast.setSuccess(auth.isLogin ? authLang.loginSuccess() : authLang.signupSignedIn())
    return navigateTo('/')
  }

  appToast.setSuccess(authLang.signupSuccess())
}
</script>

<template>
  <UContainer class="grid min-h-dvh place-items-center py-12">
    <form class="w-full max-w-sm space-y-5" @submit.prevent="submit">
      <div class="space-y-2">
        <UBadge color="primary" variant="soft">
          {{ t('auth.badge') }}
        </UBadge>
        <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
          {{ auth.isLogin ? t('auth.loginTitle') : t('auth.signupTitle') }}
        </h1>
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
          type="password"
          autocomplete="current-password"
          required
          minlength="6"
          class="w-full"
        />
      </UFormField>

      <div class="flex items-center gap-3">
        <UButton type="submit" :loading="auth.loading">
          {{ auth.isLogin ? t('auth.login') : t('auth.signup') }}
        </UButton>
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          @click="auth.toggleMode"
        >
          {{ auth.isLogin ? t('auth.useSignup') : t('auth.useLogin') }}
        </UButton>
      </div>
    </form>
  </UContainer>
</template>
