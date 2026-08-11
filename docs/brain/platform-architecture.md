# System Architecture & Logic Prompt: Educational Game Dev Platform

> Superseded by `onboarding-flows-boundary-consent.md` wherever the two disagree — notably the age gate: that doc's premise is kids join *without* consent and the gate fires later, at the boundary, not at signup.

## 1. Core Onboarding Architecture (The Spine)
*   **Rule:** No upfront signup walls. Allow unauthenticated guest exploration [1].
*   **Trigger:** Account creation is only triggered by a "Commitment Action" (e.g., commenting on a game, applying for a program, claiming a contributor task) [1].
*   **Context Survival (Crucial):** The system must capture the user's intent pre-signup, store it, and automatically route them back to their exact intended action immediately after account creation [1, 2]. 
*   **Onboarding Completion:** Defined not by signup, but by achieving a "First Win" (e.g., submitting a first task or posting a first comment) [1].

## 2. Data Models & Consent Boundaries
*   **Consent Principle:** Consent is *not* required for signup or starting tasks. Consent only fires at the "boundary" when a user's identity or work leaves their contained cohort to become public [3].
*   **Cohort Types:**
    *   *Closed Cohorts:* Invisible to the outside community. Restricted to a predefined list of students [4].
    *   *Open Cohorts:* Visible to the wider community. Users can see outside submissions and interact [5].
*   **Account Types:**
    *   *Restricted (NDPA):* Locked to the institution. No outside visibility, no external consent needed. Work stays strictly inside the cohort [4].
    *   *Young Learner (Digital Youth):* Private by default. Work stays private in the cohort. Requires parental consent (VPC) *only* if their work/identity is leaving the closed cohort to become public [5].
    *   *Adult Learner (18+):* Public by default. No consent required for visibility [5, 6].

## 3. User Action Flows
*   **Flow 1/2: Join a Program (Cohort):** 
    *   *Action:* User joins via invite code or scheduled open cohort [7, 8].
    *   *Checklist UI:* Account Created -> Agree to Code of Conduct -> Introduce self to cohort -> Submit first task to cohort feed (First Win) [7-9].
    *   *Note:* If joining an Endless-run open cohort, youth hit a VPC (parental consent) gate immediately upon joining [8].
*   **Flow 3: Waitlist:**
    *   *Action:* No cohorts available [10].
    *   *Logic:* Lead capture only (email). Do not trigger full onboarding or login flows [10].
*   **Flow 4: Comment on a Game:** 
    *   *Action:* Guest plays a game (no signup needed) -> Hits comment box -> Triggers Wall -> Creates Account -> System returns them to comment box -> Posts comment (First Win) [11].
*   **Flow 6: Contributor:** 
    *   *Action:* User clicks "Contribute" [12]. 
    *   *Logic:* Adults/consented youth are routed to GitHub tasks. Unconsented youth hit a VPC gate offering ungated exit alternatives (play, comment, waitlist) [12].

## 4. UI/UX Components & State Machines
*   **Guest Intent Component:** 
    *   Renders on the guest homepage feed [13]. 
    *   Displays 3 persona cards: *1. "I want to learn to make games" 2. "I want to bring this to a class/program" 3. "I want to contribute"* [13]. 
    *   *Note:* No card for "Play" (play is the surrounding surface) [13].
*   **The "What's Next" Slot:**
    *   A single, persistent UI slot on the authenticated home dashboard governed by a strict state machine (ordered by precedence) [14, 15]:
        1. *Guest:* Shows Intent Cards [14].
        2. *Incomplete Onboarding:* Shows a Checklist Mirror (e.g., "Step 3 of 5, next: [item]") that links directly to the action [14, 16].
        3. *Activated / In Cohort:* Shows the next scheduled step in their program container (e.g., "Next: Session 3, Tuesday 4pm") [14].
        4. *Vacuum (Program Completed):* Shows a recommendation (e.g., "Have you made a game before?" -> routes to beginner workshop or advanced contributor tasks) [15, 17].