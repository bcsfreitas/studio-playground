<script setup lang="ts">
import type { Bounty } from '~/composables/useHomeMockData'

const props = withDefaults(defineProps<{
  bounties: Bounty[]
  source?: string
}>(), {
  source: 'BountyBoard'
})

// Access-code bounties stay off the public list until unlocked — same
// client-only fake as the program enrollment card's access-code flow, since
// there's no backend to check a code against.
const unlockedTitles = ref<string[]>([])

const visibleBounties = computed(() =>
  props.bounties.filter(b => !b.accessCode || unlockedTitles.value.includes(b.title))
)

const codeModalOpen = ref(false)
const enteredCode = ref('')
const codeError = ref(false)

function openCodeModal() {
  enteredCode.value = ''
  codeError.value = false
  codeModalOpen.value = true
}

function submitCode() {
  const bounty = props.bounties.find(b => b.accessCode === enteredCode.value.trim())
  if (!bounty) {
    codeError.value = true
    return
  }
  unlockedTitles.value.push(bounty.title)
  codeModalOpen.value = false
}
</script>

<template>
  <div class="flex flex-col w-full">
    <UPageCard variant="soft">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h3 class="m-0 font-heading font-bold tracking-[-0.5px] text-highlighted text-lg h-7">
            Bounties
          </h3>
          <span class="text-[11px] text-dimmed">via {{ source }}</span>
        </div>
        <p class="text-sm text-dimmed w-full mt-1">Paid tasks posted by game teams.</p>
      </template>

      <div class="flex flex-col gap-2 w-full">
        <div
          v-for="b in visibleBounties"
          :key="b.title"
          class="flex items-center gap-3 cursor-pointer w-full rounded-lg p-2 -mx-2 transition-colors duration-150 hover:bg-white"
        >
          <img :src="b.img" alt="" class="size-[34px] rounded-[10px] object-cover shrink-0">
          <div class="flex-1 min-w-0 w-full">
            <div class="text-[13px] font-semibold text-default truncate w-full">{{ b.title }}</div>
            <div class="text-xs text-dimmed w-full">{{ b.game }}</div>
          </div>
          <UBadge color="success" variant="soft" size="sm">{{ b.amt }}</UBadge>
        </div>
      </div>

      <template #footer>
        <a href="#" class="inline-flex items-center gap-1.5 text-xs font-semibold">
          Browse all bounties<Icon name="lucide:external-link" class="size-3" />
        </a>
      </template>
    </UPageCard>

    <UButton
      label="Have an access code?"
      variant="link"
      color="neutral"
      size="sm"
      block
      class="justify-center mt-2"
      @click="openCodeModal"
    />

    <UModal v-model:open="codeModalOpen">
      <template #title>
        <span class="sr-only">Enter your access code</span>
      </template>
      <template #body>
        <div class="flex flex-col items-center text-center gap-3">
          <div class="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
            <UIcon name="lucide:key-round" class="size-6" />
          </div>
          <div class="font-heading font-bold text-lg text-highlighted">
            Enter your access code
          </div>
          <p class="text-sm text-muted">
            Enter the code a game team gave you to see a bounty posted just for you.
          </p>
          <UFormField
            :error="codeError ? 'That code doesn\'t match any bounty. Check with the game team and try again.' : undefined"
            class="w-full text-left"
          >
            <UInput
              v-model="enteredCode"
              icon="lucide:key-round"
              placeholder="Enter access code"
              class="w-full"
              @keydown.enter="submitCode"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <UButton label="Cancel" color="neutral" variant="outline" @click="codeModalOpen = false" />
        <UButton label="Continue" color="primary" :disabled="!enteredCode.trim()" @click="submitCode" />
      </template>
    </UModal>
  </div>
</template>
