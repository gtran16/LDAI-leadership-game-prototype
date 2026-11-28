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

  await step('check-in', async () => {
    const tx = page.locator('[data-rv]:visible');
    for (let i = 0; i < await tx.count(); i++) await tx.nth(i).fill('I asked before assigning work.');
    await page.getByText('What was hard?').waitFor();
    await page.locator('[data-rvcall]:visible').nth(1).click();
    await act('runReview').click();
    await page.getByText('In the weeks after the check-in').first().waitFor({ timeout: 15000 });
    if (await page.locator('#meters .meterwrap').count()) throw new Error('meters still shown on the check-in');
    const seen = [];
    for (let k = 0; k < 12; k++) { seen.push(await page.locator('#main section.card h2').first().textContent()); const nx = page.locator('[data-act="rvNext"]:visible'); if (!(await nx.count())) break; await nx.click(); }
    const want = ['What happened next', 'Noor’s read', 'Your next steps', 'Check your own read'];
    if (JSON.stringify(seen) !== JSON.stringify(want)) throw new Error('check-in steps: ' + seen.join(' / '));
    if (await page.getByText(/overconfident|underconfident/i).count()) throw new Error('person label shown');
  });
  await step('quick check after', async () => {
    await act('toPost').click();
    await page.fill('[data-pc="post"]', 'I would give the fix to two people on Friday and ask my boss to present a shorter report, so nobody works the weekend.');
    await act('postDone').click();
    await page.getByRole('heading', { name: 'Before and after' }).waitFor();
    if (!(await page.getByRole('heading', { name: 'How complete your answers were' }).count())) throw new Error('completeness missing from Check your own read');
    await act('rvNext').click();
    await act('playAgain').waitFor();
  });
  await step('1:1 sheet', async () => {
    await act('openSheet').click();
    for (const t of ['Three questions for your manager', 'How your manager can support you', 'Reminders for me']) await page.getByRole('heading', { name: t }).waitFor();
    const sheetText = await page.locator('.sheet').innerText();
    for (const nm of ['Remi', 'Jan', 'Ravi', 'Noor', 'Teo', 'Cleo', 'Tidewell', 'Northfield']) if (new RegExp('\\b' + nm + '\\b').test(sheetText)) throw new Error('game detail on the 1:1 sheet: ' + nm);
    if (await page.locator('#meters .meterwrap').count()) throw new Error('meters shown on the sheet');
    await act('copySheet').click(); await page.getByText('Copied').waitFor();
    await act('printSheet').click();
    if (width === 1280) {
      const pdfPages = async (file) => { const buf = await page.pdf({ path: path.join(__dirname, 'out', file), format: 'Letter', printBackground: true, preferCSSPageSize: true }); return (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length; };
      await page.emulateMedia({ media: 'print' }); await page.screenshot({ path: path.join(__dirname, 'out', 'one-on-one-print.png'), fullPage: true });
      const n1 = await pdfPages('one-on-one-sheet.pdf'); if (n1 !== 1) throw new Error('1:1 sheet prints on ' + n1 + ' pages');
      /* worst case: long benchmark answers still fit on one page */
      const long = 'I would talk to my boss first and explain that both the customer fix and the leadership report matter, so I would ask two people to split the fix on Friday while I draft the report outline myself, and we would agree that nobody works the weekend unless the fix is still broken on Saturday morning, in which case I would cover it and tell the team on Monday what it cost us.';
      await page.evaluate((t) => { const G = GAME.__test.G; G.pc.pre.text = t; G.pc.post.text = t; }, long);
      await page.emulateMedia({ media: 'screen' }); await act('closeSheet').click(); await act('openSheet').click(); await page.emulateMedia({ media: 'print' });
      const n2 = await pdfPages('one-on-one-sheet-long.pdf'); if (n2 !== 1) throw new Error('1:1 sheet with long answers prints on ' + n2 + ' pages');
      await page.emulateMedia({ media: 'screen' });
    }
    await act('closeSheet').click(); await act('openSheet').waitFor();
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
