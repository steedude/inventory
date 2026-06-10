import { safelyRun } from '~~/utils/commonUtils'

export function useSafeRun() {
  const appToast = useAppToast()

  const runSafely = async (action: () => Promise<void>) => safelyRun(action, appToast.setError)

  return {
    runSafely,
  }
}
