<script setup lang="ts">
import type { FlatCurriculumItem } from '~/composables/useProgramCurriculum'
import type { DeliverableSubmission } from '~/composables/useProgramProgress'

const props = defineProps<{
  item: FlatCurriculumItem
  isCompleted: boolean
  moduleNumber: number
  totalModules: number
  submission: DeliverableSubmission | undefined
}>()

const emit = defineEmits<{
  'mark-complete': []
  'next-item': []
  'submit-deliverable': [payload: DeliverableSubmission]
}>()

const { t } = useI18n()

const isStarted = ref(false)
const description = ref('')
const links = ref<string[]>([])

function submitDeliverable() {
  const trimmed = description.value.trim()
  if (!trimmed) return
  emit('submit-deliverable', { description: trimmed, links: links.value.filter(Boolean) })
}

// Submissions are free-text pasted by the learner into localStorage, so guard
// against non-http(s) values (e.g. a stray `javascript:` URL) before linkifying.
function isHttpLink(link: string) {
  return /^https?:\/\//i.test(link)
}
</script>

<template>
  <div class="flex-1 p-8 overflow-y-auto">
    <!-- Mirrors ProgramCurriculumAccordion's module container (rounded-2xl
         border) so the active module's identity carries over from the
         sidebar into the content viewer. -->
    <div class="rounded-2xl border border-default p-8">
      <div class="flex items-center gap-2.5">
        <span class="font-heading font-bold text-sm text-primary-600">
          {{ item.moduleTitle }}
        </span>
        <span v-if="item.type !== 'deliverable'" class="text-xs text-muted uppercase">· {{ item.contentType }}</span>
      </div>

      <template v-if="item.type === 'deliverable'">
        <div class="flex items-start justify-between gap-4 mt-3">
          <h1 class="text-2xl font-heading font-bold text-highlighted">{{ item.title }}</h1>
          <UButton
            v-if="!isCompleted && !isStarted"
            :label="t('program.viewer.deliverable.startTask')"
            color="primary"
            class="shrink-0"
            @click="isStarted = true"
          />
        </div>

        <div class="mt-6">
          <h2 class="font-heading font-bold text-highlighted">{{ t('program.viewer.deliverable.descriptionHeading') }}</h2>
          <p class="mt-2 text-sm text-default">{{ t('program.viewer.deliverable.introBody') }}</p>
          <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.shareIntro') }}</p>
          <ul class="mt-1 list-disc pl-5 text-sm text-default">
            <li>{{ t('program.viewer.deliverable.shareScreenshots') }}</li>
            <li>{{ t('program.viewer.deliverable.shareVideo') }}</li>
            <li>{{ t('program.viewer.deliverable.shareBuild') }}</li>
          </ul>
          <template v-if="!isStarted && !isCompleted">
            <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.submitStepsHeading') }}</p>
            <ul class="mt-1 list-disc pl-5 text-sm text-default">
              <li>{{ t('program.viewer.deliverable.submitStep1') }}</li>
              <li>{{ t('program.viewer.deliverable.submitStep2') }}</li>
              <li>{{ t('program.viewer.deliverable.submitStep3') }}</li>
            </ul>
          </template>
        </div>

        <div class="mt-6 rounded-xl border border-default p-6">
          <h2 class="font-heading font-bold text-highlighted">
            {{ t('program.viewer.deliverable.milestone', { number: moduleNumber, total: totalModules, title: item.moduleTitle }) }}
          </h2>
          <h3 class="mt-3 text-sm font-bold text-default">{{ t('program.viewer.deliverable.acceptanceCriteria') }}</h3>
          <ul class="mt-1 list-disc pl-5 text-sm text-default">
            <li v-for="criterion in item.acceptanceCriteria" :key="criterion">{{ criterion }}</li>
          </ul>
        </div>

        <div class="mt-4 text-sm text-muted">+{{ item.xp }} XP</div>

        <div v-if="isCompleted" class="mt-6 flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <UBadge :label="t('program.viewer.actions.completed')" color="success" variant="soft" />
            <UButton :label="t('program.viewer.actions.nextItem')" variant="outline" @click="$emit('next-item')" />
          </div>
          <div v-if="submission" class="rounded-xl border border-default p-4">
            <h3 class="text-sm font-bold text-highlighted">{{ t('program.viewer.deliverable.yourSubmission') }}</h3>
            <p class="mt-2 text-sm text-default">{{ submission.description }}</p>
            <ul v-if="submission.links.length" class="mt-2 list-disc pl-5 text-sm">
              <li v-for="link in submission.links" :key="link">
                <ULink
                  v-if="isHttpLink(link)"
                  :to="link"
                  target="_blank"
                  raw
                  class="text-primary underline break-all"
                >
                  {{ link }}
                </ULink>
                <span v-else class="break-all">{{ link }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div v-else-if="isStarted" class="mt-6 flex flex-col gap-3">
          <UTextarea
            v-model="description"
            :placeholder="t('program.viewer.deliverable.descriptionPlaceholder')"
            :rows="4"
          />
          <UInputTags
            v-model="links"
            :placeholder="t('program.viewer.deliverable.linksPlaceholder')"
          />
          <UButton
            :label="t('program.viewer.deliverable.submit')"
            color="primary"
            class="self-start"
            :disabled="!description.trim()"
            @click="submitDeliverable"
          />
        </div>
      </template>

      <template v-else>
        <h1 class="text-2xl font-heading font-bold text-highlighted mt-3">{{ item.title }}</h1>

        <div class="mt-6 rounded-xl border border-dashed border-default p-12 text-center text-muted">
          {{ t('program.viewer.content.placeholder', { contentType: item.contentType }) }}
        </div>

        <div class="mt-6 flex items-center gap-3">
          <span v-if="item.xp" class="text-sm text-muted">+{{ item.xp }} XP</span>

          <UButton
            v-if="!isCompleted"
            :label="t('program.viewer.actions.markComplete')"
            color="primary"
            @click="$emit('mark-complete')"
          />
          <template v-else>
            <UBadge :label="t('program.viewer.actions.completed')" color="success" variant="soft" />
            <UButton :label="t('program.viewer.actions.nextItem')" variant="outline" @click="$emit('next-item')" />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
