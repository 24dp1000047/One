import React from 'react';
import { AsciiVisualizer, AsciiMode } from './AsciiVisualizer';
import { useAppStore } from '../../store/useAppStore';

interface AIOrbProps {
  size?: number;
  interactive?: boolean;
  className?: string;
  showControls?: boolean;
  initialMode?: AsciiMode;
}

export const AIOrb: React.FC<AIOrbProps> = ({
  className = '',
  showControls = true,
  initialMode = 'wireframe',
}) => {
  const orbState = useAppStore((state) => state.orbState);
  const setOrbState = useAppStore((state) => state.setOrbState);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* ASCII Generative Canvas */}
      <AsciiVisualizer initialMode={initialMode} showSelector={showControls} />

      {/* State Badge */}
      <div className="relative z-10 mt-3 flex items-center gap-2 px-3 py-1 rounded-full capsule-control text-[11px] font-mono text-zinc-300">
        <span
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            orbState === 'generating'
              ? 'bg-brand-orange animate-ping'
              : orbState === 'thinking'
              ? 'bg-brand-gold animate-pulse'
              : 'bg-brand-ice'
          }`}
        />
        <span className="capitalize font-medium">
          {orbState === 'idle' ? 'Core Synchronized' : orbState === 'thinking' ? 'Synthesizing...' : 'Generating 60fps'}
        </span>
      </div>
    </div>
  );
};
