/*
 * The page the agent made so the Lantern's owner can watch the pre-launch check: every page of the
 * app, checked three ways (phone in light mode, phone in dark mode, keyboard alone) by twelve
 * helpers, two pages each. Tap a page for its checks, what the helper changed, and before/after.
 *
 * Stages: 'waiting' (all 24 queued), 'running' (about half back, some still checking), 'checked'
 * (all back, 9 fixed, none failed), 'red' (the check in front of main runs again and /door fails:
 * a helper told to "fix contrast" turned the reserved do-not-admit red into orange), 'done' (/door
 * fixed, all pass, six pages marked for the reader to look at themselves).
 *
 * The filter and the open page live at module level, so they survive `set()` and a remount.
 * Everything here is made up.
 */
import './pagecheck.css';
import type { MountApp } from './index';
import { PAGES, CHECKS, CHECK_LABEL, PASS_NOTE, RUN_PROGRESS, DOOR, type Page, type Check, type Fix } from './pagecheck/pages';
import { thumb } from './pagecheck/thumb';

type Stage = 'waiting' | 'running' | 'checked' | 'red' | 'done';
type Mark = 'waiting' | 'checking' | 'pass' | 'fixed' | 'fail';
type Filter = 'all' | 'changed' | 'failed';
const STAGES: Stage[] = ['waiting', 'running', 'checked', 'red', 'done'];

// ---------- state shared by every mount ----------

let filter: Filter = 'all';
let openPath: string | null = null;
/** The mark last painted for each page and check, so a change between stages can be shown. */
const painted = new Map<string, Mark>();

// ---------- helpers ----------

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
const DRAWER = 'cubic-bezier(0.32, 0.72, 0, 1)';
const byPath = new Map(PAGES.map((p) => [p.path, p]));
const helperPages = (h: number) => PAGES.filter((p) => p.helper === h);
const DONE: Mark[] = ['pass', 'fixed', 'fail'];
const isDone = (m: Mark) => DONE.includes(m);

const ICON = {
  logo: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3.5" width="16" height="17" rx="3"/><path d="m8 9 1.6 1.6L12.5 7.7M8 15.2l1.6 1.6 2.9-2.9M14.5 9.4H17M14.5 15.6H17"/></svg>',
  light: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="2.6"/><path d="M8 1.8v1.4M8 12.8v1.4M1.8 8h1.4M12.8 8h1.4M3.6 3.6l1 1M11.4 11.4l1 1M3.6 12.4l1-1M11.4 4.6l1-1"/></svg>',
  dark: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z"/></svg>',
  keys: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="4" width="13" height="8.5" rx="1.6"/><path d="M4.2 6.6h.1M6.7 6.6h.1M9.2 6.6h.1M11.7 6.6h.1M5 9.8h6"/></svg>',
  check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8.4 6.8 11 12 5.4"/></svg>',
  cross: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 5 6 6M11 5l-6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>',
  eye: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.6 8s2.4-4.4 6.4-4.4S14.4 8 14.4 8 12 12.4 8 12.4 1.6 8 1.6 8z"/><circle cx="8" cy="8" r="1.9"/></svg>',
  alert: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4.6v4.2M8 11.2v.2"/></svg>',
  arrow: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M9 4.5 12.5 8 9 11.5"/></svg>',
  chevron: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>',
};

const MARK_WORD: Record<Mark, string> = { waiting: 'Waiting', checking: 'Checking', pass: 'Pass', fixed: 'Fixed', fail: 'Failed' };
const markGlyph = (m: Mark) => (m === 'pass' || m === 'fixed' ? ICON.check : m === 'fail' ? ICON.cross : '');

// ---------- what each stage says about each page ----------

function marksOf(p: Page, s: Stage): Mark[] {
  const final = (c: Check): Mark => (p.fixes?.some((f) => f.check === c) ? 'fixed' : 'pass');
  if (s === 'waiting') return CHECKS.map(() => 'waiting');
  if (s === 'running') {
    const order = helperPages(p.helper).indexOf(p);
    const done = RUN_PROGRESS[p.helper - 1]! - order * 3;
    return CHECKS.map((c, i) => (i < done ? final(c) : i === done && done >= 0 ? 'checking' : 'waiting'));
  }
  if (p.path === DOOR) {
    if (s === 'red') return ['fail', 'fail', 'pass'];
    if (s === 'done') return ['fixed', 'fixed', 'pass'];
  }
  return CHECKS.map(final);
}

/** The fixes shown for a page at a stage: /door gets a second fix before main. */
function fixesOf(p: Page, s: Stage): Fix[] {
  if (p.path === DOOR && s === 'done') {
    return [
      { check: 'light', what: 'Do-not-admit tag red again', kind: 'tag' },
      { check: 'dark', what: 'Do-not-admit red again; the list tags keep their raised contrast', kind: 'tag' },
    ];
  }
  return p.fixes ?? [];
}

function noteOf(p: Page, c: Check, m: Mark, s: Stage): string {
  if (m === 'waiting') return `Waiting for H${p.helper}`;
  if (m === 'checking') return `H${p.helper} is checking it now`;
  if (m === 'fail') return 'Do-not-admit tag shows orange, not red';
  if (m === 'fixed') return fixesOf(p, s).find((f) => f.check === c)?.what ?? '';
  if (p.path === DOOR && s === 'red' && c === 'keys') return PASS_NOTE.keys;
  return PASS_NOTE[c];
}

const isChanged = (ms: Mark[]) => ms.some((m) => m === 'fixed' || m === 'fail');
const isFailed = (ms: Mark[]) => ms.includes('fail');
const isLook = (p: Page, s: Stage) => s === 'done' && !!p.look;

// ---------- the page ----------

export const url = 'localhost:4321/checks';

export const pagecheck: MountApp = (el, initial) => {
  let stage: Stage = normalize(initial);
  let returnFocus: string | null = null;

  const root = document.createElement('div');
  root.className = 'pc';
  el.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);

  function normalize(s: string): Stage {
    return STAGES.includes(s as Stage) ? (s as Stage) : 'checked';
  }

  const all = () => PAGES.map((p) => ({ p, ms: marksOf(p, stage) }));

  // ---------- shell ----------

  function shell() {
    root.innerHTML = `
      <header class="pc-head" data-head></header>
      <div class="pc-scroll" data-scroll>
        <div class="pc-banner" data-banner></div>
        <div class="pc-filters" role="group" aria-label="Show" data-filters></div>
        <div class="pc-legend" aria-hidden="true">
          <span class="pc-legend-marks" data-legend></span>
          <span class="pc-key"><span title="Phone · light">${ICON.light}</span><span title="Phone · dark">${ICON.dark}</span><span title="Keyboard only">${ICON.keys}</span></span>
        </div>
        <div class="pc-list" data-list></div>
      </div>
      <p class="pc-vh" aria-live="polite" data-sr></p>`;
  }

  function paintHead() {
    const rows = all();
    const marks = rows.flatMap((r) => r.ms);
    const checks = marks.filter(isDone).length;
    const pages = rows.filter((r) => r.ms.every(isDone)).length;
    const failed = rows.filter((r) => isFailed(r.ms)).length;
    const pill: Record<Stage, [string, string]> = {
      waiting: ['idle', 'Queued'],
      running: ['run', 'Running'],
      checked: ['ok', 'All checked'],
      red: ['fail', `${failed} failed`],
      done: ['ok', 'Ready for main'],
    };
    const [tone, word] = pill[stage];
    const right: Record<Stage, string> = {
      waiting: '12 helpers ready',
      running: `${checks} of 72 checks`,
      checked: `${rows.filter((r) => isChanged(r.ms)).length} fixed · 0 failed`,
      red: 'Check before main',
      done: 'All 72 checks pass',
    };
    const $h = $('[data-head]');
    if (!$h) return;
    $h.innerHTML = `
      <div class="pc-top">
        <span class="pc-logo">${ICON.logo}</span>
        <span class="pc-name"><b>Pre-launch check</b><span>The Lantern · Fri 28 Nov</span></span>
        <span class="pc-pill" data-tone="${tone}"><i></i>${word}</span>
      </div>
      <p class="pc-meta">24 pages <span>·</span> 3 checks each <span>·</span> 12 helpers</p>
      <div class="pc-strip" role="img" aria-label="${checks} of 72 checks done">
        ${rows.map((r) => `<span class="pc-strip-page"${isFailed(r.ms) ? ' data-fail' : ''}>${r.ms.map((m) => `<i data-m="${m}"></i>`).join('')}</span>`).join('')}
      </div>
      <p class="pc-progress"><b>${pages} of 24</b> checked<span>${right[stage]}</span></p>`;
  }

  function paintBanner() {
    const $b = $('[data-banner]');
    if (!$b) return;
    let html = '';
    if (stage === 'red') {
      html = `<button type="button" class="pc-alert" data-open="${DOOR}">
        <span class="pc-alert-icon">${ICON.alert}</span>
        <span class="pc-alert-text"><b>/door failed the check before main</b><span>Do-not-admit not red · phone light and dark</span></span>
        <span class="pc-alert-go">${ICON.chevron}</span>
      </button>`;
    } else if (stage === 'done') {
      html = `<div class="pc-ready">
        <span class="pc-ready-text"><b>All 24 pages pass</b><span>/door fixed before main. Six pages changed the most: look at them yourself.</span></span>
        ${filter === 'changed' ? '' : `<button type="button" class="pc-ready-go" data-filter="changed">${ICON.eye}<span>Look at 6</span></button>`}
      </div>`;
    }
    $b.innerHTML = html;
    $b.hidden = !html;
  }

  function paintFilters() {
    const rows = all();
    const n: Record<Filter, number> = {
      all: rows.length,
      changed: rows.filter((r) => isChanged(r.ms)).length,
      failed: rows.filter((r) => isFailed(r.ms)).length,
    };
    const label: Record<Filter, string> = { all: 'All', changed: 'Changed', failed: 'Failed' };
    const $f = $('[data-filters]');
    if (!$f) return;
    const present = new Set(rows.flatMap((r) => r.ms));
    const $lg = $('[data-legend]');
    if ($lg) $lg.innerHTML = (['pass', 'fixed', 'fail', 'checking', 'waiting'] as Mark[]).filter((m) => present.has(m))
      .map((m) => `<span><i class="pc-m pc-m--xs" data-m="${m}"></i>${MARK_WORD[m]}</span>`).join('');
    $f.innerHTML = (['all', 'changed', 'failed'] as Filter[]).map((f) =>
      `<button type="button" class="pc-filter" data-filter="${f}" aria-pressed="${f === filter}"${f === 'failed' && n.failed ? ' data-alarm' : ''}>${label[f]}<span>${n[f]}</span></button>`).join('');
  }

  function markHtml(p: Page, c: Check, m: Mark, cls = '') {
    return `<span class="pc-m${cls}" data-m="${m}" data-k="${p.path}|${c}" title="${CHECK_LABEL[c]}: ${MARK_WORD[m]}">${markGlyph(m)}</span>`;
  }

  function rowHtml(p: Page, ms: Mark[]) {
    const fail = isFailed(ms);
    const look = isLook(p, stage);
    const active = ms.includes('checking');
    const sub = fail ? `<span class="pc-why">do-not-admit not red</span>` : `<span class="pc-title">${esc(p.title)}</span>`;
    const said = CHECKS.map((c, i) => `${CHECK_LABEL[c]} ${MARK_WORD[ms[i]!]}`).join(', ');
    return `<li><button type="button" class="pc-row" data-open="${p.path}"${fail ? ' data-fail' : ''}${look ? ' data-look' : ''} aria-label="${esc(`${p.path}, ${p.title}, helper ${p.helper}. ${said}${look ? '. Look at it yourself' : ''}`)}">
      ${thumb(p.layout, { theme: p.theme })}
      <span class="pc-row-main" aria-hidden="true">
        <span class="pc-row-top"><span class="pc-path">${esc(p.path)}</span>${look ? `<span class="pc-look">${ICON.eye}look</span>` : ''}</span>
        <span class="pc-row-sub"><span class="pc-h"${active ? ' data-active' : ''}>H${p.helper}</span>${sub}</span>
      </span>
      <span class="pc-marks" aria-hidden="true">${CHECKS.map((c, i) => markHtml(p, c, ms[i]!)).join('')}</span>
    </button></li>`;
  }

  function paintList(animate: boolean) {
    const $l = $('[data-list]');
    if (!$l) return;
    let rows = all();
    if (filter === 'changed') rows = rows.filter((r) => isChanged(r.ms));
    if (filter === 'failed') rows = rows.filter((r) => isFailed(r.ms));
    if (filter === 'changed' && stage === 'done') rows.sort((a, b) => Number(!!b.p.look) - Number(!!a.p.look));
    if (!rows.length) {
      const [t, s] = filter === 'failed'
        ? stage === 'waiting' || stage === 'running' ? ['Nothing failed so far', 'Finished checks so far passed or were fixed.'] : ['Nothing failed', 'Every check passed, or a helper fixed what it found.']
        : ['Nothing changed yet', 'Pages a helper fixes show up here, with before and after.'];
      $l.innerHTML = `<div class="pc-empty"><b>${t}</b><span>${s}</span></div>`;
    } else {
      const note = filter === 'changed' && stage === 'done'
        ? `<p class="pc-note">${ICON.eye}<span>The six marked <b>look</b> changed the most. Open them on your own phone before launch.</span></p>`
        : '';
      $l.innerHTML = `${note}<ul class="pc-rows">${rows.map((r) => rowHtml(r.p, r.ms)).join('')}</ul>`;
    }
    if (animate && !reduced()) $l.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: EASE });
  }

  /** Marks that changed since they were last painted pop in; a first paint just records them. */
  function settleMarks() {
    const first = painted.size === 0;
    root.querySelectorAll<HTMLElement>('.pc-marks .pc-m[data-k]').forEach((m, i) => {
      const k = m.dataset.k!, now = m.dataset.m as Mark, was = painted.get(k);
      if (!first && was && was !== now && !reduced()) {
        m.animate([{ transform: 'scale(0.6)', opacity: 0.3 }, { transform: 'none', opacity: 1 }], { duration: 240, delay: Math.min(i, 40) * 6, easing: EASE, fill: 'backwards' });
      }
    });
    for (const p of PAGES) marksOf(p, stage).forEach((m, i) => painted.set(`${p.path}|${CHECKS[i]}`, m));
  }

  // ---------- detail sheet ----------

  function doorRow(tag: 'dim' | 'orange' | 'red') {
    return `<div class="pc-dr" data-tag="${tag}">
      <span class="pc-dr-av">RV</span>
      <span class="pc-dr-who"><b>Rico Vance</b><span>Guest list</span></span>
      <span class="pc-dr-tag">Do not admit</span>
    </div>`;
  }

  function changesHtml(p: Page, ms: Mark[]) {
    const fixes = fixesOf(p, stage).filter((f) => ms[CHECKS.indexOf(f.check)] === 'fixed');
    if (!fixes.length) return '';
    let pair: string;
    if (p.path === DOOR) {
      const after = stage === 'done' ? 'red' : 'orange';
      pair = `<div class="pc-ba pc-ba--rows">
        <figure><figcaption>Before</figcaption>${doorRow('dim')}</figure>
        <figure><figcaption>After</figcaption>${doorRow(after)}</figure>
      </div>`;
    } else {
      const f = fixes[0]!;
      const theme = f.check === 'dark' ? 'dark' : p.theme;
      pair = `<div class="pc-ba">
        <figure><figcaption>Before</figcaption>${thumb(p.layout, { theme, fx: f.kind, side: 'before', cls: 'pc-thumb--l' })}</figure>
        <span class="pc-ba-arrow" aria-hidden="true">${ICON.arrow}</span>
        <figure><figcaption>After</figcaption>${thumb(p.layout, { theme, fx: f.kind, side: 'after', cls: 'pc-thumb--l' })}</figure>
      </div>`;
    }
    return `<section class="pc-sec">
      <h3>What changed</h3>
      <ul class="pc-fixes">${fixes.map((f) => `<li><span class="pc-fix-icon">${ICON[f.check]}</span><span>${esc(f.what)}</span></li>`).join('')}</ul>
      ${pair}
    </section>`;
  }

  function sheetBody(p: Page) {
    const ms = marksOf(p, stage);
    const dark = p.theme === 'dark';
    let lead = '';
    if (p.path === DOOR && stage === 'red') {
      lead = `<section class="pc-fail">
        <p class="pc-fail-head"><span class="pc-fail-icon">${ICON.alert}</span><b>Do-not-admit not red</b></p>
        <p class="pc-fail-text">Rico Vance is tagged <b>Do not admit</b> in orange. Red is reserved for it at the door: orange reads as “check with someone”, not “stop”.</p>
        ${doorRow('orange')}
        <p class="pc-swatches"><span><i style="background:#ff8a3d"></i>On the page · orange</span><span><i style="background:#ff4d4d"></i>Reserved · red</span></p>
        <p class="pc-found"><span class="pc-found-tag">found by the check before main</span><span>helper H3’s brief said ‘fix contrast’</span></p>
      </section>`;
    } else if (p.path === DOOR && stage === 'done') {
      lead = `<section class="pc-fixed-again">
        <p class="pc-fail-head"><span class="pc-ok-icon">${ICON.check}</span><b>Fixed before main</b></p>
        <p class="pc-fail-text">Rico Vance’s tag is red again, and the list tags keep the contrast H3 raised.</p>
        ${doorRow('red')}
      </section>`;
    }
    const look = isLook(p, stage)
      ? `<p class="pc-callout">${ICON.eye}<span><b>Look at this one yourself.</b> It changed the most. Open ${esc(p.path)} on your phone and try it before launch.</span></p>`
      : '';
    const checks = `<section class="pc-sec">
      <h3>Checks</h3>
      <ol class="pc-checks">${CHECKS.map((c, i) => {
        const m = ms[i]!;
        return `<li data-m="${m}">
          <span class="pc-check-icon">${ICON[c]}</span>
          <span class="pc-check-text"><b>${CHECK_LABEL[c]}</b><span>${esc(noteOf(p, c, m, stage))}</span></span>
          <span class="pc-chip" data-m="${m}">${m === 'checking' ? '<i class="pc-spin"></i>' : ''}${MARK_WORD[m]}</span>
        </li>`;
      }).join('')}</ol>
    </section>`;
    const screens = `<section class="pc-sec">
      <h3>Screens${dark ? ' <span>dark in both modes</span>' : ''}</h3>
      <div class="pc-screens">
        <figure>${thumb(p.layout, { theme: dark ? 'dark' : 'light', cls: 'pc-thumb--l' })}<figcaption>${ICON.light}Light</figcaption></figure>
        <figure>${thumb(p.layout, { theme: 'dark', cls: 'pc-thumb--l' })}<figcaption>${ICON.dark}Dark</figcaption></figure>
      </div>
    </section>`;
    return lead + look + checks + changesHtml(p, ms) + screens;
  }

  function openSheet(path: string, animate = true) {
    const p = byPath.get(path);
    if (!p) return;
    const existing = $('.pc-sheet');
    const hadFocus = !!existing?.contains(document.activeElement);
    if (existing) existing.remove();
    openPath = path;
    const sheet = document.createElement('div');
    sheet.className = 'pc-sheet';
    sheet.innerHTML = `
      <div class="pc-scrim" data-close></div>
      <section class="pc-panel" role="dialog" aria-modal="true" aria-labelledby="pc-sheet-title"${isFailed(marksOf(p, stage)) ? ' data-fail' : ''}>
        <header class="pc-panel-head">
          ${thumb(p.layout, { theme: p.theme })}
          <span class="pc-panel-who">
            <span class="pc-path">${esc(p.path)}</span>
            <b id="pc-sheet-title">${esc(p.title)}</b>
            <span class="pc-panel-by">Checked by <span class="pc-h">H${p.helper}</span></span>
          </span>
          <button type="button" class="pc-x" data-close aria-label="Close">${ICON.close}</button>
        </header>
        <div class="pc-panel-body">${sheetBody(p)}</div>
      </section>`;
    root.append(sheet);
    if (animate && !reduced()) {
      const wide = root.clientWidth >= 620;
      sheet.querySelector<HTMLElement>('.pc-scrim')!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
      sheet.querySelector<HTMLElement>('.pc-panel')!.animate(
        [{ transform: wide ? 'translateX(100%)' : 'translateY(100%)' }, { transform: 'none' }],
        { duration: 280, easing: DRAWER });
    }
    if (animate || hadFocus) sheet.querySelector<HTMLElement>('.pc-x')?.focus({ preventScroll: true });
  }

  function closeSheet(animate = true) {
    const sheet = $('.pc-sheet');
    openPath = null;
    if (!sheet) return;
    const back = returnFocus;
    returnFocus = null;
    const done = () => {
      sheet.remove();
      if (back) $(`.pc-row[data-open="${back}"]`)?.focus({ preventScroll: true });
    };
    if (!animate || reduced()) return done();
    const wide = root.clientWidth >= 620;
    sheet.style.pointerEvents = 'none';
    sheet.querySelector<HTMLElement>('.pc-scrim')!.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-out', fill: 'forwards' });
    sheet.querySelector<HTMLElement>('.pc-panel')!.animate(
      [{ transform: 'none' }, { transform: wide ? 'translateX(100%)' : 'translateY(100%)' }],
      { duration: 200, easing: 'ease-out', fill: 'forwards' }).finished.then(done, done);
  }

  // ---------- painting a stage ----------

  function paint(animate: boolean) {
    paintHead();
    paintBanner();
    paintFilters();
    paintList(false);
    settleMarks();
    if (openPath) openSheet(openPath, false);
    const sr = $('[data-sr]');
    if (sr && animate) sr.textContent = $('.pc-progress')?.textContent ?? '';
  }

  function setFilter(f: Filter) {
    if (f === filter) return;
    filter = f;
    paintBanner();
    paintFilters();
    paintList(true);
    const s = $('[data-scroll]');
    if (s) s.scrollTop = 0;
  }

  // ---------- events (all on root, gone with it) ----------

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-close]')) return closeSheet();
    const f = t.closest<HTMLElement>('[data-filter]');
    if (f) return setFilter(f.dataset.filter as Filter);
    const o = t.closest<HTMLElement>('[data-open]');
    if (o) { returnFocus = o.classList.contains('pc-row') ? o.dataset.open! : null; openSheet(o.dataset.open!); }
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $('.pc-sheet')) { closeSheet(); e.stopPropagation(); }
  });

  shell();
  paint(false);

  return {
    set(next: string) {
      const s = normalize(next);
      if (s === stage) return;
      stage = s;
      paint(true);
    },
    destroy() {
      root.remove();
    },
  };
};

export const app = pagecheck;
