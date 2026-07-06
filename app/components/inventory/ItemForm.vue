<script setup lang="ts">
import type { InventoryItemFormState } from '~~/types/inventoryTypes'
import { barcodeImageAccept } from '~~/config/barcodeConfig'
import {
  InventorySelectValue,
} from '~~/config/inventorySelectConfig'
import {
  createCategoryOptions,
  createSubCategoryOptions,
} from '~~/utils/inventorySelectUtils'

defineProps<{
  submitIcon: string
  submitLabel: string
  submitting: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const itemForm = defineModel<InventoryItemFormState>({
  required: true,
})

const { t } = useI18n()
const inventory = useInventoryData()
const appToast = useAppToast()
const barcodeScanner = useBarcodeScanner()
const barcodeImageDecoder = useBarcodeImageDecoder()
const itemImageUpload = useItemImageUpload()
const { runSafely } = useSafeRun()
const { groupOptions, locationOptions } = useInventorySelectOptions(inventory)

const barcodeImageLoading = ref(false)
const imageUploading = ref(false)
const scannerVideo = ref<HTMLVideoElement>()
const cameraOpen = ref(false)
const selectedMainCategoryId = ref<string>(InventorySelectValue.None)

const mainCategoryOptions = computed(() => [
  {
    label: t('data.form.noMainCategory'),
    value: InventorySelectValue.None,
  },
  ...createCategoryOptions(inventory.mainCategories.value),
])
const subCategoryOptions = computed(() =>
  createSubCategoryOptions(
    t('data.form.noCategory'),
    inventory.subCategories.value.filter(
      category => category.parent_id === selectedMainCategoryId.value,
    ),
  ),
)

function syncMainCategoryFromSubCategory() {
  const category = inventory.categories.value.find(
    record => record.id === itemForm.value.category_id,
  )

  selectedMainCategoryId.value
    = category?.parent_id ?? InventorySelectValue.None
}

async function decodeBarcodeImage(event: Event) {
  await barcodeImageDecoder.decodeBarcodeImage(
    event,
    barcodeImageLoading,
    (result) => {
      itemForm.value.barcode = result
    },
  )
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
      itemForm.value.image_url = await itemImageUpload.uploadItemImage(file)
      appToast.setSuccess(t('data.toast.imageUploaded'))
    })
  }
  finally {
    imageUploading.value = false
    input.value = ''
  }
}

function removeImage() {
  itemForm.value.image_url = ''
}

async function startCameraScan() {
  cameraOpen.value = true
  await nextTick()

  await runSafely(async () => {
    await barcodeScanner.startCameraScan(scannerVideo.value, (result) => {
      itemForm.value.barcode = result
      cameraOpen.value = false
      appToast.setSuccess(t('quickUse.barcodeDetected'))
    })
  })

  if (!barcodeScanner.scanning.value) {
    cameraOpen.value = false
  }
}

function stopCameraScan() {
  barcodeScanner.stopCameraScan()
  cameraOpen.value = false
}

function submitForm() {
  emit('submit')
}

onMounted(async () => {
  await runSafely(async () => {
    await inventory.ensureItemMetaData()
  })
  syncMainCategoryFromSubCategory()
})

onBeforeUnmount(() => {
  stopCameraScan()
})

watch(selectedMainCategoryId, () => {
  const category = inventory.categories.value.find(
    record => record.id === itemForm.value.category_id,
  )

  if (category?.parent_id !== selectedMainCategoryId.value) {
    itemForm.value.category_id = InventorySelectValue.None
  }
})

watch(() => itemForm.value.category_id, syncMainCategoryFromSubCategory)
</script>

<template>
  <form class="space-y-5" @submit.prevent="submitForm">
    <div class="grid gap-4 lg:grid-cols-12">
      <UFormField :label="t('data.form.itemName')" class="lg:col-span-6">
        <UInput
          v-model="itemForm.name"
          class="w-full"
          :placeholder="t('data.form.itemNamePlaceholder')"
        />
      </UFormField>
      <UFormField :label="t('data.form.quantity')" class="lg:col-span-3">
        <UInputNumber v-model="itemForm.quantity" class="w-full" :min="0" />
      </UFormField>
      <UFormField :label="t('data.form.lowStock')" class="lg:col-span-3">
        <div
          class="grid gap-2 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center"
        >
          <USwitch
            v-model="itemForm.low_stock_enabled"
            :label="t('data.form.lowStockEnabled')"
          />
          <UInputNumber
            v-model="itemForm.min_quantity"
            class="w-full"
            :min="0"
            :disabled="!itemForm.low_stock_enabled"
          />
        </div>
      </UFormField>
    </div>

    <div class="grid gap-4 lg:grid-cols-4">
      <UFormField :label="t('data.form.mainCategory')">
        <USelect
          v-model="selectedMainCategoryId"
          class="w-full"
          :items="mainCategoryOptions"
        />
      </UFormField>
      <UFormField :label="t('data.form.subCategory')">
        <USelect
          v-model="itemForm.category_id"
          class="w-full"
          :items="subCategoryOptions"
          :disabled="selectedMainCategoryId === InventorySelectValue.None"
        />
      </UFormField>
      <UFormField :label="t('data.form.group')">
        <USelect
          v-model="itemForm.group_id"
          class="w-full"
          :items="groupOptions"
        />
      </UFormField>
      <UFormField :label="t('data.form.location')">
        <USelect
          v-model="itemForm.location_id"
          class="w-full"
          :items="locationOptions"
        />
      </UFormField>
    </div>

    <div class="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div class="grid gap-5">
        <UFormField :label="t('data.form.barcode')">
          <div class="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
            <UInput
              v-model="itemForm.barcode"
              class="min-w-0"
              icon="i-lucide-scan-barcode"
              :placeholder="t('data.form.barcodePlaceholder')"
            />
            <UButton
              as="label"
              color="neutral"
              variant="soft"
              icon="i-lucide-image-up"
              class="app-outline-action justify-center whitespace-nowrap"
              :loading="barcodeImageLoading"
            >
              {{ t("quickUse.uploadImage") }}
              <input
                class="sr-only"
                type="file"
                :accept="barcodeImageAccept"
                @change="decodeBarcodeImage"
              >
            </UButton>
            <UButton
              v-if="!cameraOpen"
              color="neutral"
              variant="soft"
              icon="i-lucide-camera"
              class="app-outline-action justify-center whitespace-nowrap"
              @click="startCameraScan"
            >
              {{ t("quickUse.scanLive") }}
            </UButton>
            <UButton
              v-else
              color="error"
              variant="soft"
              icon="i-lucide-camera-off"
              class="justify-center whitespace-nowrap"
              @click="stopCameraScan"
            >
              {{ t("quickUse.stopScan") }}
            </UButton>
          </div>
          <div
            v-if="cameraOpen"
            class="overflow-hidden rounded-md border border-default bg-black"
          >
            <video
              ref="scannerVideo"
              class="h-64 w-full object-cover"
              autoplay
              muted
              playsinline
            />
          </div>
        </UFormField>

        <UFormField :label="t('data.form.note')">
          <UTextarea
            v-model="itemForm.note"
            class="w-full"
            :placeholder="t('data.form.notePlaceholder')"
          />
        </UFormField>
      </div>

      <UFormField :label="t('data.form.image')">
        <div class="grid gap-3">
          <div
            class="grid aspect-square w-full place-items-center overflow-hidden rounded-md border border-default bg-elevated text-muted"
          >
            <img
              v-if="itemForm.image_url.length > 0"
              :src="itemForm.image_url"
              :alt="itemForm.name || t('data.form.image')"
              class="h-full w-full object-contain"
            >
            <UIcon v-else name="i-lucide-image" class="size-8" />
          </div>
          <div class="flex flex-col gap-2">
            <UButton
              as="label"
              color="neutral"
              variant="soft"
              icon="i-lucide-image-up"
              class="app-outline-action justify-center whitespace-nowrap"
              :loading="imageUploading"
            >
              {{ t("data.actions.uploadImage") }}
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
              class="justify-center whitespace-nowrap"
              @click="removeImage"
            >
              {{ t("data.actions.removeImage") }}
            </UButton>
          </div>
        </div>
      </UFormField>
    </div>

    <div class="flex justify-end border-t border-default pt-5">
      <UButton
        type="submit"
        :icon="submitIcon"
        class="justify-center whitespace-nowrap"
        :loading="submitting"
      >
        {{ submitLabel }}
      </UButton>
    </div>
  </form>
</template>
