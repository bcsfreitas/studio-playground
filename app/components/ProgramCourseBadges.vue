<script setup lang="ts">
import type { ProgramTemplate } from '~/composables/useProgramMockData'
import { programBadges, isBadgeEarned } from '~/composables/useProgramMockData'
import { useProgramStats } from '~/composables/useProgramStats'

const props = defineProps<{
  template: ProgramTemplate
}>()

const { t } = useI18n()

const { badgeStats } = useProgramStats(props.template)

const badges = computed(() => programBadges.map(badge => ({
  ...badge,
  name: t(`program.courseBadges.list.${badge.id}.name`),
  requirement: t(`program.courseBadges.list.${badge.id}.requirement`),
  earned: isBadgeEarned(badge.id, badgeStats.value)
})))

const earnedCount = computed(() => badges.value.filter(badge => badge.earned).length)
</script>

<template>
  <section>
    <div class="flex items-baseline justify-between gap-3">
      <h3 class="text-xs font-semibold text-dimmed uppercase tracking-wide">
        {{ t('program.courseBadges.title') }}
      </h3>
      <span class="text-xs text-muted tabular-nums">{{ earnedCount }}/{{ badges.length }}</span>
    </div>

    <ul class="flex flex-col gap-2.5 mt-3">
      <li
        v-for="badge in badges"
        :key="badge.id"
        class="flex items-start gap-2.5"
      >
        <!-- Earned badges carry the brand colour; unearned ones are muted and
             desaturated rather than hidden, so the learner can see what is
             still available to go after. -->
        <div
          class="flex items-center justify-center size-8 shrink-0 rounded-full"
          :class="badge.earned ? 'bg-primary/10 text-primary' : 'bg-elevated text-dimmed opacity-60'"
        >
          <UIcon :name="badge.icon" class="size-4" />
        </div>
        <div class="min-w-0 flex-1">
          <div
            class="text-sm font-medium"
            :class="badge.earned ? 'text-highlighted' : 'text-muted'"
          >
            {{ badge.name }}
          </div>
          <p class="text-xs" :class="badge.earned ? 'text-muted' : 'text-dimmed'">
            {{ badge.earned ? t('program.courseBadges.earned') : badge.requirement }}
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>
