<script setup lang="ts">
import type { ChannelPost } from '~/composables/useProgramMockData'
import { channelsForProgram, postsForChannel, membersForProgram, avatarForName } from '~/composables/useProgramMockData'
import { useProgramPhase } from '~/composables/useProgramPhase'

const route = useRoute()
const { t } = useI18n()

const programId = computed(() => route.params.programId as string)
const phase = useProgramPhase()
const isEnrolled = computed(() => phase.value !== 'interested')

// Announcements, Introductions and the per-group channels belong to people
// actually in the program, so they are absent for everyone else rather than
// listed and locked.
const channels = computed(() =>
  channelsForProgram(programId.value).filter(channel => isEnrolled.value || !channel.restricted)
)

const selectedChannelId = ref(channels.value[0]?.id ?? 'general')

// Un-enrolling in the preview bar can remove the channel being viewed; fall
// back rather than leaving the feed pointed at something no longer listed.
watch(channels, (list) => {
  if (!list.some(channel => channel.id === selectedChannelId.value)) {
    selectedChannelId.value = list[0]?.id ?? 'general'
  }
})

const selectedChannel = computed(() =>
  channels.value.find(channel => channel.id === selectedChannelId.value)
)

const members = computed(() => membersForProgram(programId.value))

// Posts written during the session live here, keyed by channel. There is no
// backend, so they last until reload.
const draftPosts = ref<Record<string, ChannelPost[]>>({})

const posts = computed(() => [
  ...(draftPosts.value[selectedChannelId.value] ?? []),
  ...postsForChannel(programId.value, selectedChannelId.value)
])

function addPost(body: string) {
  const channelId = selectedChannelId.value
  const existing = draftPosts.value[channelId] ?? []
  draftPosts.value[channelId] = [
    {
      id: `draft-${channelId}-${existing.length}`,
      programId: programId.value,
      channelId,
      author: 'You',
      time: t('program.community.justNow'),
      body,
      likes: 0,
      comments: []
    },
    ...existing
  ]
}
</script>

<template>
  <UContainer>
    <div class="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8 lg:gap-12 pt-10 pb-16">
      <aside class="flex flex-col gap-8">
        <ProgramChannelList v-model="selectedChannelId" :channels="channels" />
        <ProgramMembersList :members="members" />
      </aside>

      <div class="flex flex-col gap-6 min-w-0">
        <ProgramPostComposer
          :channel-name="selectedChannel?.name ?? ''"
          @post="addPost"
        />

        <template v-if="posts.length">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :author="post.author"
            :avatar="post.avatar ?? avatarForName(post.author)"
            :time="post.time"
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
          <div class="font-heading text-[15px] font-bold text-default">
            {{ t('program.community.emptyChannel', { channel: selectedChannel?.name ?? '' }) }}
          </div>
          <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">
            {{ t('program.community.emptyChannelBody') }}
          </p>
        </div>
      </div>
    </div>
  </UContainer>
</template>
