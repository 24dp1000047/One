import React, { useEffect, useRef } from 'react';

interface DustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  swaySpeed: number;
  swayOffset: number;
}

export const GlobalAnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, isInside: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isInside = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initialize 80 site-wide ambient dust & steam motes
    const particleCount = 80;
    const particles: DustMote[] = [];
    const colors = ['#66C0F4', '#A5C4F2', '#E5A866', '#818CF8', '#C7D5E0', '#FFFFFF'];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.40 + 0.15;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.15, // gently floating upwards
        size: Math.random() * 2.2 + 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: baseAlpha,
        baseAlpha,
        swaySpeed: Math.random() * 0.002 + 0.001,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    let startTime = performance.now();

    const render = () => {
      const time = performance.now() - startTime;

      // Smooth mouse lerp
      if (mouseRef.current.isInside) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;
      } else {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
      }

      ctx.clearRect(0, 0, width, height);

      // ========================================================
      // 1. VOLUMETRIC LIVING STEAM AURORA CLOUDS (Subtle Site-Wide Drift)
      // ========================================================
      // Cloud A: Steam Electric Cyan Aurora (Top Right & Center Drift)
      const cloud1X = width * 0.65 + Math.sin(time * 0.00035) * 120;
      const cloud1Y = height * 0.25 + Math.cos(time * 0.00045) * 80;
      const cloud1R = Math.max(width, height) * 0.55 + Math.sin(time * 0.0006) * 60;
      const grad1 = ctx.createRadialGradient(cloud1X, cloud1Y, 20, cloud1X, cloud1Y, cloud1R);
      grad1.addColorStop(0, 'rgba(102, 192, 244, 0.09)');
      grad1.addColorStop(0.45, 'rgba(42, 71, 94, 0.05)');
      grad1.addColorStop(0.85, 'rgba(23, 26, 33, 0.02)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Cloud B: Deep Steam Steel Navy (Bottom Left Drift)
      const cloud2X = width * 0.20 + Math.cos(time * 0.0003) * 100;
      const cloud2Y = height * 0.75 + Math.sin(time * 0.0004) * 70;
      const cloud2R = Math.max(width, height) * 0.60 + Math.cos(time * 0.0005) * 50;
      const grad2 = ctx.createRadialGradient(cloud2X, cloud2Y, 30, cloud2X, cloud2Y, cloud2R);
      grad2.addColorStop(0, 'rgba(42, 71, 94, 0.12)');
      grad2.addColorStop(0.5, 'rgba(30, 50, 70, 0.06)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Cloud C: Warm Gold / Amber Ambient Accent (Center Right Drift)
      const cloud3X = width * 0.85 + Math.sin(time * 0.0004) * 80;
      const cloud3Y = height * 0.60 + Math.cos(time * 0.00035) * 60;
      const cloud3R = Math.max(width, height) * 0.42;
      const grad3 = ctx.createRadialGradient(cloud3X, cloud3Y, 10, cloud3X, cloud3Y, cloud3R);
      grad3.addColorStop(0, 'rgba(229, 168, 102, 0.045)');
      grad3.addColorStop(0.5, 'rgba(129, 140, 248, 0.02)');
      grad3.addColorStop(1, 'transparent');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // ========================================================
      // 2. INTERACTIVE CURSOR AMBIENT SPOTLIGHT
      // ========================================================
      if (mouseRef.current.isInside && mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const mouseGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          320
        );
        mouseGrad.addColorStop(0, 'rgba(102, 192, 244, 0.08)');
        mouseGrad.addColorStop(0.4, 'rgba(42, 71, 94, 0.04)');
        mouseGrad.addColorStop(0.8, 'rgba(229, 168, 102, 0.015)');
        mouseGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // ========================================================
      // 3. SUBTLE CYBER SCAN WAVEFRONT (Soft Ambient Shimmer Sweep)
      // ========================================================
      const scanPeriod = 12000; // 12 seconds per sweep
      const scanProgress = (time % scanPeriod) / scanPeriod;
      const scanY = scanProgress * (height + 200) - 100;
      const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(0.5, 'rgba(102, 192, 244, 0.025)');
      scanGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 60, width, 120);

      // ========================================================
      // 4. SITE-WIDE FLOATING DUST PHOTONS & CONSTELLATION WEB
      // ========================================================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Lateral sway and upward float
        const lateralSway = Math.sin(time * p.swaySpeed + p.swayOffset) * 0.35;
        p.x += p.vx + lateralSway;
        p.y += p.vy;

        // Wrap boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Interactive mouse deflection
        if (mouseRef.current.isInside) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 0) {
            const force = (130 - dist) / 130;
            p.x += (dx / dist) * force * 2.2;
            p.y += (dy / dist) * force * 2.2;
            p.alpha = Math.min(0.85, p.baseAlpha + force * 0.45);
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.04;
          }
        }

        // Twinkle factor
        const twinkle = 0.65 + 0.35 * Math.sin(time * 0.0025 + i * 2.2);
        const currentAlpha = p.alpha * twinkle;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Proximity micro-constellation threads between near particles
        for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.hypot(cdx, cdy);
          if (cdist < 65) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(102, 192, 244, ${(1 - cdist / 65) * 0.09})`;
            ctx.lineWidth = 0.75;
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
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dynamic 2D Canvas rendering auroras, dust motes, and cursor spotlights */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Subtle Dot Matrix Grid with Gentle CSS Breathing Animation */}
      <div className="absolute inset-0 ascii-matrix-bg opacity-30 animate-pulse-subtle pointer-events-none" />

      {/* Atmospheric Steam Vapor Gradients */}
      <div className="absolute inset-0 steam-mist-bg animate-steam-drift opacity-60 pointer-events-none" />
    </div>
  );
};
