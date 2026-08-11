// Structured question data for the pre-survey takeover wizard
// (ProgramPreSurveyWizard.vue). Separate from curriculum.ts's prose-block
// model — a survey needs answerable fields, not paragraphs.
//
// Source: "Onboarding Surveys" doc, formatted for Typeform — see the vault's
// Knowledge Base/Programs/Explore-Godot/pre-survey.md for the authored draft
// this transcribes. Kept as one flat array rather than keyed by program:
// only Explore: Godot has a pre-survey today. If a second program needs its
// own, promote this to a Record<programId, PreSurveyQuestion[]> then.

export type PreSurveyQuestionType = 'text' | 'select' | 'scale'
export type PreSurveySection = 'whoYouAre' | 'programContext' | 'selfAssessment'

export interface PreSurveyQuestion {
  id: string
  section: PreSurveySection
  prompt: string
  type: PreSurveyQuestionType
  /** Defaults to true — only the closing open-text field is optional. */
  required?: boolean
  /** For type: 'select'. */
  options?: string[]
  /** For type: 'select' — when this exact option is chosen, a follow-up
   *  text field appears asking the learner to specify. */
  otherOption?: string
  otherPlaceholder?: string
  /** For type: 'scale'. Both default to a 1-10 range. */
  scaleMin?: number
  scaleMax?: number
}

export const preSurveyQuestions: PreSurveyQuestion[] = [
  // --- Who You Are ---
  // No name/email fields: the app already knows who's logged in, so asking
  // again here would be redundant.
  {
    id: 'country',
    section: 'whoYouAre',
    prompt: 'What country are you in?',
    type: 'select',
    options: [
      'United States', 'India', 'Pakistan', 'France', 'China', 'New Zealand', 'Canada',
      'Argentina', 'Brazil', 'United Kingdom', 'Sweden', 'Australia', 'South Africa', 'Nigeria', 'Other'
    ],
    otherOption: 'Other',
    otherPlaceholder: 'Which country?'
  },
  {
    id: 'age',
    section: 'whoYouAre',
    prompt: 'How old are you?',
    type: 'select',
    options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+']
  },
  {
    id: 'gender',
    section: 'whoYouAre',
    prompt: 'What gender do you identify with?',
    type: 'select',
    options: ['Male', 'Female', 'Non-binary', 'Prefer not to say']
  },
  { id: 'primaryLanguage', section: 'whoYouAre', prompt: 'What is your primary language?', type: 'text' },
  {
    id: 'timezone',
    section: 'whoYouAre',
    prompt: 'What timezone are you in?',
    type: 'select',
    options: [
      'Pacific Time (PT)', 'Eastern Time (ET)', 'Central Time (CT)', 'Mountain Time (MT)',
      'GMT / UTC', 'Australian Eastern Time (AEST)', 'India Standard Time (IST)', 'Central European Time (CET)', 'Other'
    ]
  },

  // --- Program Context ---
  {
    id: 'howDidYouHear',
    section: 'programContext',
    prompt: 'How did you first learn about Explore: Godot?',
    type: 'select',
    options: ['My university / professor', 'Social media', 'ASU / Endless Games & Learning Lab', 'A friend or classmate', 'Web search', 'Discord', 'Other']
  },
  {
    id: 'topGoal',
    section: 'programContext',
    prompt: 'If you had to choose, what\'s the number one thing you\'d like to get from this program?',
    type: 'select',
    options: [
      'Learn game development skills', 'Have fun making something creative', 'A portfolio-ready game project',
      'Explore a career in games', 'Get hands-on with Godot', 'Earn the ASU microcredential', 'Other'
    ]
  },
  {
    id: 'mediaConsent',
    section: 'programContext',
    prompt: 'From time to time we use footage from our sessions. If you are okay with us sharing your image, please click "Yes."',
    type: 'select',
    options: ['No', 'Yes']
  },

  // --- Competency Self-Assessment (1-10 scales) ---
  {
    id: 'creativeThinking',
    section: 'selfAssessment',
    prompt: 'I feel confident in my ability to come up with new game ideas.',
    type: 'scale'
  },
  {
    id: 'analyticalThinking',
    section: 'selfAssessment',
    prompt: 'I can break down a complex level design project into smaller, manageable steps.',
    type: 'scale'
  },
  {
    id: 'technologyLiteracy',
    section: 'selfAssessment',
    prompt: 'I feel confident navigating the Godot game engine to build and test a level design project.',
    type: 'scale'
  },
  {
    id: 'resilience',
    section: 'selfAssessment',
    prompt: 'I am able to handle challenges or setbacks in a project, including resolving design, technology, or collaboration issues when they arise.',
    type: 'scale'
  },

  // --- Optional ---
  {
    id: 'openFeedback',
    section: 'selfAssessment',
    prompt: 'Is there anything you\'d like to tell us before you get started?',
    type: 'text',
    required: false
  }
]
