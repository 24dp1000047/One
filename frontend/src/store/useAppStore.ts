import { create } from 'zustand';
import { 
  VideoProject, 
  Conversation, 
  Scene, 
  UserSettings, 
  Toast, 
  OrbState, 
  AspectRatio, 
  Resolution, 
  CameraMotion,
  ChatMessage,
  StudioViewMode,
  CameraRigState,
  ColorGradingState,
  AudioMixerState,
  NodeGraphItem,
  GeneratedImage,
  ImageAspectRatio,
  ImageModel,
  AuthUser
} from '../types';
import { 
  INITIAL_CONVERSATIONS, 
  INITIAL_PROJECTS, 
  VIDEO_STYLES, 
  INITIAL_GENERATED_IMAGES, 
  IMAGE_STYLES 
} from '../data/mockData';
import { audioSynth } from '../utils/audioSynth';

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Alex Vance',
  handle: '@alex_creator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: 'Visual director & digital artist crafting cinematic worlds with ONᵉ AI.',
  accentColor: 'yellow',
  themeMode: 'dark',
  soundEnabled: true,
  highQualityPreview: true,
  defaultAspectRatio: '16:9',
  defaultResolution: '4K',
  defaultDuration: 10,
  energyCredits: 4200,
  apiTokens: 'one_live_9f830a91e48bc02a9df',
};

const INITIAL_SCENES: Scene[] = [
  {
    id: 's-init-1',
    sceneNumber: 1,
    duration: 4,
    cameraMotion: 'Slow Orbit',
    prompt: 'Low angle shot of obsidian puddle reflecting towering amber holographic kanji symbols.',
    visualNotes: 'Golden rim lighting, water ripple physics, moody rain ambiance',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 's-init-2',
    sceneNumber: 2,
    duration: 3,
    cameraMotion: 'Pan Right',
    prompt: 'Medium tracking shot of traveler in illuminated cybernetic trench coat passing through steam.',
    visualNotes: 'Lens flare from magenta neon signage, dynamic cloth simulation',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 's-init-3',
    sceneNumber: 3,
    duration: 5,
    cameraMotion: 'Cinematic Crane Up',
    prompt: 'Epic wide crane pulling upwards into sky, revealing a colossal megalopolis with flying transit pods.',
    visualNotes: 'Atmospheric depth, hundreds of glowing traffic streams, cinematic grandeur',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
  },
];

const INITIAL_CAMERA_RIG: CameraRigState = {
  pitch: 16,
  yaw: 38,
  distance: 14,
  fov: 35,
  aperture: 'f/2.8',
  lightingAngle: 55,
  lightingColor: '#A5C4F2',
  lightingIntensity: 1.6,
  cameraMode: 'Orbit',
  motionCurve: 'cinematic-s',
};

const INITIAL_COLOR_GRADING: ColorGradingState = {
  preset: 'Humanon Noir',
  exposure: 0,
  contrast: 108,
  saturation: 95,
  temperature: -8,
  vignette: 35,
  grain: 20,
  bloom: 25,
  lutName: 'Humanon Obsidian',
};

const INITIAL_AUDIO_MIXER: AudioMixerState = {
  isPlayingSynth: false,
  masterVolume: 65,
  droneVolume: 75,
  shimmerVolume: 50,
  atmosphereVolume: 40,
  sfxEnabled: true,
  tempoBpm: 84,
};

const INITIAL_NODE_GRAPH: NodeGraphItem[] = [
  {
    id: 'node-vision',
    type: 'vision',
    title: 'Core Script & Vision',
    subtitle: 'High-concept cybernetic journey',
    x: 30,
    y: 110,
    connectedTo: ['node-scene-1', 'node-lut'],
    data: {
      prompt: 'A cybernetic explorer standing in rain-soaked neo-shinjuku as holographic kanji illuminate towering skyscrapers.',
      logline: 'An introspective sci-fi journey into synthetic consciousness.',
    },
  },
  {
    id: 'node-scene-1',
    type: 'scene',
    title: 'Scene 01: Low Angle Reflection',
    subtitle: '4.0s / Slow Orbit',
    x: 340,
    y: 40,
    connectedTo: ['node-scene-2', 'node-cam'],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    data: {
      duration: 4,
      cameraMotion: 'Slow Orbit',
    },
  },
  {
    id: 'node-scene-2',
    type: 'scene',
    title: 'Scene 02: Trenchcoat Steam Walk',
    subtitle: '3.0s / Tracking Pan',
    x: 650,
    y: 40,
    connectedTo: ['node-scene-3'],
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80',
    data: {
      duration: 3,
      cameraMotion: 'Pan Right',
    },
  },
  {
    id: 'node-scene-3',
    type: 'scene',
    title: 'Scene 03: Ascending Megalopolis',
    subtitle: '5.0s / Crane Reveal',
    x: 960,
    y: 40,
    connectedTo: ['node-audio'],
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80',
    data: {
      duration: 5,
      cameraMotion: 'Cinematic Crane Up',
    },
  },
  {
    id: 'node-cam',
    type: 'camera',
    title: '3D Virtual Camera Rig',
    subtitle: '35mm Anamorphic Prime',
    x: 340,
    y: 280,
    connectedTo: ['node-scene-2'],
    data: {
      focalLength: '35mm',
      aperture: 'f/2.8',
      angle: 'Yaw: +38°, Pitch: 16°',
    },
  },
  {
    id: 'node-lut',
    type: 'lut',
    title: 'Color Grade & Atmosphere',
    subtitle: 'Humanon Noir / Obsidian Matrix',
    x: 650,
    y: 280,
    connectedTo: ['node-scene-3'],
    data: {
      preset: 'Humanon Noir',
      tone: 'Ice Blue & Deep Amber',
    },
  },
  {
    id: 'node-audio',
    type: 'audio',
    title: 'Soundscape & Foley Stems',
    subtitle: '40Hz Sub-Drone + Cosmic Arp',
    x: 960,
    y: 280,
    connectedTo: [],
    data: {
      masterBpm: 84,
      stems: 'Sub Drone, Shimmer, Foley Rain',
    },
  },
];

interface AppState {
  // Navigation & UI
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  orbState: OrbState;
  setOrbState: (state: OrbState) => void;
  isMotionPaused: boolean;
  toggleMotion: () => void;
  isSoundOn: boolean;
  toggleSound: () => void;
  activeSection: string;
  setActiveSection: (s: string) => void;

  // User Authentication
  currentUser: AuthUser | null;
  authToken: string | null;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setAuthModalOpen: (open: boolean, mode?: 'login' | 'register') => void;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  demoLogin: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetAllToFactoryDefaults: () => void;

  // Creations & Projects
  projects: VideoProject[];
  selectedProjectForPreview: VideoProject | null;
  setSelectedProjectForPreview: (project: VideoProject | null) => void;
  toggleFavoriteProject: (id: string) => void;
  deleteProject: (id: string) => void;
  saveProject: (project: VideoProject) => void;

  // Chat
  conversations: Conversation[];
  activeConversationId: string;
  isAiTyping: boolean;
  setActiveConversationId: (id: string) => void;
  createConversation: (initialPrompt?: string) => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  togglePinConversation: (id: string) => void;
  sendMessage: (content: string, attachments?: any[], isAutoContinuation?: boolean) => void;
  regenerateLastMessage: () => void;

  // Text-to-Video Studio
  studioPrompt: string;
  enhancedPrompt: string;
  selectedStyle: string;
  aspectRatio: AspectRatio;
  duration: number;
  resolution: Resolution;
  cameraMotion: CameraMotion;
  scenes: Scene[];
  isEnhancingPrompt: boolean;
  generationStatus: 'idle' | 'analyzing' | 'storyboarding' | 'vectors' | 'rendering' | 'finishing' | 'completed';
  generationProgress: number;
  activeGeneratedVideo: VideoProject | null;

  setStudioPrompt: (prompt: string) => void;
  setSelectedStyle: (style: string) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setDuration: (duration: number) => void;
  setResolution: (res: Resolution) => void;
  setCameraMotion: (motion: CameraMotion) => void;
  enhanceStudioPrompt: () => void;
  generateStoryboardFromPrompt: (promptText?: string) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  addScene: () => void;
  removeScene: (sceneId: string) => void;
  startVideoGeneration: () => void;
  cancelGeneration: () => void;

  // Interactive Studio Modes & Extensions
  studioMode: StudioViewMode;
  setStudioMode: (mode: StudioViewMode) => void;

  // Text-to-Image Generation Studio
  imagePrompt: string;
  negativePrompt: string;
  selectedImageStyle: string;
  imageAspectRatio: ImageAspectRatio;
  imageModel: ImageModel;
  batchCount: number;
  cfgScale: number;
  steps: number;
  seed: number;
  isGeneratingImages: boolean;
  generatedImages: GeneratedImage[];
  activeGeneratedImage: GeneratedImage | null;
  isUpscaling: boolean;

  setImagePrompt: (prompt: string) => void;
  setNegativePrompt: (negative: string) => void;
  setSelectedImageStyle: (style: string) => void;
  setImageAspectRatio: (ratio: ImageAspectRatio) => void;
  setImageModel: (model: ImageModel) => void;
  setBatchCount: (count: number) => void;
  setCfgScale: (cfg: number) => void;
  setSteps: (steps: number) => void;
  setSeed: (seed: number) => void;
  randomizeSeed: () => void;
  setActiveGeneratedImage: (img: GeneratedImage | null) => void;
  toggleFavoriteImage: (id: string) => void;
  enhanceImagePrompt: () => void;
  startImageGeneration: () => void | Promise<void>;
  upscaleImage: (id: string, factor: 2 | 4) => void | Promise<void>;
  cameraRig: CameraRigState;
  updateCameraRig: (updates: Partial<CameraRigState>) => void;
  applyCameraRigToPrompt: () => void;
  colorGrading: ColorGradingState;
  updateColorGrading: (updates: Partial<ColorGradingState>) => void;
  applyLutPreset: (presetName: string) => void;
  audioMixer: AudioMixerState;
  updateAudioMixer: (updates: Partial<AudioMixerState>) => void;
  toggleAudioSynth: () => void;
  nodeGraph: NodeGraphItem[];
  updateNodeGraphItem: (id: string, updates: Partial<NodeGraphItem>) => void;
  addNodeGraphItem: (item: Omit<NodeGraphItem, 'id'>) => void;
  connectNodes: (sourceId: string, targetId: string) => void;
}

// LocalStorage helpers
const loadStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`one_ai_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Error loading localStorage key', key, e);
    return fallback;
  }
};

const saveStorage = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(`one_ai_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving localStorage key', key, e);
  }
};

const calculateImageDimensions = (aspectRatio: ImageAspectRatio = '16:9'): { width: number; height: number; resolution: string } => {
  switch (aspectRatio) {
    case '1:1':
      return { width: 1024, height: 1024, resolution: '1024x1024' };
    case '9:16':
      return { width: 768, height: 1344, resolution: '768x1344' };
    case '4:5':
      return { width: 896, height: 1120, resolution: '896x1120' };
    case '21:9':
      return { width: 1536, height: 640, resolution: '1536x640' };
    case '16:9':
    default:
      return { width: 1344, height: 768, resolution: '1344x768' };
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation & UI
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  orbState: 'idle',
  setOrbState: (state) => set({ orbState: state }),
  isMotionPaused: false,
  toggleMotion: () => set((state) => ({ isMotionPaused: !state.isMotionPaused })),
  isSoundOn: false,
  toggleSound: () => {
    set((state) => {
      const nextSound = !state.isSoundOn;
      get().addToast({
        type: 'info',
        title: nextSound ? 'Sound Synthesizer Active' : 'Sound Muted',
        message: nextSound ? 'Ambient frequency feedback enabled.' : 'Audio synthesis muted.',
      });
      return { isSoundOn: nextSound };
    });
  },
  activeSection: '01',
  setActiveSection: (s) => set({ activeSection: s }),

  // User Authentication
  currentUser: loadStorage<AuthUser | null>('auth_user', null),
  authToken: loadStorage<string | null>('auth_token', null),
  authModalOpen: false,
  authModalMode: 'login',
  setAuthModalOpen: (open, mode = 'login') => set({ authModalOpen: open, authModalMode: mode }),
  login: (user, token) => {
    saveStorage('auth_user', user);
    saveStorage('auth_token', token);
    set((state) => ({
      currentUser: user,
      authToken: token,
      authModalOpen: false,
      settings: {
        ...state.settings,
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        bio: user.bio || state.settings.bio,
      },
    }));
    get().addToast({
      type: 'success',
      title: `Welcome, ${user.name}!`,
      message: 'You are now signed in to ONᵉ AI Studio.',
    });
  },
  logout: () => {
    localStorage.removeItem('one_ai_auth_user');
    localStorage.removeItem('one_ai_auth_token');
    set({ currentUser: null, authToken: null });
    get().addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out of your session.',
    });
  },
  demoLogin: () => {
    const demoUser: AuthUser = {
      id: 'usr-demo-1',
      name: 'Alex Vance',
      email: 'alex@onestudio.ai',
      handle: '@alex_creator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      bio: 'Visual director & digital artist crafting cinematic worlds with ONᵉ AI.',
      createdAt: new Date().toISOString(),
    };
    const demoToken = 'one_auth_demo_token_alex_vance';
    get().login(demoUser, demoToken);
  },

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast: Toast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Settings
  settings: loadStorage('settings', DEFAULT_SETTINGS),
  updateSettings: (updates) => {
    set((state) => {
      const updated = { ...state.settings, ...updates };
      saveStorage('settings', updated);
      return { settings: updated };
    });
    get().addToast({ type: 'success', title: 'Settings saved', message: 'Preferences updated successfully.' });
  },
  resetAllToFactoryDefaults: () => {
    localStorage.removeItem('one_ai_settings');
    localStorage.removeItem('one_ai_projects');
    localStorage.removeItem('one_ai_conversations');
    set({
      settings: DEFAULT_SETTINGS,
      projects: INITIAL_PROJECTS,
      conversations: INITIAL_CONVERSATIONS,
      activeConversationId: INITIAL_CONVERSATIONS[0].id,
      scenes: INITIAL_SCENES,
    });
    get().addToast({ type: 'info', title: 'Factory Reset', message: 'Restored default settings and sample projects.' });
  },

  // Creations & Projects
  projects: loadStorage('projects', INITIAL_PROJECTS),
  selectedProjectForPreview: null,
  setSelectedProjectForPreview: (project) => set({ selectedProjectForPreview: project }),
  toggleFavoriteProject: (id) => {
    set((state) => {
      const updated = state.projects.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      );
      saveStorage('projects', updated);
      const target = updated.find((p) => p.id === id);
      if (target?.isFavorite) {
        get().addToast({ type: 'success', title: 'Added to Favorites', message: target.title });
      }
      return { projects: updated };
    });
  },
  deleteProject: (id) => {
    set((state) => {
      const updated = state.projects.filter((p) => p.id !== id);
      saveStorage('projects', updated);
      return {
        projects: updated,
        selectedProjectForPreview: state.selectedProjectForPreview?.id === id ? null : state.selectedProjectForPreview,
      };
    });
    get().addToast({ type: 'info', title: 'Project Deleted' });
  },
  saveProject: (project) => {
    set((state) => {
      const exists = state.projects.some((p) => p.id === project.id);
      const updated = exists
        ? state.projects.map((p) => (p.id === project.id ? project : p))
        : [project, ...state.projects];
      saveStorage('projects', updated);
      return { projects: updated };
    });
  },

  // Chat
  conversations: loadStorage('conversations', INITIAL_CONVERSATIONS),
  activeConversationId: loadStorage('conversations', INITIAL_CONVERSATIONS)[0]?.id || 'conv-1',
  isAiTyping: false,
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  createConversation: (initialPrompt) => {
    const newId = 'conv-' + Date.now();
    const newConv: Conversation = {
      id: newId,
      title: initialPrompt ? initialPrompt.slice(0, 32) + (initialPrompt.length > 32 ? '...' : '') : 'New Cinematic Chat',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      messages: initialPrompt
        ? [
            {
              id: 'm-' + Date.now(),
              role: 'user',
              content: initialPrompt,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]
        : [
            {
              id: 'm-welcome',
              role: 'assistant',
              model: 'ONᵉ Omni-4 Cinema',
              content: `Welcome to **ONᵉ Creative Chat**.  
I am your generative director. What cinematic world or visual script are we crafting today?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
    };

    set((state) => {
      const updated = [newConv, ...state.conversations];
      saveStorage('conversations', updated);
      return { conversations: updated, activeConversationId: newId };
    });

    if (initialPrompt) {
      setTimeout(() => {
        get().sendMessage(initialPrompt, undefined, true);
      }, 300);
    }

    return newId;
  },
  deleteConversation: (id) => {
    set((state) => {
      const updated = state.conversations.filter((c) => c.id !== id);
      saveStorage('conversations', updated);
      const nextActive = updated.length > 0 ? updated[0].id : '';
      return { conversations: updated, activeConversationId: nextActive };
    });
    get().addToast({ type: 'info', title: 'Conversation deleted' });
  },
  renameConversation: (id, newTitle) => {
    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === id ? { ...c, title: newTitle, updatedAt: 'Just now' } : c
      );
      saveStorage('conversations', updated);
      return { conversations: updated };
    });
  },
  togglePinConversation: (id) => {
    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      );
      saveStorage('conversations', updated);
      return { conversations: updated };
    });
  },
  sendMessage: (content, attachments, isAutoContinuation = false) => {
    const { activeConversationId, conversations } = get();
    const conv = conversations.find((c) => c.id === activeConversationId);
    if (!conv) return;

    const userMsgId = 'msg-user-' + Date.now();
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments,
    };

    let updatedConv = {
      ...conv,
      messages: isAutoContinuation ? conv.messages : [...conv.messages, userMessage],
      updatedAt: 'Just now',
    };

    // Update conversation title if first user prompt
    if (conv.messages.filter((m) => m.role === 'user').length === 0) {
      updatedConv.title = content.slice(0, 35) + (content.length > 35 ? '...' : '');
    }

    set((state) => {
      const newConvs = state.conversations.map((c) => (c.id === conv.id ? updatedConv : c));
      saveStorage('conversations', newConvs);
      return { conversations: newConvs, isAiTyping: true, orbState: 'thinking' };
    });

    // Dual-Brain Execution Pipeline (Jev System 1 -> Inkling System 2)
    (async () => {
      try {
        const history = updatedConv.messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        }));

        const res = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, history }),
        });

        const data = await res.json();
        const aiMsgId = 'msg-ai-' + Date.now();

        let aiResponseText = data.response;
        if (!data.success && data.error) {
          aiResponseText = `⚠️ **Backend Pipeline Notice:** ${data.error}`;
        }

        const aiMessage: ChatMessage = {
          id: aiMsgId,
          role: 'assistant',
          model: data.model || 'Thinking Machines Inkling',
          content: aiResponseText || '(No response received)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          jevDecision: data.jevDecision,
          suggestedFollowUps: data.suggestedFollowUps || [],
          suggestedAction: {
            label: 'Send to Image Studio',
            actionType: 'open-studio',
            payload: content,
          },
        };

        set((state) => {
          const finalConvs = state.conversations.map((c) =>
            c.id === conv.id ? { ...c, messages: [...c.messages, aiMessage], updatedAt: 'Just now' } : c
          );
          saveStorage('conversations', finalConvs);
          return {
            conversations: finalConvs,
            isAiTyping: false,
            orbState: 'idle',
          };
        });
      } catch (err: any) {
        // Intelligent Client-Side AI Art Director Fallback
        const promptLower = content.toLowerCase();
        const baseTopic = content.trim().replace(/[.?!\n]+$/, '');
        const generatedPrompt = `${baseTopic}, 35mm anamorphic Arri Alexa 65 capture, cinematic volumetric lighting, shallow depth of field, 8K ultra-photorealism, intricate micro-textures, ray-traced reflections`;
        
        const fallbackMsg: ChatMessage = {
          id: 'msg-ai-art-' + Date.now(),
          role: 'assistant',
          model: 'ONᵉ Art Director Co-Pilot',
          jevDecision: {
            intent: 'prompt_engineering',
            complexity: 'moderate',
            confidence: 0.98,
            reasoningBudget: 'high',
            latencyMs: 48,
          },
          suggestedFollowUps: [
            'Can you suggest optimal lighting parameters?',
            'What negative prompts will remove artifacts?',
            'Can we switch to a 9:16 vertical aspect ratio?',
          ],
          content: `### 🎨 AI Art Director Recommendation: **"${baseTopic.slice(0, 45)}"**

I've engineered an optimized master image recipe designed for **ONᵉ Imagen-3 Ultra** and **Flux.1 Pro**:

\`\`\`yaml
Master Prompt:
  Prompt: "${generatedPrompt}"
  Negative: "blurry, low resolution, deformed anatomy, extra fingers, text watermark, jpeg artifacts, plastic look"
  Aspect Ratio: "16:9"
  Recommended Model: "ONᵉ Imagen-3 Ultra"
  CFG Scale: 7.5
  Sampling Steps: 35
\`\`\`

**Art Director Notes:**
- **Optics:** 35mm anamorphic focal length provides natural cinematic depth without fish-eye distortion.
- **Lighting:** Volumetric illumination delivers distinct highlights while preserving obsidian shadow details.
- Click **Send to Image Studio** below to synthesize this masterpiece immediately.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: {
            label: 'Send to Image Studio',
            actionType: 'open-studio',
            payload: generatedPrompt,
          },
        };

        set((state) => {
          const finalConvs = state.conversations.map((c) =>
            c.id === conv.id ? { ...c, messages: [...c.messages, fallbackMsg], updatedAt: 'Just now' } : c
          );
          saveStorage('conversations', finalConvs);
          return {
            conversations: finalConvs,
            isAiTyping: false,
            orbState: 'idle',
          };
        });
      }
    })();
  },
  regenerateLastMessage: () => {
    const { activeConversationId, conversations, sendMessage } = get();
    const conv = conversations.find((c) => c.id === activeConversationId);
    if (!conv || conv.messages.length < 2) return;

    const userMsgs = conv.messages.filter((m) => m.role === 'user');
    const lastUserMsg = userMsgs[userMsgs.length - 1];
    if (!lastUserMsg) return;

    // Remove last assistant message
    const trimmed = conv.messages.slice(0, -1);
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conv.id ? { ...c, messages: trimmed } : c
      ),
    }));

    // Trigger fresh generation with dual brain
    sendMessage(lastUserMsg.content, lastUserMsg.attachments, true);
  },

  // Text-to-Video Studio
  studioPrompt: 'A cybernetic traveler walking through a rain-soaked neon canyon in futuristic Tokyo, reflections of towering holographic billboards rippling on wet asphalt.',
  enhancedPrompt: '',
  selectedStyle: 'Cyberpunk Neon',
  aspectRatio: '16:9',
  duration: 12,
  resolution: '4K',
  cameraMotion: 'Slow Orbit',
  scenes: INITIAL_SCENES,
  isEnhancingPrompt: false,
  generationStatus: 'idle',
  generationProgress: 0,
  activeGeneratedVideo: null,

  setStudioPrompt: (prompt) => set({ studioPrompt: prompt }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
  setDuration: (duration) => set({ duration }),
  setResolution: (res) => set({ resolution: res }),
  setCameraMotion: (motion) => set({ cameraMotion: motion }),

  enhanceStudioPrompt: () => {
    set({ isEnhancingPrompt: true });
    get().addToast({ type: 'info', title: 'Thinking Machines Inkling', message: 'Enhancing prompt via Jev & Inkling pipeline...' });

    (async () => {
      const base = get().studioPrompt.trim() || 'Futuristic cybernetic city';
      try {
        const res = await fetch('http://localhost:5000/api/enhance-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: base }),
        });
        const data = await res.json();
        const enhanced = data.enhancedPrompt || base;

        set({
          enhancedPrompt: enhanced,
          studioPrompt: enhanced,
          isEnhancingPrompt: false,
        });
        get().addToast({
          type: 'success',
          title: 'Prompt Enhanced by Inkling!',
          message: `Jev Intent: ${data.jevDecision?.intent || 'creative'} (${data.executionTimeMs || 0}ms)`,
        });
      } catch (err: any) {
        // Fallback enhancement if backend offline
        const fallbackEnhanced = `Cinematic 8K master shot, hyper-detailed render of ${base}, dramatic volumetric atmospheric haze, anamorphic 35mm T1.3 lens, pristine golden amber highlights (#FFD600) reflecting on wet dark obsidian surfaces (#090909), Unreal Engine 5.4 Lumen global illumination, 60fps high shutter motion blur, photorealistic depth of field.`;
        set({
          enhancedPrompt: fallbackEnhanced,
          studioPrompt: fallbackEnhanced,
          isEnhancingPrompt: false,
        });
        get().addToast({ type: 'warning', title: 'Local Fallback Applied', message: 'Backend unreachable, generated local cinematic preset.' });
      }
    })();
  },

  generateStoryboardFromPrompt: (promptText) => {
    const prompt = promptText || get().studioPrompt;
    get().addToast({ type: 'info', title: 'Synthesizing Storyboard', message: 'Generating multi-camera breakdown...' });

    setTimeout(() => {
      const newScenes: Scene[] = [
        {
          id: 'scene-' + Date.now() + '-1',
          sceneNumber: 1,
          duration: 4,
          cameraMotion: 'Slow Orbit',
          prompt: `Establishing shot: ${prompt.slice(0, 90)}... wide panoramic framing with golden atmospheric haze.`,
          visualNotes: 'Golden hour rim lighting, volumetric fog particles, ambient depth of field',
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'scene-' + Date.now() + '-2',
          sceneNumber: 2,
          duration: 4,
          cameraMotion: 'Pan Right',
          prompt: `Mid-shot tracking: Focusing on core subject motion and dynamic lighting reflections.`,
          visualNotes: 'High shutter speed, crisp reflections on metallic and glossy textures',
          thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'scene-' + Date.now() + '-3',
          sceneNumber: 3,
          duration: 4,
          cameraMotion: 'Cinematic Crane Up',
          prompt: `Climactic upward crane shot pulling back to reveal breathtaking environment expanse.`,
          visualNotes: 'Sweeping majestic composition, cloud/skyline reveal, signature yellow glow',
          thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
        },
      ];
      set({ scenes: newScenes });
      get().addToast({ type: 'success', title: 'Storyboard Ready', message: 'Created 3 dynamic scenes with synchronized camera vectors.' });
    }, 700);
  },

  updateScene: (sceneId, updates) => {
    set((state) => ({
      scenes: state.scenes.map((s) => (s.id === sceneId ? { ...s, ...updates } : s)),
    }));
  },

  addScene: () => {
    const { scenes } = get();
    const newSceneNumber = scenes.length + 1;
    const newScene: Scene = {
      id: 'scene-custom-' + Date.now(),
      sceneNumber: newSceneNumber,
      duration: 3,
      cameraMotion: 'Pan Left',
      prompt: `Scene ${newSceneNumber}: Dynamic transition detailing environmental interaction.`,
      visualNotes: 'Seamless continuity, signature glowing accents',
      thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
    };
    set({ scenes: [...scenes, newScene] });
    get().addToast({ type: 'info', title: 'Scene Added', message: `Scene ${newSceneNumber} created in storyboard.` });
  },

  removeScene: (sceneId) => {
    const { scenes } = get();
    if (scenes.length <= 1) {
      get().addToast({ type: 'warning', title: 'Cannot remove', message: 'At least one scene is required in the storyboard.' });
      return;
    }
    const updated = scenes
      .filter((s) => s.id !== sceneId)
      .map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));
    set({ scenes: updated });
    get().addToast({ type: 'info', title: 'Scene Removed' });
  },

  startVideoGeneration: () => {
    const { studioPrompt, selectedStyle, aspectRatio, duration, resolution, scenes } = get();
    if (!studioPrompt.trim()) {
      get().addToast({ type: 'warning', title: 'Prompt Required', message: 'Please enter a prompt before generating.' });
      return;
    }

    set({
      generationStatus: 'analyzing',
      generationProgress: 10,
      orbState: 'generating',
    });

    get().addToast({ type: 'info', title: 'Generation Initiated', message: 'Analyzing prompt semantic tokens...' });

    // Multi-stage generation simulation:
    // Stage 1: analyzing (15%) -> Stage 2: storyboarding (38%) -> Stage 3: vectors (65%) -> Stage 4: rendering (88%) -> completed (100%)
    setTimeout(() => {
      if (get().generationStatus === 'idle') return;
      set({ generationStatus: 'storyboarding', generationProgress: 35 });
    }, 1200);

    setTimeout(() => {
      if (get().generationStatus === 'idle') return;
      set({ generationStatus: 'vectors', generationProgress: 65 });
    }, 2500);

    setTimeout(() => {
      if (get().generationStatus === 'idle') return;
      set({ generationStatus: 'rendering', generationProgress: 88 });
    }, 4000);

    setTimeout(() => {
      if (get().generationStatus === 'idle') return;
      const newProjectId = 'proj-' + Date.now();
      const newProject: VideoProject = {
        id: newProjectId,
        title: studioPrompt.slice(0, 36) + (studioPrompt.length > 36 ? '...' : ''),
        prompt: studioPrompt,
        style: selectedStyle,
        aspectRatio,
        duration,
        resolution,
        fps: 60,
        status: 'completed',
        progress: 100,
        thumbnail: scenes[0]?.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        createdAt: 'Just now',
        isFavorite: false,
        tags: [selectedStyle, `${resolution}`, `${duration}s`],
        scenes,
        viewsCount: 1,
        likesCount: 0,
      };

      set((state) => {
        const updatedProjects = [newProject, ...state.projects];
        saveStorage('projects', updatedProjects);
        return {
          generationStatus: 'completed',
          generationProgress: 100,
          orbState: 'idle',
          activeGeneratedVideo: newProject,
          projects: updatedProjects,
          settings: {
            ...state.settings,
            energyCredits: Math.max(0, state.settings.energyCredits - 50),
          },
        };
      });

      get().addToast({
        type: 'success',
        title: 'Video Generation Complete! 🎉',
        message: `Rendered "${newProject.title}" in ${resolution} 60fps.`,
      });
    }, 5500);
  },

  cancelGeneration: () => {
    set({
      generationStatus: 'idle',
      generationProgress: 0,
      orbState: 'idle',
    });
    get().addToast({ type: 'warning', title: 'Generation Cancelled' });
  },

  // Interactive Studio Modes & Extensions
  studioMode: 'split',
  setStudioMode: (mode) => {
    audioSynth.playClick(1400);
    set({ studioMode: mode });
  },

  cameraRig: INITIAL_CAMERA_RIG,
  updateCameraRig: (updates) => {
    if (get().audioMixer.sfxEnabled) audioSynth.playClick(900);
    set((state) => ({ cameraRig: { ...state.cameraRig, ...updates } }));
  },
  applyCameraRigToPrompt: () => {
    const { cameraRig, studioPrompt } = get();
    audioSynth.playWhoosh();
    const telemetryTag = `[Camera: ${cameraRig.fov}mm Prime, ${cameraRig.aperture}, Yaw ${cameraRig.yaw}°, Pitch ${cameraRig.pitch}°, Lighting: ${cameraRig.lightingColor} at ${cameraRig.lightingAngle}°]`;
    const cleanPrompt = studioPrompt.replace(/\[Camera:.*?\]/g, '').trim();
    const updated = cleanPrompt ? `${cleanPrompt} ${telemetryTag}` : telemetryTag;
    set({ studioPrompt: updated });
    get().addToast({
      type: 'success',
      title: '3D Vector Injected',
      message: `Synchronized ${cameraRig.fov}mm lens & lighting telemetry with prompt.`,
    });
  },

  colorGrading: INITIAL_COLOR_GRADING,
  updateColorGrading: (updates) => {
    set((state) => ({ colorGrading: { ...state.colorGrading, ...updates } }));
  },
  applyLutPreset: (presetName) => {
    audioSynth.playClick(1100);
    const presets: Record<string, Partial<ColorGradingState>> = {
      'Humanon Noir': { exposure: 0, contrast: 115, saturation: 85, temperature: -12, vignette: 40, grain: 25, bloom: 20 },
      'Cyberpunk 2077': { exposure: 5, contrast: 125, saturation: 145, temperature: -20, vignette: 45, grain: 30, bloom: 55 },
      'Dune Arrakis': { exposure: 10, contrast: 110, saturation: 110, temperature: 35, vignette: 30, grain: 40, bloom: 15 },
      'Solaris 70mm': { exposure: -5, contrast: 105, saturation: 90, temperature: 18, vignette: 50, grain: 45, bloom: 35 },
      'Matrix Phosphor': { exposure: 0, contrast: 130, saturation: 70, temperature: -35, vignette: 40, grain: 35, bloom: 30 },
    };
    const chosen = presets[presetName] || presets['Humanon Noir'];
    set((state) => ({
      colorGrading: {
        ...state.colorGrading,
        ...chosen,
        preset: presetName,
        lutName: presetName,
      },
    }));
    get().addToast({
      type: 'info',
      title: `LUT Applied: ${presetName}`,
      message: 'Color grading look synchronized with video monitor.',
    });
  },

  audioMixer: INITIAL_AUDIO_MIXER,
  updateAudioMixer: (updates) => {
    set((state) => {
      const next = { ...state.audioMixer, ...updates };
      audioSynth.setVolumes(next.masterVolume, next.droneVolume, next.shimmerVolume, next.atmosphereVolume);
      audioSynth.setSfxEnabled(next.sfxEnabled);
      return { audioMixer: next };
    });
  },
  toggleAudioSynth: () => {
    const isCurrentlyPlaying = get().audioMixer.isPlayingSynth;
    if (isCurrentlyPlaying) {
      audioSynth.stopAtmosphere();
      set((state) => ({ audioMixer: { ...state.audioMixer, isPlayingSynth: false } }));
      get().addToast({ type: 'info', title: 'Synthesizer Paused', message: 'Atmospheric audio stems paused.' });
    } else {
      audioSynth.startAtmosphere();
      const { audioMixer } = get();
      audioSynth.setVolumes(audioMixer.masterVolume, audioMixer.droneVolume, audioMixer.shimmerVolume, audioMixer.atmosphereVolume);
      audioSynth.setSfxEnabled(audioMixer.sfxEnabled);
      set((state) => ({ audioMixer: { ...state.audioMixer, isPlayingSynth: true } }));
      get().addToast({
        type: 'success',
        title: 'Synthesizer Active',
        message: 'Procedural 40Hz sub-drone & ambient chord stems live.',
      });
    }
  },

  nodeGraph: INITIAL_NODE_GRAPH,
  updateNodeGraphItem: (id, updates) => {
    set((state) => ({
      nodeGraph: state.nodeGraph.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  },
  addNodeGraphItem: (item) => {
    audioSynth.playClick(1300);
    const id = 'node-' + Date.now();
    const newItem: NodeGraphItem = { ...item, id };
    set((state) => ({ nodeGraph: [...state.nodeGraph, newItem] }));
    get().addToast({ type: 'success', title: 'Node Added', message: `Added "${newItem.title}" to creative board.` });
  },
  connectNodes: (sourceId, targetId) => {
    audioSynth.playClick(1000);
    set((state) => ({
      nodeGraph: state.nodeGraph.map((item) => {
        if (item.id === sourceId && !item.connectedTo.includes(targetId)) {
          return { ...item, connectedTo: [...item.connectedTo, targetId] };
        }
        return item;
      }),
    }));
  },

  // Text-to-Image Generation Studio
  imagePrompt: 'Atmospheric courier standing in torrential rain in Neo-Shinjuku 2099, reflection of amber holographic kanji on wet obsidian pavement, 35mm anamorphic lens, 8K.',
  negativePrompt: 'blurry, oversaturated, deformed hands, low resolution, bad anatomy',
  selectedImageStyle: 'Cyberpunk Concept',
  imageAspectRatio: '16:9',
  imageModel: 'ONᵉ Imagen-3 Ultra',
  batchCount: 4,
  cfgScale: 7.5,
  steps: 35,
  seed: 849204,
  isGeneratingImages: false,
  generatedImages: loadStorage('generated_images', INITIAL_GENERATED_IMAGES),
  activeGeneratedImage: INITIAL_GENERATED_IMAGES[0],
  isUpscaling: false,

  setImagePrompt: (prompt) => set({ imagePrompt: prompt }),
  setNegativePrompt: (negative) => set({ negativePrompt: negative }),
  setSelectedImageStyle: (style) => {
    audioSynth.playClick(1100);
    set({ selectedImageStyle: style });
  },
  setImageAspectRatio: (ratio) => {
    audioSynth.playClick(1200);
    set({ imageAspectRatio: ratio });
  },
  setImageModel: (model) => {
    audioSynth.playClick(1000);
    set({ imageModel: model });
  },
  setBatchCount: (count) => {
    audioSynth.playClick(1300);
    set({ batchCount: count });
  },
  setCfgScale: (cfg) => set({ cfgScale: cfg }),
  setSteps: (steps) => set({ steps }),
  setSeed: (seed) => set({ seed }),
  randomizeSeed: () => {
    audioSynth.playClick(1400);
    const newSeed = Math.floor(Math.random() * 999999);
    set({ seed: newSeed });
    get().addToast({ type: 'info', title: 'New Seed Rolled', message: `Seed locked: ${newSeed}` });
  },
  setActiveGeneratedImage: (img) => {
    if (img) audioSynth.playClick(900);
    set({ activeGeneratedImage: img });
  },
  toggleFavoriteImage: (id) => {
    audioSynth.playClick(1000);
    set((state) => {
      const updated = state.generatedImages.map((img) =>
        img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
      );
      saveStorage('generated_images', updated);
      const active = state.activeGeneratedImage?.id === id
        ? { ...state.activeGeneratedImage, isFavorite: !state.activeGeneratedImage.isFavorite }
        : state.activeGeneratedImage;
      return { generatedImages: updated, activeGeneratedImage: active };
    });
  },
  enhanceImagePrompt: () => {
    const { imagePrompt, selectedImageStyle } = get();
    if (!imagePrompt.trim()) {
      get().addToast({ type: 'warning', title: 'Enter a prompt first' });
      return;
    }
    audioSynth.playWhoosh();
    get().addToast({ type: 'info', title: 'Enhancing Prompt', message: 'Synthesizing optical tags & master lighting...' });

    setTimeout(() => {
      const enhanced = `Masterpiece 8K resolution, ${imagePrompt.trim()}, styled in ${selectedImageStyle}, extreme dynamic range, chiaroscuro lighting with amber specular highlights (#E5A866), shot on Hasselblad H6D-100c, 35mm f/1.4 lens, Unreal Engine 5.4 Lumen render.`;
      set({ imagePrompt: enhanced });
      get().addToast({ type: 'success', title: 'Prompt Enhanced', message: 'Injected photoreal master tokens.' });
    }, 500);
  },
  startImageGeneration: async () => {
    const { imagePrompt, negativePrompt, selectedImageStyle, imageAspectRatio, imageModel, batchCount, cfgScale, steps, seed } = get();
    if (!imagePrompt.trim()) {
      get().addToast({ type: 'warning', title: 'Prompt required' });
      return;
    }

    audioSynth.playWhoosh();
    set({ isGeneratingImages: true, orbState: 'generating' });
    get().addToast({
      type: 'info',
      title: 'Synthesizing Images',
      message: `Dispatching to Flux.1 Neural Engine (${batchCount} ${batchCount > 1 ? 'images' : 'image'})...`,
    });

    const { width, height, resolution } = calculateImageDimensions(imageAspectRatio);
    const baseSeed = seed && seed > 0 ? seed : Math.floor(Math.random() * 899999) + 100000;

    let enrichedPrompt = imagePrompt.trim();
    if (selectedImageStyle && !enrichedPrompt.toLowerCase().includes(selectedImageStyle.toLowerCase())) {
      enrichedPrompt = `${enrichedPrompt}, ${selectedImageStyle} style, photorealistic 8K UHD, volumetric optical lighting, sharp focus`;
    }

    let generatedResults: GeneratedImage[] = [];

    // 1. Attempt generation through backend API (http://localhost:5000/api/generate-image)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('http://localhost:5000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: enrichedPrompt,
          negativePrompt,
          aspectRatio: imageAspectRatio,
          style: selectedImageStyle,
          seed: baseSeed,
          batchCount,
          model: imageModel,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          generatedResults = data.images.map((img: any) => ({
            id: img.id || `img-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            prompt: img.prompt || enrichedPrompt,
            negativePrompt: img.negativePrompt || negativePrompt,
            url: img.url,
            aspectRatio: img.aspectRatio || imageAspectRatio,
            resolution: img.resolution || resolution,
            style: img.style || selectedImageStyle,
            model: (img.model as ImageModel) || imageModel,
            seed: img.seed || baseSeed,
            cfgScale,
            steps,
            createdAt: 'Just now',
            isFavorite: false,
          }));
        }
      }
    } catch {
      // Backend offline or unreachable: fall through to direct Flux.1 inference engine
    }

    // 2. Direct Flux.1 Fallback Pipeline (Black Forest Labs Flux.1)
    if (generatedResults.length === 0) {
      const count = Math.min(4, Math.max(1, batchCount || 1));
      for (let i = 0; i < count; i++) {
        const currentSeed = baseSeed + i * 37;
        const encodedPrompt = encodeURIComponent(enrichedPrompt);
        const fluxUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&seed=${currentSeed}&nologo=true`;

        generatedResults.push({
          id: `img-flux-${Date.now()}-${i}-${currentSeed}`,
          prompt: enrichedPrompt,
          negativePrompt: negativePrompt || 'blurry, low quality, deformed anatomy, extra fingers, text watermark, jpeg artifacts, plastic look',
          url: fluxUrl,
          aspectRatio: imageAspectRatio,
          resolution,
          style: selectedImageStyle,
          model: imageModel || 'Flux.1 Pro Precision',
          seed: currentSeed,
          cfgScale,
          steps,
          createdAt: 'Just now',
          isFavorite: false,
        });
      }
    }

    // Preload primary image to ensure seamless visual reveal
    try {
      const primaryImg = new Image();
      primaryImg.src = generatedResults[0].url;
      await new Promise((resolve) => {
        primaryImg.onload = resolve;
        primaryImg.onerror = resolve;
        setTimeout(resolve, 3500); // 3.5s max wait before showing UI
      });
    } catch {
      // Ignore preload errors
    }

    set((state) => {
      const updated = [...generatedResults, ...state.generatedImages];
      saveStorage('generated_images', updated);
      return {
        isGeneratingImages: false,
        orbState: 'idle',
        generatedImages: updated,
        activeGeneratedImage: generatedResults[0],
        settings: {
          ...state.settings,
          energyCredits: Math.max(0, state.settings.energyCredits - batchCount * 5),
        },
      };
    });

    audioSynth.playNotification();
    get().addToast({
      type: 'success',
      title: 'Flux.1 Synthesis Complete ✨',
      message: `Rendered ${generatedResults.length} photorealistic ${resolution} output(s) using Black Forest Labs Flux.1.`,
    });
  },
  upscaleImage: (id, factor) => {
    audioSynth.playWhoosh();
    set({ isUpscaling: true });
    get().addToast({
      type: 'info',
      title: `Upscaling ${factor}x`,
      message: 'Synthesizing high-frequency neural sub-pixels with 4K reconstruction...',
    });

    const targetImg = get().generatedImages.find((img) => img.id === id);
    const targetUrl = targetImg ? targetImg.url : '';

    let newResolution = factor === 4 ? '3840x2160 (4K UHD Master)' : '2560x1440 (2K Enhanced)';
    let upscaledUrl = targetUrl;

    if (targetUrl.includes('image.pollinations.ai')) {
      try {
        const urlObj = new URL(targetUrl);
        const currentWidth = parseInt(urlObj.searchParams.get('width') || '1024', 10);
        const currentHeight = parseInt(urlObj.searchParams.get('height') || '1024', 10);
        const newWidth = Math.min(2048, currentWidth * factor);
        const newHeight = Math.min(2048, currentHeight * factor);
        urlObj.searchParams.set('width', newWidth.toString());
        urlObj.searchParams.set('height', newHeight.toString());
        upscaledUrl = urlObj.toString();
        newResolution = `${newWidth}x${newHeight} (${factor === 4 ? '4K Neural Master' : '2K Enhanced'})`;
      } catch {
        // Keep upscaledUrl
      }
    }

    setTimeout(() => {
      set((state) => {
        const updated = state.generatedImages.map((img) =>
          img.id === id ? { ...img, upscaled: true, resolution: newResolution, url: upscaledUrl } : img
        );
        saveStorage('generated_images', updated);
        const active = state.activeGeneratedImage?.id === id
          ? { ...state.activeGeneratedImage, upscaled: true, resolution: newResolution, url: upscaledUrl }
          : state.activeGeneratedImage;
        return { isUpscaling: false, generatedImages: updated, activeGeneratedImage: active };
      });

      audioSynth.playNotification();
      get().addToast({
        type: 'success',
        title: `Upscale Complete (${factor}x)`,
        message: 'Enhanced resolution with sharp micro-edge reconstruction.',
      });
    }, 1200);
  },
}));
