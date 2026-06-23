import type { InventoryLogInsert } from '~~/types/inventoryTypes'
import { describe, expect, it } from 'vitest'
import { toInventoryChangedFields } from '~~/utils/inventoryLogUtils'

describe('toInventoryChangedFields', () => {
  it('returns an empty array for non-array JSON values', () => {
    expect(toInventoryChangedFields(null)).toEqual([])
    expect(toInventoryChangedFields({ field: 'name' })).toEqual([])
  })

  it('keeps valid changed fields', () => {
    const changedFields: InventoryLogInsert['changed_fields'] = [
      { field: 'name', before: 'Old name', after: 'New name' },
      { field: 'quantity', before: 1, after: 2 },
      { field: 'low_stock_enabled', before: false, after: true },
      { field: 'note', before: null, after: 'New note' },
    ]

    expect(toInventoryChangedFields(changedFields)).toEqual(changedFields)
  })

  it('filters invalid changed fields', () => {
    const changedFields = [
      { field: 'name', before: 'Old name', after: 'New name' },
      { field: 'quantity', before: { value: 1 }, after: 2 },
      { field: 'note', before: null },
      null,
      'invalid',
    ] as InventoryLogInsert['changed_fields']

    expect(toInventoryChangedFields(changedFields)).toEqual([
      { field: 'name', before: 'Old name', after: 'New name' },
    ])
  })
})
