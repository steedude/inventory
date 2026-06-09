import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database'
import type {
  InventoryCategory,
  InventoryCategoryUpdate,
  InventoryGroup,
  InventoryGroupUpdate,
  InventoryItem,
  InventoryItemInsert,
  InventoryItemUpdate,
  InventoryLocation,
  InventoryLocationUpdate,
} from '../../types/inventory'

export function useInventoryData() {
  const auth = useAuthStore()
  const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient<Database> }

  const categories = ref<InventoryCategory[]>([])
  const groups = ref<InventoryGroup[]>([])
  const items = ref<InventoryItem[]>([])
  const locations = ref<InventoryLocation[]>([])
  const loading = ref(false)

  const mainCategories = computed(() => categories.value.filter(category => category.parent_id === null))
  const subCategories = computed(() => categories.value.filter(category => category.parent_id !== null))

  const requireUserId = () => {
    const userId = auth.user?.id

    if (userId === undefined) {
      throw new Error('Missing signed-in user.')
    }

    return userId
  }

  const emptyToNull = (value: string) => {
    const trimmedValue = value.trim()
    return trimmedValue.length > 0 ? trimmedValue : null
  }

  const findName = (records: Array<{ id: string, name: string }>, id: string | null) => {
    if (id === null) {
      return '-'
    }

    return records.find(record => record.id === id)?.name ?? '-'
  }

  const getCategoryName = (id: string | null) => findName(categories.value, id)
  const getGroupName = (id: string | null) => findName(groups.value, id)
  const getLocationName = (id: string | null) => findName(locations.value, id)
  const findItemByBarcode = (barcode: string) => {
    const trimmedBarcode = barcode.trim()

    if (trimmedBarcode.length === 0) {
      return undefined
    }

    return items.value.find(item => item.barcode === trimmedBarcode)
  }

  const fetchCategories = async () => {
    const { data, error } = await $supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })

    if (error !== null) {
      throw error
    }

    categories.value = data ?? []
  }

  const fetchGroups = async () => {
    const { data, error } = await $supabase
      .from('item_groups')
      .select('*')
      .order('created_at', { ascending: true })

    if (error !== null) {
      throw error
    }

    groups.value = data ?? []
  }

  const fetchItems = async () => {
    const { data, error } = await $supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error !== null) {
      throw error
    }

    items.value = data ?? []
  }

  const fetchItem = async (id: string) => {
    const { data, error } = await $supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single()

    if (error !== null) {
      throw error
    }

    return data
  }

  const fetchLocations = async () => {
    const { data, error } = await $supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: true })

    if (error !== null) {
      throw error
    }

    locations.value = data ?? []
  }

  const fetchAll = async () => {
    loading.value = true

    try {
      await Promise.all([
        fetchCategories(),
        fetchGroups(),
        fetchItems(),
        fetchLocations(),
      ])
    }
    finally {
      loading.value = false
    }
  }

  const createCategory = async (name: string, parentId: string | null = null) => {
    const { error } = await $supabase
      .from('categories')
      .insert({
        user_id: requireUserId(),
        parent_id: parentId,
        name,
      })

    if (error !== null) {
      throw error
    }

    await fetchCategories()
  }

  const updateCategory = async (id: string, payload: InventoryCategoryUpdate) => {
    const { error } = await $supabase
      .from('categories')
      .update(payload)
      .eq('id', id)

    if (error !== null) {
      throw error
    }

    await fetchCategories()
  }

  const deleteCategory = async (id: string) => {
    const { error } = await $supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error !== null) {
      throw error
    }

    await fetchCategories()
  }

  const createGroup = async (name: string, categoryId: string | null = null) => {
    const { error } = await $supabase
      .from('item_groups')
      .insert({
        user_id: requireUserId(),
        category_id: categoryId,
        name,
      })

    if (error !== null) {
      throw error
    }

    await fetchGroups()
  }

  const updateGroup = async (id: string, payload: InventoryGroupUpdate) => {
    const { error } = await $supabase
      .from('item_groups')
      .update(payload)
      .eq('id', id)

    if (error !== null) {
      throw error
    }

    await fetchGroups()
  }

  const deleteGroup = async (id: string) => {
    const { error } = await $supabase
      .from('item_groups')
      .delete()
      .eq('id', id)

    if (error !== null) {
      throw error
    }

    await fetchGroups()
  }

  const createItem = async (payload: Omit<InventoryItemInsert, 'user_id'>) => {
    const { error } = await $supabase
      .from('items')
      .insert({
        ...payload,
        user_id: requireUserId(),
      })

    if (error !== null) {
      throw error
    }

    await fetchItems()
  }

  const updateItem = async (id: string, payload: InventoryItemUpdate) => {
    const { error } = await $supabase
      .from('items')
      .update(payload)
      .eq('id', id)

    if (error !== null) {
      throw error
    }

    await fetchItems()
  }

  const deleteItem = async (id: string) => {
    const { error } = await $supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error !== null) {
      throw error
    }

    await fetchItems()
  }

  const createLocation = async (name: string) => {
    const { error } = await $supabase
      .from('locations')
      .insert({
        user_id: requireUserId(),
        name,
      })

    if (error !== null) {
      throw error
    }

    await fetchLocations()
  }

  const updateLocation = async (id: string, payload: InventoryLocationUpdate) => {
    const { error } = await $supabase
      .from('locations')
      .update(payload)
      .eq('id', id)

    if (error !== null) {
      throw error
    }

    await fetchLocations()
  }

  const deleteLocation = async (id: string) => {
    const { error } = await $supabase
      .from('locations')
      .delete()
      .eq('id', id)

    if (error !== null) {
      throw error
    }

    await fetchLocations()
  }

  return {
    categories,
    groups,
    items,
    locations,
    loading,
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
    fetchAll,
    fetchItem,
    findItemByBarcode,
    getCategoryName,
    getGroupName,
    getLocationName,
    updateItem,
    updateCategory,
    updateGroup,
    updateLocation,
  }
}
