export enum AppErrorCode {
  EmailAlreadyExists = 'EMAIL_ALREADY_EXISTS',
  EmailSendFailed = 'EMAIL_SEND_FAILED',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  LowStockCheckFailed = 'LOW_STOCK_CHECK_FAILED',
  MissingResendConfig = 'MISSING_RESEND_CONFIG',
  MissingSignedInUser = 'MISSING_SIGNED_IN_USER',
  MissingSupabaseConfig = 'MISSING_SUPABASE_CONFIG',
  UnauthorizedCronRequest = 'UNAUTHORIZED_CRON_REQUEST',
  UnauthorizedUserRequest = 'UNAUTHORIZED_USER_REQUEST',
  UserSettingsFetchFailed = 'USER_SETTINGS_FETCH_FAILED',
  Unknown = 'UNKNOWN_ERROR',
}
