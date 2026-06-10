const supportedBarcodeImageExtensions = [
  'jpg',
  'jpeg',
  'png',
  'webp',
]

export const supportedBarcodeImageTypes = supportedBarcodeImageExtensions
  .filter(extension => extension !== 'jpg')
  .map((extension) => {
    return `image/${extension}`
  })

export const barcodeImageAccept = supportedBarcodeImageTypes.join(',')

const unsupportedBarcodeImageTypes = [
  'image/heic',
  'image/heif',
  'image/heic-sequence',
  'image/heif-sequence',
]

const unsupportedBarcodeImageExtensions = [
  'heic',
  'heif',
  'heics',
  'heifs',
]

const heifBrands = [
  'heic',
  'heix',
  'hevc',
  'hevx',
  'heim',
  'heis',
  'hevm',
  'hevs',
  'mif1',
  'msf1',
]

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

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
