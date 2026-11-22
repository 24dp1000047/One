export type AspectRatio = '16:9' | '9:16' | '1:1' | '21:9';
export type Resolution = '720p' | '1080p' | '4K';
export type CameraMotion = 'Static' | 'Pan Right' | 'Pan Left' | 'Slow Orbit' | 'FPV Drone Dive' | 'Cinematic Crane Up' | 'Hyperlapse Zoom';

export interface Scene {
  id: string;
  sceneNumber: number;
  duration: number; // in seconds
  cameraMotion: CameraMotion;
  prompt: string;
  visualNotes: string;
  thumbnail: string;
}

export interface VideoProject {
  id: string;
  title: string;
  prompt: string;
  enhancedPrompt?: string;
  style: string;
  aspectRatio: AspectRatio;
  duration: number; // total in seconds
  resolution: Resolution;
  fps: number;
  status: 'idle' | 'generating' | 'completed' | 'draft';
  progress: number;
  currentStage?: string;
  thumbnail: string;
  videoUrl?: string;
  scenes: Scene[];
  createdAt: string;
  isFavorite: boolean;
  tags: string[];
  viewsCount?: number;
  likesCount?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  isStreaming?: boolean;
  suggestedAction?: {
    label: string;
    actionType: 'open-studio' | 'copy' | 'enhance';
    payload?: string;
  };
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
  jevDecision?: {
    engine?: string;
    intent: string;
    complexity: string;
    confidence: number;
    reasoningBudget: string;
    latencyMs: number;
    primitiveType?: 'noul' | 'choice' | 'classifier';
    noulResult?: {
      question: string;
      subject: string;
      category: string;
      truthScorePercent: number;
      verdict: string;
      confidence: number;
      criteria: string;
    };
    choiceResult?: {
      question: string;
      options: { label: string; probabilityPercent: number }[];
      winningChoice: string;
      confidence: number;
      condition?: string;
    };
    stateExplanation?: string;
  };
  suggestedFollowUps?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

export interface UserSettings {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  accentColor: 'yellow' | 'orange';
  themeMode: 'dark' | 'oled';
  soundEnabled: boolean;
  highQualityPreview: boolean;
  defaultAspectRatio: AspectRatio;
  defaultResolution: Resolution;
  defaultDuration: number;
  energyCredits: number;
  apiTokens: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export interface InspirationItem {
  id: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
    handle: string;
  };
  prompt: string;
  style: string;
  aspectRatio: AspectRatio;
  duration: string;
  likes: number;
  views: number;
  thumbnail: string;
  videoPreview: string;
  category: 'Sci-Fi' | 'Anime' | 'Cinematic' | 'Surreal' | 'Commercial' | 'Abstract';
  isLiked?: boolean;
}

export type OrbState = 'idle' | 'thinking' | 'generating';

export type StudioViewMode = 'split' | 'director3d' | 'nodes' | 'colorSound';

export interface CameraRigState {
  pitch: number;
  yaw: number;
  distance: number;
  fov: number; // 18 to 135
  aperture: string; // 'f/1.4', 'f/2.8', etc.
  lightingAngle: number; // 0 to 360
  lightingColor: string; // hex
  lightingIntensity: number; // 0.5 to 3.0
  cameraMode: 'Orbit' | 'Crane' | 'Drone' | 'DollyZoom' | 'Handheld';
  motionCurve: 'linear' | 'ease-in-out' | 'cinematic-s' | 'whip-snap';
}

export interface ColorGradingState {
  preset: string;
  exposure: number; // -50 to +50
  contrast: number; // 50 to 150
  saturation: number; // 0 to 200
  temperature: number; // -50 to +50 (cool to warm)
  vignette: number; // 0 to 100
  grain: number; // 0 to 100
  bloom: number; // 0 to 100
  lutName: string;
}

export interface AudioMixerState {
  isPlayingSynth: boolean;
  masterVolume: number; // 0 to 100
  droneVolume: number; // 0 to 100
  shimmerVolume: number; // 0 to 100
  atmosphereVolume: number; // 0 to 100
  sfxEnabled: boolean;
  tempoBpm: number;
}

export interface NodeGraphItem {
  id: string;
  type: 'vision' | 'scene' | 'camera' | 'audio' | 'lut';
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  connectedTo: string[];
  thumbnail?: string;
  data: Record<string, any>;
}

// --- Text-to-Image Generation Types ---
export type ImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '21:9';
export type ImageModel = 'ONᵉ Imagen-3 Ultra' | 'Flux.1 Pro Precision' | 'Midjourney v6.1 Matrix' | 'SDXL Turbo 8K';

export interface GeneratedImage {
  id: string;
  prompt: string;
  negativePrompt?: string;
  url: string;
  aspectRatio: ImageAspectRatio;
  resolution: string;
  style: string;
  model: ImageModel;
  seed: number;
  cfgScale: number;
  steps: number;
  createdAt: string;
  isFavorite?: boolean;
  upscaled?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  bio?: string;
  createdAt: string;
}
