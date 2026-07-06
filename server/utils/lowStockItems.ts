import type { LowStockItem } from '~~/types/lowStockEmailTypes'
import { AppErrorCode } from '~~/config/errorConfig'
import { createAppServerError } from '~~/server/utils/appServerError'

export async function fetchLowStockItems(userId?: string) {
  const supabase = useSupabaseServiceClient()
  let query = supabase
    .from('items')
    .select('user_id, name, quantity, min_quantity')
    .eq('low_stock_enabled', true)
    .order('updated_at', { ascending: false })

  if (userId !== undefined) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.overrideTypes<LowStockItem[], { merge: false }>()

  if (error !== null) {
    throw createAppServerError(500, AppErrorCode.LowStockCheckFailed)
  }

  return (data ?? []).filter(item => item.quantity <= item.min_quantity)
}
