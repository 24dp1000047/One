import React from 'react';
import { PromptEditor } from '../components/video/PromptEditor';
import { StudioControls } from '../components/video/StudioControls';
import { VideoPreviewPlayer } from '../components/video/VideoPreviewPlayer';
import { GenerationStatusOverlay } from '../components/video/GenerationStatusOverlay';
import { StoryboardEditor } from '../components/video/StoryboardEditor';
import { TimelineView } from '../components/video/TimelineView';
import { Director3DViewport } from '../components/video/Director3DViewport';
import { SpatialNodeCanvas } from '../components/video/SpatialNodeCanvas';
import { ColorGradingSuite } from '../components/video/ColorGradingSuite';
import { SoundDesignStudio } from '../components/video/SoundDesignStudio';
import { useAppStore } from '../store/useAppStore';
import { StudioViewMode } from '../types';
import { 
  Sliders, 
  Move3d, 
  Layers, 
  Palette, 
  Radio, 
  Sparkles, 
  Film, 
  ArrowUpRight 
} from 'lucide-react';

export const CreateVideo: React.FC = () => {
  const activeGeneratedVideo = useAppStore((state) => state.activeGeneratedVideo);
  const generationStatus = useAppStore((state) => state.generationStatus);
  const studioMode = useAppStore((state) => state.studioMode);
  const setStudioMode = useAppStore((state) => state.setStudioMode);

  const tabs: { id: StudioViewMode; label: string; icon: any; badge?: string }[] = [
    { id: 'split', label: 'Split Studio', icon: Sliders },
    { id: 'director3d', label: '3D Director Rig', icon: Move3d, badge: 'Three.js' },
    { id: 'nodes', label: 'Spatial Canvas', icon: Layers, badge: 'Flow' },
    { id: 'colorSound', label: 'Color & Sound Lab', icon: Palette, badge: 'Audio' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#141822]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#A5C4F2] font-semibold">02 //</span>
            <span className="text-zinc-500 uppercase tracking-widest">MULTIMODAL SYNTHESIS SUITE</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
              V4.2 SPATIAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight mt-1">
            Director's Creative Studio
          </h1>
          <p className="text-xs text-[#8A94A6] mt-1 font-light">
            Compose prompts, calibrate 3D camera vectors in Three.js, map spatial node stories, and grade live color & procedural audio stems.
          </p>
        </div>

        {/* Interactive Mode Switcher Tabs */}
        <div className="flex flex-wrap items-center p-1 rounded-xl bg-[#07090F] border border-[#181C26]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = studioMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStudioMode(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-white shadow-md border border-white/10 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E5A866]' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-[#E5A866]/20 text-[#E5A866]' : 'bg-white/5 text-zinc-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MODE 1: SPLIT STUDIO VIEW */}
      {studioMode === 'split' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Prompt & Controls */}
            <div className="lg:col-span-7 space-y-5">
              <PromptEditor />
              <StudioControls />
            </div>

            {/* Right Column: Generation Status & Video Preview */}
            <div className="lg:col-span-5 space-y-5 sticky top-20">
              {generationStatus !== 'idle' && <GenerationStatusOverlay />}
              <VideoPreviewPlayer posterUrl={activeGeneratedVideo?.thumbnail} />
            </div>
          </div>

          {/* Storyboard with Editable Scene Cards */}
          <div className="pt-2">
            <StoryboardEditor />
          </div>

          {/* Multi-Track Timeline */}
          <div className="pt-2">
            <TimelineView />
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE 3D VIRTUAL DIRECTOR RIG */}
      {studioMode === 'director3d' && (
        <div className="space-y-6">
          <Director3DViewport />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <PromptEditor />
            </div>
            <div className="lg:col-span-6">
              <VideoPreviewPlayer posterUrl={activeGeneratedVideo?.thumbnail} />
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: SPATIAL STORYBOARD NODE CANVAS */}
      {studioMode === 'nodes' && (
        <div className="space-y-6">
          <SpatialNodeCanvas />
          <TimelineView />
        </div>
      )}

      {/* MODE 4: COLOR GRADING & PROCEDURAL SOUND LAB */}
      {studioMode === 'colorSound' && (
        <div className="space-y-6">
          <ColorGradingSuite />
          <SoundDesignStudio />
        </div>
      )}
    </div>
  );
};
