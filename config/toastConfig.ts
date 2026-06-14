import { appToastDuration } from '~~/app/composables/useAppToast'

export const toasterConfig = {
  position: 'top-right' as const,
  expand: true,
  progress: false,
  duration: appToastDuration,
  max: 5,
}
