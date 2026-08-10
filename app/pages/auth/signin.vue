<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { isEmailish, useMockAuth } from '~/composables/useMockAuth'
import { signUpTo, useAuthReturn } from '~/composables/useAuthIntent'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const { pending, submit } = useMockAuth()

const state = reactive({ email: '', password: '' })
const showPassword = ref(false)

function validate(values: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!values.email.trim()) errors.push({ name: 'email', message: t('auth.errors.emailRequired') })
  else if (!isEmailish(values.email)) errors.push({ name: 'email', message: t('auth.errors.emailInvalid') })
  if (!values.password) errors.push({ name: 'password', message: t('auth.errors.passwordRequired') })
  return errors
}

const { destination, returnLabel, finish } = useAuthReturn()

// Signing in means an account that already exists, with programs and a streak
// behind it — that's `onboarded`, where signing up gives a fresh account. Both
// return to whatever sent the learner here.
const onSubmit = () => submit(() => finish('onboarded'))
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1.5">
      <h1 class="font-heading text-3xl font-bold tracking-[-0.5px] text-highlighted">
        {{ t('auth.signIn.title') }}
      </h1>
      <p class="text-sm text-muted">
        {{ t('auth.signIn.noAccount') }}
        <ULink :to="signUpTo(destination)" class="font-semibold text-primary-600">{{ t('auth.signIn.createOne') }}</ULink>
      </p>

      <p v-if="returnLabel" class="text-sm text-muted">
        <UIcon name="lucide:corner-down-left" class="size-4 align-[-2px] mr-1 text-dimmed" />
        {{ t('auth.returnTo', { destination: returnLabel }) }}
      </p>
    </div>

    <AuthSocialButtons :disabled="pending" @select="onSubmit" />

    <USeparator :label="t('auth.or')" />

    <UForm :state="state" :validate="validate" class="flex flex-col gap-4" @submit="onSubmit">
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

      <UFormField name="password" required>
        <!-- The label row carries the reset link, so it sits beside the field's
             own label rather than below the input where it reads as a hint. -->
        <template #label>
          <span class="flex w-full items-center justify-between gap-2">
            <span>{{ t('auth.fields.password') }}</span>
            <ULink to="/auth/forgot" class="text-xs font-normal text-muted hover:text-default">
              {{ t('auth.signIn.forgot') }}
            </ULink>
          </span>
        </template>
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          size="lg"
          class="w-full"
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <!-- A real button so it's tabbable, and `aria-pressed` so a screen
                 reader hears the state rather than just the icon swap. -->
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

      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        :loading="pending"
        :label="t('auth.signIn.submit')"
        class="mt-2"
      />
    </UForm>

    <p class="text-center text-xs text-dimmed">{{ t('auth.terms') }}</p>
  </div>
</template>
