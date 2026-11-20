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

  const [selectedModel, setSelectedModel] = useState('ONe Omni-4 Cinema');
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
    <div className="flex flex-col h-full bg-[#040608]">
      {/* Chat Area Header */}
      <div className="flex items-center justify-between h-14 px-5 border-b border-[#141822] bg-[#05070C]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onOpenSidebarMobile}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg lg:hidden cursor-pointer"
            title="Toggle chat history"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex flex-col min-w-0 font-mono">
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-widest uppercase truncate">
              {activeConv ? activeConv.title : 'Cinematic Scripting Session'}
            </h2>
            <span className="text-[10px] text-zinc-500 truncate">
              {activeConv?.messages.length || 0} MESSAGES • 03 // DIRECTOR DIALOGUE
            </span>
          </div>
        </div>

        {/* Model Picker & Export */}
        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              addToast({ type: 'info', title: 'Model Switched', message: e.target.value });
            }}
            className="bg-[#080A10] border border-[#181C26] text-zinc-200 text-xs rounded-full px-3 py-1.5 focus:outline-none focus:border-[#A5C4F2] font-mono cursor-pointer"
          >
            <option value="ONe Omni-4 Cinema">ONe Omni-4 Cinema (Default)</option>
            <option value="ONe WorldBuilder 3D">ONe WorldBuilder 3D</option>
            <option value="ONe Fast-Draft 2.0">ONe Fast-Draft 2.0</option>
          </select>

          <button
            onClick={handleExportChat}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full capsule-control transition-colors cursor-pointer"
            title="Export conversation"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
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

        {/* Simulated AI Typing Indicator */}
        {isAiTyping && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0f0f0f] border border-[#1f1f1f] text-xs font-mono text-zinc-400">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-brand-yellow/40 flex items-center justify-center text-brand-yellow animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-white font-medium">ONe Omni-4 Director is analyzing scene tokens...</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-bounce [animation-delay:0.4s]" />
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

      {/* Composer Toolbar */}
      <ChatComposer onSendMessage={(text, attachments) => sendMessage(text, attachments)} disabled={isAiTyping} />
    </div>
  );
};
