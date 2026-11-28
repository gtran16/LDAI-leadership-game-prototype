# Model right-sizing (Nov 27)

Status: approved by Giselle, Nov 27, and live on the hosted link (Cloudflare Worker, workspace-scoped header, thinking off). Prices come from a live fetch of Anthropic's pricing page on Nov 27. Token counts are estimates from reading each prompt and its output spec, not measured.

## Recommendation: keep the current tier map

`TIER = { P2: 'default', P3: 'default', P4: 'default', P7: 'default', P8: 'quick' }` (P4 moved to Sonnet in V4.10). The Worker maps `default` → `claude-sonnet-5-5` and `quick` → `claude-haiku-5-5`.

| Prompt | Model | Est. tokens in / out | Why | Open-weight equivalent (RunPod later) |
|---|---|---|---|---|
| P2a scenario builder | Sonnet 5.5 | 5K / 0.9K | Player-facing, must stay coherent across decisions, many style rules | Qwen3-32B or Llama-3.3-70B |
| P2b decision builder | Sonnet 5.5 | 6.5K / 2.7K | Largest output; meter math; must not contradict the scene | Qwen3-235B-A22B |
| P3 judge | Sonnet 5.5 | 5.5K / 0.7K | Drives the meters; exact quotes; judges only what the player could see | Qwen3-235B-A22B |
| P4 narrator | Sonnet 5.5 (was Haiku) | 6.5K / 0.35K | Moved up after the final playtest: on Haiku it misquoted the player and narrated an option the player didn't write | Qwen3-32B |
| P7 readiness check-in | Sonnet 5.5 | 8K / 0.9K | Runs once; long synthesis that must check its own quotes | Qwen3-235B-A22B |
| P8 quick-check judge | Haiku 5.5 | 0.4K / 0.15K | Four named / partly / missing labels (protects, cost, who pays, delivery) | Qwen3-8B or Llama-3.1-8B |

Opus is not needed for any call. The open-weight names come from model knowledge, not a check; recheck them before RunPod work.

## Cost

Six decisions make about 25 calls a game: 6 scenario builder, 6 decision builder, 4 judge (decisions 3 to 6), 6 narrator, 1 check-in and 2 quick checks. The original estimate below assumed about 22 calls.

- **Per game:** about $0.53 (was $0.45 before P4 moved to Sonnet).
- **5 games a day, every day:** about $67 a month. The $10 Console limit would stop it on day 4 or 5.
- **Realistic class use (10 to 15 games):** about $5 to $7, inside the cap.
- **Real backstop:** the Console spend limit. The 125-calls-a-day Worker cap limits volume but does not keep a month inside $10.

## Worker settings

- **`max_tokens` caps:** `default` 8192, `quick` 1024. The decision builder's reply runs about 4K tokens (about 15K characters), so the first cap of 4096 cut it off in the final playtest. Only tokens used are billed.
- **Extended thinking:** off on every call, because it bills as output. Sonnet 5.5 turns it off with `between_tools`; Haiku 5.5 with `disabled`.
- **Later, not a freeze blocker:** prompt caching of the fixed instructions plus the world seed, and a shorter P2B reply (it is the slowest call).

## What would change a pick

- **P4 to Sonnet:** done in V4.10, after the playtest run log showed misquotes and an invented story (about +$0.08 a game).
- **P2a to Haiku:** if the Sonnet rows are clean, P2a is the first candidate to move down to Haiku.
- **Counter-case:** everything on Haiku costs about $0.03 a game, but risks P2b's meter math, P3's quotes and style slips.
