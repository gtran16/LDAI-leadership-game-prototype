/* QA: failure modes, navigation, injection, the Worker path, phone-width overflow. Run: node tests/qa.js */
const { chromium } = require('playwright');
const path = require('path');
const { ROUTES } = require('./stub');
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const results = [];
const check = (name, ok, note) => results.push([name, !!ok, note || '']);

async function newGame(browser, opts = {}) {
  const page = await browser.newPage({ viewport: { width: opts.width || 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const state = { mode: {}, count: {} };
  await page.exposeFunction('__stubReply', (prompt) => {
    for (const [re, v] of ROUTES) if (re.test(prompt)) {
      const k = re.source.slice(7, 30); state.count[k] = (state.count[k] || 0) + 1;
      const m = state.mode[k];
      if (m === 'badOnce' && state.count[k] === 1) return { text: 'Sorry, here is the scene: not JSON', truncated: false };
      if (m === 'bad') return { text: 'not json at all', truncated: false };
      if (m === 'truncOnce' && state.count[k] === 1) return { text: JSON.stringify(v).slice(0, 50), truncated: true };
      if (m === 'busy') return { error: 'rate_limited' };
      return { text: JSON.stringify(v), truncated: false };
    }
    return { text: '', truncated: false };
  });
  if (!opts.noAI) await page.addInitScript(() => { window.claude = { use: async () => async (p) => { const r = await window.__stubReply(p); if (r.error) { const e = new Error('busy'); e.code = r.error; throw e; } return r; } }; });
  return { page, errs, state, act: (a) => page.locator('[data-act="' + a + '"]:visible').first() };
}
const key = (s) => s.slice(7, 30);
const P2A = key('You are the scenario builder for a leadership decision game'), P3 = key('You read one answer from a player and report what it did');

async function toDecision(g, n, pre = true) {
  const { page, act } = g;
  await page.goto(FILE + '#play'); await page.waitForTimeout(200);
  if (pre) { await page.fill('[data-pc="pre"]', 'I would fix the customer issue first, so the report waits and my boss presents a shorter version.'); await act('preDone').click(); }
  else await act('pcSkip').click();
  await act('skipIntro').click(); await act('beginGame').click();
  for (let k = 1; k <= n; k++) {
    await page.getByRole('heading', { name: 'Decision ' + k + ' of 6' }).waitFor();
    const asks = page.locator('[data-ask]:visible'); await asks.nth(0).click(); await asks.nth(1).click();
    await act('toDecide').click(); await act('commit').waitFor();
    if (k === n) return;
    await answer(g); await act('commit').click(); await act('next').click();
  }
}
async function answer(g, text) {
  const { page } = g;
  const pick = page.locator('[data-pick]:visible'); if (await pick.count()) await pick.first().click();
  const op = page.locator('[data-opening]:visible'); if (await op.count()) await op.first().click();
  const f = page.locator('[data-f]:visible'); for (let k = 0; k < await f.count(); k++) await f.nth(k).fill(text || 'I will ask Remi to lead it, so two bugs wait a week.');
  const tk = page.locator('[data-tick]:visible'); if (await tk.count()) await tk.first().check();
}

(async () => {
  const browser = await chromium.launch();
  let g;

  // 1. A non-JSON reply is retried once and the scene still loads
  g = await newGame(browser); g.state.mode[P2A] = 'badOnce';
  await toDecision(g, 1);
  check('Bad JSON is retried once, scene loads', (await g.page.locator('[data-act="commit"]').count()) && g.state.count[P2A] >= 2, 'scenario builder calls: ' + g.state.count[P2A]);
  await g.page.close();

  // 2. A truncated reply is retried
  g = await newGame(browser); g.state.mode[P2A] = 'truncOnce';
  await toDecision(g, 1);
  check('Truncated reply is retried, scene loads', (await g.page.locator('[data-act="commit"]').count()) && g.state.count[P2A] >= 2, 'scenario builder calls: ' + g.state.count[P2A]);
  await g.page.close();

  // 3. Judge keeps failing: clear error, answers kept, commit works once the AI recovers
  g = await newGame(browser); await toDecision(g, 3); await answer(g, 'My own plan text');
  g.state.mode[P3] = 'bad'; await g.act('commit').click();
  await g.page.locator('.err').first().waitFor();
  const errText = await g.page.locator('.err').first().textContent();
  check('Judge failure shows a readable error', /unreadable/.test(errText), errText.slice(0, 80));
  check('Answers kept after an error', (await g.page.locator('[data-f="tp"]').inputValue()) === 'My own plan text');
  g.state.mode[P3] = ''; await g.act('commit').click(); await g.act('next').waitFor();
  check('Commit works after the AI recovers', true);
  await g.page.close();

  // 4. Rate limit message
  g = await newGame(browser); await toDecision(g, 3); await answer(g);
  g.state.mode[P3] = 'busy'; await g.act('commit').click(); await g.page.locator('.err').first().waitFor();
  check('Rate limit shows "The AI is busy"', /AI is busy/.test(await g.page.locator('.err').first().textContent()));
  await g.page.close();

  // 5. Leaving for Skills mid-decision and coming back keeps the place and the typed answer
  g = await newGame(browser); await toDecision(g, 5); await g.page.fill('[data-f="plan"]', 'Half-written plan');
  await g.page.click('a[href="#skills"] >> nth=0');
  await g.page.getByRole('heading', { name: 'Skills' }).waitFor();
  check('Skills shows "Back to decision 5"', await g.page.getByText('Back to decision 5').count());
  await g.page.getByText('Back to decision 5').click();
  await g.page.getByRole('heading', { name: 'Decision 5 of 6' }).waitFor();
  check('Back on decision 5 with the typed plan kept', (await g.page.locator('[data-f="plan"]').inputValue()) === 'Half-written plan');
  // 5b. The Play tab goes home; home offers to continue the game in progress
  await g.page.click('.lgnav a[href="#home"]'); await g.page.waitForTimeout(250);
  check('Play tab opens the home page, not the benchmark', (await g.page.getByText('Make the call. Say what it costs.').count()) && !(await g.page.locator('[data-pc="pre"]').count()));
  check('Home offers "Continue decision 5"', await g.page.getByText('Continue decision 5').count());
  check('Tagline leads with the designer', await g.page.getByText('Designed by a learning designer, built with AI.').count());
  await g.page.getByText('Continue decision 5').click(); await g.page.getByRole('heading', { name: 'Decision 5 of 6' }).waitFor();
  check('Continue returns to the same place with answers kept', (await g.page.locator('[data-f="plan"]').inputValue()) === 'Half-written plan');
  // 6. Back to the scene and forward keeps answers
  await g.act('toScene').click(); await g.act('toDecide').click();
  check('Back to the scene and forward keeps answers', (await g.page.locator('[data-f="plan"]').inputValue()) === 'Half-written plan');
  // 7. Start a new run resets
  await g.page.click('#restart'); await g.page.waitForTimeout(200);
  check('Start a new run goes to the benchmark and resets meters', (await g.page.locator('[data-pc="pre"]').count()) && (await g.page.evaluate(() => JSON.stringify(GAME.__test.G.meters))) === '{"team":6,"boss":6,"business":6,"wellbeing":7}');
  await g.page.close();

  // 8. Typed HTML is shown as text, never run
  g = await newGame(browser); await toDecision(g, 3);
  await answer(g, '<img src=x onerror="window.__pwned=1"> <b>bold</b>'); await g.act('commit').click(); await g.act('next').waitFor();
  await g.page.locator('details.review summary').click();
  check('Typed HTML is escaped', !(await g.page.evaluate(() => window.__pwned)) && (await g.page.locator('details.review b:has-text("bold")').count()) === 0);
  await g.page.close();

  // 9. Skipping the benchmark: no last check, no before and after
  g = await newGame(browser); await toDecision(g, 6, false); await answer(g); await g.act('commit').click(); await g.act('next').click();
  for (const t of await g.page.locator('[data-rv]:visible').all()) await t.fill('x');
  await g.page.locator('[data-rvcall]').nth(0).click(); await g.act('runReview').click();
  await g.page.getByRole('heading', { name: 'Noor’s read' }).waitFor();
  const steps = []; for (let k = 0; k < 10; k++) { steps.push(await g.page.locator('#main section.card h2').first().textContent()); const nx = g.page.locator('[data-act="rvNext"]:visible'); if (!(await nx.count())) break; await nx.click(); }
  check('Skipped benchmark: no last check or before-and-after', JSON.stringify(steps) === JSON.stringify(['Noor’s read', 'What happened next', 'The game is over']) && !(await g.page.locator('[data-act="toPost"]').count()) && !(await g.page.getByRole('heading', { name: 'Before and after' }).count()), steps.join(' / '));
  await g.page.close();

  // 10. No live AI: clear message, no crash
  g = await newGame(browser, { noAI: true }); await g.page.goto(FILE); await g.page.evaluate(() => { LG.WORKER_URL = ''; LG._s = null; }); await g.page.evaluate(() => { location.hash = 'play'; }); await g.page.waitForTimeout(300);
  await g.act('pcSkip').click(); await g.act('skipIntro').click(); await g.act('beginGame').click();
  check('No AI: shows "Live AI isn’t available"', await g.page.getByText('Live AI isn’t available').count());
  check('No AI: status says not available', /not available/.test(await g.page.locator('#status').textContent()));
  await g.page.close();

  // 11. The Worker path (GitHub Pages): success, then the daily cap
  g = await newGame(browser, { noAI: true });
  let cap = false;
  await g.page.route('https://worker.test/**', async (route) => {
    const body = JSON.parse(route.request().postData());
    if (cap) return route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ error: 'daily_cap', message: 'The shared AI budget for today is used up.' }) });
    const hit = ROUTES.find(([re]) => re.test(body.prompt));
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ text: hit ? JSON.stringify(hit[1]) : '', truncated: false }) });
  });
  await g.page.goto(FILE); await g.page.evaluate(() => { LG.WORKER_URL = 'https://worker.test/'; LG._s = null; });
  await g.page.evaluate(() => { location.hash = 'play'; }); await g.page.waitForTimeout(400);
  await g.act('pcSkip').click(); await g.act('skipIntro').click(); await g.act('beginGame').click();
  await g.page.locator('.memo').waitFor({ timeout: 8000 });
  check('Worker path loads a scene', true);
  cap = true; const asks = g.page.locator('[data-ask]:visible'); await asks.nth(0).click(); await asks.nth(1).click(); await g.act('toDecide').click(); await g.act('commit').waitFor();
  await answer(g); await g.act('commit').click(); await g.page.locator('.err').first().waitFor();
  check('Worker daily cap shows its message', /budget for today/.test(await g.page.locator('.err').first().textContent()));
  await g.page.close();

  // 12. Phone width: no sideways scroll on any page or game screen
  g = await newGame(browser, { width: 375 });
  const wide = [];
  const scan = async (label) => { const w = await g.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (w > 1) wide.push(label + ' +' + w + 'px'); };
  for (const h of ['', '#how-it-works', '#skills', '#about']) { await g.page.goto(FILE + h); await g.page.waitForTimeout(250); await scan(h || 'home'); }
  await toDecision(g, 1); await scan('decide'); await answer(g); await g.act('commit').click(); await g.act('next').waitFor(); await scan('debrief');
  check('375px: no sideways scroll', !wide.length, wide.join(', '));
  // 13. Every button has a name
  const unnamed = await g.page.evaluate(() => [...document.querySelectorAll('button,a')].filter(b => b.offsetParent && !(b.textContent.trim() || b.getAttribute('aria-label'))).length);
  check('Every visible button and link has a name', unnamed === 0, unnamed + ' unnamed');
  check('No page or console errors across QA runs', !g.errs.length, g.errs.join(' | '));
  await g.page.close();

  await browser.close();
  results.forEach(r => console.log((r[1] ? 'ok   ' : 'FAIL ') + r[0] + (r[2] ? '  (' + r[2] + ')' : '')));
  const f = results.filter(r => !r[1]).length; console.log('\n' + (results.length - f) + ' of ' + results.length + ' passed'); process.exit(f ? 1 : 0);
})().catch(e => { console.log('QA run stopped: ' + e.message.split('\n')[0]); results.forEach(r => console.log((r[1] ? 'ok   ' : 'FAIL ') + r[0] + (r[2] ? '  (' + r[2] + ')' : ''))); process.exit(1); });
