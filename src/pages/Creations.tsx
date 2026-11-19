import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  Search, 
  Heart, 
  Trash2, 
  Play, 
  Grid, 
  List, 
  Clock, 
  Tv, 
  X, 
  Download, 
  Wand2, 
  Sparkles, 
  Film,
  Layers,
  Copy
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { VideoProject } from '../types';
import { VideoPreviewPlayer } from '../components/video/VideoPreviewPlayer';

export const Creations: React.FC = () => {
  const navigate = useNavigate();
  const projects = useAppStore((state) => state.projects);
  const toggleFavorite = useAppStore((state) => state.toggleFavoriteProject);
  const deleteProject = useAppStore((state) => state.deleteProject);
  const setStudioPrompt = useAppStore((state) => state.setStudioPrompt);
  const setSelectedStyle = useAppStore((state) => state.setSelectedStyle);
  const setAspectRatio = useAppStore((state) => state.setAspectRatio);
  const setDuration = useAppStore((state) => state.setDuration);
  const setResolution = useAppStore((state) => state.setResolution);
  const addToast = useAppStore((state) => state.addToast);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favorites' | '4k'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeModalProject, setActiveModalProject] = useState<VideoProject | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      selectedFilter === 'all'
        ? true
        : selectedFilter === 'favorites'
        ? p.isFavorite
        : p.resolution === '4K';
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase()) ||
      p.style.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleOpenInStudio = (project: VideoProject) => {
    setStudioPrompt(project.prompt);
    setSelectedStyle(project.style);
    setAspectRatio(project.aspectRatio);
    setDuration(project.duration);
    setResolution(project.resolution);
    setActiveModalProject(null);
    addToast({
      type: 'success',
      title: 'Project Loaded in Studio',
      message: `Opened "${project.title}" for editing.`,
    });
    navigate('/studio');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f1f1f]">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display">
              My Creations Archive
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 font-semibold">
              {projects.length} Videos
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Browse, preview, and download your rendered animations and project storyboards.
          </p>
        </div>

        <button
          onClick={() => navigate('/studio')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow text-black font-semibold text-xs shadow-glow-yellow-sm hover:brightness-110 active:scale-95 transition-all"
        >
          <Film className="w-3.5 h-3.5" />
          <span>New Studio Project</span>
        </button>
      </div>

      {/* Filters, Search & View Mode Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, styles, tags..."
            className="w-full bg-[#141414] border border-[#242424] focus:border-brand-yellow/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-muted focus:outline-none"
          />
        </div>

        {/* Filter buttons & View mode toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#121212] border border-[#242424]">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-brand-yellow text-black font-semibold shadow-glow-yellow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setSelectedFilter('favorites')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedFilter === 'favorites'
                  ? 'bg-brand-yellow text-black font-semibold shadow-glow-yellow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setSelectedFilter('4k')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedFilter === '4k'
                  ? 'bg-brand-yellow text-black font-semibold shadow-glow-yellow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              4K Masters
            </button>
          </div>

          {/* Grid vs List toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#121212] border border-[#242424]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#222222] text-brand-yellow' : 'text-muted hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#222222] text-brand-yellow' : 'text-muted hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121212] border border-[#242424] space-y-3">
          <Film className="w-10 h-10 text-muted mx-auto" />
          <h3 className="text-base font-semibold text-white">No creations match your query</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your search filters, or head to the Studio to generate a new video.
          </p>
          <button
            onClick={() => navigate('/studio')}
            className="px-4 py-2 rounded-xl bg-brand-yellow text-black font-semibold text-xs shadow-glow-yellow-sm"
          >
            Create in Studio
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveModalProject(project)}
              className="group relative flex flex-col justify-between rounded-2xl bg-[#121212] border border-[#242424] hover:border-brand-yellow/50 overflow-hidden cursor-pointer transition-all duration-300 shadow-xl hover:shadow-glow-yellow-sm hover:-translate-y-1"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-yellow text-black flex items-center justify-center shadow-glow-yellow">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-brand-yellow border border-white/10 font-bold">
                    {project.resolution}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-white border border-white/10">
                    {project.aspectRatio}
                  </span>
                </div>

                {/* Favorite & Delete Buttons */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(project.id);
                    }}
                    className="p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-brand-yellow transition-colors"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        project.isFavorite ? 'fill-brand-yellow text-brand-yellow' : 'text-zinc-400'
                      }`}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    className="p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-rose-400 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Duration */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                  <Clock className="w-3 h-3 text-brand-orange" />
                  <span>{project.duration}s</span>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-white tracking-wide truncate group-hover:text-brand-yellow transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                    {project.prompt}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1f1f1f] flex items-center justify-between text-[11px] font-mono text-muted">
                  <span className="text-zinc-400">{project.style}</span>
                  <span>{project.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="rounded-2xl bg-[#121212] border border-[#242424] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181818] border-b border-[#242424] text-[11px] font-mono text-muted">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4 hidden sm:table-cell">Style</th>
                <th className="py-3 px-4">Specs</th>
                <th className="py-3 px-4 hidden md:table-cell">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {filteredProjects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setActiveModalProject(p)}
                  className="hover:bg-[#181818] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-12 h-8 rounded-lg object-cover border border-[#2c2c2c]"
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-white truncate block">{p.title}</span>
                        <span className="text-[10px] text-muted truncate block max-w-xs">{p.prompt}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell font-mono text-zinc-300">
                    {p.style}
                  </td>
                  <td className="py-3 px-4 font-mono text-brand-yellow">
                    {p.resolution} • {p.duration}s
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-muted font-mono">
                    {p.createdAt}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className="p-1.5 text-zinc-400 hover:text-brand-yellow"
                      >
                        <Heart
                          className={`w-4 h-4 ${p.isFavorite ? 'fill-brand-yellow text-brand-yellow' : ''}`}
                        />
                      </button>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RICH PREVIEW MODAL */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#141414] border border-[#2b2b2b] shadow-2xl p-5 sm:p-7 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide font-display">
                  {activeModalProject.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono text-muted">
                  <span className="text-brand-yellow font-bold">{activeModalProject.resolution}</span>
                  <span>•</span>
                  <span>{activeModalProject.duration} Seconds</span>
                  <span>•</span>
                  <span>{activeModalProject.aspectRatio}</span>
                  <span>•</span>
                  <span>{activeModalProject.style}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveModalProject(null)}
                className="p-2 text-muted hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Preview */}
            <div className="w-full">
              <VideoPreviewPlayer posterUrl={activeModalProject.thumbnail} />
            </div>

            {/* Prompt Breakdown */}
            <div className="rounded-2xl bg-[#0e0e0e] border border-[#242424] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                  Generation Prompt
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeModalProject.prompt);
                    addToast({ type: 'success', title: 'Prompt copied' });
                  }}
                  className="text-xs text-brand-yellow hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                {activeModalProject.prompt}
              </p>
            </div>

            {/* Storyboard Scenes List */}
            {activeModalProject.scenes && activeModalProject.scenes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white tracking-wide flex items-center gap-1.5 font-mono">
                  <Layers className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Storyboard Camera Vectors ({activeModalProject.scenes.length} Scenes)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeModalProject.scenes.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-[#101010] border border-[#222222] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-brand-yellow">Scene {s.sceneNumber}</span>
                        <span className="text-muted">{s.duration}s</span>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange text-[10px] font-mono">
                        {s.cameraMotion}
                      </span>
                      <p className="text-zinc-400 text-[11px] line-clamp-2">{s.prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1f1f1f]">
              <button
                onClick={() => {
                  deleteProject(activeModalProject.id);
                  setActiveModalProject(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Project</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Downloading Master',
                      message: `Exporting "${activeModalProject.title}.mp4"`,
                    });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1f1f1f] hover:bg-[#282828] text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4</span>
                </button>

                <button
                  onClick={() => handleOpenInStudio(activeModalProject)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-yellow text-black font-semibold text-xs shadow-glow-yellow-sm hover:brightness-110 active:scale-95 transition-all"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Remix in Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
