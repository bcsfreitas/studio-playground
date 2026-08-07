<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { isEmailish, useMockAuth } from '~/composables/useMockAuth'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const { pending, submit } = useMockAuth()

const state = reactive({ email: '' })

// "Check your inbox" is the outcome of this screen, not a place to navigate to,
// so it's a second state here rather than a fifth route.
const sent = ref(false)

function validate(values: typeof state): FormError[] {
  if (!values.email.trim()) return [{ name: 'email', message: t('auth.errors.emailRequired') }]
  if (!isEmailish(values.email)) return [{ name: 'email', message: t('auth.errors.emailInvalid') }]
  return []
}

const onSubmit = () => submit(() => {
  sent.value = true
})
</script>

<template>
  <div v-if="!sent" class="flex flex-col gap-6">
    <div class="flex flex-col gap-1.5">
      <h1 class="font-heading text-3xl font-bold tracking-[-0.5px] text-highlighted">
        {{ t('auth.forgot.title') }}
      </h1>
      <p class="text-sm text-muted">{{ t('auth.forgot.subtitle') }}</p>
    </div>

    <UForm :state="state" :validate="validate" class="flex flex-col gap-4" @submit="onSubmit">
      <UFormField :label="t('auth.fields.email')" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          size="lg"
          autofocus
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        :loading="pending"
        :label="t('auth.forgot.submit')"
        class="mt-2"
      />
    </UForm>

    <UButton
      to="/auth/signin"
      variant="link"
      color="neutral"
      icon="lucide:arrow-left"
      :label="t('auth.forgot.backToSignIn')"
      class="self-center"
    />
  </div>

  <div v-else class="flex flex-col items-center gap-6 text-center">
    <span class="flex size-14 items-center justify-center rounded-full bg-primary-50">
      <UIcon name="lucide:mail-check" class="size-7 text-primary-600" />
    </span>

    <div class="flex flex-col gap-1.5">
      <h1 class="font-heading text-3xl font-bold tracking-[-0.5px] text-highlighted">
        {{ t('auth.forgot.sentTitle') }}
      </h1>
      <i18n-t keypath="auth.forgot.sentBody" tag="p" class="text-sm text-muted" scope="global">
        <template #email>
          <span class="font-semibold text-default">{{ state.email }}</span>
        </template>
      </i18n-t>
    </div>

    <div class="flex flex-col gap-2 text-sm text-muted">
      <p>
        {{ t('auth.forgot.noEmail') }}
        <!-- Back to the form with the address still in it, so a typo is a
             one-character fix rather than a retype. -->
        <UButton
          variant="link"
          color="primary"
          size="sm"
          :label="t('auth.forgot.tryAgain')"
          class="p-0 align-baseline font-semibold"
          @click="sent = false"
        />
      </p>
    </div>

    <UButton
      to="/auth/signin"
      variant="link"
      color="neutral"
      icon="lucide:arrow-left"
      :label="t('auth.forgot.backToSignIn')"
    />
  </div>
</template>
