# Playtest 2 (Giselle, Nov 27): notes to changes

Source: `V4 - Play test - November 27 - Giselle.md`.

**Lives in:**
- **code:** UI or logic.
- **content:** fixed game text, which needs Giselle's OK on the wording.
- **prompt:** an AI prompt, which Giselle reviews word for word before it ships.

**Update, Nov 27 evening:** Giselle asked for every note to be addressed before the freeze, so every row was built today. Prompt rows wait on `prompt-changes-nov27.md`; new game text waits on `content-changes-nov27.md`. Mobile is still deferred.

**Tier:**
- **A:** before the freeze. Small, or it blocks a clean play-through.
- **B:** before the freeze if there is time (Saturday backstop).
- **C:** after the freeze, in the real-game repo.

## Before the game and intro

| # | Note | Proposed change | Lives in | Tier | Status |
|---|---|---|---|---|---|
| 1 | Start is abrupt and awkward; it should feel like a game | Restore V3's 6-screen intro (Tidewell, You, Your team, Your people, Above and beside you, This year) with the decision count updated | content, code | A | built |
| 2 | Remove the "how it works" content from the screenshot | Need to know which screen (screenshot not attached) | code | A | built |
| 3 | Intro screen 2 of 3: the header is weird | Change it to "Your team" | content | A | built |
| 4 | Why was the intro condensed? | Not on record here. V3 had 6 screens; V4 has 3, probably cut for the 40-minute target. Covered by #1 | — | — | answered |

## Game: scene step

| # | Note | Proposed change | Lives in | Tier | Status |
|---|---|---|---|---|---|
| 5 | Rename Brightwell (too close to Tidewell) | Rename to a new name everywhere: world data, the P2a example line, help text | content, prompt | A | built (Northfield) |
| 6 | "Ready to decide" is the wrong label | Change it to "Next: make your plan" | code | A | built |
| 7 | The gameplay tooltips at the top show on the scene step, not the decide step | Show each tip only on the step it describes, or drop them; #18 replaces them | code | A | built |
| 8 | Layout: Team, Scene and Your questions as tabs on the left, help on the right | Recommend after the freeze: a layout rebuild with mobile knock-on effects | code | C | built |

## Game: decide step

| # | Note | Proposed change | Lives in | Tier | Status |
|---|---|---|---|---|---|
| 9 | Commit button label | Change it to "Commit your decision" | code | A | built |
| 10 | When the trade-off is written for the player, the "2. Tradeoff" part is redundant | Remove that step; show each option's protects, costs and who pays as a short line under the option, like the question and answer cards | code | A | built |
| 11 | "Share your choice" lead line | Change it to "Practice how you'll deliver your choice to [person]." | content | A | built |
| 12 | Advice from other managers sounds awkward for what the game asks | Review the P2b `peer_advice` wording together with real samples from the run log | prompt | A | built, prompt awaiting review |
| 13 | Hints arrive four different ways (?, Advice link, "See what good looks like", auto-open drawer) | For the freeze: stop the auto-open and keep one Help entry point. The full refactor comes after the freeze | code | A (part), C (full) | built |
| 14 | Help panel: drop the dropdowns and the Why tab; keep Plan / Tradeoff / Delivery; full versions in the top nav; Why and What you'll learn on the home page | For the freeze: flat panel, no Why tab, no auto-open. Top-nav full guide and home-page framing after the freeze | code, content | A (panel), C (nav, home) | built |
| 15 | D2–D4: the auto-opening help panel is too much (4 columns of reading) | Covered by #13 and #14 | code | A | built |

## Game: debrief step

| # | Note | Proposed change | Lives in | Tier | Status |
|---|---|---|---|---|---|
| 16 | "What happened" is too short; it should be a story of about 4 sentences | P4: story_entry becomes 4 to 5 sentences; raise the 180-word total | prompt | A | built, prompt awaiting review |
| 17 | Last sentence of "What happened" is bold for no reason; use bullets for lists; use bold sparingly | Remove that bold; render lists as bullets | code | A | built |
| 18 | Add "Alternative approaches" (2 approaches), or fold it into "What you did" as bullets: **plan**, **tradeoff**, **delivery** | Recommend folding it in: "What you did" becomes 3 bullets, and each bullet ends with one other approach and its cost. Needs a P4 output change (also covers D4) | prompt, code | A | built, prompt awaiting review |
| 19 | "For comparison" is interesting but hard to scan | Render it as bullets | code | A | built |
| 20 | D1: feedback named a "help desk pause" that was not in the scene, only in an option | P2b: options may not introduce a new resource or plan the brief does not set up. P4: name another option only if the scene sets it up | prompt | A | built, prompt awaiting review |
| 21 | D4: no meters moved | Check P3 shifts in the run log. Likely the judge started from a lean "text" option with zero deltas | prompt, code | A | built, prompt awaiting review |
| 22 | D4–D5: judging feels off because the opening is one-way, with no back-and-forth | P3/P4: judge the opening only as a start; never describe the other person's reply as if the conversation happened | prompt | A | built, prompt awaiting review |
| 23 | Story feels short; add a decision: 2 fixed, 2 scaffolded, 2 written | NDEC 5 → 6; bands become options (D1–2), mix (D3–4), text (D5–6). The 6th seed exists in world data ("The avoided miss"). Every "five decisions" string and the P7 header change. About +$0.09 a game | code, content, prompt | A | built |

## Check-in and evaluation

| # | Note | Proposed change | Lives in | Tier | Status |
|---|---|---|---|---|---|
| 24 | "What kept coming back?" should be "What was hard?" | Change the label and the P7 `[SELF 2]` line | content, prompt | A | built |
| 25 | Noor's note: "we have no standings now" | Show the four meters on the check-in screen | code | A | built |
| 26 | Drop "How sure you were" | Remove the section. Confidence pick and calibration go too? | code, prompt | A | built |
| 27 | Trade-off trail is not adding anything | Hide it for the freeze; keep the data in the run log | code | A | built |
| 28 | Order: What happened next, Team standing, Noor's read, What to practice next | Reorder the sections | code | A | built |
| 29 | Pre and post checks: separate steps, a clearly different UI, same scenario both times | Use the same scenario before and after; give the check its own visual frame | code, content | A | built |

## Kept

- Removing the extra manager skills works.
- D2: scene continuity works.
- "What you did" is much clearer.
- Game time feels right.
