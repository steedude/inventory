import {
  createGroupOptions,
  createLocationOptions,
  createSubCategoryOptions,
} from '~~/config/inventorySelectConfig'

export function useInventorySelectOptions(inventory: ReturnType<typeof useInventoryData>) {
  const { t } = useI18n()

  const optionalSubCategoryOptions = computed(() => createSubCategoryOptions(
    t('data.form.noCategory'),
    inventory.subCategories.value,
  ))
  const locationOptions = computed(() => createLocationOptions(
    t('data.form.noLocation'),
    inventory.locations.value,
  ))
  const groupOptions = computed(() => createGroupOptions(
    t('data.form.noGroup'),
    inventory.groups.value,
  ))

  return {
    groupOptions,
    locationOptions,
    optionalSubCategoryOptions,
    subCategoryOptions: optionalSubCategoryOptions,
  }
}
