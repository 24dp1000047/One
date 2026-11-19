import React from 'react';
import { Sparkles, Zap, ArrowRight, Play, Film } from 'lucide-react';
import { AIOrb } from '../common/AIOrb';
import { useNavigate } from 'react-router-dom';

export const HeroBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#222222] bg-gradient-to-b from-[#141414] via-[#0e0e0e] to-[#090909] p-6 sm:p-10 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left text column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Futuristic Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c1c] border border-brand-yellow/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-brand-yellow animate-ping" />
            <span className="text-zinc-200 tracking-wider">PROJECT ONe // CINEMA ENGINE 4.0</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
              One space. <br />
              <span className="bg-gradient-to-r from-brand-yellow via-[#FFF275] to-brand-orange bg-clip-text text-transparent">
                Infinite possibilities.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed font-light">
              Transform raw imagination into cinematic, fluidly animated videos and conversational scripts. 
              The next-generation creative workspace engineered for directors, designers, and visionaries.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/studio')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-yellow to-brand-orange text-black font-semibold text-sm tracking-wide shadow-glow-yellow hover:brightness-110 active:scale-95 transition-all"
            >
              <Film className="w-4 h-4" />
              <span>Launch Video Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#2e2e2e] hover:border-brand-yellow/40 text-white font-medium text-sm tracking-wide transition-all"
            >
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              <span>Chat with AI Director</span>
            </button>
          </div>

          {/* System Telemetry Metrics */}
          <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#1f1f1f] text-xs font-mono text-muted">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Render Core</span>
              <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                4K Lumen v5.4
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Latency</span>
              <span className="text-white font-semibold block mt-0.5">18ms Ultra-Stream</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Resolution</span>
              <span className="text-brand-yellow font-semibold block mt-0.5">Up to 4K 60fps</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive 3D AI Orb */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <AIOrb size={290} showControls={true} />
        </div>
      </div>
    </div>
  );
};
