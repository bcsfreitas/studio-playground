<script setup lang="ts">
import type { ProgramTemplate, ProgramInstance } from '~/composables/useProgramMockData'
import { avatarForName } from '~/composables/useProgramMockData'

const props = defineProps<{
  template: ProgramTemplate
  instances: ProgramInstance[]
}>()

const { t } = useI18n()

// Instance mentors are the people actually running the sessions; the
// template's `facilitator` is the program-level fallback for a program with
// no instance scheduled (Educator Training).
const teachers = computed(() => {
  const fromInstances = [...new Set(props.instances.flatMap(instance => instance.mentors))]
  return fromInstances.length ? fromInstances : [props.template.facilitator]
})

const sessionCount = computed(() => props.instances[0]?.sessions.length ?? 0)
const sessionMinutes = computed(() => props.instances[0]?.sessions[0]?.durationMinutes ?? 0)
</script>

<template>
  <!-- Deliberately not a card: this is supporting detail beside the enrollment
       card, and a second card would read as a second call to action.
       The horizontal padding matches UPageCard's own `p-4 sm:p-6`, so this
       content lines up with the card above it at every breakpoint rather than
       hanging out past its edge. -->
  <div class="flex flex-col gap-6 px-4 sm:px-6">
    <section>
      <h3 class="text-xs font-semibold text-dimmed uppercase tracking-wide">
        {{ t('program.sideInfo.sessions') }}
      </h3>
      <p class="text-sm text-default mt-1.5">{{ template.durationLabel }}</p>
      <p v-if="sessionCount" class="text-sm text-muted">
        {{ t('program.sideInfo.sessionCount', { count: sessionCount, minutes: sessionMinutes }) }}
      </p>
    </section>

    <USeparator />

    <section>
      <h3 class="text-xs font-semibold text-dimmed uppercase tracking-wide">
        {{ t('program.sideInfo.teachers', teachers.length) }}
      </h3>
      <div class="flex flex-col gap-2 mt-2">
        <div v-for="teacher in teachers" :key="teacher" class="flex items-center gap-2">
          <UAvatar :src="avatarForName(teacher)" :alt="teacher" :text="teacher.charAt(0)" size="xs" />
          <span class="text-sm text-default">{{ teacher }}</span>
        </div>
      </div>
    </section>

    <template v-if="template.toolsUsed.length">
      <USeparator />
      <section>
        <h3 class="text-xs font-semibold text-dimmed uppercase tracking-wide">
          {{ t('program.sideInfo.tools') }}
        </h3>
        <div class="flex flex-wrap gap-1.5 mt-2">
          <UBadge
            v-for="tool in template.toolsUsed"
            :key="tool"
            :label="tool"
            color="neutral"
            variant="soft"
            size="sm"
          />
        </div>
      </section>
    </template>

    <template v-if="template.prerequisites.length">
      <USeparator />
      <section>
        <h3 class="text-xs font-semibold text-dimmed uppercase tracking-wide">
          {{ t('program.sideInfo.prerequisites') }}
        </h3>
        <ul class="flex flex-col gap-1.5 mt-2">
          <li
            v-for="prerequisite in template.prerequisites"
            :key="prerequisite"
            class="flex items-start gap-2 text-sm text-default"
          >
            <UIcon name="lucide:check" class="size-4 shrink-0 mt-0.5 text-success" />
            <span>{{ prerequisite }}</span>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
