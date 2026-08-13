<script setup lang="ts">
import { programTemplates, channelsForProgram, postsForProgramChannels, avatarForName } from '~/composables/useProgramMockData'
import { usePreviewState } from '~/composables/usePreviewState'

const route = useRoute()
const { t } = useI18n()
const { isOnboarded } = usePreviewState()

const programId = computed(() => route.params.programId as string)
const template = computed(() => programTemplates.find(p => p.id === programId.value))

// Home is enrolled-only, so every channel is visible here — including the
// restricted ones the Community tab hides from everyone else.
const posts = computed(() =>
  postsForProgramChannels(
    programId.value,
    channelsForProgram().map(channel => channel.id)
  )
)

const channelName = computed(() => {
  const byId = new Map(channelsForProgram().map(c => [c.id, c.name]))
  return (channelId: string) => byId.get(channelId) ?? channelId
})
</script>

<template>
  <UContainer v-if="template">
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_324px] gap-8 lg:gap-12 pt-10 pb-16">
      <!-- Per docs/brain/onboarding-flows-boundary-consent.md: the program
           page is the checklist's primary home, so the full widget sits at
           the top of the page the learner/educator lands on post-enrollment.
           Flow varies by audience — Flow 2a's cohort-learner items (introduce
           yourself, submit first task) don't apply to Flow 5's educators, whose
           checklist ends at enrollment itself. The (flow-id, context-id) pair
           for '2a' matches the dashboard's ChecklistCard, so ticking an item
           on either surface updates both instantly, and claiming on either
           surface hides it on both (ChecklistCard hides itself once claimed). -->
      <ChecklistCard
        class="min-w-0 lg:col-start-1 lg:row-start-1"
        :flow-id="template.audience === 'educator' ? '5' : '2a'"
        :context-id="template.id"
        :allow-claim="isOnboarded"
      />

      <!-- One rail, two positions — same trick ProgramTabOverview.vue uses for
           its enrollment card. Below lg it has to sit right after the
           checklist and before Latest Activity; on lg+ it's the right column
           running alongside both. A duplicate-mounted second copy (like the
           other tiles below) would double-mount ProgramTeacherCta's
           CreateCohortDrawer, which auto-opens off a `mentorQualify` route
           query param on mount — the hidden copy would react too, stacking two
           full-screen drawers. -->
      <div class="flex flex-col gap-8 lg:col-start-2 lg:row-start-1 lg:row-span-2">
        <ProgramProgressCard :template="template" />
        <ProgramCourseMetrics :template="template" />
        <ProgramCourseBadges :template="template" />
        <!-- Enrolled learners can also teach this program — enrollment as a
             student doesn't rule out mentoring it, so the CTA follows the
             learner into Home rather than disappearing once they enroll. -->
        <ProgramTeacherCta v-if="template.audience !== 'educator'" />
      </div>

      <div class="flex flex-col gap-6 min-w-0 lg:col-start-1 lg:row-start-2">
        <SectionTitle :title="t('program.home.latestActivity')" />

        <template v-if="posts.length">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post-id="post.id"
            :author="post.author"
            :avatar="post.avatar ?? avatarForName(post.author)"
            :time="`${channelName(post.channelId)} · ${post.time}`"
            :image="post.image"
            :likes="post.likes"
            :comments="post.comments"
            :is-mentor="post.isMentor"
          >
            {{ post.body }}
          </PostCard>
        </template>

        <div
          v-else
          class="border-[1.5px] border-dashed border-default flex flex-col items-center gap-2 text-center rounded-2xl"
          style="padding: 32px 24px"
        >
          <UIcon name="lucide:message-square-dashed" class="size-[22px] text-primary" />
          <div class="font-heading text-[15px] font-bold text-default">{{ t('program.home.noActivity') }}</div>
          <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">{{ t('program.home.noActivityBody') }}</p>
        </div>
      </div>
    </div>
  </UContainer>
</template>
