import type { Database } from '~~/types/databaseTypes'

export type InventoryCategory = Database['public']['Tables']['categories']['Row']
export type InventoryCategoryInsert = Database['public']['Tables']['categories']['Insert']
export type InventoryCategoryUpdate = Database['public']['Tables']['categories']['Update']
export type InventoryGroup = Database['public']['Tables']['item_groups']['Row']
export type InventoryGroupInsert = Database['public']['Tables']['item_groups']['Insert']
export type InventoryGroupUpdate = Database['public']['Tables']['item_groups']['Update']
export type InventoryItem = Database['public']['Tables']['items']['Row']
export type InventoryItemInsert = Database['public']['Tables']['items']['Insert']
export type InventoryItemUpdate = Database['public']['Tables']['items']['Update']
export type InventoryLocation = Database['public']['Tables']['locations']['Row']
export type InventoryLocationInsert = Database['public']['Tables']['locations']['Insert']
export type InventoryLocationUpdate = Database['public']['Tables']['locations']['Update']

export type InventoryNameRecord = Pick<InventoryCategory, 'id' | 'name'>

export interface InventorySelectOption {
  label: string
  value: string
}

export type InventorySelectModelValue = string

export interface InventoryItemFormState {
  name: string
  quantity: number
  image_url: string
  location_id: InventorySelectModelValue
  note: string
  barcode: string
  category_id: InventorySelectModelValue
  group_id: InventorySelectModelValue
}

export type CreateInventoryCategoryPayload = Omit<InventoryCategoryInsert, 'user_id'>
export type UpdateInventoryCategoryPayload = InventoryCategoryUpdate
export type CreateInventoryGroupPayload = Omit<InventoryGroupInsert, 'user_id'>
export type UpdateInventoryGroupPayload = InventoryGroupUpdate
export type CreateInventoryItemPayload = Omit<InventoryItemInsert, 'user_id'>
export type UpdateInventoryItemPayload = InventoryItemUpdate
export type CreateInventoryLocationPayload = Omit<InventoryLocationInsert, 'user_id'>
export type UpdateInventoryLocationPayload = InventoryLocationUpdate
