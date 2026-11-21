import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, Activity, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BrandName } from '../common/BrandName';
import { audioSynth } from '../../utils/audioSynth';

export const GenerativeMatrixBand: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.parentElement?.clientWidth || 920;
    let height = 180;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = 180;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 0.025;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.fillStyle = '#06080E';
      ctx.fillRect(0, 0, width, height);

      const vanishX = width * 0.5 + mouseRef.current.x * 60;
      const vanishY = height * 0.5 + mouseRef.current.y * 30;

      // 1. Perspective Grid Rays
      const numRays = 24;
      for (let i = -numRays; i <= numRays; i++) {
        const bottomX = vanishX + i * (width / 18);
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(bottomX, height);
        ctx.strokeStyle = i === 0 ? '#E5A866' : 'rgba(165, 196, 242, 0.12)';
        ctx.lineWidth = i === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      // 2. Undulating Mathematical Waveform Rings
      const numWaves = 10;
      for (let w = 1; w <= numWaves; w++) {
        const rawOffset = ((w / numWaves) + (time * 0.3)) % 1.0;
        const depth = Math.pow(rawOffset, 2.2);
        const yBase = vanishY + (height - vanishY) * depth;

        ctx.beginPath();
        const steps = 40;
        for (let s = 0; s <= steps; s++) {
          const x = (s / steps) * width;
          const distFromCenter = Math.abs(s - steps / 2) / (steps / 2);
          const waveHarmonic = Math.sin(s * 0.5 + time * 3 + w) * 8 * depth;
          const y = yBase + waveHarmonic;

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(165, 196, 242, ${0.1 + depth * 0.6})`;
        ctx.lineWidth = depth > 0.5 ? 1.4 : 0.8;
        ctx.stroke();
      }

      // 3. Vanishing Horizon Beacon
      const pulse = 0.5 + Math.sin(time * 4) * 0.3;
      const grad = ctx.createRadialGradient(vanishX, vanishY, 0, vanishX, vanishY, 30);
      grad.addColorStop(0, `rgba(229, 168, 102, ${pulse * 0.8})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(vanishX, vanishY, 30, 0, Math.PI * 2);
      ctx.fill();

      // 4. Matrix Code Rays on sides
      ctx.fillStyle = 'rgba(165, 196, 242, 0.4)';
      ctx.font = '9px "JetBrains Mono", monospace';
      for (let r = 0; r < 3; r++) {
        ctx.fillText('----.----.----', 40, 30 + r * 15);
        ctx.fillText('----.----.----', width - 110, 30 + r * 15);
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
    <div className="relative rounded-3xl overflow-hidden border border-[#181C26] bg-[#07090F] p-4 sm:p-6 shadow-2xl space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#E5A866]" />
          <span className="text-white font-medium tracking-wider uppercase">
            NEURAL TOPOLOGY STREAM // REAL-TIME PERSPECTIVE MATRIX
          </span>
        </div>

        <button
          onClick={() => {
            audioSynth.playClick(1300);
            navigate('/studio');
          }}
          className="flex items-center gap-1.5 text-xs font-mono text-[#A5C4F2] hover:text-white transition-colors cursor-pointer"
        >
          <span>OPEN IN STUDIO</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Panoramic Perspective Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#040608]">
        <canvas ref={canvasRef} className="w-full block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-transparent to-transparent opacity-70 pointer-events-none" />

        <div className="absolute bottom-2.5 left-4 flex items-center gap-2 text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>CONTINUOUS DEPTH VECTOR STREAM // 60.0 FPS</span>
        </div>
      </div>
    </div>
  );
};
