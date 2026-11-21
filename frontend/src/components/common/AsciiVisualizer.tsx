import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export type AsciiMode = 'sphere' | 'lighthouse' | 'wireframe';

interface AsciiVisualizerProps {
  initialMode?: AsciiMode;
  className?: string;
  showSelector?: boolean;
}

export const AsciiVisualizer: React.FC<AsciiVisualizerProps> = ({
  initialMode = 'wireframe',
  className = '',
  showSelector = true,
}) => {
  const [mode, setMode] = useState<AsciiMode>(initialMode);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMotionPaused = useAppStore((state) => state.isMotionPaused);
  const orbState = useAppStore((state) => state.orbState);

  const pausedRef = useRef(isMotionPaused);
  useEffect(() => {
    pausedRef.current = isMotionPaused;
  }, [isMotionPaused]);

  // Track mouse coordinates for subtle interactive perspective shift
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleReboot = () => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '0.25';
        setTimeout(() => {
          if (canvasRef.current) canvasRef.current.style.opacity = '1';
        }, 150);
      }
    };
    window.addEventListener('matrix-reboot', handleReboot);
    return () => window.removeEventListener('matrix-reboot', handleReboot);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = 480;
    const height = 480;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const density = ' .:-=+*#%@';

    // 3D Wireframe buildings with depth $z$ for smooth forward infinite stream
    const baseBuildings = [
      { id: 1, relX: -160, w: 75, h: 220, z: 0.15 },
      { id: 2, relX: -85, w: 55, h: 170, z: 0.45 },
      { id: 3, relX: -150, w: 65, h: 200, z: 0.75 },
      { id: 4, relX: 85, w: 55, h: 180, z: 0.25 },
      { id: 5, relX: 160, w: 80, h: 240, z: 0.55 },
      { id: 6, relX: 95, w: 60, h: 190, z: 0.85 },
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = normX * 15;
      mouseRef.current.targetY = normY * 10;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const speedFactor = orbState === 'thinking' ? 1.8 : orbState === 'generating' ? 2.8 : 1.0;
      if (!pausedRef.current) {
        time += 0.02 * speedFactor;
      }

      ctx.fillStyle = '#040608';
      ctx.fillRect(0, 0, width, height);

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      if (mode === 'wireframe') {
        // =========================================================
        // --- MODE 3: ACTIVELY MOVING 3D WIREFRAME CITY (Image 3) ---
        // =========================================================
        const vanishX = width * 0.5 + mouseRef.current.x;
        const vanishY = height * 0.43 + mouseRef.current.y;

        // 1. Horizon Line & Glowing Vanishing Point Beacon
        ctx.strokeStyle = 'rgba(142, 174, 234, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, vanishY);
        ctx.lineTo(width, vanishY);
        ctx.stroke();

        // Amber Beacon Glow at Vanishing Point
        const glowPulse = 0.5 + Math.sin(time * 3) * 0.2;
        const gradient = ctx.createRadialGradient(vanishX, vanishY, 0, vanishX, vanishY, 35);
        gradient.addColorStop(0, `rgba(229, 168, 102, ${glowPulse * 0.8})`);
        gradient.addColorStop(1, 'rgba(229, 168, 102, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(vanishX, vanishY, 35, 0, Math.PI * 2);
        ctx.fill();

        // 2. Vanishing Perspective Radial Street Vectors
        const numRays = 18;
        for (let i = -numRays; i <= numRays; i++) {
          const bottomX = vanishX + i * 28 + mouseRef.current.x * 0.5;
          ctx.beginPath();
          ctx.moveTo(vanishX, vanishY);
          ctx.lineTo(bottomX, height);

          if (i === 0) {
            // Golden Center Divider Line
            ctx.strokeStyle = '#E5A866';
            ctx.lineWidth = 1.5;
          } else if (Math.abs(i) === 3 || Math.abs(i) === 6) {
            // Road Curb Borders
            ctx.strokeStyle = 'rgba(165, 196, 242, 0.45)';
            ctx.lineWidth = 1;
          } else {
            ctx.strokeStyle = 'rgba(142, 174, 234, 0.14)';
            ctx.lineWidth = 0.8;
          }
          ctx.stroke();
        }

        // 3. FLUID MOVING HORIZONTAL TRANSVERSE DEPTH GRIDS (Streaming towards camera!)
        const numGrids = 16;
        for (let g = 0; g < numGrids; g++) {
          // Modular continuous offset moving forward!
          const rawOffset = ((g / numGrids) + (time * 0.35)) % 1.0;
          // Exponential perspective depth warp
          const depth = Math.pow(rawOffset, 2.8);
          const y = vanishY + (height - vanishY) * depth;

          // Road width spreads as it approaches the screen
          const spread = width * (0.15 + depth * 0.9);
          const leftX = vanishX - spread * 0.5;
          const rightX = vanishX + spread * 0.5;

          ctx.beginPath();
          ctx.moveTo(Math.max(0, leftX), y);
          ctx.lineTo(Math.min(width, rightX), y);

          // Alpha fades in near horizon, reaches maximum intensity near bottom
          const alpha = Math.min(0.7, 0.05 + depth * 0.75);
          ctx.strokeStyle = `rgba(165, 196, 242, ${alpha})`;
          ctx.lineWidth = depth > 0.6 ? 1.5 : 1;
          ctx.stroke();
        }

        // 4. Center Dashed Road Markings Streaming Forward
        const numDashes = 10;
        for (let d = 0; d < numDashes; d++) {
          const dashOffset = ((d / numDashes) + (time * 0.7)) % 1.0;
          const depth = Math.pow(dashOffset, 2.6);
          const dashY = vanishY + (height - vanishY) * depth;
          const dashLen = 4 + depth * 22;

          ctx.beginPath();
          ctx.moveTo(vanishX, dashY);
          ctx.lineTo(vanishX, dashY + dashLen);
          ctx.strokeStyle = `rgba(255, 240, 200, ${0.2 + depth * 0.8})`;
          ctx.lineWidth = 2 + depth * 2;
          ctx.stroke();
        }

        // 5. MOVING WIREFRAME MONOLITHS & BUILDINGS (With continuous 3D forward translation!)
        baseBuildings.forEach((b) => {
          // Calculate moving depth z from 0 (horizon) to 1 (passes screen)
          const currentZ = (b.z + (time * 0.12)) % 1.0;
          const depthScale = Math.pow(currentZ, 2.2);

          // Calculate 3D perspective position
          const bx = vanishX + b.relX * (0.2 + depthScale * 0.9) - (b.w * (0.3 + depthScale * 0.7)) * 0.5;
          const baseFloorY = vanishY + (height - vanishY) * depthScale;
          const currentH = b.h * (0.25 + depthScale * 0.8);
          const currentW = b.w * (0.25 + depthScale * 0.75);
          const by = baseFloorY - currentH;

          // Only draw if within visible canvas bounds
          if (baseFloorY > vanishY && by < height + 50) {
            const alpha = Math.min(0.85, 0.15 + depthScale * 0.75);

            // Building Outer Wireframe
            ctx.strokeStyle = `rgba(220, 232, 252, ${alpha})`;
            ctx.lineWidth = depthScale > 0.5 ? 1.5 : 1;
            ctx.strokeRect(bx, by, currentW, currentH);

            // Roof Perspective Lines to Vanishing Point
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(vanishX, vanishY);
            ctx.moveTo(bx + currentW, by);
            ctx.lineTo(vanishX, vanishY);
            ctx.strokeStyle = `rgba(165, 196, 242, ${alpha * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Internal Horizontal Floor Lines
            const floors = 5;
            for (let f = 1; f < floors; f++) {
              const fy = by + (currentH / floors) * f;
              ctx.beginPath();
              ctx.moveTo(bx, fy);
              ctx.lineTo(bx + currentW, fy);
              ctx.strokeStyle = `rgba(142, 174, 234, ${alpha * 0.3})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }

            // Window Accent Glow Dot
            if (depthScale > 0.3) {
              ctx.fillStyle = `rgba(229, 168, 102, ${alpha * 0.85})`;
              ctx.fillRect(bx + currentW * 0.4, by + currentH * 0.3, 3, 5);
            }
          }
        });

        // 6. Streaming Upper Matrix ASCII Telemetry Rays (Image 3 exact match)
        ctx.fillStyle = '#8EAEEA';
        ctx.font = '10px "JetBrains Mono", monospace';
        for (let r = 0; r < 6; r++) {
          const shift = Math.floor((time * 4 + r * 2) % 6);
          const dashChars = shift % 2 === 0 ? '----.----.----' : '....----....----';
          ctx.fillText(dashChars, 75 + mouseRef.current.x * 0.3, 90 + r * 22);
          ctx.fillText(dashChars, 405 + mouseRef.current.x * 0.3, 90 + r * 22);
        }

        // Live Telemetry Watermark
        ctx.fillStyle = 'rgba(165, 196, 242, 0.45)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`60FPS // PERSPECTIVE VECTOR ACTIVE [${time.toFixed(1)}s]`, width * 0.5, height - 14);

      } else if (mode === 'sphere') {
        // --- MODE 1: ASCII MATRIX SPHERE (Image 2) ---
        const rows = 32;
        const cols = 42;
        const cellW = width / cols;
        const cellH = height / rows;
        const radius = 155;
        const centerX = width * 0.52;
        const centerY = height * 0.5;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = (c - cols / 2) * cellW;
            const y = (r - rows / 2) * cellH;
            const distSq = x * x + y * y;

            if (distSq <= radius * radius) {
              const z = Math.sqrt(radius * radius - distSq);
              const rotY = time * 0.8;
              const rotX = 0.35;

              const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
              const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
              const y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
              const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

              const normalZ = z2 / radius;
              const normalX = x1 / radius;
              const normalY = y1 / radius;

              const lightX = 0.4;
              const lightY = -0.5;
              const lightZ = 0.7;
              const dot = Math.max(0, normalX * lightX + normalY * lightY + normalZ * lightZ);

              const slicePos = (x + y * 0.7) / radius;
              const isStepHighlight = Math.abs(slicePos - 0.05) < 0.12 && (Math.floor((y + 160) / 14) % 2 === 0);

              let char = '#';
              let color = '#E6A868';

              if (isStepHighlight) {
                char = '#';
                color = '#FFFFFF';
              } else {
                const charIdx = Math.floor(dot * (density.length - 1));
                char = density[Math.min(density.length - 1, Math.max(1, charIdx))];

                const normY = (y + radius) / (radius * 2);
                if (normY < 0.32) {
                  color = '#E5A866';
                  if (dot > 0.6) char = '%';
                } else if (normY < 0.65) {
                  color = '#9875D8';
                  if (dot > 0.5) char = '@';
                } else {
                  color = '#4A6999';
                  if (dot > 0.4) char = '=';
                }
              }

              if (Math.random() < 0.03 && !pausedRef.current) {
                char = '*';
              }

              ctx.fillStyle = color;
              ctx.fillText(char, centerX + x, centerY + y);
            }
          }
        }
      } else {
        // --- MODE 2: ASCII LIGHTHOUSE & BEAM (Image 1) ---
        const towerX = width * 0.72;
        const towerTopY = 80;
        const lanternW = 55;
        const towerW = 44;

        ctx.fillStyle = '#E5A866';
        for (let row = 0; row < 6; row++) {
          ctx.fillText('########', towerX, towerTopY + row * 11);
        }

        const beamAngle = Math.sin(time * 0.5) * 0.08;
        for (let bx = 0; bx < 28; bx++) {
          const xPos = towerX - lanternW * 0.5 - bx * 11;
          const yPos = towerTopY + 22 + (bx * beamAngle * 10);
          const beamChar = bx % 2 === 0 ? '****************' : '++++++++++++++++';
          ctx.fillStyle = bx < 10 ? '#FFF2D9' : bx < 20 ? '#E5A866' : 'rgba(229, 168, 102, 0.35)';
          ctx.fillText(beamChar, xPos, yPos - 6);
          ctx.fillText(beamChar, xPos, yPos + 6);
        }

        const bodyTopY = towerTopY + 70;
        const numBands = 8;
        const bandH = 28;

        for (let b = 0; b < numBands; b++) {
          const isRed = b % 2 === 0;
          ctx.fillStyle = isRed ? '#C73838' : '#DDE4F0';
          const bandY = bodyTopY + b * bandH;

          for (let line = 0; line < 3; line++) {
            ctx.fillText(isRed ? '#########' : '%%%%%%%%%', towerX, bandY + line * 9);
          }
        }

        ctx.fillStyle = '#4B5568';
        ctx.fillText('////////////////////', towerX, bodyTopY + numBands * bandH + 5);
        ctx.fillText('====================', towerX, bodyTopY + numBands * bandH + 16);

        ctx.fillStyle = '#8A94A6';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('A CREATIVE VERTICAL / ONE SPACE. INFINITE POSSIBILITIES.', towerX - 70, height - 25);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mode, orbState]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Canvas container with ambient background glow */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#040608] shadow-2xl">
        <canvas ref={canvasRef} className="block transition-opacity duration-300" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />
      </div>

      {/* Mode Switcher Pills */}
      {showSelector && (
        <div className="flex items-center gap-1.5 mt-3 px-2 py-1 rounded-full capsule-control text-[11px] font-mono text-zinc-400">
          <button
            onClick={() => setMode('wireframe')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              mode === 'wireframe'
                ? 'bg-white/15 text-white font-medium border border-white/20 shadow-sm'
                : 'hover:text-white'
            }`}
          >
            3D Wireframe
          </button>
          <button
            onClick={() => setMode('sphere')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              mode === 'sphere'
                ? 'bg-white/15 text-white font-medium border border-white/20 shadow-sm'
                : 'hover:text-white'
            }`}
          >
            ASCII Sphere
          </button>
          <button
            onClick={() => setMode('lighthouse')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              mode === 'lighthouse'
                ? 'bg-white/15 text-white font-medium border border-white/20 shadow-sm'
                : 'hover:text-white'
            }`}
          >
            Beacon
          </button>
        </div>
      )}
    </div>
  );
};
