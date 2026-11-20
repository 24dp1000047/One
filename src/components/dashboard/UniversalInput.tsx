import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2, 
  Video, 
  MessageSquare, 
  ArrowUpRight, 
  Flame
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UniversalInput: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'video' | 'chat'>('video');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const setStudioPrompt = useAppStore((state) => state.setStudioPrompt);
  const createConversation = useAppStore((state) => state.createConversation);
  const addToast = useAppStore((state) => state.addToast);

  const samplePrompts = [
    'A cybernetic traveler walking through a rain-soaked neon canyon in Tokyo 2099',
    'Bioluminescent flora glowing with cyan and gold under twin moons, macro 8K',
    'Matte-black hypercar speeding through a subterranean light tunnel at 200mph',
    'Levitating ancient pagoda chained to an asteroid above clouds, anime style',
  ];

  const handleMagicEnhance = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      addToast({ type: 'warning', title: 'Enter a prompt first', message: 'Type an idea to enhance it with cinematic tags.' });
      return;
    }
    setIsEnhancing(true);
    addToast({ type: 'info', title: 'Magic Enhancer', message: 'Injecting cinematic lighting & camera vectors...' });

    setTimeout(() => {
      const enhanced = `Cinematic 8K anamorphic capture of ${prompt.trim()}, volumetric neon haze, obsidian reflections (#040608) with radiant amber highlights (#E5A866), 35mm lens, Unreal Engine 5.4 Lumen lighting.`;
      setPrompt(enhanced);
      setIsEnhancing(false);
      addToast({ type: 'success', title: 'Prompt Enhanced', message: 'Cinematic master tokens added!' });
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (mode === 'video') {
      setStudioPrompt(prompt);
      navigate('/studio');
    } else {
      createConversation(prompt);
      navigate('/chat');
    }
  };

  return (
    <div className="relative rounded-3xl bg-[#080A10] border border-[#181C26] p-5 sm:p-7 shadow-2xl space-y-4">
      {/* Top Header: Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141822] pb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-full capsule-control">
          <button
            type="button"
            onClick={() => setMode('video')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              mode === 'video'
                ? 'bg-white/15 text-white font-medium border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#A5C4F2]" />
            <span>Create Video</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('chat')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              mode === 'chat'
                ? 'bg-white/15 text-white font-medium border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#E5A866]" />
            <span>Chat & Script</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#8A94A6]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5A866] animate-pulse" />
          <span>UNIVERSAL PROMPT MATRIX</span>
        </div>
      </div>

      {/* Input Field Form */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === 'video'
              ? 'Describe your cinematic scene... e.g. "Cybernetic astronaut walking across liquid gold dunes under a red giant star, 8K photoreal"'
              : 'Ask the AI Director for scene scripts, camera directions, lighting parameters or creative worldbuilding...'
          }
          className="w-full bg-[#05070C] border border-[#181C26] focus:border-[#A5C4F2]/50 rounded-2xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed font-sans"
        />

        {/* Action Buttons along bottom of input */}
        <div className="flex items-center justify-between pt-3">
          {/* Magic Enhancer Button */}
          <button
            type="button"
            onClick={handleMagicEnhance}
            disabled={isEnhancing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0E121A] hover:bg-[#151B27] border border-[#1F2533] hover:border-[#E5A866]/40 text-xs text-[#E5A866] font-mono transition-all cursor-pointer"
            title="Enhance prompt with cinematic descriptors"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Enhancing...' : 'Magic Enhance'}</span>
          </button>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="pill-action flex items-center gap-2 px-6 py-2 rounded-full font-sans font-semibold text-xs tracking-wide cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>{mode === 'video' ? 'Synthesize Video' : 'Begin Chat'}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* Quick Starter Suggestions */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2 font-mono">
          <Flame className="w-3.5 h-3.5 text-[#E5A866]" />
          <span>Trending Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(sample)}
              className="text-left text-xs px-3 py-1.5 rounded-xl bg-[#0B0E16] hover:bg-[#121622] border border-[#181C26] hover:border-[#A5C4F2]/40 text-zinc-300 hover:text-white transition-all truncate max-w-xs font-mono"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
