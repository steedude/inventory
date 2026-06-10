<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const auth = useAuthStore()
const authService = useAuth()
const appToast = useAppToast()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const isLoginMode = ref(true)
const passwordVisible = ref(false)

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

function toggleMode() {
  isLoginMode.value = !isLoginMode.value
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value
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
    <form class="w-full max-w-sm space-y-5" @submit.prevent="submit">
      <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
        {{ isLoginMode ? t('auth.loginTitle') : t('auth.signupTitle') }}
      </h1>

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
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          @click="toggleMode"
        >
          {{ isLoginMode ? t('auth.useSignup') : t('auth.useLogin') }}
        </UButton>
      </div>
    </form>
  </UContainer>
</template>
