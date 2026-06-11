import {
  imageCompressionTargetMb,
  imageCompressionThresholdBytes,
  imageUploadAccept,
} from '~~/config/imageConfig'

export function useImageProcessor() {
  async function compressToJpeg(file: File) {
    const imageCompression = (await import('browser-image-compression')).default
    const compressed = await imageCompression(file, {
      maxSizeMB: imageCompressionTargetMb,
      maxWidthOrHeight: 2200,
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.88,
    })

    return new File([compressed], `${crypto.randomUUID()}.jpg`, {
      type: 'image/jpeg',
    })
  }

  async function prepareImage(file: File) {
    if (file.size <= imageCompressionThresholdBytes) {
      return file
    }

    return compressToJpeg(file)
  }

  return {
    imageUploadAccept,
    prepareImage,
  }
}
