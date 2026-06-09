<script setup lang="ts">
const auth = useAuthStore()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const mode = ref<'login' | 'signup'>('login')

await auth.initialize()

async function submit() {
  const result = mode.value === 'login'
    ? await auth.signIn(email.value, password.value)
    : await auth.signUp(email.value, password.value)

  if (!result.error && auth.isAuthenticated) {
    await navigateTo('/')
  }
}

function toggleMode() {
  auth.setSuccess()
  mode.value = mode.value === 'login' ? 'signup' : 'login'
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
          {{ mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle') }}
        </h1>
      </div>

      <UAlert
        v-if="auth.errorMessage"
        color="error"
        variant="soft"
        icon="i-lucide-circle-alert"
        :title="auth.errorMessage"
      />

      <UAlert
        v-if="auth.successMessage"
        color="success"
        variant="soft"
        icon="i-lucide-circle-check"
        :title="t(auth.successMessage)"
      />

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
          {{ mode === 'login' ? t('auth.login') : t('auth.signup') }}
        </UButton>
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          @click="toggleMode"
        >
          {{ mode === 'login' ? t('auth.useSignup') : t('auth.useLogin') }}
        </UButton>
      </div>
    </form>
  </UContainer>
</template>
