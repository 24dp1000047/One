import React from 'react';
import { PromptEditor } from '../components/video/PromptEditor';
import { StudioControls } from '../components/video/StudioControls';
import { VideoPreviewPlayer } from '../components/video/VideoPreviewPlayer';
import { GenerationStatusOverlay } from '../components/video/GenerationStatusOverlay';
import { StoryboardEditor } from '../components/video/StoryboardEditor';
import { TimelineView } from '../components/video/TimelineView';
import { Sparkles, SlidersHorizontal, Layers, Film } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const CreateVideo: React.FC = () => {
  const activeGeneratedVideo = useAppStore((state) => state.activeGeneratedVideo);
  const generationStatus = useAppStore((state) => state.generationStatus);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1f1f1f]">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-yellow" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display">
              Text-to-Video Studio
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange border border-brand-orange/30 font-semibold">
              Split-Screen Director
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Compose high-velocity prompts, calibrate optical vectors, and render 60fps cinematic sequences.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Lumen 4K Render Engine Active</span>
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
          {/* Generation Progress Overlay (appears during active generation) */}
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
