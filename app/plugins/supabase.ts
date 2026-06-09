import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase runtime config. Check SUPABASE_URL and SUPABASE_KEY.')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  return {
    provide: {
      supabase,
    },
  }
})
