import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { inventoryQueryGcTime, inventoryQueryStaleTime } from '~~/config/inventoryQueryConfig'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: inventoryQueryGcTime,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: inventoryQueryStaleTime,
      },
    },
  })

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  })
})
