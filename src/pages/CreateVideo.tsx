import React from 'react';
import { PromptEditor } from '../components/video/PromptEditor';
import { StudioControls } from '../components/video/StudioControls';
import { VideoPreviewPlayer } from '../components/video/VideoPreviewPlayer';
import { GenerationStatusOverlay } from '../components/video/GenerationStatusOverlay';
import { StoryboardEditor } from '../components/video/StoryboardEditor';
import { TimelineView } from '../components/video/TimelineView';
import { useAppStore } from '../store/useAppStore';

export const CreateVideo: React.FC = () => {
  const activeGeneratedVideo = useAppStore((state) => state.activeGeneratedVideo);
  const generationStatus = useAppStore((state) => state.generationStatus);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Studio Header (Humanon style) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#141822]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#A5C4F2] font-semibold">02 //</span>
            <span className="text-zinc-500 uppercase tracking-widest">SYNTHESIS ENGINE</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
              V4.0.9 LUMEN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight mt-1">
            Text-to-Video Studio
          </h1>
          <p className="text-xs text-[#8A94A6] mt-1 font-light">
            Compose high-velocity prompts, calibrate optical vectors, and render 60fps cinematic sequences.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>4K LUMEN CORE ACTIVE</span>
        </div>
      </div>

      {/* Split-Screen Studio Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prompt & Controls (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          <PromptEditor />
          <StudioControls />
        </div>

        {/* Right Column: Generation Status & Video Preview (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5 sticky top-20">
          {/* Generation Progress Overlay */}
          {generationStatus !== 'idle' && <GenerationStatusOverlay />}

          {/* Interactive Video Player */}
          <VideoPreviewPlayer posterUrl={activeGeneratedVideo?.thumbnail} />
        </div>
      </div>

      {/* Bottom Section 1: Storyboard with Editable Scene Cards */}
      <div className="pt-2">
        <StoryboardEditor />
      </div>

      {/* Bottom Section 2: Multi-Track Timeline */}
      <div className="pt-2">
        <TimelineView />
      </div>
    </div>
  );
};
