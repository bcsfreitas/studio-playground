<script setup lang="ts">
import type { Component } from 'vue'
import type { LearningType, ProgramTemplate } from '~/composables/useProgramMockData'
import FlagUs from './FlagUs.vue'
import FlagEs from './FlagEs.vue'

const props = defineProps<{
  template: ProgramTemplate
}>()

const { t } = useI18n()

// Only English and Spanish programs exist today, so language maps straight
// to a flag component (same flags as the topbar's LanguageSwitcher).
const LANGUAGE_FLAG: Record<string, Component> = {
  English: FlagUs,
  Spanish: FlagEs
}

// Reuses the icon-per-type mapping from ProgramHero's badges, so the same
// class type always reads with the same icon across the page.
const LEARNING_TYPE_ICON: Record<LearningType, string> = {
  'self-paced': 'lucide:infinity',
  moderated: 'lucide:calendar-days'
}

// Each stat gets its own fixed accent (not tied to the stat's value, unlike
// e.g. difficulty's severity coloring in ProgramHero) so the grid reads as
// distinct at-a-glance categories. Classes are written out per color, not
// built from a template string — Tailwind's scanner needs the literal class
// name in source to generate it.
const stats = computed(() => [
  {
    key: 'totalXp',
    icon: undefined as string | undefined,
    iconClass: '',
    flag: undefined as Component | undefined,
    image: '/images/icons/xp.png' as string | undefined,
    value: `${props.template.totalXp} XP`
  },
  {
    key: 'difficulty',
    icon: 'lucide:gauge',
    iconClass: 'text-secondary-600',
    flag: undefined,
    image: undefined,
    value: t(`program.badges.difficulty.${props.template.difficulty}`)
  },
  {
    key: 'language',
    icon: undefined,
    iconClass: '',
    flag: LANGUAGE_FLAG[props.template.language],
    image: undefined,
    value: props.template.language
  },
  {
    key: 'learningType',
    icon: LEARNING_TYPE_ICON[props.template.learningType],
    iconClass: 'text-purple-600',
    flag: undefined,
    image: undefined,
    value: t(`program.badges.learningType.${props.template.learningType}`)
  }
])
</script>

<template>
  <div>
    <SectionTitle :title="t('program.sections.overview')" />
    <div class="grid grid-cols-2 gap-y-4 gap-x-6">
      <div v-for="stat in stats" :key="stat.key" class="flex items-center gap-3">
        <component
          :is="stat.flag"
          v-if="stat.flag"
          class="h-8 w-10 shrink-0"
        />
        <img v-else-if="stat.image" :src="stat.image" alt="" class="size-8 shrink-0" />
        <div v-else class="flex items-center justify-center size-8 shrink-0" :class="stat.iconClass">
          <Icon :name="stat.icon!" class="size-5" />
        </div>
        <span class="text-md font-heading font-semibold text-muted truncate">{{ stat.value }}</span>
      </div>
    </div>
  </div>
</template>
