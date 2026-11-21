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
  Layers,
  Zap,
  ChevronDown,
  ChevronUp
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
  const [showJevDetails, setShowJevDetails] = useState(true);
  const settings = useAppStore((state) => state.settings);
  const setStudioPrompt = useAppStore((state) => state.setStudioPrompt);
  const setStudioMode = useAppStore((state) => state.setStudioMode);
  const regenerateLastMessage = useAppStore((state) => state.regenerateLastMessage);
  const sendMessage = useAppStore((state) => state.sendMessage);
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
                {message.model ? message.model.replace('thinkingmachines/', '') : 'Thinking Machines Inkling'}
              </span>
            )}
            {!isUser && message.jevDecision && (
              <button
                onClick={() => setShowJevDetails(!showJevDetails)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-medium flex items-center gap-1 transition-all cursor-pointer"
                title="Click to view Jev System-1 Decision details"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>⚡ Jev:</span>
                <span className="capitalize">{message.jevDecision.intent.replace(/_/g, ' ')}</span>
                <span className="text-emerald-400/80 font-mono">({message.jevDecision.latencyMs}ms)</span>
                {showJevDetails ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
              </button>
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

        {/* Jev System-1 Telemetry Card */}
        {!isUser && message.jevDecision && showJevDetails && (
          <div className="my-2.5 p-3.5 rounded-xl bg-[#060A08] border border-emerald-500/40 font-mono text-xs shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-emerald-500/20 text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                TypeSafe AI Jev — System-1 Decision Engine
              </span>
              <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ⚡ {message.jevDecision.latencyMs} ms (&lt;100ms Forward-Pass)
              </span>
            </div>

            {/* Primitive 1: Noul Truth Evaluation (% True Meter) */}
            {message.jevDecision.primitiveType === 'noul' && message.jevDecision.noulResult && (
              <div className="space-y-3 p-3 rounded-lg bg-black/60 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-xs font-sans">
                    Question: <strong className="text-white font-mono">{message.jevDecision.noulResult.question}</strong>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    TypeSafe Noul
                  </span>
                </div>

                {/* Animated Truth Score Meter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Truth Score:</span>
                    <span className="text-amber-400 font-bold text-sm">
                      {message.jevDecision.noulResult.truthScorePercent}% TRUE
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-[#181818] rounded-full overflow-hidden border border-[#282828] p-0.5 flex">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-700"
                      style={{ width: `${message.jevDecision.noulResult.truthScorePercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                    <span>0% (False)</span>
                    <span className="text-zinc-400">Verdict: {message.jevDecision.noulResult.verdict}</span>
                    <span>100% (True)</span>
                  </div>
                </div>

                {/* Criteria */}
                <div className="p-2 rounded bg-[#0A0E0C] border border-emerald-500/10 text-[11px] text-zinc-300">
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider mb-0.5">Evaluation Rubric / Criteria</span>
                  {message.jevDecision.noulResult.criteria}
                </div>
              </div>
            )}

            {/* Primitive 2: Choice Probability Distribution */}
            {message.jevDecision.primitiveType === 'choice' && message.jevDecision.choiceResult && (
              <div className="space-y-3 p-3 rounded-lg bg-black/60 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-xs font-sans">
                    Question: <strong className="text-white font-mono">{message.jevDecision.choiceResult.question}</strong>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    TypeSafe Choice
                  </span>
                </div>

                {message.jevDecision.choiceResult.condition && (
                  <div className="text-[11px] text-zinc-400">
                    State Condition: <code className="text-amber-300 bg-white/5 px-1.5 py-0.5 rounded font-mono">{message.jevDecision.choiceResult.condition}</code>
                  </div>
                )}

                {/* Probability Distribution Bars */}
                <div className="space-y-2 pt-1">
                  {message.jevDecision.choiceResult.options.map((opt, oIdx) => (
                    <div key={oIdx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className={opt.label === message.jevDecision?.choiceResult?.winningChoice ? 'text-emerald-300 font-bold' : 'text-zinc-400'}>
                          {opt.label === message.jevDecision?.choiceResult?.winningChoice ? '✓ ' : '• '}{opt.label}
                        </span>
                        <span className="text-zinc-300 font-bold">{opt.probabilityPercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#181818] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            opt.label === message.jevDecision?.choiceResult?.winningChoice
                              ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                              : 'bg-zinc-600'
                          }`}
                          style={{ width: `${opt.probabilityPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primitive 3: Standard Classifier Telemetry */}
            {message.jevDecision.primitiveType === 'classifier' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-black/50 border border-emerald-500/15">
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Detected Intent</span>
                  <span className="text-emerald-300 font-bold capitalize">
                    {message.jevDecision.intent.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-emerald-500/15">
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Complexity</span>
                  <span className="text-amber-300 font-bold capitalize">
                    {message.jevDecision.complexity}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-emerald-500/15">
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Confidence</span>
                  <span className="text-cyan-300 font-bold">
                    {(message.jevDecision.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-emerald-500/15">
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Reasoning Budget</span>
                  <span className="text-purple-300 font-bold capitalize">
                    {message.jevDecision.reasoningBudget}
                  </span>
                </div>
              </div>
            )}

            {/* Transition Link to System 2 */}
            <div className="mt-2.5 pt-2 border-t border-emerald-500/15 flex items-center justify-between text-[10.5px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">↳ ⚡ System-1 Result:</span>
                <span>Calibrated {message.jevDecision.reasoningBudget} reasoning constraints in <strong>{message.jevDecision.latencyMs}ms</strong></span>
              </span>
              <span className="text-zinc-500 hidden sm:inline font-mono">Routing to Thinking Machines Inkling →</span>
            </div>
          </div>
        )}

        {/* Stage 2 Header for Assistant */}
        {!isUser && (
          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-zinc-400">
            <span className="px-2 py-0.5 rounded bg-brand-yellow/10 border border-brand-yellow/25 text-brand-yellow font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-yellow" />
              Stage 2: Thinking Machines Inkling (Deep Reasoning)
            </span>
          </div>
        )}

        {/* Content */}
        <div className="text-xs sm:text-sm text-zinc-200">
          {renderFormattedContent(message.content)}
        </div>

        {/* Suggested Follow-Up Questions (Smart Next Steps) */}
        {!isUser && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="pt-2.5 space-y-1.5">
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Suggested Next Questions (Click to Ask):</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {message.suggestedFollowUps.map((question, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => sendMessage(question)}
                  className="text-left text-xs px-3 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1f283d] text-zinc-300 hover:text-white border border-[#232a3d] hover:border-brand-yellow/50 transition-all flex items-center gap-1.5 group cursor-pointer shadow-sm"
                  title="Click to automatically ask this question"
                >
                  <span className="text-brand-yellow group-hover:scale-125 transition-transform">💡</span>
                  <span>{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
