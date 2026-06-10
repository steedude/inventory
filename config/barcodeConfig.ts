export const barcodeImageAccept = 'image/jpeg,image/png,image/webp'

export const supportedBarcodeImageTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

export function isSupportedBarcodeImage(file: File) {
  return supportedBarcodeImageTypes.includes(file.type)
}
