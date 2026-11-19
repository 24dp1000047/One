import React, { useState } from 'react';
import { 
  Film, 
  Compass, 
  Volume2, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Clock, 
  Scissors 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TimelineView: React.FC = () => {
  const scenes = useAppStore((state) => state.scenes);
  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 0), 0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [playheadPos, setPlayheadPos] = useState(30); // percentage

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.75, z - 0.25));

  return (
    <div className="space-y-3 rounded-2xl bg-[#121212] border border-[#242424] p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-brand-orange" />
          <h3 className="text-xs font-semibold text-white tracking-wide">Multi-Track Director Timeline</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1c1c] text-muted border border-[#2b2b2b]">
            60 FPS Master
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#181818] border border-[#262626] rounded-lg p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 text-muted hover:text-white rounded hover:bg-white/5"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono px-1 text-zinc-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-muted hover:text-white rounded hover:bg-white/5"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Ruler & Tracks Area */}
      <div className="overflow-x-auto pb-2">
        <div 
          className="relative min-w-[600px] space-y-2 select-none"
          style={{ width: `${100 * zoomLevel}%` }}
        >
          {/* Timecode Ruler */}
          <div className="h-6 flex items-center justify-between border-b border-[#222222] text-[10px] font-mono text-zinc-500 px-2">
            <span>00:00</span>
            <span>00:02</span>
            <span>00:04</span>
            <span>00:06</span>
            <span>00:08</span>
            <span>00:10</span>
            <span>00:12</span>
            <span>00:15</span>
          </div>

          {/* Interactive Playhead Needle */}
          <div
            className="absolute top-0 bottom-0 z-30 w-0.5 bg-brand-yellow pointer-events-none transition-all shadow-glow-yellow-sm"
            style={{ left: `${playheadPos}%` }}
          >
            <div className="w-2.5 h-2.5 -ml-1 bg-brand-yellow rounded-full shadow-glow-yellow" />
          </div>

          {/* Track 1: Video Track */}
          <div className="flex items-center gap-2">
            <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <Film className="w-3 h-3 text-brand-yellow" />
              <span>Video</span>
            </div>

            <div className="flex-1 flex gap-1 h-14 bg-[#0a0a0a] rounded-xl p-1 border border-[#222222]">
              {scenes.map((scene) => {
                const widthPercent = totalDuration > 0 ? (scene.duration / totalDuration) * 100 : 33;
                return (
                  <div
                    key={scene.id}
                    className="relative rounded-lg overflow-hidden border border-brand-yellow/30 bg-[#161616] group cursor-pointer hover:border-brand-yellow transition-all"
                    style={{ width: `${widthPercent}%` }}
                    onClick={() => setPlayheadPos(widthPercent * 0.5)}
                  >
                    <img
                      src={scene.thumbnail}
                      alt={scene.prompt}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-1.5 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-white font-mono">
                        S{scene.sceneNumber} • {scene.duration}s
                      </span>
                      <span className="text-[9px] text-zinc-300 truncate">
                        {scene.cameraMotion}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Track 2: Camera Motion Vectors */}
          <div className="flex items-center gap-2">
            <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <Compass className="w-3 h-3 text-brand-orange" />
              <span>Motion</span>
            </div>

            <div className="flex-1 flex gap-1 h-8 bg-[#0a0a0a] rounded-xl p-1 border border-[#222222]">
              {scenes.map((scene) => {
                const widthPercent = totalDuration > 0 ? (scene.duration / totalDuration) * 100 : 33;
                return (
                  <div
                    key={scene.id}
                    className="rounded-lg bg-brand-orange/15 border border-brand-orange/30 px-2 flex items-center justify-between text-[10px] font-mono text-brand-orange truncate"
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span>{scene.cameraMotion}</span>
                    <span className="opacity-70">curve: easeInOut</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Track 3: Audio Ambience */}
          <div className="flex items-center gap-2">
            <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <Volume2 className="w-3 h-3 text-sky-400" />
              <span>Audio</span>
            </div>

            <div className="flex-1 h-8 bg-[#0a0a0a] rounded-xl p-1 border border-[#222222] flex items-center justify-between px-3 text-[10px] font-mono text-sky-400/80">
              <div className="flex items-center gap-1 w-full overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 bg-sky-400/40 rounded-full"
                    style={{ height: `${8 + ((i * 7) % 18)}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
