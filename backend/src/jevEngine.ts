import dotenv from 'dotenv';
import {
  JevDecision,
  TaskComplexity,
  TaskIntent,
  TypeSafeChoiceResult,
  TypeSafeNoulResult,
} from './types';

dotenv.config();

/**
 * Jev System-1 Decision Engine — REAL implementation.
 *
 * Replaces the previous regex/keyword matcher with actual calls to TypeSafe's
 * Jev decision model through OpenRouter's Decisions API.
 *
 *   POST https://openrouter.ai/api/alpha/decisions
 *   model: typesafe/jev-1.14
 *
 * Jev is a System One model: it does not generate prose. You send it a `state`
 * plus typed `questions`, and it returns calibrated probabilities.
 *
 * Primitives used here:
 *   - choice  -> multi-class classification (intent, complexity, option picking)
 *   - noul    -> P(yes) for a binary question (truth evaluation)
 *
 * Pricing: $0.042 / 1M input tokens, output tokens free.
 * Docs: https://openrouter.ai/docs/guides/features/decisions
 */

const DECISIONS_ENDPOINT = 'https://openrouter.ai/api/alpha/decisions';
const JEV_MODEL = process.env.JEV_MODEL || 'typesafe/jev-1.14';
const JEV_TIMEOUT_MS = Number(process.env.JEV_TIMEOUT_MS || 8000);

/** Threshold above which a noul probability counts as "this is a truth question". */
const TRUTH_QUESTION_THRESHOLD = 0.6;

const INTENT_CRITERIA: Record<TaskIntent, string> = {
  code_generation:
    'Writing, fixing, explaining or debugging code, scripts, SQL, config files, regex or algorithms.',
  technical_reasoning:
    'System design, architecture, performance, concurrency, infrastructure, security or engineering trade-off analysis.',
  creative_writing:
    'Fiction, screenplays, scenes, poetry, characters, world-building or cinematic and stylistic prose.',
  general_dialogue:
    'Everyday conversation, factual lookups, definitions, explanations or advice that fits no other category.',
  decision_noul:
    'Asking the assistant to judge whether a proposition, classification or claim is true, such as "is a tomato a fruit?".',
  decision_choice:
    'Asking the assistant to pick which option among a set is correct or most likely, such as "what colour is the sky during a storm?".',
};

const COMPLEXITY_CRITERIA: Record<TaskComplexity, string> = {
  simple: 'One short step: a single fact, a definition, or a one-line answer.',
  moderate: 'Several steps, some nuance, or a short structured explanation.',
  complex:
    'Multi-step reasoning, long context, many constraints, or work that needs careful planning.',
};

const BUDGET_BY_COMPLEXITY: Record<TaskComplexity, 'low' | 'medium' | 'high'> = {
  simple: 'low',
  moderate: 'medium',
  complex: 'high',
};

// ---------------------------------------------------------------------------
// Decisions API wire types
// ---------------------------------------------------------------------------

interface JevNoulAnswer {
  type: 'noul';
  noul: number;
  confidence?: number;
}

interface JevChoiceAnswer {
  type: 'choice';
  choice: string;
  probabilities: Record<string, number>;
  confidence?: number;
}

type JevAnswer = JevNoulAnswer | JevChoiceAnswer;

interface JevApiResponse {
  model?: string;
  answers?: Record<string, JevAnswer>;
  usage?: { input_tokens?: number; output_tokens?: number; cost?: number };
}

interface JevQuestion {
  type: 'noul' | 'choice';
  instructions: string;
  criteria?: unknown;
}

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://github.com/24dp1000047/One',
    'X-Title': 'ONe AI Studio - Jev System 1',
  };
}

async function callJev(
  state: string,
  questions: Record<string, JevQuestion>,
  apiKey: string
): Promise<JevApiResponse> {
  const res = await fetch(DECISIONS_ENDPOINT, {
    method: 'POST',
    headers: authHeaders(apiKey),
    body: JSON.stringify({ model: JEV_MODEL, state, questions }),
    signal: AbortSignal.timeout(JEV_TIMEOUT_MS),
  });

  const raw = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(raw);
  } catch {
    json = null;
  }

  if (!res.ok) {
    const detail =
      (json && typeof json.error === 'string' && json.error) ||
      (json && json.error && json.error.message) ||
      raw.slice(0, 300) ||
      res.statusText;
    throw new Error(`Jev HTTP ${res.status}: ${detail}`);
  }

  if (!json || !json.answers) {
    throw new Error('Jev returned no answers object');
  }

  return json as JevApiResponse;
}

/** Reads a noul answer defensively. Returns null when the question went unanswered. */
function readNoul(answers: Record<string, JevAnswer> | undefined, key: string): number | null {
  const a = answers?.[key];
  if (!a || a.type !== 'noul' || typeof (a as JevNoulAnswer).noul !== 'number') return null;
  const v = (a as JevNoulAnswer).noul;
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : null;
}

/** Reads a choice answer defensively. Returns null when the question went unanswered. */
function readChoice(
  answers: Record<string, JevAnswer> | undefined,
  key: string
): { choice: string; probabilities: Record<string, number>; confidence: number } | null {
  const a = answers?.[key];
  if (!a || a.type !== 'choice') return null;
  const c = a as JevChoiceAnswer;
  if (typeof c.choice !== 'string') return null;
  return {
    choice: c.choice,
    probabilities: c.probabilities || {},
    confidence: typeof c.confidence === 'number' ? c.confidence : 0,
  };
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function verdictFromProbability(p: number): TypeSafeNoulResult['verdict'] {
  if (p >= 0.85) return 'TRUE';
  if (p <= 0.15) return 'FALSE';
  return 'CONTESTED / AMBIGUOUS';
}

function isTaskIntent(v: string | undefined): v is TaskIntent {
  return (
    !!v &&
    Object.prototype.hasOwnProperty.call(INTENT_CRITERIA, v)
  );
}

function isTaskComplexity(v: string | undefined): v is TaskComplexity {
  return !!v && Object.prototype.hasOwnProperty.call(COMPLEXITY_CRITERIA, v);
}

/** Honest degradation: Jev never ran, so nothing was classified. */
function degradedDecision(startTime: number, error: string): JevDecision {
  return {
    engine: 'Jev (TypeSafe AI System One)',
    intent: 'general_dialogue',
    complexity: 'moderate',
    confidence: 0,
    reasoningBudget: 'medium',
    latencyMs: Date.now() - startTime,
    primitiveType: 'classifier',
    stateExplanation: 'Jev was unreachable, so no real classification was made. Defaults applied.',
    degraded: true,
    error,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Classifies a prompt with the real Jev decision model and, when the prompt is a
 * decision question, evaluates it with the matching TypeSafe primitive.
 *
 * @param prompt  The user's raw message.
 * @param options Optional candidate labels. When two or more are supplied and Jev
 *                classifies the prompt as `decision_choice`, a second Jev call runs
 *                a real `choice` question over those exact options.
 */
export async function evaluateWithJev(prompt: string, options?: string[]): Promise<JevDecision> {
  const startTime = Date.now();
  const state = prompt.trim();
  const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();

  if (!apiKey) {
    return degradedDecision(startTime, 'OPENROUTER_API_KEY is not set in backend/.env');
  }

  if (!state) {
    return degradedDecision(startTime, 'Empty prompt');
  }

  // --- Call 1: routing + truth evaluation in a single request -----------------
  // All questions share one `state`, so the input prefix is prefixed and billed once.
  const questions: Record<string, JevQuestion> = {
    intent: {
      type: 'choice',
      instructions: 'Classify the primary task the user is asking the assistant to perform.',
      criteria: INTENT_CRITERIA,
    },
    complexity: {
      type: 'choice',
      instructions: 'How much reasoning does answering this request correctly require?',
      criteria: COMPLEXITY_CRITERIA,
    },
    needs_truth_eval: {
      type: 'noul',
      instructions:
        'Is the user asking the assistant to judge whether a factual proposition, classification or claim is true?',
      criteria: {
        true: 'The request asks for a verdict on the truth, correctness or classification of a claim.',
        false:
          'The request asks for content to be produced or a task performed, rather than a truth verdict.',
      },
    },
    claim_is_true: {
      type: 'noul',
      instructions: 'Is the central factual proposition asserted in the request true?',
      criteria: {
        true: 'The proposition is accurate under the standard definition of the terms it uses.',
        false: 'The proposition is inaccurate, or rests on a category error.',
      },
    },
  };

  let first: JevApiResponse;
  try {
    first = await callJev(state, questions, apiKey);
  } catch (err: any) {
    console.error('[Jev] Decisions API call failed:', err.message);
    return degradedDecision(startTime, err.message);
  }

  const intentAnswer = readChoice(first.answers, 'intent');
  const complexityAnswer = readChoice(first.answers, 'complexity');
  const needsTruth = readNoul(first.answers, 'needs_truth_eval');
  const claimTrue = readNoul(first.answers, 'claim_is_true');

  const intent: TaskIntent = isTaskIntent(intentAnswer?.choice)
    ? intentAnswer!.choice
    : 'general_dialogue';
  const complexity: TaskComplexity = isTaskComplexity(complexityAnswer?.choice)
    ? complexityAnswer!.choice
    : 'moderate';

  // Confidence comes from the intent distribution. `confidence` measures how
  // concentrated the distribution is, not the winning option's probability.
  const confidence = intentAnswer?.confidence ?? 0;
  const reasoningBudget = BUDGET_BY_COMPLEXITY[complexity];

  const wantsTruthEval = needsTruth !== null && needsTruth >= TRUTH_QUESTION_THRESHOLD;
  const validOptions = (options || []).map((o) => String(o).trim()).filter(Boolean);

  const base: JevDecision = {
    engine: 'Jev (TypeSafe AI System One)',
    intent,
    complexity,
    confidence,
    reasoningBudget,
    latencyMs: Date.now() - startTime,
    primitiveType: 'classifier',
    stateExplanation:
      `Jev classified this as ${intent} at ${complexity} complexity ` +
      `(p=${(intentAnswer?.probabilities?.[intent] ?? 0).toFixed(3)}, ` +
      `distribution confidence=${confidence.toFixed(3)}).`,
  };

  // --- Call 2a: real Choice primitive over caller-supplied options -----------
  if (validOptions.length >= 2 && intent === 'decision_choice') {
    try {
      const choiceCall = await callJev(
        state,
        {
          pick: {
            type: 'choice',
            instructions: 'Which of these options is the correct or most likely answer to the request?',
            criteria: Object.fromEntries(validOptions.map((o) => [o, `The answer is "${o}".`])),
          },
        },
        apiKey
      );

      const pick = readChoice(choiceCall.answers, 'pick');
      if (pick) {
        const ranked = Object.entries(pick.probabilities)
          .sort((a, b) => b[1] - a[1])
          .map(([label, p]) => ({
            label,
            probabilityPercent: Math.round(p * 1000) / 10,
          }));

        const choiceResult: TypeSafeChoiceResult = {
          question: state,
          options: ranked,
          winningChoice: pick.choice,
          confidence: pick.confidence,
        };

        return {
          ...base,
          primitiveType: 'choice',
          latencyMs: Date.now() - startTime,
          choiceResult,
          stateExplanation:
            `Jev Choice over ${validOptions.length} options picked "${pick.choice}" ` +
            `(p=${(pick.probabilities[pick.choice] ?? 0).toFixed(3)}, confidence=${pick.confidence.toFixed(3)}).`,
        };
      }
    } catch (err: any) {
      console.warn('[Jev] Choice primitive failed, falling back to classifier:', err.message);
    }
  }

  // --- Call 2b: real Noul primitive for truth questions ----------------------
  if (wantsTruthEval && claimTrue !== null) {
    const noulResult: TypeSafeNoulResult = {
      question: state.endsWith('?') ? state : `${state}?`,
      subject: state.slice(0, 60),
      category: 'Jev Noul truth evaluation',
      truthScorePercent: Math.round(claimTrue * 100),
      verdict: verdictFromProbability(claimTrue),
      confidence: needsTruth ?? claimTrue,
      criteria:
        'Jev Noul evaluated the central proposition against the standard definitions of the terms used. ' +
        'Probability is P(true); the verdict band is TRUE >= 0.85, FALSE <= 0.15, otherwise contested.',
    };

    return {
      ...base,
      primitiveType: 'noul',
      latencyMs: Date.now() - startTime,
      noulResult,
      stateExplanation:
        `Jev Noul returned P(true)=${claimTrue.toFixed(3)} for the central claim, ` +
        `banded as ${noulResult.verdict}.`,
    };
  }

  return { ...base, latencyMs: Date.now() - startTime };
}

/** Exposed so callers can report which Jev version is live. */
export const JEV_MODEL_ID = JEV_MODEL;
