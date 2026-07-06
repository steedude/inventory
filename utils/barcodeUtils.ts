import {
  heifBrands,
  supportedBarcodeImageExtensions,
  supportedBarcodeImageTypes,
  unsupportedBarcodeImageExtensions,
  unsupportedBarcodeImageTypes,
} from '~~/config/barcodeConfig'
import { getFileExtension } from '~~/utils/imageUtils'

async function isHeifImage(file: File) {
  const buffer = await file.slice(4, 12).arrayBuffer()
  const header = new TextDecoder().decode(buffer).toLowerCase()

  return header.startsWith('ftyp') && heifBrands.includes(header.slice(4, 8))
}

export async function isSupportedBarcodeImage(file: File) {
  const fileType = file.type.toLowerCase()
  const extension = getFileExtension(file.name)

  if (
    unsupportedBarcodeImageTypes.includes(fileType)
    || unsupportedBarcodeImageExtensions.includes(extension)
    || await isHeifImage(file)
  ) {
    return false
  }

  if (supportedBarcodeImageExtensions.includes(extension)) {
    return true
  }

  return supportedBarcodeImageTypes.includes(fileType)
}
