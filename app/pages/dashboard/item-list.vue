<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const inventory = useInventoryData()
const appToast = useAppToast()
const { runSafely } = useSafeRun()
const deletingId = ref<string>()
const pendingDeleteId = ref<string>()

async function deleteItem(id: string) {
  pendingDeleteId.value = id
}

function closeDeleteDialog() {
  pendingDeleteId.value = undefined
}

async function confirmDelete() {
  if (pendingDeleteId.value === undefined) {
    return
  }

  const id = pendingDeleteId.value
  deletingId.value = id

  await runSafely(async () => {
    await inventory.deleteItem(id)
    appToast.setSuccess(t('data.toast.deleted'))
  })

  deletingId.value = undefined
  closeDeleteDialog()
}

onMounted(() => {
  void runSafely(inventory.fetchAll)
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <div class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
          {{ t('data.pages.itemList') }}
        </h1>
        <p class="text-sm leading-6 text-muted">
          {{ t('data.sections.listDescription') }}
        </p>
      </div>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('data.sections.list') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('data.sections.listDescription') }}
            </p>
          </div>
          <UButton
            variant="ghost"
            icon="i-lucide-refresh-cw"
            :loading="inventory.loading.value"
            @click="inventory.fetchAll"
          >
            {{ t('data.actions.refresh') }}
          </UButton>
        </div>
      </template>

      <div v-if="inventory.items.value.length === 0" class="py-8 text-center text-sm text-muted">
        {{ t('data.empty') }}
      </div>

      <div v-else class="grid gap-3">
        <div
          v-for="item in inventory.items.value"
          :key="item.id"
          class="grid gap-3 rounded-md border border-default p-4 lg:grid-cols-[minmax(0,1fr)_120px_160px_160px_auto]"
        >
          <div class="space-y-1">
            <div class="font-medium text-highlighted">
              {{ item.name }}
            </div>
            <div class="text-sm text-muted">
              {{ item.note ?? t('data.form.noNote') }}
            </div>
          </div>
          <div class="space-y-1 text-sm">
            <div class="text-muted">
              {{ t('data.form.quantity') }}
            </div>
            <div class="font-medium text-highlighted">
              {{ item.quantity }}
            </div>
          </div>
          <div class="space-y-1 text-sm">
            <div class="text-muted">
              {{ t('data.form.subCategory') }}
            </div>
            <div class="font-medium text-highlighted">
              {{ inventory.getCategoryName(item.category_id) }}
            </div>
          </div>
          <div class="space-y-1 text-sm">
            <div class="text-muted">
              {{ t('data.form.group') }}
            </div>
            <div class="font-medium text-highlighted">
              {{ inventory.getGroupName(item.group_id) }}
            </div>
          </div>
          <div class="space-y-1 text-sm lg:col-start-3">
            <div class="text-muted">
              {{ t('data.form.location') }}
            </div>
            <div class="font-medium text-highlighted">
              {{ inventory.getLocationName(item.location_id) }}
            </div>
          </div>
          <div class="space-y-1 text-sm">
            <div class="text-muted">
              {{ t('data.form.barcode') }}
            </div>
            <div class="font-medium text-highlighted">
              {{ item.barcode ?? '-' }}
            </div>
          </div>
          <div class="flex items-start justify-end gap-1 lg:row-span-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-pencil"
              :to="`/dashboard/item-edit/${item.id}`"
              :aria-label="t('data.actions.editItem')"
            />
            <UButton
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              :loading="deletingId === item.id"
              :aria-label="t('data.actions.delete')"
              @click="deleteItem(item.id)"
            />
          </div>
        </div>
      </div>
    </UCard>

    <div
      v-if="pendingDeleteId !== undefined"
      class="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
    >
      <UCard class="w-full max-w-sm">
        <div class="space-y-4">
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('data.dialog.confirmDeleteTitle') }}
            </h2>
            <p class="text-sm leading-6 text-muted">
              {{ t('data.dialog.confirmDelete') }}
            </p>
          </div>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="closeDeleteDialog">
              {{ t('data.actions.cancel') }}
            </UButton>
            <UButton
              color="error"
              :loading="deletingId === pendingDeleteId"
              @click="confirmDelete"
            >
              {{ t('data.actions.delete') }}
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
