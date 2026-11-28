# Close-out: Fri Nov 27

Draft, filled in as the session goes. Giselle carries it to the Project Kit tracker.

## Decisions

| Decision | Reason |
| --- | --- |
| Use the existing repo `gtran16/LDAI-leadership-game-prototype` as the class repo for now | Giselle's call; saves setup time before the freeze. |
| Model split approved: P2a, P2b, P3 and P7 on Sonnet 5.5; P4 and P8 on Haiku 5.5; thinking off | Sonnet where accuracy and coherence matter, Haiku for short bounded replies; about $0.45 a game. See `model-right-sizing.md`. |
| P7 `[NEXT ROLE]` stays "manager of managers" (prompt line ~910 and check-in screen) | Giselle: fine for now. Open P7 item closed. |
| Repo made public, `CLAUDE.md` kept; GitHub Pages serves `main` at https://gtran16.github.io/LDAI-leadership-game-prototype/ | Pages needs a public repo on a free account; nothing in the repo is secret. |
| Mobile layout (Team/Story panel above the scene at 375 px) deferred to after freeze | Not a blocker for a desktop demo. |
| Office desk look across every screen and page; type system Nunito (game) + Courier Prime (in-world paperwork only) | Giselle chose P2 after mockups; immersive without the generic app feel. |
| Bring-your-own-key fallback dropped for the freeze | The $10 Console limit and Worker cap cover class use; less code to verify. |

## Tests (Nov 27, end of day)
- `npm test`: unit 43/43, smoke (full game at 1280 and 375 px), QA 19/19.
- QA covers: retries on bad or truncated AI replies; error recovery with answers kept; rate limit and Worker daily cap messages; leaving for Skills and returning to the same place; restart; HTML injection; skipping the benchmark; no-AI state; no sideways scroll at 375 px; named buttons.
- Contrast: every token pair passes WCAG AA (lowest 5.4:1).

## Tasks

- [x] Repo layout, `.gitignore`
- [x] Smoke test (`npm run smoke`): full game at 1280 px and 375 px, stubbed AI
- [x] Worker scaffold, game falls back to the Worker off claude.ai
- [x] Playtests 2 and 3 applied
- [x] Prompt batches A and B approved and applied
- [ ] Final playtest on the hosted page
- [ ] How it's made page updates (draft in how-its-made-changes.md)
- [x] Bring-your-own-key fallback: dropped for the freeze
- [ ] Deploy: API key, KV namespace, Worker, Pages
- [ ] Live check, README for testers, build log, tag

## After freeze

- Mobile layout: Team/Story panel shows above the scene at phone width.
