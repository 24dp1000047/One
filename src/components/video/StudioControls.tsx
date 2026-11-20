import React from 'react';
import { 
  Ratio, 
  Clock, 
  Tv, 
  Compass, 
  Film,
  ArrowUpRight 
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
    <div className="space-y-4 rounded-3xl bg-[#080A10] border border-[#181C26] p-5 shadow-2xl">
      <h3 className="text-xs font-mono font-medium text-white tracking-widest uppercase flex items-center justify-between pb-3 border-b border-[#141822]">
        <span>Synthesis Parameters</span>
        <span className="text-[10px] text-[#A5C4F2]">HDR OPTICAL PIPELINE</span>
      </h3>

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-xs text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
          <Ratio className="w-3.5 h-3.5 text-zinc-500" />
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
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 border-[#A5C4F2] text-white shadow-sm font-semibold'
                    : 'bg-[#05070C] border-[#181C26] text-zinc-400 hover:text-white hover:bg-[#0D1017]'
                }`}
              >
                <div className={`border border-current rounded-sm mb-1.5 ${r.iconW} ${r.iconH}`} />
                <span className="font-mono text-xs">{r.label}</span>
                <span className="text-[10px] text-zinc-500 truncate font-mono">{r.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Slider */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400 flex items-center gap-1.5 tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            Duration
          </span>
          <span className="text-[#E5A866] font-bold">{duration} SECONDS</span>
        </div>
        <input
          type="range"
          min={3}
          max={15}
          step={1}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full accent-[#A5C4F2] bg-[#141822] h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>03S (Short)</span>
          <span>08S (Standard)</span>
          <span>15S (Epic)</span>
        </div>
      </div>

      {/* Resolution & Camera Motion */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Resolution */}
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-zinc-500" />
            <span>Resolution</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {resolutions.map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                className={`py-2 rounded-2xl border text-xs font-mono transition-all cursor-pointer ${
                  resolution === res
                    ? 'pill-action font-bold'
                    : 'bg-[#05070C] border-[#181C26] text-zinc-400 hover:text-white'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        {/* Camera Motion */}
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-zinc-500" />
            <span>Camera Vector</span>
          </label>
          <select
            value={cameraMotion}
            onChange={(e) => setCameraMotion(e.target.value as CameraMotion)}
            className="w-full bg-[#05070C] border border-[#181C26] text-zinc-200 text-xs rounded-2xl px-3 py-2 focus:outline-none focus:border-[#A5C4F2] font-mono cursor-pointer"
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
      <div className="pt-3">
        <button
          type="button"
          onClick={startGeneration}
          disabled={isGenerating}
          className="pill-action w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full font-sans font-semibold text-xs tracking-wide cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
        >
          <Film className="w-4 h-4" />
          <span>{isGenerating ? 'Rendering in Progress...' : 'Synthesize 4K Video'}</span>
          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
