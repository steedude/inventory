export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cronSecret = config.inventoryCronSecret
  const authorization = getHeader(event, 'authorization')
  const cronHeader = getHeader(event, 'x-cron-secret')
  const providedSecret = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : cronHeader

  if (!cronSecret || providedSecret !== cronSecret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized cron request',
    })
  }

  const lowStockItems = await fetchLowStockItems()
  const emailResults = await sendLowStockEmails(
    lowStockItems,
    config.resendApiKey,
    config.lowStockFromEmail,
    { respectDailyEmailSettings: true },
  )

  return {
    checkedAt: new Date().toISOString(),
    count: lowStockItems.length,
    emailCount: emailResults.sentCount,
    skippedEmailCount: emailResults.skippedCount,
    items: lowStockItems,
  }
})
