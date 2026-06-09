import type { AuthError } from '@supabase/supabase-js'

type ToastMessage = string | Error | AuthError | null | undefined

export function useAppToast() {
  const toast = useToast()
  const i18n = useI18n()

  const resolveMessage = (message: string) => i18n.te(message) === true ? i18n.t(message) : message

  const getMessage = (message: ToastMessage) => {
    if (message === null || message === undefined || message === '') {
      return ''
    }

    if (typeof message === 'string') {
      return resolveMessage(message)
    }

    return message.message
  }

  const setSuccess = (message: string, description?: string) => {
    toast.add({
      title: resolveMessage(message),
      description: description !== undefined && description.length > 0 ? resolveMessage(description) : undefined,
      color: 'success',
      icon: 'i-lucide-circle-check',
    })
  }

  const setError = (message: ToastMessage) => {
    const title = getMessage(message)

    toast.add({
      title: title.length > 0 ? title : resolveMessage('common.error'),
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  }

  const setInfo = (message: string, description?: string) => {
    toast.add({
      title: resolveMessage(message),
      description: description !== undefined && description.length > 0 ? resolveMessage(description) : undefined,
      color: 'info',
      icon: 'i-lucide-info',
    })
  }

  const setWarning = (message: string, description?: string) => {
    toast.add({
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
