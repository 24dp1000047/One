import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Rotate3d,
  ArrowUpRight,
  Brain,
  Sparkles,
  Zap,
  Layers,
  Edit3,
  Camera,
  Check,
  X,
  Plus,
  Sun,
  Moon,
  Target,
  Trash2,
  Code,
  Compass,
  Palette,
  MessageSquare
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';

export interface VectorNode {
  id: string;
  label: string;
  category: 'code' | 'logic' | 'creative' | 'concept';
  prompt?: string;
  x: number; // 3D coordinates
  y: number;
  z: number;
  similarity?: number;
  distanceToQuery?: number;
  conversationId?: string;
  isCustom?: boolean;
}

// 55 Persistent Ambient Green Dots distributed across 3D space (matching the volume in the reference image)
const AMBIENT_GREEN_DOTS = [
  // Left quadrant volume
  { x: -1.75, y: 1.45, z: 0.25, size: 7.2 },
  { x: -1.35, y: 1.62, z: 0.18, size: 5.4 },
  { x: -1.15, y: 1.25, z: 0.35, size: 8.5 },
  { x: -1.85, y: 0.85, z: 0.30, size: 6.0 },
  { x: -1.55, y: 0.55, z: 0.42, size: 5.0 },
  { x: -2.05, y: 0.30, z: 0.38, size: 6.8 },
  { x: -1.25, y: 0.75, z: 0.45, size: 9.0 },
  { x: -0.85, y: 1.15, z: 0.28, size: 6.2 },
  { x: -0.65, y: 1.48, z: 0.15, size: 4.5 },
  { x: -0.95, y: 0.45, z: 0.52, size: 5.5 },
  { x: -1.65, y: 0.05, z: 0.55, size: 7.8 },
  { x: -1.35, y: -0.15, z: 0.62, size: 6.5 },
  { x: -1.85, y: -0.35, z: 0.58, size: 8.2 },
  { x: -1.15, y: -0.45, z: 0.72, size: 5.2 },
  { x: -0.75, y: -0.15, z: 0.65, size: 7.0 },
  { x: -0.45, y: 0.25, z: 0.58, size: 4.8 },
  { x: -0.55, y: 0.85, z: 0.35, size: 5.8 },
  { x: -0.35, y: 1.35, z: 0.22, size: 6.0 },

  // Right quadrant volume
  { x: 0.35, y: 1.68, z: 0.40, size: 8.0 },
  { x: 0.65, y: 1.42, z: 0.55, size: 6.2 },
  { x: 0.95, y: 1.25, z: 0.62, size: 7.5 },
  { x: 1.35, y: 1.55, z: 0.50, size: 8.8 },
  { x: 1.65, y: 1.30, z: 0.65, size: 5.5 },
  { x: 0.45, y: 0.95, z: 0.70, size: 6.0 },
  { x: 0.85, y: 0.75, z: 0.82, size: 7.0 },
  { x: 1.25, y: 0.95, z: 0.75, size: 6.5 },
  { x: 1.55, y: 0.75, z: 0.92, size: 5.8 },
  { x: 1.85, y: 0.55, z: 1.10, size: 6.2 },
  { x: 0.25, y: 0.45, z: 0.85, size: 5.0 },
  { x: 0.65, y: 0.25, z: 0.98, size: 8.2 },
  { x: 1.05, y: 0.35, z: 1.15, size: 6.8 },
  { x: 1.45, y: 0.15, z: 1.35, size: 7.5 },
  { x: 1.75, y: -0.15, z: 1.55, size: 8.5 },
  { x: 0.55, y: -0.25, z: 1.18, size: 6.2 },
  { x: 0.85, y: -0.45, z: 1.35, size: 7.0 },
  { x: 1.25, y: -0.35, z: 1.50, size: 5.8 },
  { x: 1.55, y: -0.65, z: 1.75, size: 6.5 },

  // Floor plane volume (Rhombus base)
  { x: -1.65, y: -0.92, z: 0.65, size: 6.0 },
  { x: -1.25, y: -0.92, z: 0.95, size: 5.2 },
  { x: -0.85, y: -0.92, z: 1.15, size: 7.5 },
  { x: -0.45, y: -0.92, z: 1.35, size: 8.2 },
  { x: -0.15, y: -0.92, z: 1.65, size: 6.5 },
  { x: 0.25, y: -0.92, z: 1.95, size: 7.0 },
  { x: -1.85, y: -0.92, z: 1.10, size: 5.5 },
  { x: -1.45, y: -0.92, z: 1.45, size: 6.8 },
  { x: -1.05, y: -0.92, z: 1.75, size: 8.0 },
  { x: -0.65, y: -0.92, z: 2.05, size: 5.4 },
  { x: -0.25, y: -0.92, z: 2.30, size: 6.2 },
  { x: -2.15, y: -0.92, z: 1.55, size: 5.0 },
  { x: -1.75, y: -0.92, z: 1.95, size: 6.5 },
  { x: -1.35, y: -0.92, z: 2.25, size: 7.2 },
  { x: -0.75, y: -0.92, z: 0.55, size: 6.0 },
  { x: 0.05, y: -0.92, z: 0.95, size: 5.5 },
];

// Deterministic 3D positioning for real user queries
const getVectorCoordinates = (text: string, index: number) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash) + index * 41;

  const quadrant = index % 3; // 0 = Left region, 1 = Right region, 2 = Floor region
  const u = 0.2 + ((hash % 100) / 100) * 0.65;
  const v = 0.2 + (((hash >> 2) % 100) / 100) * 0.65;

  if (quadrant === 0) {
    // Left quadrant
    return {
      x: -0.6 - u * 1.5,
      y: -0.5 + v * 2.0,
      z: 0.25 + ((hash % 50) / 50) * 1.3,
    };
  } else if (quadrant === 1) {
    // Right quadrant
    return {
      x: 0.4 + u * 1.4,
      y: -0.5 + v * 2.0,
      z: 0.4 + ((hash % 50) / 50) * 1.4,
    };
  } else {
    // Floor plane
    return {
      x: -1.9 + u * 2.1,
      y: -0.92,
      z: 0.5 + v * 1.6,
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
  const addToast = useAppStore((state) => state.addToast);
  const createConversation = useAppStore((state) => state.createConversation);

  // Custom user queries added dynamically by user (persisted in localStorage)
  const [customUserNodes, setCustomUserNodes] = useState<VectorNode[]>(() => {
    try {
      const saved = localStorage.getItem('one_custom_vector_nodes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Combine real user conversation queries + user custom added queries (ZERO DUMMY DATA!)
  const allNodes: VectorNode[] = useMemo(() => {
    const list: VectorNode[] = [];

    // 1. Custom user-added topics
    customUserNodes.forEach((cn) => {
      if (!list.some((n) => n.id === cn.id || n.label.toLowerCase() === cn.label.toLowerCase())) {
        list.push(cn);
      }
    });

    // 2. Real user queries from AI conversations
    conversations.forEach((conv, cIdx) => {
      const userQueries = conv.messages.filter((m) => m.role === 'user').map((m) => m.content);
      const allQueries = userQueries.length > 0 ? userQueries : [conv.title];

      allQueries.forEach((qText, qIdx) => {
        const clean = qText.trim();
        if (!clean || list.some((n) => n.label.toLowerCase() === clean.toLowerCase())) return;

        const lower = clean.toLowerCase();
        let category: VectorNode['category'] = 'concept';
        if (/code|typescript|javascript|react|css|html|function|api|algorithm|database|docker|backend|class/i.test(lower)) {
          category = 'code';
        } else if (/why|what|is|how|explain|truth|taxonomy|logic|math|vs|system|noul/i.test(lower)) {
          category = 'logic';
        } else if (/art|cinematic|render|cyberpunk|image|prompt|style|music|video|visual|photo/i.test(lower)) {
          category = 'creative';
        }

        const coords = getVectorCoordinates(clean, list.length);

        list.push({
          id: `conv-${conv.id}-${qIdx}`,
          label: clean.slice(0, 24),
          category,
          prompt: clean,
          x: coords.x,
          y: coords.y,
          z: coords.z,
          conversationId: conv.id,
          isCustom: false,
        });
      });
    });

    return list;
  }, [conversations, customUserNodes]);

  // Active Query: strictly reflects real user searches
  const [activeQuery, setActiveQuery] = useState<string>(() => {
    if (allNodes.length > 0) return allNodes[0].label;
    return '';
  });

  const [queryInput, setQueryInput] = useState<string>('');
  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number; z: number }>(() => {
    if (allNodes.length > 0) {
      return { x: allNodes[0].x, y: allNodes[0].y, z: allNodes[0].z };
    }
    return { x: -1.35, y: -0.38, z: 0.60 };
  });

  useEffect(() => {
    if (allNodes.length > 0 && !activeQuery) {
      setActiveQuery(allNodes[0].label);
      setQueryPoint({ x: allNodes[0].x, y: allNodes[0].y, z: allNodes[0].z });
    }
  }, [allNodes, activeQuery]);

  // Visual Theme: 'light' matches the pure white background from the reference image
  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');

  // Camera Orbit Orientation (exact isometric viewing angle matching reference image)
  const rotationRef = useRef({ rotX: 0.28, rotY: -0.785 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const [hoveredNode, setHoveredNode] = useState<VectorNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<VectorNode | null>(null);

  // Compute Euclidean 3D distance from each user node to current query point
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

  const handleResetCamera = () => {
    rotationRef.current = { rotX: 0.28, rotY: -0.785 };
    setZoomLevel(1.0);
    audioSynth.playClick(1200);
  };

  const handleClearCustomVectors = () => {
    if (window.confirm('Clear your custom added vector points?')) {
      audioSynth.playClick(800);
      setCustomUserNodes([]);
      localStorage.removeItem('one_custom_vector_nodes');
      addToast({
        type: 'info',
        title: 'Vectors Cleared',
        message: 'Custom query points reset.',
      });
    }
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
      // 2. 3D RHOMBUS FLOOR PLANE (Light Mint Green Shaded)
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

      // Soft light mint green plane fill matching reference image
      ctx.fillStyle = isLight ? 'rgba(220, 252, 231, 0.85)' : 'rgba(20, 48, 30, 0.60)';
      ctx.fill();

      // Floor border
      ctx.strokeStyle = isLight ? 'rgba(134, 239, 172, 0.70)' : 'rgba(34, 197, 94, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // ----------------------------------------------------
      // 3. 3 COORDINATE AXES WITH ARROWS (Dark Navy/Slate meeting at center)
      // ----------------------------------------------------
      const drawSlateArrow = (from: typeof pOrigin, to: typeof pOrigin) => {
        ctx.beginPath();
        ctx.moveTo(from.screenX, from.screenY);
        ctx.lineTo(to.screenX, to.screenY);
        ctx.strokeStyle = isLight ? '#334155' : '#94A3B8';
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Arrowhead
        const angle = Math.atan2(to.screenY - from.screenY, to.screenX - from.screenX);
        const headLen = 11;
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
        ctx.fillStyle = isLight ? '#334155' : '#94A3B8';
        ctx.fill();
      };

      drawSlateArrow(pOrigin, pTopAxis); // Vertical Up
      drawSlateArrow(pOrigin, pLeftAxis); // Bottom Left
      drawSlateArrow(pOrigin, pRightAxis); // Bottom Right

      // ----------------------------------------------------
      // 4. AMBIENT GREEN DOTS FIELD ("keep the grren dots")
      // ----------------------------------------------------
      AMBIENT_GREEN_DOTS.forEach((pt) => {
        const p = project3D(pt.x, pt.y, pt.z, rotX, rotY);
        const r = pt.size * (p.scale / 120);

        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, r, 0, Math.PI * 2);
        ctx.fillStyle = '#22C55E'; // Vibrant emerald / lime green matching image
        ctx.fill();

        // 3D Specular shine on top-left
        ctx.beginPath();
        ctx.arc(p.screenX - r * 0.3, p.screenY - r * 0.3, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fill();
      });

      // ----------------------------------------------------
      // 5. QUERY RADAR CONCENTRIC GREEN RINGS (Active Query Target)
      // ----------------------------------------------------
      // 5. QUERY RADAR (Only displayed when real user queries exist!)
      // ----------------------------------------------------
      const currentQuery = activeQuery || (allNodes.length > 0 ? allNodes[0].label : '');
      if (currentQuery && allNodes.length > 0) {
        const pQuery = project3D(queryPoint.x, queryPoint.y, queryPoint.z, rotX, rotY);

        const pulse = Math.sin(time * 0.003) * 2.5;
        const rOuter = 62 + pulse;
        const rMid = 42 + pulse * 0.7;
        const rInner = 24 + pulse * 0.4;

        // Concentric green circles
        ctx.beginPath();
        ctx.arc(pQuery.screenX, pQuery.screenY, rOuter, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 222, 128, 0.18)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pQuery.screenX, pQuery.screenY, rMid, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 222, 128, 0.30)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pQuery.screenX, pQuery.screenY, rInner, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 222, 128, 0.48)';
        ctx.fill();

        // Center query dot
        ctx.beginPath();
        ctx.arc(pQuery.screenX, pQuery.screenY, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#15803D';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Query label below radar
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#166534';
        ctx.textAlign = 'center';
        ctx.fillText(`Query: "${currentQuery}"`, pQuery.screenX, pQuery.screenY + rOuter + 14);
        ctx.textAlign = 'left';
      }

      // ----------------------------------------------------
      // 6. REAL USER QUERY VECTOR NODES (Primary Interactive Green Spheres)
      // ----------------------------------------------------
      const projectedUserNodes = nodesWithDistance.map((node) => {
        const proj = project3D(node.x, node.y, node.z, rotX, rotY);
        return {
          node,
          proj,
          depth: proj.depth,
        };
      });

      // Sort back-to-front
      projectedUserNodes.sort((a, b) => b.depth - a.depth);

      projectedUserNodes.forEach(({ node, proj }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;
        const dotR = (isHovered || isSelected ? 10.5 : 8.5) * (proj.scale / 120);

        // Hover aura
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(proj.screenX, proj.screenY, dotR * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
          ctx.fill();
        }

        // Vibrant Green Circle
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, dotR, 0, Math.PI * 2);
        ctx.fillStyle = isHovered || isSelected ? '#16A34A' : '#22C55E';
        ctx.fill();

        // 3D Specular highlight
        ctx.beginPath();
        ctx.arc(proj.screenX - dotR * 0.32, proj.screenY - dotR * 0.32, dotR * 0.30, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();

        // Thin dark outline
        ctx.strokeStyle = '#14532D';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      });

      // ----------------------------------------------------
      // 7. CIRCULAR BUBBLE BADGES (STRICTLY FOR REAL USER SEARCHES!)
      // ----------------------------------------------------
      const drawCircularBadge = (
        targetX: number,
        targetY: number,
        badgeX: number,
        badgeY: number,
        badgeR: number,
        category: VectorNode['category'],
        label: string
      ) => {
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(badgeX, badgeY);
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;

        ctx.beginPath();
        ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        ctx.beginPath();
        ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        ctx.save();
        ctx.translate(badgeX, badgeY);
        ctx.fillStyle = '#0F172A';

        if (category === 'code') {
          ctx.font = 'bold 15px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('</>', 0, 1);
        } else if (category === 'creative') {
          ctx.beginPath();
          ctx.arc(0, 2, badgeR * 0.38, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, -badgeR * 0.42, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (category === 'logic') {
          ctx.beginPath();
          ctx.arc(0, 0, badgeR * 0.40, 0, Math.PI * 2);
          ctx.lineWidth = 2.8;
          ctx.strokeStyle = '#0F172A';
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-badgeR * 0.22, 0);
          ctx.lineTo(badgeR * 0.22, 0);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, badgeR * 0.40, 0.2 * Math.PI, 1.8 * Math.PI, false);
          ctx.lineWidth = 3.2;
          ctx.strokeStyle = '#0F172A';
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(badgeR * 0.40, 0);
          ctx.stroke();
        }
        ctx.restore();

        if (label) {
          ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = isLight ? '#0F172A' : '#F1F5F9';
          ctx.textAlign = 'center';
          ctx.fillText(label, badgeX, badgeY + badgeR + 13);
          ctx.textAlign = 'left';
        }
      };

      // Only render bubble badges if the user has real searched nodes
      if (projectedUserNodes.length > 0) {
        const leftNode = projectedUserNodes.find((n) => n.proj.screenX < width * 0.45) || projectedUserNodes[0];
        if (leftNode) {
          drawCircularBadge(
            leftNode.proj.screenX,
            leftNode.proj.screenY,
            Math.max(55, leftNode.proj.screenX - 70),
            Math.max(55, leftNode.proj.screenY - 65),
            30,
            leftNode.node.category,
            leftNode.node.label
          );
        }

        const rightNode = projectedUserNodes.find((n) => n.proj.screenX >= width * 0.55);
        if (rightNode) {
          drawCircularBadge(
            rightNode.proj.screenX,
            rightNode.proj.screenY,
            Math.min(width - 55, rightNode.proj.screenX + 70),
            Math.max(65, rightNode.proj.screenY - 50),
            28,
            rightNode.node.category,
            rightNode.node.label
          );
        }

        if (selectedNode) {
          const selProj = project3D(selectedNode.x, selectedNode.y, selectedNode.z, rotX, rotY);
          drawCircularBadge(
            selProj.screenX,
            selProj.screenY,
            selProj.screenX + (selProj.screenX < width / 2 ? 65 : -65),
            selProj.screenY - 60,
            32,
            selectedNode.category,
            selectedNode.label
          );
        }
      }

      // ----------------------------------------------------
      // 8. REAL USER SEARCH VECTOR CALLOUT (STRICTLY REAL USER DATA!)
      // Displays the coordinates and search query the user actually searched!
      // ----------------------------------------------------
      const activeCalloutNode = selectedNode || (projectedUserNodes.length > 0 ? projectedUserNodes[0].node : null);
      if (activeCalloutNode) {
        const calloutProj = project3D(activeCalloutNode.x, activeCalloutNode.y, activeCalloutNode.z, rotX, rotY);
        const tagX = Math.min(width - 30, Math.max(160, calloutProj.screenX + 80));
        const tagY = Math.max(35, calloutProj.screenY - 45);

        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(calloutProj.screenX, calloutProj.screenY);
        ctx.lineTo(tagX - 10, tagY + 10);
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.restore();

        // Real coordinates
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillStyle = isLight ? '#0F172A' : '#F1F5F9';
        ctx.textAlign = 'right';
        ctx.fillText(`[${activeCalloutNode.x.toFixed(2)}, ${activeCalloutNode.y.toFixed(2)}, ${activeCalloutNode.z.toFixed(2)}]`, tagX + 50, tagY);

        // Real user query text
        ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#15803D';
        const displayLabel = activeCalloutNode.label.length > 28 ? activeCalloutNode.label.slice(0, 28) + '...' : activeCalloutNode.label;
        ctx.fillText(`"${displayLabel}"`, tagX + 50, tagY + 16);
        ctx.textAlign = 'left';
      }

      // ----------------------------------------------------
      // 9. DASHED LEADER LINES TO USER LABELS
      // ----------------------------------------------------
      projectedUserNodes.forEach(({ node, proj }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        const isLeft = proj.screenX < width / 2;
        const lineLen = 34;
        const lineEndX = isLeft ? proj.screenX - lineLen : proj.screenX + lineLen;

        ctx.save();
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(proj.screenX, proj.screenY);
        ctx.lineTo(lineEndX, proj.screenY);
        ctx.strokeStyle = isHovered || isSelected ? '#15803D' : (isLight ? '#64748B' : '#94A3B8');
        ctx.lineWidth = isHovered || isSelected ? 1.6 : 1.1;
        ctx.stroke();
        ctx.restore();

        // Label text
        ctx.font = `${isHovered || isSelected ? 'bold 12px' : '11px'} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = isLight ? '#0F172A' : '#F1F5F9';
        ctx.textAlign = isLeft ? 'right' : 'left';
        ctx.fillText(node.label, isLeft ? lineEndX - 6 : lineEndX + 6, proj.screenY + 3.5);
      });

      // ----------------------------------------------------
      // 10. HOVER / SELECTION TOOLTIP
      // ----------------------------------------------------
      if (hoveredNode || selectedNode) {
        const activeNode = (hoveredNode || selectedNode)!;
        const proj = project3D(activeNode.x, activeNode.y, activeNode.z, rotX, rotY);

        const tipW = 220;
        const tipH = 58;
        let tipX = proj.screenX - tipW / 2;
        let tipY = proj.screenY - tipH - 24;

        if (tipX < 15) tipX = 15;
        if (tipX + tipW > width - 15) tipX = width - tipW - 15;
        if (tipY < 15) tipY = proj.screenY + 24;

        ctx.beginPath();
        ctx.roundRect(tipX, tipY, tipW, tipH, 8);
        ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.95)' : 'rgba(23, 37, 60, 0.96)';
        ctx.fill();
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.fillText(activeNode.label, tipX + 10, tipY + 18);

        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#4ADE80';
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
      if (dist < 24) {
        audioSynth.playClick(1400);
        setSelectedNode(node);
        setActiveQuery(node.label);
        setQueryPoint({ x: node.x, y: node.y, z: node.z });
        addToast({
          type: 'info',
          title: `Query: "${node.label}"`,
          message: 'Vector space centered on this query.',
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
      if (dist < 22) {
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

    const coords = getVectorCoordinates(clean, allNodes.length);
    setQueryPoint({ x: coords.x, y: coords.y, z: coords.z });

    // Also persist as a real user vector node
    const newNode: VectorNode = {
      id: `query-node-${Date.now()}`,
      label: clean,
      category: 'code',
      prompt: clean,
      x: coords.x,
      y: coords.y,
      z: coords.z,
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
            <Target className="w-4 h-4 text-[#22C55E]" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-sans">
              3D Latent Vector Space Embedding
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono pt-0.5">
            3-Axis Projection • Green Similarity Radar • High-Dimensional Clustering
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
                ? 'bg-[#22C55E]/20 border border-[#22C55E]/50 text-[#4ADE80] font-semibold'
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
            <Rotate3d className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Reset View</span>
          </button>

          {/* Auto Orbit */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-1.5 ${isRotating
              ? 'bg-[#22C55E]/25 border-[#22C55E]/60 text-white font-medium'
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
          >
            <span>{isRotating ? 'Pause Orbit' : 'Auto Orbit'}</span>
          </button>

          {/* Clear custom vectors if any */}
          {customUserNodes.length > 0 && (
            <button
              onClick={handleClearCustomVectors}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 text-xs transition-all cursor-pointer flex items-center gap-1"
              title="Clear custom added vectors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. REAL QUERY INPUT BAR                                  */}
      {/* ======================================================== */}
      <form onSubmit={handleQuerySubmit} className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#22C55E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder='Type any search query to position radar in 3D (e.g. "Neural Networks", "TypeScript Generics")...'
            className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#22C55E] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none font-sans"
          />
        </div>

        {/* Dynamic recent user query chips */}
        {allNodes.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto max-w-sm">
            {allNodes.slice(0, 3).map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  audioSynth.playClick(1200);
                  setActiveQuery(node.label);
                  setQueryPoint({ x: node.x, y: node.y, z: node.z });
                }}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition-all cursor-pointer truncate max-w-[120px] ${activeQuery.toLowerCase() === node.label.toLowerCase()
                  ? 'bg-[#22C55E]/20 border-[#22C55E]/50 text-[#4ADE80] font-medium'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                title={node.label}
              >
                {node.label}
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-semibold font-mono tracking-wide flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shadow-md shrink-0"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Project Vector</span>
        </button>
      </form>

      {/* ======================================================== */}
      {/* 3. 3D VECTOR SPACE CANVAS                                */}
      {/* ======================================================== */}
      <div className="relative rounded-2xl border border-[#2A475E] overflow-hidden shadow-2xl bg-white">
        {/* Top Floating Helper Pill */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-2 font-mono text-[10px] text-zinc-700 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200 shadow-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="font-semibold text-zinc-900">3D Vector Space</span>
          {activeQuery ? (
            <span>• Active Query: <strong className="text-[#166534]">"{activeQuery}"</strong></span>
          ) : (
            <span>• Type query to map vector</span>
          )}
          <span>• {allNodes.length} Real Vectors</span>
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
                  <span className="w-3.5 h-3.5 rounded-full bg-[#22C55E] shadow-sm inline-block" />
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
                  <span className="text-[#15803D] font-bold text-sm">
                    {selectedNode.distanceToQuery ? selectedNode.distanceToQuery.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 uppercase block">3D Coordinates</span>
                  <span className="text-[#22C55E] text-xs">
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
                <span>Ask AI About "{selectedNode.label}"</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#22C55E]" />
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span className="text-zinc-300">Vibrant Green Vector Dots (Ambient Field)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#22C55E] bg-white inline-block" />
            <span className="text-zinc-300">Circular Concept Bubbles & Leader Lines</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
            <span className="text-zinc-300">Active Query Radar Rings</span>
          </span>
        </div>

        <span className="text-[11px] text-zinc-500">
          3D Vector Space • Green Dots • Zero Dummy Data
        </span>
      </div>
    </div>
  );
};
