<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'
import type {
  ProgramTemplate,
  ProgramDifficulty,
  ProgramTier,
  LearningType,
  DeliveringInstitution
} from '~/composables/useProgramMockData'

defineProps<{
  template: ProgramTemplate
  institution?: DeliveringInstitution
}>()

const { t } = useI18n()

const DIFFICULTY_COLOR: Record<ProgramDifficulty, BadgeProps['color']> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'error'
}

// No existing precedent for tier colors (Explore/Core/More) — see the
// design spec's open questions before treating this mapping as final.
const TIER_COLOR: Record<ProgramTier, BadgeProps['color']> = {
  Explore: 'neutral',
  Core: 'primary',
  More: 'secondary'
}

const LEARNING_TYPE_ICON: Record<LearningType, string> = {
  'self-paced': 'lucide:infinity',
  moderated: 'lucide:calendar-days'
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <img :src="template.image" alt="" class="w-full h-72 object-cover rounded-2xl bg-slate-100">

    <div class="flex flex-wrap items-center gap-2">
      <UBadge :label="t(`program.badges.tier.${template.tier}`)" :color="TIER_COLOR[template.tier]" variant="soft" />
      <UBadge :label="t(`program.badges.difficulty.${template.difficulty}`)" :color="DIFFICULTY_COLOR[template.difficulty]" variant="soft" />
      <UBadge
        :icon="LEARNING_TYPE_ICON[template.learningType]"
        :label="t(`program.badges.learningType.${template.learningType}`)"
        color="neutral"
        variant="soft"
      />
    </div>

    <div>
      <h1 class="text-5xl font-heading font-bold text-highlighted text-pretty">{{ template.title }}</h1>
      <p v-if="institution" class="text-sm text-dimmed mt-2">
        {{ t('program.hero.deliveredWith', { institution: institution.name }) }}
      </p>
      <p class="text-lg text-dimmed mt-2">{{ template.description }}</p>
    </div>

    <div class="flex items-center gap-6 pt-4 border-t border-default">
      <div class="flex items-center gap-2.5">
        <UAvatar :text="template.facilitator.charAt(0)" size="md" />
        <span class="text-sm font-semibold text-default">
          {{ t('program.hero.facilitatedBy', { facilitator: template.facilitator }) }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <img :src="template.studioOwner.logo" :alt="`${template.studioOwner.name} logo`" class="h-5 w-auto">
        <span class="text-sm text-muted">{{ template.studioOwner.name }}</span>
      </div>
    </div>
  </div>
</template>
