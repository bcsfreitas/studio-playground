import type { ProgramInstance, ProgramSession } from './types'

// ---------------------------------------------------------------------------
// Session-date generation
//
// SYNTHESIZED: only Explore: Godot has a real dated cohort in source
// (02-programs-and-offerings.md:12: May 12 - June 11 2026, Tue/Thu). Every
// other schedule below is generated from each program's own stated cadence
// (Core: Threadbare's two-sessions-a-week pattern mirrors Explore: Godot's,
// since no cadence is stated for Core: Threadbare itself) so the schedule UI
// has something real to render. Self-paced instances have no dates at all.
// ---------------------------------------------------------------------------

function addDays(dateOnly: string, days: number): string {
  const d = new Date(`${dateOnly}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Two sessions a week (e.g. Tue/Thu, or Mon/Wed), starting on the cohort's
// first session date.
function twiceWeeklyOffsets(count: number): number[] {
  return Array.from({ length: count }, (_, i) => Math.floor(i / 2) * 7 + (i % 2 === 0 ? 0 : 2))
}

interface SessionSeed {
  title: string
  drivingQuestion?: string
}

function buildSessions(
  instanceId: string,
  startDate: string,
  offsets: number[],
  time: string,
  durationMinutes: number,
  seeds: SessionSeed[]
): ProgramSession[] {
  return seeds.map((seed, i) => ({
    id: `${instanceId}-s${i + 1}`,
    index: i + 1,
    title: seed.title,
    drivingQuestion: seed.drivingQuestion,
    // Explicitly UTC. Without the `Z` the string is a "local time" per the
    // spec, so the SSR render (UTC) and the browser (any other zone) would
    // parse it to different instants and hydration would mismatch on every
    // rendered session time. Formatters must pass `timeZone: 'UTC'` to match,
    // the same convention formatCohortRange uses for date-only strings.
    startsAt: `${addDays(startDate, offsets[i]!)}T${time}:00Z`,
    durationMinutes
  }))
}

// A self-paced instance has no calendar: its sessions are an ordered path the
// learner walks whenever they like, so they carry a length but no date.
function buildUndatedSessions(
  instanceId: string,
  durationMinutes: number,
  seeds: SessionSeed[]
): ProgramSession[] {
  return seeds.map((seed, i) => ({
    id: `${instanceId}-s${i + 1}`,
    index: i + 1,
    title: seed.title,
    drivingQuestion: seed.drivingQuestion,
    durationMinutes
  }))
}

// Every learner program has a self-paced way in alongside whatever cohorts it
// runs: same curriculum and same session order, no schedule, open every day.
// One such instance per program. The Cohort it carries exists only because
// ProgramInstance requires one — its null startDate is what makes
// cohortStatusFor report the option always open.
function selfPacedInstance(
  programId: string,
  durationMinutes: number,
  seeds: SessionSeed[],
  // Empty for a program whose facilitators run its cohorts: nobody is teaching
  // the self-paced path, so it shouldn't add names to the program's teacher list.
  mentors: string[] = []
): ProgramInstance {
  const id = `instance-${programId}-self-paced`
  return {
    id,
    programId,
    enrollmentModel: 'self-paced',
    visibility: 'public',
    scheduleLabel: 'Self-paced — start anytime, finish at your own pace',
    mentors,
    sessions: buildUndatedSessions(id, durationMinutes, seeds),
    cohorts: [
      {
        id: `cohort-${programId}-self-paced`,
        instanceId: id,
        name: 'Self-paced',
        // A solo, always-open path has no roster to hide — open by definition.
        type: 'open',
        startDate: null,
        endDate: null,
        maxLearners: null,
        seatsTaken: 0
      }
    ]
  }
}

// Explore-Godot/sessions.md session map, in delivery order. Sessions 5-8 share
// the same driving question verbatim in source — that repetition is real,
// not a copy-paste mistake here.
const EXPLORE_GODOT_SESSIONS: SessionSeed[] = [
  { title: 'Why do we play games? Why do we mod them?', drivingQuestion: 'Why do we play games? Why do we mod them?' },
  { title: 'Should game makers also be game players?', drivingQuestion: 'Should game makers also be game players?' },
  { title: 'How do game makers create a fun and engaging level?', drivingQuestion: 'How do game makers create a fun and engaging level?' },
  { title: 'What helps an idea move from concept to something real?', drivingQuestion: 'What helps an idea move from concept to something real?' },
  { title: 'What makes a level good? What makes it great?', drivingQuestion: 'What makes a level good? What makes it great?' },
  { title: 'What makes a level good? What makes it great?', drivingQuestion: 'What makes a level good? What makes it great?' },
  { title: 'What makes a level good? What makes it great?', drivingQuestion: 'What makes a level good? What makes it great?' },
  { title: 'What makes a level good? What makes it great?', drivingQuestion: 'What makes a level good? What makes it great?' },
  { title: 'What makes a level "polished?"', drivingQuestion: 'What makes a level "polished?"' },
  { title: 'Where do you go from here?', drivingQuestion: 'Where do you go from here?' }
]

// Core-Threadbare/sessions.md, Sessions 1-18. Session length conflict, resolved
// deliberately: curriculum.md states no timings at all for Sessions 1-13, and
// the per-activity minutes given for Sessions 14-18 don't sum to a clean
// figure (they range from 52 to 72 minutes across the five). Rather than
// reverse-engineer a mix of real-ish and synthesized numbers, every session
// below uses one flat SYNTHESIZED length (90 min, a typical live cohort
// session) instead.
const CORE_THREADBARE_SESSIONS: SessionSeed[] = [
  { title: 'What makes a video game a game?' },
  { title: 'Who am I as a game maker?' },
  { title: 'How is a game stitched together?' },
  { title: 'Am I up to date with the things I need to start creating?' },
  { title: 'First Working Session' },
  { title: 'Working Session' },
  { title: 'Working Session' },
  { title: 'Working Session' },
  { title: 'Working Session' },
  { title: 'Working Session' },
  { title: 'Working Session' },
  { title: 'Working Session' },
  { title: 'Working Session' },
  { title: 'What makes a StoryQuest good?' },
  { title: 'What makes a StoryQuest GREAT?' },
  { title: "It's the final countdown" },
  { title: 'How do you tell a StoryQuest? How do you sell it?' },
  { title: 'Where will your StoryQuest take players? And where will it take you?' }
]

// Explore-Threadbare/curriculum.md's workshop map, in the same discipline
// order as curriculumByProgram['explore-threadbare']. Driving questions are
// each workshop's own, from sessions.md.
const EXPLORE_THREADBARE_SESSIONS: SessionSeed[] = [
  { title: 'Core Gameplay & Mechanics', drivingQuestion: 'What makes the player return to a game over and over again?' },
  { title: 'Narrative & Storytelling', drivingQuestion: "How can writing change the player's experience?" },
  { title: 'Game Feel & UX', drivingQuestion: 'How do designers invite players to discover their own path through a game?' },
  { title: 'Progression & Motivation', drivingQuestion: 'How do game makers give the core loop a refresh?' },
  { title: 'Animation & Effects', drivingQuestion: "How can animation deepen the player's connection to the game world?" },
  { title: 'Aesthetics & Visual Design', drivingQuestion: 'How can one pixel art asset help shape the story of a game?' },
  { title: 'Music & Sound', drivingQuestion: 'How can sound deepen your connection to a moment in a game?' },
  { title: 'Gameplay & Systems Programming', drivingQuestion: 'How does programming shape what players feel & experience?' },
  { title: 'Optimization & Performance', drivingQuestion: "How do unseen systems shape a player's experience moment to moment?" },
  { title: 'Project & Workflow Management', drivingQuestion: 'How can you lead a team to enhance a game experience?' },
  { title: 'QA & Playtesting', drivingQuestion: 'How does a development team make sure that a game is ready to be released?' },
  { title: 'Marketing', drivingQuestion: 'How can we bring a digital game to life for players to enjoy in the real world?' },
  { title: 'Publishing & Distribution', drivingQuestion: 'How do players get games?' }
]

export const programInstances: ProgramInstance[] = [
  // Core: Threadbare — one private, access-coded cohort. Exercises the single/
  // collapsed card plus the access-code path. True to source: Core: Threadbare
  // runs "at scale with UTP ... and at partner sites" (02-programs-and-offerings.md:8),
  // never as open self-serve enrollment, which is exactly the private case.
  {
    id: 'instance-core-threadbare-utp',
    programId: 'core-threadbare',
    enrollmentModel: 'cohort',
    visibility: 'private',
    scheduleLabel: 'Tue/Thu evenings, Sept 1 – Oct 29, 2026',
    // SYNTHESIZED: no mentor names exist in source for any specific cohort.
    mentors: ['Carlos Medina', 'Ana Ibarra'],
    // 02-programs-and-offerings.md:8 and the Partner landscape's "UTP (Peru)" entry.
    deliveringInstitution: { name: 'UTP (Peru)' },
    sessions: buildSessions(
      'instance-core-threadbare-utp',
      '2026-09-01',
      twiceWeeklyOffsets(18),
      '19:00',
      90,
      CORE_THREADBARE_SESSIONS
    ),
    cohorts: [
      {
        id: 'cohort-core-threadbare-night-owls',
        instanceId: 'instance-core-threadbare-utp',
        name: 'Night Owls',
        // A partner-commissioned, access-coded group — invisible outside UTP's
        // own roster, the closed case the consent matrix describes.
        type: 'closed',
        startDate: '2026-09-01',
        endDate: '2026-10-29',
        // SYNTHESIZED: seat figures for this specific run. The access code name
        // nods to the real GameLab 4.0 cohort (02-programs-and-offerings.md:8)
        // without claiming to reproduce that cohort's actual figures or dates.
        maxLearners: 30,
        seatsTaken: 22,
        accessCode: 'GAMELAB4'
      }
    ]
  },

  // Core: Threadbare's self-paced door. The cohort above stays private and
  // access-coded — this is how a learner with no partner site behind them gets
  // the same 18 sessions.
  selfPacedInstance('core-threadbare', 90, CORE_THREADBARE_SESSIONS),

  // Explore: Threadbare — self-paced only, no cohort at all. Per
  // curriculum.md:5 ("this is NOT a cohort"): the 13 workshops are never to be
  // presented as one date range. SYNTHESIZED mentor: no facilitator names exist
  // in source for this program.
  // Explore-Threadbare/curriculum.md:1 and every workshop's own "Session
  // length: 60 minutes".
  selfPacedInstance('explore-threadbare', 60, EXPLORE_THREADBARE_SESSIONS, ['Grace Halloran']),

  // Explore: Godot — three public cohort instances plus the self-paced one
  // below them. Exercises the full picker: several dated runs to choose
  // between, and the always-open option alongside. The first is the one real
  // dated cohort in source; the other two continue it forward in time.
  {
    id: 'instance-explore-godot-2026-05',
    programId: 'explore-godot',
    enrollmentModel: 'cohort',
    visibility: 'public',
    scheduleLabel: 'Tue/Thu, May 12 – June 11, 2026',
    // SYNTHESIZED: no facilitator name exists in source for this cohort.
    mentors: ['Devon Ashby'],
    sessions: buildSessions(
      'instance-explore-godot-2026-05',
      '2026-05-12',
      twiceWeeklyOffsets(10),
      // 02-programs-and-offerings.md:12 gives the dates and days but not a
      // clock time; SYNTHESIZED time-of-day only.
      '17:00',
      // Session length conflict, resolved deliberately: that same line says 90
      // min, but Explore-Godot/curriculum.md:3 says "Ten sessions, 60 minutes
      // each." Using 60 — the curriculum doc sits closer to the source decks.
      60,
      EXPLORE_GODOT_SESSIONS
    ),
    cohorts: [
      {
        id: 'cohort-explore-godot-pioneers',
        instanceId: 'instance-explore-godot-2026-05',
        name: 'Godot Pioneers',
        // Endless-run, publicly scheduled — Flow 2a's target case: a cold
        // arrival can join, and an unconsented young learner hits the VPC
        // gate at join per the consent matrix.
        type: 'open',
        startDate: '2026-05-12',
        endDate: '2026-06-11',
        // 02-programs-and-offerings.md:12 — "68 enrolled / 30 participated". The
        // 30-participant figure is this program's studentsCompletedCount; seats
        // here reflect the 68 who enrolled into the cohort.
        maxLearners: 68,
        seatsTaken: 68
      }
    ]
  },
  {
    id: 'instance-explore-godot-2026-08-am',
    programId: 'explore-godot',
    enrollmentModel: 'cohort',
    visibility: 'public',
    scheduleLabel: 'Tue/Thu mornings, Sep 1 – Oct 1, 2026',
    // SYNTHESIZED: no facilitator name exists in source for this cohort.
    mentors: ['Priya Sundaram'],
    sessions: buildSessions(
      'instance-explore-godot-2026-08-am',
      '2026-09-01',
      twiceWeeklyOffsets(10),
      '09:00',
      60,
      EXPLORE_GODOT_SESSIONS
    ),
    cohorts: [
      {
        id: 'cohort-explore-godot-dawn-patrol',
        instanceId: 'instance-explore-godot-2026-08-am',
        name: 'Dawn Patrol',
        type: 'open',
        startDate: '2026-09-01',
        endDate: '2026-10-01',
        maxLearners: 20,
        seatsTaken: 8
      }
    ]
  },
  {
    id: 'instance-explore-godot-2026-08-pm',
    programId: 'explore-godot',
    enrollmentModel: 'cohort',
    visibility: 'public',
    scheduleLabel: 'Mon/Wed evenings, Aug 31 – Sep 30, 2026',
    // SYNTHESIZED: no facilitator name exists in source for this cohort.
    mentors: ['Marcus Idowu'],
    sessions: buildSessions(
      'instance-explore-godot-2026-08-pm',
      '2026-08-31',
      twiceWeeklyOffsets(10),
      '18:00',
      60,
      EXPLORE_GODOT_SESSIONS
    ),
    cohorts: [
      {
        id: 'cohort-explore-godot-studio-b',
        instanceId: 'instance-explore-godot-2026-08-pm',
        name: 'Studio B',
        type: 'open',
        startDate: '2026-08-31',
        endDate: '2026-09-30',
        maxLearners: 18,
        seatsTaken: 11
      }
    ]
  },

  // 60 min per session, same as the dated Godot runs above.
  selfPacedInstance('explore-godot', 60, EXPLORE_GODOT_SESSIONS),

  // Educator Training Program has zero instances, deliberately: it's
  // facilitator-facing with no open learner enrollment (02-programs-and-offerings.md's
  // enrollment model applies to learner programs), so its enrollment card should
  // fall through to the notify-me email-capture path rather than showing an
  // empty schedule.
]
