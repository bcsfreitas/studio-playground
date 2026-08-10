<script setup lang="ts">
import type { CurriculumItem } from '~/composables/useProgramMockData'
import type { DeliverableSubmission, useProgramProgress } from '~/composables/useProgramProgress'

const props = defineProps<{
  item: CurriculumItem | null
  progress: ReturnType<typeof useProgramProgress> | null
}>()

const open = defineModel<boolean>('open', { required: true })

// The drawer records progress but never decides what to open next — advancing
// is the classroom's job, since only it knows the flat step order.
const emit = defineEmits<{
  complete: [itemId: string]
  submit: [itemId: string, submission: DeliverableSubmission]
}>()

const { t } = useI18n()

// One draft at a time is enough: only one step is ever open, so the form resets
// on each open and on each step change rather than tracking state per item.
// Both triggers are needed — completing a step swaps `item` for the next one
// without ever closing the drawer, and reopening the same step should start
// clean rather than resume a half-typed submission.
const isStarted = ref(false)
const description = ref('')
const links = ref<string[]>([])
watch([() => props.item?.id, open], ([, isOpen], [, wasOpen]) => {
  if (!isOpen && wasOpen) return
  isStarted.value = false
  description.value = ''
  links.value = []
})

const isDeliverable = computed(() => props.item?.type === 'deliverable')
const isCompleted = computed(() => Boolean(props.item && props.progress?.isCompleted(props.item.id)))
const submission = computed(() => (props.item ? props.progress?.getSubmission(props.item.id) : undefined))

function submitDeliverable() {
  const trimmed = description.value.trim()
  if (!props.item || !trimmed) return
  emit('submit', props.item.id, { description: trimmed, links: links.value.filter(Boolean) })
}

// Submissions are free-text pasted by the learner into localStorage, so guard
// against non-http(s) values (e.g. a stray `javascript:` URL) before linkifying.
function isHttpLink(link: string) {
  return /^https?:\/\//i.test(link)
}
</script>

<template>
  <UDrawer
    v-model:open="open"
    :title="item?.title"
    close
    handle-only
    :handle="false"
    :ui="{
      // `dvh` rather than `%`: a percentage on a fixed element resolves against
      // the large viewport, which hides the drawer's bottom under mobile
      // browser chrome. No fixed height — unlike ToolDrawer's iframe this
      // content has intrinsic height, so short steps stay short.
      //
      // `z-[250]` because the drawer theme sets no z-index at all, and the
      // program page's DevPreviewBar is `z-[200]` in the same stacking context.
      content: 'max-h-[85dvh] z-[250]',
      overlay: 'z-[250]',
      header: 'px-6 py-4 border-b border-default',
      body: 'px-6 py-5',
      footer: 'px-6 py-4 border-t border-default'
    }"
  >
    <!-- Gated on the step rather than on `open`: the drawer slides out over a
         few hundred milliseconds, and tearing the content down the instant it
         starts closing empties the panel mid-animation. -->
    <template v-if="item && progress" #body>
      <template v-if="isDeliverable">
        <!-- A milestone's own page content sits above the submission form: the
             learner reads the issues, then hands in. -->
        <div v-if="item.body?.length" class="mb-6 flex flex-col gap-6">
          <ProgramSessionBody :blocks="item.body" />
          <USeparator />
        </div>
        <p class="text-sm text-default">{{ t('program.viewer.deliverable.introBody') }}</p>
        <p class="mt-3 text-sm text-default">{{ t('program.viewer.deliverable.shareIntro') }}</p>
        <ul class="mt-1 list-disc pl-5 text-sm text-default">
          <li>{{ t('program.viewer.deliverable.shareScreenshots') }}</li>
          <li>{{ t('program.viewer.deliverable.shareVideo') }}</li>
          <li>{{ t('program.viewer.deliverable.shareBuild') }}</li>
        </ul>

        <!-- `variant="subtle"` matches the task blocks ProgramSessionBody
             renders, so a milestone's own criteria don't read as a different
             kind of surface from the ones inside its body. -->
        <UCard
          v-if="item.acceptanceCriteria?.length"
          variant="subtle"
          :ui="{ root: 'mt-4 rounded-xl', body: 'p-4 sm:p-4' }"
        >
          <h4 class="text-sm font-bold text-default">{{ t('program.viewer.deliverable.acceptanceCriteria') }}</h4>
          <ul class="mt-1 list-disc pl-5 text-sm text-default">
            <li v-for="criterion in item.acceptanceCriteria" :key="criterion">{{ criterion }}</li>
          </ul>
        </UCard>

        <UCard
          v-if="isCompleted && submission"
          variant="subtle"
          :ui="{ root: 'mt-4 rounded-xl', body: 'p-4 sm:p-4' }"
        >
          <h4 class="text-sm font-bold text-highlighted">{{ t('program.viewer.deliverable.yourSubmission') }}</h4>
          <p class="mt-2 text-sm text-default">{{ submission.description }}</p>
          <ul v-if="submission.links.length" class="mt-2 list-disc pl-5 text-sm">
            <li v-for="link in submission.links" :key="link">
              <ULink
                v-if="isHttpLink(link)"
                :to="link"
                target="_blank"
                raw
                class="text-primary underline break-all"
              >{{ link }}</ULink>
              <span v-else class="break-all">{{ link }}</span>
            </li>
          </ul>
        </UCard>

        <div v-else-if="!isCompleted && isStarted" class="mt-4 flex flex-col gap-3">
          <UTextarea
            v-model="description"
            :placeholder="t('program.viewer.deliverable.descriptionPlaceholder')"
            :rows="4"
          />
          <UInputTags v-model="links" :placeholder="t('program.viewer.deliverable.linksPlaceholder')" />
        </div>
      </template>

      <template v-else>
        <ProgramSessionBody v-if="item.body?.length" :blocks="item.body" />
        <!-- Same UEmpty treatment ProgramSessionBody gives an unrendered media
             block, so a step with no authored content at all looks like the
             placeholders inside one that has some. -->
        <UEmpty
          v-else
          icon="lucide:file-text"
          :title="t('program.viewer.content.placeholder', { contentType: item.contentType })"
          variant="soft"
          :ui="{ root: 'border border-dashed border-default rounded-xl' }"
        />
      </template>
    </template>

    <!-- The action lives in the footer so it stays reachable without scrolling
         to the end of a long milestone. -->
    <template v-if="item && progress" #footer>
      <UBadge
        v-if="isCompleted"
        :label="t('program.viewer.actions.completed')"
        color="success"
        variant="soft"
      />
      <UButton
        v-else-if="!isDeliverable"
        :label="t('program.viewer.actions.markComplete')"
        icon="lucide:check"
        color="primary"
        @click="emit('complete', item.id)"
      />
      <UButton
        v-else-if="isStarted"
        :label="t('program.viewer.deliverable.submit')"
        color="primary"
        :disabled="!description.trim()"
        @click="submitDeliverable"
      />
      <UButton
        v-else
        :label="t('program.viewer.deliverable.startTask')"
        color="primary"
        @click="isStarted = true"
      />
    </template>
  </UDrawer>
</template>
