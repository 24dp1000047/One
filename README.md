# ONe — One Space. Infinite Possibilities.

A modern, premium AI creative web application that combines **conversational AI scripting** and **text-to-animated-video creation** in a unified, futuristic workspace.

Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Zustand**, **Three.js**, and **Lucide Icons**.

---

## ✨ Features & Architecture

### 1. 🌐 Home Dashboard (`/`)
- **Interactive 3D AI Orb**: Real-time WebGL Three.js core with glowing particle cloud and dynamic states (`idle`, `thinking`, `generating`).
- **Universal Prompt Bar**: Type any creative concept with 1-click toggle between **Create Video** and **Chat & Script**. Includes inline **Magic Prompt Enhancer**.
- **Quick Action Hubs**: Seamless navigation to Studio, Chat, Playground, and Community Explore.
- **Recent Projects Carousel**: Instant playback preview, duration pills, and favorite toggles.
- **Featured Community Masterpieces**: Inspect prompts and remix them directly in the Studio.

### 2. 💬 AI Chat Studio (`/chat`)
- **Conversational Director**: Script ideation, camera blocking suggestions, and screenplay formatting.
- **Markdown & Code Rendering**: Pre-styled YAML / script specs with syntax highlighting and 1-click copy.
- **Audio Waveform Voice Input**: Interactive simulated voice recording modal with pulsing frequency bars and speech-to-text dictation.
- **Attachment Modal**: Add reference moodboard images or screenplay documents.
- **Send to Video Studio**: Seamless 1-click transfer of chat concepts straight into the Video Studio.
- **History Sidebar**: Search conversations, pin favorite threads, rename, or delete sessions.

### 3. 🎬 Text-to-Video Studio (`/studio`)
- **Split-Screen Director Layout**: Prompt engineering and synthesis controls on the left, live high-fidelity video player on the right.
- **Magic Prompt Enhancer**: Transforms basic prompts into cinematic 8K master prompts with anamorphic 35mm lens tags, volumetric lighting, and Lumen render vectors.
- **Synthesis Parameters**:
  - **Aspect Ratios**: `16:9` (Landscape), `9:16` (Reels/TikTok), `1:1` (Square), `21:9` (Ultra-Wide Cinema).
  - **Duration Slider**: 3s to 15s.
  - **Resolution**: `720p`, `1080p`, `4K Cinema`.
  - **Camera Motion Vectors**: Slow Orbit, Pan Right, Pan Left, FPV Drone Dive, Cinematic Crane Up, Hyperlapse Zoom.
- **Interactive Multi-Stage Generation Simulation**:
  - Stage 1: Semantic Analysis (15%)
  - Stage 2: Keyframe Storyboard (35%)
  - Stage 3: Optical Motion Simulation (65%)
  - Stage 4: 4K Neural Rendering (88%)
  - Stage 5: Completed (100%)
- **Custom Video Player**: Scrubber timeline, timecode display, speed switcher (1x, 1.5x, 2x), loop toggle, volume, download MP4, and fullscreen.
- **Editable Storyboard**: Auto-generates multi-scene cards with editable prompts, durations, camera angles, and visual notes.
- **Multi-Track Director Timeline**: Video, Motion Vectors, and Audio tracks with moving playhead and zoom controls.

### 4. 🧪 Creative Playground (`/playground`)
- **A/B Prompt Lab**: Generate 3 side-by-side artistic variations from a single seed prompt.
- **Generative Physics Sliders**:
  - Motion Velocity Vector (10% - 100%)
  - Prompt Adherence CFG Scale (1.0 - 20.0)
  - Handheld Camera Shake (0 - 10)
  - Chaos Latent Temperature (0% - 100%)
- **Promote to Studio**: Promote any winning candidate to the final Video Studio with one click.

### 5. 🧭 Explore Community Hub (`/explore`)
- **Curated Inspiration Gallery**: Filter by Sci-Fi, Anime, Surreal, Commercial, and Abstract.
- **Interactive Cards**: Hover video motion, creator avatars, likes counter, view counts, and 1-click **Remix**.
- **Style Preset Spotlights**: Cinematic 8K, Cyberpunk Neon, Anime Neo-Tokyo, Hyper-Surrealism, 16mm Kodachrome, and Claymation.

### 6. 📂 My Creations Archive (`/creations`)
- **Project Grid & List Views**: Search and filter by Favorites or 4K Masters.
- **Rich Preview Modal**: Embedded player, master prompt copy, storyboard camera breakdown, and download actions.
- **Full LocalStorage Persistence**: All created videos and favorite states survive browser refreshes.

### 7. ⚙️ Settings & Workspace (`/settings`)
- **Director Profile**: Edit name, handle, avatar, and bio statement.
- **Interface & Themes**: Toggle between **Signature Yellow** (`#FFD600`) and **Special Orange** (`#FF7A1A`), Futuristic Dark vs OLED Pure Black.
- **ONe Energy Telemetry**: Live balance meter with interactive `+1,000 ⚡ Refill` action.
- **Factory Reset**: Restore initial showcase demo projects at any time.

### 8. ⚡ Global Command Palette (`Ctrl + K` / `Cmd + K`)
- Fast keyboard navigation across all views.
- Quick actions: New Chat, Magic Enhance, Quick Render, and Reset Data.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development Server
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build
```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```
