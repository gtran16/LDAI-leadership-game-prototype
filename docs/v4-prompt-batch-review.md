# V4 prompt and content batch: for your review (Nov 20-21)

Copied from the claude.ai project (claude/prompt-batch-v4-review.md) on Nov 27. The exact wording lives in game/index.html; this is the summary of what changed.

Status: built into The Leadership Game V4 behind `PROMPTS_APPROVED=false` (the "how this works" screen shows a designer note until you approve). Nothing here has run against the live model yet. Approve, or mark changes, and the flag flips.

## Shared rules (added to the 5 existing)
6. Write the way a calm colleague talks: plain, connected sentences of about 10 to 20 words, one or two ideas each, joined with because, so, but. No fragments ("Um." "Fine."), no idioms or phrasal verbs hard for English learners (ping, stack of, squeeze in, run with it, stop by, sliding toward), no insider words (lane, routing, queue, escalate) unless the scene explains them.
7. Never use land/lands/landed as a verb for how something went. Say worked, went well, came out, was received.

## P2a scenario builder
- Scene about 100 words (was 110). First sentence, after decision 1: what happened because of the player's last plan, with one concrete detail from it (a person, a promise, a date). One tension, at most three numbers, no word-problem feel.
- Answers use plain connected sentences (rule 6); example rewritten.
- Removed outputs: practice, focus, skill_check (skill names leave the player path). Plan and delivery checks are now fixed constants in code.
- since_last: only for a pattern the player could have seen; null if the previous decision had one.

## P2b decision builder
- Option text in plain connected sentences. Tradeoff lines: one sentence each, under 15 words.
- Opening verdict label "lands" renamed "strong". Decision numbers replaced by bands: options (D1), mix (D2-D3), text (D4-D5).

## P3 judge
- peer_read removed.

## P4 narrator
- reasoning_note replaced by three keys, one sentence each under 25 words: plan_line, tradeoff_line, delivery_line. For a picked part: what the pick protected and left open, plus the one other written option that would cover the gap and its cost; no sharper wording. For a written part: may add a short phrase to say out loud. No line ends in a question.
- peer_read removed. Calibration kept (shown only in "How sure you were" at the end).
- New rule 12: name a gap only if the player could see the fact (scene, an answer they got, or what they wrote).
- "did not land" becomes "did not come true".

## P7 readiness check-in
- "five decisions". `grow` = one or two parts to practice next (plan, tradeoff, delivery), no skill names; new rule 10 bans skill names.
- Open question: the frame "next role: manager of managers" may not fit the refocus. Left as is.

## Quick check
- Second scenario's "Ari" renamed "a teammate".

## Help drawer (tabs: Why / Plan / Tradeoff / Delivery)
Why: "There is no right choice. There are only tradeoffs. Every choice protects something and costs something." / "Managing is not about winning. It is about making hard decisions again and again, and keeping your team, your boss, the work and yourself in balance." / "This game practices three parts: make a plan, name the tradeoff, and say it to the person. Your job is to see both sides of a choice, choose on purpose, and say so."

Each part tab: What good looks like (3), Do (3), Don't (3), sentence frames, one worked example from a bakery (Ana, Luis, Priya), in a different workplace.
- Plan good: says what you will do, who does it, by when; uses a fact from your questions; says what waits or stays out. Frames: "I will ___." "___ does ___ by ___." "These things wait: ___."
- Tradeoff good: names what it protects; names what it costs (a date, a task, someone's time); names who pays. Frames: "This plan protects ___." "It costs ___." "___ pays for it."
- Delivery good: starts with what you decided; says what it means for this person; asks what they need or says when you will check in. Frames: "I decided ___." "This means ___ for you." "What do you need from me? I will check in on ___."
- Don'ts, for example: "there is no real downside"; "it will be stressful" without saying for whom; announcing a decision without asking anything; putting the cost at the end; apologizing so much the decision sounds unsure.
- Examples (bakery): plan "I will give the wedding order to Ana and Luis. Luis makes the simple items and Ana makes the cake. We stop the café specials until Saturday, and I will check in with both of them on Thursday." Tradeoff "This plan protects the wedding order. It costs the café specials, which stop until Saturday. The café customers wait, and Priya, who runs the café counter, has to explain it to them." Delivery "Ana, I decided that you and Luis will make the wedding order, and we will pause the café specials until Saturday. That means longer days for you this week. What do you need from me to make it work? I will check in on Thursday."
- Behavior: frames and example open by default for the part you write at D2-D3; closed from D4. Auto-opens once at D2, D3, D4. Floating Help button always present; Escape closes; never moves your place.

## Stage banners and task card
D1 You pick / D2 New: you write the tradeoff / D3 New: you write your first words too / D4 New: you write it all / D5 You write it all. Task card: three bullets per decision, fitted to the stage.

## Plan (five decisions, from the ten in test 1)
Old 1 Brightwell, 3 Jan, 4 Teo/Ravi, 5 Ravi follow-ups, 10 Noor slip become 1-5. Month labels removed. Decision 5's carry-forward text rewritten (below).
> Two months before Brightwell's renewal, training for its 8 new clinics has slipped two weeks; Teo promised them it would be done by the end of next week and Noor has not heard yet. The Brightwell relationship from the first decision and Teo's habit of promising on the team's behalf both meet here.

## Page copy changed
Home and How it's made rewritten for five decisions, drawer, no skill cards, no practice-round flow, "about 22 AI calls". Nav is Play and How it's made. Skills, learn and levels pages are gone from the nav; the practice route is unlinked.
