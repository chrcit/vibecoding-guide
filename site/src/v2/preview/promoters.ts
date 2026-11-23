/*
 * Promoter links and the Promoters page, as the agent builds them in lessons 3 and 4. Real pages:
 * a promoter adds guests through their own link until their limit, the owner sees every list and
 * changes the limits. Built for a phone held at a club on a Friday: the count is the headline, the
 * spots are pips that fill, and the add form sits in the thumb zone.
 *
 * Stages, in story order:
 *   'none'          nothing at /p/7 yet (lesson 3, part 1)
 *   'kai-new'       Kai's link, empty: add guests until 20, the 21st is refused
 *   'kai-full'      the agent's test filled it: 20 of 20
 *   'leak'          Noor's list opened with Kai's link changed by one character (part 2's failing test)
 *   'sealed'        the same changed link after the fix
 *   'noor'          Noor's own list, at her random link
 *   'overview'      the owner's Promoters page: guests, limit, plus-ones, arrived (part 3)
 *   'overview-look' the same, with the 9 plus-ones you noticed marked
 *   'over'          plus-ones count: Kai is 29 on 20 (part 4)
 *   'capped'        over-limit lists closed to new guests, the guests on them kept
 *   'noor-heads'    Noor's page once plus-ones count (lesson 4, part 2)
 *   'noor-phone'    Noor's page with a phone field and remove buttons
 *
 * Who was added lives in ./lantern/store.ts, shared with the door. Everything here is made up.
 */
import './lantern/lantern.css';
import type { MountApp } from './index';
import { PROMOTERS, guestsOf, heads, addGuest, removeGuest, limitOf, setLimit, useSeed, type PromoterId, type PGuest } from './lantern/store';
import { esc, initials, enter, shake, hhmm, clock, ICON, brand, notFound } from './lantern/ui';

export const url = 'localhost:4321/p/7';

interface Stage {
  view: 'none' | 'page' | 'sealed' | 'overview';
  p?: PromoterId;
  /** The agent's seed data is in (false: the page before the test run). */
  seed?: boolean;
  /** Plus-ones count toward the limit. */
  heads?: boolean;
  /** Lists over the limit are closed to new guests. */
  capped?: boolean;
  leak?: boolean;
  phone?: boolean;
  remove?: boolean;
  look?: boolean;
  /** Links are the long random ones (after lesson 3, part 2). */
  token?: boolean;
}
const STAGES: Record<string, Stage> = {
  none: { view: 'none', p: 'kai', seed: false },
  'kai-new': { view: 'page', p: 'kai', seed: false },
  'kai-full': { view: 'page', p: 'kai' },
  leak: { view: 'page', p: 'noor', leak: true },
  sealed: { view: 'sealed' },
  noor: { view: 'page', p: 'noor', token: true },
  overview: { view: 'overview', token: true },
  'overview-look': { view: 'overview', token: true, look: true },
  over: { view: 'overview', token: true, heads: true },
  capped: { view: 'overview', token: true, heads: true, capped: true },
  'noor-heads': { view: 'page', p: 'noor', token: true, heads: true, capped: true },
  'noor-phone': { view: 'page', p: 'noor', token: true, heads: true, capped: true, phone: true, remove: true },
};

const now = clock(11 * 60 + 52);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export const app: MountApp = (el, initial) => {
  let key = STAGES[initial] ? initial : 'kai-new';
  let st = STAGES[key]!;
  let plus = 0;
  let draft = { name: '', phone: '' };
  let msg: { text: string; tone?: 'bad' | 'ok' } = { text: '' };
  let fresh = '';

  const root = document.createElement('div');
  root.className = 'ln';
  el.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);

  const linkOf = (p: PromoterId) => (st.token ? `p/${PROMOTERS[p].token}` : `p/${PROMOTERS[p].num}`);
  const countOf = (gs: PGuest[]) => (st.heads ? heads(gs) : gs.length);

  // ---------- a promoter's page ----------

  function pips(gs: PGuest[], limit: number) {
    const marks: string[] = [];
    for (const g of [...gs].reverse()) {
      marks.push(`g${g.id === fresh ? '!' : ''}`);
      if (st.heads) for (let i = 0; i < g.plus; i++) marks.push(`p${g.id === fresh ? '!' : ''}`);
    }
    const total = Math.max(limit, marks.length);
    let out = '';
    for (let i = 0; i < total; i++) {
      const m = marks[i];
      const s = !m ? '' : i >= limit ? 'over' : m[0];
      out += `<i${s ? ` data-s="${s}"` : ''}${m?.endsWith('!') ? ' data-new' : ''}></i>`;
    }
    return out;
  }

  function rowHtml(g: PGuest) {
    const meta = [`<span>added ${esc(g.at)}</span>`];
    if (g.plus) meta.unshift(`<span class="pr-plus">+${g.plus}</span>`);
    if (st.phone && g.phone) meta.push(`<span class="pr-phone">${esc(g.phone)}</span>`);
    return `<li class="pr-row ln-k-${g.by}" data-id="${g.id}"${g.id === fresh ? ' data-new' : ''}>
      <span class="pr-av" aria-hidden="true">${esc(initials(g.name))}</span>
      <span class="pr-who"><span class="pr-name">${esc(g.name)}</span><span class="pr-meta">${meta.join('')}</span></span>
      ${st.remove ? `<button type="button" class="pr-x ln-press" data-remove="${g.id}" aria-label="Remove ${esc(g.name)}">${ICON.x}</button>` : ''}
    </li>`;
  }

  function page() {
    const p = st.p!;
    const pr = PROMOTERS[p];
    const gs = guestsOf(p, st.seed !== false);
    const limit = limitOf(p);
    const n = countOf(gs);
    const left = limit - n;
    const over = n > limit;
    const full = !st.leak && left <= 0;
    const unit = st.heads ? 'people' : 'guests';
    const leftText = over ? `Over by ${n - limit} · closed to new guests` : left <= 0 ? 'Your list for tonight is full' : `${plural(left, 'spot')} left${st.heads ? ' · a plus-one takes a spot' : ''}`;
    root.className = 'ln';
    root.innerHTML = `
      ${st.leak ? '<div class="pr-leak" aria-hidden="true"><span>Opened with Kai’s link, one character changed · the leak, made up</span></div>' : ''}
      <header class="ln-head">${brand(`${pr.name}’s list`, 'The Lantern · Friday', `ln-k-${p}`)}<span class="ln-tag ln-k-${p}"><i></i>${esc(linkOf(p))}</span></header>
      <div class="ln-body"><div class="ln-col">
        <section class="pr-cap ln-k-${p}" aria-label="How full the list is">
          <p class="pr-count"><b data-count>${n}</b><span>of ${limit} ${unit}</span></p>
          <p class="pr-left" data-tone="${over ? 'over' : left <= 0 ? 'full' : ''}">${esc(leftText)}</p>
          <div class="pr-pips" aria-hidden="true">${pips(gs, limit)}</div>
        </section>
        <section class="pr-list" aria-label="Your guests">
          <div class="pr-list-head"><span class="ln-label">${st.leak ? 'Guests on this list' : 'Your guests'}</span><span>${plural(gs.length, 'guest')}${st.heads ? ` · ${plural(gs.reduce((a, g) => a + g.plus, 0), 'plus-one')}` : ''}</span></div>
          ${gs.length ? `<ol>${gs.map(rowHtml).join('')}</ol>` : '<p class="pr-empty">No guests yet. Add the first one below: they’ll be on the door list tonight.</p>'}
        </section>
      </div></div>
      ${st.leak ? '' : `<div class="pr-foot"><div class="ln-col">${full ? fullNotice(over, n - limit) : form(left)}</div></div>`}`;
    fresh = '';
  }

  function fullNotice(over: boolean, by: number) {
    return over
      ? `<div class="pr-full" data-tone="over" role="status">${ICON.lock}<div><b>Closed to new guests</b><span>Your list is over the limit by ${plural(by, 'person', 'people')}, plus-ones included. Everyone on it stays. Ask the club if you need more room.</span></div></div>`
      : `<div class="pr-full" role="status">${ICON.full}<div><b>Your list for tonight is full</b><span>Ask the club if you need more room.</span></div></div>`;
  }

  function form(left: number) {
    const maxPlus = st.heads ? Math.max(0, Math.min(2, left - 1)) : 2;
    if (plus > maxPlus) plus = maxPlus;
    return `<form class="pr-form" data-form novalidate>
      <label class="pr-field" data-field="name"><span class="ln-vh">Guest’s name</span><input name="name" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="${st.phone ? 'next' : 'done'}" placeholder="Guest’s full name" value="${esc(draft.name)}"></label>
      ${st.phone ? `<label class="pr-field" data-field="phone"><span class="ln-vh">Phone number</span><input name="phone" type="tel" inputmode="tel" autocomplete="off" enterkeyhint="done" placeholder="Phone number" value="${esc(draft.phone)}"><span class="pr-field-note">never shown at the door</span></label>` : ''}
      <div class="pr-line">
        <div class="pr-seg" role="group" aria-label="Plus-ones">${[0, 1, 2].map((k) => `<button type="button" class="ln-press" data-plus="${k}" aria-pressed="${plus === k}"${k > maxPlus ? ' disabled' : ''}>${k ? `+${k}` : 'Alone'}</button>`).join('')}</div>
        <button type="submit" class="pr-add ln-press">Add guest</button>
      </div>
      <p class="pr-msg" data-msg${msg.tone ? ` data-tone="${msg.tone}"` : ''} aria-live="polite">${esc(msg.text)}</p>
    </form>`;
  }

  function submit() {
    const p = st.p!;
    const name = draft.name.trim().replace(/\s+/g, ' ');
    const gs = guestsOf(p, st.seed !== false);
    const left = limitOf(p) - countOf(gs);
    if (name.length < 2) { msg = { text: 'Type the guest’s full name.', tone: 'bad' }; return paint(true, 'name'); }
    if (gs.some((g) => g.name.toLowerCase() === name.toLowerCase())) { msg = { text: `${name} is already on your list.`, tone: 'bad' }; return paint(true, 'name'); }
    const digits = draft.phone.replace(/\D/g, '');
    if (st.phone && digits.length < 7) { msg = { text: 'Add a phone number, so the club can reach them.', tone: 'bad' }; return paint(true, 'phone'); }
    const need = st.heads ? 1 + plus : 1;
    if (need > left) { msg = { text: 'Your list for tonight is full.', tone: 'bad' }; return paint(true, 'name'); }
    const g = addGuest(p, name, plus, st.phone ? draft.phone.trim() : '', hhmm(now()));
    fresh = g.id;
    draft = { name: '', phone: '' };
    plus = 0;
    msg = { text: `${name} is on tonight’s door list.`, tone: 'ok' };
    paint(false);
    enter($('[data-count]'), { transform: 'translateY(30%)', opacity: 0 }, 220);
    $<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
  }

  // ---------- the Promoters page ----------

  function overview() {
    const ids: PromoterId[] = ['kai', 'noor'];
    const all = ids.map((p) => ({ p, gs: guestsOf(p), limit: limitOf(p) }));
    const guests = all.reduce((a, x) => a + x.gs.length, 0);
    const plusOnes = all.reduce((a, x) => a + x.gs.reduce((b2, g) => b2 + g.plus, 0), 0);
    root.className = 'ln ln--wide';
    root.innerHTML = `
      <header class="ln-head">${brand('Promoters', 'The Lantern · Friday')}<span class="ln-tag"><i></i>Doors 23:00</span></header>
      <div class="ln-body"><div class="ln-wide">
        <div class="po-sum">
          <div><b>${guests}</b><span>guests</span></div>
          <div><b>${plusOnes}</b><span>plus-ones</span></div>
          <div><b>0</b><span>arrived</span></div>
        </div>
        <div class="po-cards">${all.map(card).join('')}</div>
      </div></div>`;
  }

  function card({ p, gs, limit }: { p: PromoterId; gs: PGuest[]; limit: number }) {
    const pr = PROMOTERS[p];
    const plusOnes = gs.reduce((a, g) => a + g.plus, 0);
    const n = countOf(gs);
    const over = n > limit;
    const peopleN = gs.length + plusOnes;
    const badge = over ? `<span class="po-badge">${st.capped ? 'Closed' : `Over by ${n - limit}`}</span>` : n >= limit ? '<span class="po-badge" data-tone="full">Full</span>' : '';
    const look = st.look && p === 'kai';
    const scale = Math.max(limit, peopleN);
    const gPart = Math.min(gs.length, scale) / scale;
    const pPart = Math.min(plusOnes, scale) / scale;
    return `<article class="po-card ln-k-${p}"${over ? ' data-over' : ''}>
      <div class="po-top"><span class="pr-av" aria-hidden="true">${esc(initials(pr.name))}</span><b>${esc(pr.name)}</b>${badge}</div>
      <p class="po-link">${esc(linkOf(p))}</p>
      <div class="po-stats">
        <div class="po-stat"${over ? ' data-tone="over"' : ''}><b>${n}<small> / ${limit}</small></b><span>${st.heads ? 'people' : 'guests'}</span></div>
        <div class="po-stat"${look ? ' data-look' : ''}><b>${plusOnes}</b><span>plus-ones</span>${look ? `<span class="po-look">${peopleN} people</span>` : ''}</div>
        <div class="po-stat"><b>0</b><span>arrived</span></div>
      </div>
      <div class="po-bar" aria-hidden="true"><i style="flex:0 0 ${(gPart * 100).toFixed(1)}%"></i><i style="flex:0 0 ${((st.heads ? pPart : 0) * 100).toFixed(1)}%"></i></div>
      ${over && st.capped ? `<p class="po-note">Closed to new guests until ${plural(n - limit, 'person drops', 'people drop')} out. Everyone on the list stays.</p>` : ''}
      <div class="po-limit"><span>Limit</span><button type="button" class="po-step ln-press" data-limit="${p}" data-d="-1" aria-label="Lower ${esc(pr.name)}’s limit">−</button><output aria-live="polite">${limit}</output><button type="button" class="po-step ln-press" data-limit="${p}" data-d="1" aria-label="Raise ${esc(pr.name)}’s limit">+</button></div>
    </article>`;
  }

  // ---------- painting and events ----------

  function paint(keepFocus = false, focus?: string) {
    const active = document.activeElement as HTMLElement | null;
    const hadFocus = keepFocus && active && root.contains(active) ? (active as HTMLInputElement).name : '';
    const scroll = $('.ln-body')?.scrollTop ?? 0;
    if (st.view === 'none') notFound(root, `/${linkOf('kai')}`);
    else if (st.view === 'sealed') {
      root.className = 'ln';
      root.innerHTML = `<header class="ln-head">${brand('The Lantern', 'Promoter link')}</header>
        <div class="pr-sealed" role="status">${ICON.link}<b>This link doesn’t open a list.</b><span>Check the link the club sent you, or ask them for a new one.</span></div>`;
    } else if (st.view === 'overview') overview();
    else page();
    const body = $('.ln-body');
    if (body) body.scrollTop = scroll;
    if (focus) { const f = $(`[data-field="${focus}"]`); f?.toggleAttribute('data-bad', true); shake(f); $<HTMLInputElement>(`input[name="${focus}"]`)?.focus({ preventScroll: true }); }
    else if (hadFocus) $<HTMLInputElement>(`input[name="${hadFocus}"]`)?.focus({ preventScroll: true });
  }

  root.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'name' || t.name === 'phone') {
      draft[t.name] = t.value;
      t.closest('[data-field]')?.removeAttribute('data-bad');
      if (msg.tone === 'bad') { msg = { text: '' }; const m = $('[data-msg]'); if (m) { m.textContent = ''; m.removeAttribute('data-tone'); } }
    }
  });
  root.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  root.addEventListener('keydown', (e) => {
    const t = e.target as HTMLInputElement;
    if (e.key === 'Enter' && t.name === 'name' && st.phone) { e.preventDefault(); $<HTMLInputElement>('input[name="phone"]')?.focus(); }
  });
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const pb = t.closest<HTMLButtonElement>('[data-plus]');
    if (pb && !pb.disabled) {
      plus = Number(pb.dataset.plus);
      for (const b of root.querySelectorAll<HTMLElement>('[data-plus]')) b.setAttribute('aria-pressed', String(b === pb));
      return;
    }
    const rm = t.closest<HTMLElement>('[data-remove]');
    if (rm) {
      const row = rm.closest<HTMLElement>('.pr-row');
      const name = row?.querySelector('.pr-name')?.textContent ?? 'Guest';
      removeGuest(rm.dataset.remove!);
      msg = { text: `${name} is off your list.` };
      paint();
      return;
    }
    const lim = t.closest<HTMLElement>('[data-limit]');
    if (lim) { const p = lim.dataset.limit as PromoterId; setLimit(p, limitOf(p) + Number(lim.dataset.d)); paint(); }
  });

  function enterStage(next: string) {
    key = STAGES[next] ? next : 'kai-new';
    st = STAGES[key]!;
    useSeed(st.seed === false ? 'empty' : 'seeded');
    msg = { text: '' };
    plus = 0;
    paint();
  }
  enterStage(key);

  return {
    set(next: string) { if (next !== key) enterStage(next); },
    destroy() { root.remove(); },
  };
};
