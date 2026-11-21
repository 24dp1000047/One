import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ImageHistoryGallery } from '../components/image/ImageHistoryGallery';

export const Creations: React.FC = () => {
  const navigate = useNavigate();
  const generatedImages = useAppStore((state) => state.generatedImages);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#141822]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#A5C4F2] font-semibold">06 //</span>
            <span className="text-zinc-500 uppercase tracking-widest">ARCHIVE</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
              {generatedImages.length} SYNTHESIZED IMAGES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight mt-1">
            My Creations Archive
          </h1>
          <p className="text-xs text-[#8A94A6] mt-1 font-light">
            Inspect, upscale to 4K, copy prompt formulas, and download your synthesized concept art master files.
          </p>
        </div>

        <button
          onClick={() => navigate('/studio')}
          className="pill-action flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-semibold text-xs tracking-wide cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Image Generation</span>
        </button>
      </div>

      {/* Primary Gallery Component */}
      <ImageHistoryGallery />
    </div>
  );
};
