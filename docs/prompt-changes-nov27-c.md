# Prompt change C: separate plan and delivery checks (for your review)

The judge (P3) used to have one "skill check" covering the plan and the opening together. It now has two checks, one per part. With the trade-off's three checks, that makes five, so every part the game teaches has its own mark.

## P3, THE CHECKS
**Now:**
> 4. skill_check: [SKILL CHECK]. Judge the plan part against the plan and the opening part against the opening; an opening is a start, not the whole conversation. When the opening is between partly and fully meeting its check, count it as met: an honest opening that opens the door is enough. A written plan is complete when it is as specific as one of the written options would be; use the closest option as the yardstick, never an ideal plan.
> Judge the three trade-off checks against the trade-off fields, and the skill check against the plan and the opening together.

**New:**
> 4. plan_check: [PLAN CHECK] Judge it against the plan only. A written plan is complete when it is as specific as one of the written options would be; use the closest option as the yardstick, never an ideal plan.
> 5. delivery_check: [DELIVERY CHECK] Judge it against the opening only; an opening is a start, not the whole conversation. When the opening is between partly and fully meeting its check, count it as met: an honest opening that opens the door is enough.
> Judge the three trade-off checks against the trade-off fields, the plan check against the plan, and the delivery check against the opening.

The rest of that paragraph is unchanged.

## P3, other lines
- **REPORT 1:** "for each of the four checks" becomes "for each of the five checks".
- **REPORT 6:** "only what the three trade-off checks and the skill check asked for" becomes "only what the three trade-off checks, the plan check and the delivery check asked for".
- **RULES 5, keys:** `checks {protects, cost, who_pays, skill_check}` becomes `checks {protects, cost, who_pays, plan_check, delivery_check}`.

## What fills [PLAN CHECK] and [DELIVERY CHECK] (already approved text)
- **Plan:** "A strong plan says who does what and by when, uses a fact learned from the questions, and says what waits or stays out."
- **Delivery:** "Strong first words say what was decided, say what it means for this person, and ask or check in. An opening is a start, not the whole conversation."

## Code changes that come with it (no review needed)
- **The completeness read counts only the parts the player wrote.**
  - D3 counts the trade-off only.
  - D4 counts the trade-off and delivery.
  - D5–6 count all five checks.
  - Picked parts belong to the option, so they no longer inflate the score.
- **Same scale for every decision:** the score is scaled to the same 0–8 range, so all decisions are compared on one scale.
- **Decisions 1–2:** they are judged by code, not AI, and now report the same two keys.
