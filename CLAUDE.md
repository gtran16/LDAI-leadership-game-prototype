# The Leadership Game: project guide for Claude Code

Read this before touching code. Updated Fri Nov 27, 2026, at the end of the freeze session.

## Where things stand

The class version is built, hosted and in its final playtest.
- **The project:** EDUC 565A final (Dr. Hyde), due **Thu Dec 3**. Only the written proposal is graded. The game is extra credit, demoed live to a small group.
- **Who writes what:** Giselle writes the proposal and presentation herself. Nothing in this repo writes submission language.

**Freeze steps left:**
1. Final playtest on the hosted link (Giselle).
2. Fix blockers only. Anything else goes to "After freeze".
3. Add the live-run notes to `docs/build-log.md`.
4. Tag `v1.0-class-submission` and stop. The class repo doesn't change after the tag.

**Links**
- Hosted game: https://gtran16.github.io/LDAI-leadership-game-prototype/
- claude.ai artifact (same file): https://claude.ai/artifact/FXVxorJ1BrmATtM7j2kQbT
- AI relay: https://leadership-game-ai.leadership-game-ai.workers.dev (Cloudflare Worker)
- Project Kit tracker (Giselle's, read-only to Claude Code): https://claude.ai/artifact/Up5doxfUiLKbr5VqguzRkk

## The game in one screen
- **The setup:** the player is Cleo, a support manager three months into the job at Tidewell (fictional clinic-scheduling software, 650 people).
- **The cast:** boss Noor, peer Teo, reports Remi, Jan and Ravi. All use they/them. The new customer is Northfield Health.
- **Flow:**
  1. Benchmark: one short scenario.
  2. Six-screen intro.
  3. **Six decisions with a 2-1-3 support fade:** D1–2 pick everything; D3 picks the plan and writes the tradeoff and first words; D4–6 write all three.
  4. Readiness check-in in **five cards**. "One last check" (the same benchmark scenario) sits inside card 4.
  5. A **1:1 sheet** for the player's manager.
- **Four meters** (team, boss, business, wellbeing), 0 to 10. Code caps each move at ±2 and owns wellbeing and the verdict.
- **Verdict:** "Ready now" needs meters out of the red **and** at least 80% of written checks named.
- **Completeness rating** (D3–6): the player rates how complete their answer is, and code compares it with the judge's checks on the parts they wrote.
- **Layout:** an office desk. Left: tabs Team / Scene / Questions / Story. Center: the memo and cards. Right: the Skill guide on a clipboard. Top: the status board.
- **Pages:** Home · How the game works · Skills (Plan, Tradeoff, Delivery; practice minigames are "coming soon") · How it's made.

## Repo layout

| Path | What it is |
|---|---|
| `index.html` | The whole game, one file, no build step. Shell (the `LG` object and the AI seam), the game (`GAME` closure), then the pages and the router. |
| `worker/` | Cloudflare Worker. `src/index.js` holds the origin check, the KV daily cap (125), the tier-to-model map, thinking off and the workspace header. `wrangler.toml` holds the vars and the KV id. The secret `ANTHROPIC_API_KEY` lives in Cloudflare only. |
| `tests/` | `unit.js` (pure logic via `GAME.__test`), `smoke.js` (a full game at 1280 and 375 px; also checks the 1:1 sheet fits one page and holds no game names), `qa.js` (failure modes, navigation, the Worker path, overflow), `screens.js`, `stub.js` (canned replies matched on each prompt's opening line). |
| `docs/` | `system-diagrams.md` and `diagrams/` (SVG plus `make_diagrams.py`), `model-right-sizing.md`, `citations-to-verify.md`, `build-log.md`, `close-out.md`. |

**Run:**

```bash
npm test
```

It runs unit, then smoke, then QA. Run it after every change; it must pass before a push.

## How the code works
- **One AI seam.** `LG.sample()` returns claude.ai's `window.claude.use('sample')` when present. Otherwise it returns `LG.workerSample`, which posts `{ prompt, modelTier }` to `LG.WORKER_URL`. Callers use `sample(prompt, { modelTier })` and expect `{ text, truncated }`.
- **`ask(name, prompt, tier)`** calls `sample`, parses the JSON, retries once, and logs to the run log. Designer view → Run log keeps the last three runs in the browser.
- **Prompts in `index.html`** (they're the source of truth):
  - `SHARED` (7 rules)
  - `P2A` scenario builder (also writes `memo {from, subject}`)
  - `P2B` decision builder
  - `P3` judge (five checks: protects, cost, who_pays, plan_check, delivery_check)
  - `P4` narrator ("Another way:" on every line)
  - `P7` readiness check-in
  - `P8` quick-check judge (four marks, including delivery)
- **Model tiers:** `TIER` maps P2, P3 and P7 to `default` (Sonnet 5.5) and P4 and P8 to `quick` (Haiku 5.5). Notes are in `docs/model-right-sizing.md`.
- **Constants:** `PROMPTS_APPROVED = true`, `NDEC = 6`, `WORLD_DATA` (decisions picked from the ten seeds: old 1, 2, 3, 4, 5, 10).
- **Logic that belongs to code, not AI:**
  - `wellbeingRule`
  - `zeroGuard`: if the judge moves nothing, use the picked option's deltas
  - `movesFrom` (±2 cap)
  - `verdictOf`
  - `calRead` / `calLevel` / `writtenKeys`: the completeness read
  - `sheetData`: the 1:1 sheet; no game names, by design
- **Type system:** Nunito for all game UI. Courier Prime only for in-world paperwork (memo letterhead, the 1:1 stamp). The colors are CSS tokens in the last `<style>` block.

## Rules that don't bend
1. **Prompt and content review gate.** Show Giselle every prompt change and every piece of new player-facing text word for word before it's used.
2. **Fictional content only.** No employer materials, no real names. Never use Koa, Giselle or Wren in generated casts. Every scenario is set at a mid-sized software company.
3. **No exposed API key** in any page, repo or commit. The key lives only as the Worker secret, and Giselle enters it herself (`npx wrangler secret put ANTHROPIC_API_KEY` in `worker/`).
4. **Relative time only** in game text ("next week"), never dates.
5. **Name check.** Never name a JS function or global `top`, `name`, `status`, `parent`, `self`, `close` or similar browser globals.
6. **Models.** Pick the lightest model a call needs, and name an open-weight equivalent for later self-hosting.
7. **Diagram colors:** player teal, AI purple, code gray.
8. **Citations in APA 7,** checked against the course syllabi or the PDFs. Open items go in `docs/citations-to-verify.md`.

## How Giselle works
- Straight talk, no flattery.
- Ask a clarifying question before flagging a problem.
- When something is ambiguous, make one recommendation and say why.
- Proceed on code fixes; come back only for wording and definitional choices.
- Batch questions.
- Show mockups before redesigning.
- UX and learning design first; easy to read.

## Deploying
- **Game:** pushing to `main` updates GitHub Pages within about a minute. Also publish `index.html` to the claude.ai artifact above with the Artifact tool, using the same URL.
- **Worker:** run `npx wrangler deploy` in `worker/` (wrangler is logged in on this Mac). The KV namespace `USAGE` and the workspace id are already in `wrangler.toml`.
- **Budget:** $10 prepaid in the Anthropic Console with auto-reload **off**, so the game can't spend more.

## After freeze (don't start before the tag)
- A prompt-wide review for redundancy, consistency and length.
- The practice minigames (5 rounds per skill: 2 fixed, 3 written) on the Skills page.
- The mobile layout: the left panel sits above the scene at phone width.
- A second repo for the real game: split the prompts and world into files, RunPod hosting with open-weight models.
- A facilitator-view mockup, Giselle's spot-check of P8 marks, a retrospective.
- **After class:** delete the Worker or revoke the key.

## Logging
Write the dated close-out in `docs/close-out.md` and the AI-use record in `docs/build-log.md`. Giselle carries them to her tracker.
