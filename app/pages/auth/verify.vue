<script setup lang="ts">
import { useMockAuth } from '~/composables/useMockAuth'
import { useAuthReturn } from '~/composables/useAuthIntent'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const { pending, submit } = useMockAuth()

const CODE_LENGTH = 6

// UPinInput models one entry per box, so this is an array of characters rather
// than a string.
const code = ref<string[]>([])
const isComplete = computed(() => code.value.filter(Boolean).length === CODE_LENGTH)

// Landing here directly, without coming through sign-up, still has to read as a
// sentence — hence the fallback rather than an empty gap.
const email = computed(() => (route.query.email as string) || t('auth.verify.yourEmail'))

const { returnLabel, carryQuery, finish } = useAuthReturn()

// Verifying is the end of the flow: the account now exists and has nothing in
// it, and the learner goes back to whatever sent them here.
const onSubmit = () => submit(() => finish('fresh'))

function resend() {
  toast.add({ title: t('auth.verify.resent', { email: email.value }), color: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1.5">
      <h1 class="font-heading text-3xl font-bold tracking-[-0.5px] text-highlighted">
        {{ t('auth.verify.title') }}
      </h1>
      <i18n-t keypath="auth.verify.subtitle" tag="p" class="text-sm text-muted" scope="global">
        <template #email>
          <span class="font-semibold text-default">{{ email }}</span>
        </template>
      </i18n-t>
      <p v-if="returnLabel" class="text-sm text-muted">
        <UIcon name="lucide:corner-down-left" class="size-4 align-[-2px] mr-1 text-dimmed" />
        {{ t('auth.returnTo', { destination: returnLabel }) }}
      </p>
    </div>

    <form class="flex flex-col gap-5" @submit.prevent="onSubmit">
      <UPinInput
        v-model="code"
        :length="CODE_LENGTH"
        otp
        size="xl"
        autofocus
        :aria-label="t('auth.verify.codeLabel')"
        class="justify-between"
      />

      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        :loading="pending"
        :disabled="!isComplete"
        :label="t('auth.verify.submit')"
      />
    </form>

    <div class="flex flex-col gap-2 text-center text-sm text-muted">
      <p>
        {{ t('auth.verify.noCode') }}
        <!-- A button, not a link: resending stays on this screen. -->
        <UButton
          variant="link"
          color="primary"
          size="sm"
          :label="t('auth.verify.resend')"
          class="p-0 align-baseline font-semibold"
          @click="resend"
        />
      </p>
      <p>
        {{ t('auth.verify.wrongEmail') }}
        <!-- Back to sign-up with the intent still attached, so correcting an
             address doesn't cost the learner their place. -->
        <ULink :to="{ path: '/auth/signup', query: carryQuery() }" class="font-semibold text-primary-600">
          {{ t('auth.verify.goBack') }}
        </ULink>
      </p>
    </div>
  </div>
</template>
