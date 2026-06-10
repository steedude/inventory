import type { Database } from '~~/types/databaseTypes'
import { createClient } from '@supabase/supabase-js'
import { AppError } from '~~/config/errorConfig'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(AppError.MissingSupabaseConfig)
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  return {
    provide: {
      supabase,
    },
  }
})
