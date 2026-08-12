<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { isEmailish, requiredError } from '~/composables/useMockAuth'
import { useMentorStatus } from '~/composables/useMentorStatus'

const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const { grantMentorStatus } = useMentorStatus()

const step = ref<'form' | 'processing'>('form')
const state = reactive({ schoolEmail: '', schoolName: '', role: '' })

// Deliberately longer than useMockAuth's 900ms (an "instant-ish request")
// and shorter than OnboardingIntentPrompt's 5000ms (a full onboarding
// tailoring beat) — this is meant to read as a real verification step.
const PROCESSING_MS = 2500

function validate(values: typeof state): FormError[] {
  const errors: FormError[] = [
    ...requiredError('schoolEmail', values.schoolEmail, t('program.mentorQualify.errors.emailRequired'))
  ]
  if (values.schoolEmail.trim() && !isEmailish(values.schoolEmail)) {
    errors.push({ name: 'schoolEmail', message: t('program.mentorQualify.errors.emailInvalid') })
  }
  errors.push(...requiredError('schoolName', values.schoolName, t('program.mentorQualify.errors.schoolNameRequired')))
  errors.push(...requiredError('role', values.role, t('program.mentorQualify.errors.roleRequired')))
  return errors
}

const isValid = computed(() =>
  isEmailish(state.schoolEmail) && !!state.schoolName.trim() && !!state.role.trim()
)

function onSubmit() {
  if (!isValid.value) return
  step.value = 'processing'
  setTimeout(() => {
    grantMentorStatus()
    open.value = false
    step.value = 'form'
    navigateTo('/teach')
  }, PROCESSING_MS)
}

function onCancel() {
  open.value = false
}
</script>

<template>
  <!-- Same full-screen-override technique as CreateCohortDrawer.vue. `close`/
       `dismissible` are tied to `step` so the processing screen can't be
       escaped mid-flight — there's no partial "mentor, but unverified" state
       to land in if someone closes it early. -->
  <UDrawer
    v-model:open="open"
    :title="step === 'form' ? t('program.mentorQualify.title') : t('program.mentorQualify.processing.title')"
    :close="step === 'form'"
    :dismissible="step === 'form'"
    handle-only
    :handle="false"
    :ui="{
      content: 'h-[100dvh] max-h-[100dvh] overflow-hidden z-[250]',
      overlay: 'z-[250]',
      container: 'h-full overflow-y-auto',
      header: 'px-6 py-4 border-b border-default shrink-0',
      footer: 'px-6 py-4 border-t border-default shrink-0'
    }"
  >
    <template #body>
      <div v-if="step === 'form'" class="max-w-lg mx-auto flex flex-col gap-6 py-4">
        <div>
          <h2 class="font-heading font-bold text-2xl text-highlighted">{{ t('program.mentorQualify.title') }}</h2>
          <p class="mt-1 text-muted">{{ t('program.mentorQualify.intro') }}</p>
        </div>

        <UForm id="mentor-qualify-form" :state="state" :validate="validate" class="flex flex-col gap-4" @submit="onSubmit">
          <UFormField :label="t('program.mentorQualify.fields.schoolEmail')" name="schoolEmail" required>
            <UInput
              v-model="state.schoolEmail"
              type="email"
              autocomplete="email"
              placeholder="you@yourschool.edu"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('program.mentorQualify.fields.schoolName')" name="schoolName" required>
            <UInput v-model="state.schoolName" size="lg" class="w-full" />
          </UFormField>

          <UFormField :label="t('program.mentorQualify.fields.role')" name="role" required>
            <UInput v-model="state.role" size="lg" class="w-full" />
          </UFormField>
        </UForm>
      </div>

      <div v-else class="flex flex-col items-center text-center gap-3 py-2 h-full justify-center">
        <UIcon name="lucide:loader-circle" class="size-8 text-primary animate-spin" />
        <div class="font-heading font-bold text-lg text-highlighted">{{ t('program.mentorQualify.processing.title') }}</div>
        <p class="text-sm text-muted">{{ t('program.mentorQualify.processing.body') }}</p>
      </div>
    </template>

    <template v-if="step === 'form'" #footer>
      <div class="w-full flex gap-3">
        <UButton
          :label="t('program.mentorQualify.cancel')"
          color="neutral"
          variant="outline"
          class="flex-1 justify-center"
          @click="onCancel"
        />
        <UButton
          type="submit"
          form="mentor-qualify-form"
          :label="t('program.mentorQualify.submit')"
          color="primary"
          :disabled="!isValid"
          class="flex-1 justify-center"
        />
      </div>
    </template>
  </UDrawer>
</template>
