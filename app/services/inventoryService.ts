import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/types/databaseTypes'
import type {
  CreateInventoryCategoryPayload,
  CreateInventoryGroupPayload,
  CreateInventoryItemPayload,
  CreateInventoryLocationPayload,
  InventoryLog,
  InventoryLogInsert,
  UpdateInventoryCategoryPayload,
  UpdateInventoryGroupPayload,
  UpdateInventoryItemPayload,
  UpdateInventoryLocationPayload,
} from '~~/types/inventoryTypes'
import { toInventoryChangedFields } from '~~/utils/inventoryLogUtils'

type InventorySupabaseClient = SupabaseClient<Database>

export function createInventoryService(supabase: InventorySupabaseClient) {
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })

    if (error !== null) {
      throw error
    }

    return data ?? []
  }

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from('item_groups')
      .select('*')
      .order('created_at', { ascending: true })

    if (error !== null) {
      throw error
    }

    return data ?? []
  }

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error !== null) {
      throw error
    }

    return data ?? []
  }

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: true })

    if (error !== null) {
      throw error
    }

    return data ?? []
  }

  const fetchLogs = async (): Promise<InventoryLog[]> => {
    const { data, error } = await supabase
      .from('inventory_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error !== null) {
      throw error
    }

    return (data ?? []).map(log => ({
      ...log,
      changed_fields: toInventoryChangedFields(log.changed_fields),
    }))
  }

  const fetchItem = async (id: string) => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single()

    if (error !== null) {
      throw error
    }

    return data
  }

  const createLog = async (payload: InventoryLogInsert) => {
    const { error } = await supabase
      .from('inventory_logs')
      .insert(payload)

    if (error !== null) {
      throw error
    }
  }

  const createCategory = async (payload: CreateInventoryCategoryPayload & { user_id: string }) => {
    const { error } = await supabase
      .from('categories')
      .insert(payload)

    if (error !== null) {
      throw error
    }
  }

  const updateCategory = async (id: string, payload: UpdateInventoryCategoryPayload) => {
    const { error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)

    if (error !== null) {
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error !== null) {
      throw error
    }
  }

  const createGroup = async (payload: CreateInventoryGroupPayload & { user_id: string }) => {
    const { error } = await supabase
      .from('item_groups')
      .insert(payload)

    if (error !== null) {
      throw error
    }
  }

  const updateGroup = async (id: string, payload: UpdateInventoryGroupPayload) => {
    const { error } = await supabase
      .from('item_groups')
      .update(payload)
      .eq('id', id)

    if (error !== null) {
      throw error
    }
  }

  const deleteGroup = async (id: string) => {
    const { error } = await supabase
      .from('item_groups')
      .delete()
      .eq('id', id)

    if (error !== null) {
      throw error
    }
  }

  const createItem = async (payload: CreateInventoryItemPayload & { user_id: string }) => {
    const { data, error } = await supabase
      .from('items')
      .insert(payload)
      .select('*')
      .single()

    if (error !== null) {
      throw error
    }

    return data
  }

  const updateItem = async (id: string, payload: UpdateInventoryItemPayload) => {
    const { data, error } = await supabase
      .from('items')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single()

    if (error !== null) {
      throw error
    }

    return data
  }

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error !== null) {
      throw error
    }
  }

  const createLocation = async (payload: CreateInventoryLocationPayload & { user_id: string }) => {
    const { error } = await supabase
      .from('locations')
      .insert(payload)

    if (error !== null) {
      throw error
    }
  }

  const updateLocation = async (id: string, payload: UpdateInventoryLocationPayload) => {
    const { error } = await supabase
      .from('locations')
      .update(payload)
      .eq('id', id)

    if (error !== null) {
      throw error
    }
  }

  const deleteLocation = async (id: string) => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id)

    if (error !== null) {
      throw error
    }
  }

  return {
    createCategory,
    createGroup,
    createItem,
    createLocation,
    createLog,
    deleteCategory,
    deleteGroup,
    deleteItem,
    deleteLocation,
    fetchCategories,
    fetchGroups,
    fetchItem,
    fetchItems,
    fetchLocations,
    fetchLogs,
    updateCategory,
    updateGroup,
    updateItem,
    updateLocation,
  }
}
