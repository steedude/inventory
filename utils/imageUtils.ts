import { imageUploadExtensionByType } from '~~/config/imageConfig'

export function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

export function getImageUploadExtension(file: File) {
  return imageUploadExtensionByType[file.type.toLowerCase()]
    ?? getFileExtension(file.name)
    ?? 'jpg'
}
