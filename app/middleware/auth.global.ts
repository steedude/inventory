import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  const auth = useAuthStore()
  const authService = useAuth()
  const isDashboardRoute = to.path.startsWith('/dashboard')
  const isLoginRoute = to.path === '/login'

  if (!isDashboardRoute && !isLoginRoute) {
    return
  }

  await authService.initialize()

  if (isDashboardRoute && !auth.isLogin) {
    return navigateTo('/login')
  }

  if (isLoginRoute && auth.isLogin) {
    return navigateTo('/dashboard')
  }
})
