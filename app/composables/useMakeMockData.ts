export interface ToolCardData {
  id: string
  name: string
  tag: string
  blurb: string
  badge: 'Live' | 'Beta'
  image?: string
  logo?: string
  logoBg?: string
  url?: string
  isDownload?: boolean
}

export interface ExternalTool {
  id: string
  name: string
  blurb: string
  logo: string
  logoBg: string
  url: string
}

export const webTools: ToolCardData[] = [
  {
    id: 'godot-web',
    name: 'Godot Web Editor',
    tag: 'Game engine',
    blurb: 'The full Godot editor, running in your browser. Build and export real games — no install.',
    badge: 'Live',
    logo: '/images/tools/godot-mark.svg',
    logoBg: '#478CBF',
    url: 'https://editor.godotengine.org/releases/latest/'
  },
  {
    id: 'baby-godot',
    name: 'Baby Godot',
    tag: 'Entry-level engine',
    blurb: 'Our guided, kid-friendly on-ramp to Godot. Big blocks, gentle steps, real results.',
    badge: 'Beta',
    logo: '/images/tools/godot-mark.svg',
    logoBg: '#6AA9DB'
  },
  {
    id: 'endstar',
    name: 'Endstar',
    tag: 'Entry-level engine · Download',
    blurb: 'Our flagship adventure — build, remix, and share games from inside the world. Download to play on your device.',
    badge: 'Live',
    image: '/images/tools/endstar-hero.png',
    isDownload: true,
    url: 'https://endlessstudios.com/endstar'
  }
]

export const tailorApps: ToolCardData[] = [
  {
    id: 'pixel-stitch',
    name: 'Threadbare Pixel Stitch',
    tag: 'Sprite & pixel art',
    blurb: 'Stitch together sprites and pixel art for your characters and props.',
    badge: 'Live',
    image: '/images/tools/pixel-stitch.jpeg',
    url: 'https://threadbare-pixelstitch.lovable.app/'
  },
  {
    id: 'patchworkshop',
    name: 'Threadbare PatchWorkShop',
    tag: 'Art assets & scenes',
    blurb: 'Assemble pre-designed art assets, published as individual components, into unique game-ready structures and scenes.',
    badge: 'Live',
    image: '/images/tools/patchworkshop.jpeg',
    url: 'https://threadbare-patchworkshop.lovable.app/'
  },
  {
    id: 'whispering-well',
    name: 'Threadbare Whispering Well',
    tag: 'Story & dialogue',
    blurb: 'Write branching dialogue and weave the stories characters tell.',
    badge: 'Live',
    image: '/images/tools/whispering-well.jpeg',
    url: 'https://threadbare-whisperingwell.lovable.app/'
  },
  {
    id: 'melody-loom',
    name: 'Threadbare Melody Loom',
    tag: 'Music & sound',
    blurb: 'Loom together melodies, loops and sound effects for your game.',
    badge: 'Live',
    image: '/images/tools/bg-01.png',
    url: 'https://threadbare-melodyloom.lovable.app'
  },
  {
    id: 'patches',
    name: 'Threadbare Patches',
    tag: 'Characters',
    blurb: 'Design and customize the characters that live in your world.',
    badge: 'Live',
    image: '/images/tools/bg-11.png',
    url: 'https://threadbare-patches.lovable.app'
  },
  {
    id: 'builders-bench',
    name: "Threadbare Builder's Bench",
    tag: 'Props & objects',
    blurb: 'Craft interactive props, objects and contraptions for your levels.',
    badge: 'Live',
    image: '/images/tools/bg-27.png',
    url: 'https://threadbear-builders-bench.lovable.app'
  },
  {
    id: 'swag-lab',
    name: 'Threadbare Swag Lab',
    tag: 'Items & loot',
    blurb: 'Cook up collectibles, loot and swag for players to discover.',
    badge: 'Live',
    image: '/images/tools/bg-38.png',
    url: 'http://threadbare-swag-lab.lovable.app'
  }
]

export const externalTools: ExternalTool[] = [
  {
    id: 'unity',
    name: 'Unity',
    blurb: 'Industry-standard real-time 3D engine.',
    logo: '/images/tools/unity-mark.svg',
    logoBg: '#1A1A1A',
    url: 'https://unity.com'
  },
  {
    id: 'blender',
    name: 'Blender',
    blurb: '3D modeling, sculpting & animation.',
    logo: '/images/tools/blender-mark.svg',
    logoBg: '#EA7600',
    url: 'https://www.blender.org'
  },
  {
    id: 'aseprite',
    name: 'Aseprite',
    blurb: 'Pixel-art & sprite animation editor.',
    logo: '/images/tools/aseprite-mark.svg',
    logoBg: '#5A6673',
    url: 'https://www.aseprite.org'
  },
  {
    id: 'github',
    name: 'GitHub',
    blurb: 'Version control & collaboration.',
    logo: '/images/icons/github-mark.svg',
    logoBg: '#181717',
    url: 'https://github.com'
  }
]
