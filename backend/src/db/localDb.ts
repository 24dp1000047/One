import fs from 'fs';
import path from 'path';
import { JevDecision } from '../types';

export interface LocalDbSchema {
  conversations: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  }[];
  messages: {
    id: string;
    conversationId: string;
    role: 'user' | 'assistant';
    content: string;
    model: string;
    createdAt: string;
  }[];
  jevTelemetry: {
    id: string;
    messageId: string;
    conversationId: string;
    intent: string;
    complexity: string;
    confidence: number;
    reasoningBudget: string;
    latencyMs: number;
    primitiveType: string;
    truthScorePercent?: number | null;
    verdict?: string | null;
    createdAt: string;
  }[];
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory and database file exist
function initDb(): LocalDbSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: LocalDbSchema = {
      conversations: [
        {
          id: 'conv-sample-1',
          title: 'TypeSafe Decision: Ice Cream Sandwich',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      messages: [
        {
          id: 'msg-u-sample',
          conversationId: 'conv-sample-1',
          role: 'user',
          content: 'Is an ice cream sandwich a sandwich?',
          model: 'user',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'msg-ai-sample',
          conversationId: 'conv-sample-1',
          role: 'assistant',
          content: 'An ice cream sandwich is taxonomically classified as a confection rather than a sandwich.',
          model: 'Thinking Machines Inkling',
          createdAt: new Date().toISOString(),
        },
      ],
      jevTelemetry: [
        {
          id: 'tel-sample-1',
          messageId: 'msg-ai-sample',
          conversationId: 'conv-sample-1',
          intent: 'decision_noul',
          complexity: 'simple',
          confidence: 0.94,
          reasoningBudget: 'low',
          latencyMs: 48,
          primitiveType: 'noul',
          truthScorePercent: 33,
          verdict: 'CONTESTED / AMBIGUOUS',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { conversations: [], messages: [], jevTelemetry: [] };
  }
}

export function readLocalDb(): LocalDbSchema {
  return initDb();
}

export function saveToLocalDb(
  conversationId: string,
  userPrompt: string,
  aiResponse: string,
  model: string,
  jevDecision: JevDecision
): boolean {
  try {
    const db = readLocalDb();

    // 1. Upsert Conversation
    const title = userPrompt.slice(0, 45) + (userPrompt.length > 45 ? '...' : '');
    const existingConv = db.conversations.find((c) => c.id === conversationId);
    if (existingConv) {
      existingConv.updatedAt = new Date().toISOString();
    } else {
      db.conversations.unshift({
        id: conversationId,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 2. Insert Messages
    const userMsgId = 'msg-u-' + Date.now();
    db.messages.push({
      id: userMsgId,
      conversationId,
      role: 'user',
      content: userPrompt,
      model: 'user',
      createdAt: new Date().toISOString(),
    });

    const aiMsgId = 'msg-ai-' + (Date.now() + 1);
    db.messages.push({
      id: aiMsgId,
      conversationId,
      role: 'assistant',
      content: aiResponse,
      model,
      createdAt: new Date().toISOString(),
    });

    // 3. Insert Jev System-1 Telemetry
    db.jevTelemetry.unshift({
      id: 'tel-' + Date.now(),
      messageId: aiMsgId,
      conversationId,
      intent: jevDecision.intent,
      complexity: jevDecision.complexity,
      confidence: jevDecision.confidence,
      reasoningBudget: jevDecision.reasoningBudget,
      latencyMs: jevDecision.latencyMs,
      primitiveType: jevDecision.primitiveType,
      truthScorePercent: jevDecision.noulResult?.truthScorePercent ?? null,
      verdict: jevDecision.noulResult?.verdict ?? jevDecision.choiceResult?.winningChoice ?? null,
      createdAt: new Date().toISOString(),
    });

    // Keep DB file clean (cap records at 100)
    if (db.messages.length > 200) db.messages = db.messages.slice(-200);
    if (db.jevTelemetry.length > 100) db.jevTelemetry = db.jevTelemetry.slice(0, 100);

    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`💾 [Local DB] Persisted interaction to ${DB_FILE}`);
    return true;
  } catch (err: any) {
    console.error('❌ [Local DB] Error saving:', err.message);
    return false;
  }
}
