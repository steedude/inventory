<script setup lang="ts">
import { toasterConfig } from '~~/config/toastConfig'
</script>

<template>
  <UApp :toaster="toasterConfig">
    <main class="min-h-dvh bg-default text-default">
      <slot />
    </main>
  </UApp>
</template>
