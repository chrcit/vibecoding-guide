// Checks the reader levels in a real browser against a running dev server.
//
//   node scripts/check-levels.mjs http://localhost:4321/
//   node scripts/check-levels.mjs http://localhost:4321/ --shots ../shots   (also saves screenshots)
//
// The URL is the site root; the checks run on /dev/levels/.
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const root = args.find((a) => /^https?:/.test(a));
const shotsAt = args.indexOf('--shots');
const shots = shotsAt > -1 ? path.resolve(args[shotsAt + 1] || 'level-shots') : null;
if (!root) {
  console.error('Usage: node scripts/check-levels.mjs <dev server URL> [--shots <dir>]');
  process.exit(2);
}
const page = new URL('dev/levels/', root.endsWith('/') ? root : root + '/').href;

const browser = await chromium.launch();
let failed = 0;
const check = (ok, name, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${!ok && detail ? ` (${detail})` : ''}`);
  if (!ok) failed++;
};
const fresh = (options = {}) => browser.newContext({ viewport: { width: 1280, height: 900 }, ...options });
const level = (p) => p.evaluate(() => document.documentElement.dataset.level);
const saved = (p) => p.evaluate(() => localStorage.getItem('acg-level'));
const tokenBlock = '#deeper-what-a-token-is';
const bodyVisible = (p, sel) => p.locator(`${sel} > .deeper-body`).isVisible();

try {
  // 1. Default is plain, deeper blocks collapsed with a button.
  {
    const ctx = await fresh();
    const p = await ctx.newPage();
    await p.goto(page);
    check((await level(p)) === 'plain', 'first visit defaults to plain', await level(p));
    check(!(await bodyVisible(p, tokenBlock)), 'technical block is collapsed at plain');
    const toggle = p.locator(`${tokenBlock} > .deeper-toggle`);
    check(await toggle.isVisible(), 'collapsed block shows its button');
    check((await toggle.getAttribute('aria-expanded')) === 'false', 'button reports aria-expanded=false');
    check(await p.locator(`${tokenBlock} > .deeper-extract`).isVisible(), 'collapsed block shows its extract');
    await toggle.click();
    check(await bodyVisible(p, tokenBlock), 'button opens the block');
    check((await toggle.getAttribute('aria-expanded')) === 'true', 'button reports aria-expanded=true');
    check(await p.evaluate(() => document.activeElement?.classList.contains('deeper-toggle')), 'focus stays on the button');
    const inner = '#deeper-why-counts-differ-between-models';
    check(!(await bodyVisible(p, inner)), 'nested engineer block stays collapsed inside an opened block');
    await toggle.click();
    check(!(await bodyVisible(p, tokenBlock)), 'button closes the block again');
    await p.reload();
    check(!(await bodyVisible(p, tokenBlock)), 'opening a block is not saved');
    // Markdown blocks get the same treatment, ordinary quotes do not.
    check(await p.locator('.lv-md .deeper[data-deeper="technical"] > .deeper-toggle').isVisible(), 'markdown [!technical] renders as a deeper block');
    check((await p.locator('.lv-md blockquote').count()) === 2, 'ordinary blockquotes and alerts stay blockquotes');
    await ctx.close();
  }

  // 2. The picker changes and saves the level, fires acg:level, and the change survives a reload.
  {
    const ctx = await fresh();
    const p = await ctx.newPage();
    await p.goto(page);
    await p.evaluate(() => document.addEventListener('acg:level', (e) => ((window).__lastLevel = e.detail)));
    await p.locator('.level-picker-button').click();
    check(await p.locator('#level-panel').isVisible(), 'picker opens');
    await p.locator('.level-option', { hasText: 'Engineer' }).click();
    check((await level(p)) === 'engineer', 'picker sets data-level', await level(p));
    check((await saved(p)) === 'engineer', 'picker saves the level');
    check((await p.evaluate(() => (window).__lastLevel)) === 'engineer', 'acg:level fires with the level');
    const closed = await p.locator('#level-panel').waitFor({ state: 'hidden', timeout: 1000 }).then(() => true, () => false);
    check(closed, 'picker closes after a click');
    check(await bodyVisible(p, tokenBlock), 'technical block is open at engineer');
    await p.reload();
    check((await level(p)) === 'engineer', 'level persists across reloads');
    check((await p.evaluate(() => window.acgLevel.get())) === 'engineer', 'window.acgLevel.get() works');
    // Keyboard path: open, arrow to a level, Escape closes and returns focus.
    await p.locator('.level-picker-button').focus();
    await p.keyboard.press('Enter');
    await p.keyboard.press('ArrowUp');
    check((await level(p)) === 'technical', 'arrow keys change the level', await level(p));
    await p.keyboard.press('Escape');
    check(!(await p.locator('#level-panel').isVisible()), 'Escape closes the picker');
    check(await p.evaluate(() => document.activeElement?.classList.contains('level-picker-button')), 'focus returns to the picker button');
    await ctx.close();
  }

  // 2b. Changing level keeps the reader's place: the heading they were reading stays put.
  {
    const ctx = await fresh();
    const p = await ctx.newPage();
    await p.goto(page + '?level=plain');
    const top = () => p.evaluate(() => document.querySelector('#checking-the-fix').getBoundingClientRect().top);
    await p.evaluate(() => {
      const h = document.querySelector('#checking-the-fix');
      scrollTo({ top: scrollY + h.getBoundingClientRect().top - 120, behavior: 'instant' });
    });
    const before = await top();
    await p.evaluate(() => window.acgLevel.set('engineer'));
    const after = await top();
    check(Math.abs(after - before) <= 2, 'switching up keeps the reader in place', `${before} -> ${after}`);
    await p.evaluate(() => window.acgLevel.set('plain'));
    const back = await top();
    check(Math.abs(back - before) <= 2, 'switching down keeps the reader in place', `${before} -> ${back}`);
    await ctx.close();
  }

  // 3. ?level= overrides for one view and is not saved.
  {
    const ctx = await fresh();
    const p = await ctx.newPage();
    await p.goto(page + '?level=engineer');
    check((await level(p)) === 'engineer', '?level= overrides the level');
    check((await saved(p)) === null, '?level= is not saved');
    check(!(await p.locator('.level-offer').isVisible()), 'no offer on a ?level= link');
    await p.goto(page);
    check((await level(p)) === 'plain', 'next view without ?level= is back to plain');
    await ctx.close();
  }

  // 4. A hash link into a collapsed block opens it, and so does an in-page link.
  {
    const ctx = await fresh();
    const p = await ctx.newPage();
    await p.goto(page + '#deeper-why-counts-differ-between-models');
    await p.waitForTimeout(200);
    check(await bodyVisible(p, '#deeper-why-counts-differ-between-models'), 'hash link opens a nested collapsed block');
    check(await bodyVisible(p, tokenBlock), 'hash link opens the outer block too');
    check(await p.locator('#deeper-why-counts-differ-between-models').isVisible(), 'hash target is visible');
    const inView = await p.evaluate(() => {
      const r = document.querySelector('#deeper-why-counts-differ-between-models').getBoundingClientRect();
      return r.top >= 0 && r.top < innerHeight;
    });
    check(inView, 'hash target is scrolled into view');
    await p.goto(page);
    await p.locator('a[href="#deeper-why-counts-differ-between-models"]').click();
    await p.waitForTimeout(200);
    check(await bodyVisible(p, '#deeper-why-counts-differ-between-models'), 'in-page link opens the block it points into');
    await ctx.close();
  }

  // 5. Without JavaScript every block's text is visible and no button shows.
  {
    const ctx = await fresh({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(page);
    const bodies = p.locator('.deeper-body');
    const n = await bodies.count();
    let shown = 0;
    for (let i = 0; i < n; i++) if (await bodies.nth(i).isVisible()) shown++;
    check(n > 0 && shown === n, 'without JavaScript every block is visible', `${shown}/${n}`);
    check((await p.locator('.deeper-toggle:visible').count()) === 0, 'without JavaScript no block buttons show');
    check((await p.locator('.for-level:visible').count()) === (await p.locator('.for-level').count()), 'without JavaScript every ForLevel shows');
    await ctx.close();
  }

  // 6. No horizontal scroll at 390px, at every level and with the picker open.
  {
    const ctx = await fresh({ viewport: { width: 390, height: 844 } });
    const p = await ctx.newPage();
    for (const l of ['plain', 'technical', 'engineer']) {
      await p.goto(`${page}?level=${l}`);
      const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(over <= 0, `no horizontal scroll at 390px, ${l}`, `${over}px over`);
    }
    await p.locator('.level-picker-button').click();
    const box = await p.locator('#level-panel').boundingBox();
    check(box && box.x >= 0 && box.x + box.width <= 390, 'picker panel fits at 390px', JSON.stringify(box));
    await ctx.close();
  }

  // 7. The offer appears on the first visit only, and Escape dismisses it.
  {
    const ctx = await fresh();
    const p = await ctx.newPage();
    await p.goto(page);
    const offer = p.locator('.level-offer');
    check(await offer.isVisible(), 'offer appears on the first visit');
    await p.keyboard.press('Escape');
    check(!(await offer.isVisible()), 'Escape dismisses the offer');
    await p.reload();
    check(!(await offer.isVisible()), 'offer does not appear again');
    await ctx.close();

    const ctx2 = await fresh();
    const p2 = await ctx2.newPage();
    await p2.goto(page);
    await p2.locator('.level-offer [data-offer-level="technical"]').click();
    check((await level(p2)) === 'technical' && (await saved(p2)) === 'technical', 'choosing in the offer sets and saves the level');
    check(!(await p2.locator('.level-offer').isVisible()), 'choosing in the offer closes it');
    await ctx2.close();
  }

  // Screenshots for review: both widths, both themes, every level.
  if (shots) {
    mkdirSync(shots, { recursive: true });
    for (const width of [390, 1280]) {
      for (const scheme of ['light', 'dark']) {
        const ctx = await fresh({ viewport: { width, height: 900 }, colorScheme: scheme });
        const p = await ctx.newPage();
        for (const l of ['plain', 'technical', 'engineer']) {
          await p.goto(`${page}?level=${l}`);
          await p.evaluate(() => document.fonts.ready);
          await p.screenshot({ path: path.join(shots, `levels-${width}-${scheme}-${l}.png`), fullPage: true });
        }
        await p.goto(page);
        await p.evaluate(() => document.fonts.ready);
        await p.waitForTimeout(300);
        await p.screenshot({ path: path.join(shots, `levels-${width}-${scheme}-offer.png`) });
        await p.keyboard.press('Escape');
        await p.locator('.level-picker-button').click();
        await p.waitForTimeout(250);
        await p.screenshot({ path: path.join(shots, `levels-${width}-${scheme}-picker.png`) });
        await ctx.close();
      }
    }
    console.log(`screenshots in ${shots}`);
  }
} finally {
  await browser.close();
}

console.log(failed ? `${failed} check(s) failed` : 'all level checks passed');
process.exit(failed ? 1 : 0);
