<script setup lang="ts">
import {
  InventoryDeleteTarget,
} from '~~/config/inventorySelectConfig'
import { createCategoryOptions } from '~~/utils/inventorySelectUtils'

definePageMeta({
  layout: 'dashboard',
})

const { locale, t } = useI18n()
const inventory = useInventoryData()
const appToast = useAppToast()
const { runSafely } = useSafeRun()

const mainCategoryName = ref('')
const subCategoryName = ref('')
const selectedMainCategoryId = ref<string>()
const locationName = ref('')
const groupName = ref('')
const deletingId = ref<string>()
const inUseDialogOpen = ref(false)
const pendingDelete = reactive<{
  id: string
  type: InventoryDeleteTarget | null
}>({
  id: '',
  type: null,
})

const editingCategory = reactive({
  id: '',
  name: '',
})

const editingLocation = reactive({
  id: '',
  name: '',
})

const editingGroup = reactive({
  id: '',
  name: '',
})

const creating = reactive({
  mainCategory: false,
  subCategory: false,
  location: false,
  group: false,
})

const saving = reactive({
  categoryId: '',
  locationId: '',
  groupId: '',
})

const categoryOptions = computed(() => createCategoryOptions(inventory.mainCategories.value))
const currentCategoryTitle = computed(() => locale.value === 'en' ? 'Category' : '分類')

const groupedCategories = computed(() => inventory.mainCategories.value.map(category => ({
  ...category,
  children: inventory.subCategories.value.filter(subCategory => subCategory.parent_id === category.id),
})))

function isEditingCategory(id: string) {
  return editingCategory.id === id
}

function isEditingLocation(id: string) {
  return editingLocation.id === id
}

function isEditingGroup(id: string) {
  return editingGroup.id === id
}

function isSavingCategory(id: string) {
  return saving.categoryId === id
}

function isSavingLocation(id: string) {
  return saving.locationId === id
}

function isSavingGroup(id: string) {
  return saving.groupId === id
}

function startEditCategory(id: string, name: string) {
  editingCategory.id = id
  editingCategory.name = name
}

function startEditLocation(id: string, name: string) {
  editingLocation.id = id
  editingLocation.name = name
}

function startEditGroup(id: string, name: string) {
  editingGroup.id = id
  editingGroup.name = name
}

function stopEditCategory() {
  editingCategory.id = ''
  editingCategory.name = ''
}

function stopEditLocation() {
  editingLocation.id = ''
  editingLocation.name = ''
}

function stopEditGroup() {
  editingGroup.id = ''
  editingGroup.name = ''
}

function categoryIsUsed(id: string) {
  return inventory.categories.value.some(category => category.parent_id === id)
    || inventory.items.value.some(item => item.category_id === id)
}

function locationIsUsed(id: string) {
  return inventory.items.value.some(item => item.location_id === id)
}

function groupIsUsed(id: string) {
  return inventory.items.value.some(item => item.group_id === id)
}

function showInUseDialog() {
  inUseDialogOpen.value = true
}

function showDeleteDialog(type: InventoryDeleteTarget, id: string) {
  pendingDelete.type = type
  pendingDelete.id = id
}

function closeDeleteDialog() {
  pendingDelete.type = null
  pendingDelete.id = ''
}

async function saveCategory() {
  const name = editingCategory.name.trim()

  if (editingCategory.id.length === 0 || name.length === 0 || saving.categoryId.length > 0) {
    return
  }

  saving.categoryId = editingCategory.id

  try {
    await runSafely(async () => {
      await inventory.updateCategory(editingCategory.id, { name })
      stopEditCategory()
      appToast.setSuccess(t('data.toast.updated'))
    })
  }
  finally {
    saving.categoryId = ''
  }
}

async function saveLocation() {
  const name = editingLocation.name.trim()

  if (editingLocation.id.length === 0 || name.length === 0 || saving.locationId.length > 0) {
    return
  }

  saving.locationId = editingLocation.id

  try {
    await runSafely(async () => {
      await inventory.updateLocation(editingLocation.id, { name })
      stopEditLocation()
      appToast.setSuccess(t('data.toast.updated'))
    })
  }
  finally {
    saving.locationId = ''
  }
}

async function saveGroup() {
  const name = editingGroup.name.trim()

  if (editingGroup.id.length === 0 || name.length === 0 || saving.groupId.length > 0) {
    return
  }

  saving.groupId = editingGroup.id

  try {
    await runSafely(async () => {
      await inventory.updateGroup(editingGroup.id, {
        name,
      })
      stopEditGroup()
      appToast.setSuccess(t('data.toast.updated'))
    })
  }
  finally {
    saving.groupId = ''
  }
}

async function deleteCategory(id: string) {
  if (categoryIsUsed(id)) {
    showInUseDialog()
    return
  }

  showDeleteDialog(InventoryDeleteTarget.Category, id)
}

async function deleteLocation(id: string) {
  if (locationIsUsed(id)) {
    showInUseDialog()
    return
  }

  showDeleteDialog(InventoryDeleteTarget.Location, id)
}

async function deleteGroup(id: string) {
  if (groupIsUsed(id)) {
    showInUseDialog()
    return
  }

  showDeleteDialog(InventoryDeleteTarget.Group, id)
}

async function confirmDelete() {
  if (pendingDelete.type === null || pendingDelete.id.length === 0) {
    return
  }

  const { id, type } = pendingDelete
  deletingId.value = id

  await runSafely(async () => {
    if (type === InventoryDeleteTarget.Category) {
      await inventory.deleteCategory(id)
    }

    if (type === InventoryDeleteTarget.Location) {
      await inventory.deleteLocation(id)
    }

    if (type === InventoryDeleteTarget.Group) {
      await inventory.deleteGroup(id)
    }

    appToast.setSuccess(t('data.toast.deleted'))
  })

  deletingId.value = undefined
  closeDeleteDialog()
}

async function submitMainCategory() {
  const name = mainCategoryName.value.trim()

  if (name.length === 0) {
    return
  }

  creating.mainCategory = true

  await runSafely(async () => {
    await inventory.createCategory({
      name,
    })
    mainCategoryName.value = ''
    appToast.setSuccess(t('data.toast.created'))
  })

  creating.mainCategory = false
}

async function submitSubCategory() {
  const name = subCategoryName.value.trim()

  if (name.length === 0 || selectedMainCategoryId.value === undefined) {
    return
  }

  creating.subCategory = true

  await runSafely(async () => {
    await inventory.createCategory({
      name,
      parent_id: selectedMainCategoryId.value,
    })
    subCategoryName.value = ''
    appToast.setSuccess(t('data.toast.created'))
  })

  creating.subCategory = false
}

async function submitLocation() {
  const name = locationName.value.trim()

  if (name.length === 0) {
    return
  }

  creating.location = true

  await runSafely(async () => {
    await inventory.createLocation({
      name,
    })
    locationName.value = ''
    appToast.setSuccess(t('data.toast.created'))
  })

  creating.location = false
}

async function submitGroup() {
  const name = groupName.value.trim()

  if (name.length === 0) {
    return
  }

  creating.group = true

  await runSafely(async () => {
    await inventory.createGroup({
      name,
    })
    groupName.value = ''
    appToast.setSuccess(t('data.toast.created'))
  })

  creating.group = false
}

onMounted(() => {
  void runSafely(async () => {
    await Promise.all([
      inventory.ensureItemMetaData(),
      inventory.ensureItems(),
    ])
  })
})

async function refreshPageData() {
  await Promise.all([
    inventory.refreshItemMetaData(),
    inventory.refreshItems(),
  ])
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
        {{ t('data.title') }}
      </h1>
      <p class="text-sm leading-6 text-muted">
        {{ t('data.description') }}
      </p>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <UCard class="app-surface">
        <template #header>
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('data.sections.category') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('data.sections.categoryDescription') }}
            </p>
          </div>
        </template>

        <div class="grid gap-4 lg:grid-cols-2">
          <form class="space-y-3" @submit.prevent="submitMainCategory">
            <UFormField :label="t('data.form.mainCategory')">
              <UInput
                v-model="mainCategoryName"
                class="w-full"
                :placeholder="t('data.form.mainCategoryPlaceholder')"
              />
            </UFormField>
            <UButton
              type="submit"
              icon="i-lucide-plus"
              :loading="creating.mainCategory"
            >
              {{ t('data.actions.createMainCategory') }}
            </UButton>
          </form>

          <form class="space-y-3" @submit.prevent="submitSubCategory">
            <UFormField :label="t('data.form.parentCategory')">
              <USelect
                v-model="selectedMainCategoryId"
                class="w-full"
                :items="categoryOptions"
                :placeholder="t('data.form.parentCategoryPlaceholder')"
              />
            </UFormField>
            <UFormField :label="t('data.form.subCategory')">
              <UInput
                v-model="subCategoryName"
                class="w-full"
                :placeholder="t('data.form.subCategoryPlaceholder')"
              />
            </UFormField>
            <UButton
              type="submit"
              icon="i-lucide-plus"
              :disabled="selectedMainCategoryId === undefined"
              :loading="creating.subCategory"
            >
              {{ t('data.actions.createSubCategory') }}
            </UButton>
          </form>
        </div>
      </UCard>

      <UCard class="app-surface">
        <template #header>
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('data.sections.meta') }}
            </h2>
            <p class="text-sm text-muted">
              {{ t('data.sections.metaDescription') }}
            </p>
          </div>
        </template>

        <div class="grid gap-4 lg:grid-cols-2">
          <form class="space-y-3" @submit.prevent="submitLocation">
            <UFormField :label="t('data.form.location')">
              <UInput
                v-model="locationName"
                class="w-full"
                :placeholder="t('data.form.locationPlaceholder')"
              />
            </UFormField>
            <UButton
              type="submit"
              icon="i-lucide-map-pin-plus"
              :loading="creating.location"
            >
              {{ t('data.actions.createLocation') }}
            </UButton>
          </form>

          <form class="space-y-3" @submit.prevent="submitGroup">
            <UFormField :label="t('data.form.group')">
              <UInput
                v-model="groupName"
                class="w-full"
                :placeholder="t('data.form.groupPlaceholder')"
              />
            </UFormField>
            <UButton
              type="submit"
              icon="i-lucide-layers-3"
              :loading="creating.group"
            >
              {{ t('data.actions.createGroup') }}
            </UButton>
          </form>
        </div>
      </UCard>
    </div>

    <div class="space-y-3">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-1">
          <h2 class="text-lg font-semibold tracking-normal text-highlighted">
            {{ t('data.sections.currentData') }}
          </h2>
          <p class="text-sm text-muted">
            {{ t('data.sections.currentDataDescription') }}
          </p>
        </div>
        <UButton
          variant="ghost"
          icon="i-lucide-refresh-cw"
          :loading="inventory.loading.value"
          @click="refreshPageData"
        >
          {{ t('data.actions.refresh') }}
        </UButton>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <UCard class="app-surface">
          <template #header>
            <h3 class="text-base font-semibold text-highlighted">
              {{ currentCategoryTitle }}
            </h3>
          </template>

          <div
            v-if="groupedCategories.length === 0 && inventory.subCategories.value.length === 0"
            class="py-6 text-center text-sm text-muted"
          >
            {{ t('data.emptyStates.categories') }}
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="category in groupedCategories"
              :key="category.id"
              class="app-list-row space-y-2 rounded-md p-3"
            >
              <div class="flex items-center justify-between gap-2">
                <div v-if="!isEditingCategory(category.id)" class="font-medium text-highlighted">
                  {{ category.name }}
                </div>
                <UInput
                  v-else
                  v-model="editingCategory.name"
                  class="min-w-0 flex-1"
                  :disabled="isSavingCategory(category.id)"
                />
                <div class="flex shrink-0 items-center gap-1">
                  <template v-if="isEditingCategory(category.id)">
                    <IconActionButton
                      icon="i-lucide-check"
                      tone="success"
                      :loading="isSavingCategory(category.id)"
                      :label="t('data.actions.save')"
                      @click="saveCategory"
                    />
                    <IconActionButton
                      icon="i-lucide-x"
                      :disabled="isSavingCategory(category.id)"
                      :label="t('data.actions.cancel')"
                      @click="stopEditCategory"
                    />
                  </template>
                  <template v-else>
                    <IconActionButton
                      icon="i-lucide-pencil"
                      :label="t('data.actions.edit')"
                      @click="startEditCategory(category.id, category.name)"
                    />
                    <IconActionButton
                      icon="i-lucide-trash-2"
                      tone="danger"
                      :loading="deletingId === category.id"
                      :label="t('data.actions.delete')"
                      @click="deleteCategory(category.id)"
                    />
                  </template>
                </div>
              </div>
              <div v-if="category.children.length > 0" class="space-y-2">
                <div
                  v-for="subCategory in category.children"
                  :key="subCategory.id"
                  class="flex items-center justify-between gap-2 rounded-md border border-default bg-elevated px-3 py-2"
                >
                  <div v-if="!isEditingCategory(subCategory.id)" class="text-sm font-medium text-highlighted">
                    {{ subCategory.name }}
                  </div>
                  <UInput
                    v-else
                    v-model="editingCategory.name"
                    class="min-w-0 flex-1"
                    :disabled="isSavingCategory(subCategory.id)"
                  />
                  <div class="flex shrink-0 items-center gap-1">
                    <template v-if="isEditingCategory(subCategory.id)">
                      <IconActionButton
                        icon="i-lucide-check"
                        tone="success"
                        :loading="isSavingCategory(subCategory.id)"
                        :label="t('data.actions.save')"
                        @click="saveCategory"
                      />
                      <IconActionButton
                        icon="i-lucide-x"
                        :disabled="isSavingCategory(subCategory.id)"
                        :label="t('data.actions.cancel')"
                        @click="stopEditCategory"
                      />
                    </template>
                    <template v-else>
                      <IconActionButton
                        icon="i-lucide-pencil"
                        :label="t('data.actions.edit')"
                        @click="startEditCategory(subCategory.id, subCategory.name)"
                      />
                      <IconActionButton
                        icon="i-lucide-trash-2"
                        tone="danger"
                        :loading="deletingId === subCategory.id"
                        :label="t('data.actions.delete')"
                        @click="deleteCategory(subCategory.id)"
                      />
                    </template>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-muted">
                {{ t('data.emptyStates.subCategories') }}
              </div>
            </div>
          </div>
        </UCard>

        <UCard class="app-surface">
          <template #header>
            <h3 class="text-base font-semibold text-highlighted">
              {{ t('data.form.location') }}
            </h3>
          </template>

          <div v-if="inventory.locations.value.length === 0" class="py-6 text-center text-sm text-muted">
            {{ t('data.emptyStates.locations') }}
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="location in inventory.locations.value"
              :key="location.id"
              class="app-list-row flex items-center justify-between gap-2 rounded-md px-3 py-2"
            >
              <div v-if="!isEditingLocation(location.id)" class="text-sm font-medium text-highlighted">
                {{ location.name }}
              </div>
              <UInput
                v-else
                v-model="editingLocation.name"
                class="min-w-0 flex-1"
                :disabled="isSavingLocation(location.id)"
              />
              <div class="flex shrink-0 items-center gap-1">
                <template v-if="isEditingLocation(location.id)">
                  <IconActionButton
                    icon="i-lucide-check"
                    tone="success"
                    :loading="isSavingLocation(location.id)"
                    :label="t('data.actions.save')"
                    @click="saveLocation"
                  />
                  <IconActionButton
                    icon="i-lucide-x"
                    :disabled="isSavingLocation(location.id)"
                    :label="t('data.actions.cancel')"
                    @click="stopEditLocation"
                  />
                </template>
                <template v-else>
                  <IconActionButton
                    icon="i-lucide-pencil"
                    :label="t('data.actions.edit')"
                    @click="startEditLocation(location.id, location.name)"
                  />
                  <IconActionButton
                    icon="i-lucide-trash-2"
                    tone="danger"
                    :loading="deletingId === location.id"
                    :label="t('data.actions.delete')"
                    @click="deleteLocation(location.id)"
                  />
                </template>
              </div>
            </div>
          </div>
        </UCard>

        <UCard class="app-surface">
          <template #header>
            <h3 class="text-base font-semibold text-highlighted">
              {{ t('data.form.group') }}
            </h3>
          </template>

          <div v-if="inventory.groups.value.length === 0" class="py-6 text-center text-sm text-muted">
            {{ t('data.emptyStates.groups') }}
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="group in inventory.groups.value"
              :key="group.id"
              class="app-list-row space-y-2 rounded-md px-3 py-2"
            >
              <div class="flex items-start justify-between gap-2">
                <div v-if="!isEditingGroup(group.id)" class="min-w-0">
                  <div class="text-sm font-medium text-highlighted">
                    {{ group.name }}
                  </div>
                </div>
                <div v-else class="min-w-0 flex-1">
                  <UInput
                    v-model="editingGroup.name"
                    class="w-full"
                    :disabled="isSavingGroup(group.id)"
                  />
                </div>
                <div class="flex shrink-0 items-center gap-1">
                  <template v-if="isEditingGroup(group.id)">
                    <IconActionButton
                      icon="i-lucide-check"
                      tone="success"
                      :loading="isSavingGroup(group.id)"
                      :label="t('data.actions.save')"
                      @click="saveGroup"
                    />
                    <IconActionButton
                      icon="i-lucide-x"
                      :disabled="isSavingGroup(group.id)"
                      :label="t('data.actions.cancel')"
                      @click="stopEditGroup"
                    />
                  </template>
                  <template v-else>
                    <IconActionButton
                      icon="i-lucide-pencil"
                      :label="t('data.actions.edit')"
                      @click="startEditGroup(group.id, group.name)"
                    />
                    <IconActionButton
                      icon="i-lucide-trash-2"
                      tone="danger"
                      :loading="deletingId === group.id"
                      :label="t('data.actions.delete')"
                      @click="deleteGroup(group.id)"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <div
      v-if="inUseDialogOpen"
      class="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
    >
      <UCard class="w-full max-w-sm">
        <div class="space-y-4">
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-highlighted">
              {{ t('data.dialog.inUseTitle') }}
            </h2>
            <p class="text-sm leading-6 text-muted">
              {{ t('data.dialog.inUse') }}
            </p>
          </div>
          <div class="flex justify-end">
            <UButton @click="inUseDialogOpen = false">
              {{ t('data.actions.close') }}
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <div
      v-if="pendingDelete.type !== null"
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
              :loading="deletingId === pendingDelete.id"
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
