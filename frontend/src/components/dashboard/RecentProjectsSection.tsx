import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Play, Heart, Clock, ArrowRight, Film } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const RecentProjectsSection: React.FC = () => {
  const navigate = useNavigate();
  const projects = useAppStore((state) => state.projects);
  const toggleFavorite = useAppStore((state) => state.toggleFavoriteProject);
  const setSelectedProject = useAppStore((state) => state.setSelectedProjectForPreview);

  const displayProjects = projects.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#141822]">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-[#A5C4F2] font-semibold">03 //</span>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-widest uppercase font-mono">
            Recent Video Synthesis
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
            {projects.length} ARCHIVED
          </span>
        </div>

        <NavLink
          to="/creations"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono transition-colors"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => {
              setSelectedProject(project);
              navigate('/creations');
            }}
            className="group relative rounded-3xl bg-[#080A10] border border-[#181C26] hover:border-white/25 overflow-hidden cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1"
          >
            {/* Thumbnail Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-black/60">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover overlay with play button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-11 h-11 rounded-full pill-action flex items-center justify-center transition-transform group-hover:scale-110">
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </div>
              </div>

              {/* Badges on Thumbnail */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#A5C4F2] font-bold border border-white/10">
                  {project.resolution}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/10">
                  {project.aspectRatio}
                </span>
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(project.id);
                }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-[#E5A866] transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    project.isFavorite ? 'fill-[#E5A866] text-[#E5A866]' : 'text-zinc-400'
                  }`}
                />
              </button>

              {/* Duration pill */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                <Clock className="w-3 h-3 text-[#E5A866]" />
                <span>{project.duration}s</span>
              </div>
            </div>

            {/* Info Container */}
            <div className="p-4 space-y-2">
              <h3 className="font-medium text-xs sm:text-sm text-white truncate group-hover:text-[#A5C4F2] transition-colors">
                {project.title}
              </h3>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="text-zinc-400">{project.style}</span>
                <span>{project.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
