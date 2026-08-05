<script setup lang="ts">
import { programTemplates, programInstances, enrollmentsByPhase, projectsForProgram } from '~/composables/useProgramMockData'
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

const projects = computed(() => projectsForProgram(programId.value))
</script>

<template>
  <!-- One component serves two tabs: it is "Overview" before enrolling and
       "Home" after. The enrolled learner's real Home dashboard lands in the
       next slice, and the "About" tab stays a stub until then — at that point
       About takes over this content and Home stops rendering it. -->
  <UContainer v-if="template">
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_324px] gap-8 lg:gap-12 pt-10 pb-16">
      <div class="flex flex-col gap-15 min-w-0">
        <ProgramHero
          :template="template"
          :institution="instances[0]?.deliveringInstitution"
        />

        <!-- Mobile-only: the right rail is sticky on lg+, but below that the
             enrollment CTA needs to sit right after the description, not after
             the entire scroll of curriculum/testimonials/certificate. -->
        <div class="lg:hidden flex flex-col gap-8">
          <USeparator />
          <ProgramEnrollmentCard
            :template="template"
            :instances="instances"
            :enrollment="enrollment"
          />
          <ProgramSideInfo :template="template" :instances="instances" />
        </div>

        <USeparator />
        <ProgramFactsStrip :template="template" />

        <USeparator />
        <section>
          <SectionTitle :title="t('program.sections.curriculum')" />
          <ProgramCurriculumAccordion :modules="template.curriculum" />
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

        <USeparator />
        <section>
          <SectionTitle :title="t('program.sections.projects')" />
          <ProgramProjectsGallery :projects="projects" />
        </section>
      </div>

      <div class="hidden lg:block">
        <div class="sticky top-6 flex flex-col gap-8">
          <ProgramEnrollmentCard :template="template" :instances="instances" :enrollment="enrollment" />
          <ProgramSideInfo :template="template" :instances="instances" />
        </div>
      </div>
    </div>
  </UContainer>
</template>
