import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { evaluateWithJev } from './jevEngine';
import { generateWithInkling } from './inklingService';
import { ChatApiResponse } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Health check & System Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    system1: {
      name: 'Jev',
      developer: 'TypeSafe AI',
      role: 'System-1 Fast Decision Engine & Intent Classifier',
      typicalLatency: '<100ms',
    },
    system2: {
      name: 'Inkling',
      developer: 'Thinking Machines Lab',
      role: 'System-2 Deep Reasoning & Agentic Generation Engine',
      contextWindow: '1M tokens',
    },
    timestamp: new Date().toISOString(),
  });
});

// 2. Chat API: Dual-Brain Pipeline (Jev System 1 -> Inkling System 2)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const trimmedPrompt = message.trim();

    // Step 1: Jev System-1 Fast Decision & Intent Classification (<100ms)
    console.log(`\n[Pipeline] 1. Running Jev System-1 Decision on: "${trimmedPrompt.slice(0, 40)}..."`);
    const jevDecision = await evaluateWithJev(trimmedPrompt);
    console.log(
      `[Jev] Intent: ${jevDecision.intent} | Complexity: ${jevDecision.complexity} | Budget: ${jevDecision.reasoningBudget} (${jevDecision.latencyMs}ms)`
    );

    // Step 2: Thinking Machines Inkling System-2 Deep Reasoning
    console.log(`[Pipeline] 2. Dispatching to Thinking Machines Inkling (System 2)...`);
    const inklingResult = await generateWithInkling(trimmedPrompt, jevDecision, history || []);
    console.log(
      `[Inkling] Status: ${inklingResult.status} | Time: ${inklingResult.executionTimeMs}ms`
    );

    const apiResponse: ChatApiResponse = {
      success: inklingResult.status === 'SUCCESS',
      jevDecision,
      response: inklingResult.content,
      suggestedFollowUps: inklingResult.suggestedFollowUps || [],
      model: inklingResult.model,
      executionTimeMs: jevDecision.latencyMs + inklingResult.executionTimeMs,
      error: inklingResult.error,
    };

    return res.json(apiResponse);
  } catch (err: any) {
    console.error('[Server Error]', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  }
});

// 3. Cinematic Prompt Enhancer API
app.post('/api/enhance-prompt', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const jevDecision = await evaluateWithJev(prompt);

    const enhancementPrompt = `Transform this basic user concept into a high-production cinematic master prompt for a film director:\n"${prompt}"\n\nInclude camera motion vectors, lighting color codes, lens choices (e.g. anamorphic 35mm), and atmospheric depth. Provide only the enhanced prompt text.`;

    const inklingResult = await generateWithInkling(enhancementPrompt, jevDecision);

    return res.json({
      success: inklingResult.status === 'SUCCESS',
      jevDecision,
      enhancedPrompt: inklingResult.content || prompt,
      executionTimeMs: inklingResult.executionTimeMs,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 ONe AI Studio Backend running on http://localhost:${PORT}`);
  console.log('🧠 System 1: Jev (TypeSafe AI Decision Engine)');
  console.log('🤖 System 2: Inkling (Thinking Machines Lab Reasoning)');
  console.log('====================================================');
});
