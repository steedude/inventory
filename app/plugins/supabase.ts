import type { Database } from '~~/types/databaseTypes'
import { createClient } from '@supabase/supabase-js'
import { AppErrorCode } from '~~/config/errorConfig'
import { createAppError } from '~~/utils/errorUtils'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    throw createAppError(AppErrorCode.MissingSupabaseConfig)
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  return {
    provide: {
      supabase,
    },
  }
})
