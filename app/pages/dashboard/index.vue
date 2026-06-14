<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const inventory = useInventoryData()
const { runSafely } = useSafeRun()
const appToast = useAppToast()

interface WorkerCronResult {
  ok?: boolean
  result?: {
    checkedAt?: string
    count?: number
  }
}

const isTestingWorker = ref(false)
const workerCronResult = ref<WorkerCronResult | null>(null)

const recentMovements = computed(() => inventory.movements.value.slice(0, 5))
const categoryStats = computed(() => {
  const stats = inventory.mainCategories.value.map(category => ({
    id: category.id,
    label: category.name,
    value: inventory.items.value.filter(item =>
      inventory.getMainCategoryName(item.category_id) === category.name,
    ).length,
  }))
  const maxValue = Math.max(...stats.map(item => item.value), 1)

  return stats
    .filter(item => item.value > 0)
    .map(item => ({
      ...item,
      percent: Math.round((item.value / maxValue) * 100),
    }))
})

const summaryCards = computed(() => [
  {
    label: t('dashboard.summary.items'),
    value: String(inventory.items.value.length),
    icon: 'i-lucide-package',
  },
  {
    label: t('dashboard.summary.lowStock'),
    value: String(inventory.lowStockItems.value.length),
    icon: 'i-lucide-triangle-alert',
  },
  {
    label: t('dashboard.summary.movements'),
    value: String(inventory.movements.value.length),
    icon: 'i-lucide-history',
  },
])

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function testWorkerCron() {
  isTestingWorker.value = true

  await runSafely(async () => {
    workerCronResult.value = await $fetch<WorkerCronResult>('/api/inventory/test-worker', {
      method: 'POST',
    })
    appToast.setSuccess(t('dashboard.workerTest.success'))
    await inventory.fetchAll()
  })

  isTestingWorker.value = false
}

onMounted(() => {
  void runSafely(inventory.fetchAll)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
          {{ t('dashboard.title') }}
        </h1>
        <p class="text-sm leading-6 text-muted">
          {{ t('dashboard.description') }}
        </p>
        <p v-if="workerCronResult?.result" class="text-xs text-muted">
          {{ t('dashboard.workerTest.result') }}
          {{ t('dashboard.workerTest.count', { count: workerCronResult.result.count ?? 0 }) }}
          {{ t('common.separator') }}
          {{ t('dashboard.workerTest.checkedAt', { time: workerCronResult.result.checkedAt ? formatDate(workerCronResult.result.checkedAt) : '-' }) }}
        </p>
      </div>
      <UButton
        icon="i-lucide-play"
        variant="soft"
        :loading="isTestingWorker"
        class="self-start"
        @click="testWorkerCron"
      >
        {{ t('dashboard.workerTest.run') }}
      </UButton>
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

    <section class="grid gap-4 xl:grid-cols-2">
      <UCard>
        <template #header>
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('dashboard.lowStock.title') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('dashboard.lowStock.description') }}
            </p>
          </div>
        </template>

        <div v-if="inventory.lowStockItems.value.length === 0" class="py-6 text-center text-sm text-muted">
          {{ t('dashboard.lowStock.empty') }}
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="item in inventory.lowStockItems.value.slice(0, 6)"
            :key="item.id"
            class="flex items-center justify-between gap-3 rounded-md border border-default px-3 py-2"
          >
            <div class="min-w-0">
              <div class="truncate font-medium text-highlighted">
                {{ item.name }}
              </div>
              <div class="text-xs text-muted">
                {{ inventory.getCategoryName(item.category_id) }}
              </div>
            </div>
            <UBadge color="warning" variant="soft">
              {{ item.quantity }} / {{ item.min_quantity }}
            </UBadge>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('dashboard.categoryChart.title') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('dashboard.categoryChart.description') }}
            </p>
          </div>
        </template>

        <div v-if="categoryStats.length === 0" class="py-6 text-center text-sm text-muted">
          {{ t('dashboard.categoryChart.empty') }}
        </div>

        <div v-else class="space-y-3">
          <div v-for="category in categoryStats" :key="category.id" class="space-y-1">
            <div class="flex items-center justify-between gap-3 text-sm">
              <span class="font-medium text-highlighted">{{ category.label }}</span>
              <span class="text-muted">{{ category.value }}</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary" :style="{ width: `${category.percent}%` }" />
            </div>
          </div>
        </div>
      </UCard>
    </section>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('dashboard.recentMovements.title') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('dashboard.recentMovements.description') }}
            </p>
          </div>
          <UButton variant="ghost" icon="i-lucide-history" to="/dashboard/logs">
            {{ t('logs.title') }}
          </UButton>
        </div>
      </template>

      <div v-if="recentMovements.length === 0" class="py-6 text-center text-sm text-muted">
        {{ t('logs.empty') }}
      </div>

      <div v-else class="grid gap-2">
        <div
          v-for="movement in recentMovements"
          :key="movement.id"
          class="flex flex-col gap-1 rounded-md border border-default px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="font-medium text-highlighted">
            {{ movement.item_name }}
          </div>
          <div class="text-sm text-muted">
            {{ movement.quantity_before ?? '-' }} {{ t('common.arrow') }} {{ movement.quantity_after ?? '-' }}
            {{ t('common.separator') }} {{ formatDate(movement.created_at) }}
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
