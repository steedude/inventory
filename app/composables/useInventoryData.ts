import type {
  CreateInventoryCategoryPayload,
  CreateInventoryGroupPayload,
  CreateInventoryItemPayload,
  CreateInventoryLocationPayload,
  CreateInventoryLogPayload,
  InventoryLogInsert,
  UpdateInventoryCategoryPayload,
  UpdateInventoryGroupPayload,
  UpdateInventoryItemPayload,
  UpdateInventoryLocationPayload,
} from '~~/types/inventoryTypes'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { createInventoryService } from '~~/app/services/inventoryService'
import { AppErrorCode } from '~~/config/errorConfig'
import { InventoryLogType } from '~~/config/inventoryLogConfig'
import { inventoryQueryKey, inventoryQueryStaleTime } from '~~/config/inventoryQueryConfig'
import { createAppError } from '~~/utils/errorUtils'
import { createInventoryChangedFields } from '~~/utils/inventoryLogUtils'
import {
  emptyToNull,
  findInventoryItemByBarcode,
  findInventoryName,
} from '~~/utils/inventoryUtils'

export function useInventoryData() {
  const auth = useAuthStore()
  const { $supabase } = useNuxtApp()
  const queryClient = useQueryClient()
  const service = createInventoryService($supabase)
  const userId = computed(() => auth.user?.id ?? null)

  const categoriesQuery = useQuery({
    enabled: false,
    queryFn: service.fetchCategories,
    queryKey: computed(() => inventoryQueryKey.categories(userId.value)),
    staleTime: inventoryQueryStaleTime,
  })
  const groupsQuery = useQuery({
    enabled: false,
    queryFn: service.fetchGroups,
    queryKey: computed(() => inventoryQueryKey.groups(userId.value)),
    staleTime: inventoryQueryStaleTime,
  })
  const itemsQuery = useQuery({
    enabled: false,
    queryFn: service.fetchItems,
    queryKey: computed(() => inventoryQueryKey.items(userId.value)),
    staleTime: inventoryQueryStaleTime,
  })
  const locationsQuery = useQuery({
    enabled: false,
    queryFn: service.fetchLocations,
    queryKey: computed(() => inventoryQueryKey.locations(userId.value)),
    staleTime: inventoryQueryStaleTime,
  })
  const logsQuery = useQuery({
    enabled: false,
    queryFn: service.fetchLogs,
    queryKey: computed(() => inventoryQueryKey.logs(userId.value)),
    staleTime: inventoryQueryStaleTime,
  })

  const categories = computed(() => categoriesQuery.data.value ?? [])
  const groups = computed(() => groupsQuery.data.value ?? [])
  const items = computed(() => itemsQuery.data.value ?? [])
  const locations = computed(() => locationsQuery.data.value ?? [])
  const logs = computed(() => logsQuery.data.value ?? [])
  const loading = computed(() =>
    categoriesQuery.isFetching.value
    || groupsQuery.isFetching.value
    || itemsQuery.isFetching.value
    || locationsQuery.isFetching.value
    || logsQuery.isFetching.value,
  )

  const mainCategories = computed(() => categories.value.filter(category => category.parent_id === null))
  const subCategories = computed(() => categories.value.filter(category => category.parent_id !== null))
  const lowStockItems = computed(() => items.value.filter(item =>
    item.low_stock_enabled && item.quantity <= item.min_quantity,
  ))

  const requireUserId = () => {
    const id = auth.user?.id

    if (id === undefined) {
      throw createAppError(AppErrorCode.MissingSignedInUser)
    }

    return id
  }

  const getCategoryName = (id: string | null) => findInventoryName(categories.value, id)
  const getMainCategoryName = (id: string | null) => {
    if (id === null) {
      return '-'
    }

    const category = categories.value.find(record => record.id === id)

    if (category === undefined) {
      return '-'
    }

    return category.parent_id === null
      ? category.name
      : getCategoryName(category.parent_id)
  }
  const getGroupName = (id: string | null) => findInventoryName(groups.value, id)
  const getLocationName = (id: string | null) => findInventoryName(locations.value, id)
  const findItemByBarcode = (barcode: string) => findInventoryItemByBarcode(items.value, barcode)

  const ensureCategories = async () => queryClient.ensureQueryData({
    queryFn: service.fetchCategories,
    queryKey: inventoryQueryKey.categories(userId.value),
    staleTime: inventoryQueryStaleTime,
  })
  const ensureGroups = async () => queryClient.ensureQueryData({
    queryFn: service.fetchGroups,
    queryKey: inventoryQueryKey.groups(userId.value),
    staleTime: inventoryQueryStaleTime,
  })
  const ensureItems = async () => queryClient.ensureQueryData({
    queryFn: service.fetchItems,
    queryKey: inventoryQueryKey.items(userId.value),
    staleTime: inventoryQueryStaleTime,
  })
  const ensureLocations = async () => queryClient.ensureQueryData({
    queryFn: service.fetchLocations,
    queryKey: inventoryQueryKey.locations(userId.value),
    staleTime: inventoryQueryStaleTime,
  })
  const ensureLogs = async () => queryClient.ensureQueryData({
    queryFn: service.fetchLogs,
    queryKey: inventoryQueryKey.logs(userId.value),
    staleTime: inventoryQueryStaleTime,
  })

  const refreshCategories = async () => {
    await categoriesQuery.refetch()
  }
  const refreshGroups = async () => {
    await groupsQuery.refetch()
  }
  const refreshItems = async () => {
    await itemsQuery.refetch()
  }
  const refreshLocations = async () => {
    await locationsQuery.refetch()
  }
  const refreshLogs = async () => {
    await logsQuery.refetch()
  }

  const ensureItemMetaData = async () => {
    await Promise.all([
      ensureCategories(),
      ensureGroups(),
      ensureLocations(),
    ])
  }

  const refreshItemMetaData = async () => {
    await Promise.all([
      refreshCategories(),
      refreshGroups(),
      refreshLocations(),
    ])
  }

  const createLog = async (payload: CreateInventoryLogPayload) => {
    const logPayload: InventoryLogInsert = {
      ...payload,
      changed_fields: payload.changed_fields,
      user_id: requireUserId(),
    }

    await service.createLog(logPayload)
  }

  const createCategory = async (payload: CreateInventoryCategoryPayload) => {
    await service.createCategory({
      ...payload,
      user_id: requireUserId(),
    })
    await refreshCategories()
  }

  const updateCategory = async (id: string, payload: UpdateInventoryCategoryPayload) => {
    await service.updateCategory(id, payload)
    await refreshCategories()
  }

  const deleteCategory = async (id: string) => {
    await service.deleteCategory(id)
    await refreshCategories()
  }

  const createGroup = async (payload: CreateInventoryGroupPayload) => {
    await service.createGroup({
      ...payload,
      user_id: requireUserId(),
    })
    await refreshGroups()
  }

  const updateGroup = async (id: string, payload: UpdateInventoryGroupPayload) => {
    await service.updateGroup(id, payload)
    await refreshGroups()
  }

  const deleteGroup = async (id: string) => {
    await service.deleteGroup(id)
    await refreshGroups()
  }

  const fetchItem = async (id: string) => {
    return queryClient.ensureQueryData({
      queryFn: async () => service.fetchItem(id),
      queryKey: inventoryQueryKey.item(userId.value, id),
      staleTime: inventoryQueryStaleTime,
    })
  }

  const createItem = async (payload: CreateInventoryItemPayload) => {
    const data = await service.createItem({
      ...payload,
      user_id: requireUserId(),
    })

    await createLog({
      item_id: data.id,
      item_name: data.name,
      type: InventoryLogType.Create,
      changed_fields: createInventoryChangedFields(null, data),
    })
    await Promise.all([
      refreshItems(),
      refreshLogs(),
    ])
  }

  const updateItem = async (id: string, payload: UpdateInventoryItemPayload) => {
    const beforeItem = await fetchItem(id)
    const data = await service.updateItem(id, payload)
    const changedFields = createInventoryChangedFields(beforeItem, data)

    queryClient.setQueryData(inventoryQueryKey.item(userId.value, id), data)

    if (changedFields.length > 0) {
      await createLog({
        item_id: data.id,
        item_name: data.name,
        type: InventoryLogType.Update,
        changed_fields: changedFields,
      })
    }

    await Promise.all([
      refreshItems(),
      refreshLogs(),
    ])
  }

  const deleteItem = async (id: string) => {
    const item = await fetchItem(id)

    await service.deleteItem(id)
    await createLog({
      item_id: null,
      item_name: item.name,
      type: InventoryLogType.Delete,
      changed_fields: createInventoryChangedFields(item, null),
    })
    queryClient.removeQueries({
      queryKey: inventoryQueryKey.item(userId.value, id),
    })
    await Promise.all([
      refreshItems(),
      refreshLogs(),
    ])
  }

  const createLocation = async (payload: CreateInventoryLocationPayload) => {
    await service.createLocation({
      ...payload,
      user_id: requireUserId(),
    })
    await refreshLocations()
  }

  const updateLocation = async (id: string, payload: UpdateInventoryLocationPayload) => {
    await service.updateLocation(id, payload)
    await refreshLocations()
  }

  const deleteLocation = async (id: string) => {
    await service.deleteLocation(id)
    await refreshLocations()
  }

  return {
    categories,
    groups,
    items,
    locations,
    logs,
    loading,
    lowStockItems,
    mainCategories,
    subCategories,
    createCategory,
    createGroup,
    createItem,
    createLocation,
    deleteCategory,
    deleteGroup,
    deleteItem,
    deleteLocation,
    emptyToNull,
    ensureCategories,
    ensureGroups,
    ensureItemMetaData,
    ensureItems,
    ensureLocations,
    ensureLogs,
    fetchItem,
    findItemByBarcode,
    getCategoryName,
    getGroupName,
    getLocationName,
    getMainCategoryName,
    refreshCategories,
    refreshGroups,
    refreshItemMetaData,
    refreshItems,
    refreshLocations,
    refreshLogs,
    updateCategory,
    updateGroup,
    updateItem,
    updateLocation,
  }
}
