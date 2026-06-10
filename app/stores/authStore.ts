import type { Session, User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isLogin = computed(() => Boolean(user.value))

  const setSession = (nextSession: Session | null) => {
    session.value = nextSession
    user.value = nextSession?.user ?? null
  }

  const setLoading = (nextLoading: boolean) => {
    loading.value = nextLoading
  }

  const setInitialized = (nextInitialized: boolean) => {
    initialized.value = nextInitialized
  }

  return {
    user,
    session,
    isLogin,
    loading,
    initialized,
    setSession,
    setLoading,
    setInitialized,
  }
})
