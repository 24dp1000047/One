import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Rotate3d, 
  ArrowUpRight, 
  Brain, 
  Sparkles, 
  Cpu, 
  Zap, 
  Activity, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Sliders,
  Filter,
  Share2,
  Radio,
  Edit3,
  Camera,
  Check,
  X,
  RefreshCw,
  Plus,
  Send,
  Lock,
  Award
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';

export interface VectorNode {
  id: string;
  label: string;
  searchQueryTitle: string;
  category: 'logic' | 'code' | 'creative' | 'concept';
  prompt: string;
  x: number; // 3D coordinates
  y: number;
  z: number;
  similarity: number;
  conversationId?: string;
  subLabel?: string;
  searchTimestamp?: string;
  searchEngine?: string;
  badgeType?: 'sparrow' | 'dog' | 'wolf' | 'ai' | 'code' | 'chat';
}

export type WebStyle = 'orb' | 'vortex' | 'matrix';

export const UserVectorEmbeddingSpace: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const settings = useAppStore((state) => state.settings);
  const conversations = useAppStore((state) => state.conversations);
  const setActiveConversationId = useAppStore((state) => state.setActiveConversationId);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const addToast = useAppStore((state) => state.addToast);
  const createConversation = useAppStore((state) => state.createConversation);

  // Interactive User Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(settings.name);
  const [profileHandle, setProfileHandle] = useState(settings.handle);
  const [profileBio, setProfileBio] = useState(settings.bio || '');
  const [profileAvatar, setProfileAvatar] = useState(settings.avatar);
  const [fastPassEnabled, setFastPassEnabled] = useState(true);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [energyBonusAnimation, setEnergyBonusAnimation] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState('');

  // Persisted user-searched topics dynamically created on the Spider Web
  const [customTopics, setCustomTopics] = useState<VectorNode[]>(() => {
    try {
      const saved = localStorage.getItem('one_spiderweb_user_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=250&q=80',
  ];

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<VectorNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<VectorNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRotating, setIsRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Grand Luminescent 3D Spider Web Styles: Grand Glowing Orb | 3D Spatial Vortex | Cyber Quantum Matrix
  const [webStyle, setWebStyle] = useState<WebStyle>('orb');
  const [showWeb, setShowWeb] = useState(true);
  const [showDewdrops, setShowDewdrops] = useState(true);
  const [showSilkPulses, setShowSilkPulses] = useState(true);
  const [webVibration, setWebVibration] = useState(true);
  const [showStardust, setShowStardust] = useState(true);

  // Acoustic shockwave ripples from plucking the spider web
  const ripplesRef = useRef<Array<{ x: number; y: number; z: number; startTime: number; maxR: number; color?: string }>>([]);
  const mouseScreenRef = useRef<{ x: number; y: number } | null>(null);

  // 3D Ambient Stardust Field (75 persistent particles drifting in 3D coordinate space)
  const stardustRef = useRef<Array<{
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    size: number;
    alpha: number;
    color: string;
  }>>([]);

  useEffect(() => {
    if (stardustRef.current.length === 0) {
      const colors = ['#66C0F4', '#818CF8', '#E5A866', '#34D399', '#A5C4F2', '#38BDF8'];
      const arr = [];
      for (let i = 0; i < 75; i++) {
        arr.push({
          x: (Math.random() - 0.5) * 5.6,
          y: (Math.random() - 0.5) * 2.8,
          z: (Math.random() - 0.5) * 5.6,
          vx: (Math.random() - 0.5) * 0.0016,
          vy: (Math.random() - 0.5) * 0.0012,
          vz: (Math.random() - 0.5) * 0.0016,
          size: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.65 + 0.25,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      stardustRef.current = arr;
    }
  }, []);

  // Initial camera orientation (matching perspective of reference image)
  const rotationRef = useRef({ rotX: 0.32, rotY: -0.58 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // 1. Vector Nodes: Directly reflecting what the user has searched/asked in AI Chat
  const vectorNodes: VectorNode[] = useMemo(() => {
    const list: VectorNode[] = [
      {
        id: 'vec-sparrow',
        label: 'Sparrow Taxonomy',
        searchQueryTitle: '🔍 "Avian Sparrow Taxonomy"',
        category: 'logic',
        prompt: 'Taxonomic & biological classification of Sparrow vs other avian species.',
        x: -1.25,
        y: 0.65,
        z: -0.65,
        similarity: 0.94,
        badgeType: 'sparrow',
        subLabel: 'Avian Taxonomy (94% Match)',
        searchTimestamp: '10m ago',
        searchEngine: 'Jev System-1 (42ms)',
      },
      {
        id: 'vec-cat',
        label: 'Cat Biomechanics',
        searchQueryTitle: '🔍 "Cat Reflexes & Low-Light Vision"',
        category: 'concept',
        prompt: 'Feline sensory perception, low-light vision, and biological reflexes.',
        x: -0.85,
        y: 0.38,
        z: -0.42,
        similarity: 0.89,
        badgeType: 'wolf',
        subLabel: 'Feline Biomechanics',
        searchTimestamp: '25m ago',
        searchEngine: 'Jev System-1 (38ms)',
      },
      {
        id: 'vec-dog',
        label: 'Dog Auditory Model',
        searchQueryTitle: '🔍 "Canine Auditory Detection Frequency"',
        category: 'concept',
        prompt: 'Canine behavioral psychology and auditory frequency detection models.',
        x: -0.95,
        y: 0.12,
        z: -0.28,
        similarity: 0.92,
        badgeType: 'dog',
        subLabel: 'Canine Neural Modeling',
        searchTimestamp: '1h ago',
        searchEngine: 'Thinking Machines Inkling',
      },
      {
        id: 'vec-wolf',
        label: 'Wolf Pack Signaling',
        searchQueryTitle: '🔍 "Wolf Pack Acoustic Dynamics"',
        category: 'concept',
        prompt: 'Canis lupus pack communication dynamics and predatory acoustic signaling.',
        x: -1.15,
        y: -0.15,
        z: 0.18,
        similarity: 0.95,
        badgeType: 'wolf',
        subLabel: 'Canis Lupus Dynamics',
        searchTimestamp: '2h ago',
        searchEngine: 'Thinking Machines Inkling',
      },
      {
        id: 'vec-tomato',
        label: 'Is Tomato a Fruit?',
        searchQueryTitle: '🔍 "Is Tomato Botanically Fruit? (Noul)"',
        category: 'logic',
        prompt: 'Is a tomato considered a fruit botanically vs culinarily? (Noul Truth Score)',
        x: -0.45,
        y: 0.82,
        z: -0.32,
        similarity: 0.96,
        badgeType: 'sparrow',
        subLabel: 'TypeSafe Noul (92% True)',
        searchTimestamp: '3h ago',
        searchEngine: 'Jev Noul Truth (92%)',
      },
      {
        id: 'vec-icecream',
        label: 'Ice Cream Sandwich',
        searchQueryTitle: '🔍 "Is Ice Cream Sandwich a Sandwich?"',
        category: 'logic',
        prompt: 'Is an ice cream sandwich taxonomically a sandwich?',
        x: 0.22,
        y: 0.72,
        z: -0.58,
        similarity: 0.88,
        badgeType: 'sparrow',
        subLabel: 'Confection Wafer (33% True)',
        searchTimestamp: 'Yesterday',
        searchEngine: 'Jev Noul Truth (33%)',
      },
      {
        id: 'vec-tornado',
        label: 'Tornado Sky Color',
        searchQueryTitle: '🔍 "Sky Color During Tornado Storm"',
        category: 'concept',
        prompt: 'What color is the sky during severe tornado storm conditions? (Choice Distribution)',
        x: 0.85,
        y: 0.68,
        z: 0.42,
        similarity: 0.91,
        badgeType: 'ai',
        subLabel: 'Seafoam Green 60% Prob',
        searchTimestamp: 'Yesterday',
        searchEngine: 'Jev Choice Distribution',
      },
      {
        id: 'vec-debounce',
        label: 'Debounce Function',
        searchQueryTitle: '🔍 "TypeScript Generic Debounce Code"',
        category: 'code',
        prompt: 'Write a TypeScript debounce function with generic types and cancel() method.',
        x: 1.35,
        y: 0.38,
        z: 0.68,
        similarity: 0.98,
        badgeType: 'code',
        subLabel: 'High-Budget Code Gen',
        searchTimestamp: '2 days ago',
        searchEngine: 'Thinking Machines Inkling',
      },
      {
        id: 'vec-kahneman',
        label: 'System 1 vs System 2',
        searchQueryTitle: '🔍 "Jev System-1 Fast vs System-2 Deep"',
        category: 'logic',
        prompt: 'Explain Daniel Kahneman System-1 fast thinking vs System-2 deep reasoning architecture.',
        x: 0.48,
        y: 0.32,
        z: 0.85,
        similarity: 0.97,
        badgeType: 'ai',
        subLabel: 'Jev (<100ms) + Inkling (1M)',
        searchTimestamp: '2 days ago',
        searchEngine: 'Dual-Brain Coordinator',
      },
      {
        id: 'vec-cyberpunk',
        label: 'Shinjuku 2099',
        searchQueryTitle: '🔍 "Cyberpunk 2099 Cinematic Prompt"',
        category: 'creative',
        prompt: 'A cybernetic traveler walking through a rain-soaked neon canyon in Tokyo 2099.',
        x: -0.42,
        y: -0.38,
        z: 1.15,
        similarity: 0.91,
        badgeType: 'ai',
        subLabel: 'Cinematic Anamorphic 35mm',
        searchTimestamp: '3 days ago',
        searchEngine: 'Flux.1 Pro Precision',
      },
      {
        id: 'vec-docker',
        label: 'Container Cluster',
        searchQueryTitle: '🔍 "Container Latency Optimization"',
        category: 'code',
        prompt: 'Optimizing container memory and latency for node.js cluster workloads.',
        x: 0.95,
        y: -0.25,
        z: 0.98,
        similarity: 0.89,
        badgeType: 'code',
        subLabel: 'Latency Budgeting',
        searchTimestamp: '4 days ago',
        searchEngine: 'Thinking Machines Inkling',
      },
    ];

    // 1. Merge custom user-searched topics created on the web
    customTopics.forEach((cNode) => {
      if (!list.some((n) => n.id === cNode.id || n.label.toLowerCase() === cNode.label.toLowerCase())) {
        list.push(cNode);
      }
    });

    // 2. Dynamically project all user-searched queries from AI conversations
    conversations.forEach((conv, cIdx) => {
      // Find all user searches / questions in this conversation
      const userQueries = conv.messages.filter((m) => m.role === 'user').map((m) => m.content);
      const allQueries = userQueries.length > 0 ? userQueries : [conv.title];

      allQueries.forEach((qText, qIdx) => {
        const clean = qText.trim();
        if (
          !clean ||
          list.some(
            (n) =>
              n.label.toLowerCase() === clean.toLowerCase() ||
              n.prompt.toLowerCase() === clean.toLowerCase()
          )
        ) {
          return;
        }

        const lower = clean.toLowerCase();
        let category: VectorNode['category'] = 'concept';
        if (/code|typescript|javascript|react|css|html|function|api|algorithm|database|docker|backend|class/i.test(lower)) {
          category = 'code';
        } else if (/why|what|is|how|explain|truth|taxonomy|logic|math|vs|system|noul/i.test(lower)) {
          category = 'logic';
        } else if (/art|cinematic|render|cyberpunk|image|prompt|style|music|video|visual|photo/i.test(lower)) {
          category = 'creative';
        }

        // Deterministic radial spider web coordinate positioning
        const hash = clean.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + cIdx * 41 + qIdx * 19;
        const angle = (hash % 360) * (Math.PI / 180);
        const radius = 0.85 + ((hash % 100) / 100) * 1.6;
        const webSag = 0.18 - Math.pow(radius / 3.3, 1.6) * 0.42;

        list.push({
          id: `conv-search-${conv.id}-${qIdx}`,
          label: clean.slice(0, 24),
          searchQueryTitle: `🔍 "${clean.slice(0, 26)}${clean.length > 26 ? '...' : ''}"`,
          category,
          prompt: clean,
          x: Math.cos(angle) * radius,
          y: webSag + ((hash % 10) - 5) * 0.02,
          z: Math.sin(angle) * radius,
          similarity: 0.88 + ((hash % 12) / 100),
          conversationId: conv.id,
          badgeType: category === 'code' ? 'code' : category === 'logic' ? 'sparrow' : 'ai',
          subLabel: `${category.toUpperCase()} // Searched Topic`,
          searchTimestamp: conv.createdAt,
          searchEngine: 'Thinking Machines Inkling',
        });
      });
    });

    return list;
  }, [conversations, customTopics]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return vectorNodes.filter((node) => {
      const matchCat = activeCategory === 'all' || node.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [vectorNodes, activeCategory, searchQuery]);

  // Mouse handlers for 3D Orbit Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    setIsRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    rotationRef.current.rotY += dx * 0.006;
    rotationRef.current.rotX = Math.max(-0.9, Math.min(0.9, rotationRef.current.rotX + dy * 0.006));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Reset 3D view to exact reference image orientation
  const handleResetCamera = () => {
    rotationRef.current = { rotX: 0.32, rotY: -0.58 };
    setZoomLevel(1.0);
    audioSynth.playClick(1200);
  };

  // 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth || 900);
    let height = (canvas.height = canvas.clientHeight || 560);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Matrix Projection math helper (Expanded to full container box)
    const project3D = (x: number, y: number, z: number, rotX: number, rotY: number) => {
      // Rotate Y (yaw)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate X (pitch)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective projection centered across whole canvas box
      const cameraDist = 2.6;
      const scale = (340 / (cameraDist + z2)) * zoomLevel;
      const screenX = width / 2 + x1 * scale * 1.5;
      const screenY = height / 2 - y2 * scale * 1.3;

      return { screenX, screenY, scale, depth: z2 };
    };

    const render = () => {
      if (isRotating && !isDraggingRef.current) {
        rotationRef.current.rotY += 0.0015;
      }

      ctx.clearRect(0, 0, width, height);

      const rotX = rotationRef.current.rotX;
      const rotY = rotationRef.current.rotY;
      const time = performance.now();

      // ----------------------------------------------------
      // 0. SUBTLE ANIMATED BACKGROUND: STEAM NEBULA & 3D STARDUST FIELD
      // ----------------------------------------------------
      // A. Breathing Ambient Cosmic Nebula Bloom (Dual Tonal Steam Drift)
      const neb1X = width * 0.5 + Math.sin(time * 0.0004) * 60;
      const neb1Y = height * 0.45 + Math.cos(time * 0.0005) * 40;
      const neb1R = Math.max(width, height) * 0.65 + Math.sin(time * 0.0008) * 35;
      const neb1 = ctx.createRadialGradient(neb1X, neb1Y, 15, neb1X, neb1Y, neb1R);
      neb1.addColorStop(0, 'rgba(102, 192, 244, 0.12)'); // Electric cyan glow
      neb1.addColorStop(0.4, 'rgba(42, 71, 94, 0.07)'); // Steam steel navy
      neb1.addColorStop(0.8, 'rgba(23, 26, 33, 0.03)');
      neb1.addColorStop(1, 'rgba(16, 24, 34, 0)');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      const neb2X = width * 0.35 + Math.cos(time * 0.0005) * 55;
      const neb2Y = height * 0.65 + Math.sin(time * 0.0006) * 35;
      const neb2R = Math.max(width, height) * 0.52 + Math.cos(time * 0.0009) * 25;
      const neb2 = ctx.createRadialGradient(neb2X, neb2Y, 15, neb2X, neb2Y, neb2R);
      neb2.addColorStop(0, 'rgba(229, 168, 102, 0.055)'); // Warm amber highlight
      neb2.addColorStop(0.5, 'rgba(129, 140, 248, 0.03)'); // Soft violet
      neb2.addColorStop(1, 'rgba(16, 24, 34, 0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // B. 3D Floating Ambient Stardust Field (Drifting micro-particles in 3D coordinate space)
      if (showStardust && stardustRef.current.length > 0) {
        const pList = stardustRef.current;
        for (let i = 0; i < pList.length; i++) {
          const p = pList[i];
          // Gentle brownian velocity & atmospheric drift
          p.x += p.vx + Math.sin(time * 0.0007 + i) * 0.0005;
          p.y += p.vy + Math.cos(time * 0.0009 + i) * 0.0004;
          p.z += p.vz + Math.sin(time * 0.0006 + i * 2) * 0.0005;

          // Wrap boundaries smoothly in 3D space
          if (p.x < -3.6) p.x = 3.6;
          if (p.x > 3.6) p.x = -3.6;
          if (p.y < -1.1) p.y = 1.7;
          if (p.y > 1.7) p.y = -1.1;
          if (p.z < -3.6) p.z = 3.6;
          if (p.z > 3.6) p.z = -3.6;

          const pProj = project3D(p.x, p.y, p.z, rotX, rotY);
          if (
            pProj.screenX >= -15 &&
            pProj.screenX <= width + 15 &&
            pProj.screenY >= -15 &&
            pProj.screenY <= height + 15
          ) {
            const twinkle = 0.55 + 0.45 * Math.sin(time * 0.0022 + i * 1.7);
            const pAlpha = p.alpha * twinkle * 0.70;
            const pR = Math.max(0.65, p.size * (pProj.scale / 320));

            ctx.beginPath();
            ctx.arc(pProj.screenX, pProj.screenY, pR, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = pAlpha;
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Faint micro-constellation filaments between near stardust
            for (let j = i + 1; j < Math.min(i + 4, pList.length); j++) {
              const p2 = pList[j];
              const p2Proj = project3D(p2.x, p2.y, p2.z, rotX, rotY);
              const cdx = pProj.screenX - p2Proj.screenX;
              const cdy = pProj.screenY - p2Proj.screenY;
              const cdist = Math.hypot(cdx, cdy);
              if (cdist < 45) {
                ctx.beginPath();
                ctx.moveTo(pProj.screenX, pProj.screenY);
                ctx.lineTo(p2Proj.screenX, p2Proj.screenY);
                ctx.strokeStyle = `rgba(102, 192, 244, ${(1 - cdist / 45) * 0.07})`;
                ctx.lineWidth = 0.65;
                ctx.stroke();
              }
            }
          }
        }
      }

      // ----------------------------------------------------
      // 1. Shaded Perspective Ground Plane (Expanded to full viewport)
      // ----------------------------------------------------
      const groundY = -0.85;
      const planeW = 2.6;
      const planeD = 2.6;

      const gp1 = project3D(-planeW, groundY, -planeD, rotX, rotY);
      const gp2 = project3D(planeW, groundY, -planeD, rotX, rotY);
      const gp3 = project3D(planeW, groundY, planeD, rotX, rotY);
      const gp4 = project3D(-planeW, groundY, planeD, rotX, rotY);

      // Gradient fill matching the soft blue shaded plane in the reference image
      const groundGrad = ctx.createLinearGradient(gp1.screenX, gp1.screenY, gp3.screenX, gp3.screenY);
      groundGrad.addColorStop(0, 'rgba(102, 192, 244, 0.22)'); // Steam cyan / steel gradient
      groundGrad.addColorStop(0.5, 'rgba(42, 71, 94, 0.18)');
      groundGrad.addColorStop(1, 'rgba(16, 24, 34, 0.55)');

      ctx.beginPath();
      ctx.moveTo(gp1.screenX, gp1.screenY);
      ctx.lineTo(gp2.screenX, gp2.screenY);
      ctx.lineTo(gp3.screenX, gp3.screenY);
      ctx.lineTo(gp4.screenX, gp4.screenY);
      ctx.closePath();
      ctx.fillStyle = groundGrad;
      ctx.fill();

      // Border outline
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.40)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Internal grid lines across expanded base
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.10)';
      ctx.lineWidth = 1;
      const gridSteps = 7;
      for (let i = 1; i < gridSteps; i++) {
        const t = -planeW + (i * (2 * planeW)) / gridSteps;
        const gA = project3D(t, groundY, -planeD, rotX, rotY);
        const gB = project3D(t, groundY, planeD, rotX, rotY);
        ctx.beginPath();
        ctx.moveTo(gA.screenX, gA.screenY);
        ctx.lineTo(gB.screenX, gB.screenY);
        ctx.stroke();

        const gC = project3D(-planeW, groundY, t, rotX, rotY);
        const gD = project3D(planeW, groundY, t, rotX, rotY);
        ctx.beginPath();
        ctx.moveTo(gC.screenX, gC.screenY);
        ctx.lineTo(gD.screenX, gD.screenY);
        ctx.stroke();
      }

      // Subtle Animated Radar Scan Wavefront sweeping across ground grid
      const scanCycle = (time * 0.00030) % 1.0;
      const scanRadius = scanCycle * planeW * 1.45;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.25) {
        const rx = Math.cos(a) * scanRadius;
        const rz = Math.sin(a) * scanRadius;
        const rProj = project3D(rx, groundY, rz, rotX, rotY);
        if (a === 0) ctx.moveTo(rProj.screenX, rProj.screenY);
        else ctx.lineTo(rProj.screenX, rProj.screenY);
      }
      ctx.strokeStyle = `rgba(102, 192, 244, ${(1 - scanCycle) * 0.18})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // ----------------------------------------------------
      // 2. 3D Vector Coordinate Axes with Arrows (Expanded across full web)
      // ----------------------------------------------------
      const origin = project3D(0, groundY, 0, rotX, rotY);
      const axisY = project3D(0, 1.45, 0, rotX, rotY); // Vertical UP arrow
      const axisXLeft = project3D(-2.6, groundY, 1.4, rotX, rotY); // Ground left arrow
      const axisXRight = project3D(2.6, groundY, 0, rotX, rotY); // Ground right arrow

      const drawArrow = (from: typeof origin, to: typeof origin, color: string, label: string) => {
        ctx.beginPath();
        ctx.moveTo(from.screenX, from.screenY);
        ctx.lineTo(to.screenX, to.screenY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        const angle = Math.atan2(to.screenY - from.screenY, to.screenX - from.screenX);
        const headLen = 10;
        ctx.beginPath();
        ctx.moveTo(to.screenX, to.screenY);
        ctx.lineTo(to.screenX - headLen * Math.cos(angle - Math.PI / 6), to.screenY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(to.screenX - headLen * Math.cos(angle + Math.PI / 6), to.screenY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        ctx.fillStyle = color;
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(label, to.screenX + 8, to.screenY - 4);
      };

      drawArrow(origin, axisY, '#818CF8', 'Latent Dimension (Semantic)');
      drawArrow(origin, axisXLeft, '#6366F1', 'Feature Vector A');
      drawArrow(origin, axisXRight, '#4F46E5', 'Feature Vector B');

      // ----------------------------------------------------
      // 3. 3D GRAND LUMINESCENT SPIDER WEB ARCHITECTURE
      // ----------------------------------------------------
      if (showWeb) {
        // Clean expired pluck shockwave ripples
        ripplesRef.current = ripplesRef.current.filter((r) => time - r.startTime < 2600);

        // Ambient Ethereal Cosmic / Steam Nebula Background Glow
        const nebGrad = ctx.createRadialGradient(origin.screenX, origin.screenY - 60, 20, origin.screenX, origin.screenY - 60, 360);
        nebGrad.addColorStop(0, 'rgba(102, 192, 244, 0.16)'); // Steam electric cyan
        nebGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.07)'); // Deep indigo
        nebGrad.addColorStop(1, 'rgba(23, 26, 33, 0)');
        ctx.fillStyle = nebGrad;
        ctx.beginPath();
        ctx.arc(origin.screenX, origin.screenY - 60, 360, 0, Math.PI * 2);
        ctx.fill();

        // Helper: dynamic point displacement under web vibration and pluck shockwaves
        const applyWebPhysics = (px: number, py: number, pz: number, phase: number = 0) => {
          let yDeflect = py;
          let xDeflect = px;
          let zDeflect = pz;

          // Ambient natural silk vibration
          if (webVibration) {
            yDeflect += Math.sin(time * 0.003 + phase) * 0.02;
          }

          // Active pluck acoustic shockwaves
          ripplesRef.current.forEach((rip) => {
            const elapsed = (time - rip.startTime) / 2600;
            const ripRadius = elapsed * rip.maxR;
            const dist = Math.hypot(px - rip.x, pz - rip.z);
            if (Math.abs(dist - ripRadius) < 0.55) {
              const waveAmp = Math.cos((dist - ripRadius) * Math.PI * 3.5) * (1 - elapsed) * 0.09;
              yDeflect += waveAmp;
            }
          });

          return { x: xDeflect, y: yDeflect, z: zDeflect };
        };

        const webCenterY = 0.18;
        const R_OUTER = 3.3;

        // ========================================================
        // CENTRAL HOLOGRAPHIC SPIDER WEAVER CORE (The Masterpiece Center)
        // ========================================================
        const hubProj = project3D(0, webCenterY, 0, rotX, rotY);

        // Core 1: Rotating Geometric Weaver Ring (Clockwise)
        ctx.save();
        ctx.translate(hubProj.screenX, hubProj.screenY);
        ctx.rotate(time * 0.0016);
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 16, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(102, 192, 244, 0.75)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Orbital Weaver Satellite on outer ring
        const satAng1 = time * 0.003;
        ctx.beginPath();
        ctx.arc(Math.cos(satAng1) * 32, Math.sin(satAng1) * 16, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#66C0F4';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Core 2: Counter-Rotating Diamond Weaver Ring (Counter-Clockwise)
        ctx.save();
        ctx.translate(hubProj.screenX, hubProj.screenY);
        ctx.rotate(-time * 0.0012);
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 11, 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();

        // Core 3: Luminous Central Diamond Silk Weaver Orb
        ctx.beginPath();
        ctx.arc(hubProj.screenX, hubProj.screenY, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = '#66C0F4';
        ctx.shadowColor = '#66C0F4';
        ctx.shadowBlur = 22;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(hubProj.screenX, hubProj.screenY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // ========================================================
        // 8 STRUCTURAL MOORING ANCHOR CABLES (Anchored to Box Perimeter)
        // ========================================================
        const mooringAnchors = [
          { x: -3.8, y: 0.9, z: -3.8 },
          { x: 3.8, y: 0.9, z: -3.8 },
          { x: 3.8, y: -0.6, z: 3.8 },
          { x: -3.8, y: -0.6, z: 3.8 },
          { x: 0, y: 1.5, z: -3.7 },
          { x: 0, y: -0.85, z: 3.7 },
          { x: -3.8, y: 0.3, z: 0 },
          { x: 3.8, y: 0.3, z: 0 },
        ];

        mooringAnchors.forEach((mPt, mIdx) => {
          const pM = project3D(mPt.x, mPt.y, mPt.z, rotX, rotY);
          ctx.beginPath();
          ctx.moveTo(hubProj.screenX, hubProj.screenY);
          ctx.lineTo(pM.screenX, pM.screenY);
          ctx.strokeStyle = 'rgba(102, 192, 244, 0.28)';
          ctx.lineWidth = 1.3;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Mooring Cable Tension Joint Knot
          ctx.beginPath();
          ctx.arc(pM.screenX, pM.screenY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#66C0F4';
          ctx.fill();
        });

        // ========================================================
        // ARCHITECTURE 1: 🕸️ GRAND LUMINESCENT ORB WEB (Default - Masterwork)
        // 24 Curved Luminescent Radial Spokes & 14 Catenary Parabolic Sag Silk Tiers
        // ========================================================
        if (webStyle === 'orb') {
          const SPOKES = 24;
          const rings = [0.20, 0.36, 0.55, 0.76, 1.00, 1.26, 1.55, 1.86, 2.18, 2.52, 2.86, 3.20];

          const getOrbSpokePoint = (k: number, r: number) => {
            const baseAngle = (k / SPOKES) * Math.PI * 2;
            const px = Math.cos(baseAngle) * r;
            // 3D Hyperbolic Parabolic Sag
            const py = webCenterY - Math.pow(r / R_OUTER, 1.25) * 0.34;
            const pz = Math.sin(baseAngle) * r;
            return applyWebPhysics(px, py, pz, k * 0.3 + r * 4);
          };

          // A. Draw 24 Curved Luminescent Radial Spokes
          for (let k = 0; k < SPOKES; k++) {
            const outerPt = getOrbSpokePoint(k, R_OUTER);
            const pOuter = project3D(outerPt.x, outerPt.y, outerPt.z, rotX, rotY);

            // Spoke Dual-Pass (Pass 1: Cyan Glow Aura)
            ctx.beginPath();
            ctx.moveTo(hubProj.screenX, hubProj.screenY);
            ctx.lineTo(pOuter.screenX, pOuter.screenY);
            ctx.strokeStyle = 'rgba(102, 192, 244, 0.36)';
            ctx.lineWidth = 2.0;
            ctx.stroke();

            // Spoke Dual-Pass (Pass 2: Sharp Diamond Silk Core)
            ctx.beginPath();
            ctx.moveTo(hubProj.screenX, hubProj.screenY);
            ctx.lineTo(pOuter.screenX, pOuter.screenY);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 0.9;
            ctx.stroke();

            // Traveling Silk Photons (Energy streams flowing outward along spokes)
            if (showSilkPulses) {
              const pOffset = (time * 0.0007 + k * (1 / SPOKES)) % 1;
              const pPt = getOrbSpokePoint(k, pOffset * R_OUTER);
              const pProj = project3D(pPt.x, pPt.y, pPt.z, rotX, rotY);

              ctx.beginPath();
              ctx.arc(pProj.screenX, pProj.screenY, 2.6, 0, Math.PI * 2);
              ctx.fillStyle = '#FFFFFF';
              ctx.shadowColor = '#66C0F4';
              ctx.shadowBlur = 10;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }

          // B. Draw 12 Tiers of Organic Catenary Droop Silk Threads (Between Spokes)
          rings.forEach((r, rIdx) => {
            const ringAlpha = 0.20 + (rIdx / rings.length) * 0.35;

            for (let k = 0; k < SPOKES; k++) {
              const nextK = (k + 1) % SPOKES;
              const p1 = getOrbSpokePoint(k, r);
              const p2 = getOrbSpokePoint(nextK, r);

              // Catenary Inward & Downward Sag
              const midX = (p1.x + p2.x) * 0.5 * 0.89;
              const midY = (p1.y + p2.y) * 0.5 - 0.028;
              const midZ = (p1.z + p2.z) * 0.5 * 0.89;

              const pr1 = project3D(p1.x, p1.y, p1.z, rotX, rotY);
              const prMid = project3D(midX, midY, midZ, rotX, rotY);
              const pr2 = project3D(p2.x, p2.y, p2.z, rotX, rotY);

              // Pass 1: Glowing Cyan Silk Arc
              ctx.beginPath();
              ctx.moveTo(pr1.screenX, pr1.screenY);
              ctx.quadraticCurveTo(prMid.screenX, prMid.screenY, pr2.screenX, pr2.screenY);
              ctx.strokeStyle = `rgba(102, 192, 244, ${ringAlpha * 0.7})`;
              ctx.lineWidth = 1.8;
              ctx.stroke();

              // Pass 2: Sharp Silk Core
              ctx.beginPath();
              ctx.moveTo(pr1.screenX, pr1.screenY);
              ctx.quadraticCurveTo(prMid.screenX, prMid.screenY, pr2.screenX, pr2.screenY);
              ctx.strokeStyle = `rgba(240, 248, 255, ${ringAlpha})`;
              ctx.lineWidth = 0.95;
              ctx.stroke();

              // Glistening Dewdrop Pearls at Spoke Intersections
              if (showDewdrops && (rIdx % 2 === 0 || k % 2 === 0)) {
                ctx.beginPath();
                ctx.arc(pr1.screenX, pr1.screenY, 1.6, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                ctx.shadowColor = '#66C0F4';
                ctx.shadowBlur = 4;
                ctx.fill();
                ctx.shadowBlur = 0;
              }
            }
          });
        }

        // ========================================================
        // ARCHITECTURE 2: 🕸️ 3D HYPERBOLIC VORTEX FUNNEL SPIDER WEB
        // Sinking deep into 3D vector space like a cosmic wormhole
        // ========================================================
        else if (webStyle === 'vortex') {
          const SPOKES = 24;
          const rings = [0.20, 0.40, 0.65, 0.95, 1.28, 1.65, 2.05, 2.45, 2.85, 3.25];

          const getVortexSpokePoint = (k: number, r: number) => {
            const angle = (k / SPOKES) * Math.PI * 2 + (r / R_OUTER) * 0.55;
            const px = Math.cos(angle) * r;
            const py = webCenterY - Math.pow(r / R_OUTER, 1.5) * 0.48;
            const pz = Math.sin(angle) * r;
            return applyWebPhysics(px, py, pz, k * 0.4 + r * 3);
          };

          for (let k = 0; k < SPOKES; k++) {
            const outerPt = getVortexSpokePoint(k, R_OUTER);
            const outerProj = project3D(outerPt.x, outerPt.y, outerPt.z, rotX, rotY);

            ctx.beginPath();
            ctx.moveTo(hubProj.screenX, hubProj.screenY);
            ctx.lineTo(outerProj.screenX, outerProj.screenY);
            ctx.strokeStyle = 'rgba(102, 192, 244, 0.40)';
            ctx.lineWidth = 1.4;
            ctx.stroke();
          }

          rings.forEach((r, rIdx) => {
            for (let k = 0; k < SPOKES; k++) {
              const nextK = (k + 1) % SPOKES;
              const p1 = getVortexSpokePoint(k, r);
              const p2 = getVortexSpokePoint(nextK, r);

              const midX = (p1.x + p2.x) * 0.5 * 0.88;
              const midY = (p1.y + p2.y) * 0.5 - 0.035;
              const midZ = (p1.z + p2.z) * 0.5 * 0.88;

              const pr1 = project3D(p1.x, p1.y, p1.z, rotX, rotY);
              const prMid = project3D(midX, midY, midZ, rotX, rotY);
              const pr2 = project3D(p2.x, p2.y, p2.z, rotX, rotY);

              ctx.beginPath();
              ctx.moveTo(pr1.screenX, pr1.screenY);
              ctx.quadraticCurveTo(prMid.screenX, prMid.screenY, pr2.screenX, pr2.screenY);
              ctx.strokeStyle = `rgba(129, 140, 248, ${0.20 + (rIdx / rings.length) * 0.30})`;
              ctx.lineWidth = 1.1;
              ctx.stroke();

              if (showDewdrops && (rIdx % 2 === 0 || k % 2 === 0)) {
                ctx.beginPath();
                ctx.arc(pr1.screenX, pr1.screenY, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                ctx.fill();
              }
            }
          });
        }

        // ========================================================
        // ARCHITECTURE 3: 🕸️ CYBER QUANTUM MATRIX WEB
        // Futuristic Holographic Laser Lattice with continuous logarithmic spiral & coordinate radar rings
        // ========================================================
        else if (webStyle === 'matrix') {
          const SPOKES = 20;
          const TOTAL_TURNS = 14;

          for (let k = 0; k < SPOKES; k++) {
            const angle = (k / SPOKES) * Math.PI * 2;
            const px = Math.cos(angle) * R_OUTER;
            const py = webCenterY - (R_OUTER * 0.10);
            const pz = Math.sin(angle) * R_OUTER;
            const pt = applyWebPhysics(px, py, pz, k * 0.5);
            const pProj = project3D(pt.x, pt.y, pt.z, rotX, rotY);

            ctx.beginPath();
            ctx.moveTo(hubProj.screenX, hubProj.screenY);
            ctx.lineTo(pProj.screenX, pProj.screenY);
            ctx.strokeStyle = 'rgba(102, 192, 244, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          const steps = TOTAL_TURNS * SPOKES;
          for (let s = 0; s < steps; s++) {
            const r1 = 0.15 + (s / steps) * (R_OUTER - 0.15);
            const r2 = 0.15 + ((s + 1) / steps) * (R_OUTER - 0.15);
            const th1 = (s / SPOKES) * Math.PI * 2;
            const th2 = ((s + 1) / SPOKES) * Math.PI * 2;

            const p1 = applyWebPhysics(Math.cos(th1) * r1, webCenterY - r1 * 0.10, Math.sin(th1) * r1, s * 0.1);
            const p2 = applyWebPhysics(Math.cos(th2) * r2, webCenterY - r2 * 0.10, Math.sin(th2) * r2, (s + 1) * 0.1);

            const midX = (p1.x + p2.x) * 0.5 * 0.91;
            const midY = (p1.y + p2.y) * 0.5 - 0.025;
            const midZ = (p1.z + p2.z) * 0.5 * 0.91;

            const pr1 = project3D(p1.x, p1.y, p1.z, rotX, rotY);
            const prMid = project3D(midX, midY, midZ, rotX, rotY);
            const pr2 = project3D(p2.x, p2.y, p2.z, rotX, rotY);

            ctx.beginPath();
            ctx.moveTo(pr1.screenX, pr1.screenY);
            ctx.quadraticCurveTo(prMid.screenX, prMid.screenY, pr2.screenX, pr2.screenY);
            ctx.strokeStyle = `rgba(102, 192, 244, ${0.22 + (s / steps) * 0.28})`;
            ctx.lineWidth = 1.15;
            ctx.stroke();
          }
        }

        // ========================================================
        // STRUCTURAL TENSILE MOORING LINES DIRECTLY ANCHORING SEARCH NODES
        // The search queries act as physical tension anchor pins holding the spider web!
        // ========================================================
        filteredNodes.forEach((node, i) => {
          const isNodeActive = (hoveredNode && hoveredNode.id === node.id) || (selectedNode && selectedNode.id === node.id);
          const pNode = project3D(node.x, node.y, node.z, rotX, rotY);

          // Direct guy-line to central spider core
          ctx.beginPath();
          ctx.moveTo(hubProj.screenX, hubProj.screenY);
          ctx.lineTo(pNode.screenX, pNode.screenY);
          ctx.strokeStyle = isNodeActive ? 'rgba(229, 168, 102, 0.95)' : 'rgba(102, 192, 244, 0.30)';
          ctx.lineWidth = isNodeActive ? 2.2 : 1.1;
          if (isNodeActive) {
            ctx.shadowColor = '#E5A866';
            ctx.shadowBlur = 12;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Catenary sagging silk thread between nearest neighbor search queries
          const neighbors = filteredNodes
            .filter((_, j) => j !== i)
            .map((other) => ({
              other,
              dist: Math.hypot(node.x - other.x, node.y - other.y, node.z - other.z),
            }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 2);

          neighbors.forEach(({ other }) => {
            const isLit = isNodeActive || (hoveredNode && hoveredNode.id === other.id) || (selectedNode && selectedNode.id === other.id);
            const pOther = project3D(other.x, other.y, other.z, rotX, rotY);

            const midSX = (pNode.screenX + pOther.screenX) / 2;
            const midSY = (pNode.screenY + pOther.screenY) / 2 + (webVibration ? Math.sin(time * 0.0035 + i) * 3 : 2) + 5;

            ctx.beginPath();
            ctx.moveTo(pNode.screenX, pNode.screenY);
            ctx.quadraticCurveTo(midSX, midSY, pOther.screenX, pOther.screenY);
            ctx.strokeStyle = isLit ? 'rgba(229, 168, 102, 0.95)' : 'rgba(102, 192, 244, 0.32)';
            ctx.lineWidth = isLit ? 2.2 : 1.1;
            if (isLit) {
              ctx.shadowColor = '#E5A866';
              ctx.shadowBlur = 10;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Dewdrop pulse traveling along inter-node silk strand
            if (showSilkPulses && (isLit || i % 2 === 0)) {
              const tProg = (time * 0.0007 + i * 0.25) % 1;
              const dewX =
                (1 - tProg) * (1 - tProg) * pNode.screenX +
                2 * (1 - tProg) * tProg * midSX +
                tProg * tProg * pOther.screenX;
              const dewY =
                (1 - tProg) * (1 - tProg) * pNode.screenY +
                2 * (1 - tProg) * tProg * midSY +
                tProg * tProg * pOther.screenY;

              ctx.beginPath();
              ctx.arc(dewX, dewY, isLit ? 3.2 : 2.2, 0, Math.PI * 2);
              ctx.fillStyle = isLit ? '#FFFFFF' : '#66C0F4';
              ctx.shadowColor = isLit ? '#E5A866' : '#66C0F4';
              ctx.shadowBlur = isLit ? 10 : 5;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          });
        });

        // ========================================================
        // ACTIVE ACOUSTIC PLUCK SHOCKWAVES RIPPLING ACROSS THE SPIDER WEB
        // ========================================================
        ripplesRef.current.forEach((rip) => {
          const elapsed = (time - rip.startTime) / 2600;
          const ripRadius = elapsed * rip.maxR;
          const alpha = (1 - elapsed) * 0.75;
          const ringSegments = 36;

          ctx.beginPath();
          for (let s = 0; s <= ringSegments; s++) {
            const th = (s / ringSegments) * Math.PI * 2;
            const rx = rip.x + Math.cos(th) * ripRadius;
            const rz = rip.z + Math.sin(th) * ripRadius;
            const ry = rip.y - (Math.hypot(rx, rz) * 0.10) + Math.sin(elapsed * 8) * 0.02;
            const p = project3D(rx, ry, rz, rotX, rotY);
            if (s === 0) ctx.moveTo(p.screenX, p.screenY);
            else ctx.lineTo(p.screenX, p.screenY);
          }
          ctx.closePath();
          ctx.strokeStyle = rip.color ? rip.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba') : `rgba(102, 192, 244, ${alpha})`;
          ctx.lineWidth = 2.2 * (1 - elapsed) + 0.5;
          ctx.shadowColor = rip.color || '#66C0F4';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        });
      }

      // ----------------------------------------------------
      // 4. Ground Projections & Shadow Dots (Cast down to ground plane)
      // ----------------------------------------------------
      filteredNodes.forEach((node) => {
        const groundDrop = project3D(node.x, groundY, node.z, rotX, rotY);
        const proj = project3D(node.x, node.y, node.z, rotX, rotY);

        // Vertical dotted drop-line from 3D dot to ground
        ctx.beginPath();
        ctx.moveTo(proj.screenX, proj.screenY);
        ctx.lineTo(groundDrop.screenX, groundDrop.screenY);
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.20)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ground shadow dot matching reference image
        ctx.beginPath();
        ctx.arc(groundDrop.screenX, groundDrop.screenY, 4 * (proj.scale / 120), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 70, 229, 0.40)';
        ctx.fill();

        // Sub-dots on the ground
        ctx.beginPath();
        ctx.arc(groundDrop.screenX - 4, groundDrop.screenY - 4, 2 * (proj.scale / 120), 0, Math.PI * 2);
        ctx.arc(groundDrop.screenX + 4, groundDrop.screenY - 4, 2 * (proj.scale / 120), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.30)';
        ctx.fill();
      });

      // ----------------------------------------------------
      // 6. Projected 3D Vector Nodes (Dewdrop Paw Clusters - Matching Reference Image!)
      // ----------------------------------------------------
      const projectedNodes = filteredNodes.map((node) => {
        const proj = project3D(node.x, node.y, node.z, rotX, rotY);
        return {
          node,
          proj,
          depth: proj.depth,
        };
      });

      // Sort back-to-front
      projectedNodes.sort((a, b) => b.depth - a.depth);

      // Render the 3D Vector Dots with satellite dewdrop beads
      projectedNodes.forEach(({ node, proj }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        // Radius for the main central dot
        const baseR = (isHovered || isSelected ? 8.5 : 6) * (proj.scale / 120);

        // Satellite dewdrop beads on top
        const satR = baseR * 0.48;
        const satOffset = baseR * 1.35;

        // Left satellite dot
        ctx.beginPath();
        ctx.arc(proj.screenX - satOffset * 0.75, proj.screenY - satOffset, satR, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#FFFFFF' : '#818CF8';
        ctx.fill();

        // Right satellite dot
        ctx.beginPath();
        ctx.arc(proj.screenX + satOffset * 0.75, proj.screenY - satOffset, satR, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#FFFFFF' : '#818CF8';
        ctx.fill();

        // Primary Vector Dot Glow
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(proj.screenX, proj.screenY, baseR * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(102, 192, 244, 0.25)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, baseR, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#FFFFFF' : '#536DFE'; // Electric periwinkle/blue matching image
        ctx.shadowColor = '#66C0F4';
        ctx.shadowBlur = isHovered ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#101822';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Specular dewdrop highlight
        ctx.beginPath();
        ctx.arc(proj.screenX - baseR * 0.35, proj.screenY - baseR * 0.35, baseR * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
      });

      // ----------------------------------------------------
      // 7. SMART COLLISION-FREE SPIDER WEB LABELS (No Overlapping!)
      // ----------------------------------------------------
      const labelItems = projectedNodes.map(({ node, proj }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;
        const baseR = (isHovered || isSelected ? 8.5 : 6) * (proj.scale / 120);

        const isLeft = proj.screenX < width / 2;
        const defaultTargetX = isLeft
          ? Math.max(25, proj.screenX - 110)
          : Math.min(width - 25, proj.screenX + 85);

        return {
          node,
          proj,
          baseR,
          isLeft,
          targetX: defaultTargetX,
          targetY: proj.screenY,
          isHovered,
          isSelected,
        };
      });

      // Split into Left and Right lists for independent 1D vertical relaxation
      const leftLabels = labelItems.filter((item) => item.isLeft);
      const rightLabels = labelItems.filter((item) => !item.isLeft);

      // Relax left labels so minimum vertical separation is 26px
      leftLabels.sort((a, b) => a.targetY - b.targetY);
      for (let i = 1; i < leftLabels.length; i++) {
        const prev = leftLabels[i - 1];
        const curr = leftLabels[i];
        if (curr.targetY - prev.targetY < 26) {
          curr.targetY = prev.targetY + 26;
        }
      }

      // Relax right labels so minimum vertical separation is 26px
      rightLabels.sort((a, b) => a.targetY - b.targetY);
      for (let i = 1; i < rightLabels.length; i++) {
        const prev = rightLabels[i - 1];
        const curr = rightLabels[i];
        if (curr.targetY - prev.targetY < 26) {
          curr.targetY = prev.targetY + 26;
        }
      }

      // Render relaxed labels showing the exact items searched
      [...leftLabels, ...rightLabels].forEach((item) => {
        const { node, proj, baseR, isLeft, targetX, targetY, isHovered, isSelected } = item;

        const labelText = node.searchQueryTitle;
        ctx.font = `${isHovered || isSelected ? 'bold 11px' : '10px'} JetBrains Mono, monospace`;
        const textW = ctx.measureText(labelText).width;
        const pillW = textW + 18;
        const pillH = 20;

        const pillX = isLeft ? targetX - pillW : targetX;
        const pillY = targetY - pillH / 2;

        const leaderPinX = isLeft ? targetX : targetX;
        const nodePinX = isLeft ? proj.screenX - baseR - 4 : proj.screenX + baseR + 4;

        // Silk Leader Line connecting label pin to node
        ctx.beginPath();
        ctx.moveTo(leaderPinX, targetY);
        ctx.lineTo(nodePinX, proj.screenY);
        ctx.strokeStyle = isHovered || isSelected ? '#FFFFFF' : 'rgba(165, 196, 242, 0.45)';
        ctx.lineWidth = isHovered || isSelected ? 1.8 : 1;
        ctx.stroke();

        // Arrow head at node pin
        const angle = Math.atan2(proj.screenY - targetY, nodePinX - leaderPinX);
        const headLen = 6;
        ctx.beginPath();
        ctx.moveTo(nodePinX, proj.screenY);
        ctx.lineTo(nodePinX - headLen * Math.cos(angle - Math.PI / 6), proj.screenY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(nodePinX - headLen * Math.cos(angle + Math.PI / 6), proj.screenY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = isHovered || isSelected ? '#FFFFFF' : '#A5C4F2';
        ctx.fill();

        // Small origin dot on the label side
        ctx.beginPath();
        ctx.arc(leaderPinX, targetY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#FFFFFF' : '#818CF8';
        ctx.fill();

        // Category accent color
        const categoryColor =
          node.category === 'logic'
            ? '#E5A866'
            : node.category === 'code'
            ? '#6366F1'
            : node.category === 'creative'
            ? '#38BDF8'
            : '#34D399';

        // Frosted Dark Capsule Pill for label
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 6);
        ctx.fillStyle = isHovered || isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(8, 12, 22, 0.90)';
        ctx.fill();
        ctx.strokeStyle = isHovered || isSelected ? '#FFFFFF' : categoryColor;
        ctx.lineWidth = isHovered || isSelected ? 1.5 : 1;
        if (isHovered || isSelected) {
          ctx.shadowColor = categoryColor;
          ctx.shadowBlur = 10;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Category accent dot on pill edge
        ctx.beginPath();
        if (isLeft) {
          ctx.arc(pillX + 6, targetY, 2.5, 0, Math.PI * 2);
        } else {
          ctx.arc(pillX + pillW - 6, targetY, 2.5, 0, Math.PI * 2);
        }
        ctx.fillStyle = categoryColor;
        ctx.fill();

        // Label text inside pill
        ctx.fillStyle = isHovered || isSelected ? '#FFFFFF' : 'rgba(240, 244, 255, 0.95)';
        ctx.textAlign = 'center';
        ctx.fillText(labelText, pillX + pillW / 2, targetY + 3.5);
        ctx.textAlign = 'left';
      });

      // ----------------------------------------------------
      // 8. FLOATING HOLOGRAPHIC SEARCH QUERY CARD (On Hover / Select)
      // ----------------------------------------------------
      if (hoveredNode || selectedNode) {
        const activeNode = (hoveredNode || selectedNode)!;
        const proj = project3D(activeNode.x, activeNode.y, activeNode.z, rotX, rotY);

        // Rotating Target Reticle around the dot
        const targetR = 14 * (proj.scale / 120);
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, targetR, 0, Math.PI * 2);
        ctx.strokeStyle = '#E5A866';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Interactive Tooltip Card Dimensions
        const cardW = Math.min(330, width - 30);
        const cardH = 88;
        let cardX = proj.screenX - cardW / 2;
        let cardY = proj.screenY - targetR - cardH - 12;

        // Keep inside canvas bounds
        if (cardX < 15) cardX = 15;
        if (cardX + cardW > width - 15) cardX = width - cardW - 15;
        if (cardY < 15) cardY = proj.screenY + targetR + 15;

        // Stem connecting dot to card
        ctx.beginPath();
        ctx.moveTo(proj.screenX, proj.screenY - targetR);
        ctx.lineTo(cardX + cardW / 2, cardY + cardH);
        ctx.strokeStyle = 'rgba(229, 168, 102, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Card Background (Frosted obsidian glass)
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 8);
        const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
        cardGrad.addColorStop(0, 'rgba(12, 17, 29, 0.96)');
        cardGrad.addColorStop(1, 'rgba(6, 9, 16, 0.94)');
        ctx.fillStyle = cardGrad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(229, 168, 102, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#E5A866';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Card Content:
        // Line 1: Header Category + Match %
        ctx.fillStyle = '#E5A866';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillText(`🔍 SEARCHED ITEM // ${activeNode.category.toUpperCase()}`, cardX + 12, cardY + 18);
        ctx.fillStyle = '#34D399';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(activeNode.similarity * 100)}% Match`, cardX + cardW - 12, cardY + 18);
        ctx.textAlign = 'left';

        // Line 2: The Searched Prompt Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        const displayPrompt = activeNode.prompt.length > 44 ? activeNode.prompt.slice(0, 44) + '...' : activeNode.prompt;
        ctx.fillText(`"${displayPrompt}"`, cardX + 12, cardY + 38);

        // Line 3: Cognitive Engine / Insights
        ctx.fillStyle = 'rgba(165, 196, 242, 0.85)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`⚡ ${activeNode.searchEngine || 'Dual-Brain Pipeline'}`, cardX + 12, cardY + 56);

        // Line 4: Action prompt
        ctx.fillStyle = '#66C0F4';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText(`💡 Click dot to pluck web & open in AI Chat ↗`, cardX + 12, cardY + 74);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [filteredNodes, hoveredNode, selectedNode, isRotating, zoomLevel, showWeb, webStyle, showDewdrops, showSilkPulses, webVibration]);

  // Click handler on 3D Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotX = rotationRef.current.rotX;
    const rotY = rotationRef.current.rotY;
    const width = canvas.width;
    const height = canvas.height;

    for (const node of filteredNodes) {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = node.x * cosY - node.z * sinY;
      const z1 = node.x * sinY + node.z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = node.y * cosX - z1 * sinX;
      const z2 = node.y * sinX + z1 * cosX;

      const cameraDist = 2.6;
      const scale = (340 / (cameraDist + z2)) * zoomLevel;
      const screenX = width / 2 + x1 * scale * 1.5;
      const screenY = height / 2 - y2 * scale * 1.3;

      const dist = Math.hypot(mouseX - screenX, mouseY - screenY);
      if (dist < 28) {
        audioSynth.playClick(1400);
        setSelectedNode(node);

        // Pluck acoustic shockwave wave across the spider web!
        ripplesRef.current.push({
          x: node.x,
          y: node.y,
          z: node.z,
          startTime: performance.now(),
          maxR: 3.5,
          color: node.category === 'logic' ? 'rgba(229, 168, 102, 1)' : node.category === 'code' ? 'rgba(102, 192, 244, 1)' : 'rgba(129, 140, 248, 1)',
        });
        return;
      }
    }

    // Clicking empty space plucks the spider web from the center
    ripplesRef.current.push({
      x: 0,
      y: 0.15,
      z: 0,
      startTime: performance.now(),
      maxR: 3.0,
      color: 'rgba(102, 192, 244, 1)',
    });
    audioSynth.playClick(900);
    setSelectedNode(null);
  };

  // Hover detection
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMouseMove(e);

    const canvas = canvasRef.current;
    if (!canvas || isDraggingRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    mouseScreenRef.current = { x: mouseX, y: mouseY };

    const rotX = rotationRef.current.rotX;
    const rotY = rotationRef.current.rotY;
    const width = canvas.width;
    const height = canvas.height;

    let found: VectorNode | null = null;
    for (const node of filteredNodes) {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = node.x * cosY - node.z * sinY;
      const z1 = node.x * sinY + node.z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = node.y * cosX - z1 * sinX;
      const z2 = node.y * sinX + z1 * cosX;

      const cameraDist = 2.6;
      const scale = (340 / (cameraDist + z2)) * zoomLevel;
      const screenX = width / 2 + x1 * scale * 1.5;
      const screenY = height / 2 - y2 * scale * 1.3;

      const dist = Math.hypot(mouseX - screenX, mouseY - screenY);
      if (dist < 24) {
        found = node;
        break;
      }
    }

    if (found) {
      canvas.style.cursor = 'pointer';
      if (hoveredNode?.id !== found.id) {
        audioSynth.playClick(1150);
      }
    } else {
      canvas.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
    }

    setHoveredNode(found);
  };

  const handleOpenConversation = (node: VectorNode) => {
    if (node.conversationId) {
      setActiveConversationId(node.conversationId);
      navigate('/chat');
    } else {
      navigate('/chat');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name: profileName.trim() || 'Alex Vance',
      handle: profileHandle.trim() || '@alex_creator',
      bio: profileBio.trim(),
      avatar: profileAvatar,
    });
    audioSynth.playClick(1200);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile settings have been saved.',
    });
    setIsEditingProfile(false);
  };

  const handleRechargeEnergy = () => {
    audioSynth.playWhoosh();
    setEnergyBonusAnimation(true);
    updateSettings({ energyCredits: settings.energyCredits + 500 });
    addToast({
      type: 'success',
      title: '⚡ +500 Energy Recharged',
      message: 'Cognitive compute quota replenished.',
    });
    setTimeout(() => setEnergyBonusAnimation(false), 1200);
  };

  const handleCosineSimClick = () => {
    audioSynth.playClick(1400);
    addToast({
      type: 'info',
      title: 'Semantic Scan Active',
      message: 'Recalculating cosine distances across all indexed topics.',
    });
    ripplesRef.current.push({
      x: 0,
      y: 0,
      z: 0,
      startTime: Date.now(),
      maxR: 3.8,
    });
  };

  const handleLatentSpaceClick = () => {
    audioSynth.playClick(900);
    setIsRotating((prev) => !prev);
    addToast({
      type: 'info',
      title: isRotating ? 'Orbit Paused' : '3D Orbit Active',
      message: 'Rotating latent search space around origin.',
    });
  };

  const handleCategoryChipClick = (catId: string) => {
    audioSynth.playClick(1100);
    setActiveCategory(catId);
    const node = vectorNodes.find((n) => catId === 'all' || n.category === catId);
    if (node) {
      setSelectedNode(node);
      ripplesRef.current.push({
        x: node.x,
        y: node.y,
        z: node.z,
        startTime: Date.now(),
        maxR: 2.8,
      });
    }
  };

  // Dynamically create a user-searched topic and attach it to the 3D Spider Web
  const handleCreateSearchTopic = (query: string, navigateToChat = false) => {
    const clean = query.trim();
    if (!clean) return;

    audioSynth.playWhoosh();

    const lower = clean.toLowerCase();
    let category: VectorNode['category'] = 'concept';
    if (/code|typescript|javascript|react|css|html|function|api|algorithm|database|docker|backend|class|bug/i.test(lower)) {
      category = 'code';
    } else if (/why|what|is|how|explain|truth|taxonomy|logic|math|vs|system|noul|proof/i.test(lower)) {
      category = 'logic';
    } else if (/art|cinematic|render|cyberpunk|image|prompt|style|music|video|visual|photo|anime/i.test(lower)) {
      category = 'creative';
    }

    const hash = clean.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const angle = (hash % 360) * (Math.PI / 180);
    const radius = 0.95 + ((hash % 100) / 100) * 1.5;
    const webSag = 0.18 - Math.pow(radius / 3.3, 1.6) * 0.42;

    // Create the conversation in store so it links to AI chat
    const convId = createConversation(clean);

    const newNode: VectorNode = {
      id: `user-topic-${Date.now()}`,
      label: clean.slice(0, 24),
      searchQueryTitle: `🔍 "${clean.slice(0, 26)}${clean.length > 26 ? '...' : ''}"`,
      category,
      prompt: clean,
      x: Math.cos(angle) * radius,
      y: webSag,
      z: Math.sin(angle) * radius,
      similarity: 0.94 + ((hash % 6) / 100),
      conversationId: convId,
      badgeType: category === 'code' ? 'code' : category === 'logic' ? 'sparrow' : 'ai',
      subLabel: `${category.toUpperCase()} // Searched Topic`,
      searchTimestamp: 'Just now',
      searchEngine: 'Thinking Machines Inkling',
    };

    const updated = [newNode, ...customTopics];
    setCustomTopics(updated);
    try {
      localStorage.setItem('one_spiderweb_user_topics', JSON.stringify(updated));
    } catch (e) {}

    // Pluck acoustic shockwave wave from the new node!
    ripplesRef.current.push({
      x: newNode.x,
      y: newNode.y,
      z: newNode.z,
      startTime: performance.now(),
      maxR: 3.8,
      color: category === 'code' ? 'rgba(102, 192, 244, 1)' : category === 'logic' ? 'rgba(229, 168, 102, 1)' : 'rgba(165, 196, 242, 1)',
    });
    audioSynth.playClick(1450);

    // Automatically focus & select the new topic node on the Spider Web
    setSelectedNode(newNode);

    addToast({
      type: 'success',
      title: 'Topic Created on Spider Web',
      message: `"${clean}" indexed into 3D Semantic Lattice.`,
    });

    setQuickPrompt('');

    if (navigateToChat) {
      setActiveConversationId(convId);
      navigate('/chat');
    }
  };

  const handleQuickPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateSearchTopic(quickPrompt, true);
  };

  return (
    <div
      ref={containerRef}
      className="rounded-3xl bg-gradient-to-b from-[#1B2838]/85 to-[#171A21]/90 backdrop-blur-md border border-[#2A475E] p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Subtle Animated Background Ambient Lights (Breathing Steam Auras) */}
      <div className="absolute -top-24 right-1/4 w-[550px] h-[550px] bg-[#66C0F4]/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-1/2 -left-20 w-[500px] h-[500px] bg-[#2A475E]/30 rounded-full blur-3xl pointer-events-none animate-pulse-subtle [animation-delay:3s]" />
      <div className="absolute -bottom-24 right-10 w-[450px] h-[450px] bg-[#E5A866]/08 rounded-full blur-3xl pointer-events-none animate-pulse-subtle [animation-delay:5s]" />

      {/* ======================================================== */}
      {/* 1. INTERACTIVE USER PROFILE & COGNITIVE IDENTITY CARD    */}
      {/* ======================================================== */}
      <div className="relative rounded-2xl bg-[#171D25]/90 border border-[#2A475E] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Avatar, Name, Handle, Badges */}
          <div className="flex items-start sm:items-center gap-4">
            {/* Interactive Avatar with Hover Camera Overlay */}
            <div
              onClick={() => {
                audioSynth.playClick(1000);
                setProfileName(settings.name);
                setProfileHandle(settings.handle);
                setProfileBio(settings.bio || '');
                setProfileAvatar(settings.avatar);
                setIsEditingProfile(true);
              }}
              className="relative shrink-0 group cursor-pointer"
              title="Click to edit profile & avatar"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-[#6366F1] via-[#A5C4F2] to-[#E5A866] shadow-xl transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                <img
                  src={settings.avatar}
                  alt={settings.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px] font-mono text-white rounded-2xl">
                  <Camera className="w-4 h-4 text-[#A5C4F2]" />
                  <span>Change</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#090C14] shadow-[0_0_10px_#34D399] animate-pulse" />
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white font-sans tracking-wide">
                  {settings.name}
                </h1>

                {/* Clickable Verified Identity Badge */}
                <button
                  onClick={() => {
                    audioSynth.playClick(1100);
                    setShowVerifiedModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6366F1]/15 hover:bg-[#6366F1]/25 border border-[#6366F1]/30 text-xs font-mono text-[#A5C4F2] transition-colors cursor-pointer"
                  title="View cryptographic verification details"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span>Verified Identity</span>
                </button>

                {/* Edit Profile Button */}
                <button
                  onClick={() => {
                    audioSynth.playClick(1000);
                    setProfileName(settings.name);
                    setProfileHandle(settings.handle);
                    setProfileBio(settings.bio || '');
                    setProfileAvatar(settings.avatar);
                    setIsEditingProfile(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#E5A866]" />
                  <span>Edit Profile</span>
                </button>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                  UID // ON-8842
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl">
                {settings.bio || 'AI Creative Director & Cognitive Prompt Architect at ONᵉ Studio.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500 pt-0.5">
                <span className="text-zinc-400">{settings.handle}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Dual-Brain Pipeline Linked
                </span>
                <span>•</span>
                {/* Clickable Priority Fast-Pass Toggle */}
                <button
                  onClick={() => {
                    audioSynth.playClick(fastPassEnabled ? 800 : 1200);
                    setFastPassEnabled(!fastPassEnabled);
                    addToast({
                      type: 'info',
                      title: fastPassEnabled ? 'Standard Latency Mode' : 'Priority Fast-Pass Active',
                      message: fastPassEnabled ? 'Compute queue set to standard priority.' : 'Turbospeed inference prioritized on Jev & Inkling.',
                    });
                  }}
                  className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    fastPassEnabled
                      ? 'bg-[#E5A866]/15 border-[#E5A866]/40 text-[#E5A866]'
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                  title="Click to toggle Priority Fast-Pass"
                >
                  <Zap className="w-3 h-3" />
                  <span>{fastPassEnabled ? 'Priority Fast-Pass' : 'Standard Mode'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: User Key Metrics (Interactive Clickable Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs shrink-0">
            {/* 1. Indexed Queries */}
            <div
              onClick={() => {
                audioSynth.playClick(1050);
                setActiveCategory('all');
                setSearchQuery('');
                addToast({ type: 'info', title: 'All Queries Active', message: `Showing all ${vectorNodes.length} search queries in 3D Galaxy.` });
              }}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-[#6366F1]/15 border border-white/5 hover:border-[#6366F1]/40 space-y-0.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
              title="Click to reset filters and view all queries"
            >
              <span className="text-[10px] text-zinc-500 block uppercase group-hover:text-[#A5C4F2] transition-colors">Indexed Queries</span>
              <span className="text-base font-bold text-white font-mono flex items-center gap-1.5 group-hover:text-[#6366F1] transition-colors">
                <Search className="w-3.5 h-3.5 text-[#6366F1]" />
                {vectorNodes.length} Vectors
              </span>
            </div>

            {/* 2. Cosine Sim */}
            <div
              onClick={handleCosineSimClick}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/40 space-y-0.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
              title="Click to run semantic distance scan across galaxy"
            >
              <span className="text-[10px] text-zinc-500 block uppercase group-hover:text-emerald-300 transition-colors">Cosine Sim</span>
              <span className="text-base font-bold text-emerald-400 font-mono flex items-center gap-1.5 group-hover:scale-105 transition-transform origin-left">
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                96.4%
              </span>
            </div>

            {/* 3. Latent Space */}
            <div
              onClick={handleLatentSpaceClick}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-[#A5C4F2]/15 border border-white/5 hover:border-[#A5C4F2]/40 space-y-0.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
              title="Click to toggle 3D auto-orbit"
            >
              <span className="text-[10px] text-zinc-500 block uppercase group-hover:text-white transition-colors">Latent Space</span>
              <span className="text-base font-bold text-[#A5C4F2] font-mono flex items-center gap-1.5 group-hover:scale-105 transition-transform origin-left">
                <Rotate3d className="w-3.5 h-3.5 text-[#A5C4F2]" />
                384-Dim
              </span>
            </div>

            {/* 4. Energy Reserve */}
            <div
              onClick={handleRechargeEnergy}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-[#E5A866]/15 border border-white/5 hover:border-[#E5A866]/50 space-y-0.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group relative overflow-hidden"
              title="Click to recharge +500 ⚡ compute energy"
            >
              <span className="text-[10px] text-zinc-500 block uppercase group-hover:text-[#E5A866] transition-colors flex items-center justify-between">
                <span>Energy Reserve</span>
                <span className="text-[9px] text-[#E5A866] opacity-0 group-hover:opacity-100 transition-opacity font-bold">+500⚡</span>
              </span>
              <span className={`text-base font-bold text-[#E5A866] font-mono flex items-center gap-1.5 transition-transform origin-left ${energyBonusAnimation ? 'scale-110 text-white' : ''}`}>
                <Zap className="w-3.5 h-3.5 text-[#E5A866] group-hover:animate-bounce" />
                {settings.energyCredits.toLocaleString()} ⚡
              </span>
            </div>
          </div>
        </div>

        {/* Semantic Cluster Interest Breakdown Progress Bar (Clickable Segments) */}
        <div className="pt-3 border-t border-[#141822] space-y-2.5">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-xs text-zinc-300">
              <Layers className="w-3.5 h-3.5 text-[#6366F1]" />
              SEMANTIC VECTOR DISTRIBUTION
            </span>
            <span className="text-[11px] text-zinc-500">Click any category to filter the 3D Galaxy</span>
          </div>

          {/* Interactive Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden flex gap-0.5 p-0.5 border border-white/5">
            <button
              onClick={() => handleCategoryChipClick('code')}
              className={`h-full bg-[#6366F1] hover:brightness-125 rounded-l-full transition-all cursor-pointer ${activeCategory === 'code' ? 'brightness-125 shadow-[0_0_10px_#6366F1]' : ''}`}
              style={{ width: '38%' }}
              title="Click to filter Code & Architecture (38%)"
            />
            <button
              onClick={() => handleCategoryChipClick('logic')}
              className={`h-full bg-[#E5A866] hover:brightness-125 transition-all cursor-pointer ${activeCategory === 'logic' ? 'brightness-125 shadow-[0_0_10px_#E5A866]' : ''}`}
              style={{ width: '32%' }}
              title="Click to filter Logic & Knowledge (32%)"
            />
            <button
              onClick={() => handleCategoryChipClick('creative')}
              className={`h-full bg-[#9875D8] hover:brightness-125 transition-all cursor-pointer ${activeCategory === 'creative' ? 'brightness-125 shadow-[0_0_10px_#9875D8]' : ''}`}
              style={{ width: '20%' }}
              title="Click to filter Creative & Cinema (20%)"
            />
            <button
              onClick={() => handleCategoryChipClick('concept')}
              className={`h-full bg-[#65C29A] hover:brightness-125 rounded-r-full transition-all cursor-pointer ${activeCategory === 'concept' ? 'brightness-125 shadow-[0_0_10px_#65C29A]' : ''}`}
              style={{ width: '10%' }}
              title="Click to filter Concepts & Species (10%)"
            />
          </div>

          {/* Interactive Category Chips */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            {[
              { id: 'all', label: 'All Categories', pct: '100%', color: '#A5C4F2' },
              { id: 'code', label: 'Code & Dev', pct: '38%', color: '#6366F1' },
              { id: 'logic', label: 'Knowledge & Logic', pct: '32%', color: '#E5A866' },
              { id: 'creative', label: 'Creative', pct: '20%', color: '#9875D8' },
              { id: 'concept', label: 'Concepts', pct: '10%', color: '#65C29A' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleCategoryChipClick(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer border ${
                  activeCategory === item.id
                    ? 'bg-white/10 text-white border-white/20 shadow-sm scale-105 font-medium'
                    : 'text-zinc-400 hover:text-white bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label} ({item.pct})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick AI Search & Topic Creation Launcher */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateSearchTopic(quickPrompt, false);
          }}
          className="pt-2 border-t border-[#2A475E]/70 flex flex-wrap sm:flex-nowrap items-center gap-2.5"
        >
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#66C0F4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Search or enter any topic to create on the Spider Web..."
              className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#66C0F4] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Button 1: Add to Web (Instant creation right on the web) */}
            <button
              type="button"
              onClick={() => handleCreateSearchTopic(quickPrompt, false)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#66C0F4]/50 text-white text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shadow-sm"
              title="Add this topic directly to the Spider Web"
            >
              <Plus className="w-3.5 h-3.5 text-[#66C0F4]" />
              <span>Add to Web</span>
            </button>

            {/* Button 2: Ask Chat (Create on web + Open in AI Chat) */}
            <button
              type="submit"
              onClick={() => handleCreateSearchTopic(quickPrompt, true)}
              className="px-4 py-2 rounded-xl steam-button-primary text-white text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shadow-md"
              title="Index topic on web and launch conversation"
            >
              <span>Ask Chat</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: EDIT USER PROFILE MODAL                         */}
      {/* ======================================================== */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="rounded-2xl bg-[#171D25] border border-[#2A475E] p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A475E]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#66C0F4]" />
                <h3 className="font-semibold text-white text-base">Edit User Profile</h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 block uppercase">Profile Avatar Preset</label>
                <div className="flex items-center gap-3">
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileAvatar(preset)}
                      className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        profileAvatar === preset ? 'border-[#66C0F4] scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block uppercase">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#66C0F4] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none"
                  placeholder="Your Name"
                  required
                />
              </div>

              {/* Handle */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block uppercase">Handle</label>
                <input
                  type="text"
                  value={profileHandle}
                  onChange={(e) => setProfileHandle(e.target.value)}
                  className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#66C0F4] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none font-mono"
                  placeholder="@handle"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 block uppercase">Bio & Studio Role</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={3}
                  className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#66C0F4] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none resize-none leading-relaxed"
                  placeholder="Describe your role or creative focus..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A475E]">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl steam-button-primary text-white text-xs font-mono font-medium transition-all cursor-pointer shadow-lg hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: VERIFIED CREDENTIALS BADGE MODAL               */}
      {/* ======================================================== */}
      {showVerifiedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="rounded-2xl bg-[#171D25] border border-[#2A475E] p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A475E]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#66C0F4]" />
                <h3 className="font-semibold text-white text-base">Verified Creative Identity</h3>
              </div>
              <button
                onClick={() => setShowVerifiedModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#101822] border border-[#2A475E]/70 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block">Account UID</span>
                <span className="text-white font-bold text-sm">ON-8842 // QUANTUM-NODE</span>
              </div>

              <div className="p-3 rounded-xl bg-[#101822] border border-[#2A475E]/70 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block">Verification Protocol</span>
                <span className="text-[#66C0F4] font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Dual-Brain Neural Pipeline Active
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#101822] border border-[#2A475E]/70 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block">Cryptographic Fingerprint</span>
                <span className="text-zinc-400 text-[11px] break-all">
                  sha256:7f2a89cb391e48bc02a9df884210e5a866
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowVerifiedModal(false)}
              className="w-full py-2.5 rounded-xl steam-button-primary text-white text-xs font-mono font-medium transition-colors cursor-pointer shadow-md"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SEMANTIC SPIDER WEB // VECTOR INDEXING                 */}
      {/* ======================================================== */}
      <div className="space-y-3">
        {/* Top Controls Toolbar matching Image 4 */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-2">
              <span className="text-[#66C0F4]">01 //</span>
              <Share2 className="w-3.5 h-3.5 text-[#66C0F4]" />
              <span>SEMANTIC SPIDER WEB // VECTOR INDEXING</span>
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400 font-mono tracking-wider">
              HIGH-DIMENSIONAL COGNITIVE LATTICE
            </span>
          </div>

          {/* Interactive Tools & Spider Web Controls */}
          <div className="flex flex-wrap items-center gap-2 font-mono">
            {/* Spider Web Toggle Button */}
            <button
              onClick={() => {
                audioSynth.playClick(1100);
                setShowWeb(!showWeb);
              }}
              className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                showWeb
                  ? 'bg-[#536DFE]/20 border-[#536DFE]/60 text-white font-medium shadow-sm'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Toggle 3D Spider Web structure"
            >
              <Share2 className="w-3 h-3 text-[#66C0F4]" />
              <span>Spider Web</span>
            </button>

            {/* Web Style Selector (Orb, Vortex, Matrix) */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px]">
              <button
                onClick={() => {
                  audioSynth.playClick(1050);
                  setWebStyle('orb');
                  setShowWeb(true);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  showWeb && webStyle === 'orb'
                    ? 'bg-[#66C0F4]/20 border border-[#66C0F4]/50 text-[#66C0F4] font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Grand Luminescent Orb Web"
              >
                <span>🕸️ Orb</span>
              </button>

              <button
                onClick={() => {
                  audioSynth.playClick(1150);
                  setWebStyle('vortex');
                  setShowWeb(true);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  showWeb && webStyle === 'vortex'
                    ? 'bg-[#66C0F4]/20 border border-[#66C0F4]/50 text-[#66C0F4] font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="3D Hyperbolic Vortex Funnel Web"
              >
                <span>🕸️ Vortex</span>
              </button>

              <button
                onClick={() => {
                  audioSynth.playClick(1250);
                  setWebStyle('matrix');
                  setShowWeb(true);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  showWeb && webStyle === 'matrix'
                    ? 'bg-[#66C0F4]/20 border border-[#66C0F4]/50 text-[#66C0F4] font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Cyber Quantum Matrix Lattice"
              >
                <span>🕸️ Matrix</span>
              </button>
            </div>

            {/* Dew Pulses Toggle */}
            <button
              onClick={() => {
                audioSynth.playClick(1100);
                setShowDewdrops(!showDewdrops);
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                showDewdrops
                  ? 'bg-[#E5A866]/20 border-[#E5A866]/60 text-[#E5A866] font-medium shadow-sm'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Toggle glistening dewdrops & pulses"
            >
              <Sparkles className="w-3 h-3 text-[#E5A866]" />
              <span>Dew Pulses</span>
            </button>

            {/* Web Flex / Vibration Toggle */}
            <button
              onClick={() => {
                audioSynth.playClick(950);
                setWebVibration(!webVibration);
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                webVibration
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400 font-medium shadow-sm'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Toggle organic silk flex & vibration"
            >
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Web Flex</span>
            </button>

            {/* Reset Camera Button */}
            <button
              onClick={handleResetCamera}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-[11px] transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset 3D perspective"
            >
              <Rotate3d className="w-3 h-3 text-[#66C0F4]" />
              <span>Reset</span>
            </button>

            {/* Auto Orbit Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                isRotating
                  ? 'bg-[#66C0F4]/20 border-[#66C0F4]/50 text-white font-medium'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <span>{isRotating ? 'Pause Orbit' : 'Auto Orbit'}</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar matching Image 4 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl capsule-control text-xs font-mono">
            {[
              { id: 'all', label: 'All Vectors' },
              { id: 'concept', label: 'Concepts (Dog/Wolf/Cat)' },
              { id: 'logic', label: 'Noul Truth (Sparrow/Tomato)' },
              { id: 'code', label: 'Code & Dev' },
              { id: 'creative', label: 'Creative & 35mm' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  audioSynth.playClick(1100);
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-white/15 text-white font-medium border border-white/20 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleCreateSearchTopic(searchQuery, false);
                  setSearchQuery('');
                }
              }}
              placeholder="Filter topics or press Enter to create..."
              className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#66C0F4] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Main 3D Canvas Box with Subtle Ambient Background Animations */}
        <div className="relative rounded-2xl bg-[#101822] border border-[#2A475E] overflow-hidden group shadow-[0_0_50px_rgba(10,16,24,0.8)]">
          {/* Subtle animated background ambient aura orbs */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#66C0F4]/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#2A475E]/25 rounded-full blur-3xl pointer-events-none animate-pulse-subtle [animation-delay:3s]" />

          {/* Top Instruction Pill */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-2 font-mono text-[10px] text-zinc-400 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#66C0F4] animate-ping" />
            <span className="text-[#66C0F4] font-semibold">Interactive Spider Web</span>
            <span>• Click any dot to open in chat</span>
          </div>

          {/* 3D Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
            className="w-full h-[640px] sm:h-[720px] cursor-grab active:cursor-grabbing block"
          />

          {/* Selected Node Detail Modal matching Image 1 */}
          {selectedNode && (
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-[420px] z-30 animate-fadeIn pointer-events-auto">
              <div className="rounded-2xl bg-[#101822]/95 backdrop-blur-xl border border-[#2A475E] p-5 shadow-2xl space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#536DFE] shadow-[0_0_10px_#536DFE] inline-block" />
                    <h3 className="font-bold text-white text-base font-sans tracking-wide">
                      {selectedNode.label}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#1B2838] border border-[#2A475E] text-[#66C0F4] font-semibold tracking-wider">
                      {selectedNode.category.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quote / Subtitle */}
                <p className="text-xs sm:text-sm text-zinc-300 font-light italic leading-relaxed">
                  "{selectedNode.prompt}"
                </p>

                {/* Two Metric Cards */}
                <div className="grid grid-cols-2 gap-2.5 font-mono">
                  <div className="p-3 rounded-xl bg-[#171D25] border border-[#2A475E]/70 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">COSINE SIMILARITY</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {(selectedNode.similarity * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#171D25] border border-[#2A475E]/70 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">VECTOR 3D PROJECTION</span>
                    <span className="text-[#66C0F4] font-mono text-xs">
                      [{selectedNode.x.toFixed(2)}, {selectedNode.y.toFixed(2)}, {selectedNode.z.toFixed(2)}]
                    </span>
                  </div>
                </div>

                {/* Insight Pill */}
                <div className="p-2.5 rounded-xl bg-[#E5A866]/10 border border-[#E5A866]/30 flex items-center gap-2 text-xs font-mono text-[#E5A866]">
                  <span>💡</span>
                  <span className="font-medium">{selectedNode.subLabel || `${selectedNode.label} Neural Modeling`}</span>
                </div>

                {/* Open in AI Chat CTA Button */}
                <button
                  onClick={() => handleOpenConversation(selectedNode)}
                  className="w-full py-2.5 rounded-xl bg-[#1B2838] hover:bg-[#2A475E] border border-[#2A475E] hover:border-[#66C0F4] text-white text-xs font-mono font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#66C0F4]/20 hover:scale-[1.01]"
                >
                  <span>Open in AI Chat</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#66C0F4]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400 pt-2 border-t border-[#2A475E]/70">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#536DFE]" />
              <span>Search Queries</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
              <span>Dewdrop Knots</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#66C0F4]" />
              <span>Silk Strands</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#66C0F4]" />
              <span>Cyber Weaver Core</span>
            </span>
          </div>

          <span className="text-[11px] text-zinc-500">
            Interactive 3D Spider Web • Vector Indexing
          </span>
        </div>
      </div>
    </div>
  );
};
