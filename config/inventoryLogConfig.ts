export enum InventoryLogType {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export const inventoryLogFields = [
  'name',
  'quantity',
  'min_quantity',
  'low_stock_enabled',
  'image_url',
  'barcode',
  'note',
  'category_id',
  'group_id',
  'location_id',
] as const
