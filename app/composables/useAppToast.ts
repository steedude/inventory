export function useAppToast() {
  const toast = useToast()
  const i18n = useI18n()

  const resolveMessage = (message: string) => i18n.te(message) === true ? i18n.t(message) : message

  const isMessageObject = (message: unknown): message is { message: string } => {
    return typeof message === 'object'
      && message !== null
      && 'message' in message
      && typeof message.message === 'string'
  }

  const getMessage = (message: unknown) => {
    if (message === null || message === undefined || message === '') {
      return ''
    }

    if (typeof message === 'string') {
      return resolveMessage(message)
    }

    if (isMessageObject(message)) {
      return resolveMessage(message.message)
    }

    return ''
  }

  const setSuccess = (message: string, description?: string) => {
    toast.add({
      title: resolveMessage(message),
      description: description !== undefined && description.length > 0 ? resolveMessage(description) : undefined,
      color: 'success',
      icon: 'i-lucide-circle-check',
    })
  }

  const setError = (message: unknown) => {
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
