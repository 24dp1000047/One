import React, { useState, useRef } from 'react';
import { 
  Share2, 
  Plus, 
  Film, 
  Camera, 
  Palette, 
  Volume2, 
  Sparkles, 
  Maximize2, 
  RotateCcw,
  Sliders,
  Check,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { NodeGraphItem } from '../../types';
import { audioSynth } from '../../utils/audioSynth';

export const SpatialNodeCanvas: React.FC = () => {
  const nodeGraph = useAppStore((state) => state.nodeGraph);
  const updateNodeGraphItem = useAppStore((state) => state.updateNodeGraphItem);
  const addNodeGraphItem = useAppStore((state) => state.addNodeGraphItem);
  const connectNodes = useAppStore((state) => state.connectNodes);
  const setStudioMode = useAppStore((state) => state.setStudioMode);
  const addToast = useAppStore((state) => state.addToast);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-vision');
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNode = nodeGraph.find((n) => n.id === selectedNodeId);

  // Mouse Handlers for Dragging Nodes
  const handleNodeMouseDown = (e: React.MouseEvent, node: NodeGraphItem) => {
    e.stopPropagation();
    setDraggingNodeId(node.id);
    setSelectedNodeId(node.id);
    audioSynth.playClick(1000);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanningCanvas(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const newX = Math.max(10, e.clientX - dragOffset.x);
      const newY = Math.max(10, e.clientY - dragOffset.y);
      updateNodeGraphItem(draggingNodeId, { x: newX, y: newY });
    } else if (isPanningCanvas) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanningCanvas(false);
  };

  const handleAddSceneNode = () => {
    const sceneCount = nodeGraph.filter((n) => n.type === 'scene').length;
    const newId = `node-scene-${Date.now()}`;
    addNodeGraphItem({
      type: 'scene',
      title: `Scene 0${sceneCount + 1}: Dynamic Sequence`,
      subtitle: '4.0s / Handheld Orbit',
      x: 180 + sceneCount * 120,
      y: 180,
      connectedTo: [],
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
      data: {
        duration: 4,
        cameraMotion: 'Slow Orbit',
      },
    });
  };

  // Node type icon & badge helper
  const getNodeMeta = (type: NodeGraphItem['type']) => {
    switch (type) {
      case 'vision':
        return {
          icon: Sparkles,
          color: '#E5A866',
          bg: 'rgba(229, 168, 102, 0.1)',
          border: 'rgba(229, 168, 102, 0.4)',
          badge: 'SCRIPT CORE',
        };
      case 'scene':
        return {
          icon: Film,
          color: '#A5C4F2',
          bg: 'rgba(165, 196, 242, 0.1)',
          border: 'rgba(165, 196, 242, 0.4)',
          badge: 'SEQUENCE',
        };
      case 'camera':
        return {
          icon: Camera,
          color: '#FFD600',
          bg: 'rgba(255, 214, 0, 0.1)',
          border: 'rgba(255, 214, 0, 0.4)',
          badge: 'OPTICAL RIG',
        };
      case 'lut':
        return {
          icon: Palette,
          color: '#34D399',
          bg: 'rgba(52, 211, 153, 0.1)',
          border: 'rgba(52, 211, 153, 0.4)',
          badge: 'COLOR LAB',
        };
      case 'audio':
        return {
          icon: Volume2,
          color: '#F472B6',
          bg: 'rgba(244, 114, 182, 0.1)',
          border: 'rgba(244, 114, 182, 0.4)',
          badge: 'SOUND ENGINE',
        };
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#040608] border border-[#181C26] overflow-hidden flex flex-col">
      {/* Canvas Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#141822] bg-[#07090F]/90 backdrop-blur-md z-20 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#E5A866]">
            <Layers className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Spatial Storyboard Canvas</span>
          </div>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400 text-[11px] hidden sm:inline">
            Connect scene blocks, camera rigs & audio stems
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSceneNode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sans text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sequence Node</span>
          </button>
          <button
            onClick={() => setPan({ x: 0, y: 0 })}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Pan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[580px] bg-[#030508] overflow-hidden select-none cursor-crosshair"
      >
        {/* Subtle Spatial Dot Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none ascii-matrix-bg opacity-35"
          style={{ transform: `translate(${pan.x % 24}px, ${pan.y % 24}px)` }}
        />

        {/* SVG Bezier Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E5A866" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A5C4F2" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {nodeGraph.map((sourceNode) =>
            sourceNode.connectedTo.map((targetId) => {
              const targetNode = nodeGraph.find((n) => n.id === targetId);
              if (!targetNode) return null;

              const x1 = sourceNode.x + pan.x + 130;
              const y1 = sourceNode.y + pan.y + 60;
              const x2 = targetNode.x + pan.x + 10;
              const y2 = targetNode.y + pan.y + 60;

              const dx = Math.abs(x2 - x1) * 0.5;
              const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              return (
                <g key={`${sourceNode.id}->${targetId}`}>
                  {/* Subtle Background Glow Line */}
                  <path
                    d={d}
                    fill="none"
                    stroke="#A5C4F2"
                    strokeWidth="3"
                    strokeOpacity="0.15"
                  />
                  {/* Active Data Signal Cable */}
                  <path
                    d={d}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                  {/* Signal Node Dot */}
                  <circle cx={x1} cy={y1} r="3" fill="#E5A866" />
                  <circle cx={x2} cy={y2} r="3" fill="#A5C4F2" />
                </g>
              );
            })
          )}
        </svg>

        {/* Draggable Node Cards */}
        {nodeGraph.map((node) => {
          const meta = getNodeMeta(node.type);
          const Icon = meta.icon;
          const isSelected = selectedNodeId === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              onClick={() => setSelectedNodeId(node.id)}
              style={{
                transform: `translate(${node.x + pan.x}px, ${node.y + pan.y}px)`,
              }}
              className={`absolute top-0 left-0 w-64 rounded-xl border bg-[#07090F]/95 backdrop-blur-md shadow-2xl transition-shadow cursor-grab active:cursor-grabbing z-20 ${
                isSelected
                  ? 'border-white shadow-xl shadow-white/5 ring-1 ring-white/20'
                  : 'border-[#181C26] hover:border-[#2C3446]'
              }`}
            >
              {/* Node Card Header */}
              <div className="flex items-center justify-between p-3 border-b border-[#141822]">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-[10px] tracking-wider font-semibold uppercase" style={{ color: meta.color }}>
                    {meta.badge}
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              {/* Node Body */}
              <div className="p-3 space-y-2">
                <div className="font-sans font-medium text-xs text-white leading-snug line-clamp-1">
                  {node.title}
                </div>
                {node.subtitle && (
                  <div className="font-mono text-[11px] text-zinc-400">
                    {node.subtitle}
                  </div>
                )}

                {/* Optional Thumbnail for Scenes */}
                {node.thumbnail && (
                  <div className="relative w-full h-20 rounded-lg overflow-hidden border border-white/5 mt-1">
                    <img
                      src={node.thumbnail}
                      alt={node.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute bottom-1 right-2 font-mono text-[9px] text-brand-yellow font-bold">
                      {node.data?.cameraMotion || 'Orbit'}
                    </span>
                  </div>
                )}
              </div>

              {/* Node Card Output Port */}
              <div className="px-3 py-2 border-t border-[#141822] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{node.connectedTo.length} OUT VECTOR</span>
                <span className="text-zinc-400 hover:text-white flex items-center gap-1">
                  DIRECT <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}

        {/* Selected Node Inspector Drawer (Bottom-Right) */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 w-80 rounded-xl bg-[#090C14]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 z-30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-white font-semibold flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#E5A866]" />
                INSPECTOR: {selectedNode.type.toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase">Node Title</label>
              <input
                type="text"
                value={selectedNode.title}
                onChange={(e) => updateNodeGraphItem(selectedNode.id, { title: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-[#E5A866]"
              />
            </div>

            {selectedNode.type === 'scene' && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Duration</span>
                  <span className="text-white">{selectedNode.data?.duration || 4}s</span>
                </div>
                <button
                  onClick={() => {
                    setStudioMode('director3d');
                    addToast({
                      type: 'info',
                      title: 'Opening 3D Director',
                      message: `Loaded ${selectedNode.title} in spatial viewport.`,
                    });
                  }}
                  className="w-full py-2 rounded-lg bg-[#A5C4F2]/15 hover:bg-[#A5C4F2]/25 border border-[#A5C4F2]/30 text-[#A5C4F2] font-sans font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Calibrate in 3D Director</span>
                </button>
              </div>
            )}

            {selectedNode.type === 'lut' && (
              <button
                onClick={() => setStudioMode('colorSound')}
                className="w-full py-2 rounded-lg bg-[#34D399]/15 hover:bg-[#34D399]/25 border border-[#34D399]/30 text-[#34D399] font-sans font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Open Color Grading Lab</span>
              </button>
            )}

            {selectedNode.type === 'audio' && (
              <button
                onClick={() => setStudioMode('colorSound')}
                className="w-full py-2 rounded-lg bg-[#F472B6]/15 hover:bg-[#F472B6]/25 border border-[#F472B6]/30 text-[#F472B6] font-sans font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Open Sound Synthesizer</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
