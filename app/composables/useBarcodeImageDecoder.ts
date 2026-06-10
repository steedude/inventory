import type { Ref } from 'vue'
import { isSupportedBarcodeImage } from '~~/config/barcodeConfig'

export function useBarcodeImageDecoder() {
  const appToast = useAppToast()
  const barcodeScanner = useBarcodeScanner()
  const { t } = useI18n()
  const { runSafely } = useSafeRun()

  const decodeBarcodeImage = async (
    event: Event,
    loading: Ref<boolean>,
    onDetected: (barcode: string) => void | Promise<void>,
  ) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (file === undefined) {
      return
    }

    loading.value = true

    try {
      await runSafely(async () => {
        if (!await isSupportedBarcodeImage(file)) {
          appToast.setError(t('quickUse.unsupportedImageType'))
          return
        }

        const result = await barcodeScanner.decodeImage(file)

        if (result === null) {
          appToast.setError(t('quickUse.noBarcodeFound'))
          return
        }

        await onDetected(result)
        appToast.setSuccess(t('quickUse.barcodeDetected'))
      })
    }
    finally {
      loading.value = false
      input.value = ''
    }
  }

  return {
    decodeBarcodeImage,
  }
}
