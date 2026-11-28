# Close-out: Fri Nov 27, 2026

The class version is released and tagged `v1.0-class-submission` (V4.10). Giselle carries this to the Project Kit tracker.

- **Play:** https://gtran16.github.io/LDAI-leadership-game-prototype/ (same file as the claude.ai artifact https://claude.ai/artifact/FXVxorJ1BrmATtM7j2kQbT)
- **Next:** the proposal Wednesday; the presentation and submission Thursday Dec 3. The game is extra credit, shown live to a small group.

## Decisions

| Decision | Reason |
| --- | --- |
| Use the existing repo, public, served by GitHub Pages from `main` | Saves setup time; Pages needs a public repo; nothing in the repo is secret. |
| Models: Sonnet 5.5 for the scene, options, judge, narrator and check-in; Haiku 5.5 for the benchmark marks; thinking off | Sonnet where accuracy matters. The narrator moved up from Haiku after the playtest showed misquotes. About $0.55 a game. See `model-right-sizing.md`. |
| Cloudflare Worker relay with a 125-call daily cap; $10 prepaid, auto-reload off | The key never reaches the browser, and spending can't go past $10. |
| Office desk look; Nunito for the game, Courier Prime only on in-world paperwork | Giselle chose it after mockups. |
| Support fade 2-1-3; frames in decisions 4–5, none in 6 | Giselle: frames help, but players are more creative without them, so the last decision is fully their own. |
| A checklist replaces the five-word completeness rating | Every rating in the playtest was "Mostly complete". The checklist shows what a complete answer has, and the read compares each part. |
| "Ready now" needs meters out of the red and at least 80% of written checks named | Meters alone gave too positive a view. |
| Check-in: Your read → Noor's read → What happened next → The game is over; the benchmark and 1:1 sheet come after the story | Playtest: the debrief dragged. The benchmark needed to sit clearly outside the story. |
| 1:1 sheet: three questions, manager support (Kirkpatrick Level 3), reminders in the player's own words, no game names | The game can't change behavior at work on its own; the manager conversation is the bridge. |
| Meter fixes: no "since last time" twice in a row or on a meter that just fell; boss moves both ways; business starts at 6; wellbeing code-only | Playtest run log: business charged twice, boss never moved. |
| Prompt-wide review: unused outputs cut, rules moved to SHARED (6,205 → 5,804 words) | Faster, cheaper, fewer contradictions. Approved word for word. |
| Mobile layout, real practice minigames and a deeper accessibility pass go after the freeze | Not needed for a desktop demo. |

## Final checks (Nov 27, at release)
- `npm test`: unit 71/71; smoke, a full game at 1280 and 375 px; QA 23/23; accessibility audit, no findings. All use canned AI replies.
- **Accessibility audit** (`tests/a11y.js`): text contrast (WCAG AA), names and labels on every control and field, one h1 and no skipped heading levels, a visible keyboard focus ring on every focusable element, no sideways scroll at 320 px or at 200% zoom, a live region for waits, and reduced motion. It found and fixed three issues: an orange role tag at 4.17:1, no h1 on the 1:1 sheet, and no reduced-motion rule.
- **One live game** on GitHub Pages (V4.10): 25 calls, no retries, no errors.
- **Prompt check:** each prompt, old and new, run once through Claude Code subagents. All replies were valid JSON and kept to the meter rules.

## Not covered by tests
- No screen reader (VoiceOver) pass. No real keyboard-only game end to end; native buttons and the focus rings suggest it works. No testers with disabilities.
- One live run since the last prompt changes; the next real players are the first full run of the reviewed prompts.
- Phone layout works but isn't polished.

## Demo screenshots
In `tests/out/slides/` (not committed), 23 screens in game order, with canned AI text. Screens 06, 08, 09, 10 and 13 show the support fade, and 14–20 show the check-in and the 1:1 sheet. For slides that show what the AI writes, use screenshots from a live game instead. To regenerate them, run `node tests/demo.js`. For every screen at one width, run `node tests/screens.js 1280`.

## After class
- Delete the Worker, or revoke the API key, in the Anthropic Console.
- Ideas for the next version are in `CLAUDE.md` under "After freeze".
