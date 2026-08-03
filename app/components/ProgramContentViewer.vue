<script setup lang="ts">
import type { FlatCurriculumItem } from '~/composables/useProgramCurriculum'
import type { DeliverableSubmission } from '~/composables/useProgramProgress'

const props = defineProps<{
  item: FlatCurriculumItem
  isCompleted: boolean
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
</script>

<template>
  <div class="flex-1 p-8 overflow-y-auto">
    <!-- Mirrors ProgramCurriculumAccordion's module container (rounded-2xl
         border, color-tinted badge/title) so the active module's identity
         carries over from the sidebar into the content viewer. -->
    <div class="rounded-2xl border border-default p-8">
      <div class="flex items-center gap-2.5">
        <UBadge
          :label="item.moduleNumber"
          :color="item.moduleColor"
          variant="soft"
          class="rounded-full size-7 justify-center p-0 shrink-0"
        />
        <span class="font-heading font-bold text-sm" :class="`text-${item.moduleColor}-600`">
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
          <div class="font-heading font-bold text-highlighted">{{ t('program.viewer.deliverable.descriptionHeading') }}</div>
          <p class="mt-2 text-sm text-default">{{ t('program.viewer.deliverable.introBody') }}</p>
          <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.shareIntro') }}</p>
          <ul class="mt-1 list-disc pl-5 text-sm text-default">
            <li>{{ t('program.viewer.deliverable.shareScreenshots') }}</li>
            <li>{{ t('program.viewer.deliverable.shareVideo') }}</li>
            <li>{{ t('program.viewer.deliverable.shareBuild') }}</li>
          </ul>
          <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.submitStepsHeading') }}</p>
          <ul class="mt-1 list-disc pl-5 text-sm text-default">
            <li>{{ t('program.viewer.deliverable.submitStep1') }}</li>
            <li>{{ t('program.viewer.deliverable.submitStep2') }}</li>
            <li>{{ t('program.viewer.deliverable.submitStep3') }}</li>
          </ul>
        </div>

        <div class="mt-6 rounded-xl border border-default p-6">
          <div class="font-heading font-bold text-highlighted">
            {{ t('program.viewer.deliverable.milestone', { number: item.moduleNumber, total: totalModules, title: item.moduleTitle }) }}
          </div>
          <div class="mt-3 text-sm font-bold text-default">{{ t('program.viewer.deliverable.acceptanceCriteria') }}</div>
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
            <div class="text-sm font-bold text-highlighted">{{ t('program.viewer.deliverable.yourSubmission') }}</div>
            <p class="mt-2 text-sm text-default">{{ submission.description }}</p>
            <ul v-if="submission.links.length" class="mt-2 list-disc pl-5 text-sm">
              <li v-for="link in submission.links" :key="link">
                <a :href="link" target="_blank" rel="noopener" class="text-primary underline break-all">{{ link }}</a>
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
