/*
 * The Lantern's other pages, as the promoter thread and later threads build them (lessons 5 and 6):
 *
 *   /promoters    the owner's view: each promoter's guests, plus-ones and arrivals
 *   /door/late    the door's list of promoter guests not in by midnight
 *   /p/kai        Kai's own list, the page promoters use
 *   /door/close   the closing checklist
 *
 * One app with a tab bar in the thumb zone, in the door page's dark look (door.css): these are used
 * on phones, at night. The reader can move between pages and use them; the address bar follows.
 *
 * Stages, in story order (see `STAGES`): what exists and how /door/late behaves.
 *   'promoters'     16:00, only /promoters and /p/kai
 *   'late-phone'    /door/late lists late guests with their phone number and a Call button
 *   'late-flag'     the same, with the number marked as the rule it breaks
 *   'late-ask'      no numbers at the door: "Ask Kai" instead
 *   'late-running'  /p/kai gets a "Running late" switch per guest (opens on /p/kai)
 *   'late-shown'    the same, opened on /door/late, where it shows
 *   'close'         /door/close, the closing checklist (lesson 6)
 *
 * The door's late list runs on the dev server's made-up data with its clock set to 00:20, so it has
 * someone to show at 16:00. Every name, number and time here is made up; the phone numbers use the
 * UK's range set aside for drama (+44 7700 900xxx), from the shared store.
 */
import './lantern.css';
import type { MountApp } from './index';
import { PROMOTERS as STORE_PROMOTERS, guestsOf, limitOf } from './lantern/store';

type Stage = 'promoters' | 'late-phone' | 'late-flag' | 'late-ask' | 'late-running' | 'late-shown' | 'close';
const STAGES: Stage[] = ['promoters', 'late-phone', 'late-flag', 'late-ask', 'late-running', 'late-shown', 'close'];
type Route = '/promoters' | '/door/late' | '/p/kai' | '/door/close';
type Promoter = 'kai' | 'noor';

interface G { id: string; name: string; by: Promoter; plus: number; phone: string; late?: boolean }

// ---------- made-up data: the promoters' lists from lesson 3, in the one store the door shares ----------

// Kai's and Noor's guests, their limits and their links come from ./lantern/store.ts, the store the
// promoter pages and the door use in lessons 3 and 4, so the counts and names carry across lessons.
// Guests the reader added through a promoter's link there show up here too.
const PROMOTERS: Record<Promoter, { name: string; readonly limit: number; link: string }> = {
  kai: { name: STORE_PROMOTERS.kai.name, get limit() { return limitOf('kai'); }, link: `/p/${STORE_PROMOTERS.kai.token}` },
  noor: { name: STORE_PROMOTERS.noor.name, get limit() { return limitOf('noor'); }, link: `/p/${STORE_PROMOTERS.noor.token}` },
};
/** Who isn't in by midnight on the dev server's made-up night. */
const LATE_IDS = ['lea-brandt', 'felix-brandauer', 'yuki-tanaka', 'layla-nasser', 'jun-watanabe'];
/** Oldest first, as the lists were filled. */
const of = (p: Promoter): G[] => guestsOf(p).reverse().map((g) => ({ id: g.id, name: g.name, by: g.by, plus: g.plus, phone: g.phone, late: LATE_IDS.includes(g.id) }));
const all = () => [...of('kai'), ...of('noor')];
const byId = { get: (id: string) => all().find((g) => g.id === id) };
const late = () => LATE_IDS.map((id) => byId.get(id)).filter((g): g is G => !!g);
const DEV_CLOCK = '00:20';

const CLOSE = [
  { id: 'music', title: 'Music off, lights up', sub: 'Main room and the back bar' },
  { id: 'floor', title: 'Floor clear', sub: 'Toilets, smoking area, cloakroom' },
  { id: 'till', title: 'Till counted', sub: 'Count it twice, sign the slip' },
  { id: 'stock', title: 'Bar stock counted', sub: 'Running-low list sent' },
  { id: 'exits', title: 'Fire exits checked', sub: 'Closed and not blocked' },
  { id: 'locked', title: 'Doors locked', sub: 'Last person on the door' },
];

// ---------- tonight's state, shared by every mount ----------

const runningLate = new Set<string>();
const asked = new Map<string, string>();
const ticked = new Map<string, string>();
/** The made-up time the closing list starts at, and advances by a few minutes per tick. */
let closeClock = 4 * 60 + 41;

// ---------- helpers ----------

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const initials = (name: string) => { const w = name.split(' '); return (w[0]![0]! + (w.length > 1 ? w[w.length - 1]![0]! : '')).toUpperCase(); };
const first = (name: string) => name.split(' ')[0]!;
const pad = (n: number) => String(n).padStart(2, '0');
const hhmm = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
function enter(el: Element | null, from: Keyframe, ms = 200) {
  if (!el || reduced()) return;
  (el as HTMLElement).animate([from, { transform: 'none', opacity: 1 }], { duration: ms, easing: EASE });
}

const ICON = {
  lantern: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3.5h6M12 3.5V6M7.5 8.2 9 6h6l1.5 2.2v8.6L15 19H9l-1.5-2.2zM9.5 21h5"/><path class="lt-glow" d="M12 10.2c1.3 1.4 1.9 2.4 1.9 3.4a1.9 1.9 0 0 1-3.8 0c0-1 .6-2 1.9-3.4z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  ask: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
  check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8.4 6.4 11.5 12.8 4.6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  people: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
  door: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 4h3a2 2 0 0 1 2 2v14M2 20h3M13 20h9M10 12v.01M13 4.6V21l-8-1.5V5.6a2 2 0 0 1 1.6-2L13 2.5"/></svg>',
  list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
};

const TABS: { route: Route; label: string; icon: string }[] = [
  { route: '/door/late', label: 'Late', icon: ICON.clock },
  { route: '/promoters', label: 'Promoters', icon: ICON.people },
  { route: '/p/kai', label: 'Kai’s list', icon: ICON.list },
  { route: '/door/close', label: 'Closing', icon: ICON.lock },
];

const at = (s: Stage) => STAGES.indexOf(s);
/** Which pages exist at a stage. */
function routesAt(s: Stage): Route[] {
  const out: Route[] = [];
  if (at(s) >= at('late-phone')) out.push('/door/late');
  out.push('/promoters', '/p/kai');
  if (s === 'close') out.push('/door/close');
  return out;
}
const HOME: Record<Stage, Route> = {
  promoters: '/promoters', 'late-phone': '/door/late', 'late-flag': '/door/late', 'late-ask': '/door/late',
  'late-running': '/p/kai', 'late-shown': '/door/late', close: '/door/close',
};
export const url = 'localhost:4321/promoters';
/** The address bar: Kai's page is at his random link (lesson 3, part 2). */
const address = (r: Route) => `localhost:4321${r === '/p/kai' ? PROMOTERS.kai.link : r}`;

// ---------- the app ----------

export const lantern: MountApp = (el, initial) => {
  let stage: Stage = STAGES.includes(initial as Stage) ? (initial as Stage) : 'promoters';
  let route: Route = HOME[stage];
  let open: string | null = null;
  let openCard: Promoter | null = null;
  let toastTimer = 0;

  const root = document.createElement('div');
  root.className = 'lt';
  el.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);

  const phonesAtDoor = () => stage === 'late-phone' || stage === 'late-flag';
  const asks = () => at(stage) >= at('late-ask');
  const runs = () => at(stage) >= at('late-running');

  // ---------- pages ----------

  function head(title: string, sub: string, side = '') {
    return `<header class="lt-head">
      <span class="lt-brand"><span class="lt-lantern">${ICON.lantern}</span><span class="lt-brand-text"><b>${esc(title)}</b><span>${sub}</span></span></span>
      ${side}
    </header>`;
  }

  function promotersPage() {
    const total = all().length, plus = all().reduce((n, g) => n + g.plus, 0);
    const cards = (['kai', 'noor'] as Promoter[]).map((p) => {
      const list = of(p), lim = PROMOTERS[p].limit, pl = list.reduce((n, g) => n + g.plus, 0);
      const lateN = runs() ? list.filter((g) => runningLate.has(g.id)).length : 0;
      const isOpen = openCard === p;
      return `<li class="lt-card lt-p-${p}">
        <button type="button" class="lt-card-top" data-card="${p}" aria-expanded="${isOpen}">
          <span class="lt-av lt-av--l">${PROMOTERS[p].name[0]}</span>
          <span class="lt-card-who"><b>${PROMOTERS[p].name}</b><span>${PROMOTERS[p].link} · limit ${lim}</span></span>
          <span class="lt-card-n"><b>${list.length}</b><span>of ${lim}</span></span>
          <span class="lt-chev">${ICON.chev}</span>
        </button>
        <span class="lt-bar" aria-hidden="true"><i style="transform:scaleX(${(list.length / lim).toFixed(3)})"></i></span>
        <dl class="lt-card-stats">
          <div><dt>Guests</dt><dd>${list.length}</dd></div>
          <div><dt>Plus-ones</dt><dd>${pl}</dd></div>
          <div><dt>In</dt><dd>0</dd></div>
          ${lateN ? `<div class="lt-stat-late"><dt>Running late</dt><dd>${lateN}</dd></div>` : ''}
        </dl>
        ${isOpen ? `<ol class="lt-mini">${list.map((g) => `<li><span>${esc(g.name)}${g.plus ? ` <em>+${g.plus}</em>` : ''}</span><span class="lt-mono">${g.phone}</span></li>`).join('')}</ol>` : ''}
      </li>`;
    }).join('');
    return `${head('Promoters', 'Friday · doors 23:00', `<span class="lt-pill">Fri</span>`)}
      <div class="lt-scroll">
        <section class="lt-sum" aria-label="Friday so far">
          <div><b>${total}</b><span>guests</span></div>
          <div><b>${plus}</b><span>plus-ones</span></div>
          <div><b>0</b><span>in</span></div>
        </section>
        <ul class="lt-cards">${cards}</ul>
        <p class="lt-foot-note">Phone numbers show here and on each promoter’s own list. Never at the door.</p>
      </div>`;
  }

  function lateRow(g: G) {
    const p = PROMOTERS[g.by].name;
    const isOpen = open === g.id && phonesAtDoor();
    const flag = stage === 'late-flag';
    const runningTag = runs() && runningLate.has(g.id) ? `<span class="lt-tag lt-tag-late">${ICON.clock}Running late · ${p}</span>` : '';
    let side = '';
    if (phonesAtDoor()) side = `<span class="lt-phone${flag ? ' lt-flag' : ''}">${g.phone}</span>`;
    else if (asks()) {
      const when = asked.get(g.id);
      side = when
        ? `<span class="lt-asked">${ICON.check}Asked ${p} · ${when}</span>`
        : `<button type="button" class="lt-ask" data-ask="${g.id}">${ICON.ask}Ask ${p}</button>`;
    }
    return `<li class="lt-row lt-p-${g.by}${isOpen ? ' is-open' : ''}">
      <${phonesAtDoor() ? `button type="button" data-open="${g.id}" aria-expanded="${isOpen}"` : 'div'} class="lt-row-main">
        <span class="lt-av">${initials(g.name)}</span>
        <span class="lt-who"><b>${esc(g.name)}</b><span><i class="lt-dot"></i>Guest of ${p}${g.plus ? ` <em>+${g.plus}</em>` : ''}</span>${runningTag}</span>
        ${phonesAtDoor() ? side : ''}
      </${phonesAtDoor() ? 'button' : 'div'}>
      ${!phonesAtDoor() ? side : ''}
      ${isOpen ? `<a class="lt-call" href="#" data-call="${g.id}">${ICON.phone}<span>Call ${esc(first(g.name))}</span><span class="lt-mono">${g.phone}</span></a>` : ''}
      ${flag && g.id === late()[0]?.id ? '<span class="lt-flag-note">Your 13:20 rule: never at the door</span>' : ''}
    </li>`;
  }

  function latePage() {
    const list = late().sort((a, b) => Number(runs() && runningLate.has(b.id)) - Number(runs() && runningLate.has(a.id)));
    const lateN = runs() ? list.filter((g) => runningLate.has(g.id)).length : 0;
    return `${head('Late', `Door · not in by 00:00`, `<span class="lt-dev" title="The dev server runs on made-up guests, with its clock set to midnight">Dev data · ${DEV_CLOCK}</span>`)}
      <div class="lt-scroll">
        <p class="lt-section"><span>Promoter guests · ${list.length}</span>${lateN ? `<span class="lt-section-late">${lateN} running late</span>` : ''}</p>
        <ol class="lt-rows">${list.map(lateRow).join('')}</ol>
        <p class="lt-foot-note">${phonesAtDoor() ? 'Tap a guest, then Call.' : 'Tap Ask: the promoter calls their guest.'}</p>
      </div>`;
  }

  function kaiPage() {
    const list = of('kai');
    return `${head('Kai', `${PROMOTERS.kai.link} · Friday`, `<span class="lt-count"><b>${list.length}</b> / ${PROMOTERS.kai.limit}</span>`)}
      <div class="lt-scroll">
        <p class="lt-full">Your list for Friday is full.</p>
        ${runs() ? '<p class="lt-section"><span>Your guests</span><span class="lt-section-late">Running late</span></p>' : ''}
        <ol class="lt-rows">${list.map((g) => {
          const on = runningLate.has(g.id);
          return `<li class="lt-row lt-p-kai">
            <div class="lt-row-main">
              <span class="lt-av">${initials(g.name)}</span>
              <span class="lt-who"><b>${esc(g.name)}</b><span class="lt-mono">${g.phone}${g.plus ? ` <em>+${g.plus}</em>` : ''}</span></span>
            </div>
            ${runs() ? `<button type="button" class="lt-switch" role="switch" aria-checked="${on}" data-late="${g.id}" aria-label="${esc(g.name)} is running late"><span class="lt-switch-text">Running late</span><span class="lt-switch-track"><i></i></span></button>` : ''}
          </li>`;
        }).join('')}</ol>
      </div>`;
  }

  function closePage() {
    const done = CLOSE.filter((c) => ticked.has(c.id)).length;
    const all = done === CLOSE.length;
    return `${head('Closing', 'Door · Friday night', `<span class="lt-count"><b>${done}</b> / ${CLOSE.length}</span>`)}
      <div class="lt-scroll">
        <p class="lt-foot-note lt-close-hint">Sami ticks these at closing. The agent’s door check runs on made-up data, so tonight’s list starts empty.</p>
        <div class="lt-progress" aria-hidden="true"><i style="transform:scaleX(${(done / CLOSE.length).toFixed(3)})"></i></div>
        ${all ? `<div class="lt-locked" role="status">${ICON.lock}<span><b>Locked up · ${ticked.get('locked')}</b><span>Written to tonight’s log</span></span></div>` : ''}
        <ol class="lt-checks">${CLOSE.map((c) => {
          const when = ticked.get(c.id);
          return `<li><button type="button" class="lt-check" role="checkbox" aria-checked="${!!when}" data-tick="${c.id}">
            <span class="lt-box">${ICON.check}</span>
            <span class="lt-who"><b>${esc(c.title)}</b><span>${when ? `Ticked · ${when}` : esc(c.sub)}</span></span>
          </button></li>`;
        }).join('')}</ol>
      </div>`;
  }

  function tabs() {
    const have = routesAt(stage);
    const shown = TABS.filter((t) => have.includes(t.route));
    return `<nav class="lt-tabs" aria-label="Pages" style="--n:${shown.length}">${shown.map((t) => `<a href="#" class="lt-tab" data-route="${t.route}"${t.route === route ? ' aria-current="page"' : ''}>${t.icon}<span>${t.label}</span></a>`).join('')}</nav>`;
  }

  function render() {
    const page = route === '/promoters' ? promotersPage() : route === '/door/late' ? latePage() : route === '/p/kai' ? kaiPage() : closePage();
    const top = $('.lt-scroll')?.scrollTop ?? 0;
    const same = root.dataset.page === route;
    root.dataset.page = route;
    root.innerHTML = `<div class="lt-page">${page}</div>${tabs()}<div class="lt-toast" data-toast aria-live="polite"></div>`;
    if (same) { const sc = $('.lt-scroll'); if (sc) sc.scrollTop = top; }
  }

  function go(r: Route, tell = true) {
    if (!routesAt(stage).includes(r)) r = HOME[stage];
    route = r;
    open = null;
    render();
    enter($('.lt-page'), { opacity: 0, transform: 'translateY(6px)' }, 180);
    if (tell) el.dispatchEvent(new CustomEvent('v2:url', { bubbles: true, detail: address(r) }));
  }

  function toast(html: string) {
    const t = $('[data-toast]');
    if (!t) return;
    t.innerHTML = `<span>${html}</span>`;
    t.dataset.on = '';
    enter(t.firstElementChild, { opacity: 0, transform: 'translateY(8px)' }, 200);
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { delete t.dataset.on; t.innerHTML = ''; }, 2600);
  }

  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    // Look only inside the app: the page around it has data-* attributes of its own (the phone sheet's data-open).
    const t = { closest: <T extends HTMLElement>(sel: string) => { const el = target.closest<T>(sel); return el && root.contains(el) ? el : null; } };
    const tab = t.closest<HTMLElement>('[data-route]');
    if (tab) { e.preventDefault(); go(tab.dataset.route as Route); return; }
    const card = t.closest<HTMLElement>('[data-card]');
    if (card) { openCard = openCard === card.dataset.card ? null : (card.dataset.card as Promoter); render(); return; }
    const row = t.closest<HTMLElement>('[data-open]');
    if (row) { open = open === row.dataset.open ? null : row.dataset.open!; render(); enter($('.lt-call'), { opacity: 0, transform: 'translateY(-4px)' }, 180); return; }
    const call = t.closest<HTMLElement>('[data-call]');
    if (call) { e.preventDefault(); toast(`Calling ${esc(byId.get(call.dataset.call!)!.name)} <span class="lt-mono">(not really: made-up number)</span>`); return; }
    const ask = t.closest<HTMLElement>('[data-ask]');
    if (ask) {
      const g = byId.get(ask.dataset.ask!)!;
      asked.set(g.id, DEV_CLOCK);
      render();
      toast(`Sent to ${PROMOTERS[g.by].name}: please call ${esc(first(g.name))}`);
      return;
    }
    const sw = t.closest<HTMLElement>('[data-late]');
    if (sw) {
      const id = sw.dataset.late!;
      if (runningLate.has(id)) runningLate.delete(id); else runningLate.add(id);
      render();
      const g = byId.get(id)!;
      if (runningLate.has(id)) toast(g.late ? `The door sees ${esc(first(g.name))} as running late` : `${esc(first(g.name))} is marked running late`);
      return;
    }
    const tick = t.closest<HTMLElement>('[data-tick]');
    if (tick) {
      const id = tick.dataset.tick!;
      if (ticked.has(id)) ticked.delete(id);
      else { closeClock += 3 + Math.floor(Math.random() * 6); ticked.set(id, hhmm(closeClock)); }
      render();
      if (ticked.size === CLOSE.length) enter($('.lt-locked'), { opacity: 0, transform: 'translateY(6px)' }, 220);
    }
  });

  function enterStage(s: Stage) {
    stage = s;
    // The agent's own try at this stage: Kai marks Lea, so the door has one to show.
    if (s === 'late-running' || s === 'late-shown') { if (!runningLate.size) runningLate.add(late()[0]!.id); }
    go(HOME[s], false);
  }
  enterStage(stage);

  return {
    set(next: string) {
      if (!STAGES.includes(next as Stage) || next === stage) return;
      enterStage(next as Stage);
      el.dispatchEvent(new CustomEvent('v2:url', { bubbles: true, detail: address(route) }));
    },
    destroy() { clearTimeout(toastTimer); root.remove(); },
  };
};

export const app = lantern;
