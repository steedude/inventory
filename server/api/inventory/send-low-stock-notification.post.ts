import type { H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const accessToken = getBearerToken(event)

  if (accessToken === null) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing user authorization',
    })
  }

  const supabase = useSupabaseServiceClient()
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)

  if (userError !== null || userData.user === null) {
    throw createError({
      statusCode: 401,
      statusMessage: userError?.message ?? 'Invalid user authorization',
    })
  }

  const lowStockItems = await fetchLowStockItems(userData.user.id)
  const result = await sendLowStockEmails(
    lowStockItems,
    config.resendApiKey,
    config.lowStockFromEmail,
  )

  return {
    ok: true,
    checkedAt: new Date().toISOString(),
    count: lowStockItems.length,
    emailCount: result.sentCount,
    skippedEmailCount: result.skippedCount,
  }
})

function getBearerToken(event: H3Event) {
  const authorization = getHeader(event, 'authorization')

  if (authorization?.startsWith('Bearer ') !== true) {
    return null
  }

  return authorization.slice('Bearer '.length)
}
