<script setup lang="ts">
import type { Testimonial } from '~/composables/useProgramMockData'

const props = defineProps<{
  studentsCompletedCount: number
  testimonials: Testimonial[]
}>()

const { t } = useI18n()

const completedCountLabel = computed(() =>
  t('program.testimonials.completedCount', { count: props.studentsCompletedCount }, props.studentsCompletedCount)
)
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center gap-2 text-sm text-muted">
      <UIcon name="lucide:users" class="size-4" />
      <span>{{ completedCountLabel }}</span>
    </div>

    <UCarousel
      v-if="testimonials.length"
      :items="testimonials"
      :arrows="testimonials.length > 1"
      :dots="testimonials.length > 1"
      align="start"
      class="w-full"
    >
      <template #default="{ item }">
        <UPageCard variant="soft" class="h-full mx-1">
          <div class="flex items-center gap-2.5">
            <UAvatar :text="item.author.charAt(0)" size="sm" />
            <div>
              <div class="text-sm font-semibold text-default">{{ item.author }}</div>
              <div v-if="item.role" class="text-xs text-dimmed">{{ item.role }}</div>
            </div>
          </div>
          <p class="text-sm text-toned mt-3">{{ item.quote }}</p>
        </UPageCard>
      </template>
    </UCarousel>

    <div
      v-else
      class="border-[1.5px] border-dashed border-slate-300 flex flex-col items-center gap-2 text-center rounded-2xl"
      style="padding: 32px 24px"
    >
      <Icon name="lucide:message-square-heart" class="size-[22px] text-primary" />
      <div class="font-heading text-[15px] font-bold text-default">{{ t('program.testimonials.emptyTitle') }}</div>
      <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">{{ t('program.testimonials.emptyBody') }}</p>
    </div>
  </div>
</template>
