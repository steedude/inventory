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

  const supabase = useSupabaseServiceClient()
  const { data, error } = await supabase
    .from('items')
    .select('id, user_id, name, quantity, min_quantity, barcode')
    .eq('low_stock_enabled', true)
    .order('updated_at', { ascending: false })

  if (error !== null) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const lowStockItems = (data ?? []).filter(item => item.quantity <= item.min_quantity)

  return {
    checkedAt: new Date().toISOString(),
    count: lowStockItems.length,
    items: lowStockItems,
  }
})
