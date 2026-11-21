import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Palette,
  Lightbulb,
  Camera,
  Layers,
  Flame,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { IMAGE_STYLES } from '../../data/mockData';
import { audioSynth } from '../../utils/audioSynth';

export const ImagePromptEditor: React.FC = () => {
  const imagePrompt = useAppStore((state) => state.imagePrompt);
  const setImagePrompt = useAppStore((state) => state.setImagePrompt);
  const negativePrompt = useAppStore((state) => state.negativePrompt);
  const setNegativePrompt = useAppStore((state) => state.setNegativePrompt);
  const selectedImageStyle = useAppStore((state) => state.selectedImageStyle);
  const setSelectedImageStyle = useAppStore((state) => state.setSelectedImageStyle);
  const enhanceImagePrompt = useAppStore((state) => state.enhanceImagePrompt);
  const addToast = useAppStore((state) => state.addToast);

  const [showNegative, setShowNegative] = useState(false);
  const [showArchitect, setShowArchitect] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'lighting' | 'camera' | 'render' | 'atmosphere'>('lighting');
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [aiVariations, setAiVariations] = useState<string[]>([]);

  // AI Prompt Quality Meter calculation
  const promptScore = useMemo(() => {
    if (!imagePrompt.trim()) return 0;
    let score = 25; // base for typing
    const lower = imagePrompt.toLowerCase();
    if (lower.length > 50) score += 15;
    if (lower.length > 100) score += 10;
    // Check lighting tokens
    if (/(light|rays|illumination|glow|hdr|shadow|golden hour|neon|bokeh|bloom)/.test(lower)) score += 15;
    // Check camera / lens tokens
    if (/(camera|lens|35mm|85mm|hasselblad|wide-angle|macro|aperture|dolly|anamorphic)/.test(lower)) score += 15;
    // Check texture / render tokens
    if (/(8k|octane|unreal|texture|photoreal|grain|detailed|specular|volumetric)/.test(lower)) score += 15;
    // Check style or atmosphere
    if (/(fog|haze|rain|steam|particles|cyberpunk|noir|minimalist|cinematic)/.test(lower)) score += 10;
    return Math.min(100, score);
  }, [imagePrompt]);

  const quickNegativeTags = [
    'blurry',
    'low resolution',
    'deformed hands',
    'oversaturated',
    'text watermark',
    'jpeg artifacts',
    'distorted anatomy',
    'grainy noise',
    'mutated fingers',
    'plastic skin',
  ];

  const architectTokens = {
    lighting: [
      'Volumetric God Rays',
      'Studio Softbox Key Light',
      'Bioluminescent Cyan Glow',
      'Rembrandt Chiaroscuro',
      'Golden Hour Sunlight',
      'Moody Noir Rim Lighting',
    ],
    camera: [
      'Hasselblad 100MP 80mm',
      '35mm Anamorphic Lens',
      'Macro Bokeh f/1.2',
      'Low-Angle Dramatic Perspective',
      'Ultra-Wide 16mm Landscape',
      'Cinematic Dutch Angle',
    ],
    render: [
      'Octane Render 8K',
      'Unreal Engine 5.4 Nanite',
      '35mm Film Grain Kodak Portra',
      'Medium Format Photorealism',
      'Ray-Traced Ambient Occlusion',
      'Subsurface Scattering Skin',
    ],
    atmosphere: [
      'Reflective Wet Obsidian Pavement',
      'Volumetric Atmospheric Haze',
      'Floating Dust Motes in Lightbeam',
      'Heavy Tokyo Neon Rain',
      'Liquid Chrome Ripples',
      'Ethereal Celestial Mist',
    ],
  };

  const handleAppendToken = (token: string) => {
    audioSynth.playClick(1100);
    const trimmed = imagePrompt.trim();
    if (!trimmed) {
      setImagePrompt(token);
    } else if (!trimmed.toLowerCase().includes(token.toLowerCase())) {
      setImagePrompt(`${trimmed}, ${token}`);
    }
  };

  const handleAddNegativeTag = (tag: string) => {
    audioSynth.playClick(900);
    const trimmed = negativePrompt.trim();
    if (!trimmed) {
      setNegativePrompt(tag);
    } else if (!trimmed.toLowerCase().includes(tag.toLowerCase())) {
      setNegativePrompt(`${trimmed}, ${tag}`);
    }
  };

  const handleAutoFillNegative = () => {
    audioSynth.playClick(1200);
    const recommended = 'blurry, low resolution, deformed limbs, extra fingers, text watermark, jpeg artifacts, plastic look, oversaturated';
    setNegativePrompt(recommended);
    addToast({
      type: 'success',
      title: 'Negative Prompt Auto-Filled',
      message: 'Added studio-grade anti-artifact filters for optimal generation.',
    });
  };

  const handleGenerateVariations = () => {
    if (!imagePrompt.trim()) {
      addToast({
        type: 'warning',
        title: 'Prompt Empty',
        message: 'Please write a base prompt first before generating AI remixes.',
      });
      return;
    }

    audioSynth.playClick(1400);
    setIsGeneratingVariations(true);

    setTimeout(() => {
      const base = imagePrompt.trim().replace(/,\s*$/, '');
      const variations = [
        `${base}, shot on 35mm anamorphic Arri Alexa 65, golden hour rim lighting, shallow depth of field, 8K ultra-photorealistic, subtle film grain`,
        `${base}, cyberpunk obsidian aesthetic, reflective wet asphalt, glowing canary amber and electric ice-blue laser illumination, cinematic octane render`,
        `${base}, surreal dreamlike atmosphere, volumetric divine god rays streaming through mist, ethereal floatation, medium format Hasselblad 100MP clarity`,
      ];
      setAiVariations(variations);
      setIsGeneratingVariations(false);
      addToast({
        type: 'info',
        title: '3 AI Prompt Variations Ready',
        message: 'Click any variation below to apply it to your studio canvas.',
      });
    }, 700);
  };

  return (
    <div className="rounded-3xl bg-[#07090F] border border-[#181C26] p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141822] pb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E5A866] animate-pulse" />
          <span className="font-semibold text-white tracking-wider uppercase">Text-to-Image Prompt</span>
          <span className="text-[10px] text-zinc-500 uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
            AI Co-Pilot
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateVariations}
            disabled={isGeneratingVariations || !imagePrompt.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition-all cursor-pointer disabled:opacity-40"
            title="Generate 3 AI Remix variations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingVariations ? 'animate-spin text-[#E5A866]' : ''}`} />
            <span>AI Remix Variations</span>
          </button>

          <button
            onClick={enhanceImagePrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E5A866]/15 hover:bg-[#E5A866]/25 border border-[#E5A866]/30 text-[#E5A866] text-xs font-mono font-medium transition-all cursor-pointer shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Magic Enhance</span>
          </button>
        </div>
      </div>

      {/* Main Prompt Textarea */}
      <div className="relative">
        <textarea
          rows={4}
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          placeholder="Describe the image you want to synthesize in vivid detail (e.g. Cybernetic astronaut in rain, 35mm lens, golden hour)..."
          className="w-full bg-[#040608] border border-[#1A1F2C] focus:border-[#A5C4F2] rounded-2xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none leading-relaxed font-sans"
        />

        {/* Prompt Score Meter Bar */}
        <div className="mt-2 p-2.5 rounded-xl bg-[#080A12] border border-[#141822] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E5A866]" />
              Prompt Fidelity Score:
              <span className={`font-semibold ${promptScore > 80 ? 'text-emerald-400' : promptScore > 50 ? 'text-[#E5A866]' : 'text-zinc-400'}`}>
                {promptScore}/100
              </span>
            </span>
            <span className="text-zinc-500">{imagePrompt.length} characters</span>
          </div>

          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                promptScore >= 80 ? 'bg-gradient-to-r from-[#A5C4F2] to-emerald-400' : promptScore >= 50 ? 'bg-gradient-to-r from-amber-500 to-[#E5A866]' : 'bg-zinc-600'
              }`}
              style={{ width: `${promptScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Remix Variations Drawer */}
      {aiVariations.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#090C14] border border-[#1C2230] space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono text-[#A5C4F2]">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              AI Prompt Variations (Click to Adopt)
            </span>
            <button 
              onClick={() => setAiVariations([])}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            {aiVariations.map((v, i) => (
              <div
                key={i}
                onClick={() => {
                  setImagePrompt(v);
                  audioSynth.playClick(1300);
                  addToast({
                    type: 'success',
                    title: `Variation 0${i + 1} Applied`,
                    message: 'Prompt updated with rich lighting and camera specifications.',
                  });
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-xs text-zinc-300 hover:text-white cursor-pointer transition-all font-mono leading-relaxed group"
              >
                <span className="text-[#E5A866] mr-2 font-bold">0{i + 1} //</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Prompt Architect Token Bar */}
      <div className="space-y-2 pt-1 border-t border-[#141822]">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <button
            onClick={() => setShowArchitect(!showArchitect)}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#E5A866]" />
            <span className="uppercase tracking-wider font-medium">AI Prompt Architect (1-Click Enhancers)</span>
            {showArchitect ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
          </button>

          {showArchitect && (
            <div className="flex items-center gap-1 text-[11px]">
              {(['lighting', 'camera', 'render', 'atmosphere'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-white/15 text-white font-medium border border-white/10'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {showArchitect && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {architectTokens[activeCategory].map((token) => (
              <button
                key={token}
                onClick={() => handleAppendToken(token)}
                className="px-2.5 py-1 rounded-lg bg-[#0C101A] hover:bg-[#141A28] border border-[#1A2234] hover:border-[#A5C4F2]/50 text-xs text-zinc-300 hover:text-white font-mono transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-[#E5A866]" />
                <span>{token}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Style Chips Carousel */}
      <div className="space-y-2 pt-1 border-t border-[#141822]">
        <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#A5C4F2]" />
            ARTISTIC MEDIUM & STYLE
          </span>
          <span className="text-white font-medium">{selectedImageStyle}</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {IMAGE_STYLES.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedImageStyle(st.name)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all text-left cursor-pointer ${
                selectedImageStyle === st.name
                  ? 'bg-white/15 border-white text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="font-semibold">{st.name}</div>
              <div className="text-[10px] text-zinc-500 line-clamp-1 max-w-[140px]">{st.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Negative Prompt Accordion */}
      <div className="pt-2 border-t border-[#141822] space-y-2.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowNegative(!showNegative)}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-zinc-500" />
            <span>NEGATIVE PROMPT (WHAT TO AVOID)</span>
            {showNegative ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showNegative && (
            <button
              type="button"
              onClick={handleAutoFillNegative}
              className="text-[11px] font-mono text-[#E5A866] hover:underline cursor-pointer"
            >
              ⚡ AI Auto-Fill Filters
            </button>
          )}
        </div>

        {showNegative && (
          <div className="space-y-2.5 pt-1">
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="e.g. blurry, low quality, deformed limbs, watermark, artifacts..."
              className="w-full bg-[#040608] border border-[#1A1F2C] focus:border-red-400/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
            />

            {/* Quick Negative Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-zinc-500 mr-1">Quick Filters:</span>
              {quickNegativeTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddNegativeTag(tag)}
                  className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
