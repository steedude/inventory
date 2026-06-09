<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
</script>

<template>
  <div class="space-y-2">
    <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
      {{ t('data.title') }}
    </h1>
    <p class="text-sm leading-6 text-muted">
      {{ t('data.description') }}
    </p>
  </div>
</template>
