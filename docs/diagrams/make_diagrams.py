# Regenerate: python3 docs/diagrams/make_diagrams.py  (writes one-decision.svg and whole-game.svg next to this file)
# Generates the two diagrams as plain SVG (text, rects, arrows only, so GitHub renders them as images).
import html, os
OUT = os.path.dirname(os.path.abspath(__file__))
C = {'you': ('#CCFBF1', '#0F766E', '#0B3B36'), 'ai': ('#EFE9FF', '#5B3DF5', '#2A1A7A'), 'code': ('#EEEEF2', '#4B5563', '#1F2937'), 'infra': ('#FFFFFF', '#1E1B3A', '#1E1B3A')}
FONT = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif"
def wrap(t, n):
    out, line = [], ''
    for w in t.split():
        if len(line) + len(w) + (1 if line else 0) > n: out.append(line); line = w
        else: line = (line + ' ' + w).strip()
    if line: out.append(line)
    return out
def box(x, y, w, h, kind, title, body='', chars=None):
    f, s, tc = C[kind]
    chars = chars or int((w - 20) / 7.1)
    o = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{f}" stroke="{s}" stroke-width="2"/>']
    ty = y + 22
    for ln in wrap(title, int((w - 20) / 8.2)):
        o.append(f'<text x="{x + 10}" y="{ty}" style="{FONT};font-size:14.5px;font-weight:700" fill="{tc}">{html.escape(ln)}</text>'); ty += 18
    ty += 2
    for ln in wrap(body, chars):
        o.append(f'<text x="{x + 10}" y="{ty}" style="{FONT};font-size:12.5px" fill="{tc}">{html.escape(ln)}</text>'); ty += 16
    return '\n'.join(o)
def arrow(x1, y1, x2, y2, label='', color='#1E1B3A', dash=False, lx=None, ly=None):
    d = ' stroke-dasharray="6 5"' if dash else ''
    o = [f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="2"{d} marker-end="url(#ah)"/>']
    if label:
        o.append(f'<text x="{lx if lx is not None else (x1 + x2) / 2}" y="{ly if ly is not None else (y1 + y2) / 2 - 6}" text-anchor="middle" style="{FONT};font-size:12px;font-style:italic" fill="#5A5675">{html.escape(label)}</text>')
    return '\n'.join(o)
def path(d, color='#1E1B3A', dash=False):
    dd = ' stroke-dasharray="6 5"' if dash else ''
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2"{dd} marker-end="url(#ah)"/>'
def svg(w, h, body, title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{html.escape(title)}">
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1E1B3A"/></marker></defs>
<rect width="{w}" height="{h}" fill="#FFFDF6"/>
{body}
</svg>'''
def key(x, y):
    o = [f'<text x="{x}" y="{y + 14}" style="{FONT};font-size:13px;font-weight:700" fill="#1E1B3A">Color key</text>']
    xx = x + 80
    for k, lab in [('you', 'You, the player'), ('ai', 'AI'), ('code', 'Code')]:
        f, s, tc = C[k]
        o.append(f'<rect x="{xx}" y="{y}" width="18" height="18" rx="4" fill="{f}" stroke="{s}" stroke-width="2"/><text x="{xx + 26}" y="{y + 14}" style="{FONT};font-size:13px" fill="#1E1B3A">{lab}</text>')
        xx += 26 + len(lab) * 7.5 + 22
    return '\n'.join(o)

# ---------- 1. One decision, in three lanes ----------
W, H = 1320, 690
L = {'you': 96, 'ai': 290, 'code': 484}   # lane tops
LH = 180
b = []
b.append(f'<text x="24" y="34" style="{FONT};font-size:22px;font-weight:800" fill="#1E1B3A">One decision: who does what</text>')
b.append(f'<text x="24" y="56" style="{FONT};font-size:13px" fill="#5A5675">Six decisions run this loop. The story log grows each time, and the next scene starts from what your last plan caused.</text>')
b.append(key(900, 36))
for k, lab in [('you', 'YOU'), ('ai', 'AI'), ('code', 'CODE')]:
    f, s, tc = C[k]
    b.append(f'<rect x="20" y="{L[k] + 10}" width="1280" height="{LH - 10}" rx="12" fill="{f}" opacity="0.35"/>')
    b.append(f'<text x="46" y="{L[k] + 34}" style="{FONT};font-size:13px;font-weight:800;letter-spacing:2px" fill="{s}">{lab}</text>')
bw, bh = 168, 140
X = [80, 262, 446, 630, 814, 998, 1142]
# code: build prompt
b.append(box(X[0], L['code'] + 30, bw, bh, 'code', '1. Build the prompt', 'World and cast, the plan for this decision, the story so far, meter words.'))
# ai: scenario builder, decision builder
b.append(box(X[1], L['ai'] + 26, bw, bh, 'ai', '2. Scenario builder', 'A memo, four questions, one hidden fact, and a "since last time" nudge.'))
b.append(box(X[2], L['ai'] + 26, bw, bh, 'ai', '3. Decision builder', 'Five options with meter moves and trade-offs, two first-line openings, a manager\'s advice.'))
# you: ask + decide
b.append(box(X[2], L['you'] + 22, bw, bh - 10, 'you', '4. Ask two questions', 'Each answer may reveal the hidden fact.'))
b.append(box(X[3], L['you'] + 22, bw + 10, bh - 10, 'you', '5. Decide', 'Pick or write the plan, trade-off and first words. Tick the checklist (D3-6). Frames in D4-5.'))
# branch: code judge D1-2 / AI judge D3-6
b.append(box(X[4], L['code'] + 30, bw, bh, 'code', '6a. Code judges (D1-2)', 'You picked everything, so the option\'s own moves and the opening\'s verdict apply.'))
b.append(box(X[4], L['ai'] + 26, bw, bh, 'ai', '6b. Judge (D3-6)', 'Marks five checks, notes what you surfaced, proposes meter moves with reasons.'))
# code: rules
b.append(box(X[5], L['code'] + 30, bw, bh, 'code', '7. Rules', 'Caps each move at 2, sets wellbeing, drops a doubled "since last time", compares ticks with checks.'))
# ai: narrator
b.append(box(X[5], L['ai'] + 26, bw, bh, 'ai', '8. Narrator', 'What happened, why each meter moved, how your approach worked, another way.'))
# you: debrief
b.append(box(X[6] - 10, L['you'] + 22, bw - 8, bh - 10, 'you', '9. Read the debrief', 'Your ticks next to the checks, then the next decision.'))
# arrows
b.append(arrow(X[0] + bw, L['code'] + 70, X[1], L['ai'] + 90))
b.append(arrow(X[1] + bw, L['ai'] + 85, X[2], L['ai'] + 85))
b.append(arrow(X[2] + bw / 2, L['ai'] + 26, X[2] + bw / 2, L['you'] + 22 + bh - 10))
b.append(arrow(X[2] + bw, L['you'] + 75, X[3], L['you'] + 75))
b.append(path(f'M{X[3] + bw + 10},{L["you"] + 60} C{X[4] + 40},{L["you"] + 60} {X[4] + 40},{L["ai"] - 10} {X[4] + 60},{L["ai"] + 26}'))
b.append(f'<text x="{X[4] + 70}" y="{L["ai"] + 8}" style="{FONT};font-size:12px;font-style:italic" fill="#5A5675">you wrote a part</text>')
b.append(path(f'M{X[3] + 40},{L["you"] + 22 + bh - 10} C{X[3] + 40},{L["code"] + 20} {X[4] - 40},{L["code"] + 60} {X[4]},{L["code"] + 70}', dash=True))
b.append(f'<text x="{X[3] + 6}" y="{L["code"] + 24}" style="{FONT};font-size:12px;font-style:italic" fill="#5A5675">all picked (D1-2)</text>')
b.append(arrow(X[4] + bw, L['ai'] + 85, X[5], L['code'] + 70))
b.append(arrow(X[4] + bw, L['code'] + 95, X[5], L['code'] + 95))
b.append(arrow(X[5] + bw / 2, L['code'] + 30, X[5] + bw / 2, L['ai'] + 26 + bh))
b.append(arrow(X[5] + bw, L['ai'] + 70, X[6] + 10, L['you'] + 22 + bh - 10))
# loop back: up from the debrief, along the top margin, down the left edge into step 1
b.append(path(f'M{X[6] + 60},{L["you"] + 22} L{X[6] + 60},{L["you"] - 8} L32,{L["you"] - 8} L32,{L["code"] + 100} L{X[0]},{L["code"] + 100}', dash=True))
b.append(f'<text x="640" y="{L["you"] - 14}" text-anchor="middle" style="{FONT};font-size:12px;font-style:italic" fill="#5A5675">next decision: the story log and meters carry forward</text>')
open(os.path.join(OUT, 'one-decision.svg'), 'w').write(svg(W, H, '\n'.join(b), 'One decision: who does what'))

# ---------- 2. The whole game and where it runs ----------
W2, H2 = 1320, 660
g = []
g.append(f'<text x="24" y="34" style="{FONT};font-size:22px;font-weight:800" fill="#1E1B3A">The whole game, and where it runs</text>')
g.append(key(900, 18))
g.append(f'<text x="24" y="70" style="{FONT};font-size:14px;font-weight:800;letter-spacing:1px" fill="#5A5675">THE GAME, START TO FINISH</text>')
steps = [('you', 'Benchmark', 'Answer one short scenario. AI marks protects, cost, who pays, delivery.'),
         ('you', 'Decisions 1-2', 'Pick the plan, the trade-off and the first words.'),
         ('you', 'Decision 3', 'Pick the plan; write the trade-off and first words.'),
         ('you', 'Decisions 4-6', 'Write all three: frames in 4-5, none in 6.'),
         ('you', 'Your read', 'What went best, what was hard, one change, your call.'),
         ('code', 'Verdict', 'Meters out of the red, and 80% of written checks named.'),
         ('ai', 'Check-in', 'Noor\'s read and what happened next, fit to the verdict.'),
         ('you', 'Last check', 'After the story ends: the same scenario, then before and after.'),
         ('code', '1:1 sheet', 'Questions, manager support, reminders in your words. No game names.')]
sw, sh, gap = 132, 132, 10
x = 24
for i, (k, t, d) in enumerate(steps):
    g.append(box(x, 84, sw, sh, k, t, d, chars=17))
    if i < len(steps) - 1: g.append(arrow(x + sw, 84 + sh / 2, x + sw + gap, 84 + sh / 2))
    x += sw + gap
g.append(f'<text x="24" y="246" style="{FONT};font-size:12.5px;font-style:italic" fill="#5A5675">Support fades: you pick, then you write one part, then all three. A Skill guide with frames and worked examples sits beside every decision.</text>')
# architecture
g.append(f'<text x="24" y="292" style="{FONT};font-size:14px;font-weight:800;letter-spacing:1px" fill="#5A5675">WHERE IT RUNS (THE HOSTED LINK)</text>')
g.append(box(24, 306, 300, 170, 'infra', 'Your browser', 'One file, index.html, served by GitHub Pages. It holds the game, the world, all six prompts and the rules. It keeps the meters, story and run log in the browser. No accounts.', chars=40))
g.append(box(440, 306, 300, 170, 'code', 'Relay: Cloudflare Worker', 'Answers only the game\'s page. Stops at 125 calls a day (about 5 games). Picks the model for each step and caps reply length. Holds the API key as a secret; the key never reaches the browser.', chars=40))
g.append(box(840, 306, 290, 170, 'infra', 'Anthropic API', 'Claude Sonnet 5.5: scene, options, judge, debrief, check-in. Claude Haiku 5.5: benchmark marks. Prepaid $10 budget, no auto-reload.', chars=40))
g.append(arrow(324, 370, 440, 370, 'your text', lx=382, ly=360))
g.append(arrow(440, 420, 324, 420, 'reply', lx=382, ly=440))
g.append(arrow(740, 370, 840, 370, 'one call', lx=790, ly=360))
g.append(arrow(840, 420, 740, 420, 'reply', lx=790, ly=440))
g.append(box(1150, 306, 146, 170, 'infra', 'claude.ai version', 'The same file as an artifact uses claude.ai\'s own AI instead of the relay.', chars=17))
# what code owns vs AI owns
g.append(f'<text x="24" y="522" style="{FONT};font-size:14px;font-weight:800;letter-spacing:1px" fill="#5A5675">WHO DECIDES WHAT</text>')
g.append(box(24, 536, 420, 100, 'ai', 'AI writes and marks', 'Scenes, options, debriefs, the check-in, and what your written answers name. It can be wrong; every piece is labeled.', chars=58))
g.append(box(460, 536, 420, 100, 'code', 'Code keeps the score', 'Meter limits, wellbeing, the verdict, decisions 1-2, the checklist read, the 1:1 sheet, the daily cap.', chars=58))
g.append(box(896, 536, 400, 100, 'you', 'You decide', 'What to ask, what to do, what it costs, what to say, and which parts you think you named.', chars=55))
open(os.path.join(OUT, 'whole-game.svg'), 'w').write(svg(W2, H2, '\n'.join(g), 'The whole game, and where it runs'))
print('ok')
