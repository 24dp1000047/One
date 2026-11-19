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
