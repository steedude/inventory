import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/types/databaseTypes'

declare module '#app' {
  interface NuxtApp {
    $supabase: SupabaseClient<Database>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $supabase: SupabaseClient<Database>
  }
}

export {}
