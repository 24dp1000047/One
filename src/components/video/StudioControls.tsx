import React from 'react';
import { 
  Ratio, 
  Clock, 
  Tv, 
  Compass, 
  Zap, 
  Sparkles, 
  Film 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AspectRatio, Resolution, CameraMotion } from '../../types';

export const StudioControls: React.FC = () => {
  const aspectRatio = useAppStore((state) => state.aspectRatio);
  const setAspectRatio = useAppStore((state) => state.setAspectRatio);
  const duration = useAppStore((state) => state.duration);
  const setDuration = useAppStore((state) => state.setDuration);
  const resolution = useAppStore((state) => state.resolution);
  const setResolution = useAppStore((state) => state.setResolution);
  const cameraMotion = useAppStore((state) => state.cameraMotion);
  const setCameraMotion = useAppStore((state) => state.setCameraMotion);
  const generationStatus = useAppStore((state) => state.generationStatus);
  const startGeneration = useAppStore((state) => state.startVideoGeneration);

  const isGenerating = generationStatus !== 'idle' && generationStatus !== 'completed';

  const ratios: { label: AspectRatio; desc: string; iconW: string; iconH: string }[] = [
    { label: '16:9', desc: 'Landscape', iconW: 'w-4', iconH: 'h-2.5' },
    { label: '9:16', desc: 'Stories/TikTok', iconW: 'w-2.5', iconH: 'h-4' },
    { label: '1:1', desc: 'Square', iconW: 'w-3.5', iconH: 'h-3.5' },
    { label: '21:9', desc: 'Ultra-Wide Cinema', iconW: 'w-5', iconH: 'h-2' },
  ];

  const resolutions: Resolution[] = ['720p', '1080p', '4K'];

  const motions: CameraMotion[] = [
    'Slow Orbit',
    'Pan Right',
    'Pan Left',
    'FPV Drone Dive',
    'Cinematic Crane Up',
    'Hyperlapse Zoom',
    'Static',
  ];

  return (
    <div className="space-y-4 rounded-2xl bg-[#121212] border border-[#242424] p-4 shadow-xl">
      <h3 className="text-xs font-semibold text-white tracking-wide flex items-center justify-between pb-2 border-b border-[#1f1f1f]">
        <span>Synthesis Parameters</span>
        <span className="text-[10px] font-mono text-brand-yellow">High Dynamic Range</span>
      </h3>

      {/* Aspect Ratio */}
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
          <Ratio className="w-3.5 h-3.5 text-muted" />
          <span>Aspect Ratio</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ratios.map((r) => {
            const isSelected = aspectRatio === r.label;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => setAspectRatio(r.label)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'bg-brand-yellow/15 border-brand-yellow text-white shadow-glow-yellow-sm font-semibold'
                    : 'bg-[#181818] border-[#292929] text-zinc-400 hover:text-white hover:bg-[#202020]'
                }`}
              >
                <div className={`border border-current rounded-sm mb-1 ${r.iconW} ${r.iconH}`} />
                <span className="font-mono text-xs">{r.label}</span>
                <span className="text-[10px] text-muted truncate">{r.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-muted" />
            Duration
          </span>
          <span className="font-mono font-bold text-brand-yellow">{duration} seconds</span>
        </div>
        <input
          type="range"
          min={3}
          max={15}
          step={1}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full accent-brand-yellow bg-[#222222] h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-muted">
          <span>3s (Short)</span>
          <span>8s (Standard)</span>
          <span>15s (Epic)</span>
        </div>
      </div>

      {/* Resolution & Camera Motion */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Resolution */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
            <Tv className="w-3.5 h-3.5 text-muted" />
            <span>Resolution</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {resolutions.map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                className={`py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  resolution === res
                    ? 'bg-brand-yellow text-black border-brand-yellow font-bold shadow-glow-yellow-sm'
                    : 'bg-[#181818] border-[#292929] text-zinc-400 hover:text-white'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        {/* Camera Motion */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
            <Compass className="w-3.5 h-3.5 text-muted" />
            <span>Camera Vector</span>
          </label>
          <select
            value={cameraMotion}
            onChange={(e) => setCameraMotion(e.target.value as CameraMotion)}
            className="w-full bg-[#181818] border border-[#292929] text-zinc-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-brand-yellow font-mono cursor-pointer"
          >
            {motions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Generate Button CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={startGeneration}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-yellow via-[#FFE24D] to-brand-orange text-black font-bold text-sm tracking-wide shadow-glow-yellow hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          <Film className="w-4 h-4 fill-black" />
          <span>{isGenerating ? 'Rendering in Progress...' : 'Synthesize Video'}</span>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-black/20 border border-black/10">
            50 ⚡
          </span>
        </button>
      </div>
    </div>
  );
};
