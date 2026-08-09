<script setup lang="ts">
import { pathChoices } from '~/composables/useHomeMockData'
import { useWhatsNext } from '~/composables/useWhatsNext'

const { t } = useI18n()
const whatsNext = useWhatsNext()

// M5's beginner/non-beginner split: beginners go to the workshop catalog,
// non-beginners to Threadbare's contribute section. The answer has no
// profile field to persist to yet — read once per session, not written to
// any mock data store. Known gap, not an oversight.
const vacuumAnswer = ref<'no' | 'a-little' | 'yes' | null>(null)
function answerVacuum(answer: 'no' | 'a-little' | 'yes') {
  vacuumAnswer.value = answer
  navigateTo(answer === 'yes' ? '/play/threadbare#contribute' : '/learn')
}
</script>

<template>
  <section>
    <template v-if="whatsNext.kind === 'guest'">
      <!-- Plain string, matching the rest of this page's section titles
           (Continue learning, Start learning, ...), none of which are
           i18n'd yet — this pass isn't the one to convert the whole page. -->
      <SectionTitle title="What brings you here?" />
      <PathChoiceCards :choices="pathChoices" class="mt-6" />
    </template>

    <ChecklistMirror
      v-else-if="whatsNext.kind === 'checklist'"
      flow-id="2a"
      :context-id="whatsNext.contextId"
      :context="whatsNext.context"
      :to="whatsNext.to"
    />

    <UPageCard
      v-else-if="whatsNext.kind === 'next-step'"
      :to="whatsNext.to"
      variant="outline"
      class="cursor-pointer transition-shadow duration-250 hover:shadow-xl rounded-2xl"
    >
      <div class="flex items-center gap-3">
        <div class="size-9 rounded-full bg-primary-50 text-primary flex items-center justify-center shrink-0">
          <Icon name="lucide:play" class="size-4" />
        </div>
        <p class="text-sm text-default">{{ t('onboarding.whatsNext.nextStep', { label: whatsNext.label }) }}</p>
        <Icon name="lucide:chevron-right" class="size-4 text-dimmed ml-auto shrink-0" />
      </div>
    </UPageCard>

    <UPageCard v-else variant="outline" class="rounded-2xl">
      <p class="text-sm font-semibold text-highlighted">{{ t('onboarding.whatsNext.vacuum.question') }}</p>
      <div class="flex gap-2 mt-3">
        <UButton color="neutral" variant="outline" :label="t('onboarding.whatsNext.vacuum.no')" @click="answerVacuum('no')" />
        <UButton color="neutral" variant="outline" :label="t('onboarding.whatsNext.vacuum.aLittle')" @click="answerVacuum('a-little')" />
        <UButton color="primary" variant="soft" :label="t('onboarding.whatsNext.vacuum.yes')" @click="answerVacuum('yes')" />
      </div>
    </UPageCard>
  </section>
</template>
