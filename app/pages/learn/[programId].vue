<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { programTemplates, programInstances, type LearnerPhase } from '~/composables/useProgramMockData'
import { provideProgramPhase } from '~/composables/useProgramPhase'
import { userName, streakDays, xpLabel, notificationCount } from '~/composables/useHomeMockData'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { t } = useI18n()

const programId = computed(() => route.params.programId as string)
const template = computed(() => programTemplates.find(p => p.id === programId.value))

// Educator Training has zero instances by design (facilitator-facing, no open
// learner enrollment), so the page must render off the template alone —
// gating on an instance too would 404 a program that exists.
const instances = computed(() => programInstances.filter(i => i.programId === programId.value))

const phase = ref<LearnerPhase>('enrolled')
provideProgramPhase(phase)

const isEnrolled = computed(() => phase.value !== 'interested')

// Matching on the path rather than the generated route name: the name of the
// index child depends on Nuxt's file-router naming, and a rename of any tab
// file would silently flip the hero off.
const isOverviewRoute = computed(() => route.path.replace(/\/$/, '') === `/learn/${programId.value}`)

const tabs = computed<NavigationMenuItem[]>(() => {
  const base = `/learn/${programId.value}`

  // Learner-only tabs are absent from the nav entirely for people who haven't
  // enrolled, not disabled — a locked tab you cannot open is noise.
  if (!isEnrolled.value) {
    return [
      { label: t('program.tabs.overview'), to: base, exact: true },
      { label: t('program.tabs.community'), to: `${base}/community` },
      { label: t('program.tabs.projects'), to: `${base}/projects` }
    ]
  }

  return [
    { label: t('program.tabs.home'), to: base, exact: true },
    { label: t('program.tabs.about'), to: `${base}/about` },
    { label: t('program.tabs.community'), to: `${base}/community` },
    { label: t('program.tabs.classroom'), to: `${base}/classroom` },
    { label: t('program.tabs.projects'), to: `${base}/projects` },
    { label: t('program.tabs.resources'), to: `${base}/resources` }
  ]
})
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 gap-0 overflow-x-auto' }">
    <template #body>
      <AppTopbar
        :xp-label="xpLabel"
        :streak-days="streakDays"
        :user-name="userName"
        :notification-count="notificationCount"
      />

      <UContainer>
        <div style="height: 40px; width: 100%" />

        <template v-if="template">
          <ProgramHero
            v-if="isOverviewRoute"
            :template="template"
            :institution="instances[0]?.deliveringInstitution"
          />
          <!-- Every other tab gets a compact title bar: a 300px hero above the
               classroom on every visit is space the tab's own content needs. -->
          <h1 v-else class="text-2xl font-heading font-bold text-highlighted text-pretty">
            {{ template.title }}
          </h1>

          <!-- UNavigationMenu, not UTabs: UTabs switches content client-side and
               its items take no `to`, so it can neither deep-link nor reflect the
               active route. These tabs are real URLs. -->
          <UNavigationMenu
            :items="tabs"
            variant="link"
            highlight
            class="mt-8"
            :ui="{ list: 'flex-1 border-b border-default' }"
          />
        </template>

        <div
          v-else
          class="border-[1.5px] border-dashed border-slate-300 flex flex-col items-center gap-2 text-center rounded-2xl mb-16"
          style="padding: 32px 24px"
        >
          <Icon name="lucide:file-question" class="size-[22px] text-primary" />
          <div class="font-heading text-[15px] font-bold text-default">{{ t('program.notFound.title') }}</div>
          <p class="m-0 max-w-[360px] text-[13px] leading-5 text-muted">{{ t('program.notFound.body') }}</p>
          <UButton :label="t('program.notFound.backToLearn')" to="/learn" color="neutral" variant="outline" class="mt-2" />
        </div>
      </UContainer>

      <!-- Outside the UContainer: each tab owns its own width and rail (the
           classroom is two-column, community is full-width), so the shell must
           not impose one. -->
      <!-- Keyed on the program so a tab page can resolve its data once at
           setup instead of tracking the route param (see classroom.vue). -->
      <NuxtPage v-if="template" :page-key="tabRoute => tabRoute.params.programId as string" />
    </template>
  </UDashboardPanel>

  <DevPreviewBar v-model="phase" />
</template>
