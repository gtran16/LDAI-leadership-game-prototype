# Close-out: Fri Nov 27

Draft, filled in as the session goes. Giselle carries it to the Project Kit tracker.

## Decisions

| Decision | Reason |
| --- | --- |
| Use the existing repo `gtran16/LDAI-leadership-game-prototype` as the class repo for now | Giselle's call; saves setup time before the freeze. |
| Model split approved: P2a, P2b, P3 and P7 on Sonnet 5.5; P4 and P8 on Haiku 5.5; thinking off | Sonnet where accuracy and coherence matter, Haiku for short bounded replies; about $0.45 a game. See `model-right-sizing.md`. |
| P7 `[NEXT ROLE]` stays "manager of managers" (prompt line ~910 and check-in screen) | Giselle: fine for now. Open P7 item closed. |
| Mobile layout (Team/Story panel above the scene at 375 px) deferred to after freeze | Not a blocker for a desktop demo. |

## Tasks

- [x] Repo layout, `.gitignore`
- [x] Smoke test (`npm run smoke`): full game at 1280 px and 375 px, stubbed AI
- [x] Worker scaffold, game falls back to the Worker off claude.ai
- [ ] Player test notes and second player test
- [ ] Prompt batch approval, `PROMPTS_APPROVED = true`
- [ ] Bring-your-own-key fallback
- [ ] Deploy: API key, KV namespace, Worker, Pages
- [ ] Live check, README for testers, build log, tag

## After freeze

- Mobile layout: Team/Story panel shows above the scene at phone width.
