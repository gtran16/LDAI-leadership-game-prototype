/* Dev helper: screenshots of the stage banner, task card and help drawer at 375px and 1280px (Nov 21 clipping item). */
const { chromium } = require('playwright');
const path = require('path');
const { ROUTES } = require('./stub');
(async () => {
  const browser = await chromium.launch();
  for (const w of [375, 1280]) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    await page.exposeFunction('__stubReply', (p) => { for (const [re, v] of ROUTES) if (re.test(p)) return JSON.stringify(v); return ''; });
    await page.addInitScript(() => { window.claude = { use: async () => async (p) => ({ text: await window.__stubReply(p), truncated: false }) }; });
    const act = (a) => page.locator('[data-act="' + a + '"]:visible').first();
    await page.goto('file://' + path.resolve(__dirname, '..', 'index.html') + '#play');
    await act('howDone').click(); await act('pcSkip').click(); await act('skipIntro').click(); await act('beginGame').click();
    await page.locator('[data-ask]:visible').nth(0).click(); await page.locator('[data-ask]:visible').nth(1).click();
    await page.screenshot({ path: path.join(__dirname, 'out', 'scene-' + w + '.png') });
    await act('toDecide').click(); await act('commit').waitFor();
    await page.screenshot({ path: path.join(__dirname, 'out', 'decide-' + w + '.png') });
    await page.locator('[data-pick]:visible').first().click(); await page.locator('[data-opening]:visible').first().click(); await page.locator('[data-conf]:visible').nth(3).click();
    await act('commit').click(); await act('next').click();
    await page.getByRole('heading', { name: 'Decision 2 of 5' }).waitFor(); await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(__dirname, 'out', 'help-' + w + '.png') });
    const over = await page.evaluate(() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return e.offsetParent && r.width > 0 && (r.right > W + 1 || e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX === 'hidden'); }).slice(0, 10).map(e => e.tagName + '.' + e.className + ' ' + e.textContent.trim().slice(0, 40)); });
    console.log(w, 'overflow/clipped:', over);
    await page.close();
  }
  await browser.close();
})();
