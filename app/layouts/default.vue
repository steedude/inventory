<script setup lang="ts">
const toaster = {
  position: 'top-right' as const,
  expand: true,
  progress: true,
  duration: 4000,
  max: 5,
}
</script>

<template>
  <UApp :toaster="toaster">
    <main class="min-h-dvh bg-default text-default">
      <slot />
    </main>
  </UApp>
</template>
