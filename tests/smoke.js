/* Smoke test: plays one full game against canned AI replies.
   Run: npm run smoke   (add HEADED=1 to watch)
   Fails on any page error, console error, unmatched prompt, or a screen that does not appear. */
const { chromium } = require('playwright');
const path = require('path');
const { ROUTES } = require('./stub');

const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const problems = [];
const calls = {};

async function play(width) {
  const browser = await chromium.launch({ headless: !process.env.HEADED });
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.setDefaultTimeout(8000);
  page.on('pageerror', e => problems.push(width + 'px page error: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') problems.push(width + 'px console error: ' + m.text()); });
  await page.exposeFunction('__stubReply', (prompt) => {
    for (const [re, v] of ROUTES) if (re.test(prompt)) { const k = re.source.slice(0, 40); calls[k] = (calls[k] || 0) + 1; return JSON.stringify(v); }
    problems.push(width + 'px unmatched prompt: ' + prompt.slice(0, 80));
    return '';
  });
  /* Replace the artifact's built-in AI. LG.sample() picks this up unchanged. */
  await page.addInitScript(() => {
    window.claude = { use: async () => async (prompt) => ({ text: await window.__stubReply(prompt), truncated: false }) };
  });

  const act = (a) => page.locator('[data-act="' + a + '"]:visible').first();
  const step = async (label, fn) => { try { await fn(); } catch (e) { throw new Error(width + 'px, ' + label + ': ' + e.message.split('\n')[0]); } };
  const closeHelp = async () => { await page.keyboard.press('Escape'); await page.waitForTimeout(100); };
  const ANSWER = 'I will ask Remi to lead the setup, so two bugs wait a week and Remi carries less of the queue.';

  await page.goto(FILE + '#play');
  await step('warm-up', async () => { await act('howDone').click(); });
  await step('quick check before', async () => { await page.fill('[data-pc="pre"]', 'I would fix the customer issue first, so the report waits and my boss presents a shorter version.'); await act('preDone').click(); });
  await step('intro', async () => { await act('skipIntro').click(); await act('beginGame').click(); });

  for (let n = 1; n <= 6; n++) {
    await step('decision ' + n + ' scene', async () => {
      await page.getByRole('heading', { name: 'Decision ' + n + ' of 6' }).waitFor();
      await closeHelp();
      const asks = page.locator('[data-ask]:visible');
      await asks.nth(0).click(); await asks.nth(1).click();
      await act('toDecide').click();
    });
    await step('decision ' + n + ' answer', async () => {
      await act('commit').waitFor();
      await closeHelp();
      const pick = page.locator('[data-pick]:visible');
      if (await pick.count()) await pick.first().click();
      const opening = page.locator('[data-opening]:visible');
      if (await opening.count()) await opening.first().click();
      const fields = page.locator('[data-f]:visible');
      for (let i = 0; i < await fields.count(); i++) await fields.nth(i).fill(ANSWER);
      const conf = page.locator('[data-conf]:visible');
      if (n <= 2 && await conf.count()) throw new Error('confidence asked on a pick-only decision');
      if (n > 2) await conf.nth(3).click();
      await act('commit').click();
    });
    await step('decision ' + n + ' debrief', async () => { await act('next').click({ timeout: 15000 }); });
  }

  await step('quick check after', async () => {
    await page.fill('[data-pc="post"]', 'I would give the customer fix to two people on Friday and ask my boss to present a shorter report, so nobody works the weekend.');
    await act('postDone').click();
  });
  await step('check-in', async () => {
    const t = page.locator('[data-rv]:visible');
    for (let i = 0; i < await t.count(); i++) await t.nth(i).fill('I asked before assigning work.');
    await page.getByText('What was hard?').waitFor();
    await page.locator('[data-rvcall]:visible').nth(1).click();
    await act('runReview').click();
    await page.getByText('In the weeks after the check-in').first().waitFor({ timeout: 15000 });
    const seen = [];
    for (let k = 0; k < 12; k++) { seen.push(await page.locator('#main section.card h2').first().textContent()); const nx = page.locator('[data-act="rvNext"]:visible'); if (!(await nx.count())) break; await nx.click(); }
    const want = ['What happened next', 'Where you stand', 'Noor’s read', 'What others saw', 'What to practice next', 'How complete your answers were', 'Before and after', 'Your record'];
    if (JSON.stringify(seen) !== JSON.stringify(want)) throw new Error('check-in steps: ' + seen.join(' / '));
    await act('playAgain').waitFor();
    if (await page.getByText(/overconfident|underconfident/i).count()) throw new Error('person label shown');
    if (await page.getByText(/trade-off trail|How sure you were/i).count()) throw new Error('removed sections still shown');
  });
  await page.screenshot({ path: path.join(__dirname, 'out', 'end-' + width + '.png'), fullPage: true });
  await browser.close();
}

(async () => {
  require('fs').mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  for (const w of [1280, 375]) {
    try { await play(w); } catch (e) { problems.push(e.message); }
  }
  console.log('AI calls by prompt:', calls);
  if (problems.length) { console.log('FAIL\n- ' + problems.join('\n- ')); process.exit(1); }
  console.log('PASS: full game at 1280px and 375px, no page or console errors.');
})();
