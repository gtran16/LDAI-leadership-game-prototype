/* Dev helper: full-page screenshots of the main screens at 1280px, played against the stub. Output: tests/out/s-*.png */
const { chromium } = require('playwright');
const path = require('path');
const { ROUTES } = require('./stub');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  await page.exposeFunction('__stubReply', (p) => { for (const [re, v] of ROUTES) if (re.test(p)) return JSON.stringify(v); return ''; });
  await page.addInitScript(() => { window.claude = { use: async () => async (p) => ({ text: await window.__stubReply(p), truncated: false }) }; });
  const act = (a) => page.locator('[data-act="' + a + '"]:visible').first();
  const shot = (n) => page.screenshot({ path: path.join(__dirname, 'out', 's-' + n + '.png'), fullPage: true });
  const file = 'file://' + path.resolve(__dirname, '..', 'index.html');
  await page.goto(file); await shot('home');
  await page.goto(file + '#play'); await page.waitForTimeout(300); await shot('how');
  await act('howDone').click(); await shot('pre');
  await page.fill('[data-pc="pre"]', 'I would fix the customer issue first, so the report waits and my boss presents a shorter version.');
  await act('preDone').click(); await act('introNext').click(); await act('introNext').click(); await act('introNext').click(); await shot('intro4');
  await act('skipIntro').click(); await act('beginGame').click();
  for (let n = 1; n <= 6; n++) {
    await page.getByRole('heading', { name: 'Decision ' + n + ' of 6' }).waitFor();
    const asks = page.locator('[data-ask]:visible'); await asks.nth(0).click(); await asks.nth(1).click();
    if (n === 1) await shot('d1-scene');
    await act('toDecide').click(); await act('commit').waitFor();
    const pick = page.locator('[data-pick]:visible'); if (await pick.count()) await pick.first().click();
    const op = page.locator('[data-opening]:visible'); if (await op.count()) await op.first().click();
    const f = page.locator('[data-f]:visible'); for (let i = 0; i < await f.count(); i++) await f.nth(i).fill('I will ask Remi to lead it, so two bugs wait a week.');
    const conf = page.locator('[data-conf]:visible'); if (await conf.count()) await conf.nth(3).click();
    if (n === 1 || n === 3 || n === 5) await shot('d' + n + '-decide');
    await act('commit').click(); await act('next').waitFor();
    if (n === 3) await shot('d3-debrief');
    await act('next').click();
  }
  await shot('post');
  await page.fill('[data-pc="post"]', 'I would give the fix to two people on Friday and ask my boss for a shorter report.');
  await act('postDone').click();
  for (const t of await page.locator('[data-rv]:visible').all()) await t.fill('Asking first.');
  await page.locator('[data-rvcall]:visible').nth(1).click(); await act('runReview').click();
  await page.getByText('In the weeks after the check-in').first().waitFor(); await page.waitForTimeout(500); await shot('checkin');
  await page.goto(file + '#guide'); await shot('guide');
  await browser.close();
})();
