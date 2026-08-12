<script setup lang="ts">
import type { LearnProgram } from '~/composables/useLearnMockData'
import type { ProgramTemplate } from '~/composables/useProgramMockData'

defineProps<{
  program: LearnProgram & { template: ProgramTemplate }
}>()

const { t } = useI18n()
</script>

<template>
  <!-- `orientation="horizontal" reverse` is the same combo the home page's
       "Continue learning" card already uses for an image-left split — the
       theme's horizontal variant only ever produces two columns, so the
       third (the arrow button) comes from flattening `wrapper` into its own
       row via the `:ui` override below, the same "override wrapper into a
       row" technique ProgramStepCard.vue uses for its single-row layout. -->
  <UPageCard
    :to="`/learn/${program.id}`"
    orientation="horizontal"
    reverse
    variant="outline"
    class="group rounded-[20px] transition-[box-shadow,transform] duration-250 hover:-translate-y-px hover:shadow-xl"
    :ui="{
      container: 'lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center gap-5',
      wrapper: 'sm:flex-row sm:items-center gap-4',
      body: 'min-w-0',
      footer: 'pt-0 mt-0 shrink-0 self-start sm:self-center'
    }"
  >
    <img
      :src="program.template.image"
      alt=""
      class="aspect-[16/10] w-full rounded-2xl object-cover sm:h-full sm:min-h-[148px]"
    >

    <template #body>
      <UBadge :label="program.template.difficulty" color="neutral" variant="soft" size="sm"/>
      <h3 class="mt-2 font-heading text-2xl font-bold tracking-tight text-highlighted transition-colors group-hover:text-blue-900">
        {{ program.template.title }}
      </h3>
      <p class="mt-2 line-clamp-2 max-w-[560px] text-[15px] leading-6 text-muted">
        {{ program.template.description }}
      </p>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center gap-1.5 text-xs text-dimmed">
          <UIcon name="lucide:calendar-days" class="size-4" />
          {{ t(`program.sideInfo.${program.template.sessionUnit}Count`, program.template.sessionCount, { count: program.template.sessionCount }) }}
        </span>
      </div>

      <div v-if="program.enrolled" class="mt-3 flex max-w-xs items-center gap-3">
        <UProgress :model-value="program.progress" color="primary" />
        <span class="text-xs text-default">{{ program.progress }}%</span>
      </div>
    </template>

  </UPageCard>
</template>
