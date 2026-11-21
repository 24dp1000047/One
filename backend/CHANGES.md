# Making Jev real — what changed

The System-2 half (Inkling) was already correct: `thinkingmachines/inkling`,
`inkling-2-mini` and `inkling-2-small` all exist on OpenRouter, as does the
`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` fallback.

The fake half was **Jev**, which was ~200 lines of regex with literal answers
baked in (`ice cream sandwich = 33%`, `tomato = 92%`) and a `latencyMs` padded
with `Math.random()` to look sub-100ms.

Jev is a real product. It is TypeSafe's System One decision model, served
through OpenRouter's Decisions API:

    POST https://openrouter.ai/api/alpha/decisions
    model: typesafe/jev-1.14
    $0.042 / 1M input tokens — output tokens are free — 262,144 ctx

It takes a `state` plus typed `questions` and returns calibrated probabilities
instead of prose. The primitives your `types.ts` was already modelling —
`noul` and `choice` — are its real, documented primitives. So the types needed
almost no change; only the implementation did.

## Files changed

| File | Change |
|---|---|
| `src/jevEngine.ts` | **Rewritten.** Real Decisions API client. Regex engine deleted. |
| `src/inklingService.ts` | Model list + fallback now env-driven; Jev's reasoning budget passed through as a real `reasoning.effort` hint. |
| `src/server.ts` | `/api/chat` accepts optional `options`; new `POST /api/jev/evaluate` debug route; health reports the live Jev model. |
| `src/types.ts` | `JevDecision` gains `degraded` and `error`. |
| `package.json` | Added `npm run verify`. |
| `scripts/verify-jev.ts` | New: runs real prompts through Jev and Inkling and prints the decisions. |
| `.env.example` | Documents every model ID and its price. |

## How the new engine works

One Decisions API call handles routing. All questions share a single `state`,
so the input prefix is billed once:

- `intent` — `choice` over the six `TaskIntent` values
- `complexity` — `choice` over `simple` / `moderate` / `complex`
- `needs_truth_eval` — `noul`: is the user asking for a truth verdict?
- `claim_is_true` — `noul`: is the central proposition true?

`reasoningBudget` is then derived from complexity (simple→low, moderate→medium,
complex→high) and actually sent to Inkling as `reasoning.effort`.

If `needs_truth_eval` ≥ 0.6, the `claim_is_true` probability becomes the
`noulResult`, with the real number as `truthScorePercent` and banded verdicts
(TRUE ≥ 0.85, FALSE ≤ 0.15, otherwise contested).

If the caller passes an `options` array of two or more labels and Jev classifies
the prompt as `decision_choice`, a second call runs a real `choice` question
over those exact labels and returns the full probability distribution. That is
a genuine Choice primitive, not a guess.

### Honest failure

If the API key is missing, the request times out, or the response has no
`answers` object, the engine returns `degraded: true` with the error message and
`confidence: 0`. It does not silently invent a classification. `/api/health`
reports `mode: "DEGRADED (no API key)"` in the same situation, and
`POST /api/jev/evaluate` returns HTTP 503.

## Run it

```bash
cd backend
npm install
cp .env.example .env        # then paste your OpenRouter key
npm run verify              # 6 real Jev decisions + one Inkling call
npm run dev
```

Check a single decision without generating a reply:

```bash
curl -s localhost:5000/api/jev/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Is a tomato a fruit?"}' | jq
```

Ask a real Choice primitive:

```bash
curl -s localhost:5000/api/jev/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"What colour is the sky during a severe tornado?",
       "options":["seafoam green","grey","indigo"]}' | jq
```

## Verified vs not verified

Verified against the live OpenRouter catalogue on 21 Nov 2026:

- `typesafe/jev-1.14` exists — $0.042/M in, $0/M out, 262,144 ctx
- `thinkingmachines/inkling`, `inkling-2-mini`, `inkling-2-small`,
  `inkling-small` all exist
- `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` exists and is $0
- The Decisions endpoint accepts this exact request body: a probe with an
  invalid key returns `401 User not found`, not a `400` about the payload
- `tsc --noEmit` and `npm run build` both pass

Not verified: the response-parsing path, because that needs a funded key. The
parser is written defensively (it checks every answer's `type`, treats a missing
key or unexpected type as "not answered", and never assumes a field exists), but
run `npm run verify` once with your key to confirm end to end.

## If you want a different decision model

The Decisions API hosts 45 models with the same request shape. Cheaper
alternatives to Jev, all with free output tokens:

| Model | $/1M input | Context |
|---|---|---|
| `baseten/joey-1` | 0.010 | 16k |
| `cloudflare/clef-flash` | 0.019 | 24k |
| `liquid/d1.2` | 0.020 | 65k |
| `baseten/groundhog-1` | 0.035 | 16k |
| `typesafe/jev-1.14` | 0.042 | 262k |
| `baseten/bison-1` | 0.100 | 32k |

Set `JEV_MODEL` in `.env` to switch. Jev is the right default here because it
supports all four primitives including `box`, and has the largest context of the
cheap tier.

## One thing I did not change

`/api/chat` still defaults `conversationId` to `'conv-' + date`, so every chat
that day lands in one conversation. The real fix is for the frontend to mint a
UUID per conversation and send it — worth doing, but it is a frontend change.
