import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Rotate3d,
  ArrowUpRight,
  Brain,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ChevronRight,
  Sliders,
  Edit3,
  Camera,
  Check,
  X,
  Plus,
  Send,
  Box,
  Sun,
  Moon
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

export type ChamberTheme = 'blueprint' | 'cyber';

// Deterministic placement on the 3 chamber surfaces: Left Wall, Right Wall, or Floor
export const getChamberSurfaceCoords = (seedStr: string, index: number) => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash) + index * 43;

  const surface = index % 3; // 0 = Left Wall, 1 = Right Wall, 2 = Floor

  // Normalized u, v in [0.15, 0.85] to keep away from extreme boundaries
  const u = 0.15 + ((hash % 100) / 100) * 0.70;
  const v = 0.15 + (((hash >> 2) % 100) / 100) * 0.70;

  if (surface === 0) {
    // Left Wall: X in [-2.4, -0.3], Y in [-0.7, 1.4], Z = 0
    return {
      x: -2.4 + u * 2.1,
      y: -0.7 + v * 2.1,
      z: 0,
      surface: 'left',
    };
  } else if (surface === 1) {
    // Right Wall: X = 0, Y in [-0.7, 1.4], Z in [0.3, 2.4]
    return {
      x: 0,
      y: -0.7 + v * 2.1,
      z: 0.3 + u * 2.1,
      surface: 'right',
    };
  } else {
    // Floor: X in [-2.4, -0.3], Y = -0.9, Z in [0.3, 2.4]
    return {
      x: -2.4 + u * 2.1,
      y: -0.9,
      z: 0.3 + v * 2.1,
      surface: 'floor',
    };
  }
};

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

  // Persisted user-searched topics dynamically created by user
  const [customTopics, setCustomTopics] = useState<VectorNode[]>(() => {
    try {
      const saved = localStorage.getItem('one_spiderweb_user_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Listen for external task anchors (e.g. from Daily Cadence Task module)
  useEffect(() => {
    const handleChamberUpdate = () => {
      try {
        const saved = localStorage.getItem('one_spiderweb_user_topics');
        if (saved) {
          setCustomTopics(JSON.parse(saved));
        }
      } catch (err) { }
    };
    window.addEventListener('one_spiderweb_update', handleChamberUpdate);
    return () => window.removeEventListener('one_spiderweb_update', handleChamberUpdate);
  }, []);

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

  // Chamber Visual Theme: 'blueprint' matches user's uploaded reference image!
  const [chamberTheme, setChamberTheme] = useState<ChamberTheme>('blueprint');
  const [showCreaseLabels, setShowCreaseLabels] = useState(true);

  // Acoustic shockwave ripples from tapping surfaces
  const ripplesRef = useRef<Array<{ x: number; y: number; z: number; startTime: number; maxR: number; color?: string }>>([]);
  const mouseScreenRef = useRef<{ x: number; y: number } | null>(null);

  // Initial camera orientation (matching exact 3D isometric corner angle of reference image)
  const rotationRef = useRef({ rotX: 0.28, rotY: -0.62 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // 1. Vector Nodes: Strictly populated from user queries & real saved topics (ZERO dummy data!)
  const vectorNodes: VectorNode[] = useMemo(() => {
    const list: VectorNode[] = [];

    // A. User-created topics and anchored tasks
    customTopics.forEach((cNode, idx) => {
      if (!list.some((n) => n.id === cNode.id || n.label.toLowerCase() === cNode.label.toLowerCase())) {
        const coords = getChamberSurfaceCoords(cNode.id || cNode.label, idx);
        list.push({
          ...cNode,
          x: coords.x,
          y: coords.y,
          z: coords.z,
        });
      }
    });

    // B. Dynamically project user searches / prompts from real AI conversations
    conversations.forEach((conv, cIdx) => {
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
        if (/code|typescript|javascript|react|css|html|function|api|algorithm|database|docker|backend|class|bug/i.test(lower)) {
          category = 'code';
        } else if (/why|what|is|how|explain|truth|taxonomy|logic|math|vs|system|noul|proof/i.test(lower)) {
          category = 'logic';
        } else if (/art|cinematic|render|cyberpunk|image|prompt|style|music|video|visual|photo|anime/i.test(lower)) {
          category = 'creative';
        }

        const coords = getChamberSurfaceCoords(`conv-${conv.id}-${qIdx}`, list.length);

        list.push({
          id: `conv-search-${conv.id}-${qIdx}`,
          label: clean.slice(0, 24),
          searchQueryTitle: `🔍 "${clean.slice(0, 26)}${clean.length > 26 ? '...' : ''}"`,
          category,
          prompt: clean,
          x: coords.x,
          y: coords.y,
          z: coords.z,
          similarity: 0.91 + ((clean.length % 8) / 100),
          conversationId: conv.id,
          badgeType: category === 'code' ? 'code' : category === 'logic' ? 'sparrow' : 'ai',
          subLabel: `${category.toUpperCase()} // Searched Vector`,
          searchTimestamp: conv.createdAt,
          searchEngine: 'Dual-Brain Pipeline',
        });
      });
    });

    return list;
  }, [conversations, customTopics]);

  // Filtered nodes based on search and category
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

  // Mouse drag handlers for 3D Orbit
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
    rotationRef.current.rotX = Math.max(-0.85, Math.min(0.85, rotationRef.current.rotX + dy * 0.006));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Reset 3D view to exact isometric corner orientation
  const handleResetCamera = () => {
    rotationRef.current = { rotX: 0.28, rotY: -0.62 };
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
    let height = (canvas.height = canvas.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Isometric projection helper
    const project3D = (x: number, y: number, z: number, rotX: number, rotY: number) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const cameraDist = 3.2;
      const scale = (380 / (cameraDist + z2)) * zoomLevel;
      const screenX = width / 2 + x1 * scale * 1.35;
      const screenY = height / 2 - y2 * scale * 1.25;

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

      // Clean expired shockwave ripples
      ripplesRef.current = ripplesRef.current.filter((r) => time - r.startTime < 2200);

      const isBlueprint = chamberTheme === 'blueprint';

      // ----------------------------------------------------
      // 1. BASE BACKGROUND FILL
      // ----------------------------------------------------
      ctx.fillStyle = isBlueprint ? '#E2EFFC' : '#0B101A';
      ctx.fillRect(0, 0, width, height);

      // ----------------------------------------------------
      // 2. 3D ISOMETRIC ROOM CORNER GEOMETRY
      // Corner seam is at (0, y, 0).
      // Left Wall is plane Z=0, X in [-2.7, 0], Y in [-0.95, 1.75].
      // Right Wall is plane X=0, Z in [0, 2.7], Y in [-0.95, 1.75].
      // Floor is plane Y=-0.95, X in [-2.7, 0], Z in [0, 2.7].
      // ----------------------------------------------------
      const wallW = 2.7;
      const wallH = 1.75;
      const floorY = -0.95;

      // Wall and floor corner vertices
      const vTopCorner = project3D(0, wallH, 0, rotX, rotY);
      const vBottomCorner = project3D(0, floorY, 0, rotX, rotY);
      const vTopLeft = project3D(-wallW, wallH, 0, rotX, rotY);
      const vBottomLeft = project3D(-wallW, floorY, 0, rotX, rotY);
      const vTopRight = project3D(0, wallH, wallW, rotX, rotY);
      const vBottomRight = project3D(0, floorY, wallW, rotX, rotY);
      const vForeground = project3D(-wallW, floorY, wallW, rotX, rotY);

      // ----------------------------------------------------
      // A. LEFT WALL PLANE (Soft Cyan / Light Sky-Blue Gradient)
      // ----------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(vTopLeft.screenX, vTopLeft.screenY);
      ctx.lineTo(vTopCorner.screenX, vTopCorner.screenY);
      ctx.lineTo(vBottomCorner.screenX, vBottomCorner.screenY);
      ctx.lineTo(vBottomLeft.screenX, vBottomLeft.screenY);
      ctx.closePath();

      const leftGrad = ctx.createLinearGradient(
        vTopLeft.screenX,
        vTopLeft.screenY,
        vBottomCorner.screenX,
        vBottomCorner.screenY
      );
      if (isBlueprint) {
        leftGrad.addColorStop(0, '#E0F0FE');
        leftGrad.addColorStop(0.55, '#B7D8FA');
        leftGrad.addColorStop(1, '#97C3EE');
      } else {
        leftGrad.addColorStop(0, '#131B2A');
        leftGrad.addColorStop(0.6, '#0E1521');
        leftGrad.addColorStop(1, '#090E17');
      }
      ctx.fillStyle = leftGrad;
      ctx.fill();

      // ----------------------------------------------------
      // B. RIGHT WALL PLANE (Soft Sky-Blue Gradient)
      // ----------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(vTopCorner.screenX, vTopCorner.screenY);
      ctx.lineTo(vTopRight.screenX, vTopRight.screenY);
      ctx.lineTo(vBottomRight.screenX, vBottomRight.screenY);
      ctx.lineTo(vBottomCorner.screenX, vBottomCorner.screenY);
      ctx.closePath();

      const rightGrad = ctx.createLinearGradient(
        vTopRight.screenX,
        vTopRight.screenY,
        vBottomCorner.screenX,
        vBottomCorner.screenY
      );
      if (isBlueprint) {
        rightGrad.addColorStop(0, '#D0E6FC');
        rightGrad.addColorStop(0.55, '#A8CEF6');
        rightGrad.addColorStop(1, '#8AB8EB');
      } else {
        rightGrad.addColorStop(0, '#172235');
        rightGrad.addColorStop(0.6, '#101928');
        rightGrad.addColorStop(1, '#0B111C');
      }
      ctx.fillStyle = rightGrad;
      ctx.fill();

      // ----------------------------------------------------
      // C. FLOOR PLANE (Soft Periwinkle / Lavender Gradient)
      // ----------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(vBottomCorner.screenX, vBottomCorner.screenY);
      ctx.lineTo(vBottomLeft.screenX, vBottomLeft.screenY);
      ctx.lineTo(vForeground.screenX, vForeground.screenY);
      ctx.lineTo(vBottomRight.screenX, vBottomRight.screenY);
      ctx.closePath();

      const floorGrad = ctx.createLinearGradient(
        vBottomCorner.screenX,
        vBottomCorner.screenY,
        vForeground.screenX,
        vForeground.screenY
      );
      if (isBlueprint) {
        floorGrad.addColorStop(0, '#A7C4F7');
        floorGrad.addColorStop(0.5, '#8FB4F3');
        floorGrad.addColorStop(1, '#789EE5');
      } else {
        floorGrad.addColorStop(0, '#1A273D');
        floorGrad.addColorStop(0.6, '#121C2C');
        floorGrad.addColorStop(1, '#0C1320');
      }
      ctx.fillStyle = floorGrad;
      ctx.fill();

      // ----------------------------------------------------
      // D. CRISP DARK CORNER CREASE LINES (Solid ~2.5px - Exact reference!)
      // ----------------------------------------------------
      const creaseColor = isBlueprint ? '#28394E' : '#66C0F4';
      ctx.strokeStyle = creaseColor;
      ctx.lineWidth = isBlueprint ? 2.4 : 1.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Vertical corner seam
      ctx.beginPath();
      ctx.moveTo(vTopCorner.screenX, vTopCorner.screenY);
      ctx.lineTo(vBottomCorner.screenX, vBottomCorner.screenY);
      ctx.stroke();

      // 2. Left floor crease
      ctx.beginPath();
      ctx.moveTo(vBottomCorner.screenX, vBottomCorner.screenY);
      ctx.lineTo(vBottomLeft.screenX, vBottomLeft.screenY);
      ctx.stroke();

      // 3. Right floor crease
      ctx.beginPath();
      ctx.moveTo(vBottomCorner.screenX, vBottomCorner.screenY);
      ctx.lineTo(vBottomRight.screenX, vBottomRight.screenY);
      ctx.stroke();

      // Optional outer frame creases
      ctx.strokeStyle = isBlueprint ? 'rgba(40, 57, 78, 0.45)' : 'rgba(102, 192, 244, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(vTopLeft.screenX, vTopLeft.screenY);
      ctx.lineTo(vBottomLeft.screenX, vBottomLeft.screenY);
      ctx.lineTo(vForeground.screenX, vForeground.screenY);
      ctx.lineTo(vBottomRight.screenX, vBottomRight.screenY);
      ctx.lineTo(vTopRight.screenX, vTopRight.screenY);
      ctx.stroke();

      // Subtle surface grid lines
      ctx.strokeStyle = isBlueprint ? 'rgba(40, 57, 78, 0.08)' : 'rgba(102, 192, 244, 0.08)';
      ctx.lineWidth = 1;
      const numGrid = 5;
      for (let g = 1; g < numGrid; g++) {
        // Floor grid
        const t = -wallW + (g * wallW) / numGrid;
        const pF1 = project3D(t, floorY, 0, rotX, rotY);
        const pF2 = project3D(t, floorY, wallW, rotX, rotY);
        ctx.beginPath();
        ctx.moveTo(pF1.screenX, pF1.screenY);
        ctx.lineTo(pF2.screenX, pF2.screenY);
        ctx.stroke();

        const pF3 = project3D(0, floorY, (g * wallW) / numGrid, rotX, rotY);
        const pF4 = project3D(-wallW, floorY, (g * wallW) / numGrid, rotX, rotY);
        ctx.beginPath();
        ctx.moveTo(pF3.screenX, pF3.screenY);
        ctx.lineTo(pF4.screenX, pF4.screenY);
        ctx.stroke();
      }

      // ----------------------------------------------------
      // E. SOLITARY STARDUST DOTS (Scattered on Walls/Floor as in reference image)
      // ----------------------------------------------------
      const ambientDots = [
        { x: -2.1, y: 1.1, z: 0 },
        { x: -1.3, y: 1.45, z: 0 },
        { x: -0.6, y: 0.95, z: 0 },
        { x: -1.8, y: -0.2, z: 0 },
        { x: -0.9, y: -0.5, z: 0 },
        { x: 0, y: 1.35, z: 0.7 },
        { x: 0, y: 0.85, z: 1.8 },
        { x: 0, y: -0.15, z: 1.2 },
        { x: 0, y: -0.6, z: 2.1 },
        { x: -1.8, y: floorY, z: 0.8 },
        { x: -0.8, y: floorY, z: 1.4 },
        { x: -1.4, y: floorY, z: 2.1 },
        { x: -2.1, y: floorY, z: 1.7 },
      ];

      ambientDots.forEach((pt) => {
        const pProj = project3D(pt.x, pt.y, pt.z, rotX, rotY);
        ctx.beginPath();
        ctx.arc(pProj.screenX, pProj.screenY, 3.2 * (pProj.scale / 120), 0, Math.PI * 2);
        ctx.fillStyle = isBlueprint ? '#4D62FE' : '#66C0F4';
        ctx.fill();
      });

      // ----------------------------------------------------
      // F. SHOCKWAVE RIPPLES FROM CLICKING
      // ----------------------------------------------------
      ripplesRef.current.forEach((rip) => {
        const elapsed = (time - rip.startTime) / 2200;
        const ripRadius = elapsed * rip.maxR;
        const alpha = (1 - elapsed) * 0.7;

        ctx.beginPath();
        const steps = 32;
        for (let s = 0; s <= steps; s++) {
          const a = (s / steps) * Math.PI * 2;
          const rx = rip.x + Math.cos(a) * ripRadius;
          const rz = rip.z + Math.sin(a) * ripRadius;
          const p = project3D(rx, rip.y, rz, rotX, rotY);
          if (s === 0) ctx.moveTo(p.screenX, p.screenY);
          else ctx.lineTo(p.screenX, p.screenY);
        }
        ctx.strokeStyle = `rgba(77, 98, 254, ${alpha})`;
        ctx.lineWidth = 2 * (1 - elapsed) + 0.8;
        ctx.stroke();
      });

      // ----------------------------------------------------
      // G. 3D TRIPLE-DOT PAW CLUSTERS FOR EACH USER QUERY
      // (1 main center circle + 2 satellite ear dots + optional companion dot)
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

      projectedNodes.forEach(({ node, proj }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        // Radius for the main center circle
        const baseR = (isHovered || isSelected ? 10.5 : 8.5) * (proj.scale / 120);

        // Satellite ear dots on top
        const earR = baseR * 0.44;
        const earOffsetX = baseR * 0.74;
        const earOffsetY = baseR * 0.98;

        // Companion dot on side
        const companionR = baseR * 0.42;
        const companionOffsetX = baseR * 1.45;
        const companionOffsetY = baseR * 0.35;

        // Hover aura glow
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(proj.screenX, proj.screenY, baseR * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(77, 98, 254, 0.28)';
          ctx.fill();
        }

        const pawColor = isHovered || isSelected ? '#3749E6' : '#4D62FE';

        // Ear dot 1 (top-left)
        ctx.beginPath();
        ctx.arc(proj.screenX - earOffsetX, proj.screenY - earOffsetY, earR, 0, Math.PI * 2);
        ctx.fillStyle = pawColor;
        ctx.fill();

        // Ear dot 2 (top-right)
        ctx.beginPath();
        ctx.arc(proj.screenX + earOffsetX, proj.screenY - earOffsetY, earR, 0, Math.PI * 2);
        ctx.fillStyle = pawColor;
        ctx.fill();

        // Companion side dot
        ctx.beginPath();
        ctx.arc(proj.screenX + companionOffsetX, proj.screenY + companionOffsetY, companionR, 0, Math.PI * 2);
        ctx.fillStyle = pawColor;
        ctx.fill();

        // Main center circle
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, baseR, 0, Math.PI * 2);
        ctx.fillStyle = pawColor;
        ctx.fill();

        // Specular highlight
        ctx.beginPath();
        ctx.arc(proj.screenX - baseR * 0.32, proj.screenY - baseR * 0.32, baseR * 0.30, 0, Math.PI * 2);
        ctx.fillStyle = isHovered || isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)';
        ctx.fill();
      });

      // ----------------------------------------------------
      // H. PROMINENT CIRCULAR WHITE BADGE WITH LEADER LINE
      // Matches the exact badge on the right wall from reference image!
      // ----------------------------------------------------
      // Determine which node displays the leader line and circular white badge
      const activeBadgeNode =
        selectedNode ||
        hoveredNode ||
        (projectedNodes.length > 0 ? projectedNodes.find((n) => n.node.x === 0) || projectedNodes[0] : null);

      if (activeBadgeNode) {
        const targetProj =
          'proj' in activeBadgeNode
            ? activeBadgeNode.proj
            : project3D(activeBadgeNode.x, activeBadgeNode.y, activeBadgeNode.z, rotX, rotY);
        const nodeData = 'node' in activeBadgeNode ? activeBadgeNode.node : activeBadgeNode;

        const badgeRadius = 26;
        // Position badge to the right or left with clean clearance
        const isRightAligned = targetProj.screenX < width * 0.65;
        const badgeX = isRightAligned
          ? Math.min(width - 50, targetProj.screenX + 90)
          : Math.max(50, targetProj.screenX - 90);
        const badgeY = Math.min(height - 50, Math.max(50, targetProj.screenY + 45));

        // Leader line angle to badge edge
        const angle = Math.atan2(badgeY - targetProj.screenY, badgeX - targetProj.screenX);
        const edgeX = badgeX - Math.cos(angle) * badgeRadius;
        const edgeY = badgeY - Math.sin(angle) * badgeRadius;

        // Leader line
        ctx.beginPath();
        ctx.moveTo(targetProj.screenX, targetProj.screenY);
        ctx.lineTo(edgeX, edgeY);
        ctx.strokeStyle = isBlueprint ? '#28394E' : '#66C0F4';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // White Circular Badge with drop shadow
        ctx.save();
        ctx.shadowColor = 'rgba(20, 30, 50, 0.28)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 4;

        ctx.beginPath();
        ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Dark border
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#28394E';
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Stylized "G" / Compass Emblem inside the badge
        ctx.save();
        ctx.translate(badgeX, badgeY);
        ctx.strokeStyle = '#28394E';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';

        // Outer arc
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0.22 * Math.PI, 1.78 * Math.PI, false);
        ctx.stroke();

        // Inward horizontal bar
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(13, 0);
        ctx.stroke();
        ctx.restore();

        // Query label pill beside badge
        const badgeLabel = nodeData.label || 'Active Vector';
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        const labelW = ctx.measureText(badgeLabel).width;
        const pillX = isRightAligned ? badgeX + badgeRadius + 10 : badgeX - badgeRadius - labelW - 24;
        const pillY = badgeY - 12;

        ctx.beginPath();
        ctx.roundRect(pillX, pillY, labelW + 20, 24, 6);
        ctx.fillStyle = 'rgba(40, 57, 78, 0.92)';
        ctx.fill();
        ctx.strokeStyle = '#66C0F4';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(badgeLabel, pillX + 10, pillY + 16);
      }

      // ----------------------------------------------------
      // I. EMPTY STATE WATERMARK (When 0 user queries exist yet)
      // ----------------------------------------------------
      if (filteredNodes.length === 0) {
        ctx.fillStyle = isBlueprint ? 'rgba(40, 57, 78, 0.85)' : 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 14px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('3D VECTOR PROJECTION CHAMBER ACTIVE', width / 2, height - 70);

        ctx.fillStyle = isBlueprint ? 'rgba(40, 57, 78, 0.65)' : 'rgba(165, 196, 242, 0.75)';
        ctx.font = '11px sans-serif';
        ctx.fillText('Ask AI Chat or type in the input bar below to create 3D vector clusters on walls & floor', width / 2, height - 48);
        ctx.textAlign = 'left';
      }

      // ----------------------------------------------------
      // J. FLOATING DETAIL CARD ON HOVER / SELECT
      // ----------------------------------------------------
      if (hoveredNode || selectedNode) {
        const activeNode = (hoveredNode || selectedNode)!;
        const proj = project3D(activeNode.x, activeNode.y, activeNode.z, rotX, rotY);

        const cardW = Math.min(320, width - 30);
        const cardH = 80;
        let cardX = proj.screenX - cardW / 2;
        let cardY = proj.screenY - cardH - 24;

        if (cardX < 15) cardX = 15;
        if (cardX + cardW > width - 15) cardX = width - cardW - 15;
        if (cardY < 15) cardY = proj.screenY + 24;

        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 8);
        ctx.fillStyle = 'rgba(16, 24, 38, 0.95)';
        ctx.fill();
        ctx.strokeStyle = '#4D62FE';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#66C0F4';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillText(`VECTOR // ${activeNode.category.toUpperCase()}`, cardX + 12, cardY + 18);

        ctx.fillStyle = '#34D399';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(activeNode.similarity * 100)}% Match`, cardX + cardW - 12, cardY + 18);
        ctx.textAlign = 'left';

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        const displayPrompt = activeNode.prompt.length > 42 ? activeNode.prompt.slice(0, 42) + '...' : activeNode.prompt;
        ctx.fillText(`"${displayPrompt}"`, cardX + 12, cardY + 38);

        ctx.fillStyle = 'rgba(165, 196, 242, 0.85)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`⚡ Click cluster to open in AI Chat ↗`, cardX + 12, cardY + 58);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [filteredNodes, hoveredNode, selectedNode, isRotating, zoomLevel, chamberTheme]);

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

      const cameraDist = 3.2;
      const scale = (380 / (cameraDist + z2)) * zoomLevel;
      const screenX = width / 2 + x1 * scale * 1.35;
      const screenY = height / 2 - y2 * scale * 1.25;

      const dist = Math.hypot(mouseX - screenX, mouseY - screenY);
      if (dist < 26) {
        audioSynth.playClick(1400);
        setSelectedNode(node);

        ripplesRef.current.push({
          x: node.x,
          y: node.y,
          z: node.z,
          startTime: performance.now(),
          maxR: 2.8,
          color: '#4D62FE',
        });
        return;
      }
    }

    // Tapping empty space produces a ripple on the floor
    ripplesRef.current.push({
      x: -1.2,
      y: -0.95,
      z: 1.2,
      startTime: performance.now(),
      maxR: 2.5,
      color: '#4D62FE',
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

      const cameraDist = 3.2;
      const scale = (380 / (cameraDist + z2)) * zoomLevel;
      const screenX = width / 2 + x1 * scale * 1.35;
      const screenY = height / 2 - y2 * scale * 1.25;

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
      title: 'Semantic Chamber Active',
      message: 'Recalculating 3D surface embeddings across chamber walls & floor.',
    });
    ripplesRef.current.push({
      x: -1.2,
      y: -0.95,
      z: 1.2,
      startTime: Date.now(),
      maxR: 3.2,
    });
  };

  const handleLatentSpaceClick = () => {
    audioSynth.playClick(900);
    setIsRotating((prev) => !prev);
    addToast({
      type: 'info',
      title: isRotating ? 'Orbit Paused' : '3D Orbit Active',
      message: 'Orbiting 3D Vector Chamber around corner axes.',
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
        maxR: 2.5,
      });
    }
  };

  // Dynamically create a user-searched topic and attach it to the 3D Chamber
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

    const convId = createConversation(clean);
    const coords = getChamberSurfaceCoords(clean, customTopics.length);

    const newNode: VectorNode = {
      id: `user-topic-${Date.now()}`,
      label: clean.slice(0, 24),
      searchQueryTitle: `🔍 "${clean.slice(0, 26)}${clean.length > 26 ? '...' : ''}"`,
      category,
      prompt: clean,
      x: coords.x,
      y: coords.y,
      z: coords.z,
      similarity: 0.94 + ((clean.length % 5) / 100),
      conversationId: convId,
      badgeType: category === 'code' ? 'code' : category === 'logic' ? 'sparrow' : 'ai',
      subLabel: `${category.toUpperCase()} // Vector Cluster`,
      searchTimestamp: 'Just now',
      searchEngine: 'Thinking Machines Inkling',
    };

    const updated = [newNode, ...customTopics];
    setCustomTopics(updated);
    try {
      localStorage.setItem('one_spiderweb_user_topics', JSON.stringify(updated));
    } catch (e) { }

    ripplesRef.current.push({
      x: newNode.x,
      y: newNode.y,
      z: newNode.z,
      startTime: performance.now(),
      maxR: 3.2,
      color: '#4D62FE',
    });
    audioSynth.playClick(1450);

    setSelectedNode(newNode);

    addToast({
      type: 'success',
      title: 'Vector Projected to 3D Chamber',
      message: `"${clean}" mapped onto chamber surface.`,
    });

    setQuickPrompt('');

    if (navigateToChat) {
      setActiveConversationId(convId);
      navigate('/chat');
    }
  };

  return (
    <div
      ref={containerRef}
      className="rounded-3xl bg-gradient-to-b from-[#1B2838]/85 to-[#171A21]/90 backdrop-blur-md border border-[#2A475E] p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Subtle Background Steam Auras */}
      <div className="absolute -top-24 right-1/4 w-[550px] h-[550px] bg-[#66C0F4]/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-1/2 -left-20 w-[500px] h-[500px] bg-[#2A475E]/30 rounded-full blur-3xl pointer-events-none animate-pulse-subtle [animation-delay:3s]" />
      <div className="absolute -bottom-24 right-10 w-[450px] h-[450px] bg-[#E5A866]/08 rounded-full blur-3xl pointer-events-none animate-pulse-subtle [animation-delay:5s]" />

      {/* ======================================================== */}
      {/* 1. INTERACTIVE USER PROFILE & IDENTITY CARD              */}
      {/* ======================================================== */}
      <div className="relative rounded-2xl bg-[#171D25]/90 border border-[#2A475E] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Avatar, Name, Handle, Badges */}
          <div className="flex items-start sm:items-center gap-4">
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

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white font-sans tracking-wide">
                  {settings.name}
                </h1>

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
                  className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${fastPassEnabled
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

          {/* Right: Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs shrink-0">
            <div
              onClick={() => {
                audioSynth.playClick(1050);
                setActiveCategory('all');
                setSearchQuery('');
                addToast({ type: 'info', title: 'All Queries Active', message: `Showing all ${vectorNodes.length} search queries in 3D Chamber.` });
              }}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-[#6366F1]/15 border border-white/5 hover:border-[#6366F1]/40 space-y-0.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
              title="Click to reset filters and view all queries"
            >
              <span className="text-[10px] text-zinc-500 block uppercase group-hover:text-[#A5C4F2] transition-colors">Indexed Vectors</span>
              <span className="text-base font-bold text-white font-mono flex items-center gap-1.5 group-hover:text-[#6366F1] transition-colors">
                <Search className="w-3.5 h-3.5 text-[#6366F1]" />
                {vectorNodes.length} Vectors
              </span>
            </div>

            <div
              onClick={handleCosineSimClick}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/40 space-y-0.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
              title="Click to run semantic distance scan"
            >
              <span className="text-[10px] text-zinc-500 block uppercase group-hover:text-emerald-300 transition-colors">Cosine Sim</span>
              <span className="text-base font-bold text-emerald-400 font-mono flex items-center gap-1.5 group-hover:scale-105 transition-transform origin-left">
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                96.4%
              </span>
            </div>

            <div
              onClick={handleLatentSpaceClick}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-[#A5C4F2]/15 border border-white/5 hover:border-[#A5C4F2]/40 space-y-0.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
              title="Click to toggle 3D auto-orbit"
            >
              <span className="text-[10px] text-zinc-500 block uppercase group-hover:text-white transition-colors">3D Chamber</span>
              <span className="text-base font-bold text-[#A5C4F2] font-mono flex items-center gap-1.5 group-hover:scale-105 transition-transform origin-left">
                <Rotate3d className="w-3.5 h-3.5 text-[#A5C4F2]" />
                Isometric
              </span>
            </div>

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

        {/* Semantic Vector Distribution */}
        <div className="pt-3 border-t border-[#141822] space-y-2.5">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-xs text-zinc-300">
              <Layers className="w-3.5 h-3.5 text-[#6366F1]" />
              SEMANTIC VECTOR DISTRIBUTION
            </span>
            <span className="text-[11px] text-zinc-500">Click any category to filter 3D Chamber</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden flex gap-0.5 p-0.5 border border-white/5">
            <button
              onClick={() => handleCategoryChipClick('code')}
              className={`h-full bg-[#6366F1] hover:brightness-125 rounded-l-full transition-all cursor-pointer ${activeCategory === 'code' ? 'brightness-125 shadow-[0_0_10px_#6366F1]' : ''}`}
              style={{ width: '38%' }}
              title="Click to filter Code & Dev"
            />
            <button
              onClick={() => handleCategoryChipClick('logic')}
              className={`h-full bg-[#E5A866] hover:brightness-125 transition-all cursor-pointer ${activeCategory === 'logic' ? 'brightness-125 shadow-[0_0_10px_#E5A866]' : ''}`}
              style={{ width: '32%' }}
              title="Click to filter Logic & Knowledge"
            />
            <button
              onClick={() => handleCategoryChipClick('creative')}
              className={`h-full bg-[#9875D8] hover:brightness-125 transition-all cursor-pointer ${activeCategory === 'creative' ? 'brightness-125 shadow-[0_0_10px_#9875D8]' : ''}`}
              style={{ width: '20%' }}
              title="Click to filter Creative & Cinema"
            />
            <button
              onClick={() => handleCategoryChipClick('concept')}
              className={`h-full bg-[#65C29A] hover:brightness-125 rounded-r-full transition-all cursor-pointer ${activeCategory === 'concept' ? 'brightness-125 shadow-[0_0_10px_#65C29A]' : ''}`}
              style={{ width: '10%' }}
              title="Click to filter Concepts"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            {[
              { id: 'all', label: 'All Vectors', color: '#A5C4F2' },
              { id: 'code', label: 'Code & Dev', color: '#6366F1' },
              { id: 'logic', label: 'Knowledge & Logic', color: '#E5A866' },
              { id: 'creative', label: 'Creative & Cinema', color: '#9875D8' },
              { id: 'concept', label: 'Concepts', color: '#65C29A' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleCategoryChipClick(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer border ${activeCategory === item.id
                  ? 'bg-white/10 text-white border-white/20 shadow-sm scale-105 font-medium'
                  : 'text-zinc-400 hover:text-white bg-transparent border-transparent hover:bg-white/5'
                  }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Query Input to project into 3D chamber */}
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
              placeholder="Type any search query to project onto 3D Vector Chamber..."
              className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#66C0F4] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCreateSearchTopic(quickPrompt, false)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#66C0F4]/50 text-white text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shadow-sm"
              title="Add this topic directly to the 3D Chamber"
            >
              <Plus className="w-3.5 h-3.5 text-[#66C0F4]" />
              <span>Project Vector</span>
            </button>

            <button
              type="submit"
              onClick={() => handleCreateSearchTopic(quickPrompt, true)}
              className="px-4 py-2 rounded-xl steam-button-primary text-white text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shadow-md"
              title="Index vector and launch conversation"
            >
              <span>Ask Chat</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* 2. 3D VECTOR PROJECTION CHAMBER // COGNITIVE SPACE       */}
      {/* ======================================================== */}
      <div className="space-y-3">
        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-2">
              <span className="text-[#66C0F4]">01 //</span>
              <Box className="w-3.5 h-3.5 text-[#66C0F4]" />
              <span>3D VECTOR PROJECTION CHAMBER // COGNITIVE SPACE</span>
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400 font-mono tracking-wider">
              ISOMETRIC 3-SURFACE LATENT ROOM
            </span>
          </div>

          {/* Chamber Controls */}
          <div className="flex flex-wrap items-center gap-2 font-mono">
            {/* Theme Toggle: Blueprint Pastel vs Cyber Obsidian */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px]">
              <button
                onClick={() => {
                  audioSynth.playClick(1050);
                  setChamberTheme('blueprint');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${chamberTheme === 'blueprint'
                  ? 'bg-[#4D62FE]/25 border border-[#4D62FE]/60 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
                  }`}
                title="Blueprint Room (Exact match to reference image)"
              >
                <Sun className="w-3 h-3 text-[#66C0F4]" />
                <span>Blueprint</span>
              </button>

              <button
                onClick={() => {
                  audioSynth.playClick(1150);
                  setChamberTheme('cyber');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${chamberTheme === 'cyber'
                  ? 'bg-[#66C0F4]/20 border border-[#66C0F4]/50 text-[#66C0F4] font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
                  }`}
                title="Cyber Obsidian Room"
              >
                <Moon className="w-3 h-3 text-[#818CF8]" />
                <span>Cyber Dark</span>
              </button>
            </div>

            {/* Reset Camera Button */}
            <button
              onClick={handleResetCamera}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-[11px] transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset 3D perspective to isometric corner view"
            >
              <Rotate3d className="w-3 h-3 text-[#66C0F4]" />
              <span>Reset Corner</span>
            </button>

            {/* Auto Orbit Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${isRotating
                ? 'bg-[#66C0F4]/20 border-[#66C0F4]/50 text-white font-medium'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
            >
              <span>{isRotating ? 'Pause Orbit' : 'Auto Orbit'}</span>
            </button>
          </div>
        </div>

        {/* Filter bar and Search Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl capsule-control text-xs font-mono">
            {[
              { id: 'all', label: 'All Vectors' },
              { id: 'code', label: 'Code & Dev' },
              { id: 'logic', label: 'Knowledge & Logic' },
              { id: 'creative', label: 'Creative & 35mm' },
              { id: 'concept', label: 'Concepts & Systems' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  audioSynth.playClick(1100);
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeCategory === cat.id
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
              placeholder="Filter vectors or press Enter to add..."
              className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#66C0F4] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Main 3D Canvas Box */}
        <div className="relative rounded-2xl bg-[#101822] border border-[#2A475E] overflow-hidden group shadow-[0_0_50px_rgba(10,16,24,0.8)]">
          {/* Instruction Pill */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-2 font-mono text-[10px] text-zinc-400 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#4D62FE] animate-ping" />
            <span className="text-[#66C0F4] font-semibold">3D Vector Chamber</span>
            <span>• Drag to rotate • Click paw cluster to view details</span>
          </div>

          {/* 3D Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
            className="w-full h-[620px] sm:h-[700px] cursor-grab active:cursor-grabbing block"
          />

          {/* Selected Node Detail Modal */}
          {selectedNode && (
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-[420px] z-30 animate-fadeIn pointer-events-auto">
              <div className="rounded-2xl bg-[#101822]/95 backdrop-blur-xl border border-[#2A475E] p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#4D62FE] shadow-[0_0_10px_#4D62FE] inline-block" />
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

                <p className="text-xs sm:text-sm text-zinc-300 font-light italic leading-relaxed">
                  "{selectedNode.prompt}"
                </p>

                <div className="grid grid-cols-2 gap-2.5 font-mono">
                  <div className="p-3 rounded-xl bg-[#171D25] border border-[#2A475E]/70 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">COSINE SIMILARITY</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {(selectedNode.similarity * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#171D25] border border-[#2A475E]/70 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">SURFACE PROJECTION</span>
                    <span className="text-[#66C0F4] font-mono text-xs">
                      [{selectedNode.x.toFixed(2)}, {selectedNode.y.toFixed(2)}, {selectedNode.z.toFixed(2)}]
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#4D62FE]/15 border border-[#4D62FE]/30 flex items-center gap-2 text-xs font-mono text-[#A5C4F2]">
                  <span>💡</span>
                  <span className="font-medium">{selectedNode.subLabel || 'Real User Vector'}</span>
                </div>

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
              <span className="w-2.5 h-2.5 rounded-full bg-[#4D62FE]" />
              <span>Triple-Dot Paw Clusters</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#28394E]" />
              <span>White Emblem Badge & Leader Line</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#28394E]" />
              <span>3D Corner Creases (Left / Right / Floor)</span>
            </span>
          </div>

          <span className="text-[11px] text-zinc-500">
            3D Vector Projection Chamber • Zero Dummy Data
          </span>
        </div>
      </div>

      {/* Edit Profile Modal */}
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
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 block uppercase">Profile Avatar Preset</label>
                <div className="flex items-center gap-3">
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileAvatar(preset)}
                      className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${profileAvatar === preset ? 'border-[#66C0F4] scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

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

      {/* Verified Credentials Modal */}
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
    </div>
  );
};
