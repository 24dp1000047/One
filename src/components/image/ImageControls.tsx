import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  Dices, 
  Sliders, 
  Crop, 
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ImageAspectRatio, ImageModel } from '../../types';
import { audioSynth } from '../../utils/audioSynth';

export const ImageControls: React.FC = () => {
  const imageAspectRatio = useAppStore((state) => state.imageAspectRatio);
  const setImageAspectRatio = useAppStore((state) => state.setImageAspectRatio);
  const imageModel = useAppStore((state) => state.imageModel);
  const setImageModel = useAppStore((state) => state.setImageModel);
  const batchCount = useAppStore((state) => state.batchCount);
  const setBatchCount = useAppStore((state) => state.setBatchCount);
  const cfgScale = useAppStore((state) => state.cfgScale);
  const setCfgScale = useAppStore((state) => state.setCfgScale);
  const steps = useAppStore((state) => state.steps);
  const setSteps = useAppStore((state) => state.setSteps);
  const seed = useAppStore((state) => state.seed);
  const setSeed = useAppStore((state) => state.setSeed);
  const randomizeSeed = useAppStore((state) => state.randomizeSeed);
  const isGeneratingImages = useAppStore((state) => state.isGeneratingImages);
  const startImageGeneration = useAppStore((state) => state.startImageGeneration);

  const aspectRatios: { ratio: ImageAspectRatio; label: string; sub: string }[] = [
    { ratio: '1:1', label: '1:1', sub: 'Square (1024x1024)' },
    { ratio: '16:9', label: '16:9', sub: 'Cinematic (1344x768)' },
    { ratio: '9:16', label: '9:16', sub: 'Portrait (768x1344)' },
    { ratio: '4:5', label: '4:5', sub: 'Editorial (896x1120)' },
    { ratio: '21:9', label: '21:9', sub: 'Anamorphic (1536x640)' },
  ];

  const models: ImageModel[] = [
    'ONᵉ Imagen-3 Ultra',
    'Flux.1 Pro Precision',
    'Midjourney v6.1 Matrix',
    'SDXL Turbo 8K',
  ];

  return (
    <div className="rounded-3xl bg-[#07090F] border border-[#181C26] p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Aspect Ratio Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Crop className="w-3.5 h-3.5 text-[#A5C4F2]" />
            FRAME ASPECT RATIO
          </span>
          <span className="text-white font-medium">{imageAspectRatio}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {aspectRatios.map((item) => (
            <button
              key={item.ratio}
              onClick={() => setImageAspectRatio(item.ratio)}
              className={`p-2.5 rounded-xl border text-center font-mono transition-all cursor-pointer ${
                imageAspectRatio === item.ratio
                  ? 'bg-white/15 border-white text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs">{item.label}</div>
              <div className="text-[9px] text-zinc-500 mt-0.5 truncate">{item.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Model & Batch Count Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Model Engine */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#E5A866]" />
              SYNTHESIS ENGINE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {models.map((m) => (
              <button
                key={m}
                onClick={() => setImageModel(m)}
                className={`p-2 rounded-xl border text-left font-mono transition-all text-xs cursor-pointer ${
                  imageModel === m
                    ? 'bg-[#E5A866]/15 border-[#E5A866] text-white font-medium'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="truncate font-semibold">{m}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Batch Generation Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-ice" />
              BATCH COUNT (IMAGES)
            </span>
            <span className="text-white font-medium">{batchCount} Output{batchCount > 1 ? 's' : ''}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 4].map((count) => (
              <button
                key={count}
                onClick={() => setBatchCount(count)}
                className={`py-2 px-3 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer ${
                  batchCount === count
                    ? 'bg-white/15 border-white text-white font-bold'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {count === 4 ? '4 (Quad)' : `${count} Image${count > 1 ? 's' : ''}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Sliders: CFG Scale & Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono text-xs text-zinc-400">
        {/* CFG Scale */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span>Prompt Guidance (CFG)</span>
            <span className="text-white font-medium">{cfgScale}</span>
          </div>
          <input
            type="range"
            min={3}
            max={15}
            step={0.5}
            value={cfgScale}
            onChange={(e) => setCfgScale(parseFloat(e.target.value))}
            className="w-full accent-[#E5A866] bg-white/10 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Sampling Steps */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span>Sampling Steps</span>
            <span className="text-white font-medium">{steps} Iterations</span>
          </div>
          <input
            type="range"
            min={20}
            max={60}
            step={5}
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value))}
            className="w-full accent-[#A5C4F2] bg-white/10 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Seed Input & Randomizer */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#141822] font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">SEED:</span>
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
            className="w-32 bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:outline-none"
          />
        </div>

        <button
          onClick={randomizeSeed}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs"
        >
          <Dices className="w-3.5 h-3.5" />
          <span>Roll Seed</span>
        </button>
      </div>

      {/* Primary Action Button: Synthesize Images */}
      <div className="pt-2">
        <button
          onClick={startImageGeneration}
          disabled={isGeneratingImages}
          className={`w-full py-4 px-6 rounded-2xl font-sans font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl ${
            isGeneratingImages
              ? 'bg-[#181C26] text-zinc-400 border border-white/10 cursor-not-allowed'
              : 'pill-action hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isGeneratingImages ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing {batchCount} Images in Latent Space...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Generate {batchCount} {batchCount === 1 ? 'Image' : 'Images'}</span>
              <span className="ml-2 font-mono text-xs opacity-75 font-normal">
                (⚡ {batchCount * 5} Energy)
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
