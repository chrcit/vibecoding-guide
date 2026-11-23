/*
 * The Lantern's door page, as the agent builds it in lesson 2. A real, working page: type any part
 * of a name, tap the guest in, undo within five seconds. Built for one hand at a dark door: the
 * search box, the best match and every action sit at the bottom, in reach of the thumb.
 *
 * Stages (see ./index.ts): 'none' is the dev server's 404; 'first' and 'buggy' are the first
 * version, where a second tap checks a guest in again (it is the same code: nothing tried it yet);
 * 'testing' is the agent running your three cases in the shared browser; 'fixed' refuses a second
 * tap and says when they arrived.
 *
 * Who is in lives at module level, so it survives `set()` and a remount while the reader moves
 * through the lesson. Everything here is made up.
 *
 * Lessons 3 and 4 add two stages: 'promo-missing', where the first promoter version left the
 * promoters' guests off the door, and 'promo', where Kai's and Noor's lists are the guests they
 * added through their own links (lantern/store.ts). Both open with "lea" typed, Lea Brandt being
 * one of Kai's guests.
 */
import { cannotGet } from './lantern/notfound';
import './door.css';
import './door-late.css';
import type { DoorStage, MountApp } from './index';
import { GUESTS, LISTS, CAPACITY, START_MIN, ALREADY_IN, WALK_INS, ANA, LATER, RICO, type Guest, type ListId } from './door/guests';
import { find, highlight, tokensOf } from './door/search';
import { runAgent, type Run } from './door/agent';
// Lessons 7 and 8: do-not-admit, the agent's four-case proof, and practice mode (door/late.ts).
import { LATE_STAGES, DNA_STAGES, FULL_STAGES, dnaRow, dnaDeck, dnaSheet, dnaLists, practiceBar } from './door/late';
import { runProof } from './door/proof';
import { doorGuests } from './lantern/store';

// ---------- tonight's state, shared by every mount ----------

interface Arrival { id: string; at: number; plus: number; seq: number }
const byId = new Map([...GUESTS, ...LATER].map((g) => [g.id, g]));
const arrivals: Arrival[] = [];
let seq = 0;
const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h! * 60 + m!; };
for (const [id, at, plus] of ALREADY_IN) arrivals.push({ id, at: toMin(at), plus, seq: seq++ });

const t0 = Date.now();
const now = () => START_MIN + Math.floor((Date.now() - t0) / 60_000);
const pad = (n: number) => String(n).padStart(2, '0');
const hhmm = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;

const headCount = () => WALK_INS + arrivals.reduce((n, a) => n + 1 + a.plus, 0);
const arrivalsOf = (id: string) => arrivals.filter((a) => a.id === id);
/** 'fixed' keeps one arrival per guest: the agent's fixed check-in, run again on clean data. */
function dedupe() {
  const seen = new Set<string>();
  for (let i = 0; i < arrivals.length; i++) {
    const a = arrivals[i]!;
    if (seen.has(a.id)) { arrivals.splice(i--, 1); continue; }
    seen.add(a.id);
  }
}

// ---------- helpers ----------

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const initials = (name: string) => { const w = name.split(' '); return (w[0]![0]! + (w.length > 1 ? w[w.length - 1]![0]! : '')).toUpperCase(); };
const firstName = (name: string) => name.split(' ')[0]!;
const people = (n: number) => `${n} ${n === 1 ? 'person' : 'people'}`;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
function enter(el: Element | null, from: Keyframe, ms = 200) {
  if (!el || reduced()) return;
  (el as HTMLElement).animate([from, { transform: 'none', opacity: 1 }], { duration: ms, easing: EASE });
}

const ICON = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/></svg>',
  clear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>',
  check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8.4 6.4 11.5 12.8 4.6"/></svg>',
  stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>',
  again: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4.2v4.6M8 11.4v.4"/></svg>',
  lantern: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="dr-lantern-frame" d="M9 3.5h6M12 3.5V6M7.5 8.2 9 6h6l1.5 2.2v8.6L15 19H9l-1.5-2.2zM9.5 21h5"/><path class="dr-lantern-glow" d="M12 10.2c1.3 1.4 1.9 2.4 1.9 3.4a1.9 1.9 0 0 1-3.8 0c0-1 .6-2 1.9-3.4z"/></svg>',
};

const UNDO_MS = 5000;

/** Lesson 6: guests who came three Fridays in a row, with when they came in last Friday. Made up. */
const REGULARS: Record<string, string> = Object.fromEntries(
  [['Ana Lopez', '22:41'], ['Mina Park', '23:12'], ['Jonas Weber', '23:58'], ['Kofi Mensah', '00:37']]
    .map(([name, t]) => [GUESTS.find((g) => g.name === name)?.id ?? '', t!]).filter(([id]) => id),
);
/** The time as the first regulars thread wrote it, before AGENTS.md said 24-hour: 10:41 PM. */
const twelve = (t: string) => { const [h, m] = t.split(':').map(Number); return `${((h! + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h! >= 12 ? 'PM' : 'AM'}`; };
const MAX_ROWS = 40;

type Deck =
  | { kind: 'hint' }
  | { kind: 'in'; a: Arrival }
  | { kind: 'already'; g: Guest; at: number }
  | { kind: 'undone'; g: Guest }
  | { kind: 'dna'; g: Guest };

// ---------- the page ----------

export const url = 'localhost:4321/door';

export const door: MountApp = (el, initial) => {
  let stage: DoorStage = normalize(initial);
  let query = '';
  let deck: Deck = { kind: 'hint' };
  let deckTimer = 0;
  let run: Run | null = null;
  let io: IntersectionObserver | null = null;
  let sheetFor: Guest | null = null;
  let lastCount = headCount();
  let lastSeq = seq;

  const root = document.createElement('div');
  root.className = 'dr';
  el.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);
  const clock = window.setInterval(() => { const c = $('[data-clock]'); if (c) c.textContent = hhmm(now()); }, 15_000);

  function normalize(s: string): DoorStage {
    return (['none', 'first', 'buggy', 'testing', 'fixed', 'promo-missing', 'promo', 'listed', 'dna', 'dnaFull', 'proof', 'practice', 'regularsRed', 'regulars'] as const).includes(s as DoorStage) ? (s as DoorStage) : 'first';
  }
  const PROMO = (s: DoorStage) => s === 'promo' || s === 'promo-missing';
  /**
   * Tonight's lists at this stage. From lesson 3 the promoters' lists are what they added themselves
   * (lantern/store); from lesson 7 guests who join later (Rico) come in with the stage that adds them.
   */
  function roster(): Guest[] {
    if (LATE_STAGES.includes(stage)) return [...GUESTS, ...LATER];
    if (!PROMO(stage)) return GUESTS;
    const own = GUESTS.filter((g) => g.list !== 'kai' && g.list !== 'noor');
    if (stage === 'promo-missing') return own;
    const promo = doorGuests();
    for (const g of promo) if (!byId.has(g.id)) byId.set(g.id, g);
    return [...own, ...promo];
  }
  /** The first version counts a second tap again; the fixed one and every later stage refuse it. */
  const refusesSecondTap = () => stage === 'fixed' || PROMO(stage) || LATE_STAGES.includes(stage) || isRegulars();
  /** Lesson 6: regulars carry a star, red at first, gold once the rule about red is written down. */
  const isRegulars = () => stage === 'regularsRed' || stage === 'regulars';
  /** Do-not-admit, from lesson 7 on: red, no tap-in. */
  const isDna = (g: Guest) => DNA_STAGES.includes(stage) && g.id === RICO;
  const full = () => FULL_STAGES.includes(stage);
  /** Practice mode (lesson 8): tonight's arrivals are put aside on entry and back on exit; four cases tick. */
  let saved: Arrival[] | null = null;
  const tried = [false, false, false, false];
  function tick(i: number) {
    if (stage !== 'practice' || tried[i]) return;
    tried[i] = true;
    const bar = $('[data-practice]');
    if (bar) { bar.innerHTML = practiceBar(tried); enter(bar.querySelectorAll('li')[i] ?? null, { transform: 'scale(0.96)', opacity: 0.4 }, 200); }
  }

  // ---------- shell ----------

  function shell() {
    if (stage === 'none') {
      root.className = 'dr dr--none';
      root.innerHTML = cannotGet('/door');
      return;
    }
    root.className = 'dr';
    root.innerHTML = `
      <div class="dr-agent" data-agent hidden></div>
      ${stage === 'practice' ? `<div class="dr-practice" data-practice>${practiceBar(tried)}</div>` : ''}
      <header class="dr-head">
        <div class="dr-brand">
          <span class="dr-lantern">${ICON.lantern}</span>
          <span class="dr-brand-text"><b>The Lantern</b><span title="The dev server runs on made-up guests, with its clock set to a Friday night, so there is a night to try the page on.">Door · dev data · Fri <time data-clock>${hhmm(now())}</time></span></span>
        </div>
        <div class="dr-count">
          <span class="dr-count-line"><b class="dr-count-n" data-count>${lastCount}</b><span class="dr-count-of">/ ${CAPACITY}</span></span>
          <span class="dr-count-sub" data-left></span>
        </div>
      </header>
      <div class="dr-cap" aria-hidden="true"><i data-cap></i></div>
      <section class="dr-recent" aria-label="Just in">
        <span class="dr-recent-label" aria-hidden="true">Just in</span>
        <ol class="dr-recent-list" data-recent></ol>
      </section>
      <div class="dr-results" data-scroll>
        <div class="dr-results-inner" data-results></div>
      </div>
      <div class="dr-foot">
        <div class="dr-deck" data-deck></div>
        <form class="dr-search" role="search" data-search>
          <label class="dr-field" data-field>
            ${ICON.search}
            <span class="dr-vh">Search tonight’s list</span>
            <input data-input type="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Search a name" value="${esc(query)}">
            <button type="button" class="dr-clear" data-clear aria-label="Clear search"${query ? '' : ' data-hidden'}>${ICON.clear}</button>
          </label>
        </form>
      </div>
      <p class="dr-vh" aria-live="polite" data-sr></p>`;
    paintCount(false);
    paintRecent(false);
    paintResults();
    paintDeck(false);
  }

  // ---------- head count and capacity ----------

  function paintCount(animate: boolean) {
    const n = headCount();
    const $n = $('[data-count]'), $cap = $('[data-cap]'), $left = $('[data-left]');
    if (!$n || !$cap || !$left) return;
    const changed = n !== lastCount;
    lastCount = n;
    $n.textContent = String(n);
    const left = CAPACITY - n;
    $left.textContent = left > 0 ? `in · ${left} left` : 'in · full';
    const p = Math.min(1, n / CAPACITY);
    $cap.style.transform = `scaleX(${p})`;
    root.dataset.cap = p >= 0.9 ? 'high' : '';
    if (animate && changed) enter($n, { transform: 'translateY(35%)', opacity: 0 }, 220);
  }

  function paintRecent(animate: boolean) {
    const $r = $('[data-recent]');
    if (!$r) return;
    const recent = [...arrivals].sort((a, b) => b.seq - a.seq).slice(0, 12);
    $r.innerHTML = recent.map((a) => {
      const g = byId.get(a.id)!;
      return `<li class="dr-chip dr-l-${g.list}"><span class="dr-av dr-av--s" aria-hidden="true">${initials(g.name)}</span><span class="dr-chip-name">${esc(firstName(g.name))}${a.plus ? ` <span class="dr-chip-plus">+${a.plus}</span>` : ''}</span><time>${hhmm(a.at)}</time></li>`;
    }).join('');
    const top = recent[0];
    if (animate && top && top.seq >= lastSeq) {
      $r.scrollLeft = 0;
      enter($r.firstElementChild, { transform: 'translateX(-10px)', opacity: 0 }, 220);
    }
    lastSeq = seq;
  }

  // ---------- results ----------

  function statusOf(g: Guest) {
    const mine = arrivalsOf(g.id);
    if (!mine.length) return '<span class="dr-go">Check in</span>';
    const last = mine[mine.length - 1]!;
    const plus = mine.reduce((n, a) => Math.max(n, a.plus), 0);
    const times = mine.length > 1 ? `In ×${mine.length}` : 'In';
    return `<span class="dr-in" data-n="${mine.length}">${ICON.check}<span>${times} · ${hhmm(last.at)}${plus ? ` · +${plus}` : ''}</span></span>`;
  }

  function rowHtml(g: Guest, marks: number[]) {
    if (isDna(g)) return dnaRow(g, highlight(g, marks), full());
    const mine = arrivalsOf(g.id);
    const label = mine.length
      ? `${g.name}, ${LISTS[g.list].label}, in since ${hhmm(mine[0]!.at)}${mine.length > 1 ? `, checked in ${mine.length} times` : ''}`
      : `Check in ${g.name}, ${LISTS[g.list].label}${g.plus ? `, with up to ${g.plus} plus-one${g.plus > 1 ? 's' : ''}` : ''}`;
    const reg = isRegulars() ? REGULARS[g.id] : undefined;
    const meta = (g.list === 'staff' ? `Staff · ${esc(g.role ?? '')}` : esc(LISTS[g.list].label))
      + (reg ? `<span class="dr-reg" data-tone="${stage === 'regulars' ? 'gold' : 'red'}">★ regular · last in ${stage === 'regulars' ? reg : twelve(reg)}</span>` : '');
    return `<li><button type="button" class="dr-row dr-l-${g.list}" data-id="${g.id}" data-in="${mine.length ? 'yes' : 'no'}" aria-label="${esc(label)}">
      <span class="dr-av" aria-hidden="true">${initials(g.name)}</span>
      <span class="dr-who" aria-hidden="true">
        <span class="dr-name">${highlight(g, marks)}</span>
        <span class="dr-meta"><i class="dr-dot"></i>${meta}${g.plus ? `<span class="dr-plus">+${g.plus}</span>` : ''}</span>
      </span>
      <span class="dr-status" aria-hidden="true">${statusOf(g)}</span>
    </button></li>`;
  }

  function listsHtml() {
    const order: ListId[] = ['kai', 'noor', 'guest', 'staff'];
    const inIds = new Set(arrivals.map((a) => a.id));
    const GUESTS = roster();
    return `<section class="dr-lists" aria-label="Tonight’s lists">
      <h2 class="dr-lists-head">Tonight’s lists</h2>
      <ul>${order.map((l) => {
        const on = roster().filter((g) => g.list === l);
        const n = on.filter((g) => inIds.has(g.id)).length;
        if (!on.length) return '';
        return `<li class="dr-l-${l}"><span class="dr-lists-name"><i class="dr-dot"></i>${esc(LISTS[l].label)}</span><span class="dr-lists-n"><b>${n}</b> of ${on.length} in</span><span class="dr-lists-bar" aria-hidden="true"><i style="transform:scaleX(${(n / on.length).toFixed(3)})"></i></span></li>`;
      }).join('')}</ul>
      ${dnaLists(GUESTS.filter(isDna))}
    </section>`;
  }

  function paintResults() {
    const $r = $('[data-results]'), $s = $('[data-scroll]');
    if (!$r || !$s) return;
    const tokens = tokensOf(query);
    const hits = find(roster(), query);
    root.dataset.view = !tokens.length ? 'idle' : hits.length ? 'hits' : 'none';
    if (root.dataset.view === 'none') tick(1);
    if (hits.some((h) => isDna(h.guest))) tick(3);
    if (!tokens.length) $r.innerHTML = listsHtml();
    else if (!hits.length) {
      $r.innerHTML = `<div class="dr-none" role="status">
        <span class="dr-none-icon">${ICON.stop}</span>
        <p class="dr-none-title">Not on tonight’s list</p>
        <p class="dr-none-sub">No name on any list starts with “${esc(query.trim())}”. Check the spelling, or ask who invited them.</p>
      </div>`;
    } else {
      const more = hits.length - MAX_ROWS;
      $r.innerHTML = `<ol class="dr-rows" aria-label="${hits.length} on tonight’s list">${hits.slice(0, MAX_ROWS).map((h) => rowHtml(h.guest, h.marks)).join('')}</ol>${more > 0 ? `<p class="dr-more">${more} more · keep typing</p>` : ''}`;
    }
    // Best match sits nearest the thumb, just above the search box.
    $s.scrollTop = $s.scrollHeight;
  }

  // ---------- the deck: one line above the search box for hints and confirmations ----------

  function hint() {
    const tokens = tokensOf(query);
    if (!tokens.length) return 'Type any part of a name';
    const n = find(roster(), query).length;
    return n ? `${n} on the list · tap a name to check them in` : '';
  }

  function paintDeck(animate: boolean) {
    const $d = $('[data-deck]');
    if (!$d) return;
    let html = '';
    if (deck.kind === 'hint') html = `<p class="dr-hint">${esc(hint())}</p>`;
    else if (deck.kind === 'in') {
      const g = byId.get(deck.a.id)!;
      const sub = `${hhmm(deck.a.at)} · ${deck.a.plus ? `with ${deck.a.plus} plus-one${deck.a.plus > 1 ? 's' : ''}` : LISTS[g.list].label}`;
      html = `<div class="dr-toast" data-kind="in">
        <span class="dr-toast-icon">${ICON.check}</span>
        <span class="dr-toast-text"><b>${esc(g.name)} is in</b><span>${esc(sub)}</span></span>
        <button type="button" class="dr-undo" data-undo>Undo</button>
        <i class="dr-toast-timer" aria-hidden="true"></i>
      </div>`;
    } else if (deck.kind === 'already') {
      html = `<div class="dr-toast" data-kind="already">
        <span class="dr-toast-icon">${ICON.again}</span>
        <span class="dr-toast-text"><b>Already in · ${hhmm(deck.at)}</b><span>${esc(deck.g.name)} wasn’t counted again</span></span>
      </div>`;
    } else if (deck.kind === 'dna') {
      html = dnaDeck(deck.g, full());
    } else {
      html = `<div class="dr-toast" data-kind="undone"><span class="dr-toast-text"><b>Undone</b><span>${esc(deck.g.name)} is not checked in</span></span></div>`;
    }
    $d.innerHTML = html;
    if (animate) enter($d.firstElementChild, { transform: 'translateY(8px)', opacity: 0 }, 220);
    const timer = $d.querySelector<HTMLElement>('.dr-toast-timer');
    if (timer && !reduced()) timer.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: UNDO_MS, easing: 'linear', fill: 'forwards' });
  }

  function showDeck(d: Deck, ms = 0) {
    if (deckTimer) clearTimeout(deckTimer);
    deckTimer = 0;
    deck = d;
    paintDeck(d.kind !== 'hint');
    if (ms) deckTimer = window.setTimeout(() => { deck = { kind: 'hint' }; deckTimer = 0; paintDeck(false); }, ms);
  }

  const announce = (s: string) => { const sr = $('[data-sr]'); if (sr) sr.textContent = s; };

  // ---------- check-in ----------

  function checkIn(g: Guest, plus: number) {
    const a: Arrival = { id: g.id, at: now(), plus, seq: seq++ };
    arrivals.push(a);
    if (g.id === ANA) tick(0);
    afterChange();
    showDeck({ kind: 'in', a }, UNDO_MS);
    announce(`${g.name} checked in. ${headCount()} of ${CAPACITY} in.`);
  }

  function tap(id: string, fromAgent = false) {
    const g = byId.get(id);
    if (!g) return;
    // Do-not-admit: nothing to tap in. The deck says so; from lesson 7 part 4 the sheet says what to do.
    if (isDna(g)) {
      if (full() && !fromAgent) { openDna(g); return; }
      showDeck({ kind: 'dna', g }, 3600);
      announce(`${g.name}: do not admit. Not checked in.`);
      const row = $(`.dr-row[data-id="${id}"]`);
      if (row && !reduced()) row.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'translateX(0)' }], { duration: 260, easing: 'ease-out' });
      return;
    }
    const mine = arrivalsOf(id);
    if (mine.length && refusesSecondTap()) {
      if (id === ANA) tick(2);
      showDeck({ kind: 'already', g, at: mine[0]!.at }, 3200);
      announce(`${g.name} is already in, since ${hhmm(mine[0]!.at)}. Not counted again.`);
      const row = $(`.dr-row[data-id="${id}"]`);
      if (row && !reduced()) row.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'translateX(0)' }], { duration: 260, easing: 'ease-out' });
      return;
    }
    if (g.plus && !fromAgent) return openSheet(g);
    checkIn(g, 0);
  }

  function undo() {
    if (deck.kind !== 'in') return;
    const { a } = deck;
    const i = arrivals.indexOf(a);
    if (i >= 0) arrivals.splice(i, 1);
    const g = byId.get(a.id)!;
    afterChange();
    showDeck({ kind: 'undone', g }, 2200);
    announce(`Undone. ${g.name} is not checked in.`);
  }

  function afterChange() {
    paintCount(true);
    paintRecent(true);
    paintResults();
  }

  // ---------- do-not-admit: what to do (door/late.ts) ----------

  function openDna(g: Guest) {
    closeSheet(false);
    const sheet = document.createElement('div');
    sheet.className = 'dr-sheet';
    sheet.innerHTML = dnaSheet(g);
    root.append(sheet);
    if (!reduced()) {
      sheet.querySelector<HTMLElement>('.dr-scrim')!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
      sheet.querySelector<HTMLElement>('.dr-panel')!.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
    }
    showDeck({ kind: 'dna', g }, 3600);
    announce(`${g.name}: do not admit.`);
    sheet.querySelector<HTMLElement>('[data-close].dr-cancel')?.focus({ preventScroll: true });
  }

  // ---------- plus-ones sheet ----------

  function openSheet(g: Guest) {
    closeSheet(false);
    sheetFor = g;
    const opts = Array.from({ length: g.plus + 1 }, (_, n) => n);
    const sheet = document.createElement('div');
    sheet.className = 'dr-sheet';
    sheet.innerHTML = `
      <div class="dr-scrim" data-close></div>
      <div class="dr-panel dr-l-${g.list}" role="dialog" aria-modal="true" aria-labelledby="dr-sheet-title">
        <div class="dr-panel-head">
          <span class="dr-av" aria-hidden="true">${initials(g.name)}</span>
          <span class="dr-who"><b id="dr-sheet-title">${esc(g.name)}</b><span class="dr-meta"><i class="dr-dot"></i>${esc(LISTS[g.list].label)} · up to ${g.plus} plus-one${g.plus > 1 ? 's' : ''}</span></span>
        </div>
        <p class="dr-panel-q">Who came with them?</p>
        <div class="dr-opts" style="--n:${opts.length}">${opts.map((n) => `
          <button type="button" class="dr-opt" data-plus="${n}"${n === g.plus ? ' data-primary' : ''}>
            <b>${n ? `+${n}` : `Just ${esc(firstName(g.name))}`}</b><span>${people(n + 1)}</span>
          </button>`).join('')}
        </div>
        <button type="button" class="dr-cancel" data-close>Cancel</button>
      </div>`;
    root.append(sheet);
    if (!reduced()) {
      sheet.querySelector<HTMLElement>('.dr-scrim')!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
      sheet.querySelector<HTMLElement>('.dr-panel')!.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
    }
    sheet.querySelector<HTMLElement>('[data-primary]')?.focus({ preventScroll: true });
  }

  function closeSheet(animate = true) {
    const sheet = $('.dr-sheet');
    sheetFor = null;
    if (!sheet) return;
    if (!animate || reduced()) { sheet.remove(); return; }
    sheet.style.pointerEvents = 'none';
    sheet.querySelector<HTMLElement>('.dr-scrim')!.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-out', fill: 'forwards' });
    sheet.querySelector<HTMLElement>('.dr-panel')!.animate([{ transform: 'none' }, { transform: 'translateY(100%)' }], { duration: 180, easing: 'ease-out', fill: 'forwards' })
      .finished.then(() => sheet.remove(), () => sheet.remove());
  }

  // ---------- search box ----------

  function setQuery(q: string, fromUser = true) {
    query = q;
    const input = $<HTMLInputElement>('[data-input]');
    if (input && input.value !== q) input.value = q;
    $('[data-clear]')?.toggleAttribute('data-hidden', !q);
    paintResults();
    // A new search ends a confirmation's spotlight but keeps undo reachable until its timer runs out.
    if (deck.kind === 'hint' || (fromUser && deck.kind !== 'in')) showDeck({ kind: 'hint' });
  }

  // ---------- events (all on root, gone with it) ----------

  root.addEventListener('input', (e) => {
    const t = e.target as HTMLElement;
    if (t.matches('[data-input]')) setQuery((t as HTMLInputElement).value);
  });
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-close]')) return closeSheet();
    const opt = t.closest<HTMLElement>('[data-plus]');
    if (opt && sheetFor) { const g = sheetFor; closeSheet(); checkIn(g, Number(opt.dataset.plus)); setQuery('', false); return; }
    if (t.closest('[data-undo]')) return undo();
    if (t.closest('[data-clear]')) { setQuery(''); $<HTMLInputElement>('[data-input]')?.focus({ preventScroll: true }); return; }
    const row = t.closest<HTMLElement>('.dr-row');
    if (row) pick(row.dataset.id!);
  });
  /** A tap on a guest. After a check-in the box clears for the next guest; the deck confirms. */
  function pick(id: string) {
    const g = byId.get(id);
    const refused = (arrivalsOf(id).length > 0 && refusesSecondTap()) || (!!g && isDna(g));
    tap(id);
    if (!refused && !$('.dr-sheet')) setQuery('', false);
  }
  root.addEventListener('submit', (e) => {
    e.preventDefault();
    const hits = find(roster(), query);
    if (hits.length === 1) pick(hits[0]!.guest.id);
  });
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if ($('.dr-sheet')) { closeSheet(); e.stopPropagation(); }
    else if ((e.target as HTMLElement).matches('[data-input]') && query) { setQuery(''); e.stopPropagation(); }
  });
  // The reader taking over mid-run: the agent's run finishes at once and hands the page back.
  const takeOver = (e: Event) => { if (e.isTrusted && run && !run.done) run.stop(); };
  root.addEventListener('pointerdown', takeOver, true);
  root.addEventListener('keydown', takeOver, true);

  // ---------- the agent's run ----------

  const page = {
    root,
    get bar() { return $('[data-agent]')!; },
    field: () => $('[data-field]'),
    clearButton: () => $('[data-clear]'),
    row: (id: string) => $(`.dr-row[data-id="${id}"]`),
    agentFocus: (on: boolean) => $('[data-field]')?.toggleAttribute('data-agent-focus', on),
    setQuery: (q: string) => setQuery(q, false),
    tapRow: (id: string) => { tap(id, true); setQuery('', false); },
    count: headCount,
    deck: () => deck.kind,
    view: () => root.dataset.view ?? '',
    resetGuest: (id: string) => {
      for (let i = arrivals.length - 1; i >= 0; i--) if (arrivals[i]!.id === id) arrivals.splice(i, 1);
      if (deck.kind === 'in' && deck.a.id === id) showDeck({ kind: 'hint' });
      afterChange();
    },
  };

  function startRun() {
    stopRun();
    const go = () => {
      io?.disconnect(); io = null;
      run = runAgent(page, byId.get(ANA)!, { instant: reduced() });
    };
    // Start when the page can be seen, so a reader on another tab doesn't miss it.
    if (reduced() || typeof IntersectionObserver === 'undefined') return go();
    io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) go(); }, { threshold: 0.4 });
    io.observe(root);
  }
  /** Lesson 8, part 2: the agent's four cases (door/proof.ts). */
  function startProof() {
    stopRun();
    const go = () => { io?.disconnect(); io = null; run = runProof(page, byId.get(ANA)!, byId.get(RICO)!, { instant: reduced() }); };
    if (reduced() || typeof IntersectionObserver === 'undefined') return go();
    io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) go(); }, { threshold: 0.4 });
    io.observe(root);
  }
  function stopRun() {
    io?.disconnect(); io = null;
    if (run && !run.done) run.stop();
    run = null;
  }

  function enterStage(s: DoorStage, from: DoorStage | null) {
    if ((from === 'testing' || from === 'proof') && s !== from) stopRun();
    // Practice mode keeps tonight's list apart: put the real arrivals aside, and back on the way out.
    if (s === 'practice' && from !== 'practice') {
      saved = arrivals.slice();
      for (let i = arrivals.length - 1; i >= 0; i--) if (arrivals[i]!.id === ANA) arrivals.splice(i, 1);
      tried.fill(false);
    }
    if (from === 'practice' && s !== 'practice' && saved) { arrivals.splice(0, arrivals.length, ...saved); saved = null; }
    stage = s;
    if (s === 'fixed' || PROMO(s) || LATE_STAGES.includes(s) || s === 'regularsRed' || s === 'regulars') dedupe();
    // Lessons 3 and 4: the agent's check searched for Lea Brandt, one of Kai's guests.
    if (PROMO(s) && (!from || !PROMO(from))) query = 'lea';
    // Lesson 6: open on a regular, so the star is in view; the reader can clear the search.
    if ((s === 'regularsRed' || s === 'regulars') && !query && from !== 'regularsRed' && from !== 'regulars') query = 'ana';
    if (sheetFor) closeSheet(false);
    if (deckTimer) clearTimeout(deckTimer);
    deck = { kind: 'hint' };
    lastCount = headCount();
    shell();
    const bar = $('[data-agent]');
    if (bar) bar.hidden = s !== 'testing' && s !== 'proof';
    if (s === 'testing') startRun();
    if (s === 'proof') startProof();
  }

  enterStage(stage, null);

  return {
    set(next: string) {
      const s = normalize(next);
      if (s === stage) return;
      enterStage(s, stage);
    },
    destroy() {
      stopRun();
      if (saved) { arrivals.splice(0, arrivals.length, ...saved); saved = null; }
      clearInterval(clock);
      if (deckTimer) clearTimeout(deckTimer);
      root.remove();
    },
  };
};

export const app = door;
