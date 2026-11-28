# The Leadership Game

A decision game for first-time managers. You play Cleo, a new support manager at a fictional software company, through six decisions. In each one you make a plan, name the tradeoff (what it protects, what it costs, who pays), and practice your first words to the person. AI writes the scenes and the feedback live as you play.

**Play:** https://gtran16.github.io/LDAI-leadership-game-prototype/

## For testers
- **Time:** about 45 to 60 minutes. Play on a laptop or desktop; the phone layout works but isn't polished yet.
- **What you'll do:**
  1. Answer a short benchmark scenario.
  2. Play six decisions: first you pick, then you write more yourself.
  3. Give your own read, then read Noor's check-in and what happened next.
  4. After the story ends, answer the benchmark again.
  5. Leave with a one-page sheet to bring to a 1:1 with your manager.
- **What's sent to AI:** everything you type. That includes your plans, tradeoffs, first words, reflections and benchmark answers. It goes through a small relay server to Anthropic's API, and the relay doesn't store it. There are no accounts. Your browser keeps a run log of your last three games.
- **Please don't type** real names or private details. The company and people are fictional.
- **If you see** "The shared AI budget for today is used up", the game has hit its daily limit. Try again tomorrow.
- **The How it's made page** explains what the AI does, what code decides, the limits of the game, and the sources.

## What's in this repo

| Path | What it is |
|---|---|
| `index.html` | The whole game: one file, no build step. Screens, world data, the six AI prompts and the rules. |
| `worker/` | The Cloudflare Worker that relays AI calls. It answers only the game's page, caps calls per day, picks the model, and keeps the API key as a secret. |
| `tests/` | `unit.js` (game logic), `smoke.js` (a full game at desktop and phone width with canned AI replies), `qa.js` (failure modes, navigation, the relay), `a11y.js` (contrast, labels, headings, keyboard focus, reflow, reduced motion), `screens.js` (screenshots of every screen). |
| `docs/` | How it works (diagrams), the model choices, citations, the build log and the close-out. |

## Running the tests

```bash
npm install
```

```bash
npx playwright install chromium
```

```bash
npm test
```

The tests never call the real AI; they use canned replies from `tests/stub.js`.

## Credits
Designed by a learning designer, Giselle Tran, for EDUC 565A at USC Rossier (Fall 2026). Built with AI: Claude in claude.ai and Claude Code.
