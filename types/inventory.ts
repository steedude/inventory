import type { Database } from './database'

export type InventoryCategory = Database['public']['Tables']['categories']['Row']
export type InventoryCategoryUpdate = Database['public']['Tables']['categories']['Update']
export type InventoryGroup = Database['public']['Tables']['item_groups']['Row']
export type InventoryGroupUpdate = Database['public']['Tables']['item_groups']['Update']
export type InventoryItem = Database['public']['Tables']['items']['Row']
export type InventoryItemInsert = Database['public']['Tables']['items']['Insert']
export type InventoryItemUpdate = Database['public']['Tables']['items']['Update']
export type InventoryLocation = Database['public']['Tables']['locations']['Row']
export type InventoryLocationUpdate = Database['public']['Tables']['locations']['Update']
