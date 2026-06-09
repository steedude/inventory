<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const inventory = useInventoryData()
const appToast = useAppToast()
const barcodeScanner = useBarcodeScanner()

const barcode = ref('')
const imageLoading = ref(false)
const searching = ref(false)

async function safelyRun(action: () => Promise<void>) {
  try {
    await action()
  }
  catch (error) {
    appToast.setError(error)
  }
}

async function routeByBarcode(value: string) {
  const currentBarcode = value.trim()

  if (currentBarcode.length === 0) {
    return
  }

  searching.value = true

  await safelyRun(async () => {
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

  searching.value = false
}

async function searchBarcode() {
  await routeByBarcode(barcode.value)
}

async function decodeBarcodeImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file === undefined) {
    return
  }

  imageLoading.value = true

  await safelyRun(async () => {
    const result = await barcodeScanner.decodeImage(file)

    if (result === null) {
      appToast.setError(t('quickUse.noBarcodeFound'))
      return
    }

    barcode.value = result
    appToast.setSuccess('quickUse.barcodeDetected')
    await routeByBarcode(result)
  })

  imageLoading.value = false
  input.value = ''
}

onMounted(() => {
  void safelyRun(inventory.fetchAll)
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
        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <UFormField :label="t('quickUse.barcode')">
            <UInput
              v-model="barcode"
              class="w-full"
              icon="i-lucide-scan-barcode"
              :placeholder="t('quickUse.barcodePlaceholder')"
              @keyup.enter="searchBarcode"
            />
          </UFormField>
          <div class="flex items-end gap-2">
            <UButton icon="i-lucide-search" :loading="searching" @click="searchBarcode">
              {{ t('quickUse.search') }}
            </UButton>
            <UButton
              as="label"
              color="neutral"
              variant="soft"
              icon="i-lucide-image-up"
              :loading="imageLoading"
            >
              {{ t('quickUse.uploadImage') }}
              <input
                class="sr-only"
                type="file"
                accept="image/*"
                capture="environment"
                @change="decodeBarcodeImage"
              >
            </UButton>
          </div>
        </div>

        <p class="text-sm leading-6 text-muted">
          {{ t('quickUse.routeHint') }}
        </p>
      </div>
    </UCard>
  </div>
</template>
