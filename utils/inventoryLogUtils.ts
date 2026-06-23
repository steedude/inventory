import type {
  InventoryChangedField,
  InventoryItem,
  InventoryLogInsert,
} from '~~/types/inventoryTypes'
import { inventoryLogFields } from '~~/config/inventoryLogConfig'

export function createInventoryChangedFields(
  beforeItem: Partial<InventoryItem> | null,
  afterItem: Partial<InventoryItem> | null,
): InventoryChangedField[] {
  return inventoryLogFields.flatMap((field) => {
    const before = beforeItem?.[field] ?? null
    const after = afterItem?.[field] ?? null

    if (before === after) {
      return []
    }

    return [{
      field,
      before,
      after,
    }]
  })
}

export function toInventoryChangedFields(value: InventoryLogInsert['changed_fields']): InventoryChangedField[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((field) => {
    if (!isInventoryChangedField(field)) {
      return []
    }

    return [field]
  })
}

function isInventoryChangedField(value: unknown): value is InventoryChangedField {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const field = value as Partial<InventoryChangedField>

  return typeof field.field === 'string'
    && isInventoryChangedFieldValue(field.before)
    && isInventoryChangedFieldValue(field.after)
}

function isInventoryChangedFieldValue(value: unknown): value is InventoryChangedField['before'] {
  return value === null
    || typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
}
