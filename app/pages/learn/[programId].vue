<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { programTemplates, programInstances, enrollmentsByPreviewState } from '~/composables/useProgramMockData'
import { userName, streakDays, xpLabel, notificationCount, type PreviewState } from '~/composables/useHomeMockData'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { t, locale, setLocale } = useI18n()

const programId = computed(() => route.params.programId as string)
const template = computed(() => programTemplates.find(p => p.id === programId.value))
const instance = computed(() => programInstances.find(i => i.programId === programId.value))

const state = ref<PreviewState>('active')
const isActive = computed(() => state.value === 'active')

const enrollment = computed(() =>
  enrollmentsByPreviewState[state.value].find(e => e.programId === programId.value)
)

const previewStates: { id: PreviewState, label: string }[] = [
  { id: 'new', label: 'New learner' },
  { id: 'active', label: 'Active learner' },
  { id: 'guest', label: 'Guest' }
]
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-0 gap-0 overflow-x-auto' }">
    <template #body>
      <AppTopbar
        v-if="isActive"
        :xp-label="xpLabel"
        :streak-days="streakDays"
        :user-name="userName"
        :notification-count="notificationCount"
      />

      <UContainer>
        <div style="height: 40px; width: 100%" />

        <div v-if="template && instance" class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_324px] gap-8 lg:gap-12 pb-16">
          <div class="flex flex-col gap-15 min-w-0">
            <ProgramHero :template="template" :institution="instance.deliveringInstitution" />

            <ProgramFactsStrip :template="template" />

            <!-- Mobile-only: right rail is sticky on lg+, but below that the
                 enrollment CTA needs to sit right after the hero, not after
                 the entire scroll of curriculum/testimonials/certificate. -->
            <USeparator class="lg:hidden" />
            <ProgramEnrollmentCard
              class="lg:hidden"
              :template="template"
              :instance="instance"
              :enrollment="enrollment"
            />

            <USeparator />
            <section>
              <SectionTitle :title="t('program.sections.curriculum')" />
              <ProgramCurriculumAccordion :modules="template.curriculum" />
            </section>

            <USeparator />
            <section>
              <SectionTitle :title="t('program.sections.tools')" />
              <ProgramToolsList :tools="template.toolsUsed" />
            </section>

            <USeparator />
            <section>
              <SectionTitle :title="t('program.sections.prerequisites')" />
              <ProgramPrerequisites :prerequisites="template.prerequisites" />
            </section>

            <USeparator />
            <section>
              <SectionTitle :title="t('program.sections.testimonials')" />
              <ProgramSocialProof
                :students-completed-count="template.studentsCompletedCount"
                :testimonials="template.testimonials"
              />
            </section>

            <USeparator />
            <section>
              <SectionTitle :title="t('program.sections.certificate')" />
              <ProgramCertificateShowcase :certificate="template.certificate" />
            </section>

          </div>

          <div class="hidden lg:block">
            <div class="sticky top-6">
              <ProgramEnrollmentCard :template="template" :instance="instance" :enrollment="enrollment" />
            </div>
          </div>
        </div>

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
    </template>
  </UDashboardPanel>

  <!-- Dev-only preview state + locale switcher (not part of the product's real UI) -->
  <div class="fixed right-[18px] bottom-[18px] z-[200] flex items-center gap-2">
    <div
      class="flex items-center gap-1"
      style="background: rgba(2,6,24,0.92); border-radius: 100px; padding: 5px 6px 5px 14px; box-shadow: var(--shadow-menu)"
    >
      <span class="text-[10px] font-bold tracking-[0.08em] text-slate-400 mr-1.5">PREVIEW AS</span>
      <div
        v-for="p in previewStates"
        :key="p.id"
        class="px-3 py-1.5 rounded-full text-[12.5px] font-semibold cursor-pointer select-none transition-all duration-150"
        :class="state === p.id ? 'bg-white text-slate-900' : 'text-slate-300'"
        @click="state = p.id"
      >
        {{ p.label }}
      </div>
    </div>
    <ULocaleSelect
      :model-value="locale"
      :locales="Object.values(locales)"
      size="sm"
      @update:model-value="setLocale($event)"
    />
  </div>
</template>
