import { VideoProject, Conversation, InspirationItem, Scene } from '../types';

export const VIDEO_STYLES = [
  {
    id: 'cinematic',
    name: 'Cinematic 8K',
    desc: 'Photorealistic anamorphic lens, 35mm film grain, volumetric lighting',
    badge: 'Popular',
    color: '#FFD600',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    desc: 'Holographic glows, rain-slicked neon streets, dark chrome reflections',
    badge: 'Trending',
    color: '#FF7A1A',
  },
  {
    id: 'anime',
    name: 'Anime Neo-Tokyo',
    desc: 'High-octane Makoto Shinkai aesthetic, fluid 2D keyframes, vibrant skies',
    badge: 'Studio',
    color: '#38BDF8',
  },
  {
    id: 'surreal',
    name: 'Hyper-Surrealism',
    desc: 'Floating liquid metal, metaphysical architecture, dreamscapes',
    badge: 'Experimental',
    color: '#A855F7',
  },
  {
    id: 'vintage',
    name: '16mm Kodachrome',
    desc: 'Warm nostalgic 1970s film emulsion, dust scratches, golden hour',
    badge: 'Retro',
    color: '#F59E0B',
  },
  {
    id: 'claymation',
    name: 'Clay & Stop-Motion',
    desc: 'Tactile sculpted plasticine textures, playful frame rates, studio lighting',
    badge: 'Craft',
    color: '#10B981',
  },
];

export const INITIAL_PROJECTS: VideoProject[] = [
  {
    id: 'proj-1',
    title: 'Neon Odyssey: Shinjuku 2099',
    prompt: 'A cybernetic traveler walking through a rain-soaked neon canyon in futuristic Tokyo, reflections of towering holographic billboards rippling on wet asphalt.',
    enhancedPrompt: 'Cinematic 8K master shot, hyper-detailed cyberpunk street corridor in Shinjuku year 2099, towering holographic neon monoliths casting crimson and amber refractions onto rain-slick obsidian pavement, lone traveler in modular carbon fiber trench coat, anamorphic 35mm lens, atmospheric steam vents, blade runner lighting, volumetric fog, Unreal Engine 5 render style.',
    style: 'Cyberpunk Neon',
    aspectRatio: '16:9',
    duration: 12,
    resolution: '4K',
    fps: 60,
    status: 'completed',
    progress: 100,
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2 hours ago',
    isFavorite: true,
    tags: ['Cyberpunk', 'Cinematic', 'Neon', 'Rain'],
    viewsCount: 3840,
    likesCount: 942,
    scenes: [
      {
        id: 's-1',
        sceneNumber: 1,
        duration: 4,
        cameraMotion: 'Slow Orbit',
        prompt: 'Low angle shot of obsidian puddle reflecting towering amber holographic kanji symbols.',
        visualNotes: 'Golden rim lighting, water ripple physics, moody rain ambiance',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 's-2',
        sceneNumber: 2,
        duration: 4,
        cameraMotion: 'Pan Right',
        prompt: 'Medium tracking shot of traveler in illuminated cybernetic trench coat passing through steam.',
        visualNotes: 'Lens flare from magenta neon signage, dynamic cloth simulation',
        thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 's-3',
        sceneNumber: 3,
        duration: 4,
        cameraMotion: 'Cinematic Crane Up',
        prompt: 'Epic wide crane pulling upwards into sky, revealing a colossal megalopolis with flying transit pods.',
        visualNotes: 'Atmospheric depth, hundreds of glowing traffic streams, cinematic grandeur',
        thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'Solaris Bioluminescent Grove',
    prompt: 'Floating alien flora pulsating with bio-electric light under twin binary moons.',
    enhancedPrompt: 'Macro IMAX capture of zero-gravity alien jungle on exoplanet, bioluminescent spore pods emitting turquoise and gold bioluminescence, intricate fractals, glowing capillary roots floating in misty troposphere, twin celestial moons glowing through canopy.',
    style: 'Hyper-Surrealism',
    aspectRatio: '9:16',
    duration: 8,
    resolution: '1080p',
    fps: 30,
    status: 'completed',
    progress: 100,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    createdAt: 'Yesterday',
    isFavorite: true,
    tags: ['Sci-Fi', 'Flora', 'Surreal', 'Vertical'],
    viewsCount: 1920,
    likesCount: 430,
    scenes: [
      {
        id: 's-4',
        sceneNumber: 1,
        duration: 4,
        cameraMotion: 'Hyperlapse Zoom',
        prompt: 'Extreme close up of iridescent crystal petals unfurling in slow motion.',
        visualNotes: 'Microscopic depth of field, particle sparks',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 's-5',
        sceneNumber: 2,
        duration: 4,
        cameraMotion: 'FPV Drone Dive',
        prompt: 'Gliding between massive floating tree trunks wrapped in golden glowing vines.',
        visualNotes: 'Fluid zero-g motion, twilight sky gradient',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'proj-3',
    title: 'Hypercar Chronos Prototype',
    prompt: 'A sleek matte-black hypercar speeding through a salt flat tunnel of light beams at midnight.',
    enhancedPrompt: 'Automotive luxury commercial aesthetic, dynamic rolling rig shot of aerodynamic carbon fiber hypercar, aerodynamic vortex trails glowing in air, laser headlight cutoffs, dramatic backlighting, cinematic motion blur.',
    style: 'Cinematic 8K',
    aspectRatio: '21:9',
    duration: 15,
    resolution: '4K',
    fps: 60,
    status: 'completed',
    progress: 100,
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    createdAt: '3 days ago',
    isFavorite: false,
    tags: ['Commercial', 'Automotive', 'Speed', 'Luxury'],
    viewsCount: 4500,
    likesCount: 1102,
    scenes: [
      {
        id: 's-6',
        sceneNumber: 1,
        duration: 5,
        cameraMotion: 'Pan Left',
        prompt: 'Wheel rim close-up spinning at 200mph, sparks and aerodynamic airflow trails.',
        visualNotes: 'Shallow focal plane, carbon ceramic brake glow',
        thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 's-7',
        sceneNumber: 2,
        duration: 5,
        cameraMotion: 'FPV Drone Dive',
        prompt: 'Chasing the vehicle from high altitude swooping down to bumper level.',
        visualNotes: 'High velocity thrill, sonic wave distortion',
        thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 's-8',
        sceneNumber: 3,
        duration: 5,
        cameraMotion: 'Static',
        prompt: 'Car brakes to a halt in misty salt flats, dihedral doors lifting upward.',
        visualNotes: 'Signature yellow cockpit illumination, steam rising from exhausts',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'proj-4',
    title: 'Floating Monastery of Kael',
    prompt: 'Ancient stone pagoda anchored to an anti-gravity asteroid above swirling cloud oceans.',
    enhancedPrompt: 'Ghibli meets Dune spiritual aesthetic, weathered ancient sandstone pagoda tethered with gigantic iron chains to levitating rock mass, monks with lantern staves in wind, endless pink sunset sea of cumulus clouds.',
    style: 'Anime Neo-Tokyo',
    aspectRatio: '16:9',
    duration: 10,
    resolution: '1080p',
    fps: 30,
    status: 'completed',
    progress: 100,
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    createdAt: '5 days ago',
    isFavorite: false,
    tags: ['Anime', 'Fantasy', 'Clouds', 'Architecture'],
    viewsCount: 1250,
    likesCount: 310,
    scenes: [
      {
        id: 's-9',
        sceneNumber: 1,
        duration: 5,
        cameraMotion: 'Pan Right',
        prompt: 'Wide establishing panorama of the floating pagoda island at golden sunset.',
        visualNotes: 'Wind blowing prayer banners, ethereal choir mood',
        thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 's-10',
        sceneNumber: 2,
        duration: 5,
        cameraMotion: 'Cinematic Crane Up',
        prompt: 'Camera tilts up following incense smoke ascending toward a ringed planet in the twilight.',
        visualNotes: 'Soft brush textures, serene pacing',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Cyberpunk Shinjuku Script & Storyboard',
    createdAt: '2 hours ago',
    updatedAt: '10 mins ago',
    pinned: true,
    messages: [
      {
        id: 'm-1',
        role: 'user',
        content: 'I want to craft an animated video concept for a futuristic cyberpunk city. Can you give me an opening hook and a 3-scene camera plan?',
        timestamp: '10:45 AM',
      },
      {
        id: 'm-2',
        role: 'assistant',
        model: 'Thinking Machines Inkling',
        jevDecision: {
          intent: 'creative_writing',
          complexity: 'complex',
          confidence: 0.96,
          reasoningBudget: 'high',
          latencyMs: 64,
        },
        suggestedFollowUps: [
          'Can you break this into camera motion prompts for each scene?',
          'What audio and sound design cues would match this sequence?',
          'Can we introduce a secondary antagonist character in Scene 2?',
        ],
        content: `Here is a high-impact opening concept tailored for **ONe Studio** video generation:

### Title: **Neon Odyssey: Shinjuku 2099**

**Visual Hook:**  
Rain descends through layers of holographic advertisements, each droplet catching amber and cyan refractions before striking the visor of an atmospheric courier.

\`\`\`yaml
Scene 1:
  Duration: 4.0s
  Camera: Low angle 35mm, slow orbit
  Focus: Water ripples reflecting towering amber holographic kanji symbols
Scene 2:
  Duration: 4.0s
  Camera: Medium tracking, lateral pan right
  Focus: Courier in modular trench coat cutting through rising sewer steam
Scene 3:
  Duration: 4.0s
  Camera: Cinematic crane ascending
  Focus: City reveal showing transit sky-tubes and megastructure spires
\`\`\`

Would you like to send this master prompt directly into the **Text-to-Video Studio** to synthesize the storyboard?`,
        timestamp: '10:46 AM',
        suggestedAction: {
          label: 'Send to Video Studio',
          actionType: 'open-studio',
          payload: 'A cybernetic traveler walking through a rain-soaked neon canyon in futuristic Tokyo, reflections of towering holographic billboards rippling on wet asphalt.',
        },
      },
      {
        id: 'm-3',
        role: 'user',
        content: 'What lighting parameters work best for rain reflections in dark scenes?',
        timestamp: '10:48 AM',
      },
      {
        id: 'm-4',
        role: 'assistant',
        model: 'Thinking Machines Inkling',
        jevDecision: {
          intent: 'technical_reasoning',
          complexity: 'moderate',
          confidence: 0.94,
          reasoningBudget: 'medium',
          latencyMs: 52,
        },
        suggestedFollowUps: [
          'How do shutter angles affect wet asphalt motion blur?',
          'Which Unreal Engine 5.4 Lumen settings optimize volumetric rain?',
          'Can you write the exact color grading LUT parameters?',
        ],
        content: `For dark, rain-drenched environments, configure these prompt descriptors:

1. **Fresnel Reflections:** \`anamorphic lens flares, wet obsidian asphalt, specular highlights\`
2. **Volumetric Atmosphere:** \`dense localized ground mist, sodium vapor backlighting, orange rim light\`
3. **Color Contrast:** Keep shadows at **#090909** and key highlights in **#FFD600 (Signature Yellow)** and **#FF7A1A (Accent Amber)** for the unmistakable ONe aesthetic.

You can press the **Magic Prompt Enhancer** in Studio to auto-inject these lighting cues into your prompt!`,
        timestamp: '10:49 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'TypeSafe Decision: Ice Cream Sandwich',
    createdAt: 'Yesterday',
    updatedAt: 'Yesterday',
    messages: [
      {
        id: 'm-5',
        role: 'user',
        content: 'Is an ice cream sandwich a sandwich?',
        timestamp: '3:15 PM',
      },
      {
        id: 'm-6',
        role: 'assistant',
        model: 'Thinking Machines Inkling',
        jevDecision: {
          engine: 'Jev (TypeSafe AI System One)',
          intent: 'decision_noul',
          complexity: 'simple',
          confidence: 0.94,
          reasoningBudget: 'low',
          latencyMs: 48,
          primitiveType: 'noul',
          noulResult: {
            question: "Is 'Ice cream sandwich' a sandwich?",
            subject: 'Ice cream sandwich',
            category: 'Food Classification',
            truthScorePercent: 33,
            verdict: 'CONTESTED / AMBIGUOUS',
            confidence: 0.94,
            criteria: "A sandwich is defined as a dish where meat, cheese, or savory filling is held between two pieces of bread. An ice cream sandwich consists of dairy ice cream between wafer cookies, functioning taxonomically as a confection.",
          },
        },
        suggestedFollowUps: [
          'What about a hotdog: is it structurally a taco or a sandwich?',
          'How does the legal USDA definition define a sandwich?',
          'What is the Cube Rule of Food definition?',
        ],
        content: `### 🎯 Definitive Verdict: **33% True (Taxonomically Contested)**

TypeSafe AI's **Jev Engine** evaluated this proposition in **48ms** against standard sandwich taxonomies and determined a **33% truth score**. Here is the deep reasoning breakdown from **Thinking Machines Inkling**:

---

### 1. Structural Argument (Why it resembles a sandwich)
* **The Layering Rule:** An ice cream sandwich shares the structural topology of a sandwich: two rigid carbohydrates enclosing a softer filling.
* **Linguistic Convention:** Common English nomenclature refers to it as a "sandwich".

---

### 2. Culinary & Legal Counterarguments (Why it fails the 100% test)
* **Carbohydrate Matrix:** The enclosing layers are **wafer cookies or biscuits**, not leavened bread.
* **Filling State:** The interior is frozen aerated dairy confection, which undergoes phase change at room temperature.
* **USDA Standard:** The USDA Food Safety and Inspection Service defines a sandwich as containing at least 35% cooked meat and no more than 50% bread. 

---

### 💡 Conclusion
An ice cream sandwich is a **metaphorical or structural sandwich**, but culinarily classified as an **ice cream novelty / confection**. Jev was not tricked by the word *"sandwich"* in its title!`,
        timestamp: '3:16 PM',
      },
    ],
  },
];

export const INSPIRATION_GALLERY: InspirationItem[] = [
  {
    id: 'insp-1',
    title: 'The Quantum Weaver',
    creator: {
      name: 'Elena Rostova',
      handle: '@elena_cine',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    prompt: 'A sentient quantum entity weaving luminous threads of light across dark space, cosmic nebulae spiraling inward, cinematic lighting, 8k resolution, octane render.',
    style: 'Surrealism',
    aspectRatio: '16:9',
    duration: '10s',
    likes: 1420,
    views: 8900,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    videoPreview: '',
    category: 'Surreal',
  },
  {
    id: 'insp-2',
    title: 'Neo-Tokyo Midnight Drift',
    creator: {
      name: 'Kenji Sato',
      handle: '@kenji_vfx',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    prompt: 'Custom 1993 rotary sports car drifting through neon rain drenched expressway in Tokyo, speed lines, sparks from titanium underbody, anime aesthetic.',
    style: 'Anime Neo-Tokyo',
    aspectRatio: '16:9',
    duration: '15s',
    likes: 2980,
    views: 14300,
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    videoPreview: '',
    category: 'Anime',
  },
  {
    id: 'insp-3',
    title: 'Sub-Zero Cryo Station',
    creator: {
      name: 'Marcus Vance',
      handle: '@vance_ai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    prompt: 'Glacial research outpost on Jupiter moon Europa, subsurface ocean vents emitting heated blue vapor through cracked ice shelves, FPV drone flythrough.',
    style: 'Cinematic 8K',
    aspectRatio: '9:16',
    duration: '8s',
    likes: 870,
    views: 4500,
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    videoPreview: '',
    category: 'Sci-Fi',
  },
  {
    id: 'insp-4',
    title: 'Elysium Chronometer: Liquid Gold',
    creator: {
      name: 'Aria Chen',
      handle: '@ariadesign',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    prompt: 'Macro luxury commercial of an intricate tourbillon watch movement forged from liquid yellow gold and floating sapphire crystals, extreme high speed camera.',
    style: 'Cinematic 8K',
    aspectRatio: '1:1',
    duration: '6s',
    likes: 3120,
    views: 18200,
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    videoPreview: '',
    category: 'Commercial',
  },
  {
    id: 'insp-5',
    title: 'Organic Architecture of 3024',
    creator: {
      name: 'Zaha Future Lab',
      handle: '@zahafuture',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    prompt: 'Living biomimetic towers grown from carbon-sequestering mycelium and spiraling vertical gardens in Scandinavian fiord, golden sunrise light.',
    style: 'Hyper-Surrealism',
    aspectRatio: '16:9',
    duration: '12s',
    likes: 1950,
    views: 11000,
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    videoPreview: '',
    category: 'Sci-Fi',
  },
  {
    id: 'insp-6',
    title: 'Origami Phoenix Rebirth',
    creator: {
      name: 'Tatsuya Mori',
      handle: '@tatsuya_paper',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    },
    prompt: 'Intricate paper-folded phoenix rising from glowing charcoal embers, folding and flapping its wings with stop-motion paper craft physics.',
    style: 'Clay & Stop-Motion',
    aspectRatio: '1:1',
    duration: '7s',
    likes: 2410,
    views: 13600,
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    videoPreview: '',
    category: 'Abstract',
  },
];

export const MOCK_AI_RESPONSES = [
  "I've analyzed your creative direction. The visual pacing benefits from starting with an extreme macro close-up before pulling out into a sweeping wide shot. Let's incorporate cinematic anamorphic lens flares to accentuate the contrast.",
  "Here is an enhanced cinematic storyboard structure designed to maximize visual retention and rhythm:",
  "Great concept! I've automatically broken this into 3 coherent scenes with matched lighting continuity and velocity vectors.",
  "This aesthetic pairs perfectly with ONe's Cyberpunk Neon render pipeline. Notice how the amber highlights (#FFD600) balance against the obsidian background (#090909).",
];

export const SUGGESTED_CHAT_PROMPTS = [
  "Create a 3-scene camera script for a cyberpunk street at midnight",
  "Write a photorealistic prompt for zero-gravity bioluminescent coral",
  "Generate an automotive commercial scene for an electric hypercar",
  "Design a mythical floating kingdom in Makoto Shinkai anime style",
];
