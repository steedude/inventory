export const itemImageBucket = 'inventory-item-images'
export const imageCompressionThresholdBytes = 2 * 1024 * 1024
export const imageCompressionTargetMb = 1
export const imageUploadAccept = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'

const uploadExtensionByType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

export function getImageUploadExtension(file: File) {
  return uploadExtensionByType[file.type.toLowerCase()]
    ?? getFileExtension(file.name)
    ?? 'jpg'
}
