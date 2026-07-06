import type { Database } from '~~/types/databaseTypes'
import { createClient } from '@supabase/supabase-js'
import { AppErrorCode } from '~~/config/errorConfig'
import { createAppServerError } from '~~/server/utils/appServerError'

export function useSupabaseServiceClient() {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey

  if (!supabaseUrl || !serviceRoleKey) {
    throw createAppServerError(500, AppErrorCode.MissingSupabaseConfig)
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey)
}
