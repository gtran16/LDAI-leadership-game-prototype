# The Leadership Game: Claude Code handoff (code freeze)

Written Fri Nov 27, 2026 from the 565A claude.ai project, the Project Kit tracker, and the build chats of Nov 16 to 21. Read this whole file before touching code.

## Goal

Freeze the class version of The Leadership Game today (Fri Nov 27; Sat Nov 28 night is the hard backstop). Freeze means: V4 with approved prompts, one clean live play-through, pushed to the class repo, tagged, and playable from a link.

Context: EDUC 565A final (Dr. Hyde) is due **Thu Dec 3**. Only the written proposal is graded; the game is extra credit, demoed live to a small group (3 to 5). Giselle writes the proposal and presentation herself after the freeze (Nov 29 to Dec 2). Nothing in this repo writes submission language.

## Step 0: confirm before building

The tracker was last updated Nov 20 and the last build chat ended Nov 21. Nothing is on record for Nov 22 to 27. Ask Giselle these four questions first, in one message, then adjust the task list:

1. Did player tests 2 and 3 happen? If so, paste or point to the notes.
2. Did you review the V4 prompt batch (`docs/v4-prompt-batch-review.md`)? Approve as is, or with changes?
3. Was anything changed in the V4 artifact after Nov 21, or is `game/index.html` here current?
4. Is the GitHub class repo created, and is a Cloudflare account and a dedicated Anthropic API key ready?

## What is in this folder

| Path | What it is |
| --- | --- |
| `game/index.html` | **The Leadership Game V4**, the build to freeze. Single self-contained file (~290 KB, HTML + CSS + JS, world data and prompts inline). Pulled from artifact `75a21a59-b6d3-4d82-bbd9-c3edd7c6d692`, version `1795224777-f03c`. |
| `archive/v3-full-app.html` | V3, the 10-decision version with Skills/Learn/Practice pages. Archive only; do not ship. |
| `docs/v4-prompt-batch-review.md` | Every V4 prompt and content change, waiting on Giselle's approval. |
| `CLAUDE.md` | This file. |

Live links (claude.ai, Giselle's account): V4 https://claude.ai/artifact/FXVxorJ1BrmATtM7j2kQbT · V3 https://claude.ai/artifact/Peuh8uSrTRQdxhhMGGw2xF · Project Kit tracker https://claude.ai/artifact/Up5doxfUiLKbr5VqguzRkk · System diagrams (Whiteboard) https://claude.ai/artifact/G48Ln6xNpN3pXQc5GLkFpV

## The game in one screen

- Player is **Cleo**, a support manager three months into the job at **Tidewell** (fictional clinic-scheduling software). Boss **Noor**, peer **Teo**, reports **Remi**, **Jan**, **Ravi**. All five use they/them.
- **Five decisions** with fading support: D1 pick everything · D2 write the tradeoff · D3 also write first words · D4 to D5 write plan, tradeoff and delivery.
- **Four meters** (team, boss, business, wellbeing), 0 to 10, ten-segment bars, max ±2 per decision.
- **Help drawer** (Why / Plan / Tradeoff / Delivery) over the decision; never moves the player's place; Escape closes; auto-opens once at D2, D3, D4.
- Ends in the **Readiness check-in** (P7), plus evaluation: a before/after **quick check** (P8) and the **trade-off trail** (only answers the player wrote).
- About 22 AI calls per game.

## How the code works

- **One AI seam.** Every call goes through `LG.sample()` (around line 280), which returns the artifact's `window.claude.use('sample')`. Callers use it as `sample(prompt, { modelTier, onText })` and expect `{ text, truncated }`. To run outside claude.ai, replace only this function.
- `ask(name, prompt, tier)` (around line 685) calls `sample`, parses JSON, retries once with "Reply with the JSON object only", and logs to the run log.
- `const PROMPTS_APPROVED = false;` (line 335) shows a designer-note banner on the How-this-works screen. Flip to `true` only after Giselle approves.
- `const NDEC = 5;` sets the decision count. `WORLD_DATA` holds the Tidewell world and decision seeds.
- Prompts: `SHARED` rules (7) plus P2a scenario builder, P2b decision builder, P3 judge, P4 narrator, P7 readiness check-in, P8 quick-check judge. **The prompts in `index.html` are the source of truth.** `claude/game-prompts.md` in the claude.ai project is out of date.
- Model tiers in the page: P2a, P2b, P3, P7 "default"; P4 and P8 "quick".

## Rules that do not bend

1. **Prompt review gate.** Show Giselle every prompt and every prompt change, word for word, before it is used. Same for any content you draft for the game (scenarios, pattern notes, reference answers, help text). Nothing goes live unreviewed.
2. **Fictional content only.** No employer materials (Sage, DDI), no real names. Never use the names Koa, Giselle or Wren in generated casts.
3. **No exposed API key** in any page, repo or commit. The key lives only as a Worker secret.
4. **Relative time only** in game text ("next week"), no months or dates.
5. **Name check.** Never name a JS function or global `top`, `name`, `status`, `parent`, `self`, `close` or similar browser globals. A function called `top` once froze the live game in real browsers while passing headless tests.
6. When choosing a model for a call, pick the lightest one the call needs and name an open-weight equivalent that could be self-hosted on RunPod later.
7. Diagram colors, everywhere: player = teal/green, AI = purple, code = gray.

## How Giselle works

Straight talk, no flattery. Ask a clarifying question before flagging a problem. When something is ambiguous, make one recommendation and say why. Keep back-and-forth light: proceed on code fixes, come back only for exact prompt wording or definitional choices. Batch questions. Label what is built, mocked and next.

## Tasks to freeze

Work top to bottom. Commit after each task.

### 1. Repo (15 min)
- [ ] Class repo (Giselle names it; suggest `leadership-game-565a`), served by GitHub Pages from `main`.
- [ ] Layout: `index.html` (the game, still one file, no build step), `worker/` (Cloudflare Worker), `tests/` (smoke test), `docs/` (prompt review, this handoff, a short README for testers).
- [ ] `.gitignore` covers `.dev.vars`, `.env`, `node_modules`.

### 2. Prompts (gated on Giselle)
- [ ] Apply Giselle's answer on `docs/v4-prompt-batch-review.md`. Show any edited wording back to her before it ships.
- [ ] Fix the open P7 item: `.replace('[NEXT ROLE]', 'manager of managers')` (line ~910) may not fit the five-decision refocus. Propose wording, get approval.
- [ ] Apply notes from tests 2 and 3 (Step 0), each as a row: note, change, lives in (code / content / prompt), status.
- [ ] Set `PROMPTS_APPROVED = true`.

### 3. Smoke test (45 min)
The Nov 20 smoke test lived in a chat container and is gone. Rebuild it in `tests/smoke.js` with Playwright:
- [ ] Inject a stub with `page.addInitScript()` that replaces `window.claude.use` (or `LG.sample`) and returns canned JSON matched on unique prompt phrases, e.g. `/You are the scenario builder/` for P2a. Find each prompt's opening line in `index.html`; generic matches like `/scenario/` collide.
- [ ] Each canned reply must match the exact JSON shape that prompt asks for (read the prompt's output spec).
- [ ] Play all five decisions, the check-in, the quick check before and after, and the trail. Fail on any page error or console error.
- [ ] Check the minor UI clipping item from Nov 21 (location not recorded; look at the stage banner, task card and help drawer at 375 px and 1280 px widths).

### 4. Hosting (timebox 2 hours)
Plan from the tracker (Giselle, Nov 18):
- [ ] **Key:** dedicated Anthropic API key, $10 monthly spend limit set in the Console. Giselle creates it and enters it herself as a Worker secret (`wrangler secret put ANTHROPIC_API_KEY`). Never paste it into chat or code.
- [ ] **Worker** (`worker/`, free Cloudflare plan): accepts requests only from the Pages origin; allows only the game's models; caps `max_tokens`; stops at about 125 calls a day (about 5 games at ~22 calls each); returns `{ text, truncated }` so the game needs no other change. Maps `modelTier` default → `claude-sonnet-5-5`, quick → `claude-haiku-5-5` (confirm with Giselle; open-weight equivalents to name for later RunPod hosting).
- [ ] **Game:** in `LG.sample()`, use `window.claude.use` when present (claude.ai) and the Worker otherwise. Streaming `onText` can be dropped on Pages; it only feeds the designer progress counter.
- [ ] **Bring-your-own-key fallback** after the daily cap: key kept in page memory for that visit only, sent straight to Anthropic, never saved or sent to the Worker.
- [ ] If hosting is not working when the timebox ends: freeze anyway, with the V4 claude.ai artifact as the play link and Pages as source only. Note it in the README.

### 5. Live check (45 min)
- [ ] Giselle plays one full game on the hosted link in a private window, and once from a second account or browser.
- [ ] Read the run log: no "lands/landed", no fragments, no skill names in P7, scene openings tie back to the last plan, meters move when the story names a cost.
- [ ] Fix only blockers. Everything else goes to the "After freeze" list.

### 6. Freeze (15 min)
- [ ] README for testers: what the game is, the link, what is sent to the AI (everything typed), time (target 30 to 45 min).
- [ ] Build log entry for the proposal's AI-use section: what Claude Code produced, what Giselle changed, what she verified.
- [ ] Tag `v1.0-class-submission` and stop. The class repo never changes after the tag.

## After freeze (do not start before the tag)

- Second repo for the real game (copy of the class repo): split prompts and Tidewell data into files, smoke test on every change, RunPod hosting with open-weight models.
- Facilitator view mockup from tester results (on the tracker; can be a static mockup for the proposal).
- Giselle's spot-check of P8 scores against her own marks.
- Reintroduce skills (like delegation) as scenario flavor, not a separate lens.
- Retrospective: time spent, token cost, canvas building vs Claude Code with GitHub.
- After class: delete the Worker or revoke the key.

## Where to log

Giselle's tracker is the Project Kit (Claude Doc, link above); Claude Code cannot edit it. Write a dated close-out in `docs/close-out.md` at the end of the session: tasks checked, one decision and its reason, ahead / on pace / behind, next steps. Giselle carries it to the tracker.
