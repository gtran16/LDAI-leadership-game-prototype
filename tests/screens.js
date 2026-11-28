/* Captures every screen and page (stubbed AI) at a given width, full page. Usage: node tests/screens.js 1280 */
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const { ROUTES } = require('./stub');
const W = +(process.argv[2] || 1280), OUT = path.join(__dirname, 'out', 'screens-' + W); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.exposeFunction('__stubReply', (p) => { for (const [re, v] of ROUTES) if (re.test(p)) return JSON.stringify(v); return ''; });
  await page.addInitScript(() => { window.claude = { use: async () => async (p) => ({ text: await window.__stubReply(p), truncated: false }) }; });
  const act = (a) => page.locator('[data-act="' + a + '"]:visible').first();
  let i = 0; const shot = async (n) => { await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(150); await page.screenshot({ path: path.join(OUT, String(++i).padStart(2, '0') + '-' + n + '.png'), fullPage: true }); };
  const file = 'file://' + path.resolve(__dirname, '..', 'index.html');
  await page.goto(file); await page.waitForTimeout(600); await shot('home');
  await page.goto(file + '#how-it-works'); await shot('how-it-works');
  await page.goto(file + '#skills'); await shot('skills-plan'); await page.locator('[data-gsk=delivery]').click(); await shot('skills-delivery');
  await page.goto(file + '#about'); await shot('about');
  await page.goto(file + '#play'); await page.waitForTimeout(300); await shot('pre');
  await page.fill('[data-pc="pre"]', 'I would fix the customer issue first, so the report waits and my boss presents a shorter version.'); await act('preDone').click();
  await shot('intro-1'); for (let k = 0; k < 5; k++) await act('introNext').click(); await shot('intro-6');
  await act('beginGame').click();
  for (let n = 1; n <= 6; n++) {
    await page.getByRole('heading', { name: 'Decision ' + n + ' of 6' }).waitFor();
    if (n === 1 || n === 5) await shot('d' + n + '-scene');
    const asks = page.locator('[data-ask]:visible'); await asks.nth(0).click(); await asks.nth(1).click();
    if (n === 1) await shot('d1-scene-asked');
    await act('toDecide').click(); await act('commit').waitFor();
    const pick = page.locator('[data-pick]:visible'); if (await pick.count()) await pick.first().click();
    const op = page.locator('[data-opening]:visible'); if (await op.count()) await op.first().click();
    const f = page.locator('[data-f]:visible'); for (let k = 0; k < await f.count(); k++) await f.nth(k).fill('I will ask Remi to lead it, so two bugs wait a week and Jan learns the routing rules.');
    const conf = page.locator('[data-conf]:visible'); if (await conf.count()) await conf.nth(3).click();
    if ([1, 3, 4, 5].includes(n)) await shot('d' + n + '-decide');
    await act('commit').click(); await act('next').waitFor();
    if ([1, 3, 6].includes(n)) await shot('d' + n + '-debrief');
    await act('next').click();
  }
  await shot('checkin-self');
  for (const t of await page.locator('[data-rv]:visible').all()) await t.fill('Asking before assigning.');
  await page.locator('[data-rvcall]:visible').nth(1).click(); await act('runReview').click();
  await page.getByText('In the weeks after the check-in').first().waitFor();
  for (let k = 0; k < 7; k++) { await shot('checkin-step-' + (k + 1)); const nx = page.locator('[data-act="rvNext"]:visible'); if (!(await nx.count())) break; await nx.click(); }
  await act('toPost').click(); await shot('post');
  await page.fill('[data-pc="post"]', 'I would give the fix to two people on Friday and ask my boss to present a shorter report, so nobody works the weekend.'); await act('postDone').click();
  await shot('compare'); await act('rvNext').click(); await shot('record');
  await page.goto(file + '#skills'); await shot('skills-mid-game-back');
  console.log(W + 'px: ' + i + ' screens, errors: ' + (errs.length ? errs.join(' | ') : 'none'));
  await browser.close();
})();
