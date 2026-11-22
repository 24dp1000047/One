import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Rotate3d,
  ArrowUpRight,
  Brain,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Edit3,
  Camera,
  Check,
  X,
  Plus,
  Sun,
  Moon,
  Target,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';

export interface VectorNode {
  id: string;
  label: string;
  category: 'metal' | 'rock' | 'folk' | 'prog' | 'code' | 'logic' | 'creative';
  prompt?: string;
  x: number; // 3D coordinates
  y: number;
  z: number;
  similarity?: number;
  distanceToQuery?: number;
  conversationId?: string;
  isCustom?: boolean;
}

// Built-in reference nodes exactly matching the reference image
const BASE_REFERENCE_NODES: VectorNode[] = [
  // Thrash / Heavy Metal cluster (Left of vertical axis, near query)
  { id: 'meta-1', label: 'Metallica', category: 'metal', x: -1.35, y: -0.30, z: 0.52 },
  { id: 'meta-2', label: 'Slayer', category: 'metal', x: -1.48, y: -0.58, z: 0.65 },
  { id: 'meta-3', label: 'Anthrax', category: 'metal', x: -1.18, y: -0.18, z: 0.72 },
  { id: 'meta-4', label: 'Black Sabbath', category: 'metal', x: -1.75, y: 1.35, z: 0.22 },
  { id: 'meta-5', label: 'Iron Maiden', category: 'metal', x: -2.05, y: 0.95, z: 0.28 },
  { id: 'meta-6', label: 'Van Halen', category: 'metal', x: -1.65, y: 0.42, z: 0.38 },

  // Left ambient red dots (unlabeled density from reference image)
  { id: 'amb-l1', label: 'Megadeth', category: 'metal', x: -2.15, y: 0.20, z: 0.30 },
  { id: 'amb-l2', label: 'Judas Priest', category: 'metal', x: -1.88, y: -0.05, z: 0.40 },
  { id: 'amb-l3', label: 'Pantera', category: 'metal', x: -1.45, y: 0.85, z: 0.25 },
  { id: 'amb-l4', label: 'Motörhead', category: 'metal', x: -1.25, y: 1.45, z: 0.18 },
  { id: 'amb-l5', label: 'Deep Purple', category: 'rock', x: -0.85, y: 1.58, z: 0.12 },
  { id: 'amb-l6', label: 'Led Zeppelin', category: 'rock', x: -0.92, y: 0.95, z: 0.32 },
  { id: 'amb-l7', label: 'Ozzy Osbourne', category: 'metal', x: -1.55, y: -0.12, z: 0.55 },
  { id: 'amb-l8', label: 'Dio', category: 'metal', x: -0.95, y: 0.48, z: 0.45 },
  { id: 'amb-l9', label: 'Accept', category: 'metal', x: -0.72, y: -0.10, z: 0.68 },
  { id: 'amb-l10', label: 'Testament', category: 'metal', x: -0.58, y: 0.72, z: 0.48 },
  { id: 'amb-l11', label: 'Kreator', category: 'metal', x: -0.45, y: 1.15, z: 0.35 },
  { id: 'amb-l12', label: 'Sepultura', category: 'metal', x: -0.38, y: 0.22, z: 0.60 },

  // Classic / Folk / Prog Rock cluster (Right of vertical axis)
  { id: 'meta-7', label: 'Peter, Paul & Mary', category: 'folk', x: 0.42, y: 1.62, z: 0.45 },
  { id: 'meta-8', label: 'Bob Dylan', category: 'folk', x: 0.82, y: 1.30, z: 0.58 },
  { id: 'meta-9', label: 'Genesis', category: 'prog', x: 0.88, y: -0.22, z: 1.15 },
  { id: 'meta-10', label: 'Psychedelic Furs', category: 'rock', x: 0.48, y: -0.45, z: 1.25 },
  { id: 'meta-11', label: 'Grateful Dead', category: 'rock', x: 1.38, y: -0.28, z: 1.55 },
  { id: 'meta-12', label: 'Phish', category: 'rock', x: 1.78, y: 0.08, z: 1.72 },

  // Right ambient red dots (unlabeled density from reference image)
  { id: 'amb-r1', label: 'The Byrds', category: 'folk', x: 0.32, y: 1.10, z: 0.65 },
  { id: 'amb-r2', label: 'Simon & Garfunkel', category: 'folk', x: 0.65, y: 0.88, z: 0.75 },
  { id: 'amb-r3', label: 'Joan Baez', category: 'folk', x: 0.25, y: 0.62, z: 0.85 },
  { id: 'amb-r4', label: 'Joni Mitchell', category: 'folk', x: 1.05, y: 1.05, z: 0.82 },
  { id: 'amb-r5', label: 'Crosby, Stills & Nash', category: 'folk', x: 1.45, y: 0.98, z: 0.92 },
  { id: 'amb-r6', label: 'Neil Young', category: 'folk', x: 1.62, y: 0.82, z: 1.10 },
  { id: 'amb-r7', label: 'Pink Floyd', category: 'prog', x: 1.18, y: 0.45, z: 1.20 },
  { id: 'amb-r8', label: 'Yes', category: 'prog', x: 1.42, y: 0.15, z: 1.42 },
  { id: 'amb-r9', label: 'King Crimson', category: 'prog', x: 0.92, y: 0.18, z: 1.30 },
  { id: 'amb-r10', label: 'Rush', category: 'prog', x: 0.68, y: 0.05, z: 1.18 },
  { id: 'amb-r11', label: 'The Doors', category: 'rock', x: 0.15, y: -0.15, z: 1.05 },
  { id: 'amb-r12', label: 'The Velvet Underground', category: 'rock', x: 1.45, y: -0.72, z: 1.85 },

  // Floor plane cluster (Rhombus ground plane)
  { id: 'meta-13', label: 'Dire Straits', category: 'rock', x: -0.38, y: -0.92, z: 1.48 },
  { id: 'meta-14', label: 'Eagles', category: 'rock', x: 0.25, y: -0.92, z: 2.05 },

  // Floor ambient red dots (unlabeled density from reference image)
  { id: 'amb-f1', label: 'Fleetwood Mac', category: 'rock', x: -1.25, y: -0.92, z: 0.75 },
  { id: 'amb-f2', label: 'Tom Petty', category: 'rock', x: -0.85, y: -0.92, z: 1.10 },
  { id: 'amb-f3', label: 'Bruce Springsteen', category: 'rock', x: -1.65, y: -0.92, z: 1.25 },
  { id: 'amb-f4', label: 'Steely Dan', category: 'rock', x: -0.15, y: -0.92, z: 2.35 },
  { id: 'amb-f5', label: 'Doobie Brothers', category: 'rock', x: -0.75, y: -0.92, z: 1.95 },
];

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

  // User profile modal states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(settings.name);
  const [profileHandle, setProfileHandle] = useState(settings.handle);
  const [profileBio, setProfileBio] = useState(settings.bio || '');
  const [profileAvatar, setProfileAvatar] = useState(settings.avatar);
  const [fastPassEnabled, setFastPassEnabled] = useState(true);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [energyBonusAnimation, setEnergyBonusAnimation] = useState(false);

  // Custom user queries added dynamically
  const [customUserNodes, setCustomUserNodes] = useState<VectorNode[]>(() => {
    try {
      const saved = localStorage.getItem('one_custom_vector_nodes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Query: exactly matching the reference image's QUERY: "thrash rock"
  const [activeQuery, setActiveQuery] = useState<string>('thrash rock');
  const [queryInput, setQueryInput] = useState<string>('');
  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number; z: number }>({
    x: -1.35,
    y: -0.38,
    z: 0.60,
  });

  // Visual Theme: 'light' matches the pure white canvas from reference image
  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');

  // Camera Orbit Orientation (exact isometric viewing angle matching reference image)
  const rotationRef = useRef({ rotX: 0.28, rotY: -0.785 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const [hoveredNode, setHoveredNode] = useState<VectorNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<VectorNode | null>(null);

  // Combine reference nodes + user conversation queries + custom user nodes
  const allNodes = useMemo(() => {
    const list: VectorNode[] = [...BASE_REFERENCE_NODES];

    // Merge custom added nodes
    customUserNodes.forEach((cn) => {
      if (!list.some((n) => n.id === cn.id || n.label.toLowerCase() === cn.label.toLowerCase())) {
        list.push(cn);
      }
    });

    // Merge real user queries from AI conversations
    conversations.forEach((conv, cIdx) => {
      const queries = conv.messages.filter((m) => m.role === 'user').map((m) => m.content);
      queries.forEach((qText, qIdx) => {
        const clean = qText.trim();
        if (!clean || list.some((n) => n.label.toLowerCase() === clean.toLowerCase())) return;

        let hash = 0;
        for (let i = 0; i < clean.length; i++) {
          hash = (hash << 5) - hash + clean.charCodeAt(i);
          hash |= 0;
        }
        hash = Math.abs(hash) + cIdx * 19 + qIdx * 37;

        // Spread nicely in 3D
        const angle = (hash % 360) * (Math.PI / 180);
        const radius = 0.8 + ((hash % 100) / 100) * 1.4;
        const yVal = -0.6 + (((hash >> 2) % 100) / 100) * 1.8;

        list.push({
          id: `conv-${conv.id}-${qIdx}`,
          label: clean.slice(0, 22),
          category: 'code',
          prompt: clean,
          x: Math.cos(angle) * radius,
          y: yVal,
          z: Math.sin(angle) * radius,
          conversationId: conv.id,
          isCustom: true,
        });
      });
    });

    return list;
  }, [conversations, customUserNodes]);

  // Compute Euclidean 3D distance from each node to current query point
  const nodesWithDistance = useMemo(() => {
    return allNodes.map((node) => {
      const dist = Math.hypot(node.x - queryPoint.x, node.y - queryPoint.y, node.z - queryPoint.z);
      return {
        ...node,
        distanceToQuery: dist,
        similarity: Math.max(0, 1 - dist / 3.0),
      };
    });
  }, [allNodes, queryPoint]);

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
    rotationRef.current.rotX = Math.max(-0.85, Math.min(0.85, rotationRef.current.rotX + dy * 0.006));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Reset 3D view to exact reference image orientation
  const handleResetCamera = () => {
    rotationRef.current = { rotX: 0.28, rotY: -0.785 };
    setZoomLevel(1.0);
    audioSynth.playClick(1200);
  };

  // 3D Canvas Projection & Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth || 900);
    let height = (canvas.height = canvas.clientHeight || 620);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Perspective Projection helper
    const project3D = (x: number, y: number, z: number, rotX: number, rotY: number) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const cameraDist = 3.4;
      const scale = (370 / (cameraDist + z2)) * zoomLevel;

      // Origin vertex positioned matching reference image (bottom-center)
      const originScreenX = width / 2;
      const originScreenY = height * 0.70;

      const screenX = originScreenX + x1 * scale * 1.35;
      const screenY = originScreenY - y2 * scale * 1.25;

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
      const isLight = canvasTheme === 'light';

      // ----------------------------------------------------
      // 1. BACKGROUND FILL (Pure clean white matching reference image)
      // ----------------------------------------------------
      ctx.fillStyle = isLight ? '#FFFFFF' : '#0B101A';
      ctx.fillRect(0, 0, width, height);

      // ----------------------------------------------------
      // 2. 3D RHOMBUS FLOOR PLANE
      // Bounded by origin (0,0,0), bottom-left axis, foreground corner, and bottom-right axis
      // ----------------------------------------------------
      const axisLen = 2.4;
      const pOrigin = project3D(0, 0, 0, rotX, rotY);
      const pLeftAxis = project3D(-axisLen, 0, 0, rotX, rotY);
      const pRightAxis = project3D(0, 0, axisLen, rotX, rotY);
      const pForeCorner = project3D(-axisLen, 0, axisLen, rotX, rotY);
      const pTopAxis = project3D(0, 2.25, 0, rotX, rotY);

      ctx.beginPath();
      ctx.moveTo(pOrigin.screenX, pOrigin.screenY);
      ctx.lineTo(pLeftAxis.screenX, pLeftAxis.screenY);
      ctx.lineTo(pForeCorner.screenX, pForeCorner.screenY);
      ctx.lineTo(pRightAxis.screenX, pRightAxis.screenY);
      ctx.closePath();

      // Soft light-blue shaded plane fill
      ctx.fillStyle = isLight ? 'rgba(235, 243, 254, 0.95)' : 'rgba(23, 37, 60, 0.65)';
      ctx.fill();

      // Subtle floor perimeter lines
      ctx.strokeStyle = isLight ? 'rgba(190, 214, 248, 0.70)' : 'rgba(59, 130, 246, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // ----------------------------------------------------
      // 3. THE 3 SOLID BLUE ARROW AXES (Exact match to reference image!)
      // - Vertical UP arrow
      // - Bottom-Left arrow
      // - Bottom-Right arrow
      // ----------------------------------------------------
      const drawBlueArrow = (from: typeof pOrigin, to: typeof pOrigin) => {
        ctx.beginPath();
        ctx.moveTo(from.screenX, from.screenY);
        ctx.lineTo(to.screenX, to.screenY);
        ctx.strokeStyle = '#3B82F6'; // Royal Sky Blue matching reference
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Solid triangular arrowhead at the end
        const angle = Math.atan2(to.screenY - from.screenY, to.screenX - from.screenX);
        const headLen = 13;
        ctx.beginPath();
        ctx.moveTo(to.screenX, to.screenY);
        ctx.lineTo(
          to.screenX - headLen * Math.cos(angle - Math.PI / 6),
          to.screenY - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          to.screenX - headLen * Math.cos(angle + Math.PI / 6),
          to.screenY - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
      };

      // Draw all 3 coordinate axes
      drawBlueArrow(pOrigin, pTopAxis); // Vertical Up
      drawBlueArrow(pOrigin, pLeftAxis); // Bottom Left
      drawBlueArrow(pOrigin, pRightAxis); // Bottom Right

      // ----------------------------------------------------
      // 4. CONCENTRIC GREEN RADAR SIMILARITY RINGS (QUERY TARGET!)
      // Exact match to the reference image: QUERY: "thrash rock"
      // ----------------------------------------------------
      const pQuery = project3D(queryPoint.x, queryPoint.y, queryPoint.z, rotX, rotY);

      // Subtle breathing pulse for radar effect
      const pulse = Math.sin(time * 0.003) * 2.5;
      const rOuter = 64 + pulse;
      const rMid = 44 + pulse * 0.7;
      const rInner = 25 + pulse * 0.4;

      // Outer green ring
      ctx.beginPath();
      ctx.arc(pQuery.screenX, pQuery.screenY, rOuter, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? 'rgba(165, 214, 167, 0.28)' : 'rgba(76, 175, 80, 0.18)';
      ctx.fill();

      // Middle green ring
      ctx.beginPath();
      ctx.arc(pQuery.screenX, pQuery.screenY, rMid, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? 'rgba(165, 214, 167, 0.42)' : 'rgba(76, 175, 80, 0.30)';
      ctx.fill();

      // Inner green ring
      ctx.beginPath();
      ctx.arc(pQuery.screenX, pQuery.screenY, rInner, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? 'rgba(165, 214, 167, 0.58)' : 'rgba(76, 175, 80, 0.45)';
      ctx.fill();

      // Central dark green query anchor dot
      ctx.beginPath();
      ctx.arc(pQuery.screenX, pQuery.screenY, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#225426';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Leader line connecting query dot to its label: QUERY: "<query>"
      const queryLabelX = pQuery.screenX + 42;
      const queryLabelY = pQuery.screenY + 12;

      ctx.beginPath();
      ctx.moveTo(pQuery.screenX, pQuery.screenY);
      ctx.lineTo(queryLabelX - 6, queryLabelY);
      ctx.strokeStyle = '#225426';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // QUERY label text
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#225426';
      ctx.textAlign = 'left';
      ctx.fillText('QUERY:', queryLabelX, queryLabelY - 2);

      ctx.font = 'italic 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#225426';
      ctx.fillText(`"${activeQuery}"`, queryLabelX, queryLabelY + 12);

      // ----------------------------------------------------
      // 5. 3D VIBRANT RED VECTOR SPHERES & HORIZONTAL LEADER LINES
      // ----------------------------------------------------
      const projectedNodes = nodesWithDistance.map((node) => {
        const proj = project3D(node.x, node.y, node.z, rotX, rotY);
        return {
          node,
          proj,
          depth: proj.depth,
        };
      });

      // Sort back-to-front
      projectedNodes.sort((a, b) => b.depth - a.depth);

      // Render red dots
      projectedNodes.forEach(({ node, proj }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;
        const isNearQuery = (node.distanceToQuery || 99) < 0.65;

        const dotR = (isHovered || isSelected ? 8.5 : 7.0) * (proj.scale / 120);

        // Hover aura
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(proj.screenX, proj.screenY, dotR * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(217, 37, 37, 0.25)';
          ctx.fill();
        }

        // Vibrant Red Sphere
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, dotR, 0, Math.PI * 2);
        ctx.fillStyle = '#D92525'; // Vibrant crimson red matching reference
        ctx.fill();

        // 3D Specular highlight on top-left of circle
        ctx.beginPath();
        ctx.arc(proj.screenX - dotR * 0.32, proj.screenY - dotR * 0.32, dotR * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fill();

        // Subtle dark rim outline
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // ----------------------------------------------------
      // 6. HORIZONTAL LEADER LINES AND LABELS (Exact match to reference image!)
      // Specifically labeled nodes in the reference image:
      // Left: Black Sabbath, Iron Maiden, Van Halen, Metallica, Slayer, Anthrax
      // Right: Peter, Paul & Mary, Bob Dylan, Genesis, Psychedelic Furs, Grateful Dead, Phish
      // Floor: Dire Straits, Eagles
      // Plus any user-custom nodes or hovered/selected node
      // ----------------------------------------------------
      const explicitlyLabeledIds = new Set([
        'meta-1', // Metallica
        'meta-2', // Slayer
        'meta-3', // Anthrax
        'meta-4', // Black Sabbath
        'meta-5', // Iron Maiden
        'meta-6', // Van Halen
        'meta-7', // Peter, Paul & Mary
        'meta-8', // Bob Dylan
        'meta-9', // Genesis
        'meta-10', // Psychedelic Furs
        'meta-11', // Grateful Dead
        'meta-12', // Phish
        'meta-13', // Dire Straits
        'meta-14', // Eagles
      ]);

      projectedNodes.forEach(({ node, proj }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;
        const shouldLabel =
          explicitlyLabeledIds.has(node.id) ||
          node.isCustom ||
          isHovered ||
          isSelected;

        if (!shouldLabel) return;

        const isLeft = proj.screenX < width / 2;
        const lineLen = 32;
        const lineEndX = isLeft ? proj.screenX - lineLen : proj.screenX + lineLen;
        const lineEndY = proj.screenY;

        // Clean thin horizontal leader line
        ctx.beginPath();
        ctx.moveTo(proj.screenX, proj.screenY);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.strokeStyle = isHovered || isSelected ? '#1E293B' : (isLight ? '#333333' : '#94A3B8');
        ctx.lineWidth = isHovered || isSelected ? 1.6 : 1.1;
        ctx.stroke();

        // Small origin anchor dot at leader line end
        ctx.beginPath();
        ctx.arc(lineEndX, lineEndY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? '#333333' : '#CBD5E1';
        ctx.fill();

        // Label text
        ctx.font = `${isHovered || isSelected ? 'bold 12px' : '11px'} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = isLight ? '#0F172A' : '#F1F5F9';
        ctx.textAlign = isLeft ? 'right' : 'left';
        const textOffsetX = isLeft ? lineEndX - 6 : lineEndX + 6;
        ctx.fillText(node.label, textOffsetX, lineEndY + 3.5);
      });

      // ----------------------------------------------------
      // 7. HOVER / SELECTION TOOLTIP
      // ----------------------------------------------------
      if (hoveredNode || selectedNode) {
        const activeNode = (hoveredNode || selectedNode)!;
        const proj = project3D(activeNode.x, activeNode.y, activeNode.z, rotX, rotY);

        const tipW = 220;
        const tipH = 58;
        let tipX = proj.screenX - tipW / 2;
        let tipY = proj.screenY - tipH - 18;

        if (tipX < 15) tipX = 15;
        if (tipX + tipW > width - 15) tipX = width - tipW - 15;
        if (tipY < 15) tipY = proj.screenY + 20;

        ctx.beginPath();
        ctx.roundRect(tipX, tipY, tipW, tipH, 6);
        ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.94)' : 'rgba(23, 37, 60, 0.96)';
        ctx.fill();
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.fillText(activeNode.label, tipX + 10, tipY + 18);

        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#60A5FA';
        const dist = activeNode.distanceToQuery !== undefined ? activeNode.distanceToQuery.toFixed(2) : '0.00';
        ctx.fillText(`Distance to Query: ${dist}`, tipX + 10, tipY + 34);

        ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('Click to set as active query or ask AI', tipX + 10, tipY + 48);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [nodesWithDistance, hoveredNode, selectedNode, isRotating, zoomLevel, canvasTheme, activeQuery, queryPoint]);

  // Click on canvas to select node or update Query point
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

    for (const node of nodesWithDistance) {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = node.x * cosY - node.z * sinY;
      const z1 = node.x * sinY + node.z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = node.y * cosX - z1 * sinX;
      const z2 = node.y * sinX + z1 * cosX;

      const cameraDist = 3.4;
      const scale = (370 / (cameraDist + z2)) * zoomLevel;
      const screenX = width / 2 + x1 * scale * 1.35;
      const screenY = height * 0.70 - y2 * scale * 1.25;

      const dist = Math.hypot(mouseX - screenX, mouseY - screenY);
      if (dist < 22) {
        audioSynth.playClick(1400);
        setSelectedNode(node);
        setActiveQuery(node.label);
        setQueryPoint({ x: node.x, y: node.y, z: node.z });
        addToast({
          type: 'info',
          title: `Query: "${node.label}"`,
          message: 'Vector space centered on this topic.',
        });
        return;
      }
    }

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

    const rotX = rotationRef.current.rotX;
    const rotY = rotationRef.current.rotY;
    const width = canvas.width;
    const height = canvas.height;

    let found: VectorNode | null = null;
    for (const node of nodesWithDistance) {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = node.x * cosY - node.z * sinY;
      const z1 = node.x * sinY + node.z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = node.y * cosX - z1 * sinX;
      const z2 = node.y * sinX + z1 * cosX;

      const cameraDist = 3.4;
      const scale = (370 / (cameraDist + z2)) * zoomLevel;
      const screenX = width / 2 + x1 * scale * 1.35;
      const screenY = height * 0.70 - y2 * scale * 1.25;

      const dist = Math.hypot(mouseX - screenX, mouseY - screenY);
      if (dist < 20) {
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

  // Submit new query to move the green radar in vector space
  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = queryInput.trim();
    if (!clean) return;

    audioSynth.playWhoosh();
    setActiveQuery(clean);

    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash << 5) - hash + clean.charCodeAt(i);
      hash |= 0;
    }
    hash = Math.abs(hash);

    // Compute new 3D query location
    const angle = (hash % 360) * (Math.PI / 180);
    const radius = 0.9 + ((hash % 100) / 100) * 1.1;
    const newX = Math.cos(angle) * radius;
    const newY = -0.6 + (((hash >> 2) % 100) / 100) * 1.6;
    const newZ = Math.sin(angle) * radius;

    setQueryPoint({ x: newX, y: newY, z: newZ });

    // Also persist as a user vector node
    const newNode: VectorNode = {
      id: `query-node-${Date.now()}`,
      label: clean,
      category: 'rock',
      prompt: clean,
      x: newX,
      y: newY,
      z: newZ,
      isCustom: true,
    };
    const updated = [newNode, ...customUserNodes];
    setCustomUserNodes(updated);
    try {
      localStorage.setItem('one_custom_vector_nodes', JSON.stringify(updated));
    } catch { }

    addToast({
      type: 'success',
      title: `Query: "${clean}"`,
      message: 'Green similarity radar repositioned in 3D vector space.',
    });

    setQueryInput('');
  };

  return (
    <div
      ref={containerRef}
      className="rounded-3xl bg-gradient-to-b from-[#1B2838]/85 to-[#171A21]/90 backdrop-blur-md border border-[#2A475E] p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Background Steam Auras */}
      <div className="absolute -top-24 right-1/4 w-[550px] h-[550px] bg-[#66C0F4]/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-1/2 -left-20 w-[500px] h-[500px] bg-[#2A475E]/30 rounded-full blur-3xl pointer-events-none animate-pulse-subtle [animation-delay:3s]" />

      {/* ======================================================== */}
      {/* 1. TOP TOOLBAR & CONTROLS                                */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#66C0F4]">01 //</span>
            <Target className="w-4 h-4 text-[#3B82F6]" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-sans">
              3D Latent Vector Space Embedding
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-0.5">
            3-Axis Projection • Query Radius Clustering • Cosine Proximity
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Light / Dark Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/[0.04] border border-white/10">
            <button
              onClick={() => {
                audioSynth.playClick(1100);
                setCanvasTheme('light');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${canvasTheme === 'light'
                ? 'bg-white text-zinc-900 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
                }`}
              title="Light Mode (Exact match to reference image)"
            >
              <Sun className="w-3 h-3 text-amber-500" />
              <span>Light Canvas</span>
            </button>
            <button
              onClick={() => {
                audioSynth.playClick(1000);
                setCanvasTheme('dark');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${canvasTheme === 'dark'
                ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/50 text-[#60A5FA] font-semibold'
                : 'text-zinc-400 hover:text-white'
                }`}
              title="Dark Mode"
            >
              <Moon className="w-3 h-3" />
              <span>Dark Canvas</span>
            </button>
          </div>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs transition-all cursor-pointer flex items-center gap-1.5"
            title="Reset to default isometric viewing perspective"
          >
            <Rotate3d className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Reset View</span>
          </button>

          {/* Auto Orbit */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-1.5 ${isRotating
              ? 'bg-[#3B82F6]/25 border-[#3B82F6]/60 text-white font-medium'
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
          >
            <span>{isRotating ? 'Pause Orbit' : 'Auto Orbit'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. QUERY INPUT BAR                                       */}
      {/* ======================================================== */}
      <form onSubmit={handleQuerySubmit} className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#3B82F6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder='Enter any query to position radar (e.g. "thrash rock", "synthesizer", "deep learning")...'
            className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#3B82F6] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none font-sans"
          />
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { label: 'Thrash Rock', query: 'thrash rock', pt: { x: -1.35, y: -0.38, z: 0.60 } },
            { label: 'Folk & Classics', query: 'folk rock', pt: { x: 0.65, y: 1.15, z: 0.65 } },
            { label: 'Floor Beats', query: 'classic rock', pt: { x: -0.15, y: -0.92, z: 1.65 } },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                audioSynth.playClick(1200);
                setActiveQuery(preset.query);
                setQueryPoint(preset.pt);
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition-all cursor-pointer ${activeQuery.toLowerCase() === preset.query.toLowerCase()
                ? 'bg-[#3B82F6]/20 border-[#3B82F6]/50 text-[#60A5FA] font-medium'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shadow-md shrink-0"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Apply Query</span>
        </button>
      </form>

      {/* ======================================================== */}
      {/* 3. 3D VECTOR SPACE CANVAS                                */}
      {/* ======================================================== */}
      <div className="relative rounded-2xl border border-[#2A475E] overflow-hidden shadow-2xl bg-white">
        {/* Top Floating Helper Pill */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-2 font-mono text-[10px] text-zinc-700 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200 shadow-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#D92525]" />
          <span className="font-semibold text-zinc-900">3D Vector Space</span>
          <span>• Active Query: <strong className="text-[#225426]">"{activeQuery}"</strong></span>
          <span>• Drag to rotate</span>
        </div>

        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          className="w-full h-[620px] sm:h-[700px] cursor-grab active:cursor-grabbing block"
        />

        {/* Selected Node Details Modal */}
        {selectedNode && (
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-[380px] z-30 animate-fadeIn pointer-events-auto">
            <div className="rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200 p-5 shadow-2xl space-y-3.5 text-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#D92525] shadow-sm inline-block" />
                  <h3 className="font-bold text-zinc-900 text-base font-sans tracking-wide">
                    {selectedNode.label}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block">Distance to Query</span>
                  <span className="text-[#225426] font-bold text-sm">
                    {selectedNode.distanceToQuery ? selectedNode.distanceToQuery.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block">3D Coordinates</span>
                  <span className="text-[#3B82F6] text-xs">
                    [{selectedNode.x.toFixed(2)}, {selectedNode.y.toFixed(2)}, {selectedNode.z.toFixed(2)}]
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedNode.conversationId) {
                    setActiveConversationId(selectedNode.conversationId);
                    navigate('/chat');
                  } else {
                    const convId = createConversation(`Deep analysis of ${selectedNode.label} and vector embeddings`);
                    setActiveConversationId(convId);
                    navigate('/chat');
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Ask AI About {selectedNode.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#3B82F6]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. BOTTOM LEGEND                                         */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400 pt-2 border-t border-[#2A475E]/70">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D92525]" />
            <span className="text-zinc-300">Vector Embeddings (Red Dots)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#3B82F6]" />
            <span className="text-zinc-300">3-Axis Coordinate Arrows</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#225426]" />
            <span className="text-zinc-300">Active Query with Concentric Green Radar Rings</span>
          </span>
        </div>

        <span className="text-[11px] text-zinc-500">
          Exact Implementation of 3D Vector Space Graph
        </span>
      </div>
    </div>
  );
};
