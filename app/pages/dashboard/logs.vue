<script setup lang="ts">
import { InventoryMovementType } from '~~/config/inventoryLogConfig'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const inventory = useInventoryData()
const { runSafely } = useSafeRun()

function getMovementLabel(type: string) {
  const labelMap: Record<string, string> = {
    [InventoryMovementType.Create]: t('logs.types.create'),
    [InventoryMovementType.Update]: t('logs.types.update'),
    [InventoryMovementType.Delete]: t('logs.types.delete'),
    [InventoryMovementType.QuantityIncrease]: t('logs.types.quantityIncrease'),
    [InventoryMovementType.QuantityDecrease]: t('logs.types.quantityDecrease'),
    [InventoryMovementType.QuantitySet]: t('logs.types.quantitySet'),
  }

  return labelMap[type] ?? type
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

onMounted(() => {
  void runSafely(inventory.fetchAll)
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
        {{ t('logs.title') }}
      </h1>
      <p class="text-sm leading-6 text-muted">
        {{ t('logs.description') }}
      </p>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('logs.recent') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('logs.recentDescription') }}
            </p>
          </div>
          <UButton
            variant="ghost"
            icon="i-lucide-refresh-cw"
            class="justify-center whitespace-nowrap"
            :loading="inventory.loading.value"
            @click="inventory.fetchAll"
          >
            {{ t('data.actions.refresh') }}
          </UButton>
        </div>
      </template>

      <div v-if="inventory.movements.value.length === 0" class="py-8 text-center text-sm text-muted">
        {{ t('logs.empty') }}
      </div>

      <div v-else class="space-y-3">
        <article
          v-for="movement in inventory.movements.value"
          :key="movement.id"
          class="grid gap-3 rounded-md border border-default p-3 lg:grid-cols-[minmax(0,1fr)_160px_160px]"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <div class="font-medium text-highlighted">
                {{ movement.item_name }}
              </div>
              <UBadge color="neutral" variant="soft">
                {{ getMovementLabel(movement.type) }}
              </UBadge>
            </div>
            <p class="text-sm text-muted">
              {{ movement.note ?? t('data.form.noNote') }}
            </p>
          </div>
          <div class="text-sm">
            <div class="text-muted">
              {{ t('logs.quantityChange') }}
            </div>
            <div class="font-medium text-highlighted">
              {{ movement.quantity_before ?? '-' }}
              {{ t('common.arrow') }}
              {{ movement.quantity_after ?? '-' }}
              <span v-if="movement.quantity_delta !== null" class="text-muted">
                ({{ movement.quantity_delta > 0 ? '+' : '' }}{{ movement.quantity_delta }})
              </span>
            </div>
          </div>
          <div class="text-sm">
            <div class="text-muted">
              {{ t('logs.createdAt') }}
            </div>
            <div class="font-medium text-highlighted">
              {{ formatDate(movement.created_at) }}
            </div>
          </div>
        </article>
      </div>
    </UCard>
  </div>
</template>
