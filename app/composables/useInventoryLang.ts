export function useInventoryLang() {
  const { t } = useI18n()

  const created = () => t('data.toast.created')
  const deleted = () => t('data.toast.deleted')
  const updated = () => t('data.toast.updated')

  return {
    created,
    deleted,
    updated,
  }
}
