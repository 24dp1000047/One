import React, { useRef, useEffect, useState } from 'react';
import { 
  Palette, 
  Sun, 
  Contrast, 
  Sliders, 
  Eye, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  Check 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';

export const ColorGradingSuite: React.FC = () => {
  const colorGrading = useAppStore((state) => state.colorGrading);
  const updateColorGrading = useAppStore((state) => state.updateColorGrading);
  const applyLutPreset = useAppStore((state) => state.applyLutPreset);
  const activeGeneratedVideo = useAppStore((state) => state.activeGeneratedVideo);
  const scenes = useAppStore((state) => state.scenes);

  const [compareOriginal, setCompareOriginal] = useState(false);
  const histogramCanvasRef = useRef<HTMLCanvasElement>(null);

  const currentThumbnail =
    activeGeneratedVideo?.thumbnail ||
    scenes[0]?.thumbnail ||
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';

  // Draw real-time animated RGB Histogram parade
  useEffect(() => {
    const canvas = histogramCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#05070C';
    ctx.fillRect(0, 0, width, height);

    // Simulated RGB Waveform channels shifted by temperature, exposure, and contrast
    const numPoints = 64;
    const expOffset = (colorGrading.exposure / 50) * 15;
    const tempOffset = (colorGrading.temperature / 50) * 12;
    const contrastFactor = colorGrading.contrast / 100;

    // Red Channel
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 75, 75, 0.7)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < numPoints; i++) {
      const x = (i / numPoints) * width;
      const base = Math.sin(i * 0.18) * 14 + Math.cos(i * 0.08) * 8;
      const y = height * 0.5 - (base * contrastFactor + expOffset + tempOffset);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Green Channel
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(75, 255, 120, 0.7)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < numPoints; i++) {
      const x = (i / numPoints) * width;
      const base = Math.sin(i * 0.16 + 1) * 12 + Math.cos(i * 0.1) * 6;
      const y = height * 0.5 - (base * contrastFactor + expOffset);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Blue Channel
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(75, 150, 255, 0.7)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < numPoints; i++) {
      const x = (i / numPoints) * width;
      const base = Math.sin(i * 0.2 + 2) * 15 + Math.cos(i * 0.09) * 7;
      const y = height * 0.5 - (base * contrastFactor + expOffset - tempOffset);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [colorGrading]);

  const lutPresets = [
    { name: 'Humanon Noir', desc: 'Deep Obsidian & Silver Highs' },
    { name: 'Cyberpunk 2077', desc: 'Neon Cyan & Electric Amber' },
    { name: 'Dune Arrakis', desc: 'Warm Golden Haze & High Sun' },
    { name: 'Solaris 70mm', desc: 'Vintage Anamorphic Film Stock' },
    { name: 'Matrix Phosphor', desc: 'Terminal Emerald Monochrome' },
  ];

  // Helper to compute CSS filter style
  const getFilterStyle = () => {
    if (compareOriginal) return {};
    const brightness = 1 + colorGrading.exposure / 100;
    const contrast = colorGrading.contrast / 100;
    const saturate = colorGrading.saturation / 100;
    const sepia = Math.max(0, colorGrading.temperature / 100);
    const hueRotate = colorGrading.temperature < 0 ? `${(colorGrading.temperature / 50) * 20}deg` : '0deg';

    return {
      filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) sepia(${sepia * 0.4}) hue-rotate(${hueRotate})`,
    };
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#040608] border border-[#181C26] overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#141822] bg-[#07090F]/90 backdrop-blur-md z-10 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Palette className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Color Grading & Post-FX Lab</span>
          </div>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400 text-[11px]">Real-time LUTs & Spectral Tone Engine</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onMouseDown={() => setCompareOriginal(true)}
            onMouseUp={() => setCompareOriginal(false)}
            onMouseLeave={() => setCompareOriginal(false)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer select-none"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Hold to Compare Original</span>
          </button>
          <button
            onClick={() => {
              audioSynth.playClick(900);
              applyLutPreset('Humanon Noir');
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to Noir default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Monitor, Right Grading Consoles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 items-start">
        {/* Left Column: Live Monitored Stage & RGB Waveform */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#181C26] bg-black shadow-2xl">
            <img
              src={currentThumbnail}
              alt="Grade Monitor"
              style={getFilterStyle()}
              className="w-full h-full object-cover transition-all duration-150"
            />

            {/* Vignette Overlay */}
            {!compareOriginal && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                style={{
                  background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${colorGrading.vignette / 100}))`,
                }}
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white">
                {compareOriginal ? 'ORIGINAL LOG' : colorGrading.preset.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                REC.709
              </span>
            </div>
          </div>

          {/* RGB Waveform Scope */}
          <div className="p-3.5 rounded-xl bg-[#06080F] border border-[#141822] space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-ice" />
                RGB PARADE / SPECTRAL WAVEFORM
              </span>
              <span className="text-zinc-500">10-BIT LINEAR</span>
            </div>
            <canvas
              ref={histogramCanvasRef}
              width={420}
              height={70}
              className="w-full h-[70px] rounded-lg border border-white/5"
            />
          </div>
        </div>

        {/* Right Column: LUT Buttons & Interactive Sliders */}
        <div className="lg:col-span-6 space-y-5">
          {/* Cinema LUT Selection */}
          <div className="space-y-2">
            <div className="font-mono text-xs text-zinc-400 tracking-wider uppercase">
              Cinematic LUT Presets
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lutPresets.map((lut) => (
                <button
                  key={lut.name}
                  onClick={() => applyLutPreset(lut.name)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    colorGrading.preset === lut.name
                      ? 'bg-emerald-500/10 border-emerald-400/50 ring-1 ring-emerald-400/20'
                      : 'bg-[#080B12] hover:bg-[#0D121F] border-[#181C26]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-medium text-xs text-white">
                      {lut.name}
                    </span>
                    {colorGrading.preset === lut.name && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    {lut.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameter Sliders */}
          <div className="space-y-3.5 pt-1 font-mono text-xs text-zinc-400">
            {/* Exposure */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Exposure (EV)</span>
                <span className="text-white">{colorGrading.exposure > 0 ? `+${colorGrading.exposure}` : colorGrading.exposure}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={colorGrading.exposure}
                onChange={(e) => updateColorGrading({ exposure: parseInt(e.target.value) })}
                className="w-full accent-emerald-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Contrast Ratio</span>
                <span className="text-white">{colorGrading.contrast}%</span>
              </div>
              <input
                type="range"
                min={60}
                max={150}
                value={colorGrading.contrast}
                onChange={(e) => updateColorGrading({ contrast: parseInt(e.target.value) })}
                className="w-full accent-emerald-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Saturation & Vibrance</span>
                <span className="text-white">{colorGrading.saturation}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={200}
                value={colorGrading.saturation}
                onChange={(e) => updateColorGrading({ saturation: parseInt(e.target.value) })}
                className="w-full accent-emerald-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Temperature (Cool Cyan <-> Warm Amber) */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Temperature Shift (Cyan / Amber)</span>
                <span className="text-white">
                  {colorGrading.temperature < 0
                    ? `${colorGrading.temperature} (Cool)`
                    : `+${colorGrading.temperature} (Warm)`}
                </span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={colorGrading.temperature}
                onChange={(e) => updateColorGrading({ temperature: parseInt(e.target.value) })}
                className="w-full accent-[#E5A866] bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Vignette & Anamorphic Bloom */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Vignette Falloff</span>
                  <span className="text-white">{colorGrading.vignette}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={colorGrading.vignette}
                  onChange={(e) => updateColorGrading({ vignette: parseInt(e.target.value) })}
                  className="w-full accent-zinc-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Anamorphic Bloom</span>
                  <span className="text-white">{colorGrading.bloom}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={colorGrading.bloom}
                  onChange={(e) => updateColorGrading({ bloom: parseInt(e.target.value) })}
                  className="w-full accent-zinc-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
