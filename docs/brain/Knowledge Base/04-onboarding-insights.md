# Onboarding Insights

Everything we know about how learners enter -- and where they fall out. The FY27 KR (80% of reached learners complete onboarding into the community) makes this a first-order problem.

## The funnel today (measured)

Explore: Godot cohort 1, May-June 2026:

| Stage | Count |
|---|---|
| Enrolled | 68 |
| Onboarded (pre-survey complete) | 46 |
| Participated (attended ≥1 session) | 30 |

The three-step join -- platform account, program enrollment, pre-survey -- created visible drop-off at each stage, and it wasn't even clear internally what an "enrolled learner" was. The retro's top onboarding recommendation: collapse the funnel.

## Known friction points (field-verified)

- **Access codes delivered badly.** Urban Arts observation: codes, URLs, and domain names dictated verbally instead of projected -- signup took ~15 minutes mid-session. BGC: access code hard to find, especially on mobile; the signup walkthrough should be sent ahead of time.
- **Onboarding happens too late.** Platform login happened mid-Session 1 (Urban Arts) or weeks late (Glasswing schools), so early work never landed on the platform.
- **Multi-tool confusion.** Platform + Godot + GitHub as separate systems mis-sets expectations (Urban Arts' Amy expected design to happen "inside the game"). The website layout itself confused a facilitator expecting login → course materials.
- **"Who is Endless?"** BGC learners and partners wanted to know more about who is behind the program. Identity context belongs in onboarding.
- **No up-front contract.** Learners lacked a clear picture of the 10-session arc from day 1. Every program should open with the arc and restate it each session.
- **Mechanical bugs bite.** Enrollment birth-date field only saved in year-month-day order (Glasswing). Small bugs in the signup path have outsized funnel cost.
- **File/project management is part of onboarding.** Newer learners re-unzipped the project every session; where to store and how to return to a project folder needs an explicit onboarding moment.

## Design guidance already established

- **Entry-point logic:** "What brings you to Endless?" is only useful for cold arrivals and campaign traffic. Partner links and program invitations carry enough context -- skip the question there. Personalize the journey by origin.
- **Terminology:** avoid "cohort" in learner-facing language; use "live session" or "your group."
- **Enrollment model:** MVP is URL-embedded access codes; target state is cohort invite tokens.
- **Ownership boundary:** sign-up/onboarding UX and safety/compliance definitions are deliberately separate workstreams -- don't conflate them.
- **Age gate first:** age is self-declared before any personal data is collected and can't be changed later; K-id handles regional thresholds. Under-13s cannot sign up (BGC workaround: teachers submit work on their behalf).

## Gaps on the service blueprint (learner enrollment scenario)

In place: magic link enrollment, mobile-optimized landing, registration, program page, XP bar, siloed cohort feed. Missing (registry status "gap"): partner-branded cohort context at landing ("you're joining X's program"), a standardized partner handoff kit and enrollment communication templates, cohort welcome message post-enrollment, cohort roster and mentor visibility, session schedule on the platform, and the cohort data model itself. In progress: access code validation at signup, enrolled-via attribution, code-naming for cohort attribution.

## Gaps in the A2 platform audit (onboarding section)

Automated welcome email sequence, Welcome Week activities, mentor welcome call, and onboarding survey are all off-roadmap (external tools: HubSpot/Kit/Mailchimp, Calendly, Typeform). Onboarding checklist is partial (Epic 4A, NEXT). Connecting Airtable survey data to platform user IDs is an open engineering question.

## The other end of the funnel: exit is onboarding too

"No learner leaves without a next step" is a stated strategic principle, but the blueprint shows the end of program state as: survey → automatic participation certificate → nothing. No automated "what's next" pathway, no next-program recommendation, no ASU microcredential on the profile. UTP learners repeatedly asked "what's next?" and post-program opportunities (More: Threadbare, Mentor-in-Training) weren't clearly communicated. Treat program exit as onboarding into the always-on community.

## Decision levers

- Collapse the three-step join into one flow, or at minimum define and instrument what "enrolled" means -- the funnel can't be managed while the stages are ambiguous.
- Partner handoff kit (templates, projected-signup instructions, pre-sent walkthrough): cheap, addresses the most-repeated field friction, and is entirely in our control.
- Whether onboarding happens before Session 1 (pre-work) or inside Session 1 (protected time-box) -- both are viable; verbal improvisation is not.
- Sequence the "who is Endless + what's the arc" narrative into the first touch.
- Prioritize the post-program pathway prompt -- it converts harvest into retention and feeds the community goals.
