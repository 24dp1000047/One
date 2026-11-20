import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const FloatingControls: React.FC = () => {
  const isMotionPaused = useAppStore((state) => state.isMotionPaused);
  const toggleMotion = useAppStore((state) => state.toggleMotion);
  const isSoundOn = useAppStore((state) => state.isSoundOn);
  const toggleSound = useAppStore((state) => state.toggleSound);
  const addToast = useAppStore((state) => state.addToast);

  const handleReplay = () => {
    addToast({
      type: 'info',
      title: 'Opening Sequence Replayed',
      message: 'Rebooting ASCII matrix and canvas vectors.',
    });
    // Trigger small window event for visualizer reboot
    window.dispatchEvent(new CustomEvent('matrix-reboot'));
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="flex items-center gap-4 px-4 py-2 rounded-full capsule-control text-xs font-mono text-zinc-300 shadow-2xl transition-all duration-300 hover:border-white/25">
        {/* Sound toggle with equalizer bars */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 hover:text-white transition-colors group cursor-pointer"
          title={isSoundOn ? 'Mute ambient sound' : 'Enable ambient sound'}
        >
          <div className="flex items-end gap-0.5 h-3 w-3.5">
            <span
              className={`w-0.5 bg-zinc-400 group-hover:bg-white rounded-full transition-all ${
                isSoundOn ? 'h-3 animate-[equalizer_0.6s_ease-in-out_infinite_alternate]' : 'h-1'
              }`}
            />
            <span
              className={`w-0.5 bg-zinc-400 group-hover:bg-white rounded-full transition-all ${
                isSoundOn ? 'h-2 animate-[equalizer_0.9s_ease-in-out_infinite_alternate]' : 'h-2'
              }`}
            />
            <span
              className={`w-0.5 bg-zinc-400 group-hover:bg-white rounded-full transition-all ${
                isSoundOn ? 'h-3 animate-[equalizer_0.7s_ease-in-out_infinite_alternate]' : 'h-1.5'
              }`}
            />
            <span
              className={`w-0.5 bg-zinc-400 group-hover:bg-white rounded-full transition-all ${
                isSoundOn ? 'h-1.5 animate-[equalizer_0.8s_ease-in-out_infinite_alternate]' : 'h-2.5'
              }`}
            />
          </div>
          <span className="tracking-widest uppercase text-[11px] font-medium">
            {isSoundOn ? 'SOUND ON' : 'SOUND OFF'}
          </span>
        </button>

        <span className="w-px h-3.5 bg-white/15" />

        {/* Pause/Play motion toggle */}
        <button
          onClick={toggleMotion}
          className="hover:text-white transition-colors cursor-pointer tracking-wider text-[11px]"
        >
          {isMotionPaused ? 'Resume motion' : 'Pause motion'}
        </button>

        <span className="w-px h-3.5 bg-white/15" />

        {/* Replay button */}
        <button
          onClick={handleReplay}
          className="p-1 hover:text-white transition-colors cursor-pointer"
          title="Replay opening sequence"
        >
          <RotateCcw className="w-3 h-3 hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};
