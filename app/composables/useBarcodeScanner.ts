export function useBarcodeScanner() {
  const scanning = ref(false)
  let scanControls: { stop: () => void } | undefined

  const createReader = async () => {
    const { BrowserMultiFormatReader } = await import('@zxing/browser')
    const { BarcodeFormat, DecodeHintType } = await import('@zxing/library')
    const hints = new Map()

    hints.set(DecodeHintType.TRY_HARDER, true)
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.ITF,
    ])

    return new BrowserMultiFormatReader(hints)
  }

  const decodeImage = async (file: File) => {
    if (!import.meta.client) {
      return null
    }

    const reader = await createReader()
    const imageUrl = URL.createObjectURL(file)

    try {
      const result = await reader.decodeFromImageUrl(imageUrl)
      return result.getText()
    }
    catch {
      return null
    }
    finally {
      URL.revokeObjectURL(imageUrl)
    }
  }

  const stopCameraScan = () => {
    scanControls?.stop()
    scanControls = undefined
    scanning.value = false
  }

  const startCameraScan = async (
    videoElement: HTMLVideoElement | undefined,
    onDetected: (barcode: string) => void | Promise<void>,
  ) => {
    if (!import.meta.client || videoElement === undefined) {
      return
    }

    stopCameraScan()
    scanning.value = true

    try {
      const reader = await createReader()
      const controls = await reader.decodeFromConstraints(
        {
          video: {
            facingMode: {
              ideal: 'environment',
            },
          },
          audio: false,
        },
        videoElement,
        (result) => {
          const text = result?.getText()

          if (text === undefined || text.length === 0) {
            return
          }

          void onDetected(text)
          stopCameraScan()
        },
      )

      scanControls = controls
    }
    catch (error) {
      scanning.value = false
      throw error
    }
  }

  return {
    decodeImage,
    scanning,
    startCameraScan,
    stopCameraScan,
  }
}
