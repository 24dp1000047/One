# ONe AI Studio — Dual-Brain Architecture (Jev & Inkling)

ONe AI Studio full-stack application with a **Dual-Brain Cognitive Architecture**:
1. **System 1 (Fast Decision & Intent Classification):** **Jev** (TypeSafe AI) — `<100ms` non-autoregressive decision engine that classifies user intent, complexity, and allocates reasoning budgets.
2. **System 2 (Deep Reasoning & Generation):** **Inkling** (Thinking Machines Lab) — High-capacity open reasoning model that generates deep, contextual, and structured responses based on Jev's System-1 parameters.

---

## 🏗️ Architecture

```
User Prompt (Frontend UI)
       │
       ▼
[Backend Server : 5000]
       │
       ├──► Step 1: Jev Engine (TypeSafe AI System-1)
       │            ⚡ Intent: code | technical | creative | dialogue
       │            ⚡ Complexity: simple | moderate | complex
       │            ⚡ Reasoning Budget: low | medium | high
       │            ⚡ Latency: <100ms
       │
       └──► Step 2: Inkling Service (Thinking Machines Lab System-2)
                    🧠 Calibrates depth from Jev's allocated budget
                    🧠 Executes deep chain-of-thought reasoning
                    🧠 Returns high-production response + Jev metadata
       │
       ▼
Frontend Studio (Vite + React + TailwindCSS)
Displays response + Jev intent badge + Inkling model tag
```

---

## 🚀 Quick Start

### 1. Start Backend Server
```bash
# Option A: Run script
start-backend.bat

# Option B: Terminal
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Start Frontend Studio
```bash
# Option A: Run script
start-frontend.bat

# Option B: Terminal
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## ⚙️ Configuration

- Backend `.env` (`backend/.env`):
  ```env
  PORT=5000
  OPENROUTER_API_KEY=your_openrouter_api_key
  ```

- **OpenRouter Key Notes:**
  - Thinking Machines Inkling models on OpenRouter: `thinkingmachines/inkling-2-mini` & `thinkingmachines/inkling-2-small`.
  - If your API key limit is set to `$0.00`, the backend automatically utilizes the high-capacity free reasoning bridge (`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`) while preserving the exact Jev System-1 classification pipeline.
  - Adding minimal credits (even $0.10) to OpenRouter unlocks pure native `inkling-2-mini` directly.
