import type { AppErrorCode } from '~~/config/errorConfig'

export function createAppServerError(statusCode: number, code: AppErrorCode) {
  return createError({
    statusCode,
    data: {
      code,
    },
  })
}
