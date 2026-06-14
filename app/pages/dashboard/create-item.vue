<script setup lang="ts">
import type { InventoryItemFormState } from '~~/types/inventoryTypes'
import {
  InventorySelectValue,
  selectToNull,
} from '~~/config/inventorySelectConfig'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const route = useRoute()
const inventory = useInventoryData()
const appToast = useAppToast()
const { runSafely } = useSafeRun()
const creating = ref(false)

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

function resetForm() {
  itemForm.name = ''
  itemForm.quantity = 0
  itemForm.min_quantity = 0
  itemForm.low_stock_enabled = false
  itemForm.image_url = ''
  itemForm.location_id = InventorySelectValue.None
  itemForm.note = ''
  itemForm.barcode = ''
  itemForm.category_id = InventorySelectValue.None
  itemForm.group_id = InventorySelectValue.None
}

async function submitItem() {
  const name = itemForm.name.trim()

  if (name.length === 0) {
    return
  }

  creating.value = true

  await runSafely(async () => {
    await inventory.createItem({
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

    resetForm()
    appToast.setSuccess(t('data.toast.created'))
  })

  creating.value = false
}

onMounted(() => {
  const barcodeQuery = route.query.barcode

  if (typeof barcodeQuery === 'string') {
    itemForm.barcode = barcodeQuery
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
        {{ t('data.pages.createItem') }}
      </h1>
      <p class="text-sm leading-6 text-muted">
        {{ t('data.sections.itemDescription') }}
      </p>
    </div>

    <UCard>
      <InventoryItemForm
        v-model="itemForm"
        submit-icon="i-lucide-package-plus"
        :submit-label="t('data.actions.createItem')"
        :submitting="creating"
        @submit="submitItem"
      />
    </UCard>
  </div>
</template>
