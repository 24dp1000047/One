import React from 'react';
import { Wand2, Layers, Copy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { VIDEO_STYLES } from '../../data/mockData';

export const PromptEditor: React.FC = () => {
  const prompt = useAppStore((state) => state.studioPrompt);
  const setPrompt = useAppStore((state) => state.setStudioPrompt);
  const selectedStyle = useAppStore((state) => state.selectedStyle);
  const setSelectedStyle = useAppStore((state) => state.setSelectedStyle);
  const isEnhancing = useAppStore((state) => state.isEnhancingPrompt);
  const enhancePrompt = useAppStore((state) => state.enhanceStudioPrompt);
  const generateStoryboard = useAppStore((state) => state.generateStoryboardFromPrompt);
  const addToast = useAppStore((state) => state.addToast);

  const styleChips = VIDEO_STYLES;

  return (
    <div className="space-y-4">
      {/* Editor Container */}
      <div className="rounded-3xl bg-[#080A10] border border-[#181C26] focus-within:border-[#A5C4F2]/50 transition-all p-5 shadow-2xl">
        {/* Header with Title & Char count */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#141822] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-widest uppercase">SCENE PROMPT</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#A5C4F2] border border-white/10">
              LUMEN 4K
            </span>
          </div>
          <span className="text-zinc-500 font-mono text-[11px]">{prompt.length} CHARACTERS</span>
        </div>

        {/* Textarea */}
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the environment, subject, lighting, and camera action..."
          className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed font-sans"
        />

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#141822]">
          <div className="flex items-center gap-2">
            {/* Magic Prompt Enhancer Button */}
            <button
              type="button"
              onClick={enhancePrompt}
              disabled={isEnhancing}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E121A] hover:bg-[#151B27] border border-[#1F2533] hover:border-[#E5A866]/40 text-xs text-[#E5A866] font-mono transition-all cursor-pointer disabled:opacity-50"
              title="Transform basic prompt into cinematic 8K prompt"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Enhancing...' : 'Magic Prompt Enhancer'}</span>
            </button>

            {/* Prompt to Storyboard Button */}
            <button
              type="button"
              onClick={() => generateStoryboard(prompt)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
              title="Auto-break prompt into multiple scene cards"
            >
              <Layers className="w-3.5 h-3.5 text-[#A5C4F2]" />
              <span>Prompt to Storyboard</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(prompt);
              addToast({ type: 'success', title: 'Prompt copied' });
            }}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            title="Copy prompt"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Style Chips Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-400 tracking-widest uppercase flex items-center justify-between">
          <span>Animation & Visual Style</span>
          <span className="text-[11px] text-[#A5C4F2] font-mono font-medium">{selectedStyle}</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {styleChips.map((s) => {
            const isSelected = selectedStyle === s.name;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStyle(s.name)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 border-[#A5C4F2]/60 text-white shadow-sm'
                    : 'bg-[#080A10] border-[#181C26] text-zinc-400 hover:bg-[#0E121A] hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white tracking-wide truncate">{s.name}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500 line-clamp-1 leading-snug font-mono">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
