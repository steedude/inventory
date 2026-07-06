import { AppErrorCode } from '~~/config/errorConfig'

const appErrorCodes = new Set<string>(Object.values(AppErrorCode))
const supabaseInvalidCredentialsCode = 'invalid_credentials'
const supabaseInvalidCredentialsMessage = 'Invalid login credentials'

class AppCodeError extends Error {
  constructor(readonly code: AppErrorCode) {
    super(code)
  }
}

export function isAppErrorCode(value: unknown): value is AppErrorCode {
  return typeof value === 'string' && appErrorCodes.has(value)
}

export function createAppError(code: AppErrorCode) {
  return new AppCodeError(code)
}

function getStringProperty(value: unknown, key: string) {
  if (typeof value !== 'object' || value === null || !(key in value)) {
    return undefined
  }

  const property = value[key as keyof typeof value]

  return typeof property === 'string' ? property : undefined
}

function getObjectProperty(value: unknown, key: string) {
  if (typeof value !== 'object' || value === null || !(key in value)) {
    return undefined
  }

  const property = value[key as keyof typeof value]

  return typeof property === 'object' && property !== null ? property : undefined
}

function resolveAppCodeError(error: unknown) {
  if (error instanceof AppCodeError) {
    return error.code
  }

  if (isAppErrorCode(error)) {
    return error
  }

  return undefined
}

function resolveServerApiErrorCode(error: unknown) {
  const data = getObjectProperty(error, 'data')
  const code = getStringProperty(data, 'code')

  if (isAppErrorCode(code)) {
    return code
  }

  return undefined
}

function resolveSupabaseAuthErrorCode(error: unknown) {
  const code = getStringProperty(error, 'code')
  const message = getStringProperty(error, 'message')

  if (code === supabaseInvalidCredentialsCode || message === supabaseInvalidCredentialsMessage) {
    return AppErrorCode.InvalidCredentials
  }

  return undefined
}

export function resolveAppErrorCode(error: unknown): AppErrorCode {
  return resolveAppCodeError(error)
    ?? resolveServerApiErrorCode(error)
    ?? resolveSupabaseAuthErrorCode(error)
    ?? AppErrorCode.Unknown
}
