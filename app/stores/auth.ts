import type { AuthChangeEvent, AuthError, Session, SupabaseClient, User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient }

  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(user.value))

  const setSession = (nextSession: Session | null) => {
    session.value = nextSession
    user.value = nextSession?.user ?? null
  }

  const setError = (error: AuthError | Error | null) => {
    errorMessage.value = error?.message ?? ''
  }

  const setSuccess = (message = '') => {
    successMessage.value = message
  }

  const initialize = async () => {
    if (initialized.value) {
      return
    }

    loading.value = true
    const { data, error } = await $supabase.auth.getSession()

    setSession(data.session)
    setError(error)

    $supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession: Session | null) => {
      setSession(nextSession)
    })

    initialized.value = true
    loading.value = false
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    setError(null)
    setSuccess()

    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error)
    }
    else {
      setSession(data.session)
    }

    loading.value = false
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    loading.value = true
    setError(null)
    setSuccess()

    const { data, error } = await $supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error)
    }
    else {
      setSession(data.session)
      if (!data.session) {
        setSuccess('auth.signupSuccess')
      }
    }

    loading.value = false
    return { data, error }
  }

  const signOut = async () => {
    loading.value = true
    setError(null)
    setSuccess()

    const { error } = await $supabase.auth.signOut()

    if (error) {
      setError(error)
    }
    else {
      setSession(null)
    }

    loading.value = false
    return { error }
  }

  return {
    user,
    session,
    loading,
    errorMessage,
    successMessage,
    initialized,
    isAuthenticated,
    setSuccess,
    initialize,
    signIn,
    signUp,
    signOut,
  }
})
