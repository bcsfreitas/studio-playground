# Company & Platform Overview

## Who we are

Endless Access is a nonprofit building the Endless Studios platform -- a game-making learning environment structured as a multi-tenant hub, reaching learners from underserved communities through partner institutions and educators. The platform is intended to eventually transfer to a for-profit Endless Studios entity; this nonprofit/for-profit dynamic matters to partners and must be proactively managed in partner communications, while never surfacing confusingly to learners.

The platform is not a course delivery tool. It is an "always-on" community where learners progress through four stages:

**Consumer → Creator → Contributor → Career**

Learners keep participating, contributing, and growing beyond structured programs. This journey model is the backbone for every program, onboarding, and community decision.

## Platform architecture: multi-tenant hub

This is the future vision -- today Endless Access is effectively the only content provider -- but the platform is architected as multi-tenant from day one. Three layers:

- **Platform** -- neutral infrastructure, owned by Endless Studios
- **Studio / content providers** -- content owners (Endless Access, E-Line/Endstar, future studios)
- **Institution** -- delivery partners (UTP, Urban Arts, BGC, Glasswing, etc.)

Brand clarity is non-negotiable: every game, course, and certificate is visibly attributed to its owning studio. Learners experience one connected community and largely won't care which studio is behind content -- their journey is shaped by who they are and how they arrived. Partners, by contrast, care a great deal about attribution and contractual clarity.

## The flagship game

*Threadbare* is the open source flagship game (play.threadbare.game, GitHub: endlessm/threadbare). Learners can contribute StoryQuests (Godot mini games), assets, playtests, and feedback to the live game -- contribution to a real shipped game is the core of the Contributor stage.

## Recognition systems

Three distinct systems with different triggers:

- **XP** -- earned by completing tasks. 150 XP is the floor value of a single task.
- **Badges** -- awarded for contributions (asset submissions, ideas, playtests, peer feedback, StoryQuest submissions, PRs), not task completion.
- **Microcredentials** -- two exist: Community Game Making (Core: Threadbare, 7 criteria) and Intro to Game Making (Explore Series, 3 criteria). The platform determines eligibility; learners claim the credential on ASU's external issuer site. Today eligibility identification and the CSV handoff to ASU are manual.

## Safety, compliance, and account types

The platform integrates with K-id for regional age gates and parental consent. Supported regions: LATAM, US, Africa, Jordan, UAE, EU -- each with different age-of-consent thresholds handled dynamically by K-id. Age is self-declared at signup and cannot be changed after account creation.

Three account types:

- **Restricted Partner** -- school/NDPA-bound institutions; bulk-created by the institution; siloed, limited experience
- **Limited Personal (Digital Youth)** -- ages ~13-18 signing up independently; parental consent required for community features
- **Personal** -- adults (18+)

NDPA (the US National Data Privacy Agreement) is the primary compliance goal for US school systems. Key implications: student-generated work is Student Data owned by the school; it stays siloed unless the learner initiates a transfer to a personal account; data deletion within 60 days of NDPA termination; only Explore: Threadbare is NDPA-compatible in the MVP. Digital Minors (below regional consent age, ~under 13 in the US) cannot sign up at all.

Minors must not be encouraged or incentivised to use Discord, even with parental consent -- their experience must remain on the platform.

## FY27 goals

| Goal | Key results |
|---|---|
| Reach & activate | 100,000 learners from underserved communities reached; 80% of reached learners join the platform and complete onboarding |
| Engage & retain | 10,000 MAU and 2,000 DAU (active = does more than log in) |
| Impact | 50,000 learners at 150+ XP; 15,000 at 500+ XP; 5,000 awarded an industry-recognised microcredential |
| Scalability | Below $50 cost per learner; $150k net direct revenue; $2M third-party funding committed to partners |

## Decision levers

- The 80% onboarding-completion KR makes onboarding a first-order strategic problem, not a UX detail (see `04-onboarding-insights.md`).
- The MAU/DAU goals depend on the always-on community actually retaining people -- today most community capability gaps are unresolved (see `05-community-needs.md`).
- NDPA compatibility currently constrains which programs can go into US schools; expanding beyond Explore: Threadbare is a program-shaping decision with compliance cost.
- Everything must work at under $50 per learner -- any program design that depends on individual staff attention needs an ecosystem-scale alternative.
