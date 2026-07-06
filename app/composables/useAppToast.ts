import { appToastDuration } from '~~/config/toastConfig'
import { useAppErrorMessage } from '~~/app/composables/useAppErrorMessage'
import { resolveAppErrorCode } from '~~/utils/errorUtils'

export function useAppToast() {
  const toast = useToast()
  const i18n = useI18n()
  const { getAppErrorMessage } = useAppErrorMessage()
  const toastOptions = {
    duration: appToastDuration,
  }

  const resolveMessage = (message: string) => i18n.te(message) === true ? i18n.t(message) : message

  const setSuccess = (message: string, description?: string) => {
    toast.add({
      ...toastOptions,
      title: resolveMessage(message),
      description: description !== undefined && description.length > 0 ? resolveMessage(description) : undefined,
      color: 'success',
      icon: 'i-lucide-circle-check',
    })
  }

  const setError = (error: unknown) => {
    const code = resolveAppErrorCode(error)

    toast.add({
      ...toastOptions,
      title: getAppErrorMessage(code),
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  }

  const setInfo = (message: string, description?: string) => {
    toast.add({
      ...toastOptions,
      title: resolveMessage(message),
      description: description !== undefined && description.length > 0 ? resolveMessage(description) : undefined,
      color: 'info',
      icon: 'i-lucide-info',
    })
  }

  const setWarning = (message: string, description?: string) => {
    toast.add({
      ...toastOptions,
      title: resolveMessage(message),
      description: description !== undefined && description.length > 0 ? resolveMessage(description) : undefined,
      color: 'warning',
      icon: 'i-lucide-triangle-alert',
    })
  }

  return {
    setSuccess,
    setError,
    setInfo,
    setWarning,
  }
}
