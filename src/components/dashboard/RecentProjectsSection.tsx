import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Play, Heart, Clock, ArrowRight, Eye, Film } from 'lucide-react';
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Film className="w-5 h-5 text-brand-yellow" />
          <h2 className="text-lg font-semibold text-white tracking-wide">Recent Video Projects</h2>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#181818] border border-[#262626] text-muted">
            {projects.length} Total
          </span>
        </div>

        <NavLink
          to="/creations"
          className="flex items-center gap-1.5 text-xs text-brand-yellow hover:underline font-medium"
        >
          <span>View Archive</span>
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
            className="group relative rounded-2xl bg-[#121212] border border-[#242424] hover:border-brand-yellow/50 overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-glow-yellow-sm hover:-translate-y-1"
          >
            {/* Thumbnail Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-black/60">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover overlay with play button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-brand-yellow/90 text-black flex items-center justify-center shadow-glow-yellow transition-transform group-hover:scale-110">
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </div>
              </div>

              {/* Badges on Thumbnail */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-brand-yellow font-bold border border-white/10">
                  {project.resolution}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-white border border-white/10">
                  {project.aspectRatio}
                </span>
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(project.id);
                }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-brand-yellow transition-colors"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    project.isFavorite ? 'fill-brand-yellow text-brand-yellow' : 'text-zinc-400'
                  }`}
                />
              </button>

              {/* Duration pill */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                <Clock className="w-3 h-3 text-brand-orange" />
                <span>{project.duration}s</span>
              </div>
            </div>

            {/* Info Container */}
            <div className="p-3.5 space-y-2">
              <h3 className="font-medium text-sm text-white truncate group-hover:text-brand-yellow transition-colors">
                {project.title}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-muted">
                <span className="text-zinc-400">{project.style}</span>
                <span className="font-mono">{project.createdAt}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {project.tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c1c1c] text-zinc-400 border border-[#2b2b2b]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
