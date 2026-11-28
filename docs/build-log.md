# Build log

A factual record of how the game was built: what AI produced, what the designer decided and changed, and what was checked. It's raw material for the proposal's AI-use section, not submission text.

## Before Nov 27: claude.ai (canvas artifacts)
- **V1 to V3:** built as claude.ai artifacts with Claude. V3 had ten decisions plus separate Skills, Learn and Practice pages.
- **V4 (Nov 16–21):** cut the game to five decisions with fading support, a help drawer and a before/after quick check. A batch of prompt changes was drafted and held for designer review.
- **Playtests:** the earlier rounds and their notes live in the course project folder.

## Nov 27: Claude Code (Claude Opus 5.5), one session

| Area | What Claude Code produced | What Giselle decided or changed | How it was checked |
|---|---|---|---|
| Repo and tests | GitHub repo layout. A smoke test with canned AI replies, then unit and QA suites. | Used the existing repo and made it public for GitHub Pages. | `npm test`: unit 57, smoke at 1280 and 375 px, QA 23. |
| Models | A right-sizing note: Sonnet 5.5 for the scene, options, judge and check-in; Haiku 5.5 for the narrator and quick check. Thinking off. About $0.45 a game. | Approved the split. | Live calls through the relay on both tiers. |
| Playtest 2 (Giselle) | Turned 29 notes into changes: six decisions, Northfield in place of Brightwell, a six-screen intro, a help panel instead of the drawer, a new debrief and check-in, a same-scenario benchmark. | Required every note to be addressed before the freeze. Picked the sixth decision (the old "Fuzzy handoff"), the benchmark scenario and the layout. | Smoke and screenshots of every screen. |
| Confidence | First proposed dropping it. Then rebuilt it as "how complete is your answer", compared in code with the judge's checks. | Explained the goal (confidence against ability) and chose the rebuild. Asked to avoid labels like "overconfident". | Unit tests on the comparison, including the playtest-3 data that had wrongly read "matched". |
| Prompts | Three batches of word-for-word prompt changes (A, B, C), each shown as current versus proposed before use. | Reviewed and approved each batch. Asked for a prompt-wide consistency review after the freeze. | Approved before going live. Live runs are logged in the run log. |
| Look and feel | Three branding directions, then an "office desk" direction in two palettes, as mockups before any build. Then a single type system. | Rejected the first three. Chose the desk with the original colors and asked for intentional font use. | Screens at two widths; WCAG AA contrast on every color pair. |
| Playtest 3 (Giselle) | Fixes for the completeness read, meters not moving, missing advice, missing "another way", and continuity. The skill guide got two worked examples and a way back to the game. | Wrote the notes and approved the prompt fixes. | Unit, smoke and QA tests. Run log review in the final playtest. |
| Learning design | Split the judge's single "skill check" into separate plan and delivery checks. Moved to a 2-1-3 support fade. "Ready now" now needs written checks as well as meters. | Set the threshold at 80%. Chose 2-1-3 over 2-2-3. | Unit tests on the verdict and the fade. |
| How it's made | A full rewrite: sections as learner questions, a limits section, APA references checked against the PDFs and both syllabi. | Required APA throughout, sources from the course readings, and the Kirkpatrick Level 2 versus Level 3 statement. Cut the in-page diagrams. | Each reference checked against a syllabus or the PDF. What's left to check is in `citations-to-verify.md`. |
| 1:1 sheet | A printable sheet: three questions for your manager, how your manager can support you (Kirkpatrick Level 3), and reminders built by code from your checks, with no game details. | Asked for it, for no story or character details, for the questions first, and for one page. | Smoke test fails on any game name or a second printed page. |
| Hosting | A Cloudflare Worker relay: origin check, a 125-calls-a-day cap, model choice, the key kept as a secret, and the workspace header. Fixed the browser preflight bug that showed as "Failed to fetch". | Created the API key (prepaid $10, no auto-reload) and the Cloudflare account. Entered the key herself; it never passed through chat or code. | End-to-end check on GitHub Pages: first scene in 10 seconds, no errors. |

## Final playtest
| Finding | Fix | How it was checked |
|---|---|---|
| Decision 1 failed twice with "came back unreadable" (Giselle). | Claude Code reproduced it on the hosted page: the decision builder's reply (about 4K tokens) hit the Worker's 4096-token cap. Raised the cap to 8192. | A live run to the decision 1 choices on GitHub Pages: reply complete, no retry. |
| No accessibility testing yet (Giselle). | Logged for after the freeze. | — |
| Run-log review (Claude Code): business charged twice for one gap; boss never moved; the narrator told a story the player didn't write and misquoted them. | Code: since-last can't charge two in a row or a meter that just fell; the narrator sees no option stories for written plans; business starts at 6; P4 to Sonnet. Prompt (approved word for word): multi-step plans can move two meters; boss rises when told early, falls when left waiting. | Unit tests for each rule; one live game. |
| Playtest notes (Giselle): long; the debrief drags; the game wants detail but doesn't say how much; show that feedback is being used. | V4.10: a checklist replaces the five-word rating; a length hint; frames in D4–5 (D6 free, Giselle's call); a "last time" note and "you fixed it"; check-in cut to Your read, Noor's read, What happened next, The game is over; the benchmark and the 1:1 sheet after the story; the player's own words on the sheet. | Unit 70, smoke, QA 23; one live game. |

## V4.10 live run (Claude Code, Nov 27)
One full game on GitHub Pages with live AI, answers written by Claude Code to each scene. 25 calls, no retries, no errors; about 7.5 minutes of machine time (the decision builder takes 30–41 seconds per decision). Verdict: Ready now. Checklist read: 17 of 19 parts matched.
- **Worked:** the checklist, frames (blanks block commit), the "Last time" note, "You fixed it", no frames in D6, since-last no longer doubling up, boss moving both ways, the narrator telling the player's own plan, the check-in in three cards, the benchmark after the story, and names swapped on the 1:1 sheet.
- **Fixed after the run:** "You fixed it" repeated for a part already fixed earlier.
- **Open (prompt, needs review):** on Sonnet, the narrator skips "Another way:" on about half its plan and tradeoff lines. In D4–6 it points to "the written option", which the player never saw. Twice the boss line described Teo instead of Noor. "Lane" still shows up in AI text.

## Still to log after the final playtest
- The rest of the live run, and any other blocker fixes.
- The tag `v1.0-class-submission`.
