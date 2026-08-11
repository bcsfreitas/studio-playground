<script setup lang="ts">
import { useOnboardingChecklist, CLAIM_XP_REWARD, type OnboardingFlowId } from '~/composables/useOnboardingChecklist'

const props = withDefaults(defineProps<{
  flowId: OnboardingFlowId
  contextId: string
  xpReward?: number
  /** Opt-in: only surfaces where reaching 100% has an actual claim/XP payoff. */
  allowClaim?: boolean
}>(), {
  xpReward: CLAIM_XP_REWARD,
  allowClaim: false
})

const { t } = useI18n()
const { items, toggle, completedCount, totalCount, isComplete, claimed, claim } = useOnboardingChecklist(
  props.flowId,
  props.contextId,
  // Onboarded personas land with onboarding already behind them — allowClaim
  // is already exactly that signal at both real call sites (index.vue,
  // ProgramTabHome.vue), so reusing it here skips a redundant prop.
  { startComplete: () => props.allowClaim }
)

const progressDeg = computed(() => totalCount.value ? (completedCount.value / totalCount.value) * 360 : 0)

const claimModalOpen = ref(false)
function claimXp() {
  claim()
  claimModalOpen.value = true
}
</script>

<template>
  <!-- `claimed` hides the card itself once the payoff's been collected, but not
       the confirmation modal below — it's a sibling, not a child, so the
       "XP claimed" message stays visible through the card's own disappearance. -->
  <UPageCard v-if="!claimed">
    <template #header>
      <div class="flex items-center gap-3.5">
        <div
          class="size-12 rounded-full flex items-center justify-center shrink-0"
          :style="{ background: `conic-gradient(var(--ui-primary) ${progressDeg}deg, var(--color-slate-200) ${progressDeg}deg)` }"
        >
          <div class="size-9 rounded-full bg-white flex items-center justify-center text-[11px] font-bold text-default">
            {{ completedCount }}/{{ totalCount }}
          </div>
        </div>
        <div>
          <h3 class="m-0 font-heading text-base font-bold tracking-[-0.5px] text-highlighted">
            {{ t('onboarding.checklist.title') }}
          </h3>
          <div v-if="!isComplete" class="inline-flex items-center gap-1 mt-0.5 text-xs font-semibold text-primary">
            <Icon name="lucide:zap" class="size-[13px]" />
            {{ t('onboarding.checklist.xpReward', { count: totalCount, xp: xpReward.toLocaleString() }) }}
          </div>
          <div v-else-if="!allowClaim" class="inline-flex items-center gap-1 mt-0.5 text-xs font-semibold text-success">
            <Icon name="lucide:party-popper" class="size-[13px]" />
            {{ t('onboarding.checklist.complete') }}
          </div>
        </div>
      </div>
    </template>

    <!-- Plain (unnamed) slot content, not `#footer` — UPageCard renders
         header/footer together in one wrapper ahead of this slot, so a
         `#footer` button would land above this list instead of below it. -->
    <div class="flex flex-col gap-0.5">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-2.5 rounded-[10px] px-2 py-[7px] cursor-pointer hover:bg-muted"
        @click="toggle(item.id)"
      >
        <span
          class="inline-flex size-[18px] rounded-full items-center justify-center shrink-0 box-border"
          :class="item.done ? 'bg-success' : 'border-[1.5px] border-dashed border-slate-300'"
        >
          <Icon v-if="item.done" name="lucide:check" class="size-[11px] text-white" />
        </span>
        <span class="text-[13px]" :class="item.done ? 'text-dimmed line-through' : 'text-default'">{{ item.label }}</span>
        <Icon v-if="!item.done" name="lucide:chevron-right" class="size-3.5 text-dimmed ml-auto" />
      </div>
    </div>

    <UButton
      v-if="isComplete && allowClaim"
      :label="t('onboarding.checklist.claimButton', { xp: xpReward.toLocaleString() })"
      icon="lucide:zap"
      color="primary"
      block
      class="mt-4"
      @click="claimXp"
    />
  </UPageCard>

  <UModal v-model:open="claimModalOpen">
    <template #title>
      <span class="sr-only">{{ t('onboarding.checklist.claimModal.title') }}</span>
    </template>
    <template #body>
      <div class="flex flex-col items-center text-center gap-3 py-2">
        <div class="flex items-center justify-center size-12 rounded-full bg-success/10 text-success">
          <Icon name="lucide:party-popper" class="size-6" />
        </div>
        <div class="font-heading font-bold text-lg text-highlighted">
          {{ t('onboarding.checklist.claimModal.title') }}
        </div>
        <p class="text-sm text-muted">{{ t('onboarding.checklist.claimModal.body', { xp: xpReward.toLocaleString() }) }}</p>
        <UButton :label="t('onboarding.checklist.claimModal.confirm')" color="primary" class="mt-1" @click="claimModalOpen = false" />
      </div>
    </template>
  </UModal>
</template>
