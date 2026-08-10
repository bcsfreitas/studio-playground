<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { isEmailish, useMockAuth } from '~/composables/useMockAuth'
import { signInTo, useAuthReturn } from '~/composables/useAuthIntent'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const route = useRoute()
const { pending, submit } = useMockAuth()

const state = reactive({ name: '', email: '', password: '', birthday: '' })
const showPassword = ref(false)

const MIN_PASSWORD_LENGTH = 8
const CONSENT_AGE = 13

function ageFrom(birthday: string): number | null {
  if (!birthday) return null
  const born = new Date(birthday)
  if (Number.isNaN(born.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - born.getFullYear()
  // Roll back a year if this year's birthday hasn't happened yet.
  const monthDelta = now.getMonth() - born.getMonth()
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < born.getDate())) age -= 1
  return age
}

// Under-13s can't consent for themselves, so the flow tells them up front that
// a grown-up gets pulled in rather than springing it after they've filled the
// form. `kids` teal is DESIGN.md's reserved colour for exactly this surface.
const needsGuardian = computed(() => {
  const age = ageFrom(state.birthday)
  return age !== null && age < CONSENT_AGE
})

function validate(values: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!values.name.trim()) errors.push({ name: 'name', message: t('auth.errors.nameRequired') })
  if (!values.email.trim()) errors.push({ name: 'email', message: t('auth.errors.emailRequired') })
  else if (!isEmailish(values.email)) errors.push({ name: 'email', message: t('auth.errors.emailInvalid') })
  if (!values.password) errors.push({ name: 'password', message: t('auth.errors.passwordRequired') })
  else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.push({ name: 'password', message: t('auth.errors.passwordShort', { count: MIN_PASSWORD_LENGTH }) })
  }
  if (!values.birthday) errors.push({ name: 'birthday', message: t('auth.errors.birthdayRequired') })
  return errors
}

const { destination, returnLabel, carryQuery } = useAuthReturn()

// The verify screen names the address it sent to, so it travels in the query
// rather than in state that a refresh would lose — and `carryQuery` hands the
// return-to intent along the same way, so the last step still knows where the
// learner was headed.
const onSubmit = () => submit(() => navigateTo({
  path: '/auth/verify',
  query: carryQuery({ email: state.email.trim() })
}))

// The path cards on the guest home link here with `?path=learn|teach|build`.
// Carried through so the copy can acknowledge the choice; nothing else reads it
// yet, because there's no account to attach it to.
const chosenPath = computed(() => {
  const path = route.query.path
  return path === 'learn' || path === 'teach' || path === 'build' ? path : null
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1.5">
      <h1 class="font-heading text-3xl font-bold tracking-[-0.5px] text-highlighted">
        {{ t('auth.signUp.title') }}
      </h1>
      <p class="text-sm text-muted">
        {{ chosenPath ? t(`auth.signUp.path.${chosenPath}`) : t('auth.signUp.subtitle') }}
      </p>
      <p class="text-sm text-muted">
        {{ t('auth.signUp.haveAccount') }}
        <ULink :to="signInTo(destination)" class="font-semibold text-primary-600">{{ t('auth.signUp.signIn') }}</ULink>
      </p>

      <!-- Says the intent out loud: the learner clicked Enroll, and this is the
           promise that they'll be put back where they were. -->
      <p v-if="returnLabel" class="text-sm text-muted">
        <UIcon name="lucide:corner-down-left" class="size-4 align-[-2px] mr-1 text-dimmed" />
        {{ t('auth.returnTo', { destination: returnLabel }) }}
      </p>
    </div>

    <AuthSocialButtons :disabled="pending" @select="onSubmit" />

    <USeparator :label="t('auth.or')" />

    <UForm :state="state" :validate="validate" class="flex flex-col gap-4" @submit="onSubmit">
      <UFormField :label="t('auth.fields.name')" name="name" required>
        <UInput v-model="state.name" autocomplete="nickname" size="lg" class="w-full" />
      </UFormField>

      <UFormField :label="t('auth.fields.email')" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="t('auth.fields.password')"
        name="password"
        required
        :hint="t('auth.fields.passwordHint', { count: MIN_PASSWORD_LENGTH })"
      >
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          size="lg"
          class="w-full"
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
              :aria-label="t(showPassword ? 'auth.fields.hidePassword' : 'auth.fields.showPassword')"
              :aria-pressed="showPassword"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField
        :label="t('auth.fields.birthday')"
        name="birthday"
        required
        :description="t('auth.fields.birthdayHelp')"
      >
        <UInput v-model="state.birthday" type="date" size="lg" class="w-full" />
      </UFormField>

      <UAlert
        v-if="needsGuardian"
        icon="lucide:shield-check"
        color="kids"
        variant="soft"
        :title="t('auth.signUp.guardianTitle')"
        :description="t('auth.signUp.guardianBody')"
      />

      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        :loading="pending"
        :label="t('auth.signUp.submit')"
        class="mt-2"
      />
    </UForm>

    <p class="text-center text-xs text-dimmed">{{ t('auth.terms') }}</p>
  </div>
</template>
