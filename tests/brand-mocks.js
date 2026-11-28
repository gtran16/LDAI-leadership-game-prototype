/* Dev helper: two branding directions as CSS overlays, screenshotted on the same screens. No change to index.html. Output: tests/out/brand-*.png */
const { chromium } = require('playwright');
const path = require('path');
const { ROUTES } = require('./stub');

const A = `/* A. Casebook: a manager's field notebook. Cream paper, navy ink, rust and teal. Typewriter labels, serif headings. */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=IBM+Plex+Mono:wght@500;600&family=Nunito:wght@500;700;800&display=swap');
body,.app-game,.app-game .meterwrap{background:#F3EDE0 !important;background-image:linear-gradient(#E7DFCE 1px,transparent 1px) !important;background-size:100% 28px !important;color:#1B2A3A !important}
.lgbar{background:#1B2A3A !important;border-bottom:4px solid #C2562B}
.lgmark{background:#C2562B !important;border-color:#F3EDE0 !important;border-radius:3px !important}
.lgnav a[aria-current="page"]{background:#F3EDE0 !important;color:#1B2A3A !important;border-radius:4px !important}
h1,h2,.h1,.app-game h2{font-family:Fraunces,Georgia,serif !important;letter-spacing:-0.01em}
.eyebrow,.lab,.app-game .lab,.app-game .eyebrow,.tag,.app-game .tag,.rolechip{font-family:'IBM Plex Mono',monospace !important;letter-spacing:.04em !important}
.card,.app-game .card,.app-game .panel,.app-game .story,.pg .card{background:#FFFCF5 !important;border:1.5px solid #1B2A3A !important;border-radius:4px !important;box-shadow:3px 3px 0 #C9BFA8 !important}
.app-game .opt{border-radius:4px !important;border:1.5px solid #1B2A3A !important;background:#FFFCF5 !important}
.app-game .opt.on{background:#FBE3D3 !important;border-color:#C2562B !important;box-shadow:inset 4px 0 0 #C2562B}
.app-game .letter{border-radius:3px !important;background:#1B2A3A !important;color:#F3EDE0 !important;font-family:'IBM Plex Mono',monospace}
.btn,.app-game .btn,.pg .btn{background:#C2562B !important;border-radius:4px !important;box-shadow:3px 3px 0 #1B2A3A !important;font-family:'IBM Plex Mono',monospace !important;letter-spacing:.02em}
.app-game .pill2,.app-game .tabb,.pg .sktab{border-radius:4px !important}
.app-game .tradebox{border-radius:2px !important;background:#FFF8EA !important;border:1.5px dashed #8A7E66 !important;font-family:'IBM Plex Mono',monospace;font-size:13px !important}
.app-game .ai{border-radius:4px !important;background:#FFFCF5 !important;border:1.5px dashed #0E7C7B !important}
.app-game .para{font-size:18px}`;

const B = `/* B. Night shift: a text-adventure console. Dark slate, warm paper text, amber prompts, mint for the player. */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@500;700&family=Nunito:wght@500;700;800&display=swap');
body,.app-game,.app-game .meterwrap{background:#12151D !important;color:#ECE7DC !important}
.lgbar{background:#0B0D12 !important;border-bottom:1px solid #2A3142}
.lgmark{background:#F5B83D !important;border-color:#12151D !important}
.lgnav a{color:#9AA3B5 !important}.lgnav a[aria-current="page"]{background:#F5B83D !important;color:#12151D !important}
.lgtools .status{background:#1E2330 !important;color:#ECE7DC !important;border-color:#3A4256 !important}
h1,h2,.h1,.app-game h2{font-family:'Space Grotesk',sans-serif !important;color:#FFF6E5 !important}
.eyebrow,.lab,.app-game .lab,.app-game .eyebrow,.muted,.app-game .muted{color:#9AA3B5 !important;font-family:'JetBrains Mono',monospace !important}
.card,.app-game .card,.app-game .panel,.app-game .story,.pg .card,.pg .sksec{background:#1B202C !important;border:1px solid #333B4E !important;border-radius:10px !important;box-shadow:none !important;color:#ECE7DC !important}
.app-game .opt{background:#151924 !important;color:#ECE7DC !important;border:1px solid #333B4E !important;border-radius:8px !important;font-family:'JetBrains Mono',monospace;font-size:15px !important;font-weight:500 !important}
.app-game .opt::before{content:'>';color:#F5B83D;font-weight:700;margin-right:-4px}
.app-game .opt.on{border-color:#5EE0B5 !important;box-shadow:0 0 0 2px #5EE0B5 inset}
.app-game .letter{background:#12151D !important;color:#F5B83D !important;border-color:#F5B83D !important}
.app-game .tradebox{background:#12151D !important;color:#B8C0D0 !important;border:1px dashed #3A4256 !important}
.btn,.app-game .btn,.pg .btn{background:#F5B83D !important;color:#12151D !important;border:0 !important;box-shadow:0 0 0 1px #F5B83D,0 6px 18px rgba(245,184,61,.25) !important;font-family:'JetBrains Mono',monospace !important}
.app-game .pill2,.app-game .tabb{background:#1B202C !important;color:#ECE7DC !important;border-color:#3A4256 !important}
.app-game .pill2[aria-selected="true"],.app-game .tabb[aria-selected="true"]{background:#F5B83D !important;color:#12151D !important}
.app-game .ta,.app-game .field{background:#0F121A !important;color:#ECE7DC !important;border-color:#3A4256 !important;font-family:'JetBrains Mono',monospace}
.app-game .steps span{border-color:#12151D !important}
.app-game .ai{background:#161A24 !important;border:1px dashed #8B7CF6 !important}
.app-game .advice{background:#13261F !important;border-color:#5EE0B5 !important;color:#D9F7EC}
.app-game .para{color:#ECE7DC}`;

const C = `/* C. Between the Boxes: cream paper grain, ink and deep violet, Fraunces display, Courier Prime labels, typewriter strips (one yellow strip per page). */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,500..800,0..100,0..1&family=Instrument+Sans:wght@400;500;600&family=Courier+Prime:wght@400;700&family=Special+Elite&display=swap');
body,.app-game,.app-game .meterwrap{background-color:#F3EEE4 !important;color:#1E1328 !important;font-family:'Instrument Sans',system-ui,sans-serif !important}
body{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 .07'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E") !important}
.app-game,.app-game .meterwrap{background-color:transparent !important}
.lgbar{background:#22132F !important}
.lgbrand{font-family:Fraunces,Georgia,serif !important;font-variation-settings:'SOFT' 100,'WONK' 1}
.lgmark{background:#9C59D1 !important;border-color:#EADFF5 !important;border-radius:4px !important}
.lgnav a{color:#D8CCE6 !important;font-family:'Instrument Sans',sans-serif !important}.lgnav a[aria-current="page"]{background:#F3EEE4 !important;color:#1E1328 !important}
h1,h2,.h1,.app-game h2,.app-game h1{font-family:Fraunces,Georgia,serif !important;font-variation-settings:'SOFT' 100,'WONK' 1;color:#1E1328 !important;letter-spacing:-0.015em}
.eyebrow,.lab,.app-game .lab,.app-game .eyebrow,.app-game .tag,.rolechip{font-family:'Courier Prime',ui-monospace,monospace !important;color:#5E2E8F !important;letter-spacing:.03em !important}
.app-game .main > div:first-child .eyebrow,.pg .col > div .eyebrow:first-child{display:inline-block;font-family:'Special Elite','Courier Prime',monospace !important;background:#FCF434;color:#1E1328 !important;padding:.1em .4em;transform:rotate(-2deg);box-shadow:1px 2px 0 rgba(30,19,40,.16);text-transform:none;letter-spacing:0 !important;font-size:15px}
.card,.app-game .card,.app-game .panel,.app-game .story,.pg .card,.pg .sksec{background:#FBF8F2 !important;border:1px solid rgba(30,19,40,.22) !important;border-radius:12px !important;box-shadow:0 1px 0 rgba(30,19,40,.08) !important}
.app-game .opt{background:#FBF8F2 !important;border:1px solid rgba(30,19,40,.3) !important;border-radius:10px !important;font-weight:600 !important}
.app-game .opt.on{background:#EAE1F0 !important;border-color:#5E2E8F !important;box-shadow:inset 5px 0 0 #5E2E8F}
.app-game .letter{background:#F8F2DF !important;border:0 !important;border-radius:2px !important;font-family:'Special Elite',monospace;transform:rotate(-3deg);box-shadow:1px 2px 0 rgba(30,19,40,.16)}
.app-game .tradebox{background:#F8F2DF !important;border:0 !important;border-radius:2px !important;font-family:'Courier Prime',monospace;font-size:14px !important;box-shadow:1px 2px 0 rgba(30,19,40,.12)}
.btn,.app-game .btn,.pg .btn{background:#1E1328 !important;color:#FBF8F2 !important;border:1px solid #1E1328 !important;border-radius:999px !important;box-shadow:none !important;font-weight:600 !important}
.app-game .pill2,.app-game .tabb,.pg .sktab{border-radius:999px !important;border:1px solid #1E1328 !important;box-shadow:none !important}
.app-game .pill2[aria-selected="true"],.app-game .tabb[aria-selected="true"],.app-game .pill2[aria-pressed="true"]{background:#5E2E8F !important;color:#FBF8F2 !important}
.app-game .ai{background:#EAE1F0 !important;border:0 !important;border-radius:12px !important}
.app-game .advice{background:#F8F2DF !important;border:1px dashed #5E2E8F !important}
.app-game .hex{background:#F8F2DF !important}
.app-game .para{font-size:18px;line-height:1.62}
.app-game .steps span{border-color:#1E1328 !important;border-width:1px !important}`;

(async () => {
  const browser = await chromium.launch();
  for (const [name, css] of [['A-casebook', A], ['B-nightshift', B], ['C-btb', C]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
    await page.exposeFunction('__stubReply', (p) => { for (const [re, v] of ROUTES) if (re.test(p)) return JSON.stringify(v); return ''; });
    await page.addInitScript(() => { window.claude = { use: async () => async (p) => ({ text: await window.__stubReply(p), truncated: false }) }; });
    const act = (a) => page.locator('[data-act="' + a + '"]:visible').first();
    const file = 'file://' + path.resolve(__dirname, '..', 'index.html');
    const style = async () => { await page.addStyleTag({ content: css }); await page.waitForTimeout(700); };
    await page.goto(file); await style(); await page.screenshot({ path: path.join(__dirname, 'out', 'brand-' + name + '-home.png') });
    await page.goto(file + '#play'); await style();
    await act('pcSkip').click(); await act('skipIntro').click(); await act('beginGame').click();
    const asks = page.locator('[data-ask]:visible'); await asks.nth(0).click(); await asks.nth(1).click();
    await page.screenshot({ path: path.join(__dirname, 'out', 'brand-' + name + '-scene.png') });
    await act('toDecide').click(); await act('commit').waitFor(); await page.locator('[data-pick]').first().click();
    await page.screenshot({ path: path.join(__dirname, 'out', 'brand-' + name + '-decide.png') });
    await page.close();
  }
  await browser.close();
})();
