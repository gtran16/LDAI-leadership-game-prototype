/* Demo screenshots for slides: one game with canned AI text, 1440 px at 2x. Run: node tests/demo.js (writes tests/out/slides/) */
const R = require('path').resolve(__dirname, '..');
const { chromium } = require(R + '/node_modules/playwright');
const path = require('path');
const { ROUTES } = require(R + '/tests/stub');
const OUT = R + '/tests/out/slides'; require('fs').mkdirSync(OUT, { recursive: true });
const ANS = {
  plan: 'I will ask Jan to set up the Northfield group with the saved replies, and Remi reviews it on Wednesday. The two oldest calendar bugs wait until next week.',
  tp: 'Remi’s time for the hardest calendar tickets, and a Northfield launch Noor can count on.',
  tc: 'Two calendar bug fixes slip a week, and Jan has less time for the chat queue.',
  tt: 'This protects Remi’s time for the hardest tickets. It costs two calendar fixes a week of delay, and the clinics waiting on them pay for it, along with Jan, who takes on new work.',
  tw: 'The clinics waiting on those two bugs, and Jan, who takes on new work.',
  open: 'Jan, I would like you to lead the Northfield setup. Remi will check it with you Wednesday, and I am moving two of your tickets so you have the time.'
};
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.exposeFunction('__stubReply', p => { for (const [re, v] of ROUTES) if (re.test(p)) return JSON.stringify(v); return ''; });
  await page.addInitScript(() => { window.claude = { use: async () => async p => ({ text: await window.__stubReply(p), truncated: false }) }; });
  const act = a => page.locator('[data-act="' + a + '"]:visible').first();
  let i = 0;
  const shot = async (n, full) => { await page.waitForTimeout(250); await page.screenshot({ path: path.join(OUT, String(++i).padStart(2, '0') + '-' + n + '.png'), fullPage: !!full }); };
  const top = () => page.evaluate(() => window.scrollTo(0, 0));
  const file = 'file://' + R + '/index.html';
  await page.goto(file); await page.waitForTimeout(600); await shot('home');
  await page.goto(file + '#play'); await page.waitForTimeout(300);
  await page.fill('[data-pc="pre"]', 'I would fix the customer issue first, so the report waits and my boss presents a shorter version.');
  await top(); await shot('benchmark-before');
  await act('preDone').click(); await shot('intro-first-screen');
  await act('beginGame').count() || null;
  for (let k = 0; k < 5; k++) await act('introNext').click();
  await act('beginGame').click();
  for (let n = 1; n <= 6; n++) {
    await page.getByRole('heading', { name: 'Decision ' + n + ' of 6' }).waitFor();
    await page.keyboard.press('Escape');
    if (n === 1) await shot('d1-scene-memo');
    const asks = page.locator('[data-ask]:visible'); await asks.nth(0).click(); await asks.nth(1).click();
    if (n === 1) { await top(); await shot('d1-questions-asked'); }
    await act('toDecide').click(); await act('commit').waitFor(); await page.keyboard.press('Escape');
    const pick = page.locator('[data-pick]:visible'); if (await pick.count()) await pick.first().click();
    const op = page.locator('[data-opening]:visible'); if (await op.count()) await op.first().click();
    if ((await page.locator('#main').innerText()).includes('deliver your choice to Noor')) ANS.open = 'Noor, here is my plan for Northfield: Jan leads the setup and Remi checks it Wednesday. Two calendar bugs move to next week. Can you tell the clinics waiting on them?';
    if (n === 4) { await top(); await shot('d4-decide-before-writing-frames-offered', true); }
    for (const k of ['plan', 'tp', 'tc', 'tw', 'tt', 'open']) { const f = page.locator('[data-f="' + k + '"]:visible'); if (await f.count()) await f.fill(ANS[k]); }
    const tk = page.locator('[data-tick]:visible'); for (let i = 0; i < await tk.count(); i++) if (i !== 2) await tk.nth(i).check();
    if ([1, 3, 4, 6].includes(n)) { await top(); await shot('d' + n + '-decide-' + ({ 1: 'pick-all', 3: 'pick-plan-write-two', 4: 'write-all-checklist', 6: 'write-all-on-your-own' })[n], true); }
    await act('commit').click(); await act('next').waitFor();
    if ([1, 4, 5].includes(n)) { await top(); await shot('d' + n + '-debrief', true); }
    await act('next').click();
  }
  await top(); await shot('checkin-your-read', true);
  for (const t of await page.locator('[data-rv]:visible').all()) await t.fill('I ask before I assign work now, and I say what waits and who pays.');
  await page.locator('[data-rvcall]:visible').nth(1).click(); await act('runReview').click();
  await page.getByRole('heading', { name: 'Noor’s read' }).waitFor();
  for (const t of ['noors-read', 'what-happened-next', 'the-game-is-over']) { await top(); await shot('checkin-' + t, true); const nx = page.locator('[data-act="rvNext"]:visible'); if (await nx.count()) await nx.click(); }
  await act('toPost').click();
  await page.fill('[data-pc="post"]', 'I would give the fix to two people on Friday and ask my boss to present a shorter report, so nobody works the weekend.');
  await top(); await shot('last-check-after-the-story');
  await act('postDone').click(); await top(); await shot('before-and-after', true);
  await act('openSheet').click(); await top(); await shot('one-on-one-sheet', true);
  await page.goto(file + '#how-it-works'); await shot('page-how-the-game-works', true);
  await page.goto(file + '#skills'); await shot('page-skills', true);
  await page.goto(file + '#about'); await shot('page-how-its-made', true);
  console.log(i + ' shots; errors: ' + (errs.join(' | ') || 'none'));
  await b.close();
})();
