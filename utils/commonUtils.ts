export async function safelyRun(action: () => Promise<void>, onError: (error: unknown) => void) {
  try {
    await action()
  }
  catch (error) {
    onError(error)
  }
}
