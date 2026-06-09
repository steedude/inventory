import type { AuthChangeEvent, Session, SupabaseClient, User } from '@supabase/supabase-js'
import { AuthMode } from '../../config/auth'

export const useAuthStore = defineStore('auth', () => {
  const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient }

  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const mode = ref<AuthMode>(AuthMode.Login)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(user.value))
  const isLogin = computed(() => mode.value === AuthMode.Login)

  const setSession = (nextSession: Session | null) => {
    session.value = nextSession
    user.value = nextSession?.user ?? null
  }

  const toggleMode = () => {
    mode.value = isLogin.value ? AuthMode.Signup : AuthMode.Login
  }

  const initialize = async () => {
    if (initialized.value) {
      return
    }

    loading.value = true
    const { data, error } = await $supabase.auth.getSession()

    setSession(data.session)

    $supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession: Session | null) => {
      setSession(nextSession)
    })

    initialized.value = true
    loading.value = false

    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true

    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      setSession(data.session)
    }

    loading.value = false
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    loading.value = true

    const { data, error } = await $supabase.auth.signUp({
      email,
      password,
    })

    if (!error) {
      setSession(data.session)
    }

    loading.value = false
    return { data, error }
  }

  const signOut = async () => {
    loading.value = true

    const { error } = await $supabase.auth.signOut()

    if (!error) {
      setSession(null)
    }

    loading.value = false
    return { error }
  }

  return {
    user,
    session,
    mode,
    loading,
    initialized,
    isAuthenticated,
    isLogin,
    toggleMode,
    initialize,
    signIn,
    signUp,
    signOut,
  }
})
