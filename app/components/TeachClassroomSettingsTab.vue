<script setup lang="ts">
import type { MentorClassroom } from '~/composables/useProgramMockData'
import { formatCohortRange } from '~/composables/useLearnMockData'
import { useClassroomInviteLink } from '~/composables/useClassroomInviteLink'

// Prop-driven, not route-driven like ProgramTab*.vue's siblings: the selected
// classroom is local UI state (a sidebar pick), not a URL segment.
const props = defineProps<{
  classroom: MentorClassroom
}>()

const { t } = useI18n()

const { inviteLink, copyLink } = useClassroomInviteLink(
  computed(() => props.classroom),
  { copied: 'teach.hub.settings.linkCopied', copyFailed: 'teach.hub.settings.linkCopyFailed' }
)

const dateRangeLabel = computed(() =>
  props.classroom.startDate && props.classroom.endDate
    ? formatCohortRange(props.classroom.startDate, props.classroom.endDate)
    : t('teach.hub.settings.selfPaced')
)
</script>

<template>
  <div class="mt-8 flex flex-col gap-6">
    <SectionTitle :title="t('teach.hub.settings.title')" />

    <UPageCard variant="subtle">
      <template #header>
        <span class="text-xs font-semibold text-dimmed uppercase tracking-wide">
          {{ t('teach.hub.settings.inviteLink') }}
        </span>
      </template>
      <div class="flex items-center gap-2">
        <UInput :model-value="inviteLink" readonly class="w-full font-mono text-xs" />
        <UButton
          :label="t('teach.hub.settings.copyLink')"
          icon="lucide:link"
          color="neutral"
          variant="outline"
          @click="copyLink"
        />
      </div>
    </UPageCard>

    <dl class="flex flex-col gap-3 text-sm">
      <div class="flex items-center justify-between">
        <dt class="text-muted">{{ t('teach.hub.settings.dateRange') }}</dt>
        <dd class="font-semibold text-default">{{ dateRangeLabel }}</dd>
      </div>
      <div v-if="classroom.maxLearners" class="flex items-center justify-between">
        <dt class="text-muted">{{ t('teach.hub.settings.maxLearners') }}</dt>
        <dd class="font-semibold text-default">{{ classroom.maxLearners }}</dd>
      </div>
      <div class="flex items-center justify-between">
        <dt class="text-muted">{{ t('teach.hub.settings.seatsTaken') }}</dt>
        <dd class="font-semibold text-default">{{ classroom.seatsTaken }}</dd>
      </div>
    </dl>
  </div>
</template>
