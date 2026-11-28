# How The Leadership Game works

```mermaid
flowchart LR
  classDef you fill:#CCFBF1,stroke:#0F766E,color:#0B3B36,stroke-width:2px
  classDef ai fill:#EFE9FF,stroke:#5B3DF5,color:#2A1A7A,stroke-width:2px
  classDef code fill:#EEEEF2,stroke:#4B5563,color:#1F2937,stroke-width:2px
  subgraph KEY[" Color key "]
    direction LR
    k1["You, the player"]:::you
    k2["AI"]:::ai
    k3["Code"]:::code
  end
```

## The whole game

```mermaid
flowchart LR
  classDef you fill:#CCFBF1,stroke:#0F766E,color:#0B3B36,stroke-width:2px
  classDef ai fill:#EFE9FF,stroke:#5B3DF5,color:#2A1A7A,stroke-width:2px
  classDef code fill:#EEEEF2,stroke:#4B5563,color:#1F2937,stroke-width:2px
  A["Benchmark<br/>answer one scenario"]:::you --> B["Six decisions<br/>pick, mix, write"]:::you --> C["Check-in<br/>Noor's read"]:::ai --> D["Last check<br/>same scenario"]:::you --> E["1:1 sheet<br/>for your manager"]:::code
```

## One decision

```mermaid
flowchart LR
  classDef you fill:#CCFBF1,stroke:#0F766E,color:#0B3B36,stroke-width:2px
  classDef ai fill:#EFE9FF,stroke:#5B3DF5,color:#2A1A7A,stroke-width:2px
  classDef code fill:#EEEEF2,stroke:#4B5563,color:#1F2937,stroke-width:2px
  S["Scene<br/>memo and questions"]:::ai --> O["Options<br/>and advice"]:::ai --> P["You decide<br/>pick or write"]:::you --> J["Judge<br/>marks your answer"]:::ai --> M["Meters move<br/>within limits"]:::code --> F["Debrief<br/>what happened"]:::ai
```

**In plain words**
- **AI writes**: the scene, the options, the debrief and the check-in. It also marks what your written answers name.
- **You decide**: you ask two questions, then pick or write your plan, trade-off and first words.
- **Code keeps the score**: it limits how far the meters move, sets your wellbeing and the readiness verdict, and judges decisions 1 and 2, where you pick instead of write.

| AI step | Model on the hosted link |
|---|---|
| Scene, options, judge, check-in | Claude Sonnet 5.5 |
| Debrief, benchmark marks | Claude Haiku 5.5 (smaller and faster) |

About 25 AI calls make one game, at about $0.45.
