import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2, 
  MessageSquare, 
  ArrowUpRight, 
  Zap,
  Bot
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UniversalInput: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const createConversation = useAppStore((state) => state.createConversation);
  const addToast = useAppStore((state) => state.addToast);

  const samplePrompts = [
    'Is a tomato considered a fruit botanically vs culinarily?',
    'What color is the sky during severe tornado storm conditions?',
    'Explain Daniel Kahneman System-1 fast thinking vs System-2 deep reasoning',
    'Write a TypeScript debounce function with generic types and cancel() method',
  ];

  const handleMagicEnhance = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      addToast({ type: 'warning', title: 'Enter a prompt first', message: 'Type a query or topic to optimize it.' });
      return;
    }
    setIsEnhancing(true);
    addToast({ type: 'info', title: 'Optimizing Query', message: 'Structuring for Jev System-1 intent & reasoning allocation...' });

    setTimeout(() => {
      const enhanced = `Analyze from first principles: ${prompt.trim()}. Provide taxonomy verification, concrete code/architecture specifications where applicable, and edge case breakdowns.`;
      setPrompt(enhanced);
      setIsEnhancing(false);
      addToast({ type: 'success', title: 'Prompt Optimized', message: 'Structured for Dual-Brain AI pipeline.' });
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    createConversation(prompt);
    navigate('/chat');
  };

  return (
    <div className="relative rounded-3xl bg-[#080A10] border border-[#181C26] p-5 sm:p-7 shadow-2xl space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141822] pb-4">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
          <span className="text-white font-semibold tracking-wider uppercase">UNIVERSAL AI PROMPT LAUNCHER</span>
          <span className="text-[10px] text-zinc-500 hidden sm:inline">• JEV &lt;100MS + INKLING 1M TOKENS</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span>Target:</span>
          <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Dual-Brain Studio
          </span>
        </div>
      </div>

      {/* Form Input Container */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask a question, verify a proposition with Noul, or generate complex code..."
          className="w-full bg-[#05070C] border border-[#181C26] focus:border-[#A5C4F2]/50 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-white placeholder:text-zinc-600 focus:outline-none transition-all resize-none shadow-inner"
        />

        {/* Input Bar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          {/* Quick Enhance Tool */}
          <button
            type="button"
            onClick={handleMagicEnhance}
            disabled={isEnhancing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <Wand2 className={`w-3.5 h-3.5 text-[#E5A866] ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>Optimize Prompt</span>
          </button>

          {/* Submit Action */}
          <button
            type="submit"
            className="aura-glow-button pill-action flex items-center gap-2 px-6 py-2.5 rounded-full font-sans font-semibold text-xs tracking-wide cursor-pointer transition-transform hover:scale-105"
          >
            <Bot className="w-4 h-4 text-black" />
            <span>Synthesize in AI Chat</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* Inspiration Quick Pills */}
      <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
          <Zap className="w-3 h-3 text-brand-yellow" />
          Quick Test Ideas:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setPrompt(p)}
            className="text-left text-[11px] px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer truncate max-w-xs"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};
