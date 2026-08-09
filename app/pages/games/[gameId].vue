<script setup lang="ts">
import { gameById } from '~/composables/gameData'
import { usePreviewState } from '~/composables/usePreviewState'
import { useConsentBoundary } from '~/composables/useProgramMockData'
import { topbarStatsFor, userName, userAvatar } from '~/composables/useHomeMockData'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { t } = useI18n()

const gameId = computed(() => route.params.gameId as string)
const game = computed(() => gameById(gameId.value))

const { isLoggedIn, isOnboarded, accountStatus } = usePreviewState()
const topbarStats = computed(() => topbarStatsFor(isOnboarded.value))

// github-connect gates a young learner unconditionally, regardless of which
// cohort (if any) they're in — see the consent matrix in
// docs/superpowers/specs/2026-08-09-onboarding-foundations-design.md. The
// cohort-type argument is never read for this action; 'closed' is passed
// because checkConsentBoundary requires one, not because it matters here.
const { check } = useConsentBoundary()
const contributeGate = computed(() => check(accountStatus.value, 'closed', 'github-connect'))

// SYNTHESIZED: no real GitHub integration exists yet (the doc's own
// instrumentation gap — contribution happens off-platform). Stub titles only.
const CONTRIBUTE_TASKS = [
  'Fix a save-file bug in Chapter 2',
  'Add a new dialogue branch to the tavern scene',
  'Optimize the pause-menu animation'
]
</script>

<template>
  <UDashboardPanel :ui="{ root: 'bg-muted', body: 'p-0 sm:p-0 gap-0 sm:gap-0 overflow-x-auto' }">
    <template #body>
      <AppTopbar v-if="isLoggedIn" v-bind="topbarStats" :user-name="userName" :user-avatar="userAvatar" />
      <AppTopbar v-else guest />

      <UContainer v-if="game" class="py-10 flex flex-col gap-10">
        <section>
          <img :src="game.image" :alt="game.name" class="w-full h-64 object-cover rounded-2xl">
          <h1 class="mt-4 font-heading text-3xl font-bold text-highlighted">{{ game.name }}</h1>
          <p class="text-muted mt-1">{{ game.description }}</p>
        </section>

        <section>
          <SectionTitle :title="t('games.play')" />
          <!-- SYNTHESIZED: neither mock game has a real playable build yet.
               A real one would embed the same way ToolDrawer.vue already
               embeds the Make-page tools — an iframe, not a new mechanism. -->
          <div class="mt-4 aspect-video rounded-2xl bg-midnight-950 flex flex-col items-center justify-center gap-2 text-white/70">
            <Icon name="lucide:gamepad-2" class="size-8" />
            <p class="text-sm">{{ game.name }}</p>
          </div>
        </section>

        <section v-if="game.hasContribute" id="contribute">
          <SectionTitle :title="t('games.contribute.title')" />
          <div class="mt-4 flex flex-col gap-4">
            <VpcGate
              v-if="contributeGate.gated"
              :body="t('games.contribute.gateBody')"
              :exits="[
                { label: t('onboarding.vpcGate.exits.play'), to: `/games/${game.id}` },
                { label: t('onboarding.vpcGate.exits.comment'), to: `/games/${game.id}#comments` },
                { label: t('onboarding.vpcGate.exits.waitlist'), to: '/learn' }
              ]"
            />
            <template v-else>
              <UPageCard variant="outline" class="rounded-2xl">
                <h3 class="m-0 font-heading text-sm font-bold text-highlighted">{{ t('games.contribute.tasksTitle') }}</h3>
                <div class="mt-3 flex flex-col gap-2">
                  <div v-for="task in CONTRIBUTE_TASKS" :key="task" class="flex items-center justify-between gap-3 text-sm">
                    <span class="text-default">{{ task }}</span>
                    <UButton :label="t('games.contribute.claimTask')" size="xs" color="neutral" variant="outline" />
                  </div>
                </div>
              </UPageCard>
              <UButton
                :label="t('games.contribute.connectGithub')"
                icon="lucide:github"
                color="primary"
                variant="soft"
                class="self-start"
              />
            </template>
          </div>
        </section>

        <section id="comments">
          <SectionTitle :title="t('games.comments')" />
          <div class="mt-4 flex flex-col gap-4">
            <ChecklistCard flow-id="4" :context-id="game.id" />
            <PostCard :post-id="game.id" :author="game.name" :comments="game.comments" :can-comment="isLoggedIn">
              {{ game.description }}
            </PostCard>
          </div>
        </section>
      </UContainer>

      <UContainer v-else class="py-10">
        <div
          class="border-[1.5px] border-dashed border-slate-300 flex flex-col items-center gap-2 text-center rounded-2xl"
          style="padding: 32px 24px"
        >
          <Icon name="lucide:file-question" class="size-[22px] text-primary" />
          <div class="font-heading text-[15px] font-bold text-default">{{ t('games.notFound.title') }}</div>
          <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">{{ t('games.notFound.body') }}</p>
          <UButton :label="t('games.notFound.back')" to="/" color="neutral" variant="outline" class="mt-2" />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
