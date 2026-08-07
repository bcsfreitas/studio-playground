<script setup lang="ts">
import { programTemplates, programInstances, projectsForProgram } from '~/composables/useProgramMockData'
import { useProgramEnrollment } from '~/composables/useProgramEnrollment'

const route = useRoute()
const { t } = useI18n()

const programId = computed(() => route.params.programId as string)
const template = computed(() => programTemplates.find(p => p.id === programId.value))

// All of them, not the first: Explore: Godot has three instances and the
// earliest one's only group has already ended, so picking `.find` would show
// "Enrollment closed" while the catalog advertises open enrollment.
const instances = computed(() => programInstances.filter(i => i.programId === programId.value))

const { enrollment } = useProgramEnrollment(programId)

const projects = computed(() => projectsForProgram(programId.value))
</script>

<template>
  <!-- One component serves two tabs: it is "Overview" before enrolling and
       "Home" after. The enrolled learner's real Home dashboard lands in the
       next slice, and the "About" tab stays a stub until then — at that point
       About takes over this content and Home stops rendering it. -->
  <UContainer v-if="template">
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_324px] gap-y-15 lg:gap-x-12 pt-10 pb-16">
      <ProgramHero
        class="min-w-0 lg:col-start-1 lg:row-start-1"
        :template="template"
        :institution="instances[0]?.deliveringInstitution"
      />

      <!-- One card, two positions. Below lg the enrollment CTA has to sit right
           after the description rather than after the whole scroll of
           curriculum/testimonials/certificate; on lg+ it's the sticky right
           rail. Grid placement moves it instead of a second copy — two mounted
           cards meant two modals (UModal teleports to body, so `lg:hidden` on
           the wrapper doesn't hide it) and the sign-up enroll intent resumed in
           both, stacking the confirm and success dialogs. -->
      <div class="lg:col-start-2 lg:row-start-1 lg:row-span-2">
        <div class="sticky top-6 flex flex-col gap-8">
          <USeparator class="lg:hidden" />
          <ProgramEnrollmentCard
            :template="template"
            :instances="instances"
            :enrollment="enrollment"
          />
          <ProgramSideInfo :template="template" :instances="instances" />
        </div>
      </div>

      <div class="flex flex-col gap-15 min-w-0 lg:col-start-1 lg:row-start-2">
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
    </div>
  </UContainer>
</template>
