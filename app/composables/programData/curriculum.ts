import type { CurriculumModule } from './types'

// XP has no source in the Knowledge Base docs.
// SYNTHESIZED: flat per-type values so totals stay predictable across programs.
const XP = { topic: 25, survey: 15, resource: 10, task: 50, deliverable: 200 } as const

export const curriculumByProgram: Record<string, CurriculumModule[]> = {
  // Source: docs/brain/Knowledge Base/Programs/Core-Threadbare/Sessions (Scraped).md
  // That file is a scrape of the live Core: Threadbare page, so its structure is
  // authoritative here: each `##` heading is a module, each `###` heading is one
  // session inside it. Session bodies are the page's own copy, with the scrape's
  // `{{image}}` / `{{slideshow}}` markers carried through as `media` blocks
  // because this app has no asset for them yet.
  'core-threadbare': [
    {
      id: 'mod-ct-1',
      title: 'Introduction',
      description: 'What Core: Threadbare is, what you need before you start, and how to set up your own StoryQuest workspace on GitHub.',
      items: [
        {
          id: 'item-ct-1-start-here',
          type: 'survey',
          title: 'Start Here',
          xp: XP.survey,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'Please take the pre-survey before beginning this learning experience. Thank you!' },
            { kind: 'link', label: 'Go to link' }
          ]
        },
        {
          id: 'item-ct-1-overview',
          type: 'topic',
          title: 'An Overview of Core: Threadbare',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'In this experience, you will learn how to craft original adventures in the whimsical, worn world of Threadbare — a journey of restoration where stories weave the fabric of a forgotten world back together.' },
            { kind: 'paragraph', text: "Long ago, the First Storyweaver spun the Sacred Elements — Memory, Imagination, and Spirit — into threads and wove them on the Eternal Loom, creating the Weave, the living fabric of reality. But now the world is unraveling. The Eternal Loom lies dormant at Fray's End, and the last Elders cling to fading tales. Dark forces — Ink Drinkers, Memory Miners, and Spirit Stealers — roam the lands, devouring the essence of culture, identity, and language." },
            { kind: 'paragraph', text: "You are a newly summoned Storyweaver, heir to the First Storytellers, called to reclaim lost stories and restore the Weave. Through StoryQuests — interactive journeys of your own making — you'll design characters, shape meaningful choices, and build imaginative encounters that invite others into the world of Threadbare." },
            { kind: 'paragraph', text: "Whether you're a solo storyteller, a family of adventurers, or a creative team, this guide will help you bring new stories to life — thread by thread. Learn more in these video playthroughs!" },
            { kind: 'media', media: 'image', caption: 'Screenshot of the Threadbare game world' },
            { kind: 'heading', text: 'Learning Principles' },
            {
              kind: 'list',
              items: [
                'Everyone belongs. We celebrate inclusion and diversity within the game-making community.',
                'Play matters. We recognize creative play as fundamental to learning and living.',
                'Create for impact. We inspire game makers who create meaningful change in the world.',
                'Share often. Be open. We promote safe, collaborative spaces where game makers learn from one another.',
                'Reflect and refine. We value intentional reflection that helps us grow and evolve.',
                'Learning is not linear. We embrace flexibility and failing forward in an iterative design process.'
              ]
            },
            { kind: 'heading', text: 'Our Learning Approach' },
            { kind: 'paragraph', text: 'In this program, we follow a simple but powerful approach to learning and making games: Play, Create, Share, and Reflect.' },
            {
              kind: 'list',
              items: [
                'Play means exploring and enjoying existing games to understand what makes them fun and meaningful.',
                'Create is where you bring your own ideas to life by designing and building your StoryQuest.',
                'Share invites you to show your game to others, give and receive feedback, and learn from each other.',
                'Reflect encourages you to think about what worked well, what could be better, and how your story or game can grow.'
              ]
            },
            { kind: 'paragraph', text: "This way of learning helps you dive right in—learning by doing, experimenting, and collaborating. It's a hands-on approach that builds skills like creativity, problem-solving, and teamwork, while making the process fun and engaging. As you work through your StoryQuest, you'll experience all four steps again and again, helping you become a confident and thoughtful Storyweaver, ready to craft meaningful stories that connect with others." },
            { kind: 'heading', text: 'About Open Source' },
            { kind: 'paragraph', text: 'Development model where software source code is made publicly available, allowing anyone to use, modify, and distribute it freely.' },
            { kind: 'paragraph', text: 'Threadbare is Open Source! Code and assets are public and openly-licensed. Public issue tracking, pull requests.' },
            { kind: 'paragraph', text: 'When you contribute to Threadbare, your work lives on! Even after the program, you can keep working on your StoryQuest, propose another, or even contribute to other parts of the Threadbare game.' },
            { kind: 'media', media: 'image', caption: 'Hexagonal diagram illustrating Play / Create / Share / Reflect' }
          ]
        },
        {
          id: 'item-ct-1-play',
          type: 'topic',
          title: 'Play Threadbare!',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'Use the following link to play Threadbare directly in your browser and experience the world your learners are contributing to.' },
            { kind: 'link', label: 'Play Threadbare' },
            { kind: 'media', media: 'image', caption: 'Large screenshot of the game map and world' }
          ]
        },
        {
          id: 'item-ct-1-requirements',
          type: 'topic',
          title: 'Requirements',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'This program requires the following materials and resources:' },
            { kind: 'heading', text: 'Technology' },
            {
              kind: 'list',
              items: [
                'A computer (Windows, macOS, or Linux) connected to the Internet',
                'Godot Engine (free and open source) – download from godotengine.org',
                'A Google account (for copying and editing planning documents)',
                'A GitHub account (for uploading and contributing your StoryQuest to the community game!)',
                'Optional: A Studio account (for connecting with our game-making community, earning skill achievements, and building your portfolio)'
              ]
            },
            { kind: 'heading', text: 'Skills/Knowledge' },
            {
              kind: 'list',
              items: [
                'Basic familiarity with digital tools, file system structures, and coding concepts',
                'Understanding of story structure (beginning, middle, end)',
                'Willingness to experiment, test, and iterate on your StoryQuest'
              ]
            },
            { kind: 'heading', text: 'Materials' },
            {
              kind: 'list',
              items: [
                'Core: Threadbare Create Your Own StoryQuest! guide',
                'Paper and pen for sketching storyboards, dialogue flowcharts, or character arcs before building digitally',
                'Access to online communities or forums (such as Godot forums or Discord channels) for support and feedback'
              ]
            }
          ]
        },
        {
          id: 'item-ct-1-get-started',
          type: 'topic',
          title: "Let's Get Started!",
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'heading', text: 'Becoming Your Own StoryQuest Studio Lead' },
            { kind: 'paragraph', text: "Welcome to your StoryQuest journey! In this section, you'll learn how to set up your own game development workspace using GitHub. Normally, mentors or instructors do this part—but in a self-guided learning environment, you get to be the Studio Lead! This means you'll: create a digital workspace using GitHub (called an \"Organization\"); fork the Threadbare game template so you can build your own StoryQuest; manage your game project like a pro! Whether you're working solo, with friends, or as a family, these steps will help you get started." },
            { kind: 'heading', text: 'Why Use a GitHub Organization?' },
            { kind: 'paragraph', text: "A GitHub Organization keeps everything neat and in one place: your game files, project plan, and updates live in one tidy hub; you (and your teammates, if any) can see and edit your shared game project; you learn real-world skills by working in the same way professional developers do. Even if you're working alone, it's worth it." },
            { kind: 'heading', text: "What You'll Need" },
            {
              kind: 'list',
              items: [
                'A GitHub account: Create one here.',
                'Basic computer skills (copy/paste, using a web browser).',
                '20–30 minutes of setup time.'
              ]
            },
            { kind: 'heading', text: 'Step-by-Step Instructions' },
            {
              kind: 'list',
              ordered: true,
              items: [
                'Create a GitHub Organization. Sign in to GitHub. Click the + menu in the top-right corner → Choose New organization. Choose the Free plan and click Continue. Name your organization something like Threadbare-Studio-YourStudioName or StoryQuest-Team-A. Use your email as the contact email. Select "Personal" as the organization type. Complete the image puzzle or identity verification, if prompted.',
                "Skip Inviting Users (for now). If you're working solo or with family nearby, skip this step for now. You can always invite others later. See Step 7 for more info on inviting collaborators.",
                'Install the Threadbare StoryQuest Setup App. This app will help fork the main game and create your project board. Go to the Threadbare StoryQuest Setup app → Click Install → Select your new organization. DO NOT install it in your personal account. Use the new org you made in Step 1. Confirm password or 2FA if prompted.',
                'Contact the Threadbare Team for Manual Setup. Before moving on to the next step, you must contact the Threadbare team to complete the setup. Reach out via email at support@endlessaccess.org or by posting in our general Discord forum.',
                'Set Your Project Board to Public. Wait for the repository to appear in your GitHub account. This is your own forked repository of the Threadbare game that lives in your organization. Go to your organization → Click the Projects tab. Click the project called StoryQuest Template. Click the … menu (top right) → Choose Settings. In the "Danger zone," change the visibility to Public.',
                'Change the Project View to "Group by Milestone". In the StoryQuest Template board, find the View 1 dropdown. Click ↓ → Select Group by: Milestone. Click Save.',
                "(Optional) Invite Collaborators. Want to build a game with a friend or family member? Go to your Organization → Click Teams tab → Choose Contributors. Click Add a member → Enter their GitHub username or email. They'll get an invite by email!"
              ]
            },
            { kind: 'paragraph', text: "Once you've completed the setup steps on the previous pages, the content of the project board is included on the following pages for your reference, but we recommend using the GitHub version to keep track as you go." },
            { kind: 'media', media: 'image', caption: 'Screenshot of the Project Board Tracker' }
          ]
        },
        {
          id: 'item-ct-1-community',
          type: 'topic',
          title: 'Community',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'heading', text: 'Community Commitments' },
            { kind: 'paragraph', text: 'In our game making community:' },
            {
              kind: 'list',
              items: [
                'We follow a Code of Conduct in order to build a safe space for all of us.',
                'We welcome your voice: turn on your mic & share!',
                "We want you to feel comfortable in your own skin, and that goes for everyone: turn on your camera! Body language lets us & your peers know if you're having a good time or you need support.",
                'We want you to be able to knit your own nets! Find your people to work & to share your shine with.'
              ]
            },
            { kind: 'heading', text: 'Endless Access Community' },
            { kind: 'paragraph', text: 'A global game-making community on Discord where you can be among the first to get a behind-the-scenes look into how a real game is made.' },
            { kind: 'paragraph', text: 'Even after you complete Core: Threadbare, stick around in the community – keep in touch with your friends, stay updated with the latest Threadbare developments, and continue to get and share game-making tips and resources.' }
          ]
        },
        {
          // The scrape records this session as "an extensive A-to-V glossary" but
          // does not carry the entries themselves, so there is no term list to
          // render until the page content is exported in full.
          id: 'item-ct-1-glossary',
          type: 'resource',
          title: 'Game Design Glossary',
          xp: XP.resource,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'A reference glossary of the game design terms used across this program, from A to V.' }
          ]
        }
      ]
    },
    {
      id: 'mod-ct-2',
      title: 'Threadbare Milestones',
      description: 'The five milestones that carry a StoryQuest from first idea to a published quest. Each milestone is a set of Project Board issues, and each issue states its own acceptance criteria.',
      items: [
        {
          id: 'item-ct-2-overview',
          type: 'topic',
          title: 'Milestones and Project board',
          xp: XP.topic,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'paragraph', text: 'These milestones guide you from first idea to a polished StoryQuest. You\'ll work from your GitHub Project Board, ship something small and playable each step, and use the loop Play → Create → Share → Reflect. Work solo or with a team. When a milestone feels "done," push your commits, tick your tasks, and post a short clip/GIF with a one-line reflection.' },
            { kind: 'heading', text: 'Milestone 1: Ideation' },
            { kind: 'paragraph', text: "Decide what your StoryQuest is about. You'll: play Threadbare, break down how narrative + mechanics work together, brainstorm themes, and draft a one-page concept." },
            { kind: 'paragraph', text: 'Deliverables: concept one-pager, initial task list on your Project Board, repo set up and running locally.' },
            { kind: 'heading', text: 'Milestone 2: Intro & Outro' },
            { kind: 'paragraph', text: "Make your quest start and finish feel clear and intentional. You'll: build an opening scene (hook + goal), a closing scene (resolution/exit), link scenes, and add minimal tiles/character/narration to sell the arc." },
            { kind: 'paragraph', text: 'Deliverables: playable start→finish flow, short clip/GIF, commits pushed.' },
            { kind: 'heading', text: 'Milestone 3: Mini-game' },
            { kind: 'paragraph', text: "A gameplay moment that expresses your story. You'll: design the space, props, and simple rules; implement the interaction; connect it between your intro and outro. (Optional: add basic SFX/music.)" },
            { kind: 'paragraph', text: 'Deliverables: playable mini-game segment with clear win/lose or success feedback, updated board, clip/GIF.' },
            { kind: 'heading', text: 'Milestone 4: Playtesting & Iteration' },
            { kind: 'paragraph', text: "Improve clarity, fun, and feel using feedback. You'll: run quick tests (peer/mentor), log issues, prioritize fixes, and polish the rough edges (readability, difficulty spikes, navigation)." },
            { kind: 'paragraph', text: 'Deliverables: playtest notes, "before/after" clip or bullets of changes, closed issues with linked commits.' },
            { kind: 'heading', text: 'Milestone 5: Production & Launch' },
            { kind: 'paragraph', text: "Package your quest for others to play. You'll: finalize text and credits, tidy assets, fill in quest metadata (e.g. quest.tres), write a short README, and create a 20–30s showcase clip." },
            { kind: 'paragraph', text: 'Deliverables: tagged release or final commit, README + credits, showcase clip/GIF, submission posted to the community.' }
          ]
        },
        {
          id: 'item-ct-2-milestone-1',
          type: 'deliverable',
          title: 'Milestone 1: Ideation',
          xp: XP.deliverable,
          contentType: 'slideshow',
          // The milestone's own "Deliverables:" line from the Milestones and
          // Project board session — what the learner hands in to close it out.
          acceptanceCriteria: [
            'Concept one-pager.',
            'Initial task list on your Project Board.',
            'Repo set up and running locally.'
          ],
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed — "Core: Threadbare — An Introduction to Game Design"' },
            {
              kind: 'task',
              title: 'Play Threadbare',
              text: 'Play Threadbare. Think about ideas for improving the gameplay and game design. Consider the idea of a StoryQuest. What purpose does it serve?',
              hasTutorial: true,
              acceptanceCriteria: [
                'Playtested the Threadbare game.',
                'Reflected on the purpose of a StoryQuest.'
              ]
            },
            {
              kind: 'task',
              title: 'Create a Team (optional)',
              text: 'Connect with others and form a team.',
              hasTutorial: true,
              acceptanceCriteria: ['Communicated with others to form a team.']
            },
            {
              kind: 'task',
              title: 'Brainstorm StoryQuest Ideas',
              text: 'Brainstorm and develop ideas for your StoryQuest.',
              hasTutorial: true,
              acceptanceCriteria: ['Created a collection of ideas for a StoryQuest (characters, narrative structure, mini-games, etc.).']
            },
            {
              kind: 'task',
              title: 'Complete the StoryQuest GDD',
              text: 'Make a copy of the game design document (GDD) template and customize it for your StoryQuest. Keep in mind, the GDD is a work in progress and can be edited throughout this learning experience.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Recorded an initial StoryQuest Overview in the GDD.',
                'Recorded an initial Intro section in the GDD.',
                'Recorded an initial Mini-game section(s) in the GDD.',
                'Recorded an initial Outro section in the GDD.'
              ]
            }
          ]
        },
        {
          id: 'item-ct-2-milestone-2',
          type: 'deliverable',
          title: 'Milestone 2: Intro & Outro',
          xp: XP.deliverable,
          contentType: 'slideshow',
          acceptanceCriteria: [
            'Playable start→finish flow.',
            'Short clip/GIF.',
            'Commits pushed.'
          ],
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            {
              kind: 'task',
              title: 'Set Up a GitHub Account',
              text: 'Create your own Github account and connect to an organization.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Created a Github account.',
                'Connected to a GitHub organization (either joined a team organization or made my own).'
              ]
            },
            {
              kind: 'task',
              title: 'Download and Install Godot',
              text: 'Download and install the latest version of Godot.',
              hasTutorial: true,
              acceptanceCriteria: ['Opened and ran Godot on my computer.']
            },
            {
              kind: 'task',
              title: 'Set up Git',
              text: 'Download, install, and set up Git on your computer.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Ran Git in a terminal on my computer.',
                'Configured my name and email address.'
              ]
            },
            {
              kind: 'task',
              title: 'Clone the forked repository to your computer',
              text: 'Use Git to clone the forked repository to your computer.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Created a folder on my computer for the project.',
                'Used Git to clone the forked repository to that folder.'
              ]
            },
            {
              kind: 'task',
              title: 'Import Threadbare into Godot and run the game',
              text: 'Open Godot and import your cloned copy of Threadbare. Run the game in Godot to ensure it is working, and that all folders and files and their contents have been successfully copied and placed in my StoryQuest folder.',
              hasTutorial: true,
              acceptanceCriteria: ['Pushed changes to my forked repo on GitHub.']
            },
            {
              kind: 'task',
              title: 'Redesign placeholder tilemap for intro & outro',
              text: 'Design the layout for your intro and outro scenes.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Used separate layers (eg, a base ground layer as well as a layer on top for a player path) to create a tile map.',
                'Created a tile map that fits the aesthetics and game feel of our StoryQuest.',
                'Created a tile map that allows for players to progress smoothly through the scene(s).',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            },
            {
              kind: 'task',
              title: 'Design and replace character(s) for intro & outro',
              text: 'Design your own player character and integrate your new sprite frames into your StoryQuest.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Modified or replaced all placeholder player_template sprite frames with my own character frames.',
                'Tested all character animations to ensure they are functional.',
                'Created character(s) that match the aesthetics of our StoryQuest.',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            },
            {
              kind: 'task',
              title: 'Create and replace art assets for intro & outro',
              text: 'Find and replace the placeholder background image that sits in the tilemap and add any additional art assets needed to match your StoryQuest.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Added a new background image and any additional art assets.',
                'Created art assets that fit the aesthetic of our StoryQuest.',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            },
            {
              kind: 'task',
              title: 'Connect scene to scene',
              text: "Connect the intro scene to the next scene you've chosen for your StoryQuest (ex: combat scene, stealth scene, sequence puzzle scene etc.)",
              hasTutorial: true,
              acceptanceCriteria: [
                'Connected two scenes without disrupting the flow of the gameplay.',
                'Confirmed through playtesting that our player character transitions correctly from scene to scene.',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            }
          ]
        },
        {
          id: 'item-ct-2-milestone-3',
          type: 'deliverable',
          title: 'Milestone 3: Mini-game',
          xp: XP.deliverable,
          contentType: 'slideshow',
          acceptanceCriteria: [
            'Playable mini-game segment with clear win/lose or success feedback.',
            'Updated board.',
            'Clip/GIF.'
          ],
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            {
              kind: 'task',
              title: 'Redesign placeholder tilemap for mini-game',
              text: 'Design the layout or space for your mini-game.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Used separate layers (eg, a base ground layer as well as a layer on top for a player path).',
                'Created a tile map that fits the aesthetics and game feel of our StoryQuest.',
                'Created a tile map that allows for players to progress smoothly through the scene(s).',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            },
            {
              kind: 'task',
              title: 'Design and replace character(s) for mini-game',
              text: 'Add your new player character into this scene. If your scene needs other characters (like NPCs, enemies, or story characters), design them and add them here too.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Modified or replaced all placeholder player_template sprite frames with our own character frames.',
                'Created character(s) that match the aesthetics of our StoryQuest.',
                'Integrated any additional characters required for our StoryQuest.',
                'Tested all character animations.',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            },
            {
              kind: 'task',
              title: 'Add narrative text for mini-game',
              text: 'Integrate your own text or dialogue into the mini-game.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Integrated narrative into the mini-game.',
                'Added narrative text and/or dialogue that is consistent with the narrative structure of our StoryQuest.',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            },
            {
              kind: 'task',
              title: 'Create and replace art assets for mini-game',
              text: "Modify or add art assets for your StoryQuest's game objects (props).",
              hasTutorial: true,
              acceptanceCriteria: [
                'Modified or replaced at least one object in the scene (such as a background prop like a tree or house that is not part of the tile map, or an interactive object like a target or projectile).',
                'Created art assets that fit the aesthetic of our StoryQuest.',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            },
            {
              kind: 'task',
              title: 'Connect Scene-to-Scene',
              text: "Connect this scene to the next scene you've chosen for your StoryQuest (ex: combat scene, stealth scene, sequence puzzle scene, etc.).",
              hasTutorial: true,
              acceptanceCriteria: [
                'Connected two scenes without disrupting the flow of the gameplay.',
                'Confirmed through playtesting that our player character transitions correctly from scene to scene.',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            },
            {
              kind: 'task',
              title: 'Add music and/or sound effects for mini-game (optional)',
              text: 'Add background music and/or sound effects that fit the scene and help to tell the story.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Added new music and/or sound effects for this mini-game.',
                'Added new music and/or sound effects that match the game feel.',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            }
          ]
        },
        {
          id: 'item-ct-2-milestone-4',
          type: 'deliverable',
          title: 'Milestone 4: Playtesting & Iteration',
          xp: XP.deliverable,
          contentType: 'slideshow',
          acceptanceCriteria: [
            'Playtest notes.',
            '"Before/after" clip or bullets of changes.',
            'Closed issues with linked commits.'
          ],
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            {
              kind: 'task',
              title: 'Conduct playtesting sessions',
              text: 'Conduct team and peer playtesting sessions. Be sure to collect reactions and suggestions for improvement.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Conducted at least one playtesting session with our team and collected notes.',
                'Conducted at least one playtesting session with peers and collected notes.',
                'Conducted at least one playtesting session with a mentor and collected notes.'
              ]
            },
            {
              kind: 'task',
              title: 'Gather and reflect on player feedback',
              text: 'Analyze the notes from your playtesting sessions. What actions do you plan to take? Who will work on each task?',
              hasTutorial: true,
              acceptanceCriteria: [
                'Compiled our notes from each playtesting session.',
                'Created a plan for acting on the feedback received during each playtesting session.'
              ]
            },
            {
              kind: 'task',
              title: 'Refine your game',
              text: 'Take action on the feedback gathered during the playtesting sessions. Polish your game and prepare it for launch!',
              hasTutorial: true,
              acceptanceCriteria: [
                'Prioritized and adjusted key aspects of our StoryQuest based on player feedback.',
                'Playtested the new changes.',
                'Pushed the changes to a branch.',
                'Submitted a pull request for review.'
              ]
            }
          ]
        },
        {
          id: 'item-ct-2-milestone-5',
          type: 'deliverable',
          title: 'Milestone 5: Production & Launch',
          xp: XP.deliverable,
          contentType: 'slideshow',
          acceptanceCriteria: [
            'Tagged release or final commit.',
            'README + credits.',
            'Showcase clip/GIF.',
            'Submission posted to the community.'
          ],
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            {
              kind: 'task',
              title: 'Create your game pitch deck',
              text: "Create a short pitch deck that explains your game's story, gameplay, and what makes it unique. This will help you share your project with others.",
              hasTutorial: true,
              acceptanceCriteria: [
                'Created a pitch deck about the story, gameplay, and unique features.',
                'Pushed the final version to the project repository or shared folder.'
              ]
            },
            {
              kind: 'task',
              title: 'Present your StoryQuest',
              text: 'Present your finished StoryQuest.',
              hasTutorial: true,
              acceptanceCriteria: [
                'Presented our StoryQuest to an audience beyond our own team.',
                'Explained the story, gameplay, and reflected on our experience in designing the StoryQuest.',
                'Answered questions from our audience.'
              ]
            },
            {
              kind: 'task',
              title: 'Publish your StoryQuest',
              text: "It's time to publish your StoryQuest! Open the quest.tres resource in your StoryQuest folder and fill out the title, description, and author fields in the Inspector.",
              hasTutorial: true,
              acceptanceCriteria: [
                'Included a title and description of our StoryQuest in the quest.tres resource.',
                'Included the names of the individuals who contributed to this project.'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'mod-ct-3',
      title: 'Creator Tools & Guides',
      description: 'Where to find Threadbare guides and discussions, plus the art, sound, narrative, and planning tools recommended for building your StoryQuest.',
      items: [
        {
          id: 'item-ct-3-guides',
          type: 'resource',
          title: 'Threadbare Guides & Resources',
          xp: XP.resource,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'Many guides, tips, and development ideas related to the Threadbare game are shared in the GitHub Discussions area of the repository.' },
            { kind: 'paragraph', text: 'When you arrive, you will see many different conversations. To quickly find guides and resources related to building a StoryQuest: Look at the Categories list on the left side. Select Core Threadbare. You can also filter by Milestones 1–5 to find discussions connected to specific parts of the StoryQuest creation process.' },
            { kind: 'note', text: 'If you have a copy of the Threadbare StoryQuest project board, you can also find these guides linked directly within the tasks/issues on that board.' }
          ]
        },
        {
          id: 'item-ct-3-art',
          type: 'resource',
          title: 'Art',
          xp: XP.resource,
          contentType: 'text',
          body: [
            {
              kind: 'list',
              items: [
                'Piskel (Web App) – A free, browser-based pixel art editor for creating sprites, animations, and sprite sheets that you can export into your project.',
                'Pixel Stitch (Web App) – A simple free online pixel art tool for designing sprites, tiles, and animated frames, with easy export options for use in your game.',
                'Threadbare Pixel Loom (Web App) – A browser-based remix tool built from official Threadbare assets, allowing you to combine house structures, architectural details, and decorative elements to create new variations you can export directly into your game.',
                'Kleki (Web App) – A free online drawing tool with simple brushes and layers that lets you quickly sketch characters, backgrounds, or ideas for your game right in your browser.',
                "Krita (Downloadable App) – A free, professional-level drawing and painting program that's great for creating detailed characters, backgrounds, and digital artwork for your game.",
                'GIMP (Downloadable App) – A powerful free image editor you install on your computer, useful for editing images, creating textures, and designing more advanced visual assets.'
              ]
            }
          ]
        },
        {
          id: 'item-ct-3-music',
          type: 'resource',
          title: 'Music and Sound',
          xp: XP.resource,
          contentType: 'text',
          body: [
            {
              kind: 'list',
              items: [
                'Melody Loom (Web App) – A free, browser-based music and sound tool where you can create simple melodies, generate sound effects, record audio, adjust pitch or reverb, and export your sounds to use in your game.',
                'Freesound.org (Web Resource) – A free online library of thousands of Creative Commons–licensed sound effects, recordings, and audio samples you can browse and download to use or remix in your game projects.',
                'Incompetech (Music Library) – A free collection of royalty-free music tracks by Kevin MacLeod that you can browse and download for your game as long as you credit the creator.'
              ]
            }
          ]
        },
        {
          id: 'item-ct-3-narrative',
          type: 'resource',
          title: 'Narrative',
          xp: XP.resource,
          contentType: 'text',
          body: [
            {
              kind: 'list',
              items: [
                'The Whispering Well (Web App) – A genre-based story generator that shuffles "Who, What, When, Where" fragments to spark unexpected combinations and inspire new narrative directions.'
              ]
            }
          ]
        },
        {
          id: 'item-ct-3-planning',
          type: 'resource',
          title: 'Brainstorming & Planning',
          xp: XP.resource,
          contentType: 'text',
          body: [
            {
              kind: 'list',
              items: [
                'Excalidraw – A collaborative digital whiteboard that lets you sketch diagrams, map ideas, and organize concepts with hand-drawn style elements.',
                'mood.site – A simple web-based visual mood board for collecting and organizing images and visual inspiration.',
                'TLDraw – A free, collaborative digital whiteboard with an infinite canvas for sketching, drawing, and visually planning ideas without needing an account.'
              ]
            }
          ]
        }
      ]
    }
  ],

  // Source: docs/brain/Knowledge Base/Programs/Explore-Threadbare/Sessions (Scraped).md
  // Same rule as Core: Threadbare above — the scrape of the live page is the
  // structure, so each `##` heading is a module and each `###` heading is a
  // session. The 13 workshops are `deliverable` items because the page's own FAQ
  // says every Explore session ends in a task where you share your asset or
  // contribution; the acceptance criteria for that are not stated per workshop,
  // so none are invented here.
  //
  // Essential questions come from curriculum.md's workshop map rather than the
  // scrape — the page keeps them inside the slide decks, which the scrape does
  // not open.
  'explore-threadbare': [
    {
      id: 'mod-et-1',
      title: 'Introduction',
      description: 'Play the game the workshops contribute to, see how the sessions work, and get your journal and glossary ready.',
      items: [
        {
          id: 'item-et-1-play',
          type: 'topic',
          title: 'Play Threadbare!',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'Use the following link to play Threadbare directly in your browser and experience the world you will be contributing to.' },
            { kind: 'link', label: 'Play Threadbare', href: 'https://play.threadbare.game/' },
            { kind: 'paragraph', text: 'If you are unable to play Threadbare in your browser, visit the latest release page to download the game. Scroll to the bottom of the page, open Assets, and select the version that matches the operating system used by you or your learners.' },
            { kind: 'link', label: 'Latest release page', href: 'https://github.com/endlessm/threadbare/releases/latest' },
            { kind: 'media', media: 'image', caption: 'Threadbare world banner, linking through to play.threadbare.game' }
          ]
        },
        {
          id: 'item-et-1-overview',
          type: 'topic',
          title: 'Overview',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'Explore: Threadbare is a series of hands-on creative sessions that let you explore different parts of game development by contributing to a shared community game.' },
            { kind: 'paragraph', text: 'Here, you will:' },
            {
              kind: 'list',
              items: [
                'Try out roles like artist, designer, engineer, and playtester.',
                'Experiment with ideas that shape how players experience a game.',
                'Share your work and thinking with a growing community of game makers.'
              ]
            },
            { kind: 'paragraph', text: "Each session stands on its own and focuses on exploration rather than mastery. You'll create small artifacts, reflect on what you tried, and get a feel for the kinds of roles, skills, and creative paths that exist in game making." },
            { kind: 'paragraph', text: 'Before you begin, make sure you have these things ready:' },
            {
              kind: 'list',
              items: [
                'A computer or laptop. You need this to run Godot and build games. A phone or tablet will not work.',
                'A Game Design Journal. This is where you write your ideas, notes, and reflections. You can use a physical notebook or a digital document on your computer.',
                'Optional: A friend! Making games can be more fun if you have someone to share ideas with or test your game.'
              ]
            },
            { kind: 'media', media: 'image', caption: 'Threadbare key art (Endless Access / JetSynthesys)' }
          ]
        },
        {
          id: 'item-et-1-faq',
          type: 'topic',
          title: 'Frequently Asked Questions',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'heading', text: 'How much time will it take me to complete this program?' },
            { kind: 'paragraph', text: 'Each session is designed to take around an hour to complete. However, each person learns in a different way and at a different pace, so here are some considerations:' },
            { kind: 'paragraph', text: "Sessions (and activities) have an estimated time for completion, but these time frames are flexible: you might do something really fast and finish early, or you might need (or want to) stop and dig a little deeper in one task. That's ok!" },
            { kind: 'paragraph', text: 'When you are asked to make mods, create a level or even do your own prototype, you can do it at your own pace.' },
            { kind: 'paragraph', text: 'Remember: learning is not linear!' },
            { kind: 'heading', text: 'What is an Essential Question?' },
            { kind: 'paragraph', text: 'You\'ll see that each session begins with an essential question designed to provoke deep thinking about key concepts in game design. There\'s no need to write down an answer, and there are no right or wrong answers either. For instance, when we ask "What makes a level \'just right\'?" we\'re trying to encourage you to delve into critical aspects such as game mechanics, storytelling, player experience, and player engagement throughout the session. Each activity of a session connects to this essential question in one way or another.' },
            { kind: 'heading', text: 'Where will I share my asset or community contribution?' },
            { kind: 'paragraph', text: "Each Explore session includes a task on our website where you'll share your asset or contribution along with a short description of your thinking. When you're ready, submit your work through the task page, and it will become part of the Threadbare community. You're also welcome to share your work beyond this space with friends, family, or anywhere else you like." },
            { kind: 'heading', text: 'How do I get help if I need it?' },
            { kind: 'paragraph', text: 'If you need assistance, please send an email to learning@endlessaccess.org.' }
          ]
        },
        {
          // The page renders this session as a single "Go to link" button out to
          // an external glossary; the scrape does not capture its URL.
          id: 'item-et-1-glossary',
          type: 'resource',
          title: 'Game Design Glossary',
          xp: XP.resource,
          contentType: 'text',
          body: [
            { kind: 'link', label: 'Go to link' }
          ]
        }
      ]
    },
    {
      id: 'mod-et-2',
      title: 'Workshops',
      description: 'Thirteen standalone one-hour workshops, colour-coded by domain: art (yellow), game design (purple), engineering (orange), management and production (blue), and go-to-market (red).',
      items: [
        {
          id: 'item-et-2-aesthetics',
          type: 'deliverable',
          title: '🟡 Aesthetics & Visual Design — Art',
          drivingQuestion: 'How can one pixel art asset help shape the story of a game?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Explore how visuals can tell stories in a game and create your own pixel art asset that contributes to the game world.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Experience the game and notice how pixels, colors, and shapes communicate story, character, and emotion.',
                'Reflect on the story and themes of the game, thinking about what you could add or emphasize.',
                "Create your own pixel art asset and share it with others to contribute to the game's story."
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-animation',
          type: 'deliverable',
          title: '🟡 Animation & Effects — Art',
          drivingQuestion: "How can animation deepen the player's connection to the game world?",
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'To explore how small animations can make a game world feel more alive and expressive.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Play Threadbare and observe how existing animations add motion, clarity, and personality to the game world.',
                'Identify static objects in the game and brainstorm simple ways they could be brought to life with motion.',
                'Explore the community asset gallery to see how other learners have contributed visual content.',
                'Choose a static asset from the gallery and add a short animation by creating a few new frames.',
                'Share your animated asset back to the platform as a sprite sheet to contribute to the shared game world.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-music',
          type: 'deliverable',
          title: '🟡 Music & Sound — Art',
          drivingQuestion: 'How can sound deepen your connection to a moment in a game?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: "To explore how sound can shape a player's experience in a game and create your own sound effect that contributes to the game world." },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Play through the game and notice how different sound categories support immersion and mood.',
                "Reflect on the emotions and tone created by the game's sounds and how simple effects can make moments feel meaningful.",
                'Create your own sound effect and submit it, contributing to the world of Threadbare through audio.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-narrative',
          type: 'deliverable',
          title: '🟣 Narrative & Storytelling — Game Design',
          drivingQuestion: "How can writing change the player's experience?",
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: "To introduce game makers into the world of Narrative Design by creating an Artifact that will enrich Threadbare's fictional world, characters, etc." },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Play the Threadbare game.',
                'Reflect about the story behind a particular LoreQuest.',
                "Learn about Threadbare's Narrative (fictional world, characters, story, and goals).",
                'Create an Artifact (text and concept art) that adjusts to the Lore of the game.',
                'Share the Artifact with others to give and receive constructive feedback.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-mechanics',
          type: 'deliverable',
          title: '🟣 Core Gameplay & Mechanics — Game Design',
          drivingQuestion: 'What makes the player return to a game over and over again?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'To introduce game makers into the world of Game Design by understanding what Mechanics are, and building a Core Loop that can be used in the Threadbare game.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Analyze the mechanics and the Core Loop of a StoryQuest.',
                'Create a new gameplay loop for an NPC.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-game-feel',
          type: 'deliverable',
          title: '🟣 Game Feel & UX — Game Design',
          drivingQuestion: 'How do designers invite players to discover their own path through a game?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'To explore how small visual and audio cues can guide players through a game world without telling them exactly what to do.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Play a scene and observe how the game developers guide your playthrough.',
                'Learn common signposting and UX techniques used in games',
                'Sketch ideas for guiding players using visual cue',
                'Share your signposting choices'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-progression',
          type: 'deliverable',
          title: '🟣 Progression & Motivation — Game Design',
          drivingQuestion: 'How do game makers give the core loop a refresh?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: "To explore how character progression and motivation can refresh a game's core loop by pairing new abilities with new or evolving challenges." },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Play Threadbare and identify the abilities the Storyweaver uses and the challenges they help address.',
                'Explore how skill trees can make familiar gameplay feel fresh by changing what the player can do over time.',
                'Design a simple skill tree that shows how abilities could grow or change to support new challenges.',
                'Share your skill tree idea as a way to think about progression and motivation in games.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-systems',
          type: 'deliverable',
          title: '🟠 Gameplay & Systems Programming — Engineering',
          drivingQuestion: 'How does programming shape what players feel & experience?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'To explore how small changes to character mechanics can shape how a game plays and feels.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Play and observe the game to notice how the player moves, feels, and interacts with the world.',
                'Analyze how engineers control game systems by exploring a live example in Godot.',
                'Experiment with adjusting or activating mechanics to see how these changes affect the player experience.',
                "Reflect on how an engineer's decisions guide or inspire the team's overall game design.",
                'Share your updated mechanic or system with teammates to compare how your choices shaped gameplay.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-optimization',
          type: 'deliverable',
          title: '🟠 Optimization & Performance — Engineering',
          drivingQuestion: "How do unseen systems shape a player's experience moment to moment?",
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: "To investigate how a single system can impact an entire game's performance. In this session, you will experiment with a broken spawner, observe its effects, and try changes that improve or stress the game." },
            { kind: 'paragraph', text: 'In this experience, you will:' },
            {
              kind: 'list',
              items: [
                'Explore what game performance means and why it matters for players.',
                'Learn to recognize common signs that a game might be struggling to run smoothly.',
                'Experiment with how scripts and values in Godot can affect performance.',
                'Make a small change to adjust, improve, or intentionally stress performance in a game.',
                'Share what you noticed and learned by posting a screenshot and description to the community.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-workflow',
          type: 'deliverable',
          title: '🔵 Project Workflow & Management — Management & Production',
          drivingQuestion: 'How can you lead a team to enhance a game experience?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'To create an idea for a new Quest, and a plan to make it real by leading a Game Design team.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Connect with the game at an emotional level to start thinking of what you could add to it.',
                'Learn what an Adventure Pack is and what it should have.',
                'Form a team that you will lead by taking on the role of a Producer.',
                'Create a moodboard with your team that will end up being the basis for your Adventure Pack.',
                'Come up with a plan to develop the pack.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-qa',
          type: 'deliverable',
          title: '🔵 QA & Playtesting — Management & Production',
          drivingQuestion: 'How does a development team make sure that a game is ready to be released?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: "To put yourself in a playtester's shoes and try to identify bugs or game design errors in a platformer." },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                "Consider the importance of player's feedback (Is the goal clear? Is the game too hard? Too easy?)",
                'Playtest a Threadbare themed Platformer.',
                'Reflect about the difference between what seems intentional and what seems like a genuine mistake that needs to be fixed.',
                'Share the bugs or design mistakes you identified as playtester.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-marketing',
          type: 'deliverable',
          title: '🔴 Marketing — Go-To-Market',
          drivingQuestion: 'How can we bring a digital game to life for players to enjoy in the real world?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: "To explore a digital game from a player's perspective and use what you notice to create real-world experiences that connect with and excite players." },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                "Step into a player's shoes and explore Threadbare from their perspective.",
                'Notice what excites players and what stands out in the game.',
                'Use your observations to create a concept for real-world merchandise (or "swag") inspired by the game.',
                'Share your ideas and see what other players might enjoy.',
                'Reflect on how your choices connect the digital game to the real world.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        },
        {
          id: 'item-et-2-publishing',
          type: 'deliverable',
          title: '🔴 Publishing & Distribution — Go-To-Market',
          drivingQuestion: 'How do players get games?',
          xp: XP.deliverable,
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow', caption: 'Google Slides embed' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: "To learn what Publishing & Distribution is in the video game industry, and to create a fun poster to attract the player's attention." },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Play Threadbare looking for its strong suits or unique selling points.',
                'Reflect on the definitions of Publishing and Distribution in the industry by researching and using your experience.',
                'Create a poster for Threadbare that could make people notice it and want to play it.',
                'Use AI to create assets and a tagline for your poster.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
        }
      ]
    },
    {
      id: 'mod-et-3',
      title: 'Creator Tools & Guides',
      description: 'Curated free tools for the art, sound, narrative, and planning work the workshops ask for.',
      items: [
        {
          id: 'item-et-3-art',
          type: 'resource',
          title: 'Art',
          xp: XP.resource,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'A curated list of free web-based and downloadable tools you can use to create artwork, sprites, textures, and visual assets for your projects.' },
            {
              kind: 'linkList',
              items: [
                {
                  label: 'Piskel (Web App)',
                  href: 'https://www.piskelapp.com/kids/',
                  description: 'A free, browser-based pixel art editor for creating sprites, animations, and sprite sheets that you can export into your project.'
                },
                {
                  label: 'Pixel Stitch (Web App)',
                  href: 'https://pixelstitch.lovable.app',
                  description: 'A simple free online pixel art tool for designing sprites, tiles, and animated frames, with easy export options for use in your game.'
                },
                {
                  label: 'Threadbare Pixel Loom (Web App)',
                  href: 'https://threadbare-pixelloom.lovable.app',
                  description: 'A browser-based remix tool built from official Threadbare assets, allowing you to combine house structures, architectural details, and decorative elements to create new variations you can export directly into your game.'
                },
                {
                  label: 'Kleki (Web App)',
                  href: 'https://kleki.com',
                  description: 'A free online drawing tool with simple brushes and layers that lets you quickly sketch characters, backgrounds, or ideas for your game right in your browser.'
                },
                {
                  label: 'Krita (Downloadable App)',
                  href: 'https://krita.org/en/',
                  description: "A free, professional-level drawing and painting program that's great for creating detailed characters, backgrounds, and digital artwork for your game."
                },
                {
                  label: 'GIMP (Downloadable App)',
                  href: 'https://www.gimp.org',
                  description: 'A powerful free image editor you install on your computer, useful for editing images, creating textures, and designing more advanced visual assets.'
                }
              ]
            }
          ]
        },
        {
          id: 'item-et-3-music',
          type: 'resource',
          title: 'Music and Sound',
          xp: XP.resource,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'A curated list of free music and sound tools and libraries you can use to create, record, edit, or download audio for your game projects.' },
            {
              kind: 'linkList',
              items: [
                {
                  label: 'Melody Loom (Web App)',
                  href: 'https://melodyloom.lovable.app/',
                  description: 'A free, browser-based music and sound tool where you can create simple melodies, generate sound effects, record audio, adjust pitch or reverb, and export your sounds to use in your game.'
                },
                {
                  label: 'Freesound.org (Web Resource)',
                  href: 'https://freesound.org',
                  description: 'A free online library of thousands of Creative Commons–licensed sound effects, recordings, and audio samples you can browse and download to use or remix in your game projects.'
                },
                {
                  label: 'Incompetech (Music Library)',
                  href: 'https://incompetech.com/music/royalty-free/music.html',
                  description: 'A free collection of royalty-free music tracks by Kevin MacLeod that you can browse and download for your game as long as you credit the creator.'
                }
              ]
            }
          ]
        },
        {
          id: 'item-et-3-narrative',
          type: 'resource',
          title: 'Narrative',
          xp: XP.resource,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'A curated list of tools and resources to help you develop story ideas, shape characters, and structure meaningful narrative experiences in your game.' },
            {
              kind: 'linkList',
              items: [
                {
                  label: 'The Whispering Well (Web App)',
                  href: 'https://thewhisperingwell.lovable.app',
                  description: 'A genre-based story generator that shuffles "Who, What, When, Where" fragments to spark unexpected combinations and inspire new narrative directions.'
                }
              ]
            }
          ]
        },
        {
          id: 'item-et-3-planning',
          type: 'resource',
          title: 'Brainstorming & Planning',
          xp: XP.resource,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'Tools for visual brainstorming, planning, and collaborative ideation.' },
            {
              kind: 'linkList',
              items: [
                {
                  label: 'Excalidraw',
                  href: 'https://excalidraw.com',
                  description: 'A collaborative digital whiteboard that lets you sketch diagrams, map ideas, and organize concepts with hand-drawn style elements.'
                },
                {
                  label: 'mood.site',
                  href: 'https://mood.site',
                  description: 'A simple web-based visual mood board for collecting and organizing images and visual inspiration.'
                },
                {
                  label: 'TLDraw',
                  href: 'https://www.tldraw.com',
                  description: 'A free, collaborative digital whiteboard with an infinite canvas for sketching, drawing, and visually planning ideas without needing an account.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'mod-et-4',
      title: 'Keep Exploring',
      description: 'Claim the certificate once five workshops are done, then move on to building in a real engine.',
      items: [
        {
          id: 'item-et-4-certificate',
          type: 'survey',
          title: 'Certification of Completion',
          xp: XP.survey,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'Once you have completed 5 workshops (must be at least one from each color-coded domain), you should fill out this short post survey to receive your certificate.' },
            { kind: 'link', label: 'Go to link' }
          ]
        },
        {
          id: 'item-et-4-next-steps',
          type: 'topic',
          title: 'Next Steps',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: "You've learned a lot about game making. Now it's time to use a real game engine to build your own game! Join the Explore: Godot program to learn how to use Godot and build a level for a Threadbare-themed platformer game." },
            { kind: 'link', label: 'Explore: Godot program', href: 'https://studio.endlessstudios.com/programs/3942356/' },
            { kind: 'media', media: 'image', caption: 'Explore Godot banner' }
          ]
        }
      ]
    }
  ],

  // Source: docs/brain/Knowledge Base/Programs/Explore-Godot/{curriculum,sessions}.md
  // Ten sessions grouped into four coherent modules rather than one module per session,
  // per the task's "small number of coherent modules" guidance. Module 1 matches the
  // brief's worked example verbatim. Sessions 6, 7, and 8 share the same driving
  // question, Session Goal, and activity list verbatim in source — repeated here
  // rather than deduped, since it's real, not a copy-paste mistake.
  'explore-godot': [
    // A dedicated, single-item module rather than a flag on an item inside
    // 'mod-eg-intro': being its own module means the existing module-lock
    // logic in useProgramProgress.ts gates the rest of the curriculum for
    // free (module 1 is always unlocked; module 2 stays locked until every
    // item in module 1 — this one — is complete). No changes to that
    // locking logic were needed. `presentation: 'takeover'` is what tells
    // ProgramTabClassroom.vue to open the blocking modal + full-screen
    // wizard here instead of the normal ProgramStepDrawer.
    {
      id: 'mod-eg-pre-survey',
      title: 'Pre-Survey',
      description: 'A few questions before you start.',
      items: [
        {
          id: 'item-eg-pre-survey',
          type: 'survey',
          title: 'Before You Begin',
          xp: XP.survey,
          contentType: 'text',
          presentation: 'takeover'
        }
      ]
    },
    {
      id: 'mod-eg-intro',
      title: 'Introduction',
      description: 'What Explore: Godot is, what you need before you start, and where to play the moddable platformer you\'ll be building on.',
      items: [
        {
          id: 'item-eg-intro-overview',
          type: 'topic',
          title: 'Overview',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: 'Explore: Godot is a 10-session project aimed at taking you from player to builder. In this series, you will step inside a professional game engine to construct your very own 2D platformer level set in the Threadbare universe.' },
            { kind: 'paragraph', text: 'Here, you will:' },
            {
              kind: 'list',
              items: [
                'Explore the Tools: Learn the interface of the Godot Engine, a powerful tool used by indie developers worldwide.',
                'Script the Action: Write real code (scripts) to control player movement, collectibles, and hazards.',
                'Design the Fun: Arrange platforms, traps, and goals to create a level that challenges your friends.'
              ]
            },
            { kind: 'paragraph', text: 'Unlike the workshops, this is a continuous project. You will build upon your work in every session, culminating in a fully playable level.' },
            { kind: 'paragraph', text: "Once you've completed Explore: Godot, you can earn the Introduction to Game Making with Godot microcredential from Arizona State University!" },
            { kind: 'paragraph', text: 'Before you begin, make sure you have these things ready:' },
            {
              kind: 'list',
              items: [
                'A Computer or Laptop: You need a Windows, Mac, or Linux machine to run the game engine. Note: Tablets, phones, and most Chromebooks will not work.',
                'Godot Engine Installed: You must download and install the Godot Engine (we will guide you through this in the first session).',
                'A 3-Button Mouse: While a trackpad is possible, a mouse with a scroll wheel makes navigating the game world significantly easier.',
                'A Game Design Journal: To sketch your level layouts and track your to-do list.'
              ]
            },
            { kind: 'media', media: 'image' }
          ]
        },
        {
          id: 'item-eg-intro-play',
          type: 'topic',
          title: 'Play the Moddable Platformer',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: "Play the unfinished platformer in your browser and consider what's possible for mods!" },
            { kind: 'paragraph', text: 'Use the following link to play the unfinished platformer directly in your browser and explore the game meant to be modded!' },
            { kind: 'link', label: 'Play the Platformer', href: 'https://endlessm.github.io/moddable-platformer/' },
            { kind: 'paragraph', text: 'Need to use the Moddable Platformer project offline? Download the latest version of the project. Select the release marked Latest, open Assets, and download the project ZIP file. Then, extract the file and import the project into Godot.' },
            { kind: 'link', label: 'Latest release page', href: 'https://github.com/endlessm/moddable-platformer/releases' },
            { kind: 'media', media: 'image', caption: 'Moddable Platformer' }
          ]
        },
        {
          id: 'item-eg-intro-faq',
          type: 'topic',
          title: 'Frequently Asked Questions',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'heading', text: 'How much time will it take me to complete this program?' },
            { kind: 'paragraph', text: 'Each session is designed to take around an hour to complete. However, each person learns in a different way and at a different pace, so here are some considerations:' },
            { kind: 'paragraph', text: "Sessions (and activities) have an estimated time for completion, but these time frames are flexible: you might do something really fast and finish early, or you might need (or want to) stop and dig a little deeper in one task. That's ok!" },
            { kind: 'paragraph', text: 'When you are asked to make mods, create a level or even do your own prototype, you can do it at your own pace.' },
            { kind: 'paragraph', text: 'Remember: learning is not linear!' },
            { kind: 'heading', text: 'What is an Essential Question?' },
            { kind: 'paragraph', text: 'You\'ll see that each session begins with an essential question designed to provoke deep thinking about key concepts in game design. There\'s no need to write down an answer, and there are no right or wrong answers either. For instance, when we ask "What makes a level \'just right\'?" we\'re trying to encourage you to delve into critical aspects such as game mechanics, storytelling, player experience, and player engagement throughout the session. Each activity of a session connects to this essential question in one way or another.' },
            { kind: 'heading', text: 'How do I get help if I need it?' },
            { kind: 'paragraph', text: 'If you need assistance, please send an email to learning@endlessaccess.org.' }
          ]
        },
        {
          // The page renders this session as a single "Go to link" button out to
          // an external glossary; the source does not capture its URL.
          id: 'item-eg-intro-glossary',
          type: 'resource',
          title: 'Game Design Glossary',
          xp: XP.resource,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: "We know there are a lot of unique industry terms, so feel free to use our Game Design Glossary to quickly look up anything you don't recognize." },
            { kind: 'link', label: 'Go to link' }
          ]
        }
      ]
    },
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Get comfortable with Godot by loading and modding your first game – a moddable version of Pong – and reflect on basic game elements.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Open Godot for the first time.',
                'Load a moddable Pong game and explore its parts.',
                'Think about what makes a game a game.',
                'Analyze the game elements in Pong.',
                'Make your own simple modifications (mods).'
              ]
            },
            { kind: 'paragraph', text: "Build confidence in navigating Godot's user interface (UI) and seeing how changes you make can transform a player's experience." },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Play and analyze platformer games and practice modding a new genre in Godot.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Play games from a different genre: platformers.',
                'Learn what core gameplay loops are, and analyze how they look in platformers.',
                'Load and mod a platformer in Godot.',
                'Share your mods with the community.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Create a small playable level by intentionally remixing the base platformer from start to finish. This session is different from earlier modding.' },
            { kind: 'paragraph', text: "Instead of experimenting with individual changes, you'll focus on quickly shaping a level that feels complete and fun to play." },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Brainstorm how you would remake a platformer level.',
                'Consider progression and balance of challenges in the platformer.',
                'Use the tilemap and existing game components to remake the entire base level.',
                'Share your level with the community.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Learn problem decomposition – breaking a big design challenge into smaller steps – and keep implementing your mods to the level.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Explore how problem-solving applies to game design.',
                'Practice breaking a big problem into smaller, manageable steps, also known as problem decomposition.',
                'Connect this skill to redesigning your own level in Godot.'
              ]
            },
            { kind: 'paragraph', text: 'Create your own Level Design Document.' },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Begin building your new platformer level in Godot, balancing creativity, challenge, and accessibility.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Begin building your planned platformer level.',
                "Learn how to use Godot's animation tools to make dynamic elements.",
                'Think about pacing and difficulty curves.',
                'Playtest sections as you build.',
                "Tweak your plan as you go (that's part of the process!)."
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Build and refine your platformer level by testing ideas, playtesting often, and responding to feedback.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Explore a game design lens and brainstorm how it could shape your level.',
                'Build your platformer level based on your plan and ideas.',
                'Playtest sections as you build to see how they feel in action.',
                'Adjust and refine your plan as you learn what works and as you get feedback from other players.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Build and refine your platformer level by testing ideas, playtesting often, and responding to feedback.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Explore a game design lens and brainstorm how it could shape your level.',
                'Build your platformer level based on your plan and ideas.',
                'Playtest sections as you build to see how they feel in action.',
                'Adjust and refine your plan as you learn what works and as you get feedback from other players.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Build and refine your platformer level by testing ideas, playtesting often, and responding to feedback.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Explore a game design lens and brainstorm how it could shape your level.',
                'Build your platformer level based on your plan and ideas.',
                'Playtest sections as you build to see how they feel in action.',
                'Adjust and refine your plan as you learn what works and as you get feedback from other players.'
              ]
            },
            { kind: 'note', text: 'Every time you see a highlighted word, you can go to the Glossary in the Introduction section to find out more.' }
          ]
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Conduct playtesting session with people you know, and finish polishing your level and make plans for how best to showcase your level.' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Ask people to playtest your level and gather data to apply the finish touches or correct any bugs your level might have.',
                'Have a playable level – even if it isn\'t "perfect".',
                "Plan out the structure of your level's pitch deck."
              ]
            }
          ]
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
          contentType: 'slideshow',
          body: [
            { kind: 'media', media: 'slideshow' },
            { kind: 'heading', text: 'Session Goal' },
            { kind: 'paragraph', text: 'Share your project with the rest of the world! Be proud of your work!' },
            { kind: 'paragraph', text: "In this session, you'll:" },
            {
              kind: 'list',
              items: [
                'Share your work with your community.',
                'Reflect on this experience.'
              ]
            }
          ]
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
    },
    {
      id: 'mod-eg-final',
      title: 'Final Steps',
      description: 'Claim your certificate, then decide what to build next.',
      items: [
        {
          id: 'item-eg-final-certificate',
          type: 'survey',
          title: 'Certification of Completion',
          xp: XP.survey,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: "You've completed Explore: Godot, and it's time to celebrate! Submit this form to receive your official Explore: Godot certificate of completion." },
            { kind: 'link', label: 'Go to link' }
          ]
        },
        {
          id: 'item-eg-final-continue',
          type: 'topic',
          title: 'Continue Your Journey',
          xp: XP.topic,
          contentType: 'text',
          body: [
            { kind: 'paragraph', text: "You've built your own platformer level in Godot. Now take the next step." },
            { kind: 'paragraph', text: 'Try Explore: Git to learn how to collaborate using Git and GitHub before diving into larger team projects.' },
            { kind: 'link', label: 'Explore: Git program', href: 'https://studio.endlessstudios.com/programs/3991983/' },
            { kind: 'paragraph', text: 'If you are confident in your Git skills, then you can go right to Core: Threadbare to design and build your own StoryQuest inside the Threadbare world!' },
            { kind: 'link', label: 'Core: Threadbare program', href: 'https://studio.endlessstudios.com/programs/1737709/' },
            { kind: 'media', media: 'image' }
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
