<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const auth = useAuthStore()
const authService = useAuth()
const appToast = useAppToast()
const { t } = useI18n()

async function signOut() {
  const { error } = await authService.signOut()

  if (error) {
    appToast.setError(error)
    return
  }

  appToast.setSuccess(t('auth.logoutSuccess'))
  await navigateTo('/')
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
        {{ t('profile.title') }}
      </h1>
      <p class="text-sm leading-6 text-muted">
        {{ t('profile.description') }}
      </p>
    </div>

    <div class="rounded-md border border-default bg-default p-5">
      <dl class="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">
        <dt class="text-sm font-medium text-muted">
          {{ t('profile.email') }}
        </dt>
        <dd class="text-sm text-highlighted">
          {{ auth.user?.email ?? t('profile.empty') }}
        </dd>

        <dt class="text-sm font-medium text-muted">
          {{ t('profile.userId') }}
        </dt>
        <dd class="break-all text-sm text-highlighted">
          {{ auth.user?.id ?? t('profile.empty') }}
        </dd>
      </dl>
    </div>

    <UButton
      icon="i-lucide-log-out"
      color="neutral"
      variant="soft"
      :loading="auth.loading"
      @click="signOut"
    >
      {{ t('auth.logout') }}
    </UButton>
  </div>
</template>
