<script setup lang="ts">
import type { ProgramMember } from '~/composables/useProgramMockData'

const props = defineProps<{
  members: ProgramMember[]
}>()

const { t, n } = useI18n()

// Five, per the spec. Picked by a stable rotation rather than Math.random():
// a random slice would differ between the server render and the client one and
// trip a hydration mismatch.
const SHOWN = 5

const featured = computed(() => props.members.slice(0, SHOWN))
const hasMore = computed(() => props.members.length > SHOWN)
</script>

<template>
  <!-- Deliberately not a card: the channel list above is the card, and a second
       one would make the sidebar read as two competing panels. -->
  <div v-if="members.length" class="flex flex-col gap-3">
    <h3 class="text-xs font-semibold text-dimmed uppercase tracking-wide">
      {{ t('program.community.members') }}
    </h3>

    <ul class="flex flex-col gap-2.5">
      <li v-for="member in featured" :key="member.id" class="flex items-center gap-2.5">
        <UAvatar :text="member.name.charAt(0)" size="sm" />
        <div class="min-w-0 flex-1">
          <div class="text-sm text-default truncate">{{ member.name }}</div>
          <div class="text-xs text-dimmed tabular-nums">{{ t('program.community.memberXp', { xp: n(member.xp) }) }}</div>
        </div>
      </li>
    </ul>

    <UButton
      v-if="hasMore"
      :label="t('program.community.seeAllMembers', { count: members.length })"
      color="neutral"
      variant="outline"
      size="sm"
      trailing-icon="lucide:arrow-right"
      class="self-start"
    />
  </div>
</template>
