import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { OrbState } from '../../types';

interface AIOrbProps {
  size?: number;
  interactive?: boolean;
  className?: string;
  showControls?: boolean;
}

export const AIOrb: React.FC<AIOrbProps> = ({
  size = 280,
  interactive = true,
  className = '',
  showControls = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const orbState = useAppStore((state) => state.orbState);
  const setOrbState = useAppStore((state) => state.setOrbState);
  const orbStateRef = useRef<OrbState>(orbState);

  useEffect(() => {
    orbStateRef.current = orbState;
  }, [orbState]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = size;
    const height = size;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Core Glowing Icosahedron
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 3);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD600,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner Solid Glow Sphere
    const innerGeometry = new THREE.SphereGeometry(0.85, 24, 24);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF7A1A,
      transparent: true,
      opacity: 0.25,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Swirling Particle Cloud
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const yellowColor = new THREE.Color('#FFD600');
    const orangeColor = new THREE.Color('#FF7A1A');
    const whiteColor = new THREE.Color('#FFFFFF');

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution on sphere surface
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 1.6 + (Math.random() - 0.5) * 0.5;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Color interpolation
      const mixRatio = Math.random();
      const color = mixRatio > 0.6 ? yellowColor : mixRatio > 0.2 ? orangeColor : whiteColor;
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Orbit Ring 1 (Signature Yellow)
    const ringGeometry1 = new THREE.TorusGeometry(2.1, 0.015, 8, 80);
    const ringMaterial1 = new THREE.MeshBasicMaterial({
      color: 0xFFD600,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    scene.add(ring1);

    // Orbit Ring 2 (Orange Accent)
    const ringGeometry2 = new THREE.TorusGeometry(2.35, 0.012, 8, 80);
    const ringMaterial2 = new THREE.MeshBasicMaterial({
      color: 0xFF7A1A,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    scene.add(ring2);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentState = orbStateRef.current;

      let speedMultiplier = 1;
      let pulseScale = 1;

      if (currentState === 'idle') {
        speedMultiplier = 0.8;
        // Breathing animation
        pulseScale = 1 + Math.sin(elapsedTime * 1.8) * 0.06;
        coreMaterial.opacity = 0.35 + Math.sin(elapsedTime * 2) * 0.1;
        innerMaterial.color.setHex(0xFF7A1A);
      } else if (currentState === 'thinking') {
        speedMultiplier = 2.2;
        // Rapid rhythmic pulse
        pulseScale = 1 + Math.sin(elapsedTime * 5.0) * 0.14;
        coreMaterial.opacity = 0.6 + Math.sin(elapsedTime * 6) * 0.25;
        innerMaterial.color.setHex(0xFFD600);
      } else if (currentState === 'generating') {
        speedMultiplier = 4.2;
        // Vortex warp
        pulseScale = 1.05 + Math.sin(elapsedTime * 8.0) * 0.18;
        coreMaterial.opacity = 0.85;
        particleMaterial.size = 0.07;
        innerMaterial.color.setHex(0xFF7A1A);
      }

      // Apply rotations
      coreMesh.rotation.x = elapsedTime * 0.35 * speedMultiplier;
      coreMesh.rotation.y = elapsedTime * 0.5 * speedMultiplier;
      coreMesh.scale.set(pulseScale, pulseScale, pulseScale);

      innerMesh.rotation.y = -elapsedTime * 0.4 * speedMultiplier;
      innerMesh.scale.set(pulseScale * 0.9, pulseScale * 0.9, pulseScale * 0.9);

      particles.rotation.y = elapsedTime * 0.25 * speedMultiplier;
      particles.rotation.z = elapsedTime * 0.15 * speedMultiplier;

      ring1.rotation.z = elapsedTime * 0.3 * speedMultiplier;
      ring2.rotation.y = -elapsedTime * 0.4 * speedMultiplier;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      ringGeometry1.dispose();
      ringMaterial1.dispose();
      ringGeometry2.dispose();
      ringMaterial2.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  const handleOrbClick = () => {
    if (!interactive) return;
    const states: OrbState[] = ['idle', 'thinking', 'generating'];
    const nextIndex = (states.indexOf(orbState) + 1) % states.length;
    setOrbState(states[nextIndex]);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Outer ambient glow */}
      <div 
        className={`absolute rounded-full pointer-events-none transition-all duration-700 ${
          orbState === 'generating' 
            ? 'w-[320px] h-[320px] bg-brand-orange/20 blur-3xl animate-pulse' 
            : orbState === 'thinking'
            ? 'w-[300px] h-[300px] bg-brand-yellow/25 blur-3xl animate-pulse-slow'
            : 'w-[260px] h-[260px] bg-brand-yellow/15 blur-2xl'
        }`}
      />

      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        onClick={handleOrbClick}
        title={interactive ? 'Click to cycle AI state (Idle / Thinking / Generating)' : undefined}
        className={`relative z-10 cursor-pointer select-none transition-transform duration-300 hover:scale-105 active:scale-95`}
        style={{ width: size, height: size }}
      />

      {/* State Badge */}
      <div className="relative z-10 mt-1 flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515]/90 border border-[#292929] text-xs font-mono shadow-inner">
        <span 
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            orbState === 'generating'
              ? 'bg-brand-orange animate-ping'
              : orbState === 'thinking'
              ? 'bg-brand-yellow animate-pulse'
              : 'bg-emerald-400'
          }`}
        />
        <span className="capitalize text-zinc-300 font-medium">
          {orbState === 'idle' ? 'AI Ready' : orbState === 'thinking' ? 'AI Thinking...' : 'Generating 8K'}
        </span>
      </div>

      {/* Optional Interactive State Switcher */}
      {showControls && (
        <div className="relative z-10 mt-3 flex items-center gap-1.5 p-1 rounded-lg bg-[#121212] border border-[#242424] text-[11px] font-mono">
          {(['idle', 'thinking', 'generating'] as OrbState[]).map((state) => (
            <button
              key={state}
              onClick={() => setOrbState(state)}
              className={`px-2.5 py-1 rounded-md transition-all uppercase tracking-wider ${
                orbState === state
                  ? 'bg-brand-yellow text-black font-semibold shadow-glow-yellow-sm'
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
