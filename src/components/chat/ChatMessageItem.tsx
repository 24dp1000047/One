import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  Video, 
  Bot, 
  User, 
  Code2, 
  Sparkles,
  Move3d,
  Layers
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface ChatMessageItemProps {
  message: ChatMessage;
  isLastAssistantMessage?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isLastAssistantMessage = false,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const settings = useAppStore((state) => state.settings);
  const setStudioPrompt = useAppStore((state) => state.setStudioPrompt);
  const setStudioMode = useAppStore((state) => state.setStudioMode);
  const regenerateLastMessage = useAppStore((state) => state.regenerateLastMessage);
  const addToast = useAppStore((state) => state.addToast);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    addToast({ type: 'success', title: 'Copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToStudio = (promptPayload?: string) => {
    const text = promptPayload || message.content;
    setStudioPrompt(text);
    addToast({
      type: 'success',
      title: 'Prompt Sent to Studio',
      message: 'Opening Text-to-Video Studio with this script.',
    });
    navigate('/studio');
  };

  // Helper to format simulated markdown text (headers, bold, code blocks, lists)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          elements.push(
            <div key={`code-${idx}`} className="my-2.5 rounded-xl bg-[#080808] border border-[#242424] overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#141414] border-b border-[#242424] text-[11px] text-muted">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Code2 className="w-3.5 h-3.5 text-brand-yellow" />
                  Script Spec / Parameters
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeBuffer.join('\n'));
                    addToast({ type: 'success', title: 'Code copied' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="p-3 text-emerald-400 overflow-x-auto leading-relaxed">
                <code>{codeBuffer.join('\n')}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          // Open code block
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="text-sm font-bold text-white mt-3 mb-1 tracking-wide">
            {line.replace('### ', '')}
          </h4>
        );
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h3 key={idx} className="text-base font-bold text-brand-yellow mt-4 mb-1 tracking-wide">
            {line.replace('## ', '')}
          </h3>
        );
        return;
      }

      // Bullet lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        elements.push(
          <li key={idx} className="ml-4 list-disc text-zinc-300 my-0.5 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(itemText) }} />
          </li>
        );
        return;
      }

      // Numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numberedMatch) {
        elements.push(
          <div key={idx} className="flex items-start gap-2 text-zinc-300 my-1 leading-relaxed">
            <span className="font-mono text-brand-yellow font-bold shrink-0">{numberedMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(numberedMatch[2]) }} />
          </div>
        );
        return;
      }

      if (line.trim() === '') {
        elements.push(<div key={idx} className="h-2" />);
        return;
      }

      elements.push(
        <p key={idx} className="text-zinc-300 leading-relaxed my-0.5" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    });

    return elements;
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-zinc-200 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#1c1c1c] text-brand-yellow font-mono text-[11px] border border-[#2b2b2b]">$1</code>');
  };

  return (
    <div className={`flex gap-3 sm:gap-4 p-4 rounded-2xl transition-colors ${isUser ? 'bg-[#121212]/80 border border-[#222222]' : 'bg-[#0f0f0f] border border-[#1f1f1f]'}`}>
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <img
            src={settings.avatar}
            alt={settings.name}
            className="w-8 h-8 rounded-full object-cover border border-[#333333]"
          />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-brand-yellow/40 flex items-center justify-center text-brand-yellow shadow-inner">
            <Sparkles className="w-4 h-4 text-brand-yellow" />
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Author Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">
              {isUser ? settings.name : 'ONe Director'}
            </span>
            {!isUser && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30 font-medium">
                Omni-4 Cinema
              </span>
            )}
            <span className="text-[10px] font-mono text-muted">{message.timestamp}</span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1 text-muted hover:text-white rounded hover:bg-white/5 transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {!isUser && isLastAssistantMessage && (
              <button
                onClick={regenerateLastMessage}
                className="p-1 text-muted hover:text-brand-yellow rounded hover:bg-white/5 transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="text-xs sm:text-sm text-zinc-200">
          {renderFormattedContent(message.content)}
        </div>

        {/* Assistant Direct Actions Row */}
        {!isUser && (
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSendToStudio(message.suggestedAction?.payload)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5A866]/20 hover:bg-[#E5A866]/30 text-[#E5A866] border border-[#E5A866]/40 font-medium text-xs transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Send to Studio</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => {
                const text = message.suggestedAction?.payload || message.content;
                setStudioPrompt(text);
                setStudioMode('director3d');
                addToast({
                  type: 'info',
                  title: 'Opening 3D Director',
                  message: 'Calibrating 3D camera rig for this scene.',
                });
                navigate('/studio');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A5C4F2]/15 hover:bg-[#A5C4F2]/25 text-[#A5C4F2] border border-[#A5C4F2]/30 font-medium text-xs transition-colors cursor-pointer"
            >
              <Move3d className="w-3.5 h-3.5" />
              <span>Direct in 3D Rig</span>
            </button>

            <button
              onClick={() => {
                const text = message.suggestedAction?.payload || message.content;
                setStudioPrompt(text);
                setStudioMode('nodes');
                addToast({
                  type: 'info',
                  title: 'Opening Spatial Canvas',
                  message: 'Mapped scene sequence onto creative board.',
                });
                navigate('/studio');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 font-medium text-xs transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Map to Nodes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
