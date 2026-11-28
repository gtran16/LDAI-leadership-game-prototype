# How it's made page: updates for your review (Nov 27)

The How it's made page still describes the Nov 21 build. Below, every line that is out of date is shown as it is now and as proposed, word for word. Lines not listed stay as they are. Citations stay as they are; no new sources are added.

Nothing changes in `index.html` until you approve.

## What the designer reviewed
1. **The design**
   - Now: "...the five decisions and how support fades..."
   - New: "...the six decisions and how support fades..."
2. **Everything that stays the same between plays**
   - Now: "The screens, the code, the rules text, the help drawer, and the world you play in: the company, your team and the plan for the five decisions."
   - New: "The screens, the code, the rules text, the help panel and the Guide, and the world you play in: the company, your team and the plan for the six decisions."

## What AI generates each time
3. **As you play**
   - Now: "Each scene and its questions, the options in the first three decisions, the debrief after each decision, your story log, and the readiness check-in at the end."
   - New: "Each scene and its questions, the options in the first four decisions, the debrief after each decision, your story log, the marks on your before-and-after check, and the readiness check-in at the end."

## How AI and code make decisions
4. **Code keeps score**
   - Now: "...In decision 1, where you pick from written options, code judges your choice without AI."
   - New: "...In decisions 1 and 2, where you pick from written options, code judges your choice without AI. Code also sets your answer completeness read: how complete you rated each written answer, next to what the AI's checks found."

## Where the leadership ideas come from
5. **Heading** changes from "The help drawer" to **"The help panel and the Guide"**.
   - Now: "The do and don't lists, sentence frames and worked examples in Help were drafted with AI..."
   - New: "The do and don't lists, sentence frames and worked examples in the Help panel and the Guide were drafted with AI..."

## Why the game works for learning
6. **Support fades.** Heading changes from "...across five decisions" to **"Support fades across six decisions"**.
   - Now: "In decision 1 you pick everything. In decision 2 you write the tradeoff. In decision 3 you write the tradeoff and your first words. In decisions 4 and 5 you write all three."
   - New: "In decisions 1 and 2 you pick everything. In decision 3 you write the tradeoff. In decision 4 you write the tradeoff and your first words. In decisions 5 and 6 you write all three."
7. **Confidence.** Heading changes from "Rate your confidence" to **"Rate your own answer"**.
   - Now: "Saying how sure you are, then seeing what happened, trains you to judge your own judgment."
   - New: "Before you commit a written answer, you rate how complete it is. At the end you see your ratings next to what the checks found, which trains you to judge your own work."
   - Citation: Grolnick et al. (2024), ch. 7. Not changed.
8. **Help stays close**
   - Now: "Help opens on top of your decision, with examples for the part you are writing, so you never lose your place."
   - New: "A Help panel sits beside every decision, with what good looks like and sentence frames for the part you are writing. The full Guide, with worked examples, is one click away, and your place is kept."
   - Citations: not changed.
9. **New item (optional), "The same scenario, before and after":** "You answer one short scenario before the story and the same one after it, so you can see your own change side by side."
   - It has no citation. Keep it without one, add a source you trust, or drop it.

## System diagrams
10. **One decision, the "Ask and decide" step (You)**
    - Now: "You ask two questions, then pick or write your plan, trade-off and first words, and say how sure you are."
    - New: "You ask two questions, then pick or write your plan, trade-off and first words. When you write part of it, you rate how complete it is."
11. **One decision, the Judge step (AI)**
    - Now: "Judge (decisions 2 to 5) · Reads what you wrote and proposes meter moves. In decision 1, code does this."
    - New: "Judge (decisions 3 to 6) · Reads what you wrote and proposes meter moves. In decisions 1 and 2, code does this."
12. **End of level**
    - **New first step (You), "Last check":** "You answer the same scenario you answered before the story."
    - **"Your read" (You), now:** "You say what went best, what kept coming back, and whether you are ready."
    - **"Your read" (You), new:** "You say what went best, what was hard, and whether you are ready."
    - **"Verdict" (Code), now:** "Code reads your meters across all five decisions and sets the verdict."
    - **"Verdict" (Code), new:** "Code reads your meters across all six decisions and sets the verdict, and compares how complete you rated your answers with what the checks found."

## Prompts and models used (table)
13. **Judge row, "When" column**
    - Now: "After you commit, decisions 2 to 5"
    - New: "After you commit, decisions 3 to 6"
14. **Model column.** The tiers can now be named, because the Worker sets the models:
    - "Claude, default tier" becomes "Claude Sonnet 5.5 (default tier)".
    - "Claude, quick tier" becomes "Claude Haiku 5.5 (quick tier)".
    - Caveat: on the claude.ai link, claude.ai picks the model for each tier, so this is exact only for the hosted link. Alternative: keep the tier names and add one line under the table: "On the hosted link, the default tier is Claude Sonnet 5.5 and the quick tier is Claude Haiku 5.5."
15. **Footer**
    - Now: "About 22 AI calls make one full game."
    - New: "About 25 AI calls make one full game."

## Data transparency
16. **What is kept**, with one sentence added at the end: "On the hosted link, what you type passes through a small relay server on its way to the AI model, and the relay does not store it."
