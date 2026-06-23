<script setup lang="ts">
type IconActionTone = 'default' | 'danger' | 'success'
type IconActionSize = 'xs' | 'sm' | 'md'

const props = withDefaults(defineProps<{
  icon: string
  label: string
  disabled?: boolean
  loading?: boolean
  size?: IconActionSize
  to?: string
  tone?: IconActionTone
}>(), {
  disabled: false,
  loading: false,
  size: 'sm',
  tone: 'default',
})

const color = computed(() => {
  if (props.tone === 'danger') {
    return 'error'
  }

  if (props.tone === 'success') {
    return 'success'
  }

  return 'neutral'
})
</script>

<template>
  <UButton
    :aria-label="label"
    :class="`app-icon-button--${tone}`"
    :color="color"
    :disabled="disabled"
    :icon="icon"
    :loading="loading"
    :size="size"
    :to="to"
    class="app-icon-button"
    variant="ghost"
    v-bind="$attrs"
  />
</template>
