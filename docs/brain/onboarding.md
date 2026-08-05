# Product UX & Client-Side Logic Specification: Educational Game Dev Platform

## 1. Core Onboarding "Spine" & Intent Capture
* **Frictionless Entry:** Do not block guest users with upfront signup walls [22]. Let unauthenticated users browse and play games without signing up [22, 34].
* **Commitment Triggers:** Only trigger account creation when a guest attempts a high-commitment action (e.g., commenting on a game, enrolling in a program, or claiming a contributor task) [22].
* **Context Survival:** If a guest hits a signup wall during an action, capture their intent and route them directly back to that action once the account is created (e.g., Guest plays game -> Clicks comment -> Signs up -> Returns to comment box with focus and context preserved) [22, 29, 34].
* **The "First Win" Gate:** Onboarding is only marked complete when the user achieves their "First Win" (e.g., posting their first comment, introducing themselves to a cohort, or submitting their first task) [22, 31, 34].

## 2. Consent Boundaries & Cohort Visibility Models
Consent is not required to sign up or begin tasks [4, 23]. Instead, consent gates are dynamic and fire only when a user's work or identity crosses a boundary from their local cohort into the public domain [4, 23].

| Cohort Type | Account Status | UI Experience & Visibility Logic |
| :--- | :--- | :--- |
| **Closed Cohort** [5, 24] *(Invisible to the outside community)* | **Restricted (NDPA)** [5, 24] | **No consent needed.** All activity, profile details, and submissions stay strictly inside the private cohort space. No outside interaction or gallery access is allowed [5, 24]. |
| **Closed Cohort** [5, 24] *(Invisible to the outside community)* | **Young Learner (Digital Youth)** [5, 25] | **Consent deferred.** Work remains hidden inside the safe cohort environment [5, 25]. A parental consent (VPC) block only triggers if the user attempts to publish a portfolio publicly [6, 25, 31, 40]. |
| **Open Cohort** [5, 25] *(Cohort and feed are public)* | **Young Learner (Digital Youth)** [5, 25] | **VPC Gated.** Requires parental consent at cohort join time before participation or visibility can occur [6, 25, 32]. |
| **Any Cohort** | **Adult Learner (18+)** [6, 25] | **Unrestricted.** Public by default; no consent gates are active [6, 25]. |

## 3. User Experience Flows & Progression Checklists
Upon enrolling, users are presented with a persistent progression checklist. Completing the checklist items moves them toward their "First Win" [30, 31, 32].

### A. Partner Learner (Closed Cohort) [30, 31]
1. Account created (automatically checked off) [30, 31].
2. Agree to the Code of Conduct [30, 31].
3. Introduce yourself to your cohort (structured prompt, in-cohort only, skippable) [30, 31].
4. Submit your first task to the cohort feed (**First Win** - peer-visible within the cohort container) [31].

### B. Cold Arrival (Open Cohort / Scheduled Run) [32]
1. Account created (pre-checked) [32].
2. Agree to the Code of Conduct [32].
3. Introduce yourself to your cohort [32].
4. Submit your first task to the cohort feed (**First Win**) [33].
*(Note: If the user is a Digital Youth, parental consent is verified before they can join the open cohort [32]).*

### C. Game Commis / Commenter Route [34]
1. Guest views a game and writes a comment -> Hits Wall [34].
2. Account created [34].
3. Agree to the Code of Conduct [34].
4. Post your first comment (**First Win** - automatically makes the user a "follower" of that game) [34].

### D. Community Contributor Route [35]
* **Adults / Consented Youth:** Routed directly to the contribution surface [35].
* **Unconsented Youth:** Encounter a clear parental consent gate displaying what lies behind it, while explicitly offering ungated alternative exits (e.g., play, comment, waitlist) [35].

## 4. Unified Content Timeline & Pacing UI
Unify topics, tasks, MCQs, and surveys into a single chronological timeline rather than split across separate tabs [8, 9].
* **Timeline Content Cards:**
  * **Topic Card:** Displays textual instructions, videos, or embedded slide decks [10].
  * **Task/Submission Card:** Gated content item. Unlocking the next item requires submitting work [10].
  * **MCQ Card:** Interactive multiple-choice quiz module [10].
  * **Survey Card:** Integrates an embedded Airtable form in an overlay modal. Detects completion to unlock subsequent steps [10].
* **Pacing Indicator:** Shows the learner's current step relative to the cohort's expected schedule (rendered visually as *On Track*, *Behind*, or *Ahead*) [9].
* **Completion State:** 
  * *Unscored Cohorts:* Auto-triggers completion once all program steps are completed [11].
  * *Scored Cohorts:* Gated on both learner completion and facilitator review/approvals [11].

## 5. The Three-Feed Cohort View
The internal cohort space displays a consolidated feed area structured into three specialized streams, ensuring all user types can freely interact within their cohort container [7]:
1. **Submissions Feed:** Displays auto-populated student task completions. Peer-visible and commentable within the cohort [7, 8].
2. **Announcements Feed:** A one-directional channel for facilitator-posted live notices, updates, and calendar reminders (learners cannot reply or post here) [7].
3. **Introductions Feed:** An icebreaker workspace where learners present themselves to cohort peers [7].
* **Visibility Rules:** For Restricted (NDPA) and unconsented learners, interaction and visibility are strictly containerized to these three internal streams. They can view, but not reply to, the cross-cohort community feed [7].

## 6. Public Submission Asset Library (Gallery)
A browsable public gallery specifically designed for non-game artifacts [13].
* **Comments & Likes:** Open to public interaction [14].
* **Manual Portfolio Addition:** "Add to Portfolio" is an explicit manual action by the user and is never automated [14].
* **Portfolio Consent Walls:** 
  * Closed cohort (Tier 2) and open cohort (Tier 3) youth must pass a "Publish Portfolio" or "Post Outward" consent gate before their custom assets, custom username, or custom avatar become visible to the outside public gallery [14, 40].

## 7. The "What's Next" Dashboard State Machine
A single, persistent UI slot on the authenticated home dashboard governed by a strict state machine. It displays only one relevant action at a time [36]:

```
+-------------------------------------------------------------+
| STATE                                | UI CARD RENDERS      |
+-------------------------------------------------------------+
| 1. Guest                             | Intent Cards         |
|                                      |                      |
| 2. Auth (Checklist Incomplete)       | Checklist Mirror     |
|                                      |                      |
| 3. Activated (In Ongoing Cohort)     | Next Scheduled Step  |
|                                      |                      |
| 4. Next-Step Vacuum (Program Done)   | Recommendation       |
+-------------------------------------------------------------+
```

1. **Guest State:** Displays the main intent-gathering persona cards: *"I want to learn to make games"*, *"I want to bring this to my class"*, or *"I want to contribute"* [28, 36].
2. **Incomplete Onboarding State:** Renders a compact **Checklist Mirror** (e.g., *"Explore: Threadbare — 3 of 5 done, next: join your first live session"*) linking directly back to the program workspace [36, 39].
3. **Active Cohort State:** Surfaces the next upcoming task or scheduled live session in their active cohort (e.g., *"Next: Session 3, Tuesday at 4:00 PM"*) [36].
4. **Vacuum State (Post-Completion):** Occurs when a program finishes. Displays a fallback questionnaire (*"Have you made a game before?"*) that routes beginners to introductory workshops and advanced users to community contribution tasks [37, 42].
