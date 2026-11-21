import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Download, 
  Share2, 
  Sparkles, 
  Brush, 
  Grid2X2, 
  RotateCcw, 
  Copy, 
  Check, 
  ZoomIn, 
  Sliders,
  Layers,
  Heart,
  Eye,
  Wand2,
  Scan,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';

export const ImageCanvasPreview: React.FC = () => {
  const activeGeneratedImage = useAppStore((state) => state.activeGeneratedImage);
  const generatedImages = useAppStore((state) => state.generatedImages);
  const setActiveGeneratedImage = useAppStore((state) => state.setActiveGeneratedImage);
  const toggleFavoriteImage = useAppStore((state) => state.toggleFavoriteImage);
  const upscaleImage = useAppStore((state) => state.upscaleImage);
  const isUpscaling = useAppStore((state) => state.isUpscaling);
  const isGeneratingImages = useAppStore((state) => state.isGeneratingImages);
  const startImageGeneration = useAppStore((state) => state.startImageGeneration);
  const setImagePrompt = useAppStore((state) => state.setImagePrompt);
  const imagePrompt = useAppStore((state) => state.imagePrompt);
  const colorGrading = useAppStore((state) => state.colorGrading);
  const imageAspectRatio = useAppStore((state) => state.imageAspectRatio);
  const batchCount = useAppStore((state) => state.batchCount);
  const addToast = useAppStore((state) => state.addToast);

  const [viewMode, setViewMode] = useState<'single' | 'quad'>('single');
  const [isInpaintingActive, setIsInpaintingActive] = useState(false);
  const [brushSize, setBrushSize] = useState(28);
  const [isPainting, setIsPainting] = useState(false);
  const [showAiInspector, setShowAiInspector] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [diffusionStep, setDiffusionStep] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const animCanvasRef = useRef<HTMLCanvasElement>(null);

  const currentImg = activeGeneratedImage || generatedImages[0];
  const currentBatch = generatedImages.slice(0, 4);

  // Sync mask canvas size
  useEffect(() => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }, [isInpaintingActive, currentImg]);

  // Diffusion simulation step ticker during generation
  useEffect(() => {
    if (!isGeneratingImages) {
      setDiffusionStep(1);
      return;
    }
    const interval = setInterval(() => {
      setDiffusionStep((prev) => (prev < 30 ? prev + 1 : 30));
    }, 70);
    return () => clearInterval(interval);
  }, [isGeneratingImages]);

  // Animated Neural Latent Diffusion Canvas
  useEffect(() => {
    if (!isGeneratingImages) return;
    const canvas = animCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    canvas.width = canvas.clientWidth || 500;
    canvas.height = canvas.clientHeight || 500;

    const render = () => {
      time += 0.04;
      const w = canvas.width;
      const h = canvas.height;

      // Dark translucent trail
      ctx.fillStyle = 'rgba(4, 6, 8, 0.25)';
      ctx.fillRect(0, 0, w, h);

      // Latent Noise Grid
      const gridSize = 16;
      const cols = Math.floor(w / gridSize);
      const rows = Math.floor(h / gridSize);

      for (let i = 0; i < 35; i++) {
        const rx = Math.floor(Math.random() * cols) * gridSize;
        const ry = Math.floor(Math.random() * rows) * gridSize;
        const alpha = Math.random() * 0.4 + 0.1;
        ctx.fillStyle = Math.random() > 0.6 ? `rgba(229, 168, 102, ${alpha})` : `rgba(165, 196, 242, ${alpha})`;
        ctx.fillRect(rx, ry, gridSize - 2, gridSize - 2);
      }

      // Sweeping Laser Scan Line
      const scanY = ((Math.sin(time * 2) + 1) / 2) * h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, 'rgba(165, 196, 242, 0)');
      scanGrad.addColorStop(0.5, 'rgba(229, 168, 102, 0.7)');
      scanGrad.addColorStop(1, 'rgba(165, 196, 242, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 15, w, 30);

      // Expanding concentric focus rings
      const cx = w / 2;
      const cy = h / 2;
      for (let r = 1; r <= 3; r++) {
        const radius = ((time * 40 * r) % (w * 0.6));
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(165, 196, 242, ${Math.max(0, 0.35 - radius / (w * 0.6))})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isGeneratingImages]);

  // Compute live CSS filters from Color Grading Lab
  const getFilterStyle = () => {
    const brightness = 1 + colorGrading.exposure / 100;
    const contrast = colorGrading.contrast / 100;
    const saturate = colorGrading.saturation / 100;
    const sepia = Math.max(0, colorGrading.temperature / 100);
    const hueRotate = colorGrading.temperature < 0 ? `${(colorGrading.temperature / 50) * 20}deg` : '0deg';

    return {
      filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) sepia(${sepia * 0.4}) hue-rotate(${hueRotate})`,
    };
  };

  const getAspectClass = () => {
    switch (imageAspectRatio) {
      case '1:1':
        return 'aspect-square max-h-[520px]';
      case '9:16':
        return 'aspect-[9/16] max-h-[560px]';
      case '4:5':
        return 'aspect-[4/5] max-h-[520px]';
      case '21:9':
        return 'aspect-[21/9]';
      default:
        return 'aspect-video';
    }
  };

  // Inpainting Canvas Handlers
  const handleStartPaint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInpaintingActive) return;
    setIsPainting(true);
    drawMask(e);
  };

  const handlePaint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting || !isInpaintingActive) return;
    drawMask(e);
  };

  const handleStopPaint = () => {
    setIsPainting(false);
  };

  const drawMask = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = 'rgba(255, 42, 109, 0.45)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearMask = () => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    audioSynth.playClick(1000);
    addToast({
      type: 'info',
      title: 'Inpaint Mask Cleared',
      message: 'Brush canvas reset to default.',
    });
  };

  const handleCopyPrompt = () => {
    if (!currentImg) return;
    navigator.clipboard.writeText(currentImg.prompt);
    setCopiedPrompt(true);
    audioSynth.playClick(1400);
    setTimeout(() => setCopiedPrompt(false), 2000);
    addToast({
      type: 'success',
      title: 'Prompt Copied',
      message: 'Image generation prompt copied to clipboard.',
    });
  };

  const handleDownload = () => {
    if (!currentImg) return;
    audioSynth.playWhoosh();
    const link = document.createElement('a');
    link.href = currentImg.url;
    link.download = `one-ai-image-${currentImg.id}.jpg`;
    link.click();
    addToast({
      type: 'success',
      title: 'Downloading Image',
      message: `Exporting ${currentImg.resolution} master file.`,
    });
  };

  // AI Quick Refinement Handlers
  const handleApplyAiRefinement = (token: string, title: string) => {
    audioSynth.playClick(1400);
    const updated = `${imagePrompt.trim().replace(/,\s*$/, '')}, ${token}`;
    setImagePrompt(updated);
    addToast({
      type: 'success',
      title: `AI Refinement: ${title}`,
      message: 'Updated prompt with optical enhancements. Starting synthesis...',
    });
    startImageGeneration();
  };

  return (
    <div
      ref={containerRef}
      className="rounded-3xl bg-[#07090F] border border-[#181C26] p-4 sm:p-5 shadow-2xl space-y-4"
    >
      {/* Top Bar: Metadata & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs pb-3 border-b border-[#141822]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
          <span className="text-white font-medium tracking-wider uppercase">Stage Canvas</span>
          {currentImg && (
            <span className="text-zinc-500 text-[11px]">
              [{currentImg.resolution} // {currentImg.model.split(' ')[1] || 'Imagen'}]
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 capsule-control px-2 py-1 rounded-full text-xs">
          {/* AI Vision Inspector Toggle */}
          <button
            onClick={() => setShowAiInspector(!showAiInspector)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
              showAiInspector
                ? 'bg-[#E5A866] text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
            title="Toggle AI Vision Analysis & Enhancements"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Inspector</span>
          </button>

          {/* Quad Grid Toggle */}
          <button
            onClick={() => {
              audioSynth.playClick(1100);
              setViewMode(viewMode === 'single' ? 'quad' : 'single');
            }}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              viewMode === 'quad'
                ? 'bg-white/20 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Toggle Quad Batch Grid"
          >
            <Grid2X2 className="w-4 h-4" />
          </button>

          {/* Inpainting Mask Toggle */}
          <button
            onClick={() => {
              audioSynth.playClick(1300);
              setIsInpaintingActive(!isInpaintingActive);
            }}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isInpaintingActive
                ? 'bg-pink-500/30 text-pink-400 border border-pink-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Inpainting Brush Mask"
          >
            <Brush className="w-4 h-4" />
          </button>

          {/* Favorite */}
          {currentImg && (
            <button
              onClick={() => toggleFavoriteImage(currentImg.id)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                currentImg.isFavorite ? 'text-red-400' : 'text-zinc-400 hover:text-white'
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${currentImg.isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Copy Prompt */}
          <button
            onClick={handleCopyPrompt}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Prompt"
          >
            {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Download Full Resolution"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Visual Stage Canvas */}
      <div className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#040608] flex items-center justify-center ${getAspectClass()}`}>
        
        {/* ACTIVE NEURAL DIFFUSION ANIMATION OVERLAY */}
        {isGeneratingImages && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden animate-fadeIn">
            <canvas ref={animCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center space-y-4 px-6 text-center max-w-sm">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-[#E5A866] border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white">
                  {Math.round((diffusionStep / 30) * 100)}%
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <div className="text-white text-sm font-semibold tracking-wide">
                  Synthesizing Neural Latents
                </div>
                <div className="text-[#A5C4F2] text-xs">
                  {diffusionStep < 8
                    ? 'Epoch 01: Injecting Gaussian noise field...'
                    : diffusionStep < 18
                    ? 'Epoch 12: Denoising spatial structure & silhouette...'
                    : diffusionStep < 26
                    ? 'Epoch 22: Synthesizing optical lighting & 35mm bokeh...'
                    : 'Epoch 30: Applying neural 8K tone mapping & upscaling...'}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E5A866] to-[#A5C4F2] transition-all duration-100 rounded-full"
                  style={{ width: `${(diffusionStep / 30) * 100}%` }}
                />
              </div>

              <span className="text-zinc-500 text-[10px] font-mono tracking-widest">
                SAMPLING STEP {diffusionStep}/30 • CFG 7.5
              </span>
            </div>
          </div>
        )}

        {/* View 1: Quad-Grid Batch View */}
        {viewMode === 'quad' && currentBatch.length >= 2 ? (
          <div className="grid grid-cols-2 w-full h-full p-2 gap-2 z-10">
            {currentBatch.map((img, i) => (
              <div
                key={img.id}
                onClick={() => {
                  setActiveGeneratedImage(img);
                  setViewMode('single');
                }}
                className={`relative rounded-xl overflow-hidden cursor-pointer border group transition-all ${
                  currentImg?.id === img.id ? 'border-[#E5A866] ring-2 ring-[#E5A866]/30' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.prompt}
                  style={getFilterStyle()}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                  0{i + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* View 2: Single Master View */
          currentImg && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={currentImg.url}
                alt={currentImg.prompt}
                style={getFilterStyle()}
                className="w-full h-full object-contain transition-all duration-300"
              />

              {/* Inpainting Mask Canvas */}
              {isInpaintingActive && (
                <canvas
                  ref={maskCanvasRef}
                  onMouseDown={handleStartPaint}
                  onMouseMove={handlePaint}
                  onMouseUp={handleStopPaint}
                  onMouseLeave={handleStopPaint}
                  className="absolute inset-0 w-full h-full cursor-crosshair z-20"
                />
              )}
            </div>
          )
        )}

        {/* Upscale Loading Banner */}
        {isUpscaling && (
          <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-[#A5C4F2]/40 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2 text-[#A5C4F2]">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Upscaling to 8K Super-Resolution...</span>
            </div>
            <span className="text-zinc-400 text-[10px]">Neural ESRGAN Matrix</span>
          </div>
        )}
      </div>

      {/* Inpainting Controls Toolbar (When active) */}
      {isInpaintingActive && (
        <div className="p-3 rounded-2xl bg-[#0B0E16] border border-pink-500/30 flex flex-wrap items-center justify-between gap-3 font-mono text-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-pink-400 font-semibold flex items-center gap-1.5">
              <Brush className="w-3.5 h-3.5" />
              INPAINT MASK BRUSH:
            </span>
            <input
              type="range"
              min={8}
              max={64}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24 accent-pink-500 cursor-pointer"
            />
            <span className="text-zinc-400 text-[11px]">{brushSize}px</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearMask}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Clear Mask
            </button>
            <button
              onClick={() => {
                setIsInpaintingActive(false);
                addToast({
                  type: 'success',
                  title: 'Inpaint Mask Staged',
                  message: 'Selected region will be regenerated upon next synthesis.',
                });
              }}
              className="px-3 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-medium transition-colors cursor-pointer"
            >
              Confirm Mask
            </button>
          </div>
        </div>
      )}

      {/* AI VISION INSPECTOR & CRITIQUE DRAWER */}
      {showAiInspector && currentImg && (
        <div className="p-4 rounded-2xl bg-[#090C14] border border-[#1C2232] space-y-3.5 animate-fadeIn font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#141822] pb-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A866]" />
              <span>AI Vision Inspector & Neural Critique</span>
            </div>
            <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              OPTIMIZED
            </span>
          </div>

          {/* AI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-zinc-400 text-[10px]">Composition</div>
              <div className="text-sm font-bold text-white">97.4%</div>
              <div className="text-[9px] text-[#A5C4F2]">Rule of Thirds Alignment</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-zinc-400 text-[10px]">Lighting Dynamic</div>
              <div className="text-sm font-bold text-white">95.8%</div>
              <div className="text-[9px] text-[#E5A866]">HDR Specular Range</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-zinc-400 text-[10px]">Color Harmony</div>
              <div className="text-sm font-bold text-white">98.2%</div>
              <div className="text-[9px] text-emerald-400">Cinematic LUT Match</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-zinc-400 text-[10px]">Prompt Alignment</div>
              <div className="text-sm font-bold text-white">96.5%</div>
              <div className="text-[9px] text-purple-400">High Token Adherence</div>
            </div>
          </div>

          {/* 1-Click AI Quick Refinements */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] text-zinc-400 font-medium">
              1-Click AI Prompt Refinements (Synthesize with Boosted Quality):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleApplyAiRefinement('volumetric god rays, atmospheric haze, golden rim lighting', 'Volumetric Rim Light')}
                className="flex items-center justify-between p-2 rounded-xl bg-[#0E131F] hover:bg-[#151D30] border border-[#1A2234] hover:border-[#E5A866]/40 text-left text-zinc-300 hover:text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#E5A866]" />
                  <span>+ Volumetric Rim Lighting</span>
                </div>
                <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Run</span>
              </button>

              <button
                onClick={() => handleApplyAiRefinement('warm golden hour sunlight, 35mm anamorphic bokeh, soft shadows', 'Golden Hour')}
                className="flex items-center justify-between p-2 rounded-xl bg-[#0E131F] hover:bg-[#151D30] border border-[#1A2234] hover:border-[#A5C4F2]/40 text-left text-zinc-300 hover:text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#A5C4F2]" />
                  <span>+ Golden Hour 35mm Bokeh</span>
                </div>
                <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Run</span>
              </button>

              <button
                onClick={() => handleApplyAiRefinement('deep obsidian shadows, high contrast chiaroscuro, cyber noir lighting', 'Obsidian Noir')}
                className="flex items-center justify-between p-2 rounded-xl bg-[#0E131F] hover:bg-[#151D30] border border-[#1A2234] hover:border-purple-400/40 text-left text-zinc-300 hover:text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Scan className="w-3.5 h-3.5 text-purple-400" />
                  <span>+ Deep Obsidian Noir Contrast</span>
                </div>
                <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Run</span>
              </button>

              <button
                onClick={() => handleApplyAiRefinement('Hasselblad 100MP optical sharpness, hyper-detailed micro-textures, 8K UHD', '8K Clarity')}
                className="flex items-center justify-between p-2 rounded-xl bg-[#0E131F] hover:bg-[#151D30] border border-[#1A2234] hover:border-emerald-400/40 text-left text-zinc-300 hover:text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Hasselblad 100MP Sharpness</span>
                </div>
                <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Run</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar: Quick Upscale & Aspect Summary */}
      {currentImg && (
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs pt-1">
          <div className="text-zinc-400 text-[11px] truncate max-w-xs">
            <span className="text-[#E5A866] mr-1.5">Prompt:</span>
            <span>{currentImg.prompt}</span>
          </div>

          <div className="flex items-center gap-2">
            {!currentImg.upscaled && (
              <button
                onClick={() => upscaleImage(currentImg.id, 4)}
                disabled={isUpscaling}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#A5C4F2]/15 hover:bg-[#A5C4F2]/25 border border-[#A5C4F2]/30 text-[#A5C4F2] text-xs font-mono transition-all cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upscale to 4K</span>
              </button>
            )}

            {currentImg.upscaled && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                ✓ 4K Super-Resolution
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
