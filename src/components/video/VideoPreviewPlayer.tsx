import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Repeat, 
  Settings2,
  Film,
  Crosshair
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';

interface VideoPreviewPlayerProps {
  posterUrl?: string;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  posterUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDirectorHud, setShowDirectorHud] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const duration = useAppStore((state) => state.duration) || 12;
  const resolution = useAppStore((state) => state.resolution);
  const aspectRatio = useAppStore((state) => state.aspectRatio);
  const scenes = useAppStore((state) => state.scenes);
  const addToast = useAppStore((state) => state.addToast);
  const colorGrading = useAppStore((state) => state.colorGrading);
  const cameraRig = useAppStore((state) => state.cameraRig);

  const currentPoster = posterUrl || scenes[0]?.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';

  const getFilterStyle = () => {
    const brightness = 1 + colorGrading.exposure / 100;
    const contrast = colorGrading.contrast / 100;
    const saturate = colorGrading.saturation / 100;
    const sepia = Math.max(0, colorGrading.temperature / 100);
    const hueRotate = colorGrading.temperature < 0 ? `${(colorGrading.temperature / 50) * 20}deg` : '0deg';

    return {
      filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) sepia(${sepia * 0.4}) hue-rotate(${hueRotate})`,
    };
  };

  // Playback timer simulation
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            if (isLooping) return 0;
            setIsPlaying(false);
            return duration;
          }
          return prev + 0.1 * playbackSpeed;
        });
      }, 100);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, playbackSpeed, isLooping]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}.${ms}`;
  };

  const handleDownload = () => {
    addToast({
      type: 'success',
      title: 'Downloading Video',
      message: `Exporting master file in ${resolution} 60fps MP4 format.`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      type: 'success',
      title: 'Share Link Copied',
      message: 'Direct link to preview copied to clipboard.',
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[520px]';
      case '1:1':
        return 'aspect-square max-h-[480px]';
      case '21:9':
        return 'aspect-[21/9]';
      default:
        return 'aspect-video';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`group relative w-full overflow-hidden rounded-3xl bg-[#040608] border border-[#181C26] shadow-2xl flex flex-col justify-end select-none ${getAspectClass()}`}
    >
      {/* Video Visual Stage */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={currentPoster}
          alt="Video Preview"
          style={getFilterStyle()}
          className={`w-full h-full object-cover transition-transform duration-1000 ${
            isPlaying ? 'scale-110 translate-x-1' : 'scale-100'
          }`}
        />

        {/* Dynamic Vignette from Color Grading */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${colorGrading.vignette / 100}))`,
          }}
        />

        {/* Ambient Film Grain & Scanlines Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

        {/* Director HUD Grid Overlay (when toggled) */}
        {showDirectorHud && (
          <div className="absolute inset-0 pointer-events-none z-15 flex flex-col justify-between p-4 border border-white/20">
            {/* Rule of Thirds Lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-white/15" />
              <div className="border-r border-white/15" />
              <div />
            </div>

            {/* Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border border-brand-yellow/50 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
              </div>
            </div>

            {/* Live Camera & LUT Readout */}
            <div className="absolute bottom-16 right-4 font-mono text-[10px] text-zinc-300 bg-black/70 px-2 py-1 rounded border border-white/10">
              LENS: {cameraRig.fov}mm | {cameraRig.aperture} | LUT: {colorGrading.preset}
            </div>
          </div>
        )}

        {/* Dynamic audio waveform animation when playing */}
        {isPlaying && (
          <div className="absolute bottom-20 left-6 flex items-end gap-1 pointer-events-none z-10">
            {[24, 45, 78, 92, 60, 35, 80, 50, 95, 30].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-brand-yellow/80 rounded-full animate-pulse"
                style={{
                  height: `${h * 0.4}px`,
                  animationDuration: `${0.3 + (i % 4) * 0.2}s`,
                }}
              />
            ))}
            <span className="text-[10px] font-mono text-brand-yellow ml-2">Audio Synth 48kHz</span>
          </div>
        )}
      </div>

      {/* Top Bar Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-brand-yellow border border-white/10 font-bold">
            {resolution}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-zinc-300 border border-white/10">
            60 FPS
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-zinc-300 border border-white/10">
            {aspectRatio}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioSynth.playClick(1300);
              setShowDirectorHud(!showDirectorHud);
            }}
            className={`p-1.5 rounded-lg backdrop-blur-md border transition-colors cursor-pointer ${
              showDirectorHud
                ? 'bg-brand-yellow/20 border-brand-yellow text-brand-yellow'
                : 'bg-black/70 border-white/10 text-white hover:text-brand-yellow'
            }`}
            title="Toggle Director HUD"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-brand-yellow transition-colors"
            title="Share Video"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-brand-yellow transition-colors"
            title="Download MP4"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Big Play Button (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div
            onClick={togglePlay}
            className="pointer-events-auto cursor-pointer w-16 h-16 rounded-full pill-action flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-6 h-6 fill-black ml-0.5" />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="relative z-20 p-4 space-y-2 bg-gradient-to-t from-black via-black/80 to-transparent">
        {/* Scrubber Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-brand-yellow font-medium">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full accent-brand-yellow bg-white/20 h-1.5 rounded-lg cursor-pointer"
          />

          <span className="text-[11px] font-mono text-muted">
            {formatTime(duration)}
          </span>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={() => setCurrentTime(0)}
              className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Toggle */}
            <button
              onClick={() => {
                const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
                setPlaybackSpeed(nextSpeed);
              }}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-zinc-200 transition-colors"
              title="Change Speed"
            >
              {playbackSpeed}x
            </button>

            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-lg transition-colors ${
                isLooping ? 'text-brand-yellow bg-brand-yellow/10' : 'text-muted hover:text-white'
              }`}
              title="Loop Playback"
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
