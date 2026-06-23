<script setup lang="ts">
import type { InventoryChangedField } from '~~/types/inventoryTypes'
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { categoryChartColors, categoryChartOptions } from '~~/config/dashboardConfig'
import { InventoryLogType } from '~~/config/inventoryLogConfig'
import { formatDateTime, getRecentDaysStart } from '~~/utils/dateUtils'

definePageMeta({
  layout: 'dashboard',
})

ChartJS.register(ArcElement, Tooltip, Legend)

const { t } = useI18n()
const inventory = useInventoryData()
const auth = useAuthStore()
const { runSafely } = useSafeRun()
const appToast = useAppToast()

const isSendingLowStockNotification = ref(false)
const recentLogCutoff = computed(() => getRecentDaysStart(7))

const recentLogs = computed(() => inventory.logs.value
  .filter(log => new Date(log.created_at) >= recentLogCutoff.value)
  .slice(0, 5))
const categoryStats = computed(() => {
  const stats = inventory.mainCategories.value.map(category => ({
    id: category.id,
    label: category.name,
    value: inventory.items.value.filter(item =>
      inventory.getMainCategoryName(item.category_id) === category.name,
    ).length,
  }))

  return stats.filter(item => item.value > 0)
})
const categoryChartData = computed(() => ({
  labels: categoryStats.value.map(category => category.label),
  datasets: [
    {
      data: categoryStats.value.map(category => category.value),
      backgroundColor: categoryStats.value.map((_, index) => categoryChartColors[index % categoryChartColors.length]),
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 6,
    },
  ],
}))
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
    value: String(recentLogs.value.length),
    icon: 'i-lucide-history',
  },
])

function getFieldLabel(field: InventoryChangedField['field']) {
  return t(`logs.fields.${field}`)
}

function getLogLabel(type: string) {
  const labelMap: Record<string, string> = {
    [InventoryLogType.Create]: t('logs.types.create'),
    [InventoryLogType.Update]: t('logs.types.update'),
    [InventoryLogType.Delete]: t('logs.types.delete'),
  }

  return labelMap[type] ?? type
}

function shouldShowChangedFields(type: string) {
  return type === InventoryLogType.Update
}

function formatChangedFields(fields: InventoryChangedField[]) {
  if (fields.length === 0) {
    return t('logs.noChangedFields')
  }

  return fields.map(field => getFieldLabel(field.field)).join(t('common.separator'))
}

async function sendLowStockNotification() {
  isSendingLowStockNotification.value = true

  await runSafely(async () => {
    const accessToken = auth.session?.access_token

    if (accessToken === undefined) {
      throw new Error('Missing user session')
    }

    await $fetch('/api/inventory/send-low-stock-notification', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    appToast.setSuccess(t('dashboard.lowStockNotification.success'))
  })

  isSendingLowStockNotification.value = false
}

onMounted(() => {
  void runSafely(async () => {
    await Promise.all([
      inventory.ensureCategories(),
      inventory.ensureItems(),
      inventory.ensureLogs(),
    ])
  })
})
</script>

<template>
  <div class="space-y-6">
    <section class="app-page-intro overflow-hidden rounded-md p-5 lg:p-6">
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
        <div class="space-y-3">
          <div class="space-y-2">
            <h1 class="text-3xl font-semibold tracking-normal text-highlighted lg:text-4xl">
              {{ t('dashboard.title') }}
            </h1>
            <p class="max-w-2xl text-sm leading-6 text-muted lg:text-base">
              {{ t('dashboard.description') }}
            </p>
          </div>
        </div>
        <div class="space-y-3 rounded-md border border-default bg-elevated p-4">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium text-toned">{{ t('dashboard.lowStock.title') }}</span>
            <UBadge color="warning" variant="soft">
              {{ inventory.lowStockItems.value.length }}
            </UBadge>
          </div>
          <UButton
            icon="i-lucide-mail"
            block
            :loading="isSendingLowStockNotification"
            @click="sendLowStockNotification"
          >
            {{ t('dashboard.lowStockNotification.run') }}
          </UButton>
        </div>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-3">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="app-metric-card rounded-md p-5"
      >
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm text-muted">{{ card.label }}</span>
          <span class="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
            <UIcon :name="card.icon" class="size-5" />
          </span>
        </div>
        <p class="mt-3 text-2xl font-semibold text-highlighted">
          {{ card.value }}
        </p>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-2">
      <UCard class="app-surface">
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
            class="app-list-row flex items-center justify-between gap-3 rounded-md px-3 py-2"
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

      <UCard class="app-surface">
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

        <div v-else class="grid items-center gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div class="relative mx-auto aspect-square w-full max-w-56">
            <Doughnut :data="categoryChartData" :options="categoryChartOptions" />
            <div class="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div class="text-xs text-muted">
                  {{ t('dashboard.summary.items') }}
                </div>
                <div class="text-2xl font-semibold text-highlighted">
                  {{ inventory.items.value.length }}
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="(category, index) in categoryStats"
              :key="category.id"
              class="app-list-row flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm"
            >
              <div class="flex min-w-0 items-center gap-2">
                <span
                  class="size-3 shrink-0 rounded-full"
                  :style="{ backgroundColor: categoryChartColors[index % categoryChartColors.length] }"
                />
                <span class="truncate font-medium text-highlighted">{{ category.label }}</span>
              </div>
              <span class="shrink-0 text-muted">{{ category.value }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </section>

    <UCard class="app-surface">
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

      <div v-if="recentLogs.length === 0" class="py-6 text-center text-sm text-muted">
        {{ t('logs.empty') }}
      </div>

      <div v-else class="grid gap-2">
        <div
          v-for="log in recentLogs"
          :key="log.id"
          class="app-list-row flex flex-col gap-1 rounded-md px-3 py-2 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="flex min-w-0 flex-wrap items-center gap-2">
            <div class="font-medium text-highlighted">
              {{ log.item_name }}
            </div>
            <UBadge color="neutral" variant="soft">
              {{ getLogLabel(log.type) }}
            </UBadge>
          </div>
          <div class="text-sm text-muted">
            <span v-if="shouldShowChangedFields(log.type)">
              {{ formatChangedFields(log.changed_fields) }}
              {{ t('common.separator') }}
            </span>
            {{ formatDateTime(log.created_at) }}
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
