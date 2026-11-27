/* Dev helper: load the game with the stub and print what is on screen. Not part of the smoke test. */
const { chromium } = require('playwright');
const path = require('path');
const { ROUTES } = require('./stub');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await page.exposeFunction('__stubReply', (prompt) => {
    for (const [re, v] of ROUTES) if (re.test(prompt)) return JSON.stringify(v);
    return '';
  });
  await page.addInitScript(() => {
    window.claude = { use: async () => async (prompt) => ({ text: await window.__stubReply(prompt), truncated: false }) };
  });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.waitForTimeout(800);
  const dump = async () => console.log(JSON.stringify(await page.evaluate(() => ({
    acts: [...document.querySelectorAll('[data-act]')].filter(e => e.offsetParent).map(e => e.dataset.act + ':' + (e.textContent || '').trim().slice(0, 40)),
    inputs: [...document.querySelectorAll('input,textarea,select')].filter(e => e.offsetParent).map(e => e.tagName + '#' + e.id + '.' + e.className + '[' + (e.type || '') + '] ' + (e.name || '')),
    buttons: [...document.querySelectorAll('button')].filter(e => e.offsetParent && !e.dataset.act).map(e => (e.id || '') + ':' + e.textContent.trim().slice(0, 40)),
    h: [...document.querySelectorAll('h1,h2,h3')].filter(e => e.offsetParent).map(e => e.textContent.trim().slice(0, 60))
  })), null, 1));
  global.page = page; global.dump = dump; global.c = async (a) => { await page.locator('[data-act="' + a + '"]:visible').first().click(); };
  const steps = process.argv.slice(2);
  await dump();
  for (const s of steps) {
    console.log('>>', s);
    await eval('(async () => {' + s + '})()');
    await page.waitForTimeout(400);
    await dump();
  }
  await browser.close();
})();
