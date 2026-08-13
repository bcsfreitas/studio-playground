import {
  mentorClassroomsByPhase,
  type ClassroomLearner,
  type MentorClassroom,
  type MentorClassroomAgeRange
} from '~/composables/programData/mentorClassrooms'
import type { PreviewState } from '~/composables/usePreviewState'

const STORAGE_KEY = 'mentor-classrooms-created'

// One hydration per session — same reasoning as useOnboardingIntent.ts.
let hydrated = false

// Excludes I/O/0/1 — a mentor reading this code aloud to a student shouldn't
// have to disambiguate look-alike characters.
const ACCESS_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateAccessCode(): string {
  return Array.from({ length: 8 }, () => ACCESS_CODE_ALPHABET[Math.floor(Math.random() * ACCESS_CODE_ALPHABET.length)]).join('')
}

// Not crypto.randomUUID(): that's only defined in secure contexts (https, or
// localhost specifically) — this app is routinely viewed over plain http on
// a LAN IP, where it's undefined and throws. This id only ever needs to be
// unique within one mentor's localStorage, not globally, so Math.random() is
// plenty.
function generateClassroomId(): string {
  return `mentor-classroom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * The mock "server-side" layer for mentor-created classrooms. There is no
 * backend, so this composable's localStorage write IS the persistence —
 * layered on top of mentorClassrooms.ts's static seed (which stays untouched,
 * same convention as enrollments.ts) rather than replacing it, so the
 * existing demo classrooms keep showing up alongside anything a mentor
 * actually creates through the wizard.
 */
export function useMentorClassrooms() {
  const created = useState<MentorClassroom[]>(STORAGE_KEY, () => [])

  onMounted(() => {
    if (hydrated || !import.meta.client) return
    hydrated = true
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      created.value = JSON.parse(raw) as MentorClassroom[]
    } catch {
      // Corrupt or stale-shape value — start fresh rather than crash.
    }
  })

  function persist() {
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(created.value))
  }

  function classroomsFor(state: PreviewState): MentorClassroom[] {
    return [...created.value, ...mentorClassroomsByPhase[state]]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  function createClassroom(input: {
    name: string
    programId: string
    ageRange: MentorClassroomAgeRange
    siloed: boolean
  }): MentorClassroom {
    const id = generateClassroomId()
    const classroom: MentorClassroom = {
      id,
      // Synthesized only to satisfy Cohort's required field — no real
      // ProgramInstance backs a mentor-created classroom.
      instanceId: `instance-${input.programId}-mentor-${id}`,
      programId: input.programId,
      name: input.name,
      type: 'closed',
      startDate: null,
      endDate: null,
      maxLearners: null,
      seatsTaken: 0,
      accessCode: generateAccessCode(),
      createdAt: new Date().toISOString(),
      learners: [],
      ageRange: input.ageRange,
      siloed: input.siloed
    }
    created.value = [classroom, ...created.value]
    persist()
    return classroom
  }

  function addLearners(classroomId: string, learners: ClassroomLearner[]) {
    created.value = created.value.map(classroom =>
      classroom.id === classroomId
        ? { ...classroom, learners: [...classroom.learners, ...learners], seatsTaken: classroom.seatsTaken + learners.length }
        : classroom
    )
    persist()
  }

  return { classroomsFor, createClassroom, addLearners }
}
