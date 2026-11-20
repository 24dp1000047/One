import React, { useState } from 'react';
import { ArrowUpRight, RotateCcw, ArrowDown } from 'lucide-react';
import { AsciiVisualizer } from '../common/AsciiVisualizer';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const HeroBanner: React.FC = () => {
  const navigate = useNavigate();
  const addToast = useAppStore((state) => state.addToast);
  const [taglineToggle, setTaglineToggle] = useState(false);

  const handleReplayOpening = () => {
    window.dispatchEvent(new CustomEvent('matrix-reboot'));
    addToast({
      type: 'info',
      title: 'Opening Sequence Rebooted',
      message: 'Re-initializing creative potential matrices...',
    });
  };

  const scrollToExplore = () => {
    const el = document.getElementById('explore-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 600, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-14 px-4 sm:px-8 border-b border-[#141822] bg-[#040608]">
      {/* Background Matrix Crosses & Ambient Vignette */}
      <div className="absolute inset-0 ascii-matrix-bg opacity-30 pointer-events-none" />

      {/* Top Overline Bar (Image 1 & 2 match) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-12 font-mono text-xs tracking-widest text-[#8A94A6]">
        <div className="flex items-center gap-2">
          <span className="w-6 h-px bg-zinc-600 inline-block" />
          <span className="text-zinc-400">ONe.WORLD / OPENING 21 NOVEMBER</span>
        </div>
        <div className="hidden sm:block text-[11px] text-zinc-500 uppercase tracking-widest">
          EVERYTHING STARTS WITH A QUESTION
        </div>
      </div>

      {/* Main Grid: Left Editorial Copy, Right ASCII Visualizer */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Typography & Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Label: THE FIRST SPARK (Image 2 match) */}
          <div className="inline-block font-mono text-xs tracking-widest text-[#E5A866] uppercase font-semibold">
            THE FIRST SPARK
          </div>

          {/* Headline (Image 1 & 2 exact style) */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-white leading-[1.08]">
              Where human <br />
              potential becomes <br />
              <span className="bg-gradient-to-r from-[#A5C4F2] via-[#C5D8F7] to-[#FFFFFF] bg-clip-text text-transparent font-semibold text-glow-ice">
                REAL PROGRESS.
              </span>
            </h1>
          </div>

          {/* Editorial Paragraph */}
          <div className="space-y-1 max-w-lg text-[#B2BCCD] text-sm sm:text-base font-light leading-relaxed">
            <p>A new space for the curious.</p>
            <p>For the people who ask what if—</p>
            <p>and stay to build what's next.</p>
          </div>

          {/* Action Row (Image 1 match) */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            {/* Pill button: Get the first invitation ↗ */}
            <button
              onClick={() => navigate('/studio')}
              className="pill-action flex items-center gap-2.5 px-6 py-3.5 rounded-full font-sans font-semibold text-xs tracking-wide cursor-pointer"
            >
              <span>Get the first invitation</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Replay opening ↺ */}
            <button
              onClick={handleReplayOpening}
              className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Replay opening</span>
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Link: ↓ EXPLORE THE POSSIBILITY */}
          <div className="pt-8">
            <button
              onClick={scrollToExplore}
              className="group flex items-center gap-3 font-mono text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full border border-zinc-700 group-hover:border-white flex items-center justify-center transition-colors">
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </div>
              <span className="tracking-widest uppercase text-[11px]">EXPLORE THE POSSIBILITY</span>
            </button>
          </div>
        </div>

        {/* Right Column: ASCII Matrix Generative Artwork (Image 1 & 2 match) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <AsciiVisualizer initialMode="sphere" showSelector={true} />
        </div>
      </div>
    </div>
  );
};
