import type { Database } from '~~/types/databaseTypes'
import { createClient } from '@supabase/supabase-js'
import { AppError } from '~~/config/errorConfig'

export function useSupabaseServiceClient() {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: AppError.MissingSupabaseConfig,
    })
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey)
}
