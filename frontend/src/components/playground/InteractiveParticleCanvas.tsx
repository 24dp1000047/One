import React, { useRef, useEffect, useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Wind, 
  RotateCcw, 
  Zap, 
  ArrowRight, 
  Sliders, 
  Maximize2 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';
import { useNavigate } from 'react-router-dom';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export const InteractiveParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const setCameraMotion = useAppStore((state) => state.setCameraMotion);
  const setStudioMode = useAppStore((state) => state.setStudioMode);
  const addToast = useAppStore((state) => state.addToast);

  const [simMode, setSimMode] = useState<'gravity' | 'flow' | 'shockwave'>('gravity');
  const [particleDensity, setParticleDensity] = useState(450);
  const [gravityStrength, setGravityStrength] = useState(65);
  const [turbulence, setTurbulence] = useState(40);
  const [colorTheme, setColorTheme] = useState<'cyber' | 'amber' | 'prism'>('cyber');

  const mouseRef = useRef({ x: -1000, y: -1000, isDown: false });
  const shockwavesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight || 450);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    const colorsMap = {
      cyber: ['#A5C4F2', '#38BDF8', '#818CF8', '#FFFFFF'],
      amber: ['#FFD600', '#FF7A1A', '#E5A866', '#FFFFFF'],
      prism: ['#F472B6', '#34D399', '#60A5FA', '#FFD600'],
    };

    // Initialize particles
    let particles: Particle[] = [];
    const initParticles = () => {
      particles = [];
      const palette = colorsMap[colorTheme];
      for (let i = 0; i < particleDensity; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 2.5 + 1.2,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * 0.7 + 0.3,
          life: 0,
          maxLife: Math.random() * 200 + 100,
        });
      }
    };

    initParticles();

    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);

      // Trailing fade effect
      ctx.fillStyle = 'rgba(4, 6, 8, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw shockwaves
      for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
        const sw = shockwavesRef.current[s];
        sw.radius += 8;
        const alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

        ctx.strokeStyle = `rgba(165, 196, 242, ${alpha * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(s, 1);
        }
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isDown = mouseRef.current.isDown;

      // Particle physics loop
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse attraction or repulsion
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 260 && dist > 5) {
          const force = (gravityStrength / 100) * (1 - dist / 260);

          if (simMode === 'gravity') {
            // Orbital vortex pull
            const angle = Math.atan2(dy, dx);
            const tangentAngle = angle + (isDown ? Math.PI / 1.5 : Math.PI / 2);
            p.vx += Math.cos(tangentAngle) * force * 1.8;
            p.vy += Math.sin(tangentAngle) * force * 1.8;
            p.vx += (dx / dist) * force * 1.2;
            p.vy += (dy / dist) * force * 1.2;
          } else if (simMode === 'flow') {
            // Directional wind stream
            p.vx += (force * 3.5);
            p.vy += (Math.sin(p.x * 0.01) * force * 1.5);
          }
        }

        // Apply turbulence noise
        p.vx += (Math.random() - 0.5) * (turbulence / 100) * 0.6;
        p.vy += (Math.random() - 0.5) * (turbulence / 100) * 0.6;

        // Apply friction / drag
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Screen boundary wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [simMode, particleDensity, gravityStrength, turbulence, colorTheme]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseRef.current.isDown = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    audioSynth.playClick(1500);

    if (simMode === 'shockwave') {
      shockwavesRef.current.push({
        x,
        y,
        radius: 5,
        maxRadius: 280,
      });
      audioSynth.playWhoosh();
    }
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  const handleExportVectorToStudio = () => {
    audioSynth.playWhoosh();
    const motionType = simMode === 'flow' ? 'FPV Drone Dive' : simMode === 'gravity' ? 'Slow Orbit' : 'Hyperlapse Zoom';
    setCameraMotion(motionType as any);
    setStudioMode('director3d');
    addToast({
      type: 'success',
      title: 'Vector Exported to Studio',
      message: `Calibrated 3D engine with dynamic ${motionType} physics vector.`,
    });
    navigate('/studio');
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#040608] border border-[#181C26] overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#141822] bg-[#07090F]/90 backdrop-blur-md z-10 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-brand-yellow">
            <Flame className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Generative Physics & Motion Field</span>
          </div>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400 text-[11px] hidden sm:inline">
            Interactive kinetic fluid & particle dynamics
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <div className="flex rounded-lg bg-black/50 p-1 border border-white/10">
            {[
              { id: 'gravity', label: 'Vortex Gravity' },
              { id: 'flow', label: 'Wind Vector' },
              { id: 'shockwave', label: 'Shockwave' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  audioSynth.playClick(1200);
                  setSimMode(m.id as any);
                }}
                className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  simMode === m.id
                    ? 'bg-brand-yellow text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportVectorToStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5A866]/20 hover:bg-[#E5A866]/30 border border-[#E5A866]/40 text-[#E5A866] font-sans text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Send to 3D Director</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Particle Canvas */}
      <div className="relative w-full h-[460px] bg-[#040608] select-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="w-full h-full block"
        />

        {/* Ambient Overlay Hint */}
        <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[11px] text-zinc-500 bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md">
          {simMode === 'gravity'
            ? 'MOVE CURSOR TO ATTRACT PARTICLES • HOLD CLICK FOR VORTEX SINK'
            : simMode === 'flow'
            ? 'MOVE CURSOR TO ACCELERATE OPTICAL WIND STREAM'
            : 'CLICK ANYWHERE TO DETONATE KINETIC SHOCKWAVES'}
        </div>
      </div>

      {/* Controls Deck */}
      <div className="p-4 bg-[#05070D] border-t border-[#141822] grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-zinc-400">
        {/* Density */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Particle Density</span>
            <span className="text-white">{particleDensity}</span>
          </div>
          <input
            type="range"
            min={150}
            max={800}
            step={50}
            value={particleDensity}
            onChange={(e) => setParticleDensity(parseInt(e.target.value))}
            className="w-full accent-brand-yellow bg-white/10 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Gravity / Force */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Field Attraction</span>
            <span className="text-white">{gravityStrength}%</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            value={gravityStrength}
            onChange={(e) => setGravityStrength(parseInt(e.target.value))}
            className="w-full accent-brand-yellow bg-white/10 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Turbulence */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Micro-Turbulence</span>
            <span className="text-white">{turbulence}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={turbulence}
            onChange={(e) => setTurbulence(parseInt(e.target.value))}
            className="w-full accent-brand-yellow bg-white/10 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
