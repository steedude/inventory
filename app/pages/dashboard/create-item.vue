<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const route = useRoute()
const inventory = useInventoryData()
const appToast = useAppToast()
const emptySelectValue = '__none__'

const creating = ref(false)

const itemForm = reactive({
  name: '',
  quantity: 0,
  image_url: '',
  location_id: emptySelectValue,
  note: '',
  barcode: '',
  category_id: emptySelectValue,
  group_id: emptySelectValue,
})

const subCategoryOptions = computed(() => [
  {
    label: t('data.form.noCategory'),
    value: emptySelectValue,
  },
  ...inventory.subCategories.value.map(category => ({
    label: category.name,
    value: category.id,
  })),
])

const locationOptions = computed(() => [
  {
    label: t('data.form.noLocation'),
    value: emptySelectValue,
  },
  ...inventory.locations.value.map(location => ({
    label: location.name,
    value: location.id,
  })),
])

const groupOptions = computed(() => [
  {
    label: t('data.form.noGroup'),
    value: emptySelectValue,
  },
  ...inventory.groups.value.map(group => ({
    label: group.name,
    value: group.id,
  })),
])

function selectToNull(value: string | undefined) {
  return value !== undefined && value !== emptySelectValue ? value : null
}

async function safelyRun(action: () => Promise<void>) {
  try {
    await action()
  }
  catch (error) {
    appToast.setError(error)
  }
}

async function submitItem() {
  const name = itemForm.name.trim()

  if (name.length === 0) {
    return
  }

  creating.value = true

  await safelyRun(async () => {
    await inventory.createItem({
      name,
      quantity: itemForm.quantity,
      image_url: inventory.emptyToNull(itemForm.image_url),
      location_id: selectToNull(itemForm.location_id),
      note: inventory.emptyToNull(itemForm.note),
      barcode: inventory.emptyToNull(itemForm.barcode),
      category_id: selectToNull(itemForm.category_id),
      group_id: selectToNull(itemForm.group_id),
    })

    itemForm.name = ''
    itemForm.quantity = 0
    itemForm.image_url = ''
    itemForm.location_id = emptySelectValue
    itemForm.note = ''
    itemForm.barcode = ''
    itemForm.category_id = emptySelectValue
    itemForm.group_id = emptySelectValue
    appToast.setSuccess('data.toast.created')
  })

  creating.value = false
}

onMounted(() => {
  const barcodeQuery = route.query.barcode

  if (typeof barcodeQuery === 'string') {
    itemForm.barcode = barcodeQuery
  }

  void safelyRun(inventory.fetchAll)
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <div class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-normal text-highlighted">
          {{ t('data.pages.createItem') }}
        </h1>
        <p class="text-sm leading-6 text-muted">
          {{ t('data.sections.itemDescription') }}
        </p>
      </div>
    </div>

    <UCard>
      <form class="grid gap-4 lg:grid-cols-4" @submit.prevent="submitItem">
        <UFormField :label="t('data.form.itemName')" class="lg:col-span-2">
          <UInput
            v-model="itemForm.name"
            class="w-full"
            :placeholder="t('data.form.itemNamePlaceholder')"
          />
        </UFormField>
        <UFormField :label="t('data.form.quantity')">
          <UInputNumber v-model="itemForm.quantity" class="w-full" :min="0" />
        </UFormField>
        <UFormField :label="t('data.form.barcode')">
          <UInput
            v-model="itemForm.barcode"
            class="w-full"
            :placeholder="t('data.form.barcodePlaceholder')"
          />
        </UFormField>
        <UFormField :label="t('data.form.subCategory')">
          <USelect v-model="itemForm.category_id" class="w-full" :items="subCategoryOptions" />
        </UFormField>
        <UFormField :label="t('data.form.group')">
          <USelect v-model="itemForm.group_id" class="w-full" :items="groupOptions" />
        </UFormField>
        <UFormField :label="t('data.form.location')">
          <USelect v-model="itemForm.location_id" class="w-full" :items="locationOptions" />
        </UFormField>
        <UFormField :label="t('data.form.imageUrl')">
          <UInput
            v-model="itemForm.image_url"
            class="w-full"
            :placeholder="t('data.form.imageUrlPlaceholder')"
          />
        </UFormField>
        <UFormField :label="t('data.form.note')" class="lg:col-span-3">
          <UTextarea
            v-model="itemForm.note"
            class="w-full"
            :placeholder="t('data.form.notePlaceholder')"
          />
        </UFormField>
        <div class="flex items-end">
          <UButton
            type="submit"
            icon="i-lucide-package-plus"
            :loading="creating"
          >
            {{ t('data.actions.createItem') }}
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
