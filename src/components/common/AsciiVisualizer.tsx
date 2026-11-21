import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export type AsciiMode = 'sphere' | 'lighthouse' | 'wireframe';

interface AsciiVisualizerProps {
  initialMode?: AsciiMode;
  className?: string;
  showSelector?: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
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
  const warpBoostRef = useRef(0);
  const sparksRef = useRef<Spark[]>([]);

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

  const handleCanvasClick = (e: React.MouseEvent<HTMLElement>) => {
    warpBoostRef.current = 1.0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Emit 25 golden sparks
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      sparksRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 30 + 20,
        color: Math.random() > 0.4 ? '#E5A866' : '#A5C4F2',
      });
    }
  };

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

    // Floating 3D Cyber Particles
    const cyberMotes = Array.from({ length: 22 }, (_, idx) => ({
      id: idx,
      relX: (Math.random() - 0.5) * 320,
      relY: (Math.random() - 0.5) * 160,
      z: Math.random(),
      speed: Math.random() * 0.08 + 0.05,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#A5C4F2' : '#E5A866',
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = normX * 18;
      mouseRef.current.targetY = normY * 12;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Warp boost decay
      if (warpBoostRef.current > 0.01) {
        warpBoostRef.current *= 0.94;
      } else {
        warpBoostRef.current = 0;
      }

      const speedFactor = (orbState === 'thinking' ? 1.8 : orbState === 'generating' ? 2.8 : 1.0) + warpBoostRef.current * 2.5;
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
        // --- MODE 3: HIGH-OCTANE 3D WIREFRAME CYBER CITY ---
        // =========================================================
        const vanishX = width * 0.5 + mouseRef.current.x;
        const vanishY = height * 0.43 + mouseRef.current.y;

        // 1. Horizon Line & Glowing Vanishing Point Beacon
        ctx.strokeStyle = 'rgba(142, 174, 234, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, vanishY);
        ctx.lineTo(width, vanishY);
        ctx.stroke();

        // Multi-tier Horizon Shockwaves
        const shockPeriod = 3.0;
        const sw1 = ((time % shockPeriod) / shockPeriod);
        const swDepth1 = Math.pow(sw1, 2.4);
        const swY1 = vanishY + (height - vanishY) * swDepth1;
        const swSpread1 = width * (0.2 + swDepth1 * 0.95);

        ctx.beginPath();
        ctx.ellipse(vanishX, swY1, swSpread1 * 0.5, 4 + swDepth1 * 16, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(229, 168, 102, ${(1 - sw1) * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Amber Beacon Glow at Vanishing Point
        const glowPulse = 0.55 + Math.sin(time * 3.5) * 0.25;
        const gradient = ctx.createRadialGradient(vanishX, vanishY, 0, vanishX, vanishY, 42);
        gradient.addColorStop(0, `rgba(229, 168, 102, ${glowPulse * 0.95})`);
        gradient.addColorStop(0.4, `rgba(229, 168, 102, ${glowPulse * 0.4})`);
        gradient.addColorStop(1, 'rgba(229, 168, 102, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(vanishX, vanishY, 42, 0, Math.PI * 2);
        ctx.fill();

        // Rotating 8-Point Starburst Diffraction Flare at Vanishing Point
        const flareAngle = time * 0.8;
        ctx.save();
        ctx.translate(vanishX, vanishY);
        ctx.rotate(flareAngle);
        for (let s = 0; s < 4; s++) {
          ctx.rotate(Math.PI / 4);
          ctx.strokeStyle = `rgba(255, 230, 180, ${0.18 + Math.sin(time * 4) * 0.08})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-35, 0);
          ctx.lineTo(35, 0);
          ctx.stroke();
        }
        ctx.restore();

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

        // 3. SPEED VECTOR LASER LIGHT TRAILS (Tron / Cyberpunk Pulses streaming towards camera!)
        const numSpeedBeams = 7;
        for (let b = 0; b < numSpeedBeams; b++) {
          const beamOffset = ((time * 1.5 + b * 0.16) % 1.0);
          const depth = Math.pow(beamOffset, 2.9);
          const rayIdx = ((b * 4) % 13) - 6; // rays from -6 to +6
          const bottomX = vanishX + rayIdx * 28 + mouseRef.current.x * 0.5;
          const curX = vanishX + (bottomX - vanishX) * depth;
          const curY = vanishY + (height - vanishY) * depth;

          const prevDepth = Math.max(0, depth - 0.09);
          const prevX = vanishX + (bottomX - vanishX) * prevDepth;
          const prevY = vanishY + (height - vanishY) * prevDepth;

          const beamGrad = ctx.createLinearGradient(prevX, prevY, curX, curY);
          beamGrad.addColorStop(0, 'rgba(229, 168, 102, 0)');
          beamGrad.addColorStop(0.7, b % 2 === 0 ? 'rgba(229, 168, 102, 0.95)' : 'rgba(165, 196, 242, 0.95)');
          beamGrad.addColorStop(1, '#FFFFFF');

          ctx.strokeStyle = beamGrad;
          ctx.lineWidth = 1.5 + depth * 2.5;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          // Flare head
          if (depth > 0.45) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(curX, curY, 2 + depth * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 4. FLUID MOVING HORIZONTAL TRANSVERSE DEPTH GRIDS
        const numGrids = 16;
        for (let g = 0; g < numGrids; g++) {
          const rawOffset = ((g / numGrids) + (time * 0.38)) % 1.0;
          const depth = Math.pow(rawOffset, 2.8);
          const y = vanishY + (height - vanishY) * depth;

          const spread = width * (0.15 + depth * 0.92);
          const leftX = vanishX - spread * 0.5;
          const rightX = vanishX + spread * 0.5;

          ctx.beginPath();
          ctx.moveTo(Math.max(0, leftX), y);
          ctx.lineTo(Math.min(width, rightX), y);

          const alpha = Math.min(0.75, 0.05 + depth * 0.75);
          ctx.strokeStyle = `rgba(165, 196, 242, ${alpha})`;
          ctx.lineWidth = depth > 0.6 ? 1.5 : 1;
          ctx.stroke();
        }

        // 5. Center Dashed Road Markings Streaming Forward
        const numDashes = 11;
        for (let d = 0; d < numDashes; d++) {
          const dashOffset = ((d / numDashes) + (time * 0.75)) % 1.0;
          const depth = Math.pow(dashOffset, 2.6);
          const dashY = vanishY + (height - vanishY) * depth;
          const dashLen = 4 + depth * 24;

          ctx.beginPath();
          ctx.moveTo(vanishX, dashY);
          ctx.lineTo(vanishX, dashY + dashLen);
          ctx.strokeStyle = `rgba(255, 240, 200, ${0.2 + depth * 0.8})`;
          ctx.lineWidth = 2 + depth * 2.2;
          ctx.stroke();
        }

        // 6. MOVING WIREFRAME MONOLITHS WITH SCANNING LASERS & MATRIX WINDOWS
        baseBuildings.forEach((b) => {
          const currentZ = (b.z + (time * 0.12)) % 1.0;
          const depthScale = Math.pow(currentZ, 2.2);

          const bx = vanishX + b.relX * (0.2 + depthScale * 0.9) - (b.w * (0.3 + depthScale * 0.7)) * 0.5;
          const baseFloorY = vanishY + (height - vanishY) * depthScale;
          const currentH = b.h * (0.25 + depthScale * 0.8);
          const currentW = b.w * (0.25 + depthScale * 0.75);
          const by = baseFloorY - currentH;

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

            // Internal Horizontal Floor Lines & Flickering Matrix Windows
            const floors = 5;
            for (let f = 1; f < floors; f++) {
              const fy = by + (currentH / floors) * f;
              ctx.beginPath();
              ctx.moveTo(bx, fy);
              ctx.lineTo(bx + currentW, fy);
              ctx.strokeStyle = `rgba(142, 174, 234, ${alpha * 0.3})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();

              // Window Accents that twinkle
              if (depthScale > 0.28) {
                for (let wCol = 1; wCol <= 3; wCol++) {
                  const wx = bx + (currentW / 4) * wCol;
                  const isLit = Math.sin(time * 3 + b.id * 10 + f * 5 + wCol) > 0.15;
                  if (isLit) {
                    ctx.fillStyle = b.id % 2 === 0 ? `rgba(229, 168, 102, ${alpha * 0.9})` : `rgba(165, 196, 242, ${alpha * 0.9})`;
                    ctx.fillRect(wx - 2, fy - 3, 3, 4);
                  }
                }
              }
            }

            // Vertical Scanning Laser Beam on Front Building
            if (depthScale > 0.35) {
              const scanY = by + ((time * 40 + b.id * 25) % currentH);
              ctx.strokeStyle = 'rgba(165, 196, 242, 0.75)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(bx, scanY);
              ctx.lineTo(bx + currentW, scanY);
              ctx.stroke();
            }
          }
        });

        // 7. FLOATING 3D PERSPECTIVE DUST MOTES
        cyberMotes.forEach((m) => {
          m.z = (m.z + m.speed * speedFactor * 0.05) % 1.0;
          const zDepth = Math.pow(m.z, 2.2);
          const px = vanishX + m.relX * (0.15 + zDepth * 1.1);
          const py = vanishY + m.relY * (0.2 + zDepth * 1.0);
          const pSize = m.size * (0.4 + zDepth * 1.4);
          const pAlpha = Math.min(0.8, 0.1 + zDepth * 0.7);

          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.globalAlpha = pAlpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        });

        // 8. INTERACTIVE CLICK SPARKS
        for (let s = sparksRef.current.length - 1; s >= 0; s--) {
          const sp = sparksRef.current[s];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vy += 0.1; // gravity
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

        // 9. Streaming Upper Matrix ASCII Telemetry Rays
        ctx.fillStyle = '#8EAEEA';
        ctx.font = '10px "JetBrains Mono", monospace';
        for (let r = 0; r < 6; r++) {
          const shift = Math.floor((time * 4 + r * 2) % 6);
          const dashChars = shift % 2 === 0 ? '----.----.----' : '....----....----';
          ctx.fillText(dashChars, 75 + mouseRef.current.x * 0.3, 90 + r * 22);
          ctx.fillText(dashChars, 405 + mouseRef.current.x * 0.3, 90 + r * 22);
        }

        // Live Telemetry Watermark with Warp Notice
        ctx.fillStyle = warpBoostRef.current > 0.1 ? '#E5A866' : 'rgba(165, 196, 242, 0.45)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(
          warpBoostRef.current > 0.1
            ? `⚡ WARP ACCELERATION ENGAGED [${(warpBoostRef.current * 100).toFixed(0)}%]`
            : `60FPS // PERSPECTIVE VECTOR ACTIVE [${time.toFixed(1)}s]`,
          width * 0.5,
          height - 14
        );

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
      } else if (mode === 'lighthouse') {
        // --- MODE 2: BEACON ---
        const towerX = width * 0.5;
        const towerTopY = 90;
        const beamAngle = time * 1.5;

        ctx.save();
        ctx.translate(towerX, towerTopY + 20);

        const beamLength = 260;
        const beamWidth = 45;

        for (let side = -1; side <= 1; side += 2) {
          const curAngle = beamAngle + (side === 1 ? Math.PI : 0);
          const endX = Math.cos(curAngle) * beamLength;
          const endY = Math.sin(curAngle) * beamLength * 0.4;

          const grad = ctx.createRadialGradient(0, 0, 0, endX, endY, beamLength);
          grad.addColorStop(0, 'rgba(255, 230, 160, 0.7)');
          grad.addColorStop(0.3, 'rgba(255, 200, 100, 0.25)');
          grad.addColorStop(1, 'rgba(255, 200, 100, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(endX - Math.sin(curAngle) * beamWidth, endY + Math.cos(curAngle) * beamWidth);
          ctx.lineTo(endX + Math.sin(curAngle) * beamWidth, endY - Math.cos(curAngle) * beamWidth);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Tower geometry
        ctx.fillStyle = '#E5A866';
        ctx.fillText('/\\', towerX, towerTopY);
        ctx.fillText('/==\\', towerX, towerTopY + 11);
        ctx.fillText('|**|', towerX, towerTopY + 22);

        const numBands = 7;
        const bodyTopY = towerTopY + 36;
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
      {/* Canvas container with ambient background glow & interactive click */}
      <div 
        onClick={handleCanvasClick}
        className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#040608] shadow-2xl cursor-pointer group transition-all duration-300 hover:border-[#E5A866]/40 hover:shadow-[0_0_35px_rgba(229,168,102,0.18)]"
        title="Click canvas to trigger interactive warp acceleration!"
      >
        <canvas ref={canvasRef} className="block transition-opacity duration-300" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

        {/* Subtle interactive hover cue */}
        <div className="absolute top-3 right-3 text-[9px] font-mono text-zinc-500 group-hover:text-[#E5A866] transition-colors pointer-events-none bg-black/60 px-2 py-0.5 rounded-full border border-white/5">
          [CLICK TO WARP]
        </div>
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
