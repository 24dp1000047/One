import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2, 
  Sliders, 
  Layers, 
  Play, 
  ArrowRight, 
  Check, 
  Flame, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { InteractiveParticleCanvas } from '../components/playground/InteractiveParticleCanvas';

interface Variation {
  id: string;
  title: string;
  style: string;
  prompt: string;
  thumbnail: string;
  motionStrength: number;
  guidanceScale: number;
}

export const Playground: React.FC = () => {
  const navigate = useNavigate();
  const setStudioPrompt = useAppStore((state) => state.setStudioPrompt);
  const setSelectedStyle = useAppStore((state) => state.setSelectedStyle);
  const addToast = useAppStore((state) => state.addToast);

  const [basePrompt, setBasePrompt] = useState(
    'A cybernetic astronaut floating outside an orbital space elevator with golden solar panels'
  );
  const [motionStrength, setMotionStrength] = useState(75);
  const [guidanceScale, setGuidanceScale] = useState(12);
  const [chaosFactor, setChaosFactor] = useState(20);
  const [cameraShake, setCameraShake] = useState(5);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);

  const [variations, setVariations] = useState<Variation[]>([
    {
      id: 'var-1',
      title: 'Variation A: Hyper-Photoreal Anamorphic',
      style: 'Cinematic 8K',
      prompt: 'A cybernetic astronaut floating outside an orbital space elevator, anamorphic lens flares, earth blue marble reflection on gold visor, 35mm film grain, 8K.',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      motionStrength: 70,
      guidanceScale: 11,
    },
    {
      id: 'var-2',
      title: 'Variation B: Cyberpunk Neon Rainstorm',
      style: 'Cyberpunk Neon',
      prompt: 'A cybernetic astronaut drifting through holographic solar arrays, deep obsidian shadows with bright canary yellow (#FFD600) and electric cyan lasers.',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      motionStrength: 85,
      guidanceScale: 14,
    },
    {
      id: 'var-3',
      title: 'Variation C: Surreal Metaphysical Geometry',
      style: 'Hyper-Surrealism',
      prompt: 'A cybernetic astronaut dissolving into crystalline origami fractals above swirling nebulae, floating gold spheres, dreamlike zero gravity.',
      thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
      motionStrength: 60,
      guidanceScale: 16,
    },
  ]);

  const handleGenerateVariations = () => {
    setIsGeneratingVariations(true);
    addToast({
      type: 'info',
      title: 'Generating Variations',
      message: 'Synthesizing 3 artistic interpretations with adjusted guidance scales...',
    });

    setTimeout(() => {
      const newVariations: Variation[] = [
        {
          id: 'var-' + Date.now() + '-1',
          title: `Variation Alpha: ${basePrompt.slice(0, 24)}... (Anamorphic)`,
          style: 'Cinematic 8K',
          prompt: `Cinematic 8K anamorphic capture of ${basePrompt}, golden hour atmospheric radiance, slow-motion fluid physics, 60fps high shutter.`,
          thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
          motionStrength,
          guidanceScale,
        },
        {
          id: 'var-' + Date.now() + '-2',
          title: `Variation Beta: Stylized Anime Treatment`,
          style: 'Anime Neo-Tokyo',
          prompt: `High-octane Makoto Shinkai anime aesthetic: ${basePrompt}, dynamic cel-shaded keyframes, expressive hand-drawn lens blooms.`,
          thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
          motionStrength: Math.min(100, motionStrength + 15),
          guidanceScale: Math.max(5, guidanceScale - 2),
        },
        {
          id: 'var-' + Date.now() + '-3',
          title: `Variation Gamma: Dark Cybernetic Void`,
          style: 'Cyberpunk Neon',
          prompt: `Obsidian void background (#090909) with hyper-focused amber highlights (#FFD600) detailing ${basePrompt}, macro focal depth.`,
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          motionStrength: Math.max(30, motionStrength - 15),
          guidanceScale: Math.min(20, guidanceScale + 3),
        },
      ];
      setVariations(newVariations);
      setIsGeneratingVariations(false);
      addToast({
        type: 'success',
        title: 'Variations Ready!',
        message: 'Generated 3 distinct creative alternatives.',
      });
    }, 1200);
  };

  const handlePromoteToStudio = (variation: Variation) => {
    setStudioPrompt(variation.prompt);
    setSelectedStyle(variation.style);
    addToast({
      type: 'success',
      title: 'Promoted to Studio',
      message: `Loading "${variation.title}" into Text-to-Video Studio.`,
    });
    navigate('/studio');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#141822]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#A5C4F2] font-semibold">04 //</span>
            <span className="text-zinc-500 uppercase tracking-widest">A/B LAB MATRIX</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
              SIMULATED LATENCY 14MS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight mt-1">
            Creative Playground
          </h1>
          <p className="text-xs text-[#8A94A6] mt-1 font-light">
            Stress-test prompts, tweak physics parameters, and generate 3 side-by-side variations in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Zap className="w-4 h-4 text-[#E5A866]" />
          <span>ZERO GPU OVERHEAD</span>
        </div>
      </div>

      {/* Interactive Physics & Kinetic Particle Dynamics Simulator */}
      <InteractiveParticleCanvas />

      {/* Input & Physics Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prompt & Generator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#141414] border border-[#262626] p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Seed Prompt for Experimentation</span>
              <span className="text-[10px] font-mono text-muted">A/B Matrix</span>
            </div>

            <textarea
              rows={3}
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl p-3 text-sm text-white placeholder-muted focus:outline-none focus:border-brand-yellow resize-none leading-relaxed"
              placeholder="Enter an initial concept..."
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted font-mono">
                Click to synthesize 3 alternative styles & optical tunings:
              </span>

              <button
                type="button"
                onClick={handleGenerateVariations}
                disabled={isGeneratingVariations || !basePrompt.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-yellow to-brand-orange text-black font-semibold text-xs tracking-wide shadow-glow-yellow hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isGeneratingVariations ? 'animate-spin' : ''}`} />
                <span>{isGeneratingVariations ? 'Synthesizing...' : 'Generate 3 Variations'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Physics Sliders (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#121212] border border-[#242424] p-4 sm:p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-semibold text-white tracking-wide flex items-center justify-between pb-2 border-b border-[#1f1f1f]">
            <span>Generative Physics & Constraints</span>
            <Sliders className="w-3.5 h-3.5 text-brand-yellow" />
          </h3>

          {/* Slider 1: Motion Strength */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300">Motion Velocity Vector</span>
              <span className="font-mono text-brand-yellow font-bold">{motionStrength}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={motionStrength}
              onChange={(e) => setMotionStrength(Number(e.target.value))}
              className="w-full accent-brand-yellow bg-[#222222] h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* Slider 2: Guidance Scale */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300">Prompt Adherence (CFG Scale)</span>
              <span className="font-mono text-brand-orange font-bold">{guidanceScale}.0</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={guidanceScale}
              onChange={(e) => setGuidanceScale(Number(e.target.value))}
              className="w-full accent-brand-orange bg-[#222222] h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* Slider 3: Camera Shake */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300">Handheld Camera Shake</span>
              <span className="font-mono text-zinc-400">{cameraShake} / 10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={cameraShake}
              onChange={(e) => setCameraShake(Number(e.target.value))}
              className="w-full accent-zinc-400 bg-[#222222] h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* Slider 4: Chaos / Creativity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300">Chaos Latent Temperature</span>
              <span className="font-mono text-brand-yellow font-bold">{chaosFactor}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={chaosFactor}
              onChange={(e) => setChaosFactor(Number(e.target.value))}
              className="w-full accent-brand-yellow bg-[#222222] h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Variations Comparison Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-yellow" />
            <h2 className="text-base font-semibold text-white tracking-wide">
              Side-by-Side Variations Comparison
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">Select a candidate to render</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {variations.map((v) => (
            <div
              key={v.id}
              className="group flex flex-col justify-between rounded-2xl bg-[#141414] border border-[#262626] hover:border-brand-yellow/50 overflow-hidden p-4 space-y-4 transition-all duration-300 shadow-xl hover:shadow-glow-yellow-sm"
            >
              {/* Thumbnail Stage */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-[#222222]">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-brand-yellow border border-white/10">
                  {v.style}
                </div>

                <div className="absolute bottom-2 right-2 flex items-center gap-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                  <span>CFG: {v.guidanceScale}</span>
                  <span>Motion: {v.motionStrength}%</span>
                </div>
              </div>

              {/* Title & Prompt */}
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-semibold text-white tracking-wide group-hover:text-brand-yellow transition-colors">
                  {v.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-3">
                  "{v.prompt}"
                </p>
              </div>

              {/* Action Button: Promote to Video Studio */}
              <div className="pt-2 border-t border-[#1f1f1f]">
                <button
                  type="button"
                  onClick={() => handlePromoteToStudio(v)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1c1c1c] hover:bg-brand-yellow text-zinc-200 hover:text-black font-semibold text-xs tracking-wide transition-all border border-[#2d2d2d] hover:border-transparent group"
                >
                  <span>Promote to Final Video Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
