// End-to-end check of the dev-only comment tool against a running dev server.
//
//   node integrations/comments/check.mjs http://localhost:4321/ [--page guide/guides/ways-of-working/] [--shots <dir>] [--dark]
//
// The URL is the dev server root including any base path. For each of 390px and 1280px it
// selects text that spans several elements, saves a comment, checks the JSON file on disk,
// reloads, checks the highlight and the panel entry, edits and resolves the comment, and
// deletes it again. With --shots it saves screenshots of each step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const root = (args.find((a) => /^https?:/.test(a)) || 'http://localhost:4321/').replace(/\/?$/, '/');
const pagePath = opt('--page', 'guide/guides/ways-of-working/');
const shots = opt('--shots', null);
const dark = args.includes('--dark');
const commentsDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../comments');
const HOST = '#acg-comments-dev-only';

let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${msg}`);
  if (!cond) failures++;
};

function findFile(id) {
  if (!fs.existsSync(commentsDir)) return null;
  for (const d of fs.readdirSync(commentsDir)) {
    const dir = path.join(commentsDir, d);
    if (!fs.statSync(dir).isDirectory()) continue;
    const f = fs.readdirSync(dir).find((n) => n.endsWith(`-${id}.json`));
    if (f) return path.join(dir, f);
  }
  return null;
}

const browser = await chromium.launch();
try {
  for (const width of [390, 1280]) {
    console.log(`\n# ${width}px`);
    const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, colorScheme: dark ? 'dark' : 'light' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const shot = async (name) => shots && page.screenshot({ path: path.join(shots, `${width}-${dark ? 'dark' : 'light'}-${name}.png`) });
    if (shots) fs.mkdirSync(shots, { recursive: true });
    let id = null;

    try {
      await page.goto(root + pagePath, { waitUntil: 'networkidle' });
      await page.waitForSelector(HOST, { state: 'attached' });

      // Select from the middle of the first long paragraph into the next block, so the
      // selection crosses element boundaries.
      const expected = await page.evaluate(() => {
        const ps = [...document.querySelectorAll('article p, main p')].filter((p) => p.textContent.trim().length > 80);
        const a = ps[0], b = ps[1];
        const textNode = (el, last) => {
          const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let n, found = null;
          while ((n = w.nextNode())) if (n.data.trim()) { found = n; if (!last) break; }
          return found;
        };
        const start = textNode(a, false), end = textNode(b, false);
        const r = document.createRange();
        r.setStart(start, Math.min(10, start.data.length - 1));
        r.setEnd(end, Math.min(12, end.data.length));
        a.scrollIntoView({ block: 'center' });
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        return { exact: r.toString().replace(/\s+/g, ' ').trim(), multi: a !== b };
      });
      ok(expected.multi && expected.exact.length > 0, 'selected text across two paragraphs');

      const fab = page.locator(`${HOST} .fab`);
      await fab.waitFor({ state: 'visible' });
      ok(true, 'Comment button appears by the selection');
      await shot('1-button');

      const text = `Check comment ${Date.now()}: tighten this sentence.`;
      if (width < 600) await fab.click();
      else await page.keyboard.press('c');
      const ta = page.locator(`${HOST} #acg-new`);
      await ta.waitFor({ state: 'visible' });
      ok(await ta.evaluate((el) => el.getRootNode().activeElement === el), 'popover opens with the textarea focused');
      await ta.fill(text);
      await shot('2-popover');

      const posted = page.waitForResponse((r) => r.url().includes('__comments') && r.request().method() === 'POST');
      await ta.press('Control+Enter');
      const res = await posted;
      const body = await res.json();
      id = body.comment?.id;
      ok(res.status() === 201 && !!id, `saved with Ctrl+Enter (status ${res.status()})`);

      const file = id && findFile(id);
      ok(!!file, `JSON file exists: ${file ? path.relative(path.resolve(commentsDir, '..'), file) : 'missing'}`);
      const saved = file ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
      ok(saved.quote?.exact === expected.exact, `quote.exact matches the selection ("${(saved.quote?.exact || '').slice(0, 50)}…")`);
      ok(typeof saved.quote?.prefix === 'string' && saved.quote.prefix.length > 0 && saved.quote.prefix.length <= 40, 'quote.prefix is up to 40 characters');
      ok(typeof saved.quote?.suffix === 'string' && saved.quote.suffix.length > 0 && saved.quote.suffix.length <= 40, 'quote.suffix is up to 40 characters');
      ok(saved.page === '/' + pagePath, `page is the path without the base (${saved.page})`);
      ok(saved.comment === text && saved.status === 'open', 'comment text and status are stored');
      ok(saved.viewport?.width === width, 'viewport width is stored');
      ok(!!saved.heading?.text, `nearest heading recorded ("${saved.heading?.text}")`);
      ok(!!saved.sourceFile, `sourceFile recorded (${saved.sourceFile})`);
      ok(typeof saved.theme === 'string', `theme recorded (${saved.theme})`);

      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForFunction(() => CSS.highlights?.get('acg-comment')?.size === 1);
      const hl = await page.evaluate(() => [...CSS.highlights.get('acg-comment')][0].toString().replace(/\s+/g, ' ').trim());
      ok(hl === expected.exact, 'after reload the quote is highlighted in the text');
      ok((await page.locator(`${HOST} .toggle .count`).textContent()) === '1', 'toggle shows one open comment');

      await page.locator(`${HOST} .toggle`).click();
      const item = page.locator(`${HOST} .item[data-id="${id}"]`);
      await item.waitFor({ state: 'visible' });
      ok((await item.locator('.text').textContent()) === text, 'panel lists the comment');
      await shot('3-panel');

      await item.locator('[data-act=edit]').click();
      const editTa = item.locator('textarea');
      await editTa.fill(text + ' Edited.');
      await editTa.press('Control+Enter');
      await page.waitForFunction(([h, i]) => document.querySelector(h).shadowRoot.querySelector(`.item[data-id="${i}"] .text`)?.textContent.endsWith('Edited.'), [HOST, id]);
      ok(JSON.parse(fs.readFileSync(file, 'utf8')).comment.endsWith('Edited.'), 'edit is saved to the file');

      await item.locator('[data-act=jump]').click();
      ok(await page.evaluate(() => CSS.highlights.get('acg-comment-active')?.size === 1), 'Show marks the comment in the text');
      await page.waitForTimeout(500);
      await shot('4-jump');

      if (width < 600) await page.locator(`${HOST} .toggle`).click();
      await page.locator(`${HOST} .item[data-id="${id}"] [data-act=status]`).click();
      await page.waitForFunction(() => CSS.highlights.get('acg-comment')?.size === 0);
      ok(JSON.parse(fs.readFileSync(file, 'utf8')).status === 'resolved', 'resolve sets status "resolved" in the file');
      ok((await page.locator(`${HOST} .toggle .count`).textContent()) === '0', 'resolved comment leaves the open count');

      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      ok(scrollW <= width, `no horizontal scroll (${scrollW}px)`);
      ok(errors.length === 0, `no page errors${errors.length ? ': ' + errors.join('; ') : ''}`);
    } catch (err) {
      ok(false, `unexpected: ${err.message.split('\n')[0]}`);
      await shot('error');
    } finally {
      if (id) {
        await page.evaluate(async ([api, i]) => fetch(`${api}/${i}`, { method: 'DELETE' }), [new URL('/__comments', root).href, id]).catch(() => {});
        const left = findFile(id);
        if (left) fs.rmSync(left);
        ok(!findFile(id), 'cleaned up the test comment');
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}

console.log(`\n${failures ? `${failures} check(s) failed` : 'all checks passed'}`);
process.exit(failures ? 1 : 0);
