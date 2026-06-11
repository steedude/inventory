<script setup lang="ts">
import type { InventoryItem } from '~~/types/inventoryTypes'
import { InventoryListViewMode } from '~~/config/inventoryDisplayConfig'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const inventory = useInventoryData()
const appToast = useAppToast()
const { runSafely } = useSafeRun()
const deletingId = ref<string>()
const pendingDeleteId = ref<string>()
const viewMode = ref<InventoryListViewMode>(InventoryListViewMode.List)
const previewImage = ref<{
  alt: string
  url: string
}>()

const viewModeOptions = computed(() => [
  {
    icon: 'i-lucide-list',
    label: t('data.viewMode.list'),
    value: InventoryListViewMode.List,
  },
  {
    icon: 'i-lucide-layout-grid',
    label: t('data.viewMode.card'),
    value: InventoryListViewMode.Card,
  },
])

function hasImage(item: InventoryItem) {
  return item.image_url !== null && item.image_url.length > 0
}

function openImagePreview(item: InventoryItem) {
  if (!hasImage(item)) {
    return
  }

  previewImage.value = {
    alt: item.name,
    url: item.image_url ?? '',
  }
}

function closeImagePreview() {
  previewImage.value = undefined
}

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
      <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
        {{ t('data.pages.itemList') }}
      </h1>
      <p class="text-sm leading-6 text-muted">
        {{ t('data.sections.listDescription') }}
      </p>
    </div>

    <UCard>
      <template #header>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('data.sections.list') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('data.sections.listDescription') }}
            </p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div class="grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
              <UButton
                v-for="option in viewModeOptions"
                :key="option.value"
                :color="viewMode === option.value ? 'primary' : 'neutral'"
                :variant="viewMode === option.value ? 'solid' : 'ghost'"
                :icon="option.icon"
                size="sm"
                class="justify-center whitespace-nowrap"
                @click="viewMode = option.value"
              >
                {{ option.label }}
              </UButton>
            </div>
            <UButton
              variant="ghost"
              icon="i-lucide-refresh-cw"
              class="justify-center whitespace-nowrap"
              :loading="inventory.loading.value"
              @click="inventory.fetchAll"
            >
              {{ t('data.actions.refresh') }}
            </UButton>
          </div>
        </div>
      </template>

      <div v-if="inventory.items.value.length === 0" class="py-8 text-center text-sm text-muted">
        {{ t('data.empty') }}
      </div>

      <div
        v-else-if="viewMode === InventoryListViewMode.Card"
        class="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="item in inventory.items.value"
          :key="item.id"
          class="grid gap-3 rounded-md border border-default p-3"
        >
          <button
            v-if="hasImage(item)"
            type="button"
            class="aspect-[4/3] overflow-hidden rounded-md border border-default"
            @click="openImagePreview(item)"
          >
            <img
              :src="item.image_url ?? ''"
              :alt="item.name"
              class="h-full w-full object-cover"
            >
          </button>
          <div
            v-else
            class="grid aspect-[4/3] place-items-center rounded-md border border-dashed border-default bg-muted/30 text-muted"
          >
            <UIcon name="i-lucide-image" class="size-8" />
          </div>

          <div class="min-w-0 space-y-1">
            <div class="break-words font-medium text-highlighted">
              {{ item.name }}
            </div>
            <div class="break-words text-sm text-muted">
              {{ item.note ?? t('data.form.noNote') }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="rounded-md bg-muted/40 p-2">
              <div class="text-xs text-muted">
                {{ t('data.form.quantity') }}
              </div>
              <div class="font-medium text-highlighted">
                {{ item.quantity }}
              </div>
            </div>
            <div class="rounded-md bg-muted/40 p-2">
              <div class="text-xs text-muted">
                {{ t('data.form.location') }}
              </div>
              <div class="break-words font-medium text-highlighted">
                {{ inventory.getLocationName(item.location_id) }}
              </div>
            </div>
            <div class="rounded-md bg-muted/40 p-2">
              <div class="text-xs text-muted">
                {{ t('data.form.mainCategory') }}
              </div>
              <div class="break-words font-medium text-highlighted">
                {{ inventory.getMainCategoryName(item.category_id) }}
              </div>
            </div>
            <div class="rounded-md bg-muted/40 p-2">
              <div class="text-xs text-muted">
                {{ t('data.form.subCategory') }}
              </div>
              <div class="break-words font-medium text-highlighted">
                {{ inventory.getCategoryName(item.category_id) }}
              </div>
            </div>
            <div class="rounded-md bg-muted/40 p-2">
              <div class="text-xs text-muted">
                {{ t('data.form.group') }}
              </div>
              <div class="break-words font-medium text-highlighted">
                {{ inventory.getGroupName(item.group_id) }}
              </div>
            </div>
            <div class="rounded-md bg-muted/40 p-2">
              <div class="text-xs text-muted">
                {{ t('data.form.barcode') }}
              </div>
              <div class="break-words font-medium text-highlighted">
                {{ item.barcode ?? '-' }}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-1 border-t border-default pt-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-pencil"
              size="sm"
              :to="`/dashboard/item-edit/${item.id}`"
              :aria-label="t('data.actions.editItem')"
            />
            <UButton
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              size="sm"
              :loading="deletingId === item.id"
              :aria-label="t('data.actions.delete')"
              @click="deleteItem(item.id)"
            />
          </div>
        </article>
      </div>

      <div v-else class="grid gap-3">
        <article
          v-for="item in inventory.items.value"
          :key="item.id"
          class="flex min-w-0 items-center gap-3 rounded-md border border-default p-3"
        >
          <button
            v-if="hasImage(item)"
            type="button"
            class="size-14 shrink-0 overflow-hidden rounded-md border border-default"
            @click="openImagePreview(item)"
          >
            <img
              :src="item.image_url ?? ''"
              :alt="item.name"
              class="h-full w-full object-cover"
            >
          </button>
          <div
            v-else
            class="grid size-14 shrink-0 place-items-center rounded-md border border-dashed border-default bg-muted/30 text-muted"
          >
            <UIcon name="i-lucide-image" class="size-5" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="truncate font-medium text-highlighted">
              {{ item.name }}
            </div>
            <div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
              <span>{{ t('data.form.quantity') }}: {{ item.quantity }}</span>
              <span>{{ inventory.getMainCategoryName(item.category_id) }}</span>
              <span>{{ inventory.getCategoryName(item.category_id) }}</span>
              <span>{{ inventory.getGroupName(item.group_id) }}</span>
              <span>{{ inventory.getLocationName(item.location_id) }}</span>
              <span>{{ item.barcode ?? '-' }}</span>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-pencil"
              size="sm"
              :to="`/dashboard/item-edit/${item.id}`"
              :aria-label="t('data.actions.editItem')"
            />
            <UButton
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              size="sm"
              :loading="deletingId === item.id"
              :aria-label="t('data.actions.delete')"
              @click="deleteItem(item.id)"
            />
          </div>
        </article>
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

    <div
      v-if="previewImage !== undefined"
      class="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-6"
      @click.self="closeImagePreview"
    >
      <div class="w-full max-w-3xl space-y-3">
        <div class="flex justify-end">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-x"
            :aria-label="t('data.actions.close')"
            @click="closeImagePreview"
          />
        </div>
        <img
          :src="previewImage.url"
          :alt="previewImage.alt"
          class="mx-auto max-h-[80vh] max-w-full rounded-md border border-default object-contain"
        >
      </div>
    </div>
  </div>
</template>
