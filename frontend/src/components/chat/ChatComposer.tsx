import React, { useState, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Wand2, 
  Sparkles, 
  X, 
  Radio, 
  FileText, 
  Image as ImageIcon 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface ChatComposerProps {
  onSendMessage: (text: string, attachments?: any[]) => void;
  disabled?: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [attachments, setAttachments] = useState<{ name: string; type: string }[]>([]);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const addToast = useAppStore((state) => state.addToast);

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordTimer(0);
    addToast({ type: 'info', title: 'Listening...', message: 'Speak your cinematic concept or prompt.' });

    let count = 0;
    timerRef.current = window.setInterval(() => {
      count++;
      setRecordTimer(count);
      if (count >= 5) {
        stopVoiceRecording(true);
      }
    }, 1000);
  };

  const stopVoiceRecording = (autoSubmit = false) => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const simulatedTranscripts = [
      'Generate a 3-scene establishing sequence of an orbital shipyard orbiting Saturn with golden asteroid rings.',
      'A cybernetic ronin standing under torrential neon rain in Neo-Shinjuku, reflections on chrome blade.',
      'Extreme close-up of a hypercar digital speedometer climbing past 250 miles per hour with laser headlamps.',
    ];
    const picked = simulatedTranscripts[Math.floor(Math.random() * simulatedTranscripts.length)];
    setText((prev) => (prev ? prev + ' ' + picked : picked));
    addToast({ type: 'success', title: 'Voice Transcribed', message: `Captured: "${picked.slice(0, 40)}..."` });

    if (autoSubmit) {
      onSendMessage(picked, attachments.length > 0 ? attachments : undefined);
      setAttachments([]);
      setText('');
    }
  };

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    onSendMessage(text, attachments.length > 0 ? attachments : undefined);
    setText('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMagicEnhance = () => {
    if (!text.trim()) {
      addToast({ type: 'warning', title: 'Empty text', message: 'Enter a script or idea to enhance.' });
      return;
    }
    const enhanced = `Cinematic master script: ${text.trim()}. Anamorphic 35mm lens, volumetric amber rim lighting (#FFD600), high dynamic range, photorealistic 8K render.`;
    setText(enhanced);
    addToast({ type: 'success', title: 'Script Enhanced!' });
  };

  const handleAddMockAttachment = (type: 'image' | 'doc') => {
    if (type === 'image') {
      setAttachments((prev) => [
        ...prev,
        { name: 'cyberpunk_moodboard_ref.png', type: 'image/png' },
      ]);
    } else {
      setAttachments((prev) => [
        ...prev,
        { name: 'scene_screenplay_v2.pdf', type: 'application/pdf' },
      ]);
    }
    setIsAttachmentOpen(false);
    addToast({ type: 'info', title: 'File Attached', message: 'Simulated reference file added to context.' });
  };

  return (
    <div className="relative p-3 sm:p-5 bg-[#040608] border-t border-[#141822] space-y-2">
      {/* Voice Recording Active Overlay */}
      {isRecording && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#E5A866]/15 border border-[#E5A866]/40 text-[#E5A866] animate-pulse">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-[#E5A866] animate-ping" />
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white font-mono">Audio Waveform Visualizer Listening...</span>
              <div className="flex items-center gap-1 h-3">
                {[40, 70, 95, 60, 85, 45, 100, 75, 50, 90, 65].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-[#E5A866] rounded-full transition-all duration-150"
                    style={{ height: `${(h * (recordTimer % 2 === 0 ? 1 : 0.6))}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-white">00:0{recordTimer}</span>
            <button
              onClick={() => stopVoiceRecording(false)}
              className="px-3 py-1 rounded-full bg-[#E5A866] text-black font-semibold text-xs hover:brightness-110 cursor-pointer"
            >
              Finish
            </button>
          </div>
        </div>
      )}

      {/* Attachments preview pill */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((att, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E121A] border border-[#1F2533] text-xs text-zinc-300 font-mono"
            >
              <Paperclip className="w-3 h-3 text-[#A5C4F2]" />
              <span className="truncate max-w-[150px]">{att.name}</span>
              <button
                onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                className="hover:text-rose-400 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Composer Box */}
      <div className="relative rounded-3xl bg-[#080A10] border border-[#181C26] focus-within:border-[#A5C4F2]/50 transition-colors shadow-2xl">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for scene scripts, camera directions, lighting parameters or ideas..."
          disabled={disabled || isRecording}
          className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed font-sans"
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#141822] bg-[#06080E]/90 rounded-b-3xl">
          <div className="flex items-center gap-2">
            {/* Attachment dropdown button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                title="Attach reference file"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {isAttachmentOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-48 rounded-2xl bg-[#0B0E16] border border-[#1C212E] shadow-2xl p-2 z-30 space-y-1 font-mono text-xs">
                  <button
                    onClick={() => handleAddMockAttachment('image')}
                    className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#A5C4F2]" />
                    <span>Reference Image</span>
                  </button>
                  <button
                    onClick={() => handleAddMockAttachment('doc')}
                    className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#E5A866]" />
                    <span>Screenplay PDF/TXT</span>
                  </button>
                </div>
              )}
            </div>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={isRecording ? () => stopVoiceRecording(false) : startVoiceRecording}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isRecording
                  ? 'text-[#E5A866] bg-[#E5A866]/20 animate-pulse'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              title="Voice dictation"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Magic Enhancer Button */}
            <button
              type="button"
              onClick={handleMagicEnhance}
              className="p-1.5 text-zinc-400 hover:text-[#E5A866] rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              title="Enhance prompt"
            >
              <Wand2 className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Enter hint & Send button */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[10px] font-mono text-zinc-600">
              Shift + Enter for newline
            </span>
            <button
              type="button"
              onClick={handleSend}
              disabled={(!text.trim() && attachments.length === 0) || disabled}
              className="pill-action flex items-center justify-center p-2 rounded-full cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
