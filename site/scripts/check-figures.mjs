// Figure checks. Builds the review page (/dev/figures/) with ACG_DEV_PAGES=1 into .figures/dist,
// serves it, and for every [data-figure] at 390 and 1280 px, light and dark:
//   - saves a screenshot of the first frame and of a state after interaction to .figures/shots/
//   - fails on horizontal overflow, text smaller than 13 px, a control that cannot take focus,
//     console errors, and (with reduced motion) any animation still running after a state change.
//
//   pnpm check-figures            build, then check
//   pnpm check-figures --no-build reuse the last build
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, '.figures');
const DIST = join(OUT, 'dist');
const SHOTS = join(OUT, 'shots');
const MIN_PX = 13;

if (!process.argv.includes('--no-build')) {
  const r = spawnSync('pnpm', ['exec', 'astro', 'build', '--outDir', DIST], {
    cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, ACG_DEV_PAGES: '1', BASE_PATH: '' },
  });
  if (r.status !== 0) { console.error('check-figures: build failed'); process.exit(1); }
}
mkdirSync(SHOTS, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(DIST, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const URL_ = `http://127.0.0.1:${server.address().port}/dev/figures/`;

const browser = await chromium.launch();
const failures = [];
const rows = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

/** Runs in the page: problems with one figure. */
function inspect(fig, min) {
  const out = [];
  const visible = (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0 && r.width > 0 && r.height > 0;
  };
  if (fig.scrollWidth > fig.clientWidth + 1) out.push(`overflows its frame (${fig.scrollWidth} > ${fig.clientWidth})`);
  const walker = document.createTreeWalker(fig, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement;
    if (!el || !node.textContent.trim() || seen.has(el) || !visible(el)) continue;
    seen.add(el);
    let px = parseFloat(getComputedStyle(el).fontSize);
    const svg = el.closest('svg');
    if (svg && svg.viewBox.baseVal && svg.viewBox.baseVal.width) px *= svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
    if (px < min - 0.05) out.push(`text "${node.textContent.trim().slice(0, 30)}" is ${px.toFixed(1)}px`);
  }
  for (const c of fig.querySelectorAll('button, input, select, textarea, a[href], [tabindex]')) {
    if (!visible(c) || c.disabled) continue;
    c.focus();
    if (document.activeElement !== c) out.push(`control "${c.textContent.trim() || c.getAttribute('aria-label') || c.tagName}" cannot take focus`);
    const r = c.getBoundingClientRect();
    if (c.tagName !== 'A' && (r.width < 40 || r.height < 40) && c.type !== 'range') out.push(`control "${c.textContent.trim()}" is smaller than 40px`);
  }
  return out;
}

/** Runs in the page: move each figure to a later state through its own control. */
function interact(fig) {
  const range = fig.querySelector('input[type=range]');
  if (range) {
    range.value = String(Math.round(Number(range.max) * 0.4 * 2) / 2);
    range.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  const next = fig.querySelector('[data-next]') ?? [...fig.querySelectorAll('.fig-control button')].pop();
  for (let i = 0; i < 3; i++) next?.click();
}

const runs = [];
for (const width of [390, 1280]) for (const theme of ['light', 'dark']) runs.push({ width, theme, reduced: false });
runs.push({ width: 1280, theme: 'light', reduced: true });

for (const run of runs) {
  const ctx = await browser.newContext({
    viewport: { width: run.width, height: 900 }, colorScheme: run.theme, reducedMotion: run.reduced ? 'reduce' : 'no-preference', deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(URL_, { waitUntil: 'networkidle' });
  // Keep the sticky header out of element screenshots.
  await page.addStyleTag({ content: 'header{position:static!important}' });
  const tag = `${run.width}-${run.theme}${run.reduced ? '-reduced' : ''}`;
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 0) fail(tag, `page scrolls sideways by ${overflow}px`);
  const figs = await page.$$('[data-figure]');
  if (!figs.length) fail(tag, 'no [data-figure] on the review page');
  for (const fig of figs) {
    const n = await fig.getAttribute('data-figure');
    const where = `Fig. ${n} @ ${tag}`;
    if (!run.reduced) {
      await fig.screenshot({ path: join(SHOTS, `fig-${n}-${tag}.png`), animations: 'disabled' });
      for (const p of await fig.evaluate(inspect, MIN_PX)) fail(where, p);
    }
    await fig.evaluate(interact);
    if (run.reduced) {
      await page.waitForTimeout(60);
      const running = await fig.evaluate((f) => f.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length);
      if (running) fail(where, `${running} animation(s) still running under reduced motion`);
    } else {
      await page.waitForTimeout(1800);
      await fig.screenshot({ path: join(SHOTS, `fig-${n}-${tag}-after.png`) });
    }
    rows.push(where);
  }
  for (const e of errors) fail(tag, `console error: ${e}`);
  await ctx.close();
}

await browser.close();
server.close();
console.log(`check-figures: ${rows.length} figure views checked, screenshots in ${SHOTS}`);
if (failures.length) {
  console.log(failures.map((f) => `  FAIL ${f}`).join('\n'));
  console.log(`check-figures: ${failures.length} problem(s)`);
  process.exit(1);
}
console.log('check-figures: all passed');
