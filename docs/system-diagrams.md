# The Leadership Game: system diagrams

How one play-through works, and who does what at each step. Colors: **teal is you (the player)**, **purple is AI**, **gray is code**.

## One decision

```mermaid
flowchart TD
  classDef you fill:#CCFBF1,stroke:#0F766E,color:#0B3B36
  classDef ai fill:#EFE9FF,stroke:#5B3DF5,color:#2A1A7A
  classDef code fill:#EEEEF2,stroke:#4B5563,color:#1F2937

  A["Code gathers the world, the plan for this decision,<br/>your story so far and the four meters"]:::code
  B["Scenario builder writes the memo, four questions<br/>and one hidden fact"]:::ai
  C["Decision builder writes the options, trade-offs,<br/>two openings and a manager's advice"]:::ai
  D["You ask two questions, then pick or write<br/>your plan, trade-off and first words"]:::you
  E["You rate how complete your answer is<br/>(decisions 3 to 6)"]:::you
  F{"Did you write<br/>any part?"}:::code
  G["Code judges the picked option<br/>(decisions 1 and 2)"]:::code
  H["Judge reads what you wrote, marks five checks<br/>and proposes meter moves"]:::ai
  I["Code limits the moves, sets your wellbeing,<br/>and updates the meters"]:::code
  J["Narrator writes what happened, why each meter moved,<br/>and how your approach worked, with another way"]:::ai
  K["You read the debrief and go on"]:::you

  A --> B --> C --> D --> E --> F
  F -- no --> G --> I
  F -- yes --> H --> I
  I --> J --> K
```

## The whole game

```mermaid
flowchart TD
  classDef you fill:#CCFBF1,stroke:#0F766E,color:#0B3B36
  classDef ai fill:#EFE9FF,stroke:#5B3DF5,color:#2A1A7A
  classDef code fill:#EEEEF2,stroke:#4B5563,color:#1F2937

  P["Benchmark: you answer one short scenario"]:::you
  P8a["Quick-check judge marks protects, cost,<br/>who pays and delivery"]:::ai
  S["Six decisions: pick (1-2), mix (3-4), write (5-6)"]:::you
  R["Your own read: what went best, what was hard,<br/>and your readiness call"]:::you
  V["Code sets the verdict from your meters,<br/>and compares your completeness ratings with the checks"]:::code
  N["Readiness check-in: Noor's read and what happened next"]:::ai
  Q["Last check: the same scenario again"]:::you
  P8b["Quick-check judge marks it the same way"]:::ai
  C["Before and after, side by side"]:::code

  P --> P8a --> S --> R --> V --> N --> Q --> P8b --> C
```

## Where each call runs

| Step | What it does | Model tier | Hosted link uses |
|---|---|---|---|
| Scenario builder | The memo, questions and a hidden fact | default | Claude Sonnet 5.5 |
| Decision builder | Options, trade-offs, openings, advice | default | Claude Sonnet 5.5 |
| Judge | Marks your written answer and proposes meter moves (decisions 3 to 6) | default | Claude Sonnet 5.5 |
| Narrator | The debrief after each decision | quick | Claude Haiku 5.5 |
| Readiness check-in | Noor's read and what happened next | default | Claude Sonnet 5.5 |
| Quick-check judge | The benchmark and the last check | quick | Claude Haiku 5.5 |

About 25 AI calls make one game. On claude.ai, claude.ai chooses the model for each tier; on the hosted link, a small relay server (a Cloudflare Worker) sends each call to the model above.
