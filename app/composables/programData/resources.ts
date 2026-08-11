import type { ProgramResourceSection } from './types'

// Source: docs/brain/Knowledge Base/Programs/Explore-Godot/curriculum.md.
// Moved out of the "Creator Tools & Guides" curriculum module into its own
// Resources tab — a link list to browse anytime, not a lesson to step
// through and complete.
export const resourcesByProgram: Record<string, ProgramResourceSection[]> = {
  'explore-godot': [
    {
      id: 'item-eg-tools-art',
      title: 'Art Tools',
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
              href: 'https://threadbare-pixelstitch.lovable.app/',
              description: 'A simple free online pixel art tool for designing sprites, tiles, and animated frames, with easy export options for use in your game.'
            },
            {
              label: 'Threadbare Pixel Loom (Web App)',
              href: 'https://threadbare-pixelloom.lovable.app/',
              description: 'A browser-based remix tool built from official Threadbare assets, allowing you to combine house structures, architectural details, and decorative elements to create new variations you can export directly into your game.'
            },
            {
              label: 'Kleki (Web App)',
              href: 'https://kleki.com/',
              description: 'A free online drawing tool with simple brushes and layers that lets you quickly sketch characters, backgrounds, or ideas for your game right in your browser.'
            },
            {
              label: 'Krita (Downloadable App)',
              href: 'https://krita.org/en/',
              description: "A free, professional-level drawing and painting program that's great for creating detailed characters, backgrounds, and digital artwork for your game."
            },
            {
              label: 'GIMP (Downloadable App)',
              href: 'https://www.gimp.org/',
              description: 'A powerful free image editor you install on your computer, useful for editing images, creating textures, and designing more advanced visual assets.'
            }
          ]
        }
      ]
    },
    {
      id: 'item-eg-tools-music',
      title: 'Music and Sound Tools',
      body: [
        { kind: 'paragraph', text: 'A curated list of free music and sound tools and libraries you can use to create, record, edit, or download audio for your game projects.' },
        {
          kind: 'linkList',
          items: [
            {
              label: 'Melody Loom (Web App)',
              href: 'https://threadbare-melodyloom.lovable.app/',
              description: 'A free, browser-based music and sound tool where you can create simple melodies, generate sound effects, record audio, adjust pitch or reverb, and export your sounds to use in your game.'
            },
            {
              label: 'Freesound.org (Web Resource)',
              href: 'https://freesound.org/',
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
      id: 'item-eg-tools-godot',
      title: 'Godot Resources',
      body: [
        { kind: 'paragraph', text: 'A growing collection of video guides and helpful tools to support you as you learn Godot, build your level, and experiment with new ideas in your game.' },
        {
          kind: 'linkList',
          items: [
            {
              label: 'Unlock The Platformer Hidden Powers',
              href: 'https://jgbourque.github.io/Guides/godot-platformer/ability-unlock/index.html',
              description: 'A step-by-step walkthrough showing how to turn on the secret player abilities within the moddable platformer.'
            },
            {
              label: 'Build your own scene in Godot',
              href: 'https://jgbourque.github.io/Guides/godot-platformer/make-a-scene/index.html#step-1',
              description: 'A step-by-step walkthrough showing how to build a new scene in Godot using the platformer as an example project.'
            },
            {
              label: 'Export and Share Your Game Project',
              href: 'https://youtu.be/zxgWkZgwFyk',
              description: 'Learn how to export your Godot project correctly and upload it to the platform so others can playtest your work and share thoughtful feedback.'
            },
            {
              label: 'Mod the Platformer',
              href: 'https://www.youtube.com/watch?v=TYLl8_u88bw',
              description: 'A step-by-step walkthrough showing many different ways you can modify the platformer, from changing rules and mechanics to redesigning space, challenges, and game elements.'
            },
            {
              label: 'Introduction to GDScript',
              href: 'https://www.youtube.com/watch?v=e1zJS31tr88',
              description: "An overview from the content creator Brackeys introducing GDScript, Godot's built-in programming language, and demonstrating key scripting concepts such as variables, functions, parameters, conditions, and loops."
            },
            {
              // Source URL is truncated mid-path ("…") — left without an href
              // rather than guessing the rest, per this file's convention for
              // links the source never fully spells out.
              label: 'Learn GDScript From Zero',
              description: 'A free, interactive course from GDQuest that introduces the foundations of GDScript through guided lessons and hands-on coding exercises that run directly in your browser.'
            },
            {
              label: 'Adding Your Own Artwork To Your Game In Godot',
              href: 'https://www.youtube.com/watch?v=jJAc5_N30cc',
              description: 'Learn how to import a PNG into Godot and use it as a background, collectible, or visual element in your level.'
            },
            {
              label: 'Animating Images With Piskelapp',
              href: 'https://www.youtube.com/watch?v=GmN8S6Pdd8o',
              description: 'A simple guide to creating multiple animation frames in Piskel so your characters or objects can move and feel alive.'
            },
            {
              label: 'Design and Replace a Character in Threadbare | Step-by-Step Guide',
              href: 'https://www.youtube.com/watch?v=ob3nYlyy62s',
              description: 'Follow the full process of designing a character, building a sprite sheet, and placing it into a game so it animates correctly.'
            },
            {
              label: 'Godot Tutorial: Add Your Own Soundtrack to the Platformer',
              href: 'https://www.youtube.com/watch?v=nT__Ro3xOjM',
              description: 'See how to add music to your game using an AudioStreamPlayer node so your soundtrack plays automatically when the level starts.'
            },
            {
              label: 'Godot Tutorial: Create a Moving Platform',
              href: 'https://www.youtube.com/watch?v=FZ0Rxfe5t1I',
              description: 'Learn how to construct a new scene in Godot and use the animation panel and keyframes to make a platform move back and forth to add motion and challenge to your level. These steps can be used to animate all kinds of other aspects of your game, not just platforms.'
            },
            {
              label: 'How to Create 2D Tilesets for Threadbare Using Godot and Piskel | Threadbare Game',
              href: 'https://www.youtube.com/watch?v=S_jXiouPwrQ',
              description: 'A chaptered guide showing how to design tiles, build a tileset, and implement it in a game, with optional sections for teams using Git and GitHub. (Made for a different game and for teams, but the basic steps for implementing tilesets still apply.)'
            }
          ]
        }
      ]
    },
    {
      id: 'item-eg-tools-narrative',
      title: 'Narrative',
      body: [
        { kind: 'paragraph', text: 'A curated list of tools and resources to help you develop story ideas, shape characters, and structure meaningful narrative experiences in your game.' },
        {
          kind: 'linkList',
          items: [
            {
              label: 'The Whispering Well (Web App)',
              href: 'https://threadbare-whisperingwell.lovable.app/',
              description: 'A genre-based story generator that shuffles "Who, What, When, Where" fragments to spark unexpected combinations and inspire new narrative directions.'
            }
          ]
        }
      ]
    },
    {
      id: 'item-eg-tools-planning',
      title: 'Brainstorming & Planning',
      body: [
        { kind: 'paragraph', text: 'Tools for visual brainstorming, planning, and collaborative ideation.' },
        {
          kind: 'linkList',
          items: [
            {
              label: 'Excalidraw',
              href: 'https://excalidraw.com/',
              description: 'A collaborative digital whiteboard that lets you sketch diagrams, map ideas, and organize concepts with hand-drawn style elements.'
            },
            {
              label: 'mood.site',
              href: 'https://mood.site/XyzL5b_k?edit=-ZIFmWz_',
              description: 'A simple web-based visual mood board for collecting and organizing images and visual inspiration.'
            },
            {
              label: 'TLDraw',
              href: 'https://www.tldraw.com/',
              description: 'A free, collaborative digital whiteboard with an infinite canvas for sketching, drawing, and visually planning ideas without needing an account.'
            }
          ]
        }
      ]
    },
    {
      id: 'item-eg-tools-backstitch',
      title: 'Backstitch',
      body: [
        { kind: 'paragraph', text: 'A collaborative software plugin that works within Godot.' },
        { kind: 'note', text: 'This is currently "alpha" software that is still being developed. Please read the warnings closely on the front page regarding data and project access.' },
        { kind: 'link', label: 'BackStitch website', href: 'https://backstitch.dev/docs/installation/demo-project' },
        { kind: 'paragraph', text: 'A short video walking through downloading, installing, and setting up the moddable platformer in Godot with the addition of the Backstitch plugin.' },
        { kind: 'link', label: 'Installing Godot+Backstitch+Platformer Bundle (Video Guide)', href: 'https://drive.google.com/file/d/1lkxKXQhweYbxdQ319ibeyArTqR8eXU8l/view?usp=sharing' }
      ]
    }
  ]
}
