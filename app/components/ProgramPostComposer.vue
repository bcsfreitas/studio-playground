<script setup lang="ts">
defineProps<{
  channelName: string
}>()

const emit = defineEmits<{ post: [body: string] }>()

const { t } = useI18n()
const body = ref('')

function submit() {
  const trimmed = body.value.trim()
  if (!trimmed) return
  emit('post', trimmed)
  body.value = ''
}
</script>

<template>
  <UPageCard variant="outline" class="rounded-2xl" :ui="{ wrapper: 'items-stretch w-full', body: 'w-full' }">
    <div class="flex items-start gap-2.5">
      <UAvatar text="Y" size="2xl" />
      <UTextarea
        v-model="body"
        :rows="2"
        autoresize
        variant="none"
        :placeholder="t('program.community.composerPlaceholder', { channel: channelName })"
        class="flex-1"
      />
    </div>

    <template #footer>
      <div class="flex items-center justify-between gap-3">
        <p class="text-xs text-dimmed">
          {{ t('program.community.postingTo', { channel: channelName }) }}
        </p>
        <UButton
          :label="t('program.community.post')"
          color="primary"
          icon="lucide:send"
          :disabled="!body.trim()"
          @click="submit"
        />
      </div>
    </template>
  </UPageCard>
</template>
