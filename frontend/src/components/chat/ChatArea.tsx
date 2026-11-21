import React, { useRef, useEffect, useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  SlidersHorizontal, 
  Download, 
  Trash2, 
  Film,
  Menu
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatComposer } from './ChatComposer';
import { SUGGESTED_CHAT_PROMPTS } from '../../data/mockData';

interface ChatAreaProps {
  onOpenSidebarMobile?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onOpenSidebarMobile }) => {
  const activeId = useAppStore((state) => state.activeConversationId);
  const conversations = useAppStore((state) => state.conversations);
  const isAiTyping = useAppStore((state) => state.isAiTyping);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const addToast = useAppStore((state) => state.addToast);

  const [selectedModel, setSelectedModel] = useState('ONᵉ Omni-4 Cinema');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConv?.messages, isAiTyping]);

  const handleExportChat = () => {
    if (!activeConv) return;
    const jsonStr = JSON.stringify(activeConv, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConv.title.replace(/\s+/g, '_')}_transcript.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Exported Chat Transcript' });
  };

  return (
    <div className="flex flex-col h-full bg-[#171A21]">
      {/* Chat Area Header */}
      <div className="flex items-center justify-between h-14 px-5 border-b border-[#2A475E]/70 bg-[#171D25] backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onOpenSidebarMobile}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg lg:hidden cursor-pointer"
            title="Toggle chat history"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex flex-col min-w-0 font-mono">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase truncate">
                DUAL-BRAIN AI STUDIO
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Jev + Inkling Pipeline
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 truncate">
              SYSTEM 1: TYPESAFE JEV (&lt;100MS) • SYSTEM 2: THINKING MACHINES INKLING
            </span>
          </div>
        </div>

        {/* Engine Indicators & Export */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 font-mono text-[10px]">
            <span className="px-2 py-1 rounded bg-[#0A120D] text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span>⚡ Jev:</span>
              <span className="text-zinc-400">&lt;100ms Decisions</span>
            </span>
            <span className="px-2 py-1 rounded bg-[#101018] text-brand-yellow border border-brand-yellow/30 flex items-center gap-1">
              <span>🧠 Inkling:</span>
              <span className="text-zinc-400">Deep Reasoning</span>
            </span>
          </div>

          <button
            onClick={handleExportChat}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full capsule-control transition-colors cursor-pointer"
            title="Export conversation"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Test Benchmarks Bar (TypeSafe Jev & Inkling Live Decision Tests) */}
      <div className="px-4 py-2 border-b border-[#141822] bg-[#07090F]/90 flex items-center gap-2 overflow-x-auto text-xs font-mono scrollbar-none">
        <span className="text-[10px] text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1 font-bold">
          <Sparkles className="w-3 h-3 text-brand-yellow" />
          Quick Test Benchmarks:
        </span>
        {[
          { label: '🍦 Ice Cream Sandwich? (Jev Noul)', prompt: 'Is an ice cream sandwich a sandwich?' },
          { label: '🌭 Hotdog a Sandwich? (Jev Noul)', prompt: 'Is a hotdog a sandwich?' },
          { label: '🌪️ Tornado Sky Color? (Jev Choice)', prompt: 'What color is the sky when a tornado is coming?' },
          { label: '🍅 Tomato: Fruit or Veggie? (Jev Noul)', prompt: 'Is a tomato a fruit?' },
          { label: '⚡ Debounce in TypeScript (Inkling Reasoning)', prompt: 'Write a TypeScript debounce function with leading and trailing options' },
          { label: '🎬 Cyberpunk Noir Scene (Creative Budget)', prompt: 'Design an atmospheric cyberpunk alley scene with anamorphic 35mm lens and volumetric sodium vapor lighting' },
        ].map((benchmark, bIdx) => (
          <button
            key={bIdx}
            disabled={isAiTyping}
            onClick={() => sendMessage(benchmark.prompt)}
            className="px-2.5 py-1 rounded-lg bg-[#111622] hover:bg-[#1a2336] border border-[#20293d] hover:border-emerald-400/50 text-zinc-300 hover:text-white shrink-0 transition-all text-[11px] cursor-pointer shadow-sm active:scale-95"
            title={`Run live benchmark: "${benchmark.prompt}"`}
          >
            {benchmark.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {activeConv?.messages.map((message, idx) => {
          const isLastAssistant =
            message.role === 'assistant' &&
            idx === activeConv.messages.length - 1;

          return (
            <ChatMessageItem
              key={message.id}
              message={message}
              isLastAssistantMessage={isLastAssistant}
            />
          );
        })}

        {/* Dual-Brain Execution Indicator */}
        {isAiTyping && (
          <div className="p-4 rounded-xl bg-[#070A0F] border border-[#182236] text-xs font-mono text-zinc-300 shadow-xl space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#182236] pb-2">
              <span className="flex items-center gap-2 text-white font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Dual-Brain Pipeline In Progress...
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Live Forward Pass</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#0A120D] border border-emerald-500/30 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <div>
                  <span className="text-emerald-400 font-bold block">1. TypeSafe AI Jev (System 1)</span>
                  <span className="text-zinc-400 text-[10px]">Evaluating Noul/Choice decision (&lt;100ms)</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#101018] border border-brand-yellow/30 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-yellow animate-bounce [animation-delay:0.3s]" />
                <div>
                  <span className="text-brand-yellow font-bold block">2. Thinking Machines Inkling (System 2)</span>
                  <span className="text-zinc-400 text-[10px]">Deep reasoning & synthesis</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Prompts if conversation has <= 2 messages */}
        {activeConv && activeConv.messages.length <= 2 && (
          <div className="pt-4 border-t border-[#1a1a1a] space-y-2.5">
            <span className="text-xs font-mono text-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
              Suggested Creative Prompts:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_CHAT_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="p-3 text-left rounded-xl bg-[#121212] hover:bg-[#181818] border border-[#222222] hover:border-brand-yellow/40 text-xs text-zinc-300 hover:text-white transition-all shadow-sm"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Director Prompt Matrix */}
      <div className="px-4 py-2 border-t border-[#141822] bg-[#07090F]/80 flex items-center gap-2 overflow-x-auto text-xs font-mono scrollbar-none">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#E5A866]" />
          Director Tools:
        </span>
        {[
          { label: '3-Shot Sequence Breakdown', prompt: 'Break down an epic cinematic scene into 3 sequential shots with exact camera motion, duration, and lighting.' },
          { label: '35mm Anamorphic Camera Vectors', prompt: 'Calibrate optical specs: 35mm anamorphic prime lens, f/2.8 bokeh, 45 degree key light azimuth, low angle push.' },
          { label: 'Atmospheric Rain & Foley Audio', prompt: 'Describe the atmospheric foley and sound design: 40Hz sub-drone, rain on wet asphalt, resonant synth chords.' },
          { label: 'High-Contrast Noir LUT Palette', prompt: 'Suggest color grading parameters: Humanon Noir obsidian matrix, -15 cool temperature, 35% vignette.' },
        ].map((chip, idx) => (
          <button
            key={idx}
            disabled={isAiTyping}
            onClick={() => sendMessage(chip.prompt)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white shrink-0 transition-colors text-[11px] cursor-pointer"
          >
            + {chip.label}
          </button>
        ))}
      </div>

      {/* Composer Toolbar */}
      <ChatComposer onSendMessage={(text, attachments) => sendMessage(text, attachments)} disabled={isAiTyping} />
    </div>
  );
};
