export const itemImageBucket = 'inventory-item-images'
export const imageCompressionThresholdBytes = 2 * 1024 * 1024
export const imageCompressionTargetMb = 1
export const imageUploadAccept = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'

export const imageUploadExtensionByType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
