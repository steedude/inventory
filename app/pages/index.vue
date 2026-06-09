<script setup lang="ts">
const counter = useCounterStore()
const auth = useAuthStore()
const { locale, locales, setLocale, t } = useI18n()

await auth.initialize()

const localeOptions = computed(() => locales.value.map((item) => ({
  label: item.name ?? item.code,
  value: item.code
})))

const signOut = async () => {
  await auth.signOut()
}
</script>

<template>
  <UContainer class="grid min-h-dvh place-items-center py-12">
    <div class="w-full max-w-xl space-y-6">
      <div class="space-y-3">
        <UBadge color="primary" variant="soft">
          {{ t('home.badge') }}
        </UBadge>
        <h1 class="text-3xl font-semibold tracking-normal text-highlighted sm:text-4xl">
          {{ t('home.title') }}
        </h1>
        <p class="text-base leading-7 text-muted">
          {{ t('home.description') }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <USelect
          :model-value="locale"
          :items="localeOptions"
          :aria-label="t('home.language')"
          class="w-40"
          @update:model-value="setLocale"
        />
        <UButton
          v-if="auth.isAuthenticated"
          icon="i-lucide-log-out"
          color="neutral"
          variant="soft"
          :loading="auth.loading"
          @click="signOut"
        >
          {{ t('auth.logout') }}
        </UButton>
        <UButton v-else icon="i-lucide-log-in" to="/login">
          {{ t('auth.login') }}
        </UButton>
      </div>

      <UAlert
        v-if="auth.isAuthenticated"
        color="success"
        variant="soft"
        icon="i-lucide-circle-check"
        :title="t('auth.signedIn')"
        :description="auth.user?.email"
      />

      <div class="flex items-center gap-3">
        <UButton
          icon="i-lucide-minus"
          color="neutral"
          variant="soft"
          :aria-label="t('counter.decrease')"
          @click="counter.decrement"
        />
        <span class="min-w-10 text-center text-lg font-medium text-highlighted">{{ counter.count }}</span>
        <UButton icon="i-lucide-plus" :aria-label="t('counter.increase')" @click="counter.increment" />
      </div>
    </div>
  </UContainer>
</template>
