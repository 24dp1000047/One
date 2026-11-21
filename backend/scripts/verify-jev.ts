/**
 * Verifies the real System-1 (Jev) and System-2 (Inkling) wiring.
 *
 *   cd backend
 *   npm run verify
 *
 * Requires OPENROUTER_API_KEY in backend/.env. Each case prints the raw
 * decision so you can confirm Jev is really classifying, not falling back.
 */
import dotenv from 'dotenv';
import { evaluateWithJev, JEV_MODEL_ID } from '../src/jevEngine';
import { generateWithInkling } from '../src/inklingService';

dotenv.config();

const CASES: { label: string; prompt: string; options?: string[] }[] = [
  {
    label: 'truth evaluation (noul)',
    prompt: 'Is an ice cream sandwich a sandwich?',
  },
  {
    label: 'truth evaluation (noul)',
    prompt: 'Is a tomato a fruit?',
  },
  {
    label: 'choice primitive with explicit options',
    prompt: 'What colour is the sky during a severe tornado?',
    options: ['seafoam green', 'grey', 'indigo'],
  },
  {
    label: 'code intent',
    prompt: 'Write a TypeScript debounce function with leading and trailing edge options.',
  },
  {
    label: 'creative intent',
    prompt: 'Write a one-scene noir opening with anamorphic lighting notes.',
  },
  {
    label: 'simple factual',
    prompt: 'What is the capital of Karnataka?',
  },
];

async function main() {
  const key = (process.env.OPENROUTER_API_KEY || '').trim();
  if (!key) {
    console.error('✗ OPENROUTER_API_KEY is not set. Copy .env.example to .env and add your key.');
    process.exit(1);
  }

  console.log(`Jev model: ${JEV_MODEL_ID}\n`);

  let degradedCount = 0;

  for (const c of CASES) {
    console.log('─'.repeat(72));
    console.log(`CASE  [${c.label}]`);
    console.log(`PROMPT "${c.prompt}"${c.options ? `  options=${JSON.stringify(c.options)}` : ''}`);

    const d = await evaluateWithJev(c.prompt, c.options);
    if (d.degraded) degradedCount++;

    console.log(
      `  intent=${d.intent}  complexity=${d.complexity}  budget=${d.reasoningBudget}  ` +
        `primitive=${d.primitiveType}  confidence=${d.confidence.toFixed(3)}  ${d.latencyMs}ms`
    );
    if (d.noulResult) {
      console.log(
        `  NOUL   P(true)=${(d.noulResult.truthScorePercent / 100).toFixed(3)} ` +
          `(${d.noulResult.truthScorePercent}%)  verdict=${d.noulResult.verdict}`
      );
    }
    if (d.choiceResult) {
      console.log(`  CHOICE winner="${d.choiceResult.winningChoice}"`);
      for (const o of d.choiceResult.options) {
        console.log(`         ${o.label.padEnd(18)} ${String(o.probabilityPercent).padStart(5)}%`);
      }
    }
    if (d.degraded) console.log(`  ✗ DEGRADED: ${d.error}`);
  }

  console.log('─'.repeat(72));
  console.log('\nSystem 2 smoke test (single Inkling call)…');
  const first = await evaluateWithJev('Explain what a System One decision model is in two sentences.');
  const ink = await generateWithInkling(
    'Explain what a System One decision model is in two sentences.',
    first
  );
  console.log(`  model=${ink.model}  status=${ink.status}  ${ink.executionTimeMs}ms`);
  if (ink.status !== 'SUCCESS') console.log(`  ✗ ${ink.error}`);
  else console.log(`  reply: ${ink.content.slice(0, 160)}…`);

  console.log(
    `\nDone. ${CASES.length - degradedCount}/${CASES.length} Jev decisions were live.` +
      (degradedCount ? ` ${degradedCount} degraded — see errors above.` : '')
  );
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
