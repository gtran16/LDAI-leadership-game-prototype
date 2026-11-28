# Prompt changes from playtest 2: for your review (Nov 27)

Each change shows the current text and the proposed text, word for word.

- **Prompts:** none of these ships until you approve it, or edit it and approve the edit.
- **Content changes:** Brightwell → Northfield is already approved, so it goes ahead in code and content.
- **Note numbers** ("note #20" and so on) refer to the rows in `playtest-2-notes.md`.
- **Run-log evidence:** comes from `#V4 log - Nov 27 2026.md`.

---

## P2a scenario builder

### A1. Rename in the example (approved: Northfield)
- Now: `...the part that splits Brightwell's 40 clinics by who can answer...`
- New: `...the part that splits Northfield's 40 clinics by who can answer...`

---

## P2b decision builder

### B1. No new facts in options (note #20, the D1 "help desk pause")
In D1, option E asked Noor to pause "the help desk preparation work". The scene never mentioned it, so it read as a curveball.

- Rule 4 now: `4. Stay consistent with the scene: use only the people, facts and numbers the scene and its answers set. Never contradict an answer.`
- Rule 4 new: `4. Stay consistent with the scene: use only the people, facts, numbers and work the scene and its answers set. Never contradict an answer. An option never brings in a project, a pause, a tool or a resource the player has not seen in the brief or the answers; if an option needs one, the brief must already name it.`

### B2. Advice from other managers (note #12)
In the run, the trade-off advice was generic ("Whatever you choose protects something and costs something...") and ended in a doubled ellipsis.

- Now: `3. peer_advice (bands "mix" and "text" only): what a manager the player trusts would say if asked, once for the plan, once for the trade-off and once for the opening. For each, one question to think about and the first half of a sentence that stops before the answer. Never a complete plan, trade-off or opening.`
- New: `3. peer_advice (bands "mix" and "text" only): what a manager the player trusts would say if asked, once for the plan, once for the trade-off and once for the opening. For each, one question about this scene that names a person, a date or a piece of work from it, never a general truth such as "every choice costs something". Then the first few words of an answer the player could finish, written as the player would write them in that box: for the plan, a first step ("First I will ask Jan to"); for the trade-off, the start of what it costs ("Jan's routing work will"); for the opening, the first words to this person by name ("Jan, I looked at"). The words stop mid-sentence, with no closing punctuation and no ellipsis. Never a complete plan, trade-off or opening.`

### B3. Six decisions (note #23): only if the sixth decision is approved
- **Bands:** P2b gets the band from code, so the prompt text does not change. Code sets D1–2 to "options", D3–4 to "mix" and D5–6 to "text".

---

## P3 judge

### C1. Stricter "partly" (fixes the all-green trail, note #27)
In the run, the judge marked these as fully *named*:
- "Business time" (D5 cost)
- "Me and the team" (D5 who pays)
- "Business and Noor" (D2 who pays)

- Now (REPORT 1): `1. checks: for each of the four checks, "named", "partly" or "missing", with the exact words that show it. "Partly" means named without saying who or what specifically.`
- New: `1. checks: for each of the four checks, "named", "partly" or "missing", with the exact words that show it. "Named" means a specific person, piece of work or date ("Remi's two calendar tickets wait a week", "Noor hears about the delay today"). "Partly" means the answer points at the right area but stays general: a group, a meter or an abstraction instead of a person, work item or date ("the team", "the business", "business time", "me and the team", "time"). When the answer sits between named and partly, mark it partly.`

### C2. Meters must move when someone pays (note #21, D4: no meter moved)
In D4 the plan said `Ensure Ravi finishes the calls tonight, even if he has to stay late`, yet team, boss and business all held.

- Add to REPORT 7, after `...unless the plan names how they are supported.`: ` A plan that has someone on the team stay late, work extra, or take on more without support moves team standing down by at least 1, even when the business gains. Every real plan spends something: return all three of team, boss and business at 0 only when nothing in the plan costs anyone anything they would notice, and say why in the reasons.`

### C3. The opening is one-way (note #22)
- Add as RULES 6: `6. The opening is the player's first words only, before anyone replies. Judge whether these words say what was decided, what it means for this person, and ask or check in. Never mark something missing because it would come later in the conversation, such as a follow-up question or an agreement.`

---

## P4 narrator

### D1. Longer "What happened" (note #16)
- Now (WRITE 2): `2. story_entry: a short scene of 3 to 5 sentences in 2 or 3 short paragraphs, second person, past tense, starting with what you did.`
- New: `2. story_entry: a short story of 4 to 5 sentences in 2 short paragraphs, second person, past tense, starting with what you did. Something realistic happens next because of the plan: a person reacts, a date holds or slips, or work moves.`
- Rule 4 now: `4. Under 180 words in total.`
- Rule 4 new: `4. Under 260 words in total.`

### D2. "What you did" with another approach per part (note #18, also D4)
- Now (WRITE 3, first two lines): `3. plan_line, tradeoff_line, delivery_line: one plain sentence each, under 25 words, as if a manager you trust were talking to you after the meeting.`
- New: `3. plan_line, tradeoff_line, delivery_line: two plain sentences each, each under 22 words, as if a manager you trust were talking to you after the meeting. The first sentence says what this part did, crediting what the player named, and the one thing it left open, if anything. The second sentence starts with "Another way:" and names one other approach for this part and what it would have cost. For a picked part, the other approach is one of the other written options. For a written part, it is an approach built only from facts in the scene and the answers the player got.`
- The three sub-bullets (plan_line / tradeoff_line / delivery_line) stay as written.
- The "For a part the player picked from written options..." sentence that follows them is removed, because the new text covers it.

### D3. The opening is one-way (note #22)
- Add as RULES 13: `13. The opening is the player's first words, before anyone replies. The story may show how the person reacted, but delivery_line judges only those first words and never faults the player for what would come later in the conversation.`

### D4. Rule 9 is now covered by D2
- Rule 9 now: `9. When the player picked a part from written options, never suggest sharper wording for it. For a picked plan, say what it protected and what it left open, then name the one other written option that would have covered that gap and what it would have cost. Sharper wording is only for parts the player wrote.`
- Rule 9 new: `9. When the player picked a part from written options, never suggest sharper wording for it; its "Another way" is one of the other written options. Sharper wording is only for parts the player wrote.`

### D5. Calibration removed from P4 (note #26, rebuilt in code)
The old line compared confidence to the story's outcome, which the AI writes, so it could not show over- or underconfidence. Confidence is now compared, in code, with the judge's checks.

- **Remove the WRITE 4 item:** `4. calibration: code starts this sentence with "Did it work out? You said [their confidence], and". Write only the rest of the sentence, starting in lowercase. Say in one plain clause what actually happened, then whether it matched how sure they were, without saying they were right or wrong. If the cost they named was not the one that landed, name the one that did.`
- **Remove the INPUT line:** `Confidence: [CONFIDENCE]`
- **Rule 5, output keys:** drop `"calibration": "..."`.
- **Rule 11, now:** `11. Name a cost in the story, the lines or the calibration only when the judge moved a meter for it. If the player named a cost that did not come true, say so plainly in the calibration.`
- **Rule 11, new:** `11. Name a cost in the story or the lines only when the judge moved a meter for it. If the player named a cost that did not come true, say so plainly in tradeoff_line.`
- **Rule 7 is not changed.**

---

## P7 readiness check-in

### E1. "What was hard?" (note #24)
- Now: `What kept coming back: [SELF 2]`
- New: `What was hard: [SELF 2]`
- Now (WRITE 4): `If the player's "what kept coming back" names the same pattern as work_on, say so.`
- New: `If the player's "what was hard" names the same pattern as work_on, say so.`

### E1b. Confidence read from code (rebuild)
- **Decision summaries, now:** `For each decision: number, lead skill, the judge's checks (named, partly, missing), hidden fact status, events, the player's confidence and how it turned out, and the player's own written words where there were any: [DECISION SUMMARIES]`
- **Decision summaries, new:** `For each decision: number, lead skill, the judge's checks (named, partly, missing), hidden fact status, events, how complete the player said their answer was, and the player's own written words where there were any: [DECISION SUMMARIES]`
- **New input line, after the summaries:** `Confidence read (set by code from how complete the player said their answers were, against the judge's checks): [CONFIDENCE READ: calibrated | overconfident | underconfident | not enough written answers]`
- **WRITE 4, now:** `4. calibration: one sentence that sets the player's own readiness call against the verdict, without saying they were right or wrong.`
- **WRITE 4, new:** `4. calibration: one sentence that sets the player's own readiness call against the verdict, without saying they were right or wrong, and one sentence on the confidence read: when the player rated their answers more complete than the checks found, or less, say so plainly as something to notice, never as a flaw; when it matched, say their read of their own work was accurate.`
- **The rest of item 4 is not changed.**

### E2. Six decisions: only if the sixth decision is approved
- Now: `*This check-in was written by AI from your five decisions in the game.`
- New: `*This check-in was written by AI from your six decisions in the game.`

---

## Not changed
- SHARED rules 1 to 7
- P8
