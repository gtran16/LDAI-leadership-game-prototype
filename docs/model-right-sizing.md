# Model right-sizing (Nov 27)

Status: recommendation, waiting on Giselle's OK. Prices come from a live fetch of Anthropic's pricing page on Nov 27. Token counts are estimates from reading each prompt and its output spec, not measured.

## Recommendation: keep the current tier map

`TIER = { P2: 'default', P3: 'default', P4: 'quick', P7: 'default', P8: 'quick' }`. The Worker maps `default` → `claude-sonnet-5-5` and `quick` → `claude-haiku-5-5`.

| Prompt | Model | Est. tokens in / out | Why | Open-weight equivalent (RunPod later) |
|---|---|---|---|---|
| P2a scenario builder | Sonnet 5.5 | 5K / 0.9K | Player-facing, must stay coherent across decisions, many style rules | Qwen3-32B or Llama-3.3-70B |
| P2b decision builder | Sonnet 5.5 | 6.5K / 2.7K | Largest output; meter math; must not contradict the scene | Qwen3-235B-A22B |
| P3 judge | Sonnet 5.5 | 5.5K / 0.7K | Drives the meters; exact quotes; judges only what the player could see | Qwen3-235B-A22B |
| P4 narrator | Haiku 5.5 | 6.5K / 0.35K | Short, bounded output (close call; see below) | Qwen3-30B-A3B |
| P7 readiness check-in | Sonnet 5.5 | 8K / 0.9K | Runs once; long synthesis that must check its own quotes | Qwen3-235B-A22B |
| P8 quick-check judge | Haiku 5.5 | 0.4K / 0.15K | Three named / partly / missing labels | Qwen3-8B or Llama-3.1-8B |

Opus is not needed for any call. The open-weight names come from model knowledge, not a check; recheck them before RunPod work.

## Cost

- **Per game:** about $0.45.
- **5 games a day, every day:** about $67 a month. The $10 Console limit would stop it on day 4 or 5.
- **Realistic class use (10 to 15 games):** about $5 to $7, inside the cap.
- **Real backstop:** the Console spend limit. The 125-calls-a-day Worker cap limits volume but does not keep a month inside $10.

## Worker settings

- **`max_tokens` caps:** `default` 4096, `quick` 1024. Tighter caps truncate the JSON and cause retries.
- **Extended thinking:** off on every call, because it bills as output.
- **Later, not a freeze blocker:** prompt caching of the fixed instructions plus the world seed.

## What would change a pick

- **P4 to Sonnet:** if the live run log shows "landed", fragments or other style slips in P4, move it to Sonnet (about +$0.08 a game).
- **P2a to Haiku:** if the Sonnet rows are clean, P2a is the first candidate to move down to Haiku.
- **Counter-case:** everything on Haiku costs about $0.03 a game, but risks P2b's meter math, P3's quotes and style slips.
