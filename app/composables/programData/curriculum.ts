import type { CurriculumModule } from './types'

// XP has no source in the Knowledge Base docs.
// SYNTHESIZED: flat per-type values so totals stay predictable across programs.
const XP = { topic: 25, survey: 15, resource: 10, task: 50, deliverable: 200 } as const

export const curriculumByProgram: Record<string, CurriculumModule[]> = {
  // Source: docs/brain/Knowledge Base/Programs/Core-Threadbare/{curriculum,sessions}.md
  // One module per milestone (5), per curriculum.md's "Milestone overview". Milestones
  // 1-3 are built thin on purpose — curriculum.md:9 warns those decks are visually
  // driven (heading-only slides), so there is no session content to extract beyond
  // titles. Milestones 4-5 have real activity and resource detail to draw from.
  'core-threadbare': [
    {
      id: 'mod-ct-1',
      title: 'An Introduction to Game Design',
      description: 'Sessions 1 through 3, introducing core game design concepts and the first StoryQuest ideas. These decks are visually driven, so most instructional content lives in slide visuals rather than in extractable text.',
      items: [
        {
          id: 'item-ct-1-1',
          type: 'topic',
          title: 'What makes a video game a game?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-ct-1-2',
          type: 'topic',
          title: 'Who am I as a game maker?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-ct-1-3',
          type: 'topic',
          title: 'How is a game stitched together?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          // SYNTHESIZED: curriculum.md's "What is not in these decks" section states
          // plainly that no explicit deliverables are stated in text for any milestone.
          // Grounded in the one thing Milestone 1 sessions do name: the "StoryQuest
          // Ideas" segment (Session 1) and "GDD for your StoryQuest!" segment (Session 3).
          id: 'item-ct-1-deliverable',
          type: 'deliverable',
          title: 'Draft your first StoryQuest idea',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You've written a short StoryQuest idea: its setting, main character, and goal.",
            "Your idea is captured in a Game Design Document (GDD) you can bring into Milestone 2."
          ]
        }
      ]
    },
    {
      id: 'mod-ct-2',
      title: 'Getting Set Up and the First Working Session',
      description: 'Sessions 4 and 5: making sure the tools are ready, then the first hands-on working session building the StoryQuest repository.',
      items: [
        {
          id: 'item-ct-2-1',
          type: 'topic',
          title: 'Am I up to date with the things I need to start creating?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-ct-2-2',
          type: 'topic',
          title: 'First Working Session',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          // SYNTHESIZED: no explicit deliverable in source (this deck is heading-only,
          // with no code or Git commands recoverable). Grounded in Session 4's own
          // agenda items, "Let's clone!" and "Create the files for your StoryQuest".
          id: 'item-ct-2-deliverable',
          type: 'deliverable',
          title: "Clone the Threadbare repository and create your StoryQuest files",
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You've cloned the Threadbare repository to your own machine.",
            "Your StoryQuest's starter files exist in your fork, ready for Milestone 3's mini-game work."
          ]
        }
      ]
    },
    {
      id: 'mod-ct-3',
      title: 'Working Sessions (Sessions 6 to 13)',
      description: 'The eight working sessions between setup and playtesting. The source deck treats all eight as one repeated working-session format rather than as distinct sessions, so this module does too.',
      items: [
        {
          id: 'item-ct-3-1',
          type: 'topic',
          title: 'Working Sessions (Sessions 6 to 13)',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          // SYNTHESIZED: this is the sparsest deck in the program (four slides of
          // extractable text) and states no per-session content or deliverable.
          // Grounded in the reused Working Session protocol's "Record your progress"
          // column, the only substantive text this deck contains.
          id: 'item-ct-3-deliverable',
          type: 'deliverable',
          title: "Keep your Project Board updated as you build",
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "Your team's Project Board reflects the mini-game tasks you've completed across Sessions 6-13.",
            "You've recorded progress and left comments for teammates, per the Working Session protocol."
          ]
        }
      ]
    },
    {
      id: 'mod-ct-4',
      title: 'Playtesting & Iteration',
      description: 'Sessions 14 through 16: sharing the prototype for playtesting, gathering and prioritizing feedback, then a final polish before launch.',
      items: [
        {
          id: 'item-ct-4-1',
          type: 'topic',
          title: 'What makes a StoryQuest good?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-ct-4-2',
          type: 'topic',
          title: 'What makes a StoryQuest GREAT?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-ct-4-3',
          type: 'topic',
          title: "It's the final countdown",
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-ct-4-resource-1',
          type: 'resource',
          title: 'Gather and Reflect on Player Feedback',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          id: 'item-ct-4-resource-2',
          type: 'resource',
          title: 'Refine Your Game on the Project Board',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          id: 'item-ct-4-resource-3',
          type: 'resource',
          title: 'Publish your StoryQuest',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          id: 'item-ct-4-resource-4',
          type: 'resource',
          title: 'Submit a StoryQuest Upstream',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: curriculum.md states no explicit milestone deliverable.
          // Acceptance criteria assembled from the named Project Board issues that
          // structure Sessions 14-16: Conduct playtesting sessions, Gather and reflect
          // on player feedback, Refine your game, and Publish your StoryQuest.
          id: 'item-ct-4-deliverable',
          type: 'deliverable',
          title: 'Publish your playtested and refined StoryQuest',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You ran a playtesting session and recorded what players noticed.",
            "You refined your StoryQuest based on that feedback.",
            "You completed the Publish your StoryQuest issue on the Project Board.",
            "You opened your final upstream pull request to the Threadbare repository."
          ]
        }
      ]
    },
    {
      id: 'mod-ct-5',
      title: 'Production & Launch',
      description: 'Sessions 17 and 18: building a pitch for the finished StoryQuest, then showcasing it and reflecting on the journey.',
      items: [
        {
          id: 'item-ct-5-1',
          type: 'topic',
          title: 'How do you tell a StoryQuest? How do you sell it?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-ct-5-2',
          type: 'topic',
          title: 'Where will your StoryQuest take players? And where will it take you?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-ct-5-resource-1',
          type: 'resource',
          title: 'Present your StoryQuest',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          id: 'item-ct-5-resource-2',
          type: 'resource',
          title: 'Game Design Awards',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          // Session 18's own "Post-survey" slide, closest thing Core: Threadbare has
          // to a Self-Check.
          id: 'item-ct-5-survey',
          type: 'survey',
          title: 'Post-survey',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: curriculum.md states no explicit milestone deliverable.
          // Grounded in the Create Your Game Pitch Deck issue (Session 17) and the
          // Share your StoryQuest / Reflect activities (Session 18).
          id: 'item-ct-5-deliverable',
          type: 'deliverable',
          title: 'Present your StoryQuest pitch',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You built a pitch deck for your StoryQuest using the Pitch Deck Template.",
            "You presented your StoryQuest and pitch to the group.",
            "You reflected on the feedback you received and what you're proud of."
          ]
        }
      ]
    }
  ],

  // Source: docs/brain/Knowledge Base/Programs/Explore-Threadbare/{curriculum,sessions}.md
  // One module per discipline (4), per curriculum.md's "Workshop map". Each workshop
  // is a standalone, independently-joinable one-hour session (curriculum.md: "this is
  // NOT a cohort"), and every one follows the same arc ending in a Self-Check, so every
  // workshop contributes both a topic item and a survey item.
  'explore-threadbare': [
    {
      id: 'mod-et-1',
      title: 'Game Design',
      description: 'Four standalone one-hour workshops covering the core disciplines of game design: mechanics, narrative, player experience, and progression.',
      items: [
        {
          id: 'item-et-1-1',
          type: 'topic',
          title: 'Core Gameplay & Mechanics',
          drivingQuestion: 'What makes the player return to a game over and over again?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-1-1-check',
          type: 'survey',
          title: 'Core Gameplay & Mechanics Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-et-1-2',
          type: 'topic',
          title: 'Narrative & Storytelling',
          drivingQuestion: "How can writing change the player's experience?",
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-1-2-check',
          type: 'survey',
          title: 'Narrative & Storytelling Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-et-1-resource-1',
          type: 'resource',
          title: 'Exemplar #1',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          id: 'item-et-1-resource-2',
          type: 'resource',
          title: 'Exemplar #2',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          id: 'item-et-1-3',
          type: 'topic',
          title: 'Game Feel & UX',
          drivingQuestion: 'How do designers invite players to discover their own path through a game?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-1-3-check',
          type: 'survey',
          title: 'Game Feel & UX Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-et-1-4',
          type: 'topic',
          title: 'Progression & Motivation',
          drivingQuestion: 'How do game makers give the core loop a refresh?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-1-4-check',
          type: 'survey',
          title: 'Progression & Motivation Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: each workshop already states its own deliverable in source
          // (a storyboard, an Artifact, a signposting concept, or a skill tree), but
          // these are independently joinable, not a sequence — so there is no single
          // "the module's deliverable" in the source. This generalizes across whichever
          // workshop(s) a learner actually attends.
          id: 'item-et-1-deliverable',
          type: 'deliverable',
          title: 'Share a Game Design contribution',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You completed one Game Design workshop's deliverable (a core gameplay loop storyboard, a narrative Artifact, a signposting concept, or a skill tree).",
            "You shared it to the Endless Access community platform.",
            "You gave feedback on someone else's contribution using Compliment, Coach, Encourage."
          ]
        }
      ]
    },
    {
      id: 'mod-et-2',
      title: 'Art',
      description: 'Three standalone one-hour workshops covering animation, visual aesthetics, and sound design.',
      items: [
        {
          id: 'item-et-2-1',
          type: 'topic',
          title: 'Animation & Effects',
          drivingQuestion: "How can animation deepen the player's connection to the game world?",
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-2-1-check',
          type: 'survey',
          title: 'Animation & Effects Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-et-2-2',
          type: 'topic',
          title: 'Aesthetics & Visual Design',
          drivingQuestion: 'How can one pixel art asset help shape the story of a game?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-2-2-check',
          type: 'survey',
          title: 'Aesthetics & Visual Design Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-et-2-resource-1',
          type: 'resource',
          title: 'Content Guidelines',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          id: 'item-et-2-resource-2',
          type: 'resource',
          title: 'Pixel Stitch Guide',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          id: 'item-et-2-resource-3',
          type: 'resource',
          title: 'Size Guide',
          xp: XP.resource,
          contentType: 'text'
        },
        {
          id: 'item-et-2-3',
          type: 'topic',
          title: 'Music & Sound',
          drivingQuestion: 'How can sound deepen your connection to a moment in a game?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-2-3-check',
          type: 'survey',
          title: 'Music & Sound Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: same reasoning as the Game Design module's deliverable —
          // each workshop states its own, but the workshops are independently joinable.
          id: 'item-et-2-deliverable',
          type: 'deliverable',
          title: 'Share an Art contribution',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You completed one Art workshop's deliverable (an animated pixel art sprite, a pixel art asset, or a sound effect).",
            "You shared it to the Endless Access community platform.",
            "You gave feedback on someone else's contribution using Compliment, Coach, Encourage."
          ]
        }
      ]
    },
    {
      id: 'mod-et-3',
      title: 'Engineering, Management & Production',
      description: 'Four standalone one-hour workshops covering gameplay programming, performance, project workflow, and QA.',
      items: [
        {
          id: 'item-et-3-1',
          type: 'topic',
          title: 'Gameplay & Systems Programming',
          drivingQuestion: 'How does programming shape what players feel & experience?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-3-1-check',
          type: 'survey',
          title: 'Gameplay & Systems Programming Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-et-3-2',
          type: 'topic',
          title: 'Optimization & Performance',
          drivingQuestion: "How do unseen systems shape a player's experience moment to moment?",
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-3-2-check',
          type: 'survey',
          title: 'Optimization & Performance Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-et-3-3',
          type: 'topic',
          title: 'Project & Workflow Management',
          drivingQuestion: 'How can you lead a team to enhance a game experience?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-3-3-check',
          type: 'survey',
          title: 'Project & Workflow Management Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-et-3-4',
          type: 'topic',
          title: 'QA & Playtesting',
          drivingQuestion: 'How does a development team make sure that a game is ready to be released?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-3-4-check',
          type: 'survey',
          title: 'QA & Playtesting Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: same reasoning as the Game Design module's deliverable.
          id: 'item-et-3-deliverable',
          type: 'deliverable',
          title: 'Share an Engineering, Management & Production contribution',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You completed one workshop's deliverable (a modified player script, performance notes and a spawner change, an Adventure Pack moodboard, or an annotated QA whiteboard).",
            "You shared it to the Endless Access community platform.",
            "You gave feedback on someone else's contribution using Compliment, Coach, Encourage."
          ]
        }
      ]
    },
    {
      id: 'mod-et-4',
      title: 'Go-To-Market',
      description: 'Two standalone one-hour workshops covering marketing and publishing & distribution.',
      items: [
        {
          id: 'item-et-4-1',
          type: 'topic',
          title: 'Marketing',
          drivingQuestion: 'How can we bring a digital game to life for players to enjoy in the real world?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-4-1-check',
          type: 'survey',
          title: 'Marketing Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-et-4-2',
          type: 'topic',
          title: 'Publishing & Distribution',
          drivingQuestion: 'How do players get games?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-et-4-2-check',
          type: 'survey',
          title: 'Publishing & Distribution Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: same reasoning as the Game Design module's deliverable.
          id: 'item-et-4-deliverable',
          type: 'deliverable',
          title: 'Share a Go-To-Market contribution',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You completed one workshop's deliverable (a swag mockup or a promotional poster).",
            "You shared it to the Endless Access community platform.",
            "You gave feedback on someone else's contribution using Compliment, Coach, Encourage."
          ]
        }
      ]
    }
  ],

  // Source: docs/brain/Knowledge Base/Programs/Explore-Godot/{curriculum,sessions}.md
  // Ten sessions grouped into four coherent modules rather than one module per session,
  // per the task's "small number of coherent modules" guidance. Module 1 matches the
  // brief's worked example verbatim.
  'explore-godot': [
    {
      id: 'mod-eg-1',
      title: 'Getting into Godot',
      description: 'Why we play and mod games, and getting the tools running.',
      items: [
        {
          id: 'item-eg-1',
          type: 'topic',
          title: 'Why do we play games? Why do we mod them?',
          drivingQuestion: 'Why do we play games? Why do we mod them?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-1-check',
          type: 'survey',
          title: 'Session 1 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-eg-2',
          type: 'topic',
          title: 'Should game makers also be game players?',
          drivingQuestion: 'Should game makers also be game players?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-2-check',
          type: 'survey',
          title: 'Session 2 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: the Explore source material has no per-module
          // deliverable. Added because the platform's module model requires
          // one; acceptance criteria mirror the generic checklist.
          id: 'item-eg-1-deliverable',
          type: 'deliverable',
          title: 'Share your modded Pong',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            'Your modified Pong project is shared as a screenshot, short video, or playable build.',
            'The submission explains what you changed and why.',
            'The game still runs without errors.'
          ]
        }
      ]
    },
    {
      id: 'mod-eg-2',
      title: 'Designing Your First Level',
      description: 'Breaking down what makes a level fun, then practicing problem decomposition to plan a level of your own.',
      items: [
        {
          id: 'item-eg-3',
          type: 'topic',
          title: 'How do game makers create a fun and engaging level?',
          drivingQuestion: 'How do game makers create a fun and engaging level?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-3-check',
          type: 'survey',
          title: 'Session 3 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-eg-4',
          type: 'topic',
          title: 'What helps an idea move from concept to something real?',
          drivingQuestion: 'What helps an idea move from concept to something real?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-4-check',
          type: 'survey',
          title: 'Session 4 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: no per-module deliverable in source (these are ongoing
          // working sessions). Grounded in the "Make an LDD" and "Break it Down!"
          // activities from Session 4.
          id: 'item-eg-2-deliverable',
          type: 'deliverable',
          title: 'Share your Level Design Document',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            'Your Level Design Document (LDD) outlines the level you plan to build.',
            "You've broken at least one feature or change into smaller tasks.",
            "You've noted how your plan keeps the feel of the existing platformer."
          ]
        }
      ]
    },
    {
      id: 'mod-eg-3',
      title: 'Building and Refining Your Level',
      description: 'Four working sessions spent building your platformer level, exploring a new game design lens each time, playtesting with others, and starting a pitch deck.',
      items: [
        {
          id: 'item-eg-5',
          type: 'topic',
          title: 'What makes a level good? What makes it great?',
          drivingQuestion: 'What makes a level good? What makes it great?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-5-check',
          type: 'survey',
          title: 'Session 5 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-eg-6',
          type: 'topic',
          title: 'What makes a level good? What makes it great?',
          drivingQuestion: 'What makes a level good? What makes it great?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-6-check',
          type: 'survey',
          title: 'Session 6 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-eg-7',
          type: 'topic',
          title: 'What makes a level good? What makes it great?',
          drivingQuestion: 'What makes a level good? What makes it great?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-7-check',
          type: 'survey',
          title: 'Session 7 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-eg-8',
          type: 'topic',
          title: 'What makes a level good? What makes it great?',
          drivingQuestion: 'What makes a level good? What makes it great?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-8-check',
          type: 'survey',
          title: 'Session 8 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: no single per-module deliverable in source (this is four
          // repeated working sessions). Grounded in the "Player feedback is key!"
          // activity that closes each of the four sessions.
          id: 'item-eg-3-deliverable',
          type: 'deliverable',
          title: 'Share your level for player feedback',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            'Your working level is shared on your game page along with your LDD.',
            "You've posted one or two player feedback questions.",
            "You've played and left feedback on at least two other learners' levels."
          ]
        }
      ]
    },
    {
      id: 'mod-eg-4',
      title: 'Polish and Showcase',
      description: 'Finishing touches on your level and pitch deck, then sharing your finished project with the community.',
      items: [
        {
          id: 'item-eg-9',
          type: 'topic',
          title: 'What makes a level "polished?"',
          drivingQuestion: 'What makes a level "polished?"',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-9-check',
          type: 'survey',
          title: 'Session 9 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          id: 'item-eg-10',
          type: 'topic',
          title: 'Where do you go from here?',
          drivingQuestion: 'Where do you go from here?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-eg-10-check',
          type: 'survey',
          title: 'Session 10 Self-Check',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // SYNTHESIZED: source doesn't label this a formal "deliverable", but
          // Session 10's "Share Your Level!" activity gives this content directly.
          id: 'item-eg-4-deliverable',
          type: 'deliverable',
          title: 'Upload your finished level and pitch deck',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            'You exported your finished level as a .zip file anyone can play.',
            'You shared your pitch deck presentation, with a video of the gameplay if possible.',
            "You gave feedback on at least one other learner's project."
          ]
        }
      ]
    }
  ],

  // Source: docs/brain/Knowledge Base/Programs/Educator-Training-Program/sessions.md,
  // the "Facilitator Training" deck. Note on scope: this program's curriculum.md is a
  // much larger, separate document (the "Facilitator Playbook", a reference manual for
  // running Core: Threadbare/Godot sessions with learners) — it is not structured as a
  // sequence an educator moves through, so it isn't used as the module source here.
  // sessions.md's own deck has a natural 4-part shape (its "Title and Opening" and
  // "Presenters" slides are front matter, parallel to how Core: Threadbare's own
  // Program Front Matter precedes Session 1 without becoming a milestone module).
  'educator-training': [
    {
      id: 'mod-edu-1',
      title: 'Overview of Core: Threadbare',
      description: 'What Core: Threadbare is, how facilitators access it, and the playful pedagogy behind it.',
      items: [
        {
          id: 'item-edu-1-1',
          type: 'topic',
          title: 'A Playful Pedagogy',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-1-2',
          type: 'topic',
          title: 'Before You Press Start',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-1-3',
          type: 'topic',
          title: 'Access Codes',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-1-4',
          type: 'topic',
          title: 'Why Threadbare?',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-1-5',
          type: 'topic',
          title: 'Open Source',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          // SYNTHESIZED: no explicit completion action for this section in source
          // (the deck's only stated action, taking the pre-survey, belongs to the
          // front matter this module omits). Grounded in its five topics.
          id: 'item-edu-1-deliverable',
          type: 'deliverable',
          title: "Explain Core: Threadbare's pedagogy and access model",
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            'You can describe the Play, Create, Share, Reflect pedagogy in your own words.',
            'You know the access codes for Explore: Threadbare, Explore: Godot, and Explore: Git.'
          ]
        }
      ]
    },
    {
      id: 'mod-edu-2',
      title: 'Structure & Tools',
      description: 'How StoryQuests are structured, and the GitHub, Git, and Godot tools facilitators need to know.',
      items: [
        {
          id: 'item-edu-2-1',
          type: 'topic',
          title: 'StoryQuests',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-2-2',
          type: 'topic',
          title: 'Project Board',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-2-3',
          type: 'topic',
          title: 'Tools',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-2-4',
          type: 'topic',
          title: 'Team Project Board Setup',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-2-5',
          type: 'topic',
          title: 'Sessions',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          // SYNTHESIZED: no explicit completion action in source. Grounded in the
          // "Team Project Board Setup" slide.
          id: 'item-edu-2-deliverable',
          type: 'deliverable',
          title: 'Set up a Team Project Board',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You've walked through the Team Project Board Setup steps yourself.",
            'You can point a learner team to their own Project Board on Session 1.'
          ]
        }
      ]
    },
    {
      id: 'mod-edu-3',
      title: 'Walk the Walk',
      description: "A live model of Session 1, followed by practicing the hero-creation activity learners will do themselves.",
      items: [
        {
          id: 'item-edu-3-1',
          type: 'topic',
          title: 'Walk the Walk, Part I - Session 1 modelled live',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-3-2',
          type: 'topic',
          title: 'Walk the Walk, Part II - Hero creation activity',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          // Not synthesized — this is the deck's own stated activity and completion
          // action, reproduced from source.
          id: 'item-edu-3-deliverable',
          type: 'deliverable',
          title: 'Share your hero!',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            'You joined the Endless Educators program using access code EndlessEducators.',
            'You uploaded a screenshot and the .png file of your new hero to the Tasks tab.',
            'You shared the idea behind your design and how it connects to your StoryQuest concept.'
          ]
        }
      ]
    },
    {
      id: 'mod-edu-4',
      title: 'To Wrap Up',
      description: 'Program outcomes facilitators are preparing learners for, plus closing logistics and support channels.',
      items: [
        {
          id: 'item-edu-4-1',
          type: 'topic',
          title: 'Learner Outcomes',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-4-2',
          type: 'topic',
          title: 'Learner Playbook',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          id: 'item-edu-4-3',
          type: 'topic',
          title: 'Join Our Discord Server',
          xp: XP.topic,
          contentType: 'slideshow'
        },
        {
          // The deck's own closing action.
          id: 'item-edu-4-survey',
          type: 'survey',
          title: 'Take the post-survey',
          xp: XP.survey,
          contentType: 'text'
        },
        {
          // Join-Discord is stated directly in source as part of program closing;
          // SYNTHESIZED only in the acceptance-criteria phrasing.
          id: 'item-edu-4-deliverable',
          type: 'deliverable',
          title: 'Join the Endless Access Discord server',
          xp: XP.deliverable,
          contentType: 'text',
          acceptanceCriteria: [
            "You've joined the Discord server linked from the Join Our Discord Server slide."
          ]
        }
      ]
    }
  ]
}
