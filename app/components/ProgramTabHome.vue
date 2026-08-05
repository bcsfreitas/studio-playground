<script setup lang="ts">
import { programTemplates, channelsForProgram, postsForProgramChannels } from '~/composables/useProgramMockData'

const route = useRoute()
const { t } = useI18n()

const programId = computed(() => route.params.programId as string)
const template = computed(() => programTemplates.find(p => p.id === programId.value))

// Home is enrolled-only, so every channel is visible here — including the
// restricted ones the Community tab hides from everyone else.
const posts = computed(() =>
  postsForProgramChannels(
    programId.value,
    channelsForProgram(programId.value).map(channel => channel.id)
  )
)

const channelName = computed(() => {
  const byId = new Map(channelsForProgram(programId.value).map(c => [c.id, c.name]))
  return (channelId: string) => byId.get(channelId) ?? channelId
})
</script>

<template>
  <UContainer v-if="template">
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_324px] gap-8 lg:gap-12 pt-10 pb-16">
      <div class="flex flex-col gap-6 min-w-0">
        <!-- Mobile-only: the rail is sticky on lg+, but below that the progress
             card is the first thing the learner should see, not the last. -->
        <div class="lg:hidden">
          <ProgramProgressCard :template="template" />
        </div>

        <SectionTitle :title="t('program.home.latestActivity')" />

        <template v-if="posts.length">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :author="post.author"
            :avatar="post.avatar"
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

      <div class="hidden lg:block">
        <div class="sticky top-6">
          <ProgramProgressCard :template="template" />
        </div>
      </div>
    </div>
  </UContainer>
</template>
