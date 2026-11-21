import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Sparkles, Layers, Maximize2, Activity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { BrandName } from '../common/BrandName';
import { audioSynth } from '../../utils/audioSynth';

export type PanoramicMode = 'wireframe' | 'terrain' | 'cyberrain';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const InsideGlassSection: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMotionPaused = useAppStore((state) => state.isMotionPaused);
  const orbState = useAppStore((state) => state.orbState);

  const [panoramicMode, setPanoramicMode] = useState<PanoramicMode>('wireframe');
  const [warpBoost, setWarpBoost] = useState(0);

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const warpBoostRef = useRef(0);
  const sparksRef = useRef<Spark[]>([]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    audioSynth.playWhoosh();
    warpBoostRef.current = 1.0;
    setWarpBoost(1.0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Emit 30 sparks
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      sparksRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 35 + 20,
        color: Math.random() > 0.4 ? '#E5A866' : '#A5C4F2',
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.parentElement?.clientWidth || 920;
    let height = 380;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = 380;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = normX * 28;
      mouseRef.current.targetY = normY * 16;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic Monolith Profiles
    const baseBuildings = [
      { id: 1, xRel: -0.38, w: 90, h: 220, z: 0.15 },
      { id: 2, xRel: -0.24, w: 75, h: 180, z: 0.45 },
      { id: 3, xRel: -0.12, w: 60, h: 150, z: 0.75 },
      { id: 4, xRel: 0.12, w: 60, h: 150, z: 0.25 },
      { id: 5, xRel: 0.24, w: 80, h: 190, z: 0.55 },
      { id: 6, xRel: 0.38, w: 100, h: 240, z: 0.85 },
    ];

    // Floating 3D Quantum Motes
    const motes = Array.from({ length: 30 }, (_, idx) => ({
      id: idx,
      xRel: (Math.random() - 0.5) * 1.4,
      yRel: (Math.random() - 0.5) * 0.8,
      z: Math.random(),
      speed: Math.random() * 0.08 + 0.05,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#A5C4F2' : '#E5A866',
    }));

    const render = () => {
      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      if (warpBoostRef.current > 0.01) {
        warpBoostRef.current *= 0.95;
      } else {
        warpBoostRef.current = 0;
      }

      const speedFactor = (isMotionPaused ? 0 : 1.0) * (orbState === 'thinking' ? 1.8 : orbState === 'generating' ? 2.8 : 1.0) + warpBoostRef.current * 3.0;
      time += 0.018 * speedFactor;

      ctx.fillStyle = '#06080D';
      ctx.fillRect(0, 0, width, height);

      const vanishX = width * 0.5 + mouseRef.current.x;
      const vanishY = height * 0.44 + mouseRef.current.y;

      if (panoramicMode === 'wireframe') {
        // ==========================================================
        // MODE 1: HIGH-RESOLUTION 3D WIREFRAME CYBER CITY (Panoramic)
        // ==========================================================

        // 1. Horizon Vanishing Beacon & Periodic Shockwaves
        ctx.strokeStyle = 'rgba(142, 174, 234, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, vanishY);
        ctx.lineTo(width, vanishY);
        ctx.stroke();

        // Expanding Solar Shockwaves from Vanishing Point
        const shockPeriod = 2.8;
        const sw = (time % shockPeriod) / shockPeriod;
        const swDepth = Math.pow(sw, 2.5);
        const swY = vanishY + (height - vanishY) * swDepth;
        const swSpread = width * (0.2 + swDepth * 0.95);

        ctx.beginPath();
        ctx.ellipse(vanishX, swY, swSpread * 0.5, 5 + swDepth * 18, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(229, 168, 102, ${(1 - sw) * 0.55})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Glowing Vanishing Point Sun Flare
        const glowPulse = 0.5 + Math.sin(time * 3.5) * 0.25;
        const gradient = ctx.createRadialGradient(vanishX, vanishY, 0, vanishX, vanishY, 48);
        gradient.addColorStop(0, `rgba(229, 168, 102, ${glowPulse * 0.95})`);
        gradient.addColorStop(0.35, `rgba(229, 168, 102, ${glowPulse * 0.35})`);
        gradient.addColorStop(1, 'rgba(229, 168, 102, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(vanishX, vanishY, 48, 0, Math.PI * 2);
        ctx.fill();

        // 2. Vanishing Street Lines (Converging Radial Rays)
        const numLines = 20;
        for (let i = -numLines; i <= numLines; i++) {
          const bottomX = vanishX + i * (width / 16) + mouseRef.current.x * 0.4;
          ctx.beginPath();
          ctx.moveTo(vanishX, vanishY);
          ctx.lineTo(bottomX, height);

          if (i === 0) {
            ctx.strokeStyle = '#E5A866';
            ctx.lineWidth = 1.8;
          } else if (Math.abs(i) === 4 || Math.abs(i) === 8) {
            ctx.strokeStyle = 'rgba(165, 196, 242, 0.45)';
            ctx.lineWidth = 1.2;
          } else {
            ctx.strokeStyle = 'rgba(142, 174, 234, 0.16)';
            ctx.lineWidth = 0.8;
          }
          ctx.stroke();
        }

        // 3. SPEED VECTOR LASER LIGHT TRAILS (Racing towards camera!)
        const numSpeedBeams = 8;
        for (let b = 0; b < numSpeedBeams; b++) {
          const beamOffset = ((time * 1.6 + b * 0.14) % 1.0);
          const depth = Math.pow(beamOffset, 2.8);
          const rayIndex = ((b * 5) % 17) - 8;
          const bottomX = vanishX + rayIndex * (width / 16) + mouseRef.current.x * 0.4;
          const curX = vanishX + (bottomX - vanishX) * depth;
          const curY = vanishY + (height - vanishY) * depth;

          const prevDepth = Math.max(0, depth - 0.08);
          const prevX = vanishX + (bottomX - vanishX) * prevDepth;
          const prevY = vanishY + (height - vanishY) * prevDepth;

          const beamGrad = ctx.createLinearGradient(prevX, prevY, curX, curY);
          beamGrad.addColorStop(0, 'rgba(229, 168, 102, 0)');
          beamGrad.addColorStop(0.7, b % 2 === 0 ? 'rgba(229, 168, 102, 0.95)' : 'rgba(165, 196, 242, 0.95)');
          beamGrad.addColorStop(1, '#FFFFFF');

          ctx.strokeStyle = beamGrad;
          ctx.lineWidth = 1.5 + depth * 2.8;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          if (depth > 0.4) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(curX, curY, 2 + depth * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 4. Moving Transverse Road Grid Lines
        const numGrids = 16;
        for (let g = 1; g <= numGrids; g++) {
          const offset = ((g / numGrids) + (time * 0.4)) % 1.0;
          const depth = Math.pow(offset, 2.5);
          const y = vanishY + (height - vanishY) * depth;

          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.strokeStyle = `rgba(142, 174, 234, ${0.08 + depth * 0.5})`;
          ctx.lineWidth = depth > 0.6 ? 1.5 : 1;
          ctx.stroke();
        }

        // 5. Center Dashed Road Markings Streaming Forward
        const numDashes = 10;
        for (let d = 0; d < numDashes; d++) {
          const dashOffset = ((d / numDashes) + (time * 0.8)) % 1.0;
          const depth = Math.pow(dashOffset, 2.6);
          const dashY = vanishY + (height - vanishY) * depth;
          const dashLen = 5 + depth * 25;

          ctx.beginPath();
          ctx.moveTo(vanishX, dashY);
          ctx.lineTo(vanishX, dashY + dashLen);
          ctx.strokeStyle = `rgba(255, 240, 200, ${0.2 + depth * 0.85})`;
          ctx.lineWidth = 2 + depth * 2.4;
          ctx.stroke();
        }

        // 6. Vector Monoliths with Lit Windows & Scanning Lasers
        baseBuildings.forEach((b) => {
          const currentZ = (b.z + (time * 0.12)) % 1.0;
          const depthScale = Math.pow(currentZ, 2.2);

          const bx = vanishX + b.xRel * width * (0.25 + depthScale * 0.85) - (b.w * (0.3 + depthScale * 0.7)) * 0.5;
          const baseFloorY = vanishY + (height - vanishY) * depthScale;
          const currentH = b.h * (0.3 + depthScale * 0.75);
          const currentW = b.w * (0.3 + depthScale * 0.7);
          const by = baseFloorY - currentH;

          if (baseFloorY > vanishY && by < height + 40) {
            const alpha = Math.min(0.85, 0.15 + depthScale * 0.75);

            // Outer Box
            ctx.strokeStyle = `rgba(215, 228, 250, ${alpha})`;
            ctx.lineWidth = depthScale > 0.5 ? 1.5 : 1;
            ctx.strokeRect(bx, by, currentW, currentH);

            // Roof Lines to Vanishing Point
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(vanishX, vanishY);
            ctx.moveTo(bx + currentW, by);
            ctx.lineTo(vanishX, vanishY);
            ctx.strokeStyle = `rgba(165, 196, 242, ${alpha * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Floors & Illuminated Windows
            for (let f = 1; f <= 4; f++) {
              const fy = by + (currentH / 5) * f;
              ctx.beginPath();
              ctx.moveTo(bx, fy);
              ctx.lineTo(bx + currentW, fy);
              ctx.strokeStyle = `rgba(142, 174, 234, ${alpha * 0.25})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();

              // Window Accents
              if (depthScale > 0.25) {
                for (let wCol = 1; wCol <= 3; wCol++) {
                  const wx = bx + (currentW / 4) * wCol;
                  const isLit = Math.sin(time * 3.5 + b.id * 8 + f * 4 + wCol) > 0.2;
                  if (isLit) {
                    ctx.fillStyle = b.id % 2 === 0 ? `rgba(229, 168, 102, ${alpha * 0.9})` : `rgba(165, 196, 242, ${alpha * 0.9})`;
                    ctx.fillRect(wx - 2, fy - 3, 3, 4);
                  }
                }
              }
            }

            // Vertical Scanning Laser on Front Monolith
            if (depthScale > 0.35) {
              const scanY = by + ((time * 45 + b.id * 30) % currentH);
              ctx.strokeStyle = 'rgba(165, 196, 242, 0.75)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(bx, scanY);
              ctx.lineTo(bx + currentW, scanY);
              ctx.stroke();
            }
          }
        });

        // 7. Floating 3D Quantum Motes
        motes.forEach((m) => {
          m.z = (m.z + m.speed * speedFactor * 0.05) % 1.0;
          const zDepth = Math.pow(m.z, 2.2);
          const px = vanishX + m.xRel * width * (0.2 + zDepth * 0.9);
          const py = vanishY + m.yRel * height * (0.2 + zDepth * 0.9);
          const pSize = m.size * (0.4 + zDepth * 1.5);
          const pAlpha = Math.min(0.85, 0.1 + zDepth * 0.75);

          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.globalAlpha = pAlpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        });

        // 8. Matrix ASCII Annotation Glyphs (Image 3 exact match)
        ctx.fillStyle = '#8EAEEA';
        ctx.font = '10px "JetBrains Mono", monospace';
        for (let i = 0; i < 4; i++) {
          const shift = Math.floor((time * 4 + i * 2) % 6);
          const dashChars = shift % 2 === 0 ? '----.----.----' : '....----....----';
          ctx.fillText(dashChars, width * 0.14 + mouseRef.current.x * 0.3, 60 + i * 18);
          ctx.fillText(dashChars, width * 0.84 + mouseRef.current.x * 0.3, 60 + i * 18);
        }

      } else if (panoramicMode === 'terrain') {
        // ==========================================================
        // MODE 2: SYNTHWAVE NEURAL TOPOLOGY TERRAIN MESH
        // ==========================================================
        const rows = 18;
        const cols = 28;
        const cellW = width / cols;

        for (let r = 0; r < rows; r++) {
          const rawDepth = (r / rows + (time * 0.4) % (1 / rows));
          const depth = Math.pow(rawDepth, 2.4);
          const yBase = vanishY + (height - vanishY) * depth;

          ctx.beginPath();
          for (let c = 0; c <= cols; c++) {
            const x = c * cellW;
            const distFromCenter = Math.abs(c - cols / 2) / (cols / 2);
            // Mountains rise up on both left and right sides!
            const mountainH = Math.pow(distFromCenter, 1.8) * 85 * depth;
            const wave = Math.sin(c * 0.6 + time * 3 + r) * 12 * depth;
            const y = yBase - mountainH + wave;

            if (c === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(165, 196, 242, ${0.1 + depth * 0.7})`;
          ctx.lineWidth = depth > 0.6 ? 1.5 : 1;
          ctx.stroke();
        }

        // Neon Horizon Glow
        const tGrad = ctx.createLinearGradient(0, vanishY - 40, 0, vanishY + 20);
        tGrad.addColorStop(0, 'rgba(229, 168, 102, 0)');
        tGrad.addColorStop(0.7, 'rgba(229, 168, 102, 0.4)');
        tGrad.addColorStop(1, 'rgba(165, 196, 242, 0)');
        ctx.fillStyle = tGrad;
        ctx.fillRect(0, vanishY - 40, width, 60);

      } else if (panoramicMode === 'cyberrain') {
        // ==========================================================
        // MODE 3: MATRIX CYBER RAIN (Cascading digital code)
        // ==========================================================
        const streamCols = 32;
        const colW = width / streamCols;
        ctx.font = '11px "JetBrains Mono", monospace';

        for (let c = 0; c < streamCols; c++) {
          const colX = c * colW + 10;
          const streamSpeed = (c % 5 + 3) * 0.3;
          const headY = ((time * 80 * streamSpeed + c * 35) % (height + 100)) - 50;

          for (let len = 0; len < 12; len++) {
            const charY = headY - len * 14;
            if (charY > 10 && charY < height - 10) {
              const alpha = Math.max(0, 1 - len / 12);
              ctx.fillStyle = len === 0 ? '#FFFFFF' : c % 2 === 0 ? `rgba(229, 168, 102, ${alpha * 0.85})` : `rgba(165, 196, 242, ${alpha * 0.85})`;
              const charCode = 65 + ((c * 7 + len * 3) % 26);
              ctx.fillText(String.fromCharCode(charCode), colX, charY);
            }
          }
        }
      }

      // Interactive Click Sparks Rendering
      for (let s = sparksRef.current.length - 1; s >= 0; s--) {
        const sp = sparksRef.current[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.12; // gravity
        sp.life++;

        const spAlpha = Math.max(0, 1 - sp.life / sp.maxLife);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = spAlpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (sp.life >= sp.maxLife) {
          sparksRef.current.splice(s, 1);
        }
      }

      // Live Telemetry Readout
      ctx.fillStyle = warpBoostRef.current > 0.1 ? '#E5A866' : 'rgba(165, 196, 242, 0.45)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(
        warpBoostRef.current > 0.1
          ? `⚡ WARP SPEED ENGAGED [ACCEL +${(warpBoostRef.current * 100).toFixed(0)}%]`
          : `PERSPECTIVE VECTOR // ACTIVE 60FPS // CAMERA PITCH: ${mouseRef.current.y > 0 ? '+' : ''}${mouseRef.current.y.toFixed(1)}°`,
        width * 0.5,
        height - 15
      );

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [panoramicMode, isMotionPaused, orbState]);

  return (
    <div id="explore-section" className="rounded-3xl border border-[#181C26] bg-[#07090F] p-5 sm:p-8 shadow-2xl space-y-6">
      {/* Top Metadata Header (Image 3 match) */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5A866] shadow-[0_0_10px_#E5A866] animate-pulse" />
          <span className="tracking-widest uppercase text-white font-medium inline-flex items-baseline gap-1">
            <span>INSIDE</span>
            <BrandName className="text-white" />
            <span>STUDIO</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 hidden sm:inline">
            PANORAMIC VIEWPORT
          </span>
        </div>

        {/* Viewport Mode Switcher */}
        <div className="flex items-center gap-1.5 capsule-control px-2 py-1 rounded-full text-[11px] font-mono">
          <button
            onClick={() => {
              audioSynth.playClick(1000);
              setPanoramicMode('wireframe');
            }}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              panoramicMode === 'wireframe'
                ? 'bg-white/15 text-white font-medium border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            3D Wireframe City
          </button>
          <button
            onClick={() => {
              audioSynth.playClick(1100);
              setPanoramicMode('terrain');
            }}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              panoramicMode === 'terrain'
                ? 'bg-white/15 text-white font-medium border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Topology Mesh
          </button>
          <button
            onClick={() => {
              audioSynth.playClick(1200);
              setPanoramicMode('cyberrain');
            }}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              panoramicMode === 'cyberrain'
                ? 'bg-white/15 text-white font-medium border border-white/20 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Matrix Rain
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[#8A94A6] text-xs font-mono">
        <span>An early look through the glass — real-time optical vectors & perspective physics.</span>
        <span className="text-[#E5A866] text-[11px] flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Click viewport to accelerate
        </span>
      </div>

      {/* Wireframe Viewport Canvas Container (Image 3 exact match with interactive click) */}
      <div 
        onClick={handleCanvasClick}
        className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#040608] cursor-pointer group shadow-2xl transition-all duration-300 hover:border-[#A5C4F2]/40"
      >
        <canvas ref={canvasRef} className="w-full block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Floating Click Cue Badge */}
        <div className="absolute top-3 right-3 text-[10px] font-mono text-zinc-500 group-hover:text-[#E5A866] transition-colors pointer-events-none bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
          [CLICK TO ACCELERATE]
        </div>
      </div>

      {/* Lower Bar (Image 3 match) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-4">
        {/* Left: Selected work headline */}
        <div className="md:col-span-7 space-y-2">
          <div className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
            SELECTED WORK / GENERATIVE CONCEPT ART
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
            Beyond the imagination.
          </h2>
          <p className="text-xs text-[#8A94A6] max-w-md font-light leading-relaxed">
            Every visual synthesized in real-time with multi-sampling diffusion, latent denoising, photorealistic optical physics, and neural resolution upscaling.
          </p>
        </div>

        {/* Right: "How an image is created" floating card (Image 3 match) */}
        <div className="md:col-span-5 rounded-2xl bg-[#0B0E16] border border-[#1C212E] p-4 space-y-2.5 shadow-xl">
          <div className="text-xs font-mono tracking-widest text-white font-medium flex items-center justify-between">
            <span>How an image is created</span>
            <Activity className="w-3.5 h-3.5 text-[#E5A866]" />
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <div
              onClick={() => navigate('/chat')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer text-zinc-300 hover:text-white transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#E5A866] font-bold">01</span>
                <span>Ask AI Art Director</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </div>

            <div
              onClick={() => navigate('/studio')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer text-zinc-300 hover:text-white transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#A5C4F2] font-bold">02</span>
                <span>Synthesize 8K Image</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </div>

            <div
              onClick={() => navigate('/creations')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer text-zinc-300 hover:text-white transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">03</span>
                <span>Inpaint, Upscale & Grade</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
