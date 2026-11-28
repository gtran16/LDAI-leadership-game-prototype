/* Dev helper: "office desk" direction, two palettes, as CSS + small DOM overlays. index.html is unchanged. Output: tests/out/office-*.png */
const { chromium } = require('playwright');
const path = require('path');
const { ROUTES } = require('./stub');

/* Full palettes as tokens. P1 = Between the Boxes, expanded, on lavender. P2 = the current game colors. */
const P1 = `--desk:#E4D8EE;--desk-2:#D8C7E8;--paper:#FBF8F2;--paper-2:#F8F2DF;--ink:#1E1328;--ink-2:#55505C;--brand:#5E2E8F;--brand-2:#9C59D1;--tint:#EAE1F0;--bar:#22132F;--on-bar:#EADFF5;--mark:#FCF434;--pin:#9C59D1;--ok:#1F7A4D;--board:#FFFFFF;--clip:#22132F;--btn:#1E1328;--btn-text:#FBF8F2;--sel:#EAE1F0;--rule:rgba(30,19,40,.2);--head:'Fraunces',Georgia,serif;--body:'Instrument Sans',system-ui,sans-serif;--mono:'Courier Prime',ui-monospace,monospace;`;
const P2 = `--desk:#EFE3C8;--desk-2:#E3D3AE;--paper:#FFFDF6;--paper-2:#FFF4D6;--ink:#1E1B3A;--ink-2:#5A5675;--brand:#5B3DF5;--brand-2:#FFC93C;--tint:#F1ECFF;--bar:#1E1B3A;--on-bar:#CFCBF5;--mark:#FFC93C;--pin:#E0533D;--ok:#0E7A4D;--board:#FFFFFF;--clip:#1E1B3A;--btn:#5B3DF5;--btn-text:#FFFFFF;--sel:#FFE9A8;--rule:rgba(30,27,58,.2);--head:'Nunito',system-ui,sans-serif;--body:'Nunito',system-ui,sans-serif;--mono:'Courier Prime',ui-monospace,monospace;`;

const OFFICE = (tokens) => `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Instrument+Sans:wght@400;500;600&family=Courier+Prime:wght@400;700&family=Special+Elite&family=Nunito:wght@500;700;800;900&display=swap');
:root{${tokens}}
body,.app-game{background:var(--desk) !important;color:var(--ink) !important;font-family:var(--body) !important}
body{background-image:radial-gradient(rgba(0,0,0,.035) 1px,transparent 1px) !important;background-size:6px 6px !important}
.app-game{background:transparent !important}
.lgbar{background:var(--bar) !important}.lgnav a{color:var(--on-bar) !important}.lgnav a[aria-current="page"]{background:var(--mark) !important;color:var(--ink) !important}
.lgbrand{font-family:var(--head) !important}.lgmark{background:var(--brand-2) !important}
h1,h2,.app-game h2,.app-game h1{font-family:var(--head) !important;color:var(--ink) !important}
.app-game .lab,.app-game .eyebrow{font-family:var(--mono) !important;color:var(--brand) !important;letter-spacing:.04em}
/* Status board: the meters as a whiteboard with marker labels */
.app-game .meterwrap{background:var(--board) !important;border:0 !important;border-bottom:6px solid var(--desk-2) !important;box-shadow:0 2px 0 rgba(0,0,0,.08);position:relative}
.app-game .meterwrap::before{content:'STATUS BOARD';position:absolute;left:24px;top:-1px;font:700 11px var(--mono);color:var(--ink-2);letter-spacing:.12em}
.app-game .meterwrap > div{padding-top:10px}
.app-game .meterwrap > div > div:first-child{font-family:'Special Elite',var(--mono) !important;font-weight:400 !important}
.app-game .steps span{border-radius:999px !important;border-width:1px !important;height:9px !important}
/* Left: pinned org board */
.app-game .side#left .panel{background:var(--paper) !important;border:0 !important;border-radius:2px !important;box-shadow:0 3px 8px rgba(0,0,0,.12) !important;position:relative;transform:rotate(-.6deg)}
.app-game .side#left .panel::before{content:'';position:absolute;top:-8px;left:50%;width:14px;height:14px;border-radius:50%;background:var(--pin);box-shadow:0 2px 2px rgba(0,0,0,.3)}
.app-game .tabb{border-radius:6px 6px 0 0 !important;border:1px solid var(--rule) !important;border-bottom:0 !important;background:var(--desk-2) !important;font-family:var(--mono)}
.app-game .tabb[aria-selected="true"]{background:var(--paper) !important}
/* Center: the scene as a memo, choices as index cards */
.app-game .memo{background:var(--paper);padding:26px 30px 24px;border-radius:2px;box-shadow:0 6px 18px rgba(0,0,0,.12);display:flex;flex-direction:column;gap:12px;position:relative}
.app-game .memo .mhd{display:grid;grid-template-columns:70px 1fr;gap:2px 10px;font:15px var(--mono);color:var(--ink-2);padding-bottom:12px;border-bottom:2px solid var(--ink)}
.app-game .memo .mhd b{color:var(--ink)}
.app-game .memo .mtitle{font:700 13px var(--mono);letter-spacing:.2em;color:var(--brand)}
.app-game .card{background:var(--paper) !important;border:0 !important;border-radius:2px !important;box-shadow:0 4px 14px rgba(0,0,0,.1) !important}
.app-game .opt{background:var(--paper) !important;border:1px solid var(--rule) !important;border-radius:2px !important;background-image:linear-gradient(transparent 27px,rgba(0,0,0,.04) 28px) !important;background-size:100% 28px !important;box-shadow:0 2px 0 var(--rule)}
.app-game .opt.on{background-color:var(--sel) !important;outline:2px solid var(--brand);outline-offset:-2px}
.app-game .letter,.app-game .av{border-radius:2px !important}
.app-game .answer{border:0 !important;border-left:4px solid var(--brand) !important;border-radius:0 !important;background:var(--tint) !important;font-style:italic}
.app-game .tradebox{background:var(--paper-2) !important;border:0 !important;border-radius:0 !important;font-family:var(--mono);font-size:14px !important;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.app-game .btn{background:var(--btn) !important;color:var(--btn-text) !important;border:0 !important;border-radius:6px !important;box-shadow:0 3px 0 rgba(0,0,0,.25) !important}
/* Right: the Skill guide on a clipboard */
.app-game .side#right .panel{background:var(--paper) !important;border:0 !important;border-radius:4px !important;border-top:28px solid var(--clip) !important;box-shadow:0 6px 16px rgba(0,0,0,.14) !important;position:relative}
.app-game .side#right .panel::before{content:'';position:absolute;top:-38px;left:50%;transform:translateX(-50%);width:70px;height:22px;border-radius:6px 6px 2px 2px;background:#B9B4C4;box-shadow:inset 0 -3px 0 rgba(0,0,0,.2)}
.app-game .pill2{border-radius:6px !important}
.app-game .pill2[aria-selected="true"]{background:var(--mark) !important}
.app-game .advice{background:var(--paper-2) !important;border:0 !important;border-radius:0 !important;transform:rotate(.8deg);box-shadow:0 2px 6px rgba(0,0,0,.15)}
.app-game .hex{background:var(--tint) !important;border-radius:0 !important}`;

/* Mock-only DOM: wrap the scene paragraphs in a memo with a header. */
const memoize = () => {
  const main = document.getElementById('main'); if (!main) return;
  const ps = [...main.querySelectorAll(':scope > p.para')]; if (!ps.length) return;
  const m = document.createElement('div'); m.className = 'memo';
  m.innerHTML = '<div class="mtitle">MEMO</div><div class="mhd"><span>TO</span><b>Cleo, Support manager</b><span>FROM</span><span>Noor, Director of Customer Experience</span><span>RE</span><b>Northfield Health support</b></div>';
  ps[0].before(m); ps.forEach(p => m.appendChild(p));
};

(async () => {
  const browser = await chromium.launch();
  for (const [name, tokens] of [['P1-btb-lavender', P1], ['P2-original-colors', P2]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.exposeFunction('__stubReply', (p) => { for (const [re, v] of ROUTES) if (re.test(p)) return JSON.stringify(v); return ''; });
    await page.addInitScript(() => { window.claude = { use: async () => async (p) => ({ text: await window.__stubReply(p), truncated: false }) }; });
    const act = (a) => page.locator('[data-act="' + a + '"]:visible').first();
    const file = 'file://' + path.resolve(__dirname, '..', 'index.html');
    const style = async () => { await page.addStyleTag({ content: OFFICE(tokens) }); await page.waitForTimeout(800); };
    await page.goto(file + '#play'); await style();
    await act('pcSkip').click(); await act('skipIntro').click(); await act('beginGame').click();
    const asks = page.locator('[data-ask]:visible'); await asks.nth(0).click(); await asks.nth(1).click();
    await page.evaluate(memoize); await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(__dirname, 'out', 'office-' + name + '-scene.png') });
    await act('toDecide').click(); await act('commit').waitFor(); await page.locator('[data-pick]').first().click();
    await page.screenshot({ path: path.join(__dirname, 'out', 'office-' + name + '-decide.png') });
    await page.close();
  }
  await browser.close();
})();
