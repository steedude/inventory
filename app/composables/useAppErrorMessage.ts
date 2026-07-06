import { AppErrorCode } from '~~/config/errorConfig'

export function useAppErrorMessage() {
  const { t } = useI18n()

  const getAppErrorMessage = (code: AppErrorCode) => {
    const messageMap = {
      [AppErrorCode.EmailAlreadyExists]: () => t('auth.emailAlreadyExists'),
      [AppErrorCode.EmailSendFailed]: () => t('common.emailSendFailed'),
      [AppErrorCode.InvalidCredentials]: () => t('auth.invalidCredentials'),
      [AppErrorCode.LowStockCheckFailed]: () => t('common.lowStockCheckFailed'),
      [AppErrorCode.MissingResendConfig]: () => t('common.missingResendConfig'),
      [AppErrorCode.MissingSignedInUser]: () => t('common.missingSignedInUser'),
      [AppErrorCode.MissingSupabaseConfig]: () => t('common.missingSupabaseConfig'),
      [AppErrorCode.UnauthorizedCronRequest]: () => t('common.unauthorizedCronRequest'),
      [AppErrorCode.UnauthorizedUserRequest]: () => t('common.unauthorizedUserRequest'),
      [AppErrorCode.UserSettingsFetchFailed]: () => t('common.userSettingsFetchFailed'),
      [AppErrorCode.Unknown]: () => t('common.error'),
    } satisfies Record<AppErrorCode, () => string>

    return messageMap[code]()
  }

  return {
    getAppErrorMessage,
  }
}
