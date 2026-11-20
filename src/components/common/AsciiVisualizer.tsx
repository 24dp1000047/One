import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export type AsciiMode = 'sphere' | 'lighthouse' | 'wireframe';

interface AsciiVisualizerProps {
  initialMode?: AsciiMode;
  className?: string;
  showSelector?: boolean;
}

export const AsciiVisualizer: React.FC<AsciiVisualizerProps> = ({
  initialMode = 'sphere',
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

  useEffect(() => {
    const handleReboot = () => {
      // Re-trigger flash effect
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '0.3';
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

    // ASCII characters density ramp
    const density = ' .:-=+*#%@';

    const render = () => {
      if (!pausedRef.current) {
        time += orbState === 'thinking' ? 0.05 : orbState === 'generating' ? 0.09 : 0.02;
      }

      ctx.fillStyle = '#040608';
      ctx.fillRect(0, 0, width, height);

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      if (mode === 'sphere') {
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

              // 3D rotation
              const rotY = time * 0.8;
              const rotX = 0.35;

              // Rotate coords
              const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
              const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
              const y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
              const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

              // Surface normal illumination
              const normalZ = z2 / radius;
              const normalX = x1 / radius;
              const normalY = y1 / radius;

              const lightX = 0.4;
              const lightY = -0.5;
              const lightZ = 0.7;
              const dot = Math.max(0, normalX * lightX + normalY * lightY + normalZ * lightZ);

              // Diagonal step slice check (Image 2 signature white stepped highlight!)
              // Slicing from top-right towards bottom-left
              const slicePos = (x + y * 0.7) / radius;
              const isStepHighlight = Math.abs(slicePos - 0.05) < 0.12 && (Math.floor((y + 160) / 14) % 2 === 0);

              let char = '#';
              let color = '#E6A868'; // Warm amber/gold

              if (isStepHighlight) {
                char = '#';
                color = '#FFFFFF'; // White / silver stepped line
              } else {
                // Character by density & depth
                const charIdx = Math.floor(dot * (density.length - 1));
                char = density[Math.min(density.length - 1, Math.max(1, charIdx))];

                // Y-based color gradient (amber at top, violet middle, twilight cyan bottom)
                const normY = (y + radius) / (radius * 2);
                if (normY < 0.32) {
                  color = '#E5A866'; // Amber / Gold top
                  if (dot > 0.6) char = '%';
                } else if (normY < 0.65) {
                  color = '#9875D8'; // Violet mid
                  if (dot > 0.5) char = '@';
                } else {
                  color = '#4A6999'; // Deep twilight blue bottom
                  if (dot > 0.4) char = '=';
                }
              }

              // Subtle random character shimmering
              if (Math.random() < 0.03 && !pausedRef.current) {
                char = '*';
              }

              ctx.fillStyle = color;
              ctx.fillText(char, centerX + x, centerY + y);
            }
          }
        }
      } else if (mode === 'lighthouse') {
        // --- MODE 2: ASCII LIGHTHOUSE & BEAM (Image 1) ---
        const towerX = width * 0.72;
        const towerTopY = 80;
        const towerH = 310;
        const lanternW = 55;
        const towerW = 44;

        // 1. Golden Glowing Lantern at top
        ctx.fillStyle = '#E5A866';
        for (let row = 0; row < 6; row++) {
          const char = row === 0 || row === 5 ? '########' : '########';
          ctx.fillText(char, towerX, towerTopY + row * 11);
        }

        // 2. Horizontal Light Beam Shooting Leftward
        const beamAngle = Math.sin(time * 0.5) * 0.08;
        ctx.fillStyle = 'rgba(229, 168, 102, 0.75)';
        for (let bx = 0; bx < 28; bx++) {
          const xPos = towerX - lanternW * 0.5 - bx * 11;
          const yPos = towerTopY + 22 + (bx * beamAngle * 10);
          const beamChar = bx % 2 === 0 ? '****************' : '++++++++++++++++';
          ctx.fillStyle = bx < 10 ? '#FFF2D9' : bx < 20 ? '#E5A866' : 'rgba(229, 168, 102, 0.35)';
          ctx.fillText(beamChar, xPos, yPos - 6);
          ctx.fillText(beamChar, xPos, yPos + 6);
        }

        // 3. Tower Body with Red/Crimson and Silver/White Bands
        const bodyTopY = towerTopY + 70;
        const numBands = 8;
        const bandH = 28;

        for (let b = 0; b < numBands; b++) {
          const isRed = b % 2 === 0;
          ctx.fillStyle = isRed ? '#C73838' : '#DDE4F0';

          const bandY = bodyTopY + b * bandH;
          const bandWidth = towerW + b * 2;

          for (let line = 0; line < 3; line++) {
            const charLine = isRed ? '#########' : '%%%%%%%%%';
            ctx.fillText(charLine, towerX, bandY + line * 9);
          }
        }

        // 4. Base rocks
        ctx.fillStyle = '#4B5568';
        ctx.fillText('////////////////////', towerX, bodyTopY + numBands * bandH + 5);
        ctx.fillText('====================', towerX, bodyTopY + numBands * bandH + 16);

        // 5. Monospace caption below tower (Image 1 match)
        ctx.fillStyle = '#8A94A6';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('A STEMONEF VERTICAL / A HUMAN BEGINNING', towerX - 30, height - 25);

      } else {
        // --- MODE 3: 3D WIREFRAME PERSPECTIVE CITY (Image 3) ---
        const vanishX = width * 0.5;
        const vanishY = height * 0.42;

        ctx.strokeStyle = '#8EAEEA';
        ctx.lineWidth = 1;

        // Vanishing perspective street lines
        for (let i = -10; i <= 10; i++) {
          const bottomX = vanishX + i * 38;
          ctx.beginPath();
          ctx.moveTo(vanishX, vanishY);
          ctx.lineTo(bottomX, height);
          ctx.strokeStyle = i === 0 ? '#E5A866' : 'rgba(142, 174, 234, 0.25)';
          ctx.stroke();
        }

        // Horizontal road depth grids
        for (let d = 1; d <= 12; d++) {
          const depthFactor = Math.pow(d / 12, 2.2);
          const gridY = vanishY + (height - vanishY) * depthFactor;
          ctx.beginPath();
          ctx.moveTo(0, gridY);
          ctx.lineTo(width, gridY);
          ctx.strokeStyle = `rgba(142, 174, 234, ${0.1 + depthFactor * 0.35})`;
          ctx.stroke();
        }

        // Wireframe City Monolith Buildings on Left & Right
        const buildings = [
          { x: 50, w: 70, h: 220, side: 'left' },
          { x: 130, w: 60, h: 170, side: 'left' },
          { x: 300, w: 55, h: 180, side: 'right' },
          { x: 365, w: 75, h: 230, side: 'right' },
        ];

        buildings.forEach((b) => {
          const by = height * 0.72 - b.h * 0.5;
          ctx.strokeStyle = 'rgba(220, 230, 248, 0.65)';
          ctx.strokeRect(b.x, by, b.w, b.h);

          // Internal wireframe floors
          for (let f = 1; f <= 5; f++) {
            ctx.beginPath();
            ctx.moveTo(b.x, by + (b.h / 6) * f);
            ctx.lineTo(b.x + b.w, by + (b.h / 6) * f);
            ctx.strokeStyle = 'rgba(142, 174, 234, 0.2)';
            ctx.stroke();
          }
        });

        // Matrix ASCII dashed rays
        ctx.fillStyle = '#8EAEEA';
        ctx.font = '10px "JetBrains Mono", monospace';
        for (let r = 0; r < 6; r++) {
          ctx.fillText('----.----.----', 80, 100 + r * 22);
          ctx.fillText('----.----.----', 400, 100 + r * 22);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, orbState]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Canvas container with ambient background glow */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#040608] shadow-2xl">
        <canvas ref={canvasRef} className="block transition-opacity duration-300" />

        {/* Ambient subtle lighting halo behind canvas */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />
      </div>

      {/* Mode Switcher Pills (Sphere / Lighthouse / Wireframe) */}
      {showSelector && (
        <div className="flex items-center gap-1.5 mt-3 px-2 py-1 rounded-full capsule-control text-[11px] font-mono text-zinc-400">
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
        </div>
      )}
    </div>
  );
};
