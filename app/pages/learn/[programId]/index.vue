<script setup lang="ts">
import { programTemplates, programInstances, enrollmentsByPhase } from '~/composables/useProgramMockData'
import { useProgramPhase } from '~/composables/useProgramPhase'

const route = useRoute()
const { t } = useI18n()

const programId = computed(() => route.params.programId as string)
const template = computed(() => programTemplates.find(p => p.id === programId.value))

// All of them, not the first: Explore: Godot has three instances and the
// earliest one's only group has already ended, so picking `.find` would show
// "Enrollment closed" while the catalog advertises open enrollment.
const instances = computed(() => programInstances.filter(i => i.programId === programId.value))

const phase = useProgramPhase()
const enrollment = computed(() =>
  enrollmentsByPhase[phase.value].find(e => e.programId === programId.value)
)
</script>

<template>
  <!-- One page serves two tabs: it is "Overview" before enrolling and "Home"
       after. The enrolled learner's real Home dashboard lands in the next
       slice, and the "About" tab stays a stub until then — at that point About
       takes over this Overview content and Home stops rendering it. -->
  <UContainer v-if="template">
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_324px] gap-8 lg:gap-12 pt-10 pb-16">
      <div class="flex flex-col gap-15 min-w-0">
        <ProgramFactsStrip :template="template" />

        <!-- Mobile-only: right rail is sticky on lg+, but below that the
             enrollment CTA needs to sit right after the facts, not after
             the entire scroll of curriculum/testimonials/certificate. -->
        <USeparator class="lg:hidden" />
        <ProgramEnrollmentCard
          class="lg:hidden"
          :template="template"
          :instances="instances"
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
          <ProgramEnrollmentCard :template="template" :instances="instances" :enrollment="enrollment" />
        </div>
      </div>
    </div>
  </UContainer>
</template>
