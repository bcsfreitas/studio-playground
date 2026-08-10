<script setup lang="ts">
const props = defineProps<{
  mode: 'export' | 'import'
  frameCount: number
}>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  export: [columns: number]
  import: [file: File, columns: number, rows: number]
}>()

const { t } = useI18n()

const columns = ref(4)
const rows = ref(1)
const file = ref<File | null>(null)

// Reset per open so a previous run's file doesn't get re-imported by accident,
// and default the row count to whatever squares off the current frames.
watch(open, (isOpen) => {
  if (!isOpen) return
  columns.value = 4
  rows.value = Math.max(1, Math.ceil(props.frameCount / 4))
  file.value = null
})

const exportRows = computed(() => Math.ceil(props.frameCount / Math.max(1, columns.value)))

function onFileChange(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0] ?? null
}

function confirm() {
  if (props.mode === 'export') emit('export', Math.max(1, columns.value))
  else if (file.value) emit('import', file.value, Math.max(1, columns.value), Math.max(1, rows.value))
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="mode === 'export' ? t('pixelStitch.sheet.exportTitle') : t('pixelStitch.sheet.importTitle')"
    close
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField v-if="mode === 'import'" :label="t('pixelStitch.sheet.imageFile')">
          <!-- A native file input: Nuxt UI's UInput has no file variant, and a
               real <input type="file"> is what opens the OS picker. -->
          <input
            type="file"
            accept="image/*"
            class="w-full text-sm text-default file:mr-3 file:rounded-md file:border-0 file:bg-elevated file:px-3 file:py-1.5 file:text-sm file:text-default file:cursor-pointer"
            @change="onFileChange"
          >
        </UFormField>

        <UFormField :label="t('pixelStitch.sheet.columns')">
          <UInputNumber v-model="columns" :min="1" class="w-full" />
        </UFormField>

        <UFormField v-if="mode === 'import'" :label="t('pixelStitch.sheet.rows')">
          <UInputNumber v-model="rows" :min="1" class="w-full" />
        </UFormField>

        <p v-if="mode === 'export'" class="text-sm text-muted">
          {{ t('pixelStitch.sheet.summary', { count: frameCount, columns, rows: exportRows }) }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t('pixelStitch.sheet.cancel')" color="neutral" variant="ghost" @click="open = false" />
        <UButton
          :label="mode === 'export' ? t('pixelStitch.sheet.export') : t('pixelStitch.sheet.import')"
          color="primary"
          :disabled="mode === 'import' && !file"
          @click="confirm"
        />
      </div>
    </template>
  </UModal>
</template>
