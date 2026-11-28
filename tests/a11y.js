/* Accessibility audit (no external tools): plays a full game with canned AI replies and checks each screen.
   Checks: text contrast (WCAG AA), names on every control, labels on fields, one h1 and no skipped heading levels,
   keyboard focus visible on every focusable element, reflow at 320 px and at 200% zoom (640 px), live regions for waits,
   reduced motion. Run: node tests/a11y.js */
const { chromium } = require('playwright');
const path = require('path');
const { ROUTES } = require('./stub');
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const findings = {}; const note = (screen, msg) => { (findings[msg] = findings[msg] || new Set()).add(screen); };

async function audit(page, screen) {
  const r = await page.evaluate(() => {
    const out = [];
    const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(v => { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const alpha = (c) => { const m = c.match(/[\d.]+/g); return m && m.length > 3 ? +m[3] : 1; };
    const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage && s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) return null; if (alpha(s.backgroundColor) > 0.5) return s.backgroundColor; } return 'rgb(255,255,255)'; };
    const vis = (el) => { const s = getComputedStyle(el), b = el.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && b.width > 0 && b.height > 0 && !el.closest('[aria-hidden="true"],.noprint[hidden]'); };
    const seen = new Set();
    for (const el of document.querySelectorAll('body *')) {
      if (!vis(el)) continue;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1); if (!own) continue;
      const s = getComputedStyle(el), bg = bgOf(el); if (!bg) continue;
      const L1 = lum(s.color), L2 = lum(bg); if (L1 == null || L2 == null) continue;
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05), size = parseFloat(s.fontSize), bold = +s.fontWeight >= 700;
      const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
      if (ratio < need) { const k = s.color + ' on ' + bg; if (!seen.has(k)) { seen.add(k); out.push('contrast ' + ratio.toFixed(2) + ':1 (' + k + ', ' + size + 'px) e.g. "' + el.textContent.trim().slice(0, 40) + '"'); } }
    }
    for (const el of document.querySelectorAll('button, a[href], input, textarea, select, [role="button"], [role="tab"], [role="radio"]')) {
      if (!vis(el) && el.type !== 'checkbox') continue;
      const name = (el.getAttribute('aria-label') || el.textContent || el.value || el.title || '').trim();
      const labelled = el.id && document.querySelector('label[for="' + el.id + '"]') || el.closest('label') || el.getAttribute('aria-labelledby') || el.getAttribute('aria-label');
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && !labelled) out.push('field without a label: ' + el.tagName.toLowerCase() + (el.dataset.f ? '[data-f=' + el.dataset.f + ']' : el.dataset.rv ? '[data-rv=' + el.dataset.rv + ']' : el.dataset.pc ? '[data-pc]' : ''));
      else if (!/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && !name) out.push('control without a name: ' + el.outerHTML.slice(0, 70));
    }
    const hs = [...document.querySelectorAll('h1,h2,h3,h4')].filter(vis).map(h => +h.tagName[1]);
    if (hs.filter(x => x === 1).length !== 1) out.push(hs.filter(x => x === 1).length + ' h1 headings');
    for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) { out.push('heading level skips h' + hs[i - 1] + ' to h' + hs[i]); break; }
    return out;
  });
  r.forEach(m => note(screen, m));
}
async function focusCheck(page, screen) {
  const bad = []; let n = 0;
  await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const s = getComputedStyle(e); return { tag: e.tagName, txt: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30), ring: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2) || (s.boxShadow && s.boxShadow !== 'none') }; });
    if (!f) break; n++; if (!f.ring) bad.push(f.tag.toLowerCase() + ' "' + f.txt + '"');
  }
  if (bad.length) note(screen, 'no visible focus ring on ' + [...new Set(bad)].slice(0, 4).join(', '));
  return n;
}
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.exposeFunction('__stubReply', (p) => { for (const [re, v] of ROUTES) if (re.test(p)) return JSON.stringify(v); return ''; });
  await page.addInitScript(() => { window.claude = { use: async () => async (p) => ({ text: await window.__stubReply(p), truncated: false }) }; });
  const act = (a) => page.locator('[data-act="' + a + '"]:visible').first();
  for (const pg of ['home', 'how-it-works', 'skills', 'about']) { await page.goto(FILE + '#' + pg); await page.waitForTimeout(300); await audit(page, pg); await focusCheck(page, pg); }
  await page.goto(FILE + '#play'); await page.waitForTimeout(300); await audit(page, 'benchmark'); await focusCheck(page, 'benchmark');
  await page.fill('[data-pc="pre"]', 'I would fix the customer issue first, so the report waits and my boss presents a shorter version.'); await act('preDone').click();
  await audit(page, 'intro'); await act('skipIntro').click(); await act('beginGame').click();
  /* waiting states: is there a live region so a screen reader hears "Writing your next scene"? */
  const live = await page.evaluate(() => !!document.querySelector('[aria-live], [role="status"], [role="alert"]'));
  if (!live) note('loading', 'no live region: waits ("Writing your scene…", 10–40 s) are not announced to screen readers');
  for (let n = 1; n <= 6; n++) {
    await page.getByRole('heading', { name: 'Decision ' + n + ' of 6' }).waitFor(); await page.keyboard.press('Escape');
    if (n === 1 || n === 4) { await audit(page, 'scene'); await focusCheck(page, 'scene'); }
    const asks = page.locator('[data-ask]:visible'); await asks.nth(0).click(); await asks.nth(1).click();
    await act('toDecide').click(); await act('commit').waitFor(); await page.keyboard.press('Escape');
    const pick = page.locator('[data-pick]:visible'); if (await pick.count()) await pick.first().click();
    const op = page.locator('[data-opening]:visible'); if (await op.count()) await op.first().click();
    for (const k of ['plan', 'tp', 'tc', 'tw', 'tt', 'open']) { const f = page.locator('[data-f="' + k + '"]:visible'); if (await f.count()) await f.fill('I will ask Remi to lead it, so two bugs wait a week and Jan learns the rules.'); }
    const tk = page.locator('[data-tick]:visible'); for (let i = 0; i < await tk.count(); i++) await tk.nth(i).check();
    if ([1, 3, 4].includes(n)) { await audit(page, 'decide D' + n); await focusCheck(page, 'decide D' + n); }
    await act('commit').click(); await act('next').waitFor();
    if ([1, 4].includes(n)) { await audit(page, 'debrief'); await focusCheck(page, 'debrief'); }
    await act('next').click();
  }
  await audit(page, 'your read');
  for (const t of await page.locator('[data-rv]:visible').all()) await t.fill('Asking first.');
  await page.locator('[data-rvcall]:visible').nth(1).click(); await act('runReview').click();
  await page.getByRole('heading', { name: 'Noor’s read' }).waitFor();
  for (let k = 0; k < 3; k++) { await audit(page, 'check-in card ' + (k + 1)); const nx = page.locator('[data-act="rvNext"]:visible'); if (await nx.count()) await nx.click(); }
  await act('toPost').click(); await audit(page, 'last check');
  await page.fill('[data-pc="post"]', 'I would give the fix to two people on Friday and ask my boss for a shorter report.'); await act('postDone').click();
  await audit(page, 'game over'); await act('openSheet').click(); await audit(page, '1:1 sheet');
  /* reflow: 320 px wide (WCAG 1.4.10) and 640 px (a 1280 screen at 200% zoom) */
  for (const w of [320, 640]) for (const pg of ['home', 'how-it-works', 'skills', 'about', 'play']) {
    const p2 = await browser.newPage({ viewport: { width: w, height: 800 } }); await p2.goto(FILE + '#' + pg); await p2.waitForTimeout(300);
    const over = await p2.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (over > 2) note(pg + ' @' + w + 'px', 'sideways scroll at narrow width (' + over + ' px)'); await p2.close();
  }
  const css = await page.evaluate(() => [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => /prefers-reduced-motion/.test(r.cssText)); } catch (e) { return false; } }));
  if (!css) note('all', 'no prefers-reduced-motion rule (spinner and transitions keep moving)');
  await browser.close();
  const keys = Object.keys(findings);
  keys.forEach(k => console.log('- ' + k + '  [' + [...findings[k]].join(', ') + ']'));
  console.log(keys.length ? keys.length + ' accessibility findings' : 'No accessibility findings');
})();
