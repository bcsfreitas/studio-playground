<script setup lang="ts">
import { usePreviewState } from '~/composables/usePreviewState'
import { signInTo, signUpTo } from '~/composables/useAuthIntent'
import { useMentorStatus } from '~/composables/useMentorStatus'

const open = defineModel<boolean>('open', { required: true })

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { isLoggedIn } = usePreviewState()
const { isMentor } = useMentorStatus()
const toast = useToast()

const qualifyOpen = ref(false)

// Same pattern ProgramTabCommunity.vue uses — this component's only call
// site (ProgramTeacherCta.vue) is always rendered inside /learn/[programId],
// so the param is reliably available without threading a prop in.
const programId = computed(() => route.params.programId as string)

const FEATURES = [
  { icon: 'lucide:lock', key: 'private' },
  { icon: 'lucide:user-plus', key: 'invite' },
  { icon: 'lucide:shield', key: 'silo' },
  { icon: 'lucide:layout-dashboard', key: 'dashboard' }
] as const

// The guest sign-in/sign-up links carry this marker through the mock auth
// round trip so the return page knows to open the qualification drawer
// directly instead of this explainer. Guarded on `!isMentor` too — the dev
// "PREVIEW AS" toggle can flip back to guest without clearing mentor status,
// and a guest who's already a mentor could never pass the far side's gate.
const nextWithMentorMarker = computed(() =>
  isMentor.value
    ? route.fullPath
    : router.resolve({ path: route.path, query: { ...route.query, mentorQualify: '1' }, hash: route.hash }).fullPath
)

onMounted(() => {
  if (route.query.mentorQualify === '1' && isLoggedIn.value && !isMentor.value) {
    qualifyOpen.value = true
    const { mentorQualify: _mentorQualify, ...rest } = route.query
    router.replace({ path: route.path, query: rest, hash: route.hash || undefined })
  }
})

// There's no cohort-creation flow to send an already-qualified educator to
// yet — the toast is honest about that instead of linking somewhere that
// doesn't exist. A logged-in user who isn't a mentor yet gets sent into the
// qualification drawer instead, closing this one so Cancel there doesn't
// drop them back into an explainer they didn't ask to revisit.
function onPrimaryCta() {
  if (isMentor.value) {
    toast.add({ title: t('program.teacherCta.drawer.comingSoon'), color: 'neutral' })
    return
  }
  open.value = false
  qualifyOpen.value = true
}
</script>

<template>
  <!-- Same full-screen-override technique as ProgramStepDrawer.vue/ToolDrawer.vue
       — this theme has no dedicated fullscreen variant, so `content`/`overlay`
       are forced to `h-[100dvh]` (not a `%`, which would resolve against the
       large viewport and hide the bottom edge under mobile browser chrome) at
       the same `z-[250]` rung those two already use. `dismissible` is left at
       its default (true) so overlay-click and Escape both close it. -->
  <UDrawer
    v-model:open="open"
    :title="t('program.teacherCta.drawer.headline')"
    close
    handle-only
    :handle="false"
    :ui="{
      content: 'h-[100dvh] max-h-[100dvh] overflow-hidden z-[250]',
      overlay: 'z-[250]',
      container: 'h-full overflow-y-auto',
      header: 'px-6 py-4 border-b border-default shrink-0',
      body: 'flex-1 flex flex-col items-center justify-center',
      footer: 'px-6 py-4 border-t border-default shrink-0'
    }"
  >
    <template #body>
      <div class="max-w-lg mx-auto flex flex-col gap-6 py-4">
        <div>
          <h2 class="font-heading font-bold text-2xl text-highlighted">
            {{ t('program.teacherCta.drawer.headline') }}
          </h2>
          <p class="mt-1 text-muted">
            {{ t('program.teacherCta.drawer.intro') }}
          </p>
        </div>

        <ul class="flex flex-col gap-4">
          <li v-for="feature in FEATURES" :key="feature.key" class="flex items-center gap-3">
            <span class="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary shrink-0">
              <UIcon :name="feature.icon" class="size-4" />
            </span>
            <span class="text-sm text-default">{{ t(`program.teacherCta.drawer.features.${feature.key}`) }}</span>
          </li>
        </ul>

        <UButton
          v-if="isLoggedIn"
          :label="t('program.teacherCta.cta')"
          color="primary"
          block
          @click="onPrimaryCta"
        />
      </div>
    </template>

    <template v-if="!isLoggedIn" #footer>
      <div class="w-full flex flex-col gap-3">
        <p class="text-sm text-muted">{{ t('program.teacherCta.drawer.guestMessage') }}</p>
        <div class="flex gap-3">
          <UButton
            :label="t('program.teacherCta.drawer.logIn')"
            :to="signInTo(nextWithMentorMarker)"
            color="neutral"
            variant="outline"
            class="flex-1 justify-center"
          />
          <UButton
            :label="t('program.teacherCta.drawer.signUp')"
            :to="signUpTo(nextWithMentorMarker, 'teach')"
            color="primary"
            class="flex-1 justify-center"
          />
        </div>
      </div>
    </template>
  </UDrawer>

  <MentorQualificationDrawer v-model:open="qualifyOpen" :program-id="programId" />
</template>
