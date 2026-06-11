import { AppError } from '~~/config/errorConfig'
import { getImageUploadExtension, itemImageBucket } from '~~/config/imageConfig'

export function useItemImageUpload() {
  const auth = useAuthStore()
  const { $supabase } = useNuxtApp()
  const imageProcessor = useImageProcessor()

  function requireUserId() {
    const userId = auth.user?.id

    if (userId === undefined) {
      throw new Error(AppError.MissingSignedInUser)
    }

    return userId
  }

  async function uploadItemImage(file: File) {
    const image = await imageProcessor.prepareImage(file)
    const contentType = image.type || 'application/octet-stream'
    const filePath = `${requireUserId()}/items/${crypto.randomUUID()}.${getImageUploadExtension(image)}`
    const { error } = await $supabase.storage
      .from(itemImageBucket)
      .upload(filePath, image, {
        contentType,
        upsert: false,
      })

    if (error !== null) {
      throw error
    }

    const { data } = $supabase.storage
      .from(itemImageBucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  return {
    imageUploadAccept: imageProcessor.imageUploadAccept,
    uploadItemImage,
  }
}
