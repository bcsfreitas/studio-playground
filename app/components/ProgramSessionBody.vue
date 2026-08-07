<script setup lang="ts">
import type { CurriculumBlock, CurriculumMediaKind } from '~/composables/useProgramMockData'

defineProps<{
  blocks: CurriculumBlock[]
}>()

const { t } = useI18n()

const MEDIA_ICON: Record<CurriculumMediaKind, string> = {
  image: 'lucide:image',
  slideshow: 'lucide:presentation',
  video: 'lucide:circle-play'
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <template v-for="(block, index) in blocks" :key="index">
      <h4
        v-if="block.kind === 'heading'"
        class="font-heading font-bold text-base text-highlighted mt-3 first:mt-0"
      >
        {{ block.text }}
      </h4>

      <p v-else-if="block.kind === 'paragraph'" class="text-sm text-default">
        {{ block.text }}
      </p>

      <component
        :is="block.ordered ? 'ol' : 'ul'"
        v-else-if="block.kind === 'list'"
        class="flex flex-col gap-1.5 pl-5 text-sm text-default"
        :class="block.ordered ? 'list-decimal' : 'list-disc'"
      >
        <li v-for="entry in block.items" :key="entry">{{ entry }}</li>
      </component>

      <UAlert
        v-else-if="block.kind === 'note'"
        :description="block.text"
        icon="lucide:info"
        color="neutral"
        variant="soft"
      />

      <!-- The scraped page shows these as buttons without ever naming a URL, so
           without an href the control renders disabled rather than silently
           linking nowhere. -->
      <UButton
        v-else-if="block.kind === 'link'"
        :label="block.label"
        :to="block.href"
        :target="block.href ? '_blank' : undefined"
        :disabled="!block.href"
        color="primary"
        trailing-icon="lucide:external-link"
        class="self-start"
      />

      <ul v-else-if="block.kind === 'linkList'" class="flex flex-col gap-3">
        <li v-for="entry in block.items" :key="entry.label">
          <ULink
            v-if="entry.href"
            :to="entry.href"
            target="_blank"
            class="font-heading font-bold text-sm text-primary-600"
          >{{ entry.label }}</ULink>
          <span v-else class="font-heading font-bold text-sm text-highlighted">{{ entry.label }}</span>
          <p class="text-sm text-default">{{ entry.description }}</p>
        </li>
      </ul>

      <UEmpty
        v-else-if="block.kind === 'media'"
        :icon="MEDIA_ICON[block.media]"
        :title="t('program.viewer.content.placeholder', { contentType: block.media })"
        :description="block.caption"
        variant="soft"
        :ui="{ root: 'border border-dashed border-default rounded-xl' }"
      />

      <UCard
        v-else-if="block.kind === 'task'"
        variant="subtle"
        :ui="{ root: 'rounded-xl', body: 'p-4 sm:p-4' }"
      >
        <div class="flex items-start gap-3">
          <h5 class="flex-1 font-heading font-bold text-sm text-highlighted">{{ block.title }}</h5>
          <UButton
            v-if="block.hasTutorial"
            :label="t('program.viewer.content.tutorial')"
            icon="lucide:graduation-cap"
            color="neutral"
            variant="subtle"
            size="xs"
            disabled
            class="shrink-0"
          />
        </div>

        <p class="mt-2 text-sm text-default">{{ block.text }}</p>

        <h6 class="mt-3 text-sm font-bold text-default">
          {{ t('program.viewer.deliverable.acceptanceCriteria') }}
        </h6>
        <ul class="mt-1 flex flex-col gap-1.5 list-disc pl-5 text-sm text-default">
          <li v-for="criterion in block.acceptanceCriteria" :key="criterion">{{ criterion }}</li>
        </ul>
      </UCard>
    </template>
  </div>
</template>
