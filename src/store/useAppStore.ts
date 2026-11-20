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
  ChatMessage 
} from '../types';
import { INITIAL_CONVERSATIONS, INITIAL_PROJECTS, VIDEO_STYLES } from '../data/mockData';

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Alex Vance',
  handle: '@alex_creator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: 'Visual director & digital artist crafting cinematic worlds with ONe AI.',
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
              model: 'ONe Omni-4 Cinema',
              content: `Welcome to **ONe Creative Chat**.  
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

    // Simulate AI thinking & response
    setTimeout(() => {
      const aiMsgId = 'msg-ai-' + Date.now();
      const mockAnswers = [
        `Here is an optimized storyboard concept derived from your prompt:

### Scene Analysis:
1. **Dynamic Lighting:** High contrast illumination using warm amber (#FFD600) rim highlights on dark obsidian architecture.
2. **Atmospheric Depth:** Layered ground fog and micro-particle dispersion.
3. **Pacing:** Begins with a 3.5-second contemplative establishing dolly, transitioning into a dynamic 4-second action tracking shot.

Would you like me to push this directly into your **Text-to-Video Studio**?`,
        `Fascinating visual direction! To capture that exact cinematic essence, I recommend adding:  
- **Lens:** Anamorphic 35mm T1.5  
- **Shutter:** 180° cinematic blur  
- **Palette:** Obsidian black (#090909) with neon canary yellow (#FFD600) accents.  

You can also test prompt variations in the **Creative Playground**.`,
        `Analyzing shot composition...  
The prompt will produce an ultra-crisp photorealistic rendering with volumetric god rays and fluid particle motion. I've formulated a 3-scene camera plan for this sequence.`,
      ];

      const chosenResponse = mockAnswers[Math.floor(Math.random() * mockAnswers.length)];

      const aiMessage: ChatMessage = {
        id: aiMsgId,
        role: 'assistant',
        model: 'ONe Omni-4 Cinema',
        content: chosenResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          label: 'Send to Video Studio',
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
    }, 1200);
  },
  regenerateLastMessage: () => {
    const { activeConversationId, conversations } = get();
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
      isAiTyping: true,
      orbState: 'thinking',
    }));

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: 'msg-regen-' + Date.now(),
        role: 'assistant',
        model: 'ONe Omni-4 Cinema',
        content: `*Regenerated perspective:*\n\nHere is an alternative high-velocity camera treatment. Let's switch from a static wide view into an FPV drone dive traveling at 60mph between glowing architectural arches. Volumetric light beams scatter at 45° angles.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          label: 'Send to Video Studio',
          actionType: 'open-studio',
          payload: lastUserMsg.content,
        },
      };

      set((state) => {
        const finalConvs = state.conversations.map((c) =>
          c.id === conv.id ? { ...c, messages: [...c.messages, aiMessage] } : c
        );
        saveStorage('conversations', finalConvs);
        return {
          conversations: finalConvs,
          isAiTyping: false,
          orbState: 'idle',
        };
      });
    }, 1100);
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
    get().addToast({ type: 'info', title: 'Magic Enhancer', message: 'Synthesizing cinematic 8K master prompt...' });

    setTimeout(() => {
      const base = get().studioPrompt.trim() || 'Futuristic cybernetic city';
      const enhanced = `Cinematic 8K master shot, hyper-detailed render of ${base}, dramatic volumetric atmospheric haze, anamorphic 35mm T1.3 lens, pristine golden amber highlights (#FFD600) reflecting on wet dark obsidian surfaces (#090909), Unreal Engine 5.4 Lumen global illumination, 60fps high shutter motion blur, photorealistic depth of field.`;
      set({
        enhancedPrompt: enhanced,
        studioPrompt: enhanced,
        isEnhancingPrompt: false,
      });
      get().addToast({ type: 'success', title: 'Prompt Enhanced!', message: 'Cinematic camera and lighting descriptors added.' });
    }, 900);
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
}));
