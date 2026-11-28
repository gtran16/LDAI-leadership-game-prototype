# Prompt changes from playtest 3 (V4.1): for your review (Nov 27, evening)

Word for word, current → proposed. Nothing here is in the game yet. The run log was lost, so each cause below is my best reading of the prompts and code, not confirmed from replies.

## P2a scenario builder

### F1. One ask per question (D1 Q4 asked Remi two things at once)
- WRITE 2, after `labeled with their role.`, add: `Each question asks one thing, in one sentence, the way the player would really ask it.`

### F2. Fewer time references in the first sentence (D3 opened with too many weeks)
- WRITE 1, after `using one concrete detail from it (a person, a promise, a date).`, add: `That sentence holds at most one time reference.`

### F3. The opening follows from who the player actually talked to (D5: why Remi, when I talked to Ravi?)
- WRITE 1, after the sentence F2 adds, add: `It starts from the person the player's last opening went to and what that person did next. Anyone else enters only as news the player hears.`

## P2b decision builder

### G1. Manager advice in decisions 5 and 6 (D5 had none)
Likely cause: the line `Band "text" (lean options, hidden from the player): give only slot, text, delta, tradeoff and you_take_on_work for each option.` reads as "only these fields", so the AI drops `peer_advice`.
- Now: `Band "text" (lean options, hidden from the player): give only slot, text, delta, tradeoff and you_take_on_work for each option.`
- New: `Band "text" (lean options, hidden from the player): for each option, give only slot, text, delta, tradeoff and you_take_on_work. peer_advice is still required in this band.`

### G2. Every option moves something (D4 again had no meter movement)
Code now falls back to the picked option's deltas when the judge returns none. This change makes sure the option has some to fall back to.
- METER RULES, after `at most one meter moves by 2:`, add: `every option moves at least one of team, boss or business by 1 or more, because`
- Result: `...at most one meter moves by 2: every option moves at least one of team, boss or business by 1 or more, because every option spends something to protect something.`

## P4 narrator

### H1. Feedback, not a restatement ("How your approach worked")
- Now (WRITE 3, first sentence): `The first sentence says what this part did, crediting what the player named, and the one thing it left open, if anything.`
- New: `The first sentence says how this part worked and why: what it protected or made possible for a named person, and the one risk or gap it left. Do not repeat the player's words back; explain the effect.`

### H2. "Another way" on every line, including a picked opening (missing on delivery in D3 and D4)
- Now: `For a picked part, the other approach is one of the other written options.`
- New: `Every one of the three lines has an "Another way:" sentence, including a picked opening. For a picked plan, the other approach is one of the other written options; for a picked opening, it is the other written opening.`

### H3. The story stays with who the player talked to (D5 mismatch)
- Add to WRITE 2, after `starting with what you did.`: `The conversation in the story is with the person the player's opening went to. Other people react only through what they hear or see afterward.`

## P7 readiness check-in

### I1. Practice points only to parts the player wrote ("decisions 3 and 4" named for a fixed plan)
- Now: `3. grow: the one or two parts to practice next, chosen from plan, tradeoff and delivery. For each, one line that ties it to decisions by number and says what to try.`
- New: `3. grow: the one or two parts to practice next, chosen from plan, tradeoff and delivery. For each, one line that ties it only to decisions where the player wrote that part themselves (the summaries mark picked parts as "(picked)"), and says what to try.`

### I2. "Your call and Noor's" stays on the readiness call, with no field names
The screen already shows the completeness read, so this reverses the E1b WRITE 4 addition.
- Now: `4. calibration: one sentence that sets the player's own readiness call against the verdict, without saying they were right or wrong, and one sentence on the completeness read: ... talk about the answers. If the player's "what was hard" names the same pattern as work_on, say so.`
- New: `4. calibration: one sentence that sets the player's own readiness call against the verdict, without saying they were right or wrong. If what the player said was hard matches the pattern to work on, say so in plain words. Never write field or section names such as work_on, worked or grow.`
- Also remove the input line `Completeness read (...): [CONFIDENCE READ]`. It's no longer used.

## P8 quick check

### J1. Credit the delivery, not only the tradeoff (the open answer to the boss is what the game teaches)
- Add a 4th mark after `3. who_pays: ...`: `4. delivery: the answer speaks to the boss as the scenario asks: it says what was decided, what it means for them, and asks or offers a next step.`
- Rule 5 JSON gets `"delivery": {"status": "...", "evidence": "..."}`.
- Code shows a fourth chip, "Delivery", on Before and after.
