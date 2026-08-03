<script setup lang="ts">
import type { PostComment } from '~/composables/useHomeMockData'

const props = withDefaults(defineProps<{
  author?: string
  avatar?: string
  time?: string
  image?: string
  likes?: number
  comments?: PostComment[]
  isMentor?: boolean
}>(), {
  author: 'creator',
  time: 'just now',
  comments: () => []
})

const liked = ref(false)
const likeCount = ref(props.likes ?? 0)

function toggleLike() {
  liked.value = !liked.value
  likeCount.value += liked.value ? 1 : -1
}

const localComments = ref<PostComment[]>([...props.comments])
const newComment = ref('')

function submitComment() {
  const body = newComment.value.trim()
  if (!body) return
  localComments.value.push({ id: crypto.randomUUID(), author: 'You', time: 'just now', body })
  newComment.value = ''
}

function mentionParts(text: string) {
  return text.split(/(@[\w.]+)/g).filter(Boolean).map(part => ({
    text: part,
    isMention: /^@[\w.]+$/.test(part)
  }))
}

const commentInput = ref()

function focusComment() {
  commentInput.value?.textareaRef?.focus()
}
</script>

<template>
  <UPageCard variant="outline" class="font-sans rounded-2xl" :ui="{ wrapper: 'items-stretch w-full', body: 'w-full' }">
    <template #header>
      <div class="flex gap-3">
        <UAvatar :src="avatar" :text="author.charAt(0).toUpperCase()" size="2xl" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="font-bold text-sm text-highlighted">{{ author }}</p>
            <UBadge v-if="isMentor" label="Mentor" color="secondary" variant="soft" size="sm" />
          </div>
          <p class="text-xs text-dimmed mt-1">{{ time }}</p>
        </div>
        <UButton icon="lucide:more-horizontal" color="neutral" variant="ghost" size="sm" square class="shrink-0" />
      </div>
    </template>

    <template #body>
      <div v-if="image">
        <img :src="image" alt="" class="w-full max-h-[340px] object-cover block rounded-2xl">
      </div>

      <div v-if="$slots.default" class="text-sm leading-6 text-default" :class="image ? 'mt-3' : ''">
        <slot />
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <UButton
            :label="String(likeCount)"
            variant="ghost"
            :color="liked ? 'primary' : 'neutral'"
            :ui="{ label: 'tabular-nums' }"
            @click="toggleLike"
          >
            <template #leading>
              <UIcon name="lucide:heart" mode="svg" class="size-5 shrink-0" :class="liked ? '[&>path]:fill-current' : ''" />
            </template>
          </UButton>
          <UButton
            :label="String(localComments.length)"
            icon="lucide:message-circle"
            variant="ghost"
            color="neutral"
            :ui="{ label: 'tabular-nums' }"
            @click="focusComment"
          />
        </div>

        <div v-if="localComments.length" class="flex flex-col gap-2">
          <div v-for="c in localComments" :key="c.id" class="flex items-start gap-3 pb-3">
            <UAvatar :src="c.avatar" :text="c.author.charAt(0).toUpperCase()" size="2xl" />
            <div class="flex-1 min-w-0 text-sm leading-5">
              <span class="font-semibold text-highlighted">{{ c.author }}</span>
              <UBadge v-if="c.isMentor" label="Mentor" color="secondary" variant="soft" size="sm" class="ml-2 align-middle" />
              <span class="text-dimmed text-xs ml-2">{{ c.time }}</span>
              <div class="text-default">
                <span
                  v-for="(part, i) in mentionParts(c.body)"
                  :key="i"
                  :class="part.isMention ? 'font-semibold text-secondary' : ''"
                >{{ part.text }}</span>
              </div>
            </div>
          </div>
        </div>

        <USeparator class="-mx-4 sm:-mx-6" />

        <div class="px-4 sm:px-6 pt-6">
          <div class="flex align-center gap-2.5">
            <UAvatar text="Y" size="2xl" />
            <UTextarea
              ref="commentInput"
              v-model="newComment"
              :rows="1"
              autoresize
              variant="none"
              placeholder="Add a comment..."
              class="flex-1"
              @keydown.enter.exact.prevent="submitComment"
            />
            <UButton
              icon="lucide:send"
              color="neutral"
              variant="ghost"
              size="sm"
              :disabled="!newComment.trim()"
              @click="submitComment"
            />
          </div>
        </div>
      </div>
    </template>
  </UPageCard>
</template>
