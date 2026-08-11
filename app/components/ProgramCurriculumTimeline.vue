<script setup lang="ts">
import type { CurriculumModule, CurriculumItemType } from '~/composables/useProgramMockData'
import { withAwardableXp } from '~/composables/useProgramCurriculum'

const props = defineProps<{
  modules: CurriculumModule[]
}>()

const { t } = useI18n()

const ITEM_TYPE_ICON: Record<CurriculumItemType, string> = {
  task: 'lucide:circle-check',
  topic: 'lucide:file-text',
  survey: 'lucide:message-square-text',
  resource: 'lucide:link',
  deliverable: 'lucide:upload'
}

// Only the module's last item is worth XP (see withAwardableXp) — the badge
// below reads straight off that, no separate lookup needed.
const modulesWithXp = computed(() => withAwardableXp(props.modules))
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- bg-default, not transparent: these sit on the page canvas, which is
         tinted, so without it the cards read as part of the background rather
         than as cards. Matches the classroom's step cards. -->
    <div
      v-for="mod in modulesWithXp"
      :key="mod.id"
      class="rounded-2xl border border-default bg-default px-5 py-4"
    >
      <span class="font-heading font-bold text-base text-primary-600">
        {{ mod.title }}
      </span>

      <UTimeline
        class="mt-4"
        :items="mod.items.map(item => ({ title: item.title, icon: ITEM_TYPE_ICON[item.type], xp: item.xp }))"
        size="sm"
      >
        <template #description="{ item }">
          <UBadge
            v-if="item.xp"
            :label="t('program.curriculum.xpBadge', { xp: item.xp })"
            color="neutral"
            variant="soft"
            size="sm"
            class="mt-1"
          />
        </template>
      </UTimeline>
    </div>
  </div>
</template>
