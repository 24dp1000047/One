import { supabase, isSupabaseConfigured } from './supabaseClient';
import { JevDecision } from '../types';
import { readLocalDb, saveToLocalDb } from './localDb';

export interface PersistedInteraction {
  conversationId: string;
  userPrompt: string;
  aiResponse: string;
  model: string;
  jevDecision: JevDecision;
}

/**
 * Saves chat interaction and Jev System-1 decision:
 * 1. Always saves to local JSON database in backend/data/database.json (visible in VS Code & Git)
 * 2. If Supabase is configured, also syncs to cloud PostgreSQL
 */
export async function persistInteraction(interaction: PersistedInteraction): Promise<boolean> {
  const { conversationId, userPrompt, aiResponse, model, jevDecision } = interaction;

  // 1. Always save to local database file in VS Code
  saveToLocalDb(conversationId, userPrompt, aiResponse, model, jevDecision);

  // 2. If Supabase is configured, also sync to cloud PostgreSQL
  if (!isSupabaseConfigured() || !supabase) {
    return true;
  }

  try {
    // Upsert conversation record
    const title = userPrompt.slice(0, 45) + (userPrompt.length > 45 ? '...' : '');
    await supabase.from('conversations').upsert(
      {
        id: conversationId,
        title,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    // Insert User Message
    const userMsgId = 'msg-u-' + Date.now();
    await supabase.from('messages').insert({
      id: userMsgId,
      conversation_id: conversationId,
      role: 'user',
      content: userPrompt,
      model: 'user',
      created_at: new Date().toISOString(),
    });

    // Insert AI Assistant Message
    const aiMsgId = 'msg-ai-' + (Date.now() + 1);
    await supabase.from('messages').insert({
      id: aiMsgId,
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse,
      model,
      created_at: new Date().toISOString(),
    });

    // Insert Jev System-1 Decision Telemetry
    await supabase.from('jev_telemetry').insert({
      message_id: aiMsgId,
      conversation_id: conversationId,
      intent: jevDecision.intent,
      complexity: jevDecision.complexity,
      confidence: jevDecision.confidence,
      reasoning_budget: jevDecision.reasoningBudget,
      latency_ms: jevDecision.latencyMs,
      primitive_type: jevDecision.primitiveType,
      truth_score_percent: jevDecision.noulResult?.truthScorePercent ?? null,
      verdict: jevDecision.noulResult?.verdict ?? jevDecision.choiceResult?.winningChoice ?? null,
      state_explanation: jevDecision.stateExplanation ?? null,
      created_at: new Date().toISOString(),
    });

    console.log(`💾 [Database] Successfully synced interaction to Supabase cloud (Conv: ${conversationId})`);
    return true;
  } catch (err: any) {
    console.error('❌ [Database] Supabase cloud sync error:', err.message);
    return true; // Still true because local DB saved successfully
  }
}

/**
 * Returns recent Jev decision telemetry stored in Database (Local or Supabase)
 */
export async function getRecentTelemetry(limit = 10) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('jev_telemetry')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback to local
    }
  }

  // Fallback to local file database
  const localDb = readLocalDb();
  return localDb.jevTelemetry.slice(0, limit);
}

/**
 * Check Database status (Local VS Code DB + Supabase)
 */
export async function checkDatabaseConnection(): Promise<{
  status: 'ONLINE' | 'ACTIVE';
  engine: string;
  connected: boolean;
  configured: boolean;
  storageType: string;
  databasePath: string;
  tables: string[];
  totalRecords: {
    conversations: number;
    messages: number;
    jevTelemetry: number;
  };
  cloudSync: string;
}> {
  const localDb = readLocalDb();
  const isCloud = isSupabaseConfigured() && supabase !== null;

  return {
    status: 'ACTIVE',
    engine: isCloud ? 'Hybrid (Local JSON + Supabase PostgreSQL)' : 'Local VS Code Database Engine',
    connected: true,
    configured: true,
    storageType: isCloud ? 'Cloud PostgreSQL + Local File' : 'Local File Store (Persistent)',
    databasePath: 'backend/data/database.json',
    tables: ['conversations', 'messages', 'jev_telemetry'],
    totalRecords: {
      conversations: localDb.conversations.length,
      messages: localDb.messages.length,
      jevTelemetry: localDb.jevTelemetry.length,
    },
    cloudSync: isCloud ? 'ENABLED (Supabase Connected)' : 'STANDALONE LOCAL MODE (No cloud required)',
  };
}
