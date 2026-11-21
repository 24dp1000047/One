-- ====================================================================
-- ONe AI Studio: Dual-Brain Architecture Database Schema (Supabase)
-- Tables: conversations, messages, jev_telemetry
-- ====================================================================

-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model TEXT DEFAULT 'Thinking Machines Inkling',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Jev Decision Telemetry Table (System 1 Decisions)
CREATE TABLE IF NOT EXISTS jev_telemetry (
  id BIGSERIAL PRIMARY KEY,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
  intent TEXT NOT NULL,
  complexity TEXT NOT NULL,
  confidence NUMERIC(5, 4) NOT NULL,
  reasoning_budget TEXT NOT NULL,
  latency_ms INTEGER NOT NULL,
  primitive_type TEXT DEFAULT 'classifier',
  truth_score_percent INTEGER,
  verdict TEXT,
  state_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for ultra-fast query performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_created_at ON jev_telemetry(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_intent ON jev_telemetry(intent);

-- Enable Row Level Security (RLS) & Public read/write policy for API backend
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE jev_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow API access to conversations" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow API access to messages" ON messages FOR ALL USING (true);
CREATE POLICY "Allow API access to jev_telemetry" ON jev_telemetry FOR ALL USING (true);
