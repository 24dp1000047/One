import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2, 
  Video, 
  MessageSquare, 
  ArrowRight, 
  CornerDownLeft,
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
      const enhanced = `Cinematic 8K anamorphic capture of ${prompt.trim()}, volumetric neon haze, obsidian reflections (#090909) with radiant amber highlights (#FFD600), 35mm lens, Unreal Engine 5.4 Lumen lighting.`;
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
    <div className="relative rounded-2xl bg-[#121212] border border-[#262626] p-4 sm:p-5 shadow-2xl space-y-3.5">
      {/* Top Header: Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f1f1f] pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a0a0a] border border-[#222222]">
          <button
            type="button"
            onClick={() => setMode('video')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'video'
                ? 'bg-brand-yellow text-black font-semibold shadow-glow-yellow-sm'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Create Video</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'chat'
                ? 'bg-brand-yellow text-black font-semibold shadow-glow-yellow-sm'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat & Script</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
          <span>Universal Prompt Engine</span>
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
          className="w-full bg-[#0a0a0a] border border-[#242424] focus:border-brand-yellow/60 rounded-xl p-3.5 text-sm text-white placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-yellow/30 resize-none transition-all leading-relaxed"
        />

        {/* Action Buttons along bottom of input */}
        <div className="flex items-center justify-between pt-2">
          {/* Magic Enhancer Button */}
          <button
            type="button"
            onClick={handleMagicEnhance}
            disabled={isEnhancing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-[#202020] border border-[#2f2f2f] hover:border-brand-orange/50 text-xs text-brand-orange font-medium transition-all"
            title="Enhance prompt with cinematic descriptors"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Enhancing...' : 'Magic Enhance'}</span>
          </button>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-yellow to-brand-orange text-black font-semibold text-xs tracking-wide shadow-glow-yellow-sm hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <span>{mode === 'video' ? 'Synthesize Video' : 'Begin Chat'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick Starter Suggestions */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted mb-2 font-mono">
          <Flame className="w-3.5 h-3.5 text-brand-orange" />
          <span>Trending Inspiration:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(sample)}
              className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-[#161616] hover:bg-[#1f1f1f] border border-[#262626] hover:border-brand-yellow/40 text-zinc-300 hover:text-white transition-all truncate max-w-xs"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
