import type {
  InventoryCategory,
  InventoryGroup,
  InventoryLocation,
  InventorySelectOption,
} from '~~/types/inventoryTypes'
import { InventorySelectValue } from '~~/config/inventorySelectConfig'

export function createCategoryOptions(categories: InventoryCategory[]): InventorySelectOption[] {
  return categories.map(category => ({
    label: category.name,
    value: category.id,
  }))
}

export function createSubCategoryOptions(
  noCategoryLabel: string,
  categories: InventoryCategory[],
): InventorySelectOption[] {
  return [
    {
      label: noCategoryLabel,
      value: InventorySelectValue.None,
    },
    ...createCategoryOptions(categories),
  ]
}

export function createLocationOptions(
  noLocationLabel: string,
  locations: InventoryLocation[],
): InventorySelectOption[] {
  return [
    {
      label: noLocationLabel,
      value: InventorySelectValue.None,
    },
    ...locations.map(location => ({
      label: location.name,
      value: location.id,
    })),
  ]
}

export function createGroupOptions(
  noGroupLabel: string,
  groups: InventoryGroup[],
): InventorySelectOption[] {
  return [
    {
      label: noGroupLabel,
      value: InventorySelectValue.None,
    },
    ...groups.map(group => ({
      label: group.name,
      value: group.id,
    })),
  ]
}

export function selectToNull(value: string | undefined) {
  return value !== undefined && value !== InventorySelectValue.None ? value : null
}

export function nullToSelect(value: string | null) {
  return value ?? InventorySelectValue.None
}
