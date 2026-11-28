# How it's made: full redraft for your review (Nov 27)

This replaces `how-its-made-changes.md`, which only patched the old page. Nothing changes in the game until you approve. ⚑ marks the places that need a call from you.

## Critique of the current page

**Product design**
- **Builder-first structure.** The nine accordions are organized by how the game was built ("What the designer reviewed", "How AI and code make decisions"). A learner arrives with questions instead: *Is AI judging me? What happens to what I type? Can I trust this?* The redraft uses those questions as the section titles.
- **The diagrams.** Drawn with boxes inside an accordion, they don't work. They move to a GitHub page (`docs/system-diagrams.md`, real flowcharts in the player/AI/code colors), and this page links to it.
- **Stale and unclear facts.** Five decisions, the help drawer, "Rate your confidence", decisions 2 to 5, 22 AI calls. "Effort counts" describes the old practice round. Nothing says where the data goes on the hosted link, or who pays for the AI.

**Learning design**
- **Citations attached to the wrong mechanic.** Several now sit under mechanics that have changed. Each claim below is re-matched to what the game does today.
- **Uncited claims.** Two design choices have no source on this page: the "Another way" feedback and the same-scenario benchmark. I don't add citations you haven't vetted.
- **Missing limits section.** A learning tool should say what it can't tell you. The redraft adds one.

**Transparency**
- **The AI's role.** "Is AI judging me?" now comes first and is open by default. It says plainly what AI decides, what code decides, and where AI can be wrong.
- **Data.** "What happens to what I type" now covers both claude.ai and the hosted link, including the relay server and the run log kept in the browser.
- **Cost.** It now says who pays for the AI and what happens when the daily budget runs out.

---

## The new page, word for word

**Eyebrow:** How it's made
**Title:** Who made what, and how AI is used
**Lead:** A learning designer designed this game. AI helped write most of the words and the code, and it writes your scenes and feedback live as you play. Here is who does what, what happens to what you type, and why the game works the way it does.

### 1. Is AI judging me? (open by default)
- **AI reads, and code decides.** AI reads what you write and reports what it names: what your plan protects, what it costs, who pays, how specific your plan is, and whether your first words say what you decided and check in. It proposes how the meters move and writes what happens next.
- **Code keeps the score.** Plain code limits every meter move, sets your wellbeing, and sets the readiness verdict. In decisions 1 and 2, where you pick from written options, code judges your choice without AI.
- **No points or grades.** You see words and meter bars, never a score.
- **AI can be wrong.** It can misread what you meant or miss context. Treat its feedback as one reading. Your own judgment, and real work with real people, decide what you take from it.

### 2. What happens to what I type?
- **It goes to an AI model.** Everything you type is sent to an AI model so it can respond to you. That includes your plans, trade-offs, first words, reflections and benchmark answers.
- **How it gets there.** On claude.ai, it goes through claude.ai. On the hosted link, it passes through a small relay server on its way to the AI model, and the relay does not store it.
- **What stays in your browser.** There are no accounts. This browser keeps a run log of your last three games so the designer can review how the AI behaved. Clearing your browser data removes it.
- **What not to type.** The company is fictional. Leave out real names and private details.

### 3. Who made what?
- **The learning designer.** The game format, the learning goals, how support fades across the six decisions, which AI step does what, and the world you play in. Every AI instruction was read and approved before it ran, then tested on sample runs.
- **AI, reviewed by the designer.** The screens, the code, and the text that stays the same between games: the intro, the Skills page, the worked examples and this page. AI drafted them; the designer reviewed, edited and approved them.
- **AI, live in every game.** Each memo and its questions, the options, the debrief after each decision, your story, the readiness check-in, and the marks on your benchmark. Each carries a "Written by AI" label. The designer does not see each one you get.

### 4. Why does the game work this way?
- **Support fades across six decisions.** In decisions 1 and 2 you pick everything. In decision 3 you pick a plan and write the trade-off and your first words. In decisions 4 to 6 you write all three. *Martin et al. (2025); Kirschner & Hendrick (2024), ch. 6*
- **Ask before you decide.** Real decisions come with missing information, so every scene hides a fact you can find by asking. *Herrington & Herrington (2008)*
- **Rate your own answer.** Before you commit a written answer, you rate how complete it is. At the end you see your ratings next to what the checks found, which helps you judge your own work. *Grolnick et al. (2024), ch. 7*
- **The skill guide stays beside you.** What good looks like, sentence frames and two worked examples sit next to every decision, so you never leave your place. *Mayer & Moreno (2003); CAST, UDL Guidelines*
- **Feedback starts with what worked.** Every debrief says how your approach worked before the one gap. *Ocumpaugh et al. (2024)* It then shows another way you could have handled each part, and what that would have cost. ⚑ The "another way" sentence has no citation. Keep it uncited, add a source you trust, or cut the sentence.
- **Practice the part, then the whole.** The game adds written parts in steps: first the trade-off and your first words, then the plan. *Grossman & Salas (2011)*
- **You do the thinking first.** You write and reflect before the AI responds, so it supports your reasoning instead of replacing it. *Melisa et al. (2025)*
- **Moves, not ability.** The check-in talks about moves you made and can change, never about who you are. *Kirschner & Hendrick (2024), ch. 15; Linnenbrink-Garcia et al. (2016)*
- **A benchmark, before and after.** You answer the same short scenario before the story and after it, so you can compare your own two answers. ⚑ No citation. Keep it uncited, add one, or cut it.
- **A person in charge.** The designer reviews the instructions, rules and sample runs, and AI content is labeled. *Li et al. (2025), ARCHED*

### 5. What can't this game tell you? (new)
- **The AI can misread you.** The check-in is told to use only your own words and the story, but read it with that in mind.
- **The meters are a simplification.** Real teams don't move one step at a time.
- **The benchmark is the same scenario both times.** Some change may come from seeing it twice.
- **The readiness verdict is a rough read, not a grade.** It comes from your meters, plus whether about half of the checks on your written answers were fully named.
- **Six decisions is a short practice.** You write the plan three times, and the trade-off and your first words four times each.
- **A small test group.** The game was tested with a small number of players, in plain English.

### 6. Where do the leadership ideas come from?
- **The skill guide.** What good looks like, the do and don't lists, the sentence frames and the worked examples were drafted with AI and reviewed by the designer.
- **The AI's general training.** How the AI phrases things comes from its general training, which can't be traced to sources. That is why it never cites anything to you.
- **A note on evidence.** Practitioner frameworks give useful words for a skill, but they are not proof that a method works. The design choices rest on learning research instead (section 4).

### 7. Which AI models, and what does it cost?
- **Table.** Columns: step / what it does / when. The model column is replaced by one line under the table: "On the hosted link, the default tier is Claude Sonnet 5.5 and the quick tier is Claude Haiku 5.5. On claude.ai, claude.ai chooses."

  | Step | What it does | When |
  |---|---|---|
  | Scenario builder | Writes the memo, the questions and a hidden fact | Before each decision, while you read the last one |
  | Decision builder | Writes options, trade-offs, openings and advice | Before each decision |
  | Judge | Marks your written answer and proposes meter moves | After you commit, decisions 3 to 6 |
  | Narrator | Writes the debrief | After each decision |
  | Readiness check-in | Writes Noor's read and what happened next | End of the game |
  | Quick-check judge | Marks your benchmark and last check | Twice per game |

- **Calls and cost.** About 25 AI calls make one game. On the hosted link they cost about $0.45 a game, paid from the designer's capped budget. When the day's budget is used up, the game says so.
- **Link:** "See the system diagrams on GitHub" → `docs/system-diagrams.md`.

### 8. Reference list
- **Learning research:** the same list as now.
  - ⚑ Krathwohl (2002) is no longer cited anywhere on the site. Keep it for the proposal, or drop it here.
- **AI used to build this game:**
  - Anthropic. (2026). Claude Opus 5.5 [Large language model]. Used in Claude Code for the build and testing.
  - Anthropic. (2026). Claude Sonnet 5.5 [Large language model].
  - Anthropic. (2026). Claude Haiku 5.5 [Large language model].
  - ⚑ Earlier versions were built in claude.ai. Confirm which models to list for them.
  - The note "Draft entries. Full APA 7th references are in the proposal." stays.

---

## Your calls (⚑)
1. The "another way" sentence (section 4): keep uncited, add a source, or cut.
2. The benchmark item (section 4): keep uncited, add a source, or cut.
3. Krathwohl (2002) in the reference list: keep or drop.
4. Which models to list for the claude.ai-built versions.
