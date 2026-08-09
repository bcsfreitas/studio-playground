# Onboarding Flows - Boundary Consent Model, Plan Now / Plan Later

Source: Google Doc, Joana Filizola. Drafted 2026-07-17, last updated 2026-07-24. Ref: Learner Experience Programs Briefing Belka.

> This is the authoritative, most-detailed pass at the onboarding spine. Where it disagrees with the earlier `onboarding.md` / `platform-architecture.md` notes — most importantly the age-gate reversal (kids join *without* consent; the gate fires later, at the boundary, not at signup) — this doc wins.

## The spine

Entry → guest exploration → **commitment action triggers registration wall** → minimal account creation → return to the committed action → personalized checklist based on commitment → **first win = final checklist item = onboarding complete**.

Intent is inferred from entry context; the fallback "What brings you to Endless?" question fires only on direct signup with empty context. Entry context must survive the signup round trip.

## The consent principle

Consent fires at the boundary where work or identity leaves its container (cohort) — not at signup, not at task-start (which is the first win and should not get blocked by the VPC flow). Kids join the platform without parental consent. What varies across account types or cohort types is only *where the boundary sits*.

|  | Governs… | Controls… |
|---|---|---|
| **Cohort type** (closed/open) | The container (Cohort space) | Whether the group itself is discoverable — can other cohorts/the community see this cohort exists, see its roster or feed as a group |
| **Account status** (restricted / young learner / adult+consent) | The individual | Whether *that person's* own work, profile, or identity is visible to the wider community — independent of which cohort they sit in |

|  | Closed cohort | Open cohort |
|---|---|---|
| **Restricted account (NDPA)** | Consent isn't needed — work stays inside of the cohort, no outside interaction. Can't see other feeds, can't interact with galleries. **Group is invisible**: not discoverable outside. **Individuals** are locked to institution. No outside visibility, no consent in play. Explorers Program | — |
| **Young Learner (Digital Youth)** | No consent needed: a teacher/partner already placed them there. Work stays private; consent is deferred, not skipped. **Group is invisible**: not discoverable outside. **Individuals are private** — visibility deferred, not consented, until they leave the closed cohort | Parental consent required: this is the moment work/identity becomes visible outside the cohort. **Cohort/feed visible** to the wider community. **Individuals are public,** consent cleared |
| **Adult Learner (18+)** | No consent needed. Can still be kept private if the partner prefers it (e.g. wants their mentors/logistics chatter separate) — but that's a choice, not a legal requirement. **Group is invisible**: not discoverable outside. **Individuals Public by default**: nothing gates an individual adult's visibility | No consent needed. Public/unrestricted by default. **Cohort/feed visible** to the wider community. **Individuals are public after consent** cleared |

FERPA logic: the school consents for in-program (in-cohort) activity; student + parental consent is needed only for work to leave the institution's container -> public portfolio, future libraries.

## Strategy split

**Plan Now (optimized): partners + educator training.** Solo rider is unimpeded but honestly thin: play *Threadbare*, comment on game pages, read resources, join-next-cohort, and the contributor CTA for adults and consented youth. Coming soon: self guided programs.

**Plan Later (B2C): unbundling.** Content is currently welded to program containers. Later-plan inventory: workshops as independent joinable objects; Loom Lounge recordings surfaced; Story Quests visible and playtestable (needs community XP layer); Lore Jam winners public; tutorials surfaced out of GitHub; asset library; portfolio pages; domain-filtered recommendations (M6). No onboarding flow can route to content the platform cannot surface.

---

## Flows — Plan Now

### Guest intent component

**Sign Up:**

1. Based on commitment (I want to post, I want to join a program, I want to see a contribution task details) — we know what is the intention of the user, we tag them as educators or not. After sign up the guest intent component is replaced by the "what's next" component.
2. Direct Sign up -> no intent capture — the guest intent component stays there to guide the user to suggestions and finish sign up. It goes away after they have completed onboarding actions (first win, first comment, first interaction).

**"What brings you here?" lives on the guest home surface, embedded in the feed** — three persona cards: *I want to learn to make games* / *I want to bring this to a class or program I run* / *I want to contribute to the community*. Play has no card: the surrounding surface is play.

- A card tap **creates entry context as a guest, pre-wall** — it routes the guest toward their commitment action (program catalog / educator training programs / contribution surface with bounties and *Threadbare* tasks). When the guest later commits and hits the wall, intent is already known.
- Context-survival requirement: **when the user clicks on the wall to sign up, they need to go back to the action they intended to do.** For example: Join a Program -> Sign up -> Back to Program.
- THE "Contribute" suggestion takes the guest to the place where they can browse the actual contribution surface before committing. Github tasks, contribution (bounties) tasks. Will need integration.
- Card behavior: **navigate** (MVP)
  1. Learner: All programs (filtered to learner context)
  2. Educator: All programs (filtered to training materials)
  3. Contributor: Contribution MVP page that shows github tasks from Threadbare (and other games) filterable and bounties (taking to bounties site).
- Signed-in state: the component must transform or disappear for authenticated users (their dashboard knows why they're here). Unless they sign up directly without context.

## Join Program Flows

### Flow 1a — Restricted NDPA partner learner

Entry: partner join code / pre-provisioned or SSO. Wall = the invite.

**Checklist:**
1. ✓ Account created (pre-checked)
2. Agree to the code of conduct
3. Introduce yourself to your cohort (structured prompt, in-cohort only, skippable)
4. **Complete your first task** ← first win, siloed, never gated to outside, cohort peers see it, like it, comment on it

### Flow 1b — Non-restricted partner learner, closed cohort

Entry: partner join code. Wall = the invite.

**Checklist:**
1. ✓ Account created (pre-checked)
2. Agree to the code of conduct
3. Introduce yourself to your cohort
4. **Submit your first task to the cohort feed** ← first win — cohort peers see it, like it, comment on it

Parental consent arrives later as a *Post First Win* moment: "publish your portfolio" (see M2b). This is the consumer → creator → contributor ramp with consent riding it, not blocking it.

### Flow 1c — Non-restricted partner learner, open cohort

Same checklist and win as 1b; work stays hidden in-cohort until permission-to-post clears. The learner sees the open platform from day one.

## Cold arrival Flows

### Flow 2a — Join a cohort (program page shows the scheduled open cohorts for that program — there may be options)

Guest sees "Join - starts [date]" on the program page → wall → adult: straight in; Digital Youth: **VPC at join (tier 4, legal constraint)** → cohort.

1. ✓ Account created (pre-checked)
2. Agree to the code of conduct
3. Introduce yourself to your cohort
4. **Submit your first task to the cohort feed** ← first win — cohort peers see it, like it, comment on it

### Flow 2b — Join a waitlist (program page shows no cohort soon)

No onboarding: lead capture.

### LATER: Flow 3 — Register for a workshop (tier 4)

Unchanged: guest sees the workshop → register → wall → Digital Youth VPC at join.

**Checklist:** ✓ account → code of conduct → **register + add to calendar** ← first win

1. ✓ Account created (pre-checked)
2. Agree to the code of conduct
3. Register + add to calendar ← first win

### Flow 4 — Comment on a game

There is no signing up *to play* — play never hits a wall. A guest plays, has an opinion, and hits the comment box: **that is the wall.** Account → return to the comment box, context preserved → post.

**Checklist:** ✓ account → code of conduct → **post your first comment** ← first win — comment makes them a follower of the game, a countable join

### Flow 5 — Educator

Guest browses materials → applies to educator training → wall → adult consent trivial → educator tag (unverified, marketing only).

**Checklist:** ✓ account → code of conduct → **join the educator training program** ← first win

### Flow 6 — Contributor

Entry context: **"Contribute" CTA on the *Threadbare* game page.** No question needed — the click is the intent.

- Adults and consented youth → routed to GitHub contribution tasks.
- Unconsented Digital Youth → **sees the VPC gate** (decided). The gate screen should say what's behind it and offer the ungated alternatives (play, comment, waitlist) so the dead end has exits.

**Checklist:** ✓ account → code of conduct → connect GitHub (VPC-gated for youth) → **claim your first contribution task** ← first win

⚑ Instrumentation gap: contribution happens on GitHub, off-platform. How the platform knows a task was claimed/completed needs an engineering answer (webhook, manual, honor system).

## What's Next Slot

One persistent slot on home with one job: always render the single most relevant next action for this user. Never empty, never two things at once. Its content walks the lifecycle:

| State | Slot renders |
|---|---|
| Guest | "What brings you here?" intent cards |
| Authenticated, checklist incomplete | Checklist mirror ("[program] — 3 of 5, next: [item]") |
| Activated, inside an ongoing cohort | Next scheduled step in that container ("Next: session 3, Tuesday 4pm" / next task) — the program is the what's-next |
| Next-step vacuum (program completed, workshop ended, comment-route return) | "Have you made a game before?" → beginner: next workshop; non-beginner: *Threadbare* contribution tasks |
| Recommendation pending | The recommendation persists until acted on or dismissed |

- The slot is a state machine, not a widget collection — one state is true at a time, and the states above are ordered by precedence.
- It is the only home surface that asks the user anything.
- It never renders profile housekeeping — because identity lives elsewhere, not because it doesn't matter. Identity prompts fire at visibility moments (M3): the cohort intro, the first-comment composer, the VPC clearance that unlocks custom name and avatar. Field-driven nudges ("complete your profile") stay banned from the slot; work-driven moments (tier 2 portfolio publish, Plan Later) qualify.
- Multi-container users (e.g. in a program and following games): the slot follows the container with the nearest scheduled step; the feed handles the rest.
- Plan Later: this slot is where domain-filtered recommendations (M6) and eventually matchmaking prompts render — the surface is designed once, its inventory grows with the platform.

**Checklist:**

When a learner enrolls on the program for the Join Program Flows, they land directly on the program page. That same checklist is there and on the dashboard until they complete it. One component with one state, rendered in two places: it's an enrollment-scoped component that any surface can mount, so checking "join your first live session" on the program page updates it everywhere instantly.

- Program page is primary. That's where the learner lands post-enrollment and where four of the five checklist items actually happen — the checklist should sit beside the thing it narrates, not on another page describing it.
- Home/dashboard mirrors it for the return visit. The learner who enrolls in session 1, leaves, and comes back Thursday lands on home — if home shows no trace of the incomplete checklist, they've lost the thread and have to remember to navigate back. The mirror is a compact state ("Explore: Threadbare — 3 of 5 done, next: join your first live session") that links into the program page rather than duplicating the full component.
- On completion: celebrate at 100%, then the mirror leaves home.

## Data moments

One question per moment; every moment sits next to the action that uses the answer.

| # | Moment | Trigger | Data | Notes |
|---|---|---|---|---|
| M1 | Sign up Wall | Commitment action | **DOB (first), email + password.** Geolocation inferred. Username assigned (youth) or chosen (adults). Real name: partner roster only, optional for others | |
| M2a | Tier-4 consent | Digital Youth joins Endless-run cohort/workshop | Parent email → VPC | Legal constraint, before participation |
| M2b | Boundary consent | "Publish portfolio" (tier 2) / "post outward" (tier 3) / GitHub connect (Flow 6) / custom username, avatar and background image | Parent email → VPC, once, covers everything | Peak-motivation consent; no pending states |
| M3 | First visibility moment | The learner is about to be seen: cohort intro (checklist item 3) for program learners; first-comment composer for the comment route | Avatar and background image from **preset library** (optional, skippable) (youth) or chosen (adults) | Identity fires at visibility. Custom username/avatar unlock at VPC clearance — consent as identity upgrade |
| M4 | Fallback question | **Zero entry context AND zero guest interaction** — rare once the guest intent component ships | Intent | Demoted: the guest component is the primary intent capture, pre-wall |
| M5 | "What's next" | **Next-step vacuum**, not the first win itself: workshop ended, play-route choice made, or program completed. Learners inside an ongoing program are never interrupted — their what's-next is the program | "Have you made a game before?" (No / A little / Yes) | Renders in the What's Next slot on home. Beginner → workshop; non-beginner → contributor tasks. For program learners this fires at program completion — the program → platform bridge, landing on someone with finished work and nothing scheduled |
| M6 | Second recommendation | Return visit post-M5 | Domain curiosity | **Plan Later** — requires domain-filtered recs, which require unbundling |
| M7 | Program pre-survey | First program's pre-survey (once ever for gender; per-program for the rest) | **Gender** (M/F/Non-binary/Prefer not to say, optional, preface: equity reporting only, never displayed on the platform, never re-asked) + detailed skill levels, heard-about-us, photo release | Gender stored account-level, pulled silently for all later programs. Not a profile field — it lives with the thing it serves. Asked in all containers including partner-run; **partner-visible there as normal pre-survey data** (decided). Fallback if an issue surfaces: remove the question for partners entirely |
| — | Never | — | Timezone (inferred), country (geolocated), skills/roles/portfolio/availability (earned) | — |

---

## Dependencies — open items

1. **Tier 2 (closed cohort) legal pass** — Daniel. Blocking: it underpins the majority path.
2. "Available soon" threshold for open cohorts.
3. Open application + code for capacity-capped cohorts.
4. Workshop win: registration vs. attendance.
5. Waitlist → cohort-open notification/auto-enroll path.
6. Self guided.
7. Contributor instrumentation (GitHub is off-platform).
8. Plan Later unbundling epic (workshops independent, content surfaced, asset library, community XP, portfolios) — needs its own scoping.
9. Guest intent component: navigate vs. lens behavior (recommendation: navigate now, lens later).
10. Guest intent component: signed-in transformation — what replaces the cards per persona once authenticated.
11. Guest context persistence: card taps and browsing context must survive the signup + consent round trip — extends ledger item 5's engineering scope.

## Screens to design for prototype

### Guest surface

1. **Guest home** with the **"What brings you here?" component** embedded in the feed.
2. **Programs Landing page — guest view, persona-filtered.**
   1. learner card → filtered to learner programs, showing tags that explain what they are.
   2. educator card → filtered to educator training. *Now: filter = persona-relevance, not personalization (the platform knows nothing about the guest yet). Questions that refine further are deferred to Later, when content inventory justifies them.*
3. **Program about page — guest view.**
   1. cohort scheduled → "Join — starts [date]";
   2. no cohort scheduled → "Join the waitlist." (lead capture)
   3. Self-guided option.
4. **Games Landing page — guest view** with filters.
5. **Game page — guest view** with play, and the comment box as the wall trigger. There can be a "join to comment" component on the guest view of the game page.
   1. Play happens inside the platform (like the tools on Joana's Claude design).
6. **Contribution page — guest view** — (bounties list that take to bounties and Threadbare github tasks that take to threadbare page).
7. ***Threadbare* game page** with a **contribute tab** (Github integration).

### Post-commitment, checklists

1. **Cohort page checklist** (F1/F2 land here) — checklist primary on this page.
   1. We show here also the topics and tasks integrated (doesn't need to be fully polished).
2. **Educator Cohort page checklist** (F5).
3. **Contributor task view + checklist** (How does this look like?).
4. **Completion / celebration state** — fires at 100%, per-persona copy.

### Home for authenticated users

Reference File — Login (Figma).

15. **The What's Next** in its states:
    1. Guest (choice)
    2. During onboarding -> First Win: checklist mirror (incomplete)
    3. During Program: next-step Program (activated, ongoing)
    4. After Program: Recommendation (vacuum after program). This can be totally conceptual.

### Identity (fires at visibility, not signup)

16. **Avatar-pick moment** embedded in the cohort intro and comment composer (preset library, skippable, "this is how you'll appear").

### Other parts of the prototype

17. **Tools corner.**
    1. The dedicated section "Make" with all the tools embedded and usable.
    2. On a programs page we can have the resource tab we can show those same tools there.

## Open comment threads (from the source doc)

- "Self guided" — flagged as needing scheduling/scoping.
- "Need refinement" — on the strategy split section.
- "Needs game play inside the platform and prompt to leave a comment" — on Flow 4.
- "We don't have workshops scheduled yet, needs review" — on Flow 3.
- Resolved: a review comment on the dependencies list.
