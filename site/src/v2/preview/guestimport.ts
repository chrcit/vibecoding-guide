/*
 * The Lantern's back office in lesson 11: one guest list for the birthday night (Fri 28 Nov) made
 * from Kai's spreadsheet, Noor's sheet and the ticket sales. A staff page for a desk or a phone:
 * search the list, filter by source, open a row to see the raw line it came from.
 *
 * Stages: 'none' is the dev server's 404; 'sources' shows the three files before import; 'partial'
 * is the first import, where Noor's importer reads "Lea Brandt +1" as a name and the lead's check
 * flags it; 'fixed' reads every row right and spots four guests on two lists; 'merged' keeps each
 * of them once with both sources (187 people).
 *
 * The search, the filter and the open rows live at module level, so they survive `set()` and a
 * remount. Everything here is made up.
 */
import './guestimport.css';
import type { MountApp } from './index';
import { ENTRIES, SOURCES, SOURCE_IDS, countOf, type Entry, type SourceId } from './guestimport/data';
import { rowsFor, twice, search, nameHtml, type ImportStage, type Row } from './guestimport/rows';

type Stage = 'none' | 'sources' | ImportStage;
type Filter = 'all' | SourceId | 'twice';

const STAGES: Stage[] = ['none', 'sources', 'partial', 'fixed', 'merged'];
const FILTERS: Filter[] = ['all', 'kai', 'noor', 'tickets', 'twice'];

// ---------- the reader's state, shared by every mount ----------

let query = '';
let filter: Filter = 'all';
const open = new Set<string>();
const more = new Set<SourceId>();

// ---------- helpers ----------

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
function enter(el: Element | null, from: Keyframe, ms = 200) {
  if (!el || reduced()) return;
  (el as HTMLElement).animate([from, { transform: 'none', opacity: 1 }], { duration: ms, easing: EASE });
}
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const sum = (rows: Row[]) => rows.reduce((n, r) => n + r.plus, 0);
const andList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

const ICON = {
  lantern: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3.5h6M12 3.5V6M7.5 8.2 9 6h6l1.5 2.2v8.6L15 19H9l-1.5-2.2zM9.5 21h5"/><path class="gi-glow" d="M12 10.2c1.3 1.4 1.9 2.4 1.9 3.4a1.9 1.9 0 0 1-3.8 0c0-1 .6-2 1.9-3.4z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/></svg>',
  clear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>',
  chev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg>',
  check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8.4 6.4 11.5 12.8 4.6"/></svg>',
  alert: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4.6v4.2M8 11.3v.2"/></svg>',
  twice: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6" cy="8" r="3.6"/><circle cx="10" cy="8" r="3.6"/></svg>',
  kai: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="2.5" width="11" height="11" rx="1.5"/><path d="M2.5 6.2h11M2.5 9.8h11M6.4 6.2v7.3"/></svg>',
  noor: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6 7.5h4M6 10h3"/></svg>',
  tickets: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4.5h11v2a1.5 1.5 0 0 0 0 3v2h-11v-2a1.5 1.5 0 0 0 0-3z"/><path d="M9.5 4.8v1.2M9.5 7.4v1.2M9.5 10v1.2"/></svg>',
};

const chip = (s: SourceId) => `<span class="gi-src gi-s-${s}">${esc(SOURCES[s].short)}</span>`;
const sourcesOf = (r: Row) => r.entries.map((e) => e.source);
const where = (e: Entry) => (e.ref ? e.ref : `Row ${e.line}`);

// ---------- the page ----------

export const url = 'localhost:4321/guests/import';

export const guestimport: MountApp = (el, initial) => {
  let stage: Stage = normalize(initial);

  const root = document.createElement('div');
  root.className = 'gi';
  el.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);

  function normalize(s: string): Stage {
    return STAGES.includes(s as Stage) ? (s as Stage) : 'merged';
  }
  const imported = () => stage === 'partial' || stage === 'fixed' || stage === 'merged';
  const rows = () => rowsFor(stage as ImportStage);

  // ---------- shell ----------

  function shell() {
    if (stage === 'none') {
      root.className = 'gi gi--none';
      root.innerHTML = '<pre>Cannot GET /guests/import</pre>';
      return;
    }
    root.className = 'gi';
    root.dataset.stage = stage;
    root.innerHTML = `
      <div class="gi-scroll" data-scroll>
        <div class="gi-page">
          <header class="gi-top">
            <span class="gi-mark">${ICON.lantern}</span>
            <nav class="gi-crumbs" aria-label="Breadcrumb"><b>The Lantern</b><span aria-hidden="true">/</span><span>Guests</span><span aria-hidden="true">/</span><span aria-current="page">Import</span></nav>
            <span class="gi-who-am-i">Back office</span>
          </header>
          <section class="gi-hero">
            <p class="gi-eyebrow">Fri 28 Nov · Birthday night · Doors 23:00</p>
            <h1 class="gi-h1">Guest list</h1>
            <p class="gi-totals" data-totals>${totalsHtml()}</p>
          </section>
          ${imported() ? importedHtml() : sourcesHtml()}
        </div>
      </div>
      <p class="gi-vh" aria-live="polite" data-sr></p>`;
    if (imported()) { paintChips(); paintList(); }
  }

  function totalsHtml() {
    if (!imported()) {
      return `<span class="gi-pending-dot" aria-hidden="true"></span>Nothing imported yet · <b>${ENTRIES.length}</b> rows waiting in <b>${SOURCE_IDS.length}</b> sources`;
    }
    const rs = rows();
    return `<b>${rs.length}</b> people · <b>${sum(rs)}</b> plus-ones · from <b>${SOURCE_IDS.length}</b> sources`;
  }

  // ---------- before import: the three sources as they arrived ----------

  function sourcesHtml() {
    return `<ol class="gi-cards" aria-label="Sources">${SOURCE_IDS.map((s) => {
      const src = SOURCES[s];
      const es = ENTRIES.filter((e) => e.source === s);
      const shown = more.has(s) ? 8 : 3;
      const lines = [...(src.header ? [{ line: 1, text: src.header, head: true }] : []), ...es.slice(0, shown).map((e) => ({ line: e.line, text: e.raw, head: false }))];
      return `<li class="gi-card gi-s-${s}">
        <div class="gi-card-head">
          <span class="gi-src-icon">${ICON[s]}</span>
          <span class="gi-card-title"><b>${esc(src.label)}</b><span>${esc(src.file)} · ${esc(src.updated)}</span></span>
          <span class="gi-card-n"><b>${es.length}</b> rows</span>
        </div>
        <p class="gi-card-format">${esc(src.format)}</p>
        <pre class="gi-sample" aria-label="First rows of ${esc(src.label)}">${lines.map((l) => `<span class="gi-line${l.head ? ' gi-line--head' : ''}"><i>${l.line}</i><span>${esc(l.text)}</span></span>`).join('')}</pre>
        <div class="gi-card-foot">
          <span class="gi-pending"><span class="gi-pending-dot" aria-hidden="true"></span>Not imported yet</span>
          <button type="button" class="gi-more" data-more="${s}" aria-expanded="${more.has(s)}">${more.has(s) ? 'Fewer rows' : 'Show 5 more'}</button>
        </div>
      </li>`;
    }).join('')}</ol>`;
  }

  // ---------- after import ----------

  function importedHtml() {
    return `
      <ol class="gi-strip" aria-label="Imported per source">${SOURCE_IDS.map(stripCell).join('')}</ol>
      ${noticeHtml()}
      <div class="gi-tools">
        <form class="gi-search" role="search" data-search>
          <label class="gi-field">
            ${ICON.search}
            <span class="gi-vh">Search the guest list</span>
            <input data-input type="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Search names or order numbers" value="${esc(query)}">
            <button type="button" class="gi-clear" data-clear aria-label="Clear search"${query ? '' : ' data-hidden'}>${ICON.clear}</button>
          </label>
        </form>
        <div class="gi-chips" role="group" aria-label="Filter by source" data-chips></div>
      </div>
      <div class="gi-list" data-list></div>
      <p class="gi-foot">Open a row to see the line it came from. Imported Wed 14:06.</p>`;
  }

  function stripCell(s: SourceId) {
    const n = countOf(s);
    const want = ENTRIES.filter((e) => e.source === s).reduce((k, e) => k + e.plus, 0);
    const got = stage === 'partial' && s === 'noor' ? 0 : want;
    const bad = got !== want;
    return `<li><button type="button" class="gi-cell gi-s-${s}" data-filter="${s}" data-bad="${bad}" aria-pressed="${filter === s}" aria-label="${esc(SOURCES[s].label)}: ${n} guests, ${got} plus-ones${bad ? `, expected ${want}` : ''}. Show only these.">
      <span class="gi-cell-top"><i class="gi-dot" aria-hidden="true"></i><span class="gi-cell-name">${esc(SOURCES[s].short)}</span><span class="gi-cell-state">${bad ? ICON.alert : ICON.check}</span></span>
      <span class="gi-cell-n"><b>${n}</b> guests</span>
      <span class="gi-cell-plus"><b>+${got}</b>${bad ? ` <span>expected ${want}</span>` : ' plus-ones'}</span>
    </button></li>`;
  }

  function noticeHtml() {
    if (stage === 'partial') {
      const lost = ENTRIES.filter((e) => e.source === 'noor' && e.plus);
      const want = lost.reduce((k, e) => k + e.plus, 0);
      const lea = lost[0]!;
      return `<div class="gi-notice gi-notice--bad" role="alert" data-notice>
        <span class="gi-found"><i aria-hidden="true"></i>Found by the lead’s check</span>
        <p class="gi-notice-title">Noor: ${countOf('noor')} guests, <span class="gi-nw">0 plus-ones</span> (expected ${want})</p>
        <p class="gi-notice-sub">${lost.length} of Noor’s rows end in “+1” or “+2”. The import kept it in the name.</p>
        <code class="gi-evidence"><span>Row ${lea.line}</span> “${esc(lea.raw)}” → name “${esc(lea.raw)}”, plus-ones 0</code>
        <button type="button" class="gi-link" data-filter="noor">Show Noor’s rows</button>
      </div>`;
    }
    const n = twice(stage as ImportStage).size;
    if (stage === 'fixed') {
      return `<div class="gi-notice gi-notice--maybe" data-notice>
        <span class="gi-notice-icon">${ICON.twice}</span>
        <div class="gi-notice-body">
          <p class="gi-notice-title">${plural(n, 'guest')} may be on two lists</p>
          <p class="gi-notice-sub">Same name in two sources, like Ana Lopez on Kai’s list and Tickets. Not merged yet.</p>
        </div>
        <button type="button" class="gi-link" data-filter="twice">Show them</button>
      </div>`;
    }
    return `<div class="gi-notice gi-notice--ok" data-notice>
      <span class="gi-notice-icon">${ICON.check}</span>
      <div class="gi-notice-body">
        <p class="gi-notice-title">${n} people were on two lists, kept once</p>
        <p class="gi-notice-sub">Each keeps both sources and the larger number of plus-ones.</p>
      </div>
      <button type="button" class="gi-link" data-filter="twice">Show them</button>
    </div>`;
  }

  // ---------- chips and list ----------

  const matches = (r: Row, f: Filter, dup: Set<string>) =>
    f === 'all' ? true : f === 'twice' ? dup.has(r.match) : r.entries.some((e) => e.source === f);

  function paintChips() {
    const $c = $('[data-chips]');
    if (!$c) return;
    const hits = search(rows(), query);
    const dup = twice(stage as ImportStage);
    $c.innerHTML = FILTERS.map((f) => {
      const n = f === 'twice' && stage === 'partial' ? '–' : String(hits.filter((h) => matches(h.row, f, dup)).length);
      const label = f === 'all' ? 'All' : f === 'twice' ? 'On two lists' : SOURCES[f].short;
      return `<button type="button" class="gi-chip${f === 'all' || f === 'twice' ? '' : ` gi-s-${f}`}" data-filter="${f}" aria-pressed="${filter === f}">${f !== 'all' && f !== 'twice' ? '<i class="gi-dot" aria-hidden="true"></i>' : ''}${label}<span class="gi-chip-n">${n}</span></button>`;
    }).join('');
    root.querySelectorAll<HTMLElement>('.gi-cell').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
  }

  function rowHtml(r: Row, marks: number[], maybe: boolean) {
    const t = r.entries.find((e) => e.ref);
    const ref = t ? `<code>${esc(t.ref!)}</code><span> · ${plural(t.tickets!, 'ticket')}</span>` : `<span>${esc(SOURCES[r.entries[0]!.source].short)} · row ${r.entries[0]!.line}</span>`;
    const isOpen = open.has(r.key);
    const label = `${r.name}, ${andList(sourcesOf(r).map((s) => SOURCES[s].short))}, ${r.plus ? `plus ${r.plus}` : 'no plus-ones'}${r.dna ? ', do not admit' : ''}`;
    return `<li class="gi-item${r.lostPlus ? ' is-lost' : ''}${r.dna ? ' is-dna' : ''}">
      <button type="button" class="gi-row" data-row="${esc(r.key)}" aria-expanded="${isOpen}" aria-label="${esc(label)}">
        <span class="gi-who"><span class="gi-name">${nameHtml(r, marks)}</span>${r.dna ? '<span class="gi-dna">Do not admit</span>' : ''}${maybe ? '<span class="gi-maybe">same guest?</span>' : ''}</span>
        <span class="gi-srcs">${sourcesOf(r).map(chip).join('')}</span>
        <span class="gi-ref">${ref}</span>
        <span class="gi-plus" data-zero="${!r.plus}">${r.plus ? `+${r.plus}` : r.lostPlus ? '0' : '–'}</span>
        <span class="gi-chev">${ICON.chev}</span>
      </button>
      ${isOpen ? detailHtml(r) : ''}
    </li>`;
  }

  function detailHtml(r: Row) {
    const lines = r.entries.map((e) => {
      const read = stage === 'partial' && e.source === 'noor'
        ? `<span class="${r.lostPlus ? 'gi-read-bad' : ''}">name “${esc(e.raw)}”, plus-ones 0</span>`
        : `<span>name “${esc(e.name)}”, plus-ones ${e.plus}</span>`;
      return `<li><span class="gi-detail-src">${chip(e.source)}<span>${esc(where(e))}</span></span><code class="gi-detail-raw">${esc(e.raw)}</code><span class="gi-detail-read">read as ${read}</span></li>`;
    }).join('');
    const kept = r.entries.length > 1 && stage === 'merged'
      ? `<p class="gi-detail-kept">${ICON.check}<span>Kept once as ${esc(r.name)}, +${r.plus}</span></p>` : '';
    const dna = r.dna ? '<p class="gi-detail-dna">On the do-not-admit list. The door shows him in red.</p>' : '';
    return `<div class="gi-detail" data-detail><ol>${lines}</ol>${kept}${dna}</div>`;
  }

  function paintList() {
    const $l = $('[data-list]');
    if (!$l) return;
    const dup = twice(stage as ImportStage);
    const hits = search(rows(), query).filter((h) => matches(h.row, filter, dup));
    if (filter === 'twice' && stage === 'partial') {
      $l.innerHTML = emptyHtml('Not matched yet', 'This import keeps every row as it came in. Guests on two lists aren’t looked for.');
      return;
    }
    if (!hits.length) {
      const what = filter === 'all' ? '' : ` in ${filter === 'twice' ? 'guests on two lists' : SOURCES[filter].label}`;
      $l.innerHTML = emptyHtml(query.trim() ? `No guest matches “${esc(query.trim())}”${what}` : 'No guests here', 'Search looks at every word of a name and at order numbers.');
      return;
    }
    // Before the merge, rows with the same name sit together under a quiet "same guest?".
    const groupPairs = stage === 'fixed';
    let html = '';
    for (let i = 0; i < hits.length; i++) {
      const h = hits[i]!;
      const maybe = groupPairs && dup.has(h.row.match);
      const next = hits[i + 1];
      if (maybe && next && next.row.match === h.row.match) {
        const both = andList([h, next].map((x) => SOURCES[x.row.entries[0]!.source].label));
        html += `<li class="gi-pair"><p class="gi-pair-head"><span class="gi-maybe">same guest?</span><span>${esc(both)}</span></p><ol>${rowHtml(h.row, h.marks, false)}${rowHtml(next.row, next.marks, false)}</ol></li>`;
        i++;
      } else html += rowHtml(h.row, h.marks, maybe);
    }
    $l.innerHTML = `
      <div class="gi-colhead" aria-hidden="true"><span>Guest</span><span>Lists</span><span>Order or row</span><span>Plus</span><span></span></div>
      <ol class="gi-rows" aria-label="${hits.length} guests">${html}</ol>`;
  }

  function emptyHtml(title: string, sub: string) {
    return `<div class="gi-empty" role="status"><p class="gi-empty-title">${title}</p><p class="gi-empty-sub">${sub}</p></div>`;
  }

  const announce = (s: string) => { const sr = $('[data-sr]'); if (sr) sr.textContent = s; };

  // ---------- interactions ----------

  function setQuery(q: string) {
    query = q;
    const input = $<HTMLInputElement>('[data-input]');
    if (input && input.value !== q) input.value = q;
    $('[data-clear]')?.toggleAttribute('data-hidden', !q);
    paintChips();
    paintList();
  }

  function setFilter(f: Filter) {
    // A second tap on a source cell takes the filter off again.
    filter = f === filter && f !== 'all' ? 'all' : f;
    paintChips();
    paintList();
    const n = $('.gi-rows')?.getAttribute('aria-label');
    announce(n ? `${n} shown` : 'No guests shown');
    // Keep the list in view when the filter was chosen from above it.
    const tools = $('.gi-tools'), scroll = $('[data-scroll]');
    if (tools && scroll && scroll.scrollTop > tools.offsetTop) scroll.scrollTop = tools.offsetTop;
  }

  function toggleRow(key: string) {
    if (open.has(key)) open.delete(key); else open.add(key);
    const btn = root.querySelector<HTMLElement>(`[data-row="${CSS.escape(key)}"]`);
    const r = rows().find((x) => x.key === key);
    if (!btn || !r) return;
    const item = btn.parentElement!;
    item.querySelector('[data-detail]')?.remove();
    btn.setAttribute('aria-expanded', String(open.has(key)));
    if (open.has(key)) {
      item.insertAdjacentHTML('beforeend', detailHtml(r));
      enter(item.querySelector('[data-detail]'), { transform: 'translateY(-4px)', opacity: 0 }, 180);
    }
  }

  function onClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    const f = t.closest<HTMLElement>('[data-filter]');
    if (f) return setFilter(f.dataset.filter as Filter);
    const row = t.closest<HTMLElement>('[data-row]');
    if (row) return toggleRow(row.dataset.row!);
    const m = t.closest<HTMLElement>('[data-more]');
    if (m) {
      const s = m.dataset.more as SourceId;
      if (more.has(s)) more.delete(s); else more.add(s);
      const y = $('[data-scroll]')?.scrollTop ?? 0;
      shell();
      const sc = $('[data-scroll]');
      if (sc) sc.scrollTop = y;
      $<HTMLElement>(`[data-more="${s}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (t.closest('[data-clear]')) { setQuery(''); $<HTMLInputElement>('[data-input]')?.focus({ preventScroll: true }); }
  }
  function onInput(e: Event) {
    const t = e.target as HTMLElement;
    if (t.matches('[data-input]')) setQuery((t as HTMLInputElement).value);
  }
  function onSubmit(e: Event) { e.preventDefault(); ($<HTMLInputElement>('[data-input]'))?.blur(); }
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && (e.target as HTMLElement).matches('[data-input]') && query) { setQuery(''); e.stopPropagation(); }
  }
  root.addEventListener('click', onClick);
  root.addEventListener('input', onInput);
  root.addEventListener('submit', onSubmit);
  root.addEventListener('keydown', onKey);

  // ---------- stages ----------

  function enterStage(s: Stage, from: Stage | null) {
    const scroll = $('[data-scroll]');
    const y = scroll?.scrollTop ?? 0;
    const hadFocus = document.activeElement?.matches?.('[data-input]') && root.contains(document.activeElement);
    stage = s;
    shell();
    // Moving between imported stages keeps the reader's place; the notice is what changed.
    const keep = from && from !== 'none' && from !== 'sources' && imported();
    const sc = $('[data-scroll]');
    if (sc && keep) sc.scrollTop = y;
    if (hadFocus) $<HTMLInputElement>('[data-input]')?.focus({ preventScroll: true });
    if (from !== null) {
      enter($('[data-notice]'), { transform: 'translateY(-6px)', opacity: 0 }, 220);
      enter($('[data-totals]'), { opacity: 0.2 }, 220);
      if (!keep) enter($('.gi-cards') ?? $('.gi-strip'), { transform: 'translateY(6px)', opacity: 0 }, 240);
    }
  }

  enterStage(stage, null);

  return {
    set(next: string) {
      const s = normalize(next);
      if (s === stage) return;
      enterStage(s, stage);
    },
    destroy() {
      root.removeEventListener('click', onClick);
      root.removeEventListener('input', onInput);
      root.removeEventListener('submit', onSubmit);
      root.removeEventListener('keydown', onKey);
      root.remove();
    },
  };
};

export const app = guestimport;
