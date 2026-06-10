<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const inventory = useInventoryData()
const { runSafely } = useSafeRun()

const summaryCards = computed(() => [
  {
    label: t('dashboard.summary.items'),
    value: String(inventory.items.value.length),
    icon: 'i-lucide-package',
  },
])

onMounted(() => {
  void runSafely(inventory.fetchAll)
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
        {{ t('dashboard.title') }}
      </h1>
      <p class="text-sm leading-6 text-muted">
        {{ t('dashboard.description') }}
      </p>
    </div>

    <section class="grid gap-4 md:grid-cols-3">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="rounded-md border border-default bg-default p-5"
      >
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm text-muted">{{ card.label }}</span>
          <UIcon :name="card.icon" class="size-5 text-primary" />
        </div>
        <p class="mt-3 text-2xl font-semibold text-highlighted">
          {{ card.value }}
        </p>
      </div>
    </section>
  </div>
</template>
