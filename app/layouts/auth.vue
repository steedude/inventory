<script setup lang="ts">
import { toasterConfig } from '~~/config/toastConfig'
</script>

<template>
  <UApp :toaster="toasterConfig">
    <main class="app-shell min-h-dvh text-default">
      <slot />
    </main>
  </UApp>
</template>
