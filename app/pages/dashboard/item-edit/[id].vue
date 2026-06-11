<script setup lang="ts">
import type { InventoryItemFormState } from '~~/types/inventoryTypes'
import {
  InventorySelectValue,
  nullToSelect,
  selectToNull,
} from '~~/config/inventorySelectConfig'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const { t } = useI18n()
const inventory = useInventoryData()
const appToast = useAppToast()
const itemImageUpload = useItemImageUpload()
const { runSafely } = useSafeRun()
const {
  groupOptions,
  locationOptions,
  subCategoryOptions,
} = useInventorySelectOptions(inventory)

const loading = ref(false)
const saving = ref(false)
const imageUploading = ref(false)
const itemId = computed(() => String(route.params.id))

const itemForm = reactive<InventoryItemFormState>({
  name: '',
  quantity: 0,
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
    await inventory.fetchAll()
    const item = await inventory.fetchItem(itemId.value)

    itemForm.name = item.name
    itemForm.quantity = item.quantity
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
      image_url: inventory.emptyToNull(itemForm.image_url),
      location_id: selectToNull(itemForm.location_id),
      note: inventory.emptyToNull(itemForm.note),
      barcode: inventory.emptyToNull(itemForm.barcode),
      category_id: selectToNull(itemForm.category_id),
      group_id: selectToNull(itemForm.group_id),
    })

    appToast.setSuccess(t('data.toast.updated'))
  })

  saving.value = false
}

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file === undefined) {
    return
  }

  imageUploading.value = true

  try {
    await runSafely(async () => {
      itemForm.image_url = await itemImageUpload.uploadItemImage(file)
      appToast.setSuccess(t('data.toast.imageUploaded'))
    })
  }
  finally {
    imageUploading.value = false
    input.value = ''
  }
}

function removeImage() {
  itemForm.image_url = ''
}

onMounted(() => {
  void loadItem()
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
        {{ t('data.pages.editItem') }}
      </h1>
      <p class="text-sm leading-6 text-muted">
        {{ t('data.pages.editItemDescription') }}
      </p>
    </div>

    <UCard>
      <div v-if="loading" class="py-8 text-center text-sm text-muted">
        {{ t('data.loading') }}
      </div>

      <form v-else class="grid gap-4 lg:grid-cols-4" @submit.prevent="submitItem">
        <UFormField :label="t('data.form.itemName')" class="lg:col-span-2">
          <UInput
            v-model="itemForm.name"
            class="w-full"
            :placeholder="t('data.form.itemNamePlaceholder')"
          />
        </UFormField>
        <UFormField :label="t('data.form.quantity')">
          <UInputNumber v-model="itemForm.quantity" class="w-full" :min="0" />
        </UFormField>
        <UFormField :label="t('data.form.barcode')">
          <UInput
            v-model="itemForm.barcode"
            class="w-full"
            :placeholder="t('data.form.barcodePlaceholder')"
          />
        </UFormField>
        <UFormField :label="t('data.form.subCategory')">
          <USelect v-model="itemForm.category_id" class="w-full" :items="subCategoryOptions" />
        </UFormField>
        <UFormField :label="t('data.form.group')">
          <USelect v-model="itemForm.group_id" class="w-full" :items="groupOptions" />
        </UFormField>
        <UFormField :label="t('data.form.location')">
          <USelect v-model="itemForm.location_id" class="w-full" :items="locationOptions" />
        </UFormField>
        <UFormField :label="t('data.form.image')" class="lg:col-span-2">
          <div class="space-y-3">
            <div
              v-if="itemForm.image_url.length > 0"
              class="overflow-hidden rounded-md border border-default"
            >
              <img
                :src="itemForm.image_url"
                :alt="itemForm.name || t('data.form.image')"
                class="h-44 w-full object-cover"
              >
            </div>
            <div class="flex flex-col gap-2 sm:flex-row">
              <UButton
                as="label"
                color="neutral"
                variant="soft"
                icon="i-lucide-image-up"
                :loading="imageUploading"
              >
                {{ t('data.actions.uploadImage') }}
                <input
                  class="sr-only"
                  type="file"
                  :accept="itemImageUpload.imageUploadAccept"
                  @change="uploadImage"
                >
              </UButton>
              <UButton
                v-if="itemForm.image_url.length > 0"
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                @click="removeImage"
              >
                {{ t('data.actions.removeImage') }}
              </UButton>
            </div>
          </div>
        </UFormField>
        <UFormField :label="t('data.form.note')" class="lg:col-span-3">
          <UTextarea
            v-model="itemForm.note"
            class="w-full"
            :placeholder="t('data.form.notePlaceholder')"
          />
        </UFormField>
        <div class="flex items-end">
          <UButton
            type="submit"
            icon="i-lucide-save"
            :loading="saving"
          >
            {{ t('data.actions.saveItem') }}
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
