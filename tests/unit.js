/* Unit tests for the game's pure logic, run inside the page via GAME.__test. Run: node tests/unit.js */
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const results = await page.evaluate(() => {
    const T = GAME.__test, G = T.G, out = [];
    const eq = (name, got, want) => { const g = JSON.stringify(got), w = JSON.stringify(want); out.push([name, g === w, g === w ? '' : 'got ' + g + ', want ' + w]); };
    const throws = (name, fn) => { try { fn(); out.push([name, false, 'did not throw']); } catch (e) { out.push([name, true, '']); } };
    // Support fade
    eq('band 1..6 (2-1-3)', [1, 2, 3, 4, 5, 6].map(T.band), ['options', 'options', 'mix', 'text', 'text', 'text']);
    G.n = 3; eq('modes D3 picks plan, writes tradeoff and opening', T.modes({}, 'mix'), { planPick: true, tradePick: false, openPick: false });
    eq('modes text', T.modes({}, 'text'), { planPick: false, tradePick: false, openPick: false });
    eq('stageWrites', [1, 2, 3, 4, 5, 6].map(T.stageWrites), [[], [], ['tradeoff', 'delivery'], ['plan', 'tradeoff', 'delivery'], ['plan', 'tradeoff', 'delivery'], ['plan', 'tradeoff', 'delivery']]);
    // Completeness read
    eq('calLevel scale', [8, 7, 6, 5, 4, 3, 2, 1, 0].map(T.calLevel), [4, 3, 3, 2, 2, 1, 1, 0, 0]);
    const J5 = { checks: { protects: { status: 'named' }, cost: { status: 'Partly' }, who_pays: { status: 'missing' }, plan_check: { status: 'named' }, delivery_check: { status: 'named' } } };
    eq('checkScore all five parts (7 of 10 points -> 5.6 of 8)', T.checkScore(J5).toFixed(1), '5.6');
    eq('checkScore tradeoff only (3 of 6 -> 4 of 8)', T.checkScore(J5, ['protects', 'cost', 'who_pays']), 4);
    eq('checkScore no written parts', T.checkScore(J5, []), 0);
    G.n = 3; eq('writtenKeys D3: tradeoff and delivery', T.writtenKeys(T.modes({}, 'mix')), ['protects', 'cost', 'who_pays', 'delivery_check']);
    eq('writtenKeys D4-6: all five', T.writtenKeys(T.modes({}, 'text')), ['protects', 'cost', 'who_pays', 'plan_check', 'delivery_check']);
    eq('checkScore no checks', T.checkScore({}), 0);
    G.cal = [{ said: 2, score: 5 }, { said: 3, score: 5 }, { said: 4, score: 4 }, { said: 2, score: 5 }]; eq('calRead: playtest 3 data is over, not matched', T.calRead(), 'over');
    G.cal = [{ said: 2, score: 5 }, { said: 3, score: 6 }]; eq('calRead all matched', T.calRead(), 'calibrated');
    G.cal = [{ said: 0, score: 8 }, { said: 1, score: 6 }]; eq('calRead under', T.calRead(), 'under');
    G.cal = [{ said: 3, score: 4 }, { said: 1, score: 4 }, { said: 2, score: 4 }, { said: 2, score: 5 }]; eq('calRead mixed', T.calRead(), 'mixed');
    G.cal = [{ said: 4, score: 0 }]; eq('calRead needs two', T.calRead(), 'not_enough');
    // Parsing and normalizing AI output
    eq('parseJSON fenced', T.parseJSON('```json\n{"a":1}\n```'), { a: 1 });
    eq('parseJSON with preamble', T.parseJSON('Here you go: {"a":[1,2]} thanks'), { a: [1, 2] });
    eq('parseJSON invalid', T.parseJSON('{"a":'), null);
    eq('parseJSON empty', T.parseJSON(''), null);
    eq('normDelta clamps and fills', T.normDelta({ team: '2', boss: 5, business: -9, extra: 1 }), { team: 2, boss: 3, business: -3, wellbeing: 0 });
    eq('normSince team', T.normSince({ meter: 'Team standing', delta: -1, reason: 'Remi covered again.' }), { key: 'team', d: -1, reason: 'Remi covered again.' });
    eq('normSince never wellbeing', T.normSince({ meter: 'wellbeing', delta: -1, reason: 'x' }), null);
    eq('normSince zero delta', T.normSince({ meter: 'boss', delta: 0, reason: 'x' }), null);
    eq('normScene splits brief', T.normScene({ brief: 'One.\nTwo.', questions: [{ to: 'Noor', q: 'a?', a: 'b' }, { to: 'Remi', question: 'c?', answer: 'd' }] }).brief, ['One.', 'Two.']);
    throws('normScene needs two questions', () => T.normScene({ brief: ['x'], questions: [{ to: 'N', q: 'a', a: 'b' }] }));
    const opt = (v) => ({ slot: 'go', text: 'Do it.', delta: { team: 1 }, tradeoff: { protects: 'p', costs: 'c', who_pays: 'w' }, openings: [{ text: 'Hi', verdict: v }] });
    throws('normOptions needs five', () => T.normOptions({ options: [opt('strong')] }));
    const no = T.normOptions({ options: [opt('strong'), opt('pitfall'), opt('strong'), opt('strong'), opt('strong')], peer_advice: { plan: { question: 'q', start: 's' } } });
    eq('normOptions strong vs pitfall', [no.options[0].openings[0].lands, no.options[1].openings[0].lands], [true, false]);
    eq('normOptions advice and tradeoff', [no.adviceP.question, no.options[0].tc], ['q', 'c']);
    // Meters
    eq('movesFrom clamps and reads shapes', T.movesFrom({ shifts: { team: { delta: 3 }, boss: -1, business: { delta: '1' }, wellbeing: { delta: -5 } } }), { team: 2, boss: -1, business: 1, wellbeing: -2 });
    const D = { options: [{ delta: { team: 1, boss: 0, business: -1, wellbeing: 0 }, reasons: { team: 'r' } }] };
    let j = { shifts: { team: { delta: 0 }, boss: { delta: 0 }, business: { delta: 0 } } }; T.zeroGuard(D, { pick: 0 }, j);
    eq('zeroGuard uses picked option when judge moved nothing', [j.shifts.team.delta, j.shifts.business.delta, !!j.zero_guard], [1, -1, true]);
    j = { shifts: { team: { delta: 0 }, boss: { delta: -1 }, business: { delta: 0 } } }; T.zeroGuard(D, { pick: 0 }, j);
    eq('zeroGuard leaves a real judge move alone', j.shifts.boss.delta, -1);
    j = { shifts: { team: 0, boss: 0, business: 0 } }; T.zeroGuard({ options: [{ delta: { team: 0, boss: 0, business: 0 } }] }, { pick: 0 }, j);
    eq('zeroGuard needs option movement', !!j.zero_guard, false);
    j = { shifts: { team: 0, boss: 0, business: 0 } }; T.zeroGuard(D, { pick: null }, j);
    eq('zeroGuard skips written plans', !!j.zero_guard, false);
    // Wellbeing (code-owned)
    Object.assign(G, { n: 3, lastAbsorb: 0, clean: 0, meters: { team: 6, boss: 6, business: 5, wellbeing: 7 } });
    j = { you_take_on_work: true }; T.wellbeingRule({ options: [] }, { pick: null }, j); eq('wellbeing: take on work -1', j.shifts.wellbeing.delta, -1);
    G.n = 4; j = { you_take_on_work: true }; T.wellbeingRule({ options: [] }, { pick: null }, j); eq('wellbeing: again soon -2', j.shifts.wellbeing.delta, -2);
    G.n = 5; G.meters.wellbeing = 4; j = { you_take_on_work: false, you_step_away: true }; T.wellbeingRule({ options: [] }, { pick: null }, j); eq('wellbeing: step away +2', j.shifts.wellbeing.delta, 2);
    G.meters.wellbeing = 7; j = { you_take_on_work: false }; T.wellbeingRule({ options: [] }, { pick: null }, j); eq('wellbeing: never above default', j.shifts.wellbeing.delta, 0);
    // Verdict (code-owned)
    const h = (t, b, bu, w) => ({ meters: { team: t, boss: b, business: bu, wellbeing: w } });
    G.cal = []; G.hist = [h(7, 6, 6, 7), h(7, 6, 6, 7)]; eq('verdict ready (no written data)', T.verdictOf(), 'ready');
    G.cal = [{ named: 4, partly: 1, missing: 0 }, { named: 4, partly: 0, missing: 0 }]; eq('verdict ready: meters fine, 80%+ named', T.verdictOf(), 'ready');
    G.cal = [{ named: 3, partly: 1, missing: 1 }, { named: 2, partly: 2, missing: 0 }]; eq('verdict support: meters fine, 5 of 9 named (under 80%)', T.verdictOf(), 'support');
    G.cal = [{ named: 1, partly: 4, missing: 0 }, { named: 1, partly: 3, missing: 1 }]; eq('verdict support: meters fine, writing mostly partly', T.verdictOf(), 'support');
    G.cal = [];
    G.hist = [h(7, 4, 4, 7), h(7, 4, 4, 7)]; eq('verdict support (two in red at end)', T.verdictOf(), 'support');
    G.hist = [h(4, 4, 6, 7), h(4, 4, 6, 7), h(4, 4, 6, 7)]; eq('verdict keep building', T.verdictOf(), 'keep_building');
    // Safety
    eq('esc', T.esc('<img src=x onerror="a()">&'), '&lt;img src=x onerror=&quot;a()&quot;&gt;&amp;');
    // Commit gate
    G.n = 1; eq('ready D1 without confidence', T.ready.call(null, (G.cur = { asked: [0, 1], pick: 0, opening: 1, conf: null, tp: '', tc: '', tw: '', tt: '', plan: '', open: '' }, undefined)), true);
    G.n = 3; G.cur = { asked: [0, 1], pick: 0, opening: null, conf: null, tp: 'a', tc: 'b', tw: 'c', tt: '', plan: '', open: 'Remi, I decided' }; eq('ready D3 needs confidence', T.ready(), false);
    G.cur.conf = 2; eq('ready D3 with confidence', T.ready(), true);
    G.cur.tw = '  '; eq('ready D3 blank field', T.ready(), false);
    return out;
  });
  const fails = results.filter(r => !r[1]);
  results.forEach(r => console.log((r[1] ? 'ok   ' : 'FAIL ') + r[0] + (r[2] ? '  (' + r[2] + ')' : '')));
  console.log('\n' + (results.length - fails.length) + ' of ' + results.length + ' passed');
  await browser.close();
  process.exit(fails.length ? 1 : 0);
})();
