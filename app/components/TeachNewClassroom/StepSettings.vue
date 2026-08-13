<script setup lang="ts">
import type { MentorClassroomAgeRange } from '~/composables/useProgramMockData'

defineProps<{
  courseTitle?: string
}>()

const name = defineModel<string>('name', { required: true })
const ageRange = defineModel<MentorClassroomAgeRange | null>('ageRange', { required: true })
const consent = defineModel<boolean>('consent', { required: true })
const siloed = defineModel<boolean>('siloed', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const { t } = useI18n()

const AGE_RANGES: MentorClassroomAgeRange[] = ['8-10', '10-12', '12-14', '14-16', '16-18', 'mixed']

const ageRangeOptions = computed(() => AGE_RANGES.map(value => ({
  label: t(`teach.new.wizard.settings.ageRanges.${value}`),
  value
})))

const canSubmit = computed(() => !!name.value.trim() && !!ageRange.value && consent.value)
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center">
    <div class="max-w-lg mx-auto flex w-full flex-col gap-6 py-4">
      <div>
        <h2 class="font-heading text-2xl font-bold text-highlighted">{{ t('teach.new.wizard.settings.title') }}</h2>
        <p v-if="courseTitle" class="mt-1 text-sm text-muted">{{ t('teach.new.wizard.settings.courseLabel', { title: courseTitle }) }}</p>
      </div>

      <UFormField :label="t('teach.new.wizard.settings.nameLabel')" required>
        <UInput
          v-model="name"
          :placeholder="t('teach.new.wizard.settings.namePlaceholder')"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('teach.new.wizard.settings.ageRangeLabel')">
        <USelect
          v-model="ageRange"
          :items="ageRangeOptions"
          :placeholder="t('teach.new.wizard.settings.ageRangePlaceholder')"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UCheckbox v-model="consent" required>
        <template #label>
          <span>
            {{ t('teach.new.wizard.settings.consent.prefix') }}<a href="#" class="underline font-medium">{{ t('teach.new.wizard.settings.consent.linkText') }}</a>{{ t('teach.new.wizard.settings.consent.suffix') }}
          </span>
        </template>
      </UCheckbox>

      <div class="flex items-center gap-2">
        <UCheckbox v-model="siloed" :label="t('teach.new.wizard.settings.silo.label')" />
        <UTooltip :text="t('teach.new.wizard.settings.silo.ndpaTooltip')">
          <UBadge color="neutral" variant="subtle" size="sm" class="inline-flex items-center gap-1">
            <UIcon name="lucide:info" class="size-3.5" />
            {{ t('teach.new.wizard.settings.silo.ndpaBadge') }}
          </UBadge>
        </UTooltip>
      </div>

      <UButton
        :label="t('teach.new.wizard.settings.submit')"
        color="primary"
        size="lg"
        block
        :disabled="!canSubmit"
        @click="emit('submit')"
      />
    </div>
  </div>
</template>
