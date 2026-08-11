<script setup lang="ts">
import { pathChoices, type PathChoice } from '~/composables/useHomeMockData'
import { usePreviewState } from '~/composables/usePreviewState'
import { useOnboardingIntent, type OnboardingIntent } from '~/composables/useOnboardingIntent'

const { t } = useI18n()
const { isGuest, isFresh } = usePreviewState()
const { intent, setIntent } = useOnboardingIntent()

// Fresh Account's answer to the same three cards a guest sees, but signed
// in: the pick doesn't navigate, it tags the account (M4 fallback question)
// and reveals the matching checklist once the "tailoring" beat finishes.
const PATH_CHOICE_INTENTS: Record<string, OnboardingIntent> = {
  learn: 'learner',
  teach: 'educator',
  build: 'contributor'
}
const tailoringModalOpen = ref(false)
function selectIntent(choice: PathChoice) {
  const picked = PATH_CHOICE_INTENTS[choice.id]
  if (!picked) return
  tailoringModalOpen.value = true
  setTimeout(() => {
    tailoringModalOpen.value = false
    setIntent(picked)
  }, 5000)
}
</script>

<template>
  <section v-if="isGuest">
    <!-- Plain string, matching the rest of this page's section titles
         (Continue learning, Start learning, ...), none of which are
         i18n'd yet — this pass isn't the one to convert the whole page. -->
    <SectionTitle title="What brings you here?" />
    <PathChoiceCards :choices="pathChoices" class="mt-6" />
  </section>

  <section v-else-if="isFresh && !intent">
    <SectionTitle :title="t('onboarding.intent.title')" />
    <PathChoiceCards :choices="pathChoices" intercept-select class="mt-6" @select="selectIntent" />

    <UModal v-model:open="tailoringModalOpen" :dismissible="false" :close="false">
      <template #title>
        <span class="sr-only">{{ t('onboarding.intent.tailoring.title') }}</span>
      </template>
      <template #body>
        <div class="flex flex-col items-center text-center gap-3 py-2">
          <Icon name="lucide:loader-circle" class="size-8 text-primary animate-spin" />
          <div class="font-heading font-bold text-lg text-highlighted">
            {{ t('onboarding.intent.tailoring.title') }}
          </div>
          <p class="text-sm text-muted">{{ t('onboarding.intent.tailoring.body') }}</p>
        </div>
      </template>
    </UModal>
  </section>
</template>
