import type {
  InventoryItem,
  InventoryNameRecord,
} from '~~/types/inventoryTypes'

export function emptyToNull(value: string) {
  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : null
}

export function findInventoryName(records: InventoryNameRecord[], id: string | null) {
  if (id === null) {
    return '-'
  }

  return records.find(record => record.id === id)?.name ?? '-'
}

export function findInventoryItemByBarcode(items: InventoryItem[], barcode: string) {
  const trimmedBarcode = barcode.trim()

  if (trimmedBarcode.length === 0) {
    return undefined
  }

  return items.find(item => item.barcode === trimmedBarcode)
}
