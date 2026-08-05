<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { locale, locales, setLocale } = useI18n()

const items = computed<DropdownMenuItem[]>(() =>
  locales.value.map((l) => ({
    label: l.name ?? l.code,
    value: l.code,
    onSelect: () => setLocale(l.code as 'en' | 'es')
  }))
)
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'end' }">
    <UButton color="neutral" variant="ghost" square aria-label="Change language">
      <template #leading>
        <span class="text-xs font-bold text-muted">{{ locale.toUpperCase() }}</span>
      </template>
    </UButton>

    <template #item-leading="{ item }">
      <span class="w-5 text-center text-xs font-bold text-muted">
        {{ (item as DropdownMenuItem & { value: string }).value.toUpperCase() }}
      </span>
    </template>

    <template #item-trailing="{ item }">
      <Icon
        v-if="(item as DropdownMenuItem & { value: string }).value === locale"
        name="lucide:check"
        class="size-4 text-primary"
      />
    </template>
  </UDropdownMenu>
</template>
