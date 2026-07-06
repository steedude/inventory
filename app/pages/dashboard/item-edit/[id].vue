<script setup lang="ts">
import type { InventoryItemFormState } from '~~/types/inventoryTypes'
import {
  InventorySelectValue,
} from '~~/config/inventorySelectConfig'
import {
  nullToSelect,
  selectToNull,
} from '~~/utils/inventorySelectUtils'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const { t } = useI18n()
const inventory = useInventoryData()
const appToast = useAppToast()
const { runSafely } = useSafeRun()

const loading = ref(false)
const saving = ref(false)
const itemId = computed(() => String(route.params.id))

const itemForm = reactive<InventoryItemFormState>({
  name: '',
  quantity: 0,
  min_quantity: 0,
  low_stock_enabled: false,
  image_url: '',
  location_id: InventorySelectValue.None,
  note: '',
  barcode: '',
  category_id: InventorySelectValue.None,
  group_id: InventorySelectValue.None,
})

async function loadItem() {
  loading.value = true

  await runSafely(async () => {
    const item = await inventory.fetchItem(itemId.value)

    itemForm.name = item.name
    itemForm.quantity = item.quantity
    itemForm.min_quantity = item.min_quantity
    itemForm.low_stock_enabled = item.low_stock_enabled
    itemForm.image_url = item.image_url ?? ''
    itemForm.location_id = nullToSelect(item.location_id)
    itemForm.note = item.note ?? ''
    itemForm.barcode = item.barcode ?? ''
    itemForm.category_id = nullToSelect(item.category_id)
    itemForm.group_id = nullToSelect(item.group_id)
  })

  loading.value = false
}

async function submitItem() {
  const name = itemForm.name.trim()

  if (name.length === 0) {
    return
  }

  saving.value = true

  await runSafely(async () => {
    await inventory.updateItem(itemId.value, {
      name,
      quantity: itemForm.quantity,
      min_quantity: itemForm.min_quantity,
      low_stock_enabled: itemForm.low_stock_enabled,
      image_url: inventory.emptyToNull(itemForm.image_url),
      location_id: selectToNull(itemForm.location_id),
      note: inventory.emptyToNull(itemForm.note),
      barcode: inventory.emptyToNull(itemForm.barcode),
      category_id: selectToNull(itemForm.category_id),
      group_id: selectToNull(itemForm.group_id),
    })

    appToast.setSuccess(t('data.toast.updated'))
    await navigateTo('/dashboard/item-list')
  })

  saving.value = false
}

onMounted(() => {
  void loadItem()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
          {{ t('data.pages.editItem') }}
        </h1>
        <p class="text-sm leading-6 text-muted">
          {{ t('data.pages.editItemDescription') }}
        </p>
      </div>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-lucide-arrow-left"
        class="justify-center whitespace-nowrap"
        to="/dashboard/item-list"
      >
        {{ t('data.actions.backToList') }}
      </UButton>
    </div>

    <UCard>
      <div v-if="loading" class="py-8 text-center text-sm text-muted">
        {{ t('data.loading') }}
      </div>

      <InventoryItemForm
        v-else
        v-model="itemForm"
        submit-icon="i-lucide-save"
        :submit-label="t('data.actions.saveItem')"
        :submitting="saving"
        @submit="submitItem"
      />
    </UCard>
  </div>
</template>
