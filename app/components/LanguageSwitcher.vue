<script setup lang="ts">
import type { Component } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import FlagUs from './FlagUs.vue'
import FlagEs from './FlagEs.vue'

const { locale, locales, setLocale } = useI18n()

const flags: Record<string, Component> = { en: FlagUs, es: FlagEs }

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
        <component :is="flags[locale]" class="h-4 w-5" />
      </template>
    </UButton>

    <template #item-leading="{ item }">
      <component :is="flags[(item as DropdownMenuItem & { value: string }).value]" class="h-4 w-5" />
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
