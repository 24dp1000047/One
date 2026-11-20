import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Play, Film, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const InsideGlassSection: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMotionPaused = useAppStore((state) => state.isMotionPaused);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.parentElement?.clientWidth || 900;
    const height = 360;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const render = () => {
      if (!isMotionPaused) {
        time += 0.015;
      }

      ctx.fillStyle = '#06080D';
      ctx.fillRect(0, 0, width, height);

      const vanishX = width * 0.5;
      const vanishY = height * 0.44;

      // 1. Vanishing street lines
      const numLines = 16;
      for (let i = -numLines; i <= numLines; i++) {
        const bottomX = vanishX + i * (width / 14);
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(bottomX, height);
        ctx.strokeStyle = i === 0 ? '#E5A866' : 'rgba(142, 174, 234, 0.18)';
        ctx.lineWidth = i === 0 ? 1.5 : 1;
        ctx.stroke();
      }

      // 2. Transverse road grid lines moving forward
      const numGrids = 14;
      for (let g = 1; g <= numGrids; g++) {
        const offset = (g / numGrids + (time * 0.4) % (1 / numGrids));
        const depth = Math.pow(offset, 2.5);
        const y = vanishY + (height - vanishY) * depth;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = `rgba(142, 174, 234, ${0.08 + depth * 0.4})`;
        ctx.stroke();
      }

      // 3. Vector Monoliths / Wireframe Buildings (Matching Image 3)
      const buildingData = [
        { xRatio: 0.12, w: 90, h: 220 },
        { xRatio: 0.24, w: 75, h: 180 },
        { xRatio: 0.35, w: 60, h: 140 },
        { xRatio: 0.65, w: 60, h: 140 },
        { xRatio: 0.76, w: 80, h: 190 },
        { xRatio: 0.88, w: 100, h: 240 },
      ];

      buildingData.forEach((b) => {
        const bx = width * b.xRatio - b.w * 0.5;
        const by = height * 0.68 - b.h * 0.5;

        // Outer Wireframe Box
        ctx.strokeStyle = 'rgba(215, 228, 250, 0.55)';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, b.w, b.h);

        // Internal cross / floor vectors
        for (let f = 1; f <= 4; f++) {
          const fy = by + (b.h / 5) * f;
          ctx.beginPath();
          ctx.moveTo(bx, fy);
          ctx.lineTo(bx + b.w, fy);
          ctx.strokeStyle = 'rgba(142, 174, 234, 0.15)';
          ctx.stroke();
        }
      });

      // 4. Matrix ASCII annotation lines
      ctx.fillStyle = '#8EAEEA';
      ctx.font = '10px "JetBrains Mono", monospace';
      for (let i = 0; i < 4; i++) {
        ctx.fillText('----.----.----', width * 0.15, 60 + i * 18);
        ctx.fillText('----.----.----', width * 0.82, 60 + i * 18);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isMotionPaused]);

  return (
    <div id="explore-section" className="rounded-3xl border border-[#181C26] bg-[#07090F] p-5 sm:p-8 shadow-2xl space-y-6">
      {/* Top Metadata Header (Image 3 match) */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E5A866] shadow-[0_0_8px_#E5A866]" />
          <span className="tracking-widest uppercase text-white font-medium">INSIDE ONe STUDIO</span>
        </div>
        <div className="text-zinc-500 tracking-widest text-[11px] uppercase">
          Opening 21 November
        </div>
      </div>

      <div className="text-[#8A94A6] text-xs font-mono">
        An early look through the glass.
      </div>

      {/* Wireframe Viewport Canvas (Image 3 exact match) */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#040608]">
        <canvas ref={canvasRef} className="w-full block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-transparent to-transparent opacity-80 pointer-events-none" />
      </div>

      {/* Lower Bar (Image 3 match) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-4">
        {/* Left: Selected work headline */}
        <div className="md:col-span-7 space-y-2">
          <div className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
            SELECTED WORK / A WORLD IN THE MAKING
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
            Beyond the idea.
          </h2>
          <p className="text-xs text-[#8A94A6] max-w-md font-light leading-relaxed">
            Every frame synthesized in real-time with optical motion vectors, 35mm anamorphic camera physics, and persistent storyboard architecture.
          </p>
        </div>

        {/* Right: "How an idea moves" floating card (Image 3 match) */}
        <div className="md:col-span-5 rounded-2xl bg-[#0B0E16] border border-[#1C212E] p-4 space-y-2.5">
          <div className="text-xs font-mono tracking-widest text-white font-medium">
            How an idea moves
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <div
              onClick={() => navigate('/chat')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#E5A866]">01</span>
                <span>Ask & Script</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </div>

            <div
              onClick={() => navigate('/studio')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#A5C4F2]">02</span>
                <span>Synthesize Storyboard</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </div>

            <div
              onClick={() => navigate('/creations')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-white">03</span>
                <span>Direct & Render</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
