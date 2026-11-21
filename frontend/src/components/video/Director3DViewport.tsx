import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Camera, 
  Sun, 
  Compass, 
  Move3d, 
  Sliders, 
  Play, 
  RotateCw, 
  Check, 
  Crosshair, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';

export const Director3DViewport: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRig = useAppStore((state) => state.cameraRig);
  const updateCameraRig = useAppStore((state) => state.updateCameraRig);
  const applyCameraRigToPrompt = useAppStore((state) => state.applyCameraRigToPrompt);
  const addToast = useAppStore((state) => state.addToast);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSimulatingManeuver, setIsSimulatingManeuver] = useState(false);
  const [activeManeuver, setActiveManeuver] = useState<string | null>(null);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const subjectMeshRef = useRef<THREE.Group | null>(null);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const lightGizmoRef = useRef<THREE.Mesh | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030508');
    scene.fog = new THREE.FogExp2('#030508', 0.025);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(cameraRig.fov, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x182030, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(new THREE.Color(cameraRig.lightingColor), cameraRig.lightingIntensity);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);
    lightRef.current = dirLight;

    // Light position marker gizmo
    const gizmoGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const gizmoMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(cameraRig.lightingColor), wireframe: true });
    const lightGizmo = new THREE.Mesh(gizmoGeo, gizmoMat);
    scene.add(lightGizmo);
    lightGizmoRef.current = lightGizmo;

    // 5. Environment Grid
    const grid = new THREE.GridHelper(50, 50, 0x3d4a63, 0x121722);
    grid.position.y = -1;
    scene.add(grid);
    gridHelperRef.current = grid;

    // 6. Central Subject (Futuristic Monolith with Floating Rings)
    const subjectGroup = new THREE.Group();

    // Central obsidian monolith
    const monolithGeo = new THREE.BoxGeometry(1.6, 5.0, 1.6);
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      metalness: 0.85,
      roughness: 0.15,
    });
    const monolith = new THREE.Mesh(monolithGeo, monolithMat);
    monolith.position.y = 1.5;
    monolith.castShadow = true;
    monolith.receiveShadow = true;
    subjectGroup.add(monolith);

    // Glowing core edge lines
    const wireGeo = new THREE.EdgesGeometry(monolithGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xe5a866, linewidth: 2 });
    const wireLine = new THREE.LineSegments(wireGeo, wireMat);
    wireLine.position.y = 1.5;
    subjectGroup.add(wireLine);

    // Orbiting holographic rings
    const ringGeo1 = new THREE.TorusGeometry(2.4, 0.03, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xa5c4f2, wireframe: true });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.position.y = 2.0;
    subjectGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(3.2, 0.03, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffd600, wireframe: true });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.position.y = 1.6;
    subjectGroup.add(ring2);

    // Surrounding futuristic micro-towers
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 6.5 + (i % 2) * 2;
      const h = 2.0 + (i % 3) * 1.5;
      const towerGeo = new THREE.BoxGeometry(0.8, h, 0.8);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x070a10, wireframe: true });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(Math.cos(angle) * radius, h / 2 - 1, Math.sin(angle) * radius);
      subjectGroup.add(tower);
    }

    scene.add(subjectGroup);
    subjectMeshRef.current = subjectGroup;

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow rotation of rings
      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.y = elapsedTime * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync Camera Rig & Lighting with Three.js
  useEffect(() => {
    if (!cameraRef.current || !lightRef.current || !lightGizmoRef.current) return;

    // Update FOV
    cameraRef.current.fov = cameraRig.fov;
    cameraRef.current.updateProjectionMatrix();

    // Calculate Spherical Camera Position from Pitch & Yaw
    const radYaw = (cameraRig.yaw * Math.PI) / 180;
    const radPitch = (cameraRig.pitch * Math.PI) / 180;
    const dist = cameraRig.distance;

    const camX = dist * Math.cos(radPitch) * Math.sin(radYaw);
    const camY = Math.max(0.5, dist * Math.sin(radPitch));
    const camZ = dist * Math.cos(radPitch) * Math.cos(radYaw);

    cameraRef.current.position.set(camX, camY, camZ);
    cameraRef.current.lookAt(0, 1.5, 0);

    // Update Directional Light & Gizmo position
    const lightRad = (cameraRig.lightingAngle * Math.PI) / 180;
    const lightX = 12 * Math.cos(lightRad);
    const lightZ = 12 * Math.sin(lightRad);
    lightRef.current.position.set(lightX, 10, lightZ);
    lightRef.current.color = new THREE.Color(cameraRig.lightingColor);
    lightRef.current.intensity = cameraRig.lightingIntensity;

    lightGizmoRef.current.position.set(lightX, 10, lightZ);
    (lightGizmoRef.current.material as THREE.MeshBasicMaterial).color = new THREE.Color(cameraRig.lightingColor);
  }, [cameraRig]);

  // Mouse Interaction: Click & Drag to Orbit Camera
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const newYaw = (cameraRig.yaw + deltaX * 0.4) % 360;
    const newPitch = Math.max(-25, Math.min(85, cameraRig.pitch - deltaY * 0.3));

    updateCameraRig({ yaw: Math.round(newYaw), pitch: Math.round(newPitch) });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newDist = Math.max(5, Math.min(30, cameraRig.distance + e.deltaY * 0.015));
    updateCameraRig({ distance: parseFloat(newDist.toFixed(1)) });
  };

  // Preset Maneuver Animation Simulation
  const runCameraManeuver = (maneuverName: string) => {
    setIsSimulatingManeuver(true);
    setActiveManeuver(maneuverName);
    audioSynth.playWhoosh();

    const startYaw = cameraRig.yaw;
    const startPitch = cameraRig.pitch;
    const startDist = cameraRig.distance;

    let progress = 0;
    const interval = window.setInterval(() => {
      progress += 0.04;
      if (progress >= 1.0) {
        clearInterval(interval);
        setIsSimulatingManeuver(false);
        setActiveManeuver(null);
        addToast({
          type: 'success',
          title: 'Maneuver Simulated',
          message: `${maneuverName} sequence executed across 3D vector.`,
        });
        return;
      }

      if (maneuverName === 'Orbit 360°') {
        updateCameraRig({ yaw: Math.round((startYaw + progress * 180) % 360) });
      } else if (maneuverName === 'Crane Up') {
        updateCameraRig({
          pitch: Math.round(startPitch + Math.sin(progress * Math.PI) * 25),
          distance: parseFloat((startDist + progress * 4).toFixed(1)),
        });
      } else if (maneuverName === 'FPV Dive') {
        updateCameraRig({
          pitch: Math.round(startPitch - Math.sin(progress * Math.PI) * 20),
          distance: Math.max(6, parseFloat((startDist - Math.sin(progress * Math.PI) * 6).toFixed(1))),
        });
      } else if (maneuverName === 'Dolly Zoom (Vertigo)') {
        const factor = Math.sin(progress * Math.PI);
        updateCameraRig({
          distance: parseFloat((startDist - factor * 5).toFixed(1)),
          fov: Math.round(35 + factor * 30),
        });
      }
    }, 40);
  };

  // Lens presets
  const lensPresets = [
    { label: '18mm', fov: 68, name: 'Ultra-Wide' },
    { label: '24mm', fov: 54, name: 'Anamorphic' },
    { label: '35mm', fov: 38, name: 'Cinematic' },
    { label: '50mm', fov: 28, name: 'Natural' },
    { label: '85mm', fov: 18, name: 'Portrait' },
    { label: '135mm', fov: 12, name: 'Telephoto' },
  ];

  // Lighting presets
  const lightColors = [
    { label: '5600K Daylight', color: '#E0EDFF' },
    { label: '3200K Tungsten', color: '#FFD29D' },
    { label: 'Cyber Blue', color: '#00F0FF' },
    { label: 'Neon Crimson', color: '#FF2A6D' },
    { label: 'Amber Solar', color: '#FFD600' },
  ];

  return (
    <div className="relative w-full rounded-2xl bg-[#040608] border border-[#181C26] overflow-hidden flex flex-col">
      {/* Viewport Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#141822] bg-[#07090F]/90 backdrop-blur-md z-10 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#A5C4F2]">
            <Move3d className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">3D Director's Rig</span>
          </div>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400 text-[11px]">Three.js WebGL Spatial Engine</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            REAL-TIME VIEWPORT
          </span>
          <button
            onClick={applyCameraRigToPrompt}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E5A866]/15 hover:bg-[#E5A866]/25 border border-[#E5A866]/30 text-[#E5A866] transition-all cursor-pointer font-sans text-xs font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sync Vector to Prompt</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Container */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`relative w-full h-[480px] sm:h-[540px] cursor-grab active:cursor-grabbing select-none overflow-hidden ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        {/* On-Canvas Telemetry HUD Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none font-mono text-[11px] text-zinc-400 space-y-1 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <div className="text-white font-semibold flex items-center gap-1.5 text-xs">
            <Crosshair className="w-3.5 h-3.5 text-[#A5C4F2]" />
            <span>CAMERA TELEMETRY</span>
          </div>
          <div>YAW: <span className="text-white">{cameraRig.yaw}°</span></div>
          <div>PITCH: <span className="text-white">{cameraRig.pitch}°</span></div>
          <div>DISTANCE: <span className="text-white">{cameraRig.distance}m</span></div>
          <div>FOV: <span className="text-brand-yellow">{cameraRig.fov}mm Equiv.</span></div>
          <div>APERTURE: <span className="text-brand-orange">{cameraRig.aperture}</span></div>
          <div>LIGHT ANGLE: <span className="text-white">{cameraRig.lightingAngle}°</span></div>
        </div>

        {/* Viewport Center Crosshair (Rule of Thirds HUD) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </div>

        {/* Floating Maneuvers Bar */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest text-right pr-1">
            Maneuver Simulation
          </div>
          {['Orbit 360°', 'Crane Up', 'FPV Dive', 'Dolly Zoom (Vertigo)'].map((m) => (
            <button
              key={m}
              disabled={isSimulatingManeuver}
              onClick={() => runCameraManeuver(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all text-left flex items-center justify-between gap-3 border cursor-pointer ${
                activeManeuver === m
                  ? 'bg-[#A5C4F2]/20 border-[#A5C4F2] text-white shadow-lg shadow-[#A5C4F2]/10'
                  : 'bg-black/60 hover:bg-black/90 border-white/10 text-zinc-300 hover:text-white'
              }`}
            >
              <span>{m}</span>
              <Play className="w-2.5 h-2.5 fill-current opacity-70" />
            </button>
          ))}
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[10px] text-zinc-500 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
          DRAG TO ORBIT 3D RIG • SCROLL TO DOLLY IN/OUT
        </div>
      </div>

      {/* Interactive Controls Deck */}
      <div className="p-4 sm:p-5 bg-[#05070D] border-t border-[#141822] space-y-4">
        {/* Row 1: Focal Length Selector & Aperture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Focal Length Prime Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#A5C4F2]" />
                LENS FOCAL LENGTH (ANAMORPHIC)
              </span>
              <span className="text-[#A5C4F2] font-semibold">{cameraRig.fov}mm</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {lensPresets.map((lens) => (
                <button
                  key={lens.label}
                  onClick={() => {
                    audioSynth.playClick(1000);
                    updateCameraRig({ fov: lens.fov });
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-mono text-center border transition-all cursor-pointer ${
                    cameraRig.fov === lens.fov
                      ? 'bg-[#A5C4F2]/20 border-[#A5C4F2] text-white font-semibold'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{lens.label}</div>
                  <div className="text-[9px] text-zinc-500 hidden sm:block">{lens.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Aperture & Depth of Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-brand-orange" />
                APERTURE / BOKEH DEPTH
              </span>
              <span className="text-brand-orange font-semibold">{cameraRig.aperture}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {['f/1.4', 'f/2.0', 'f/2.8', 'f/5.6', 'f/11'].map((ap) => (
                <button
                  key={ap}
                  onClick={() => {
                    audioSynth.playClick(1100);
                    updateCameraRig({ aperture: ap });
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-mono text-center border transition-all cursor-pointer ${
                    cameraRig.aperture === ap
                      ? 'bg-brand-orange/20 border-brand-orange text-white font-semibold'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {ap}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Lighting Compass & Temperature Presets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Lighting Azimuth Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#FFD600]" />
                KEY LIGHT AZIMUTH ROTATION
              </span>
              <span className="text-white font-semibold">{cameraRig.lightingAngle}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={cameraRig.lightingAngle}
              onChange={(e) => updateCameraRig({ lightingAngle: parseInt(e.target.value) })}
              className="w-full accent-[#FFD600] bg-white/10 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Lighting Temperature Palette */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#E5A866]" />
                COLOR TEMPERATURE PALETTE
              </span>
              <span className="text-zinc-300 text-[11px]">{cameraRig.lightingColor}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {lightColors.map((lc) => (
                <button
                  key={lc.color}
                  onClick={() => {
                    audioSynth.playClick(1200);
                    updateCameraRig({ lightingColor: lc.color });
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    cameraRig.lightingColor === lc.color
                      ? 'border-white text-white bg-white/10 font-medium'
                      : 'border-white/10 text-zinc-400 hover:text-white bg-white/5'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lc.color }} />
                  <span>{lc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
