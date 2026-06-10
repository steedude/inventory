import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { AppError } from '~~/config/errorConfig'

export function useAuth() {
  const auth = useAuthStore()
  const { $supabase } = useNuxtApp()

  const initialize = async () => {
    if (auth.initialized) {
      return
    }

    auth.setLoading(true)
    const { data, error } = await $supabase.auth.getSession()

    auth.setSession(data.session)

    $supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession: Session | null) => {
      auth.setSession(nextSession)
    })

    auth.setInitialized(true)
    auth.setLoading(false)

    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    auth.setLoading(true)

    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      auth.setSession(data.session)
    }

    auth.setLoading(false)
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    auth.setLoading(true)

    const { data, error } = await $supabase.auth.signUp({
      email,
      password,
    })

    if (data.user?.identities?.length === 0) {
      auth.setLoading(false)

      return {
        data,
        error: new Error(AppError.EmailAlreadyExists),
      }
    }

    if (!error) {
      auth.setSession(data.session)
    }

    auth.setLoading(false)
    return { data, error }
  }

  const signInWithGoogle = async () => {
    auth.setLoading(true)

    const { data, error } = await $supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: import.meta.client ? `${globalThis.location.origin}/dashboard` : undefined,
      },
    })

    if (error !== null) {
      auth.setLoading(false)
    }

    return { data, error }
  }

  const signOut = async () => {
    auth.setLoading(true)

    const { error } = await $supabase.auth.signOut()

    if (!error) {
      auth.setSession(null)
    }

    auth.setLoading(false)
    return { error }
  }

  return {
    initialize,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  }
}
