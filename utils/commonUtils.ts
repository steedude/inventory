import * as Sentry from '@sentry/nuxt'

export async function safelyRun(action: () => Promise<void>, onError: (error: unknown) => void) {
  try {
    await action()
  }
  catch (error) {
    Sentry.captureException(error)
    onError(error)
  }
}
