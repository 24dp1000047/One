import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, MessageSquare, Sparkles, Activity } from 'lucide-react';
import { AsciiVisualizer } from '../common/AsciiVisualizer';
import { BrandName } from '../common/BrandName';
import { useNavigate } from 'react-router-dom';

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
}

export const HeroBanner: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const [systemUptime, setSystemUptime] = useState('0.0');

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSystemUptime(((Date.now() - startTime) / 1000).toFixed(1));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const scrollToExplore = () => {
    const el = document.getElementById('explore-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 600, behavior: 'smooth' });
    }
  };

  // Interactive Ambient Particle Field Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize 70 ambient dust particles
    const particleCount = 70;
    const particles: DustParticle[] = [];
    const colors = ['#A5C4F2', '#E5A866', '#FFFFFF', '#60A5FA'];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.45 + 0.15;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.5 - 0.1, // gently floating upwards
        size: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: baseAlpha,
        baseAlpha,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle interactive radial light around cursor
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const mouseGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          240
        );
        mouseGrad.addColorStop(0, 'rgba(165, 196, 242, 0.07)');
        mouseGrad.addColorStop(0.5, 'rgba(229, 168, 102, 0.03)');
        mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Slow breathing ambient background glow orbs
      const glow1X = width * 0.25 + Math.sin(time * 0.5) * 60;
      const glow1Y = height * 0.45 + Math.cos(time * 0.4) * 40;
      const grad1 = ctx.createRadialGradient(glow1X, glow1Y, 0, glow1X, glow1Y, 320);
      grad1.addColorStop(0, 'rgba(165, 196, 242, 0.05)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 3. Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 2.5;
          p.y += (dy / dist) * force * 2.5;
          p.alpha = Math.min(0.9, p.baseAlpha + force * 0.5);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Draw faint constellation lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 65) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(165, 196, 242, ${(1 - cdist / 65) * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative overflow-hidden pt-8 pb-14 px-4 sm:px-8 border-b border-[#141822] bg-[#040608]">
      {/* Interactive Ambient Cosmic Dust Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Background Matrix Crosses & Ambient Vignette */}
      <div className="absolute inset-0 ascii-matrix-bg opacity-35 pointer-events-none z-0" />

      {/* Top Overline Bar with Live Telemetry Pulse */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-10 font-mono text-xs tracking-widest text-[#8A94A6]">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-px bg-zinc-600 inline-block" />
          <span className="text-zinc-400 inline-flex items-baseline">
            <BrandName className="text-zinc-200" />
            <span>.STUDIO // NEURAL IMAGE SYNTHESIS & DIRECTION</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
          <span>SYS ONLINE</span>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400">{systemUptime}s</span>
          <span className="text-zinc-600">//</span>
          <span className="hidden sm:inline">60FPS ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Left Editorial Copy, Right ASCII Visualizer */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Typography & Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Animated Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#E5A866]/30 font-mono text-xs text-[#E5A866] uppercase font-semibold tracking-wider shadow-[0_0_15px_rgba(229,168,102,0.12)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A866] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5A866] shadow-[0_0_6px_#E5A866]" />
            </span>
            <span>THE CREATIVE CORE // QUANTUM LATENT MATRIX</span>
          </div>

          {/* Headline with Two-Tone LIVING ART Matching Screenshot */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-white leading-[1.08]">
              Where creative <br />
              vision becomes <br />
              <span className="text-[#E5A866] font-semibold">LIVING </span>
              <span className="text-[#A5C4F2] font-semibold">ART.</span>
            </h1>
          </div>

          {/* Editorial Paragraph */}
          <div className="space-y-2.5 max-w-lg text-[#B2BCCD] text-sm sm:text-base leading-relaxed">
            <p className="text-zinc-300">A unified studio for the visionary artist.</p>
            <div>
              <p className="text-zinc-300">For creators who ask what if—</p>
              <p className="text-zinc-400 font-mono text-xs sm:text-sm tracking-wide mt-1">
                and stay to synthesize what's next with photoreal 8K neural diffusion.
              </p>
            </div>
          </div>

          {/* Action Row with Radiant Aura Halo Glow Button & Director Audio Equalizer */}
          <div className="flex flex-wrap items-center gap-6 pt-3">
            {/* Pill button: Launch AI Chat Studio with White/Ice Ambient Halo Glow */}
            <button
              onClick={() => navigate('/chat')}
              className="halo-ice-button flex items-center gap-2.5 px-7 py-3.5 rounded-full font-sans font-semibold text-xs sm:text-sm tracking-wide cursor-pointer transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-[#06090E]" />
              <span>Launch AI Chat Studio</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Chat with Director Link with Live Sound Equalizer Bars */}
            <button
              onClick={() => navigate('/chat')}
              className="group flex items-center gap-2.5 font-mono text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <div className="relative p-1.5 rounded-lg bg-white/5 border border-[#E5A866]/40 group-hover:border-[#E5A866] transition-colors">
                <MessageSquare className="w-3.5 h-3.5 text-[#E5A866]" />
              </div>
              <div className="flex items-center gap-2">
                <span>Chat with AI Art Director</span>
                {/* 3 Live Audio Equalizer Bars */}
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-[#E5A866] animate-pulse rounded-full h-2" />
                  <span className="w-0.5 bg-[#A5C4F2] animate-pulse rounded-full h-3" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-[#E5A866] animate-pulse rounded-full h-1.5" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </button>
          </div>

          {/* Bottom Link: ↓ EXPLORE THE POSSIBILITIES with Rotating Orbital Ring */}
          <div className="pt-6">
            <button
              onClick={scrollToExplore}
              className="group flex items-center gap-3 font-mono text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <div className="relative w-7 h-7 flex items-center justify-center">
                {/* Rotating dashed ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-zinc-600 group-hover:border-[#A5C4F2] animate-orbit transition-colors" />
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-zinc-300 group-hover:text-white" />
              </div>
              <span className="tracking-widest uppercase text-[11px] group-hover:text-white transition-colors">
                EXPLORE THE POSSIBILITIES
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: ASCII Matrix Generative Artwork with 3D Cyber Wireframe */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          {/* Subtle ambient backglow behind visualizer box */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#A5C4F2]/10 via-[#E5A866]/10 to-transparent blur-2xl rounded-3xl pointer-events-none" />
          <AsciiVisualizer initialMode="wireframe" showSelector={true} />
        </div>
      </div>
    </div>
  );
};
