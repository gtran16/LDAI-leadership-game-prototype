# New game text from playtest 2: for your review (Nov 27)

This is every piece of player-facing text drafted today, word for word, grouped by screen. It is all in `index.html` now. Mark changes, or approve.

Prompt changes are in `prompt-changes-nov27.md`.

## Home page
- **Lead:** "...In six decisions, you choose what to do, name what it protects and what it costs, and practice how to say it to the person. It takes about 45 minutes." (was five decisions, 40 minutes)
- **New card, "Why this game":** your two Why paragraphs from the help drawer, unchanged.
- **Card renamed** from "Three parts, one skill" to **"What you'll learn"**. New first line: "Three parts of one skill: see both sides of a choice, choose on purpose, and say so."

## How-this-works screen
- **Removed:** the "How the five decisions work" card.
- **Lead:** six decisions, about 45 minutes.

## Quick check (before and after: same scenario, "Two asks, one Friday")
- **Badges:** "Check 1 of 2 · before you start" / "Check 2 of 2 · after six decisions". Side note: "Not part of the story · no score".
- **Before, heading:** "Before you start: one scenario"
- **Before, text:** "Answer one short scenario from a different workplace. There is no right answer. At the end you answer the same scenario again and see your two answers side by side."
- **After, heading:** "The same scenario, one more time"
- **After, text:** "This is the scenario you answered before the story. Answer it again without looking back, then see both answers side by side in your check-in."
- **Note under the box:** "Your answer goes to the AI so your two answers can be compared. Leave out real names."
- **Buttons:** "Start the story" / "Go to your check-in" / "Skip the check".
- **Question:** existing scenario text says "Two things **land** for Friday". Proposed: "Two things **are due** Friday".

## Intro (6 screens, V3 structure)
1. **Tidewell, "Small clinics, busy front desks":** V3 text. "650 people, and every one..." became "650 people work there, and every one...".
2. **You, "Three months ago, you were one of them":** V3 text. The footer's "everyone pings" became "everyone asks", and "vent about management" became "complain about management".
3. **Your team, "Customer Support":** "Your team answers chat, email and phone for clinic front desks, with a promise: a first reply within 2 hours." The rest is V3.
4. **Your people, with the title "Your team" (your note):** Remi, Jan, Ravi.
5. **Above and beside you, "Your boss and your peer":** "Pressure also comes from outside your team, especially from your boss and another manager." Then Noor and Teo.
6. **This year, "More work, the same team":** "...You will make six decisions. Each one protects something and costs something. Your job is to see both, choose on purpose, and say so." Footer: "It is Monday morning. A message from your boss is about to arrive."

## Decision screens
- **Scene button:** "Next: form your decision".
- **Decide button:** "Commit your decision".
- **Removed:**
  - the stage banner and the "Your task" card
  - all ? tooltips
  - "Stuck? See what other managers would ask"
  - "See what good looks like"
  - the help drawer
  - "2. The trade-off" when the trade-off is written for the player
- **Picked options (D1–2):** protects / costs / who pays sit as a dashed bullet box under each option.
- **Share your choice:** "Practice how you'll deliver your choice to [person]. Pick (or Write) the first words you would say or send."
- **Confidence (D3–6 only), "How complete is your answer?":** "Before you commit: does what you wrote name what it protects, what it costs and who pays, and do your first words say what you decided and ask or check in? Be honest; this is for you."
- **Confidence scale:** Missing a lot · Missing some · About half there · Mostly complete · Complete.
- **Left tabs:** Team · Scene · Questions · Story.
  - Scene: "The scene, in short" and "The full scene".
  - Questions: "The answers to your two questions collect here."
- **Right panel, "Help":**
  - Tabs: Plan / Tradeoff / Delivery, with a "Full guide" link.
  - Content: What good looks like, then Sentence frames, then, for a part you write, "A manager you trust would ask" with the question and the starter.
  - Tag on the part you write: "You write this part".

## Debrief
- **What happened:** the bold last line is removed.
- **What you did:** bullets with **Plan:**, **Tradeoff:** and **Delivery:**. Each has a sub-bullet, *Another way:* ...
- **Comparison box:** "For comparison, the written option's trade-off:" then bullets.
- **Review your choices:** "How complete you said it was: [label]" (was "How sure you were").
- **Last decision button:** "Go to the last check".

## Check-in (new order)
1. **What happened next**
2. **Where you stand:** "Your four meters after six decisions, and where each one started." Bars, plus bullets like "Team standing: started Neutral, now Trusted".
3. **Noor's read:**
   - The verdict and Noor's note.
   - "What they saw" as bullets: "[who] watched for [x]. Saw: [y]".
4. **What to practice next:** bullets.
5. **Your confidence:** "For each answer you wrote: how complete you said it was, and what the checks found." Each written decision gets a row: "You said" against "Checks found" (named / partly / missing counts). Then one summary line:
   - **Overconfident:** "You rated your answers as more complete than they were. Before you send a plan, check that it names what it protects, what it costs and who pays, with a person, a piece of work or a date in each."
   - **Underconfident:** "Your answers were more complete than you said. You can trust your read of your own work a little more."
   - **Calibrated:** "How complete you said your answers were matched what you wrote. Your read of your own work is accurate."
   - **Fewer than 2 written answers:** "Write at least two of your own answers to see how your read compares."
6. **Before and after:** "The same scenario, before the story and after it. Did your answer name what it protects, what it costs and who pays?" The two answers sit side by side.
- **Self-read:** "What was hard?" (was "What kept coming back?").
- **Removed:** the trade-off trail and "How sure you were".

## Guide (new top-nav page)
- **Intro:** "The full version of the help in the game. If you are in the middle of a game, your place is kept: go back with Play."
- **How the six decisions work:**
  - Decisions 1 and 2: you pick a plan and your first words. Each plan shows what it protects, what it costs and who pays.
  - Decision 3: you pick a plan, then write the tradeoff.
  - Decision 4: you pick a plan, then write the tradeoff and your first words.
  - Decisions 5 and 6: you write all three.
  - Then: "Each decision starts with two questions, so you know more before you choose."
- **The four meters:** the existing "spend and restore" text.
- **Plan, Tradeoff and Delivery:** the full help content (good, do, don't, frames, worked example), unchanged.

## How the confidence read works (code)
- **Score per decision:** each of the judge's four checks is worth 2 if named, 1 if partly and 0 if missing, for a score out of 8.
- **Comparison:** the player's rating (0–4) is compared with half the score.
- **Verdict:**
  - Average gap of +1 or more: overconfident.
  - −1 or less: underconfident.
  - Otherwise: calibrated.
- **Needs** at least 2 written decisions.

## Guide split (added Nov 27, later)
The Guide is now two top-nav pages: **How the game works** and **Skills**.
- **How the game works:**
  - Intro: "Six decisions, four meters, and no score. If you are in the middle of a game, your place is kept: go back with Play."
  - Then the six-decisions list, the four meters, and a link: "The three parts you practice in every decision are on the Skills page."
- **Skills:**
  - Intro: "Three parts of one skill: see both sides of a choice, choose on purpose, and say so."
  - Tabs: Plan / Tradeoff / Delivery.
  - Each tab has the full guide plus a practice card. The practice minigames are UX only: the button says "Practice coming soon" and is disabled.
  - **New one-line summaries:**
    - Plan: "What you will do, who does it, and by when."
    - Tradeoff: "What your plan protects, what it costs, and who pays."
    - Delivery: "Your first words to the person: what you decided, what it means for them, and a question or check-in."
  - **Practice card text** (each ends with "You get feedback after each one, and you can try again."):
    - Plan: "Five short decisions in a new workplace. In the first two you pick a plan; in the last three you write your own."
    - Tradeoff: "Five short decisions in a new workplace. In the first two you pick the tradeoff; in the last three you write what it protects, what it costs and who pays."
    - Delivery: "Five short decisions in a new workplace. In the first two you pick your first words; in the last three you write them."
- **In-game Help panel:** the link now reads "Full skill guide" and opens Skills.
- **Open:** the Tradeoff and Delivery worked examples begin "The same bakery, the same plan." / "The same bakery. You are talking to Ana." That points back to the Plan example, which isn't on screen when each tab stands alone. Suggest repeating the one-line bakery setup in each.
