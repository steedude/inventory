<script setup lang="ts">
import {
  barcodeImageAccept,
} from '~~/config/barcodeConfig'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const inventory = useInventoryData()
const appToast = useAppToast()
const barcodeScanner = useBarcodeScanner()
const barcodeImageDecoder = useBarcodeImageDecoder()
const { runSafely } = useSafeRun()

const barcode = ref('')
const scannerVideo = ref<HTMLVideoElement>()
const cameraOpen = ref(false)
const imageLoading = ref(false)
const searching = ref(false)

async function routeByBarcode(value: string) {
  const currentBarcode = value.trim()

  if (currentBarcode.length === 0) {
    return
  }

  searching.value = true

  try {
    await runSafely(async () => {
      await inventory.fetchAll()
      const item = inventory.findItemByBarcode(currentBarcode)

      if (item !== undefined) {
        await navigateTo(`/dashboard/item-edit/${item.id}`)
        return
      }

      await navigateTo({
        path: '/dashboard/create-item',
        query: {
          barcode: currentBarcode,
        },
      })
    })
  }
  finally {
    searching.value = false
  }
}

async function searchBarcode() {
  await routeByBarcode(barcode.value)
}

async function decodeBarcodeImage(event: Event) {
  await barcodeImageDecoder.decodeBarcodeImage(event, imageLoading, async (result) => {
    barcode.value = result
    await routeByBarcode(result)
  })
}

async function startCameraScan() {
  cameraOpen.value = true
  await nextTick()

  await runSafely(async () => {
    await barcodeScanner.startCameraScan(scannerVideo.value, async (result) => {
      barcode.value = result
      cameraOpen.value = false
      appToast.setSuccess(t('quickUse.barcodeDetected'))
      await routeByBarcode(result)
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

onMounted(() => {
  void runSafely(inventory.fetchAll)
})

onBeforeUnmount(() => {
  stopCameraScan()
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
        {{ t('quickUse.title') }}
      </h1>
      <p class="text-sm leading-6 text-muted">
        {{ t('quickUse.description') }}
      </p>
    </div>

    <UCard>
      <div class="space-y-4">
        <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
          <UFormField :label="t('quickUse.barcode')">
            <UInput
              v-model="barcode"
              class="w-full"
              icon="i-lucide-scan-barcode"
              :placeholder="t('quickUse.barcodePlaceholder')"
              @keyup.enter="searchBarcode"
            />
          </UFormField>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:flex xl:items-end">
            <UButton
              icon="i-lucide-search"
              class="justify-center whitespace-nowrap"
              :loading="searching"
              @click="searchBarcode"
            >
              {{ t('quickUse.search') }}
            </UButton>
            <UButton
              as="label"
              color="neutral"
              variant="soft"
              icon="i-lucide-image-up"
              class="justify-center whitespace-nowrap"
              :loading="imageLoading"
            >
              {{ t('quickUse.uploadImage') }}
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
              class="justify-center whitespace-nowrap"
              @click="startCameraScan"
            >
              {{ t('quickUse.scanLive') }}
            </UButton>
            <UButton
              v-else
              color="error"
              variant="soft"
              icon="i-lucide-camera-off"
              class="justify-center whitespace-nowrap"
              @click="stopCameraScan"
            >
              {{ t('quickUse.stopScan') }}
            </UButton>
          </div>
        </div>

        <div v-if="cameraOpen" class="overflow-hidden rounded-md border border-default bg-black">
          <video
            ref="scannerVideo"
            class="h-64 w-full object-cover"
            autoplay
            muted
            playsinline
          />
        </div>

        <p class="text-sm leading-6 text-muted">
          {{ t('quickUse.routeHint') }}
        </p>
      </div>
    </UCard>
  </div>
</template>
