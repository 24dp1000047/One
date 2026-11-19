import React from 'react';
import { Wand2, Layers, Sparkles, Copy, RefreshCw } from 'lucide-react';
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
      <div className="rounded-2xl bg-[#141414] border border-[#262626] focus-within:border-brand-yellow/60 transition-all p-4 shadow-xl">
        {/* Header with Title & Char count */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#202020] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide">Scene Prompt</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1e1e] text-brand-yellow border border-[#2d2d2d]">
              Cinema-v2 Engine
            </span>
          </div>
          <span className="text-muted font-mono text-[11px]">{prompt.length} chars</span>
        </div>

        {/* Textarea */}
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the environment, subject, lighting, and camera action..."
          className="w-full bg-transparent text-sm text-white placeholder-muted focus:outline-none resize-none leading-relaxed"
        />

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-2">
            {/* Magic Prompt Enhancer Button */}
            <button
              type="button"
              onClick={enhancePrompt}
              disabled={isEnhancing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-orange/20 to-brand-yellow/20 hover:from-brand-orange hover:to-brand-yellow text-brand-orange hover:text-black border border-brand-orange/40 hover:border-transparent text-xs font-semibold tracking-wide transition-all shadow-glow-orange-sm active:scale-95 disabled:opacity-50"
              title="Transform basic prompt into cinematic 8K prompt"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Enhancing...' : 'Magic Prompt Enhancer'}</span>
            </button>

            {/* Prompt to Storyboard Button */}
            <button
              type="button"
              onClick={() => generateStoryboard(prompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2d2d2d] text-zinc-300 hover:text-white text-xs font-medium transition-all"
              title="Auto-break prompt into multiple scene cards"
            >
              <Layers className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Prompt to Storyboard</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(prompt);
              addToast({ type: 'success', title: 'Prompt copied' });
            }}
            className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Copy prompt"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Style Chips Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300 tracking-wide flex items-center justify-between">
          <span>Animation & Visual Style</span>
          <span className="text-[11px] text-brand-yellow font-mono">{selectedStyle}</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {styleChips.map((s) => {
            const isSelected = selectedStyle === s.name;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStyle(s.name)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-brand-yellow/15 border-brand-yellow/60 text-white shadow-glow-yellow-sm'
                    : 'bg-[#121212] border-[#222222] text-zinc-400 hover:bg-[#181818] hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white tracking-wide truncate">{s.name}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
                <p className="text-[10px] text-muted line-clamp-1 leading-snug">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
