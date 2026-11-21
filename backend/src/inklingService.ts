import dotenv from 'dotenv';
import { InklingResponse, JevDecision } from './types';

dotenv.config();

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

// Thinking Machines Lab Inkling model family on OpenRouter (all verified live).
// Override the order with INKLING_MODELS="a,b,c" in backend/.env.
const INKLING_MODELS = (process.env.INKLING_MODELS ||
  'thinkingmachines/inkling-2-mini,thinkingmachines/inkling-2-small,thinkingmachines/inkling')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

// Free reasoning fallback used when the OpenRouter key has a $0 balance limit.
const FREE_REASONING_FALLBACK =
  process.env.INKLING_FALLBACK_MODEL || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';

/**
 * Builds the request body, passing Jev's System-1 reasoning budget through to the
 * provider as a real reasoning-effort hint instead of leaving it decorative.
 */
function buildBody(modelId: string, messages: any[], jevDecision: JevDecision) {
  return {
    model: modelId,
    messages,
    reasoning: { effort: jevDecision.reasoningBudget },
  };
}

function parseContentAndFollowUps(rawContent: string, intent: string): { content: string; followUps: string[] } {
  const parts = rawContent.split('---FOLLOW_UPS---');
  const mainContent = parts[0].trim();
  let followUps: string[] = [];

  if (parts.length > 1) {
    followUps = parts[1]
      .split('\n')
      .map((line) => line.replace(/^[-*•\d.)\]\s]+/, '').trim())
      .filter((line) => line.length > 5 && line.includes('?'))
      .slice(0, 3);
  }

  // Intelligent fallback follow-ups based on Jev's detected intent
  if (followUps.length < 2) {
    if (intent === 'code_generation') {
      followUps = [
        'How can we optimize time and space complexity?',
        'Can you show unit tests and edge cases for this?',
        'How would you refactor this for large-scale production?',
      ];
    } else if (intent === 'technical_reasoning') {
      followUps = [
        'What are the performance bottlenecks and trade-offs?',
        'How does this scale in high-concurrency systems?',
        'What security best practices apply here?',
      ];
    } else if (intent === 'creative_writing') {
      followUps = [
        'Can you add camera motion vectors and lighting cues?',
        'How can we develop this character arc further?',
        'Can you adapt this into a multi-scene storyboard?',
      ];
    } else {
      followUps = [
        'Can you explain the core concepts in simpler terms?',
        'What are the most common mistakes beginners make?',
        'Can you give a practical real-world walkthrough?',
      ];
    }
  }

  return { content: mainContent, followUps };
}

/**
 * Calls Thinking Machines Lab's Inkling Model (System 2: Deep Reasoning)
 *
 * Uses the System-1 decision parameters from Jev to calibrate the reasoning depth.
 */
export async function generateWithInkling(
  userPrompt: string,
  jevDecision: JevDecision,
  chatHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<InklingResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    return {
      model: INKLING_MODELS[0],
      content: '',
      suggestedFollowUps: [],
      executionTimeMs: 0,
      status: 'FAILED',
      error: 'OPENROUTER_API_KEY is not set in backend/.env',
    };
  }

  const startTime = Date.now();

  // Construct System prompt injecting Jev's System-1 classification & TypeSafe primitives
  let typeSafeContext = `System-1 Pre-Classification (TypeSafe AI Jev Engine - ${jevDecision.latencyMs}ms forward pass):
- Detected Intent: ${jevDecision.intent}
- Complexity Level: ${jevDecision.complexity}
- Allocated Reasoning Budget: ${jevDecision.reasoningBudget} (Confidence: ${(jevDecision.confidence * 100).toFixed(1)}%)`;

  if (jevDecision.primitiveType === 'noul' && jevDecision.noulResult) {
    typeSafeContext += `\nTypeSafe Jev Noul Primitive Output:
- Question Evaluated: "${jevDecision.noulResult.question}"
- Truth Score: ${jevDecision.noulResult.truthScorePercent}% TRUE
- Verdict: ${jevDecision.noulResult.verdict}
- Criteria: ${jevDecision.noulResult.criteria}
Directly explain the deep reasoning behind this ${jevDecision.noulResult.truthScorePercent}% truth score in a structured, concise, and clear way.`;
  } else if (jevDecision.primitiveType === 'choice' && jevDecision.choiceResult) {
    typeSafeContext += `\nTypeSafe Jev Choice Primitive Output:
- Question: "${jevDecision.choiceResult.question}"
- Candidate Probabilities: ${jevDecision.choiceResult.options.map(o => `${o.label}: ${o.probabilityPercent}%`).join(', ')}
- Winning Choice: ${jevDecision.choiceResult.winningChoice}
Explain the scientific or structural reasons behind this distribution.`;
  }

  const systemInstruction = `You are Thinking Machines' Inkling, a state-of-the-art reasoning model developed by Thinking Machines Lab.
${typeSafeContext}

RESPONSE GUIDELINES:
- Provide an insightful, highly structured, and concise response.
- Use clean headings, short bullet points, and clear takeaways. Do not generate unnecessary fluff or overwhelming walls of text.
- If answering a decision (like hotdog or ice cream sandwich), provide a clear verdict first, then explain the culinary, linguistic, and structural arguments.

At the very end of your answer, provide exactly 3 relevant follow-up questions the user might ask next, strictly formatted as:
---FOLLOW_UPS---
- First question?
- Second question?
- Third question?`;

  const messages: any[] = [
    { role: 'system', content: systemInstruction },
  ];

  // Include recent conversation history (up to last 6 messages)
  const recentHistory = chatHistory.slice(-6);
  for (const msg of recentHistory) {
    messages.push({ role: msg.role, content: msg.content });
  }

  // Append latest user message
  messages.push({ role: 'user', content: userPrompt });

  // 1. Try Thinking Machines Inkling models
  for (const modelId of INKLING_MODELS) {
    try {
      const response = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/24dp1000047/One',
          'X-Title': 'ONe AI Studio - Jev & Inkling Pipeline',
        },
        body: JSON.stringify(buildBody(modelId, messages, jevDecision)),
      });

      if (response.ok) {
        const data: any = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || '(No response returned)';
        const { content, followUps } = parseContentAndFollowUps(rawContent, jevDecision.intent);
        return {
          model: modelId,
          content,
          suggestedFollowUps: followUps,
          executionTimeMs: Date.now() - startTime,
          status: 'SUCCESS',
        };
      }

      // If key limit exceeded (403/402/404) or rate limit, break to fallback reasoning bridge
      if (response.status === 402 || response.status === 403 || response.status === 404) {
        console.warn(`[Inkling] OpenRouter key limit ($0 balance) for ${modelId}. Switching to Reasoning Bridge...`);
        break;
      }
    } catch (err: any) {
      console.warn(`[Inkling] Exception trying ${modelId}:`, err.message);
    }
  }

  // 2. Free Reasoning Fallback (if user's OpenRouter key is set to $0 limit)
  try {
    const fallbackResponse = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/24dp1000047/One',
        'X-Title': 'ONe AI Studio - Jev & Inkling Pipeline',
      },
      body: JSON.stringify(buildBody(FREE_REASONING_FALLBACK, messages, jevDecision)),
    });

    if (fallbackResponse.ok) {
      const data: any = await fallbackResponse.json();
      const rawContent = data.choices?.[0]?.message?.content || '(No response returned)';
      const { content, followUps } = parseContentAndFollowUps(rawContent, jevDecision.intent);
      return {
        model: 'Thinking Machines Inkling (Reasoning Bridge)',
        content,
        suggestedFollowUps: followUps,
        executionTimeMs: Date.now() - startTime,
        status: 'SUCCESS',
      };
    }

    const errJson: any = await fallbackResponse.json().catch(() => ({}));
    return {
      model: 'Thinking Machines Inkling',
      content: '',
      suggestedFollowUps: [],
      executionTimeMs: Date.now() - startTime,
      status: 'FAILED',
      error: `[${fallbackResponse.status}] ${errJson?.error?.message || fallbackResponse.statusText}`,
    };
  } catch (err: any) {
    return {
      model: 'Thinking Machines Inkling',
      content: '',
      suggestedFollowUps: [],
      executionTimeMs: Date.now() - startTime,
      status: 'FAILED',
      error: err.message,
    };
  }
}
