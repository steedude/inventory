import { AppError } from '~~/config/errorConfig'

export function useUserSettings() {
  const auth = useAuthStore()
  const { $supabase } = useNuxtApp()

  const lowStockDailyEmailEnabled = ref(false)
  const loading = ref(false)
  const saving = ref(false)

  const requireUserId = () => {
    const userId = auth.user?.id

    if (userId === undefined) {
      throw new Error(AppError.MissingSignedInUser)
    }

    return userId
  }

  const saveSettings = async (enabled: boolean) => {
    saving.value = true

    try {
      const userId = requireUserId()
      const { error } = await $supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          low_stock_daily_email_enabled: enabled,
        })

      if (error !== null) {
        throw error
      }

      lowStockDailyEmailEnabled.value = enabled
    }
    finally {
      saving.value = false
    }
  }

  const fetchSettings = async () => {
    loading.value = true

    try {
      const userId = requireUserId()
      const { data, error } = await $supabase
        .from('user_settings')
        .select('low_stock_daily_email_enabled')
        .eq('user_id', userId)
        .maybeSingle()

      if (error !== null) {
        throw error
      }

      if (data === null) {
        await saveSettings(false)
        return
      }

      lowStockDailyEmailEnabled.value = data.low_stock_daily_email_enabled
    }
    finally {
      loading.value = false
    }
  }

  return {
    fetchSettings,
    loading,
    lowStockDailyEmailEnabled,
    saveSettings,
    saving,
  }
}
