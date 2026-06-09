export function useBarcodeScanner() {
  const decodeImage = async (file: File) => {
    if (!import.meta.client) {
      return null
    }

    const { BrowserMultiFormatReader } = await import('@zxing/browser')
    const reader = new BrowserMultiFormatReader()
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

  return {
    decodeImage,
  }
}
