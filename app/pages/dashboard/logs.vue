<script setup lang="ts">
import type { InventoryChangedField } from '~~/types/inventoryTypes'
import { InventoryLogType } from '~~/config/inventoryLogConfig'
import { formatDateTime } from '~~/utils/dateUtils'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const inventory = useInventoryData()
const { runSafely } = useSafeRun()
const page = ref(1)
const pageSize = 10
const recentLogCutoff = computed(() => {
  const date = new Date()

  date.setDate(date.getDate() - 7)
  return date
})
const recentLogs = computed(() => inventory.logs.value.filter(log => new Date(log.created_at) >= recentLogCutoff.value))
const paginatedLogs = computed(() => {
  const start = (page.value - 1) * pageSize

  return recentLogs.value.slice(start, start + pageSize)
})

function getLogLabel(type: string) {
  const labelMap: Record<string, string> = {
    [InventoryLogType.Create]: t('logs.types.create'),
    [InventoryLogType.Update]: t('logs.types.update'),
    [InventoryLogType.Delete]: t('logs.types.delete'),
  }

  return labelMap[type] ?? type
}

function getFieldLabel(field: InventoryChangedField['field']) {
  return t(`logs.fields.${field}`)
}

function formatChangedValue(value: InventoryChangedField['before'], field: InventoryChangedField['field']) {
  if (field === 'image_url') {
    return value === null ? t('logs.emptyValue') : t('logs.imageValue')
  }

  if (typeof value === 'boolean') {
    return value ? t('common.yes') : t('common.no')
  }

  if (value === null || value === '') {
    return t('logs.emptyValue')
  }

  if (field === 'category_id') {
    return inventory.getCategoryName(String(value))
  }

  if (field === 'group_id') {
    return inventory.getGroupName(String(value))
  }

  if (field === 'location_id') {
    return inventory.getLocationName(String(value))
  }

  return String(value)
}

function formatChangedField(changedField: InventoryChangedField) {
  if (changedField.field === 'image_url') {
    return `${getFieldLabel(changedField.field)}: ${t('logs.changed')}`
  }

  return [
    `${getFieldLabel(changedField.field)}:`,
    formatChangedValue(changedField.before, changedField.field),
    t('common.arrow'),
    formatChangedValue(changedField.after, changedField.field),
  ].join(' ')
}

function shouldShowChangedFields(type: string) {
  return type === InventoryLogType.Update
}

watch(recentLogs, () => {
  page.value = 1
})

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

    <section class="space-y-3">
      <div class="flex justify-end">
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

      <div v-if="recentLogs.length === 0" class="py-8 text-center text-sm text-muted">
        {{ t('logs.empty') }}
      </div>

      <div v-else class="space-y-3">
        <article
          v-for="log in paginatedLogs"
          :key="log.id"
          class="grid gap-3 rounded-md border border-default p-3 lg:grid-cols-[minmax(0,1fr)_180px]"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <div class="font-medium text-highlighted">
                {{ log.item_name }}
              </div>
              <UBadge color="neutral" variant="soft">
                {{ getLogLabel(log.type) }}
              </UBadge>
            </div>
            <div v-if="shouldShowChangedFields(log.type)" class="space-y-1 text-sm">
              <div class="text-muted">
                {{ t('logs.changedFields') }}
              </div>
              <div v-if="log.changed_fields.length === 0" class="text-muted">
                {{ t('logs.noChangedFields') }}
              </div>
              <div v-else class="flex flex-wrap gap-2">
                <UBadge
                  v-for="changedField in log.changed_fields"
                  :key="`${log.id}-${changedField.field}`"
                  color="neutral"
                  variant="soft"
                >
                  {{ formatChangedField(changedField) }}
                </UBadge>
              </div>
            </div>
          </div>
          <div class="text-sm">
            <div class="text-muted">
              {{ t('logs.updatedAt') }}
            </div>
            <div class="font-medium text-highlighted">
              {{ formatDateTime(log.created_at) }}
            </div>
          </div>
        </article>

        <div v-if="recentLogs.length > pageSize" class="flex justify-center pt-2">
          <UPagination
            v-model:page="page"
            :total="recentLogs.length"
            :items-per-page="pageSize"
          />
        </div>
      </div>
    </section>
  </div>
</template>
