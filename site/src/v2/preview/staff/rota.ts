/*
 * Rota: tonight's shifts. From lesson 16 staff can ask to swap.
 *   'swap-open' (the reviewer's finding): the request takes any shift id, so Bea can pick Sami's
 *     shift and hand it to someone else without Sami. The lesson marks Sami's shift.
 *   'swap' (fixed): Bea can only offer her own shift; she picks who to ask, and that person
 *     accepts or declines on their phone ("Open Sami's phone" stands in for it). Accepting moves
 *     both shifts.
 */
import { BEA_SHIFT, SAMI_SHIFT, SHIFTS, type Shift } from './data';
import { acceptSwap, beasShift, holder, hhmm, now, swap } from './state';
import { enter, esc, firstName, ICON, initials } from './ui';
import { marker, type Ctx, type Person, type Screen } from './ctx';

const BEA = 'Bea Lindqvist';
const shiftOf = (id: string) => SHIFTS.find((s) => s.id === id)!;
const time = (s: Shift) => `${s.from}–${s.to}`;
const roleHue = (role: string) => (role === 'Bar' ? 'bar' : role === 'Door' || role === 'Security' ? 'door' : 'floor');

/** Who the reader is on the rota: Bea, or the person she asked when "their phone" is open. */
export function rotaPerson(c: Ctx): Person | null {
  const s = swap.current;
  if (!c.ui.rota.asOther || !s || s.status !== 'pending') return null;
  const who = holder.get(s.to)!;
  const role = shiftOf(s.to).role;
  return { name: who, label: `${firstName(who)} · ${role}`, short: firstName(who), initials: initials(who) };
}

function selectable(c: Ctx, id: string) {
  const m = c.ui.rota.mode;
  if (m === 'from') return true;
  // Ask someone else: never the shift being given, nor a shift of your own.
  if (m === 'to') return id !== c.ui.rota.from && holder.get(id) !== BEA;
  return false;
}

function row(c: Ctx, s: Shift, meName: string) {
  const who = holder.get(s.id)!;
  const mine = who === meName;
  const m = c.ui.rota.mode;
  const sel = selectable(c, s.id);
  const picked = (m === 'from' && c.ui.rota.from === s.id) || (m === 'to' && c.ui.rota.to === s.id);
  const giving = m === 'to' && c.ui.rota.from === s.id;
  const moved = swap.current?.status === 'accepted' && (swap.current.from === s.id || swap.current.to === s.id);
  const marked = c.f.swap === 'open' && m === 'from' && s.id === SAMI_SHIFT;
  const tags = [
    mine ? '<span class="st-tag st-tag--you">You</span>' : '',
    giving ? '<span class="st-tag st-tag--give">Swapping</span>' : '',
    moved && !giving ? '<span class="st-tag st-tag--moved">Swapped</span>' : '',
  ].join('');
  const inner = `
    <span class="st-av" aria-hidden="true">${initials(who)}</span>
    <span class="st-shift-who">
      <span class="st-shift-name">${esc(who)}${tags}</span>
      <span class="st-shift-meta"><i class="st-role st-role--${roleHue(s.role)}"></i>${esc(s.role)}<span class="st-shift-time">${time(s)}</span></span>
      ${marked ? marker('anyone’s shift, made up') : ''}
    </span>
    ${sel ? `<span class="st-radio" aria-hidden="true">${picked ? ICON.check : ''}</span>` : ''}`;
  const cls = `st-shift${picked ? ' is-picked' : ''}${giving ? ' is-giving' : ''}${marked ? ' st-marker' : ''}`;
  return `<li data-key="${s.id}">${sel
    ? `<button type="button" class="${cls}" data-shift="${s.id}" role="radio" aria-checked="${picked}">${inner}</button>`
    : `<div class="${cls}">${inner}</div>`}</li>`;
}

export const rota: Screen = {
  title: 'Rota',
  html(c) {
    const other = rotaPerson(c);
    const meName = other ? other.name : c.f.bea ? BEA : '';
    const s = swap.current;
    let top = '';
    if (other && s) {
      const from = shiftOf(s.from), to = shiftOf(s.to);
      const fromWho = holder.get(s.from)!;
      const theirs = fromWho === BEA ? 'her' : `${esc(firstName(fromWho))}’s`;
      top = `<div class="st-phone-note">${esc(firstName(other.name))}’s phone · made up</div>
        <section class="st-card st-request" aria-label="Swap request">
          <p class="st-request-k">${ICON.swap}Swap request · ${hhmm(s.at)}</p>
          <p class="st-request-t"><b>Bea</b> asks to swap ${theirs} <b>${esc(from.role)} ${time(from)}</b> for your <b>${esc(to.role)} ${time(to)}</b>.</p>
          <div class="st-request-actions">
            <button type="button" class="st-btn st-btn--ghost" data-decline>Decline</button>
            <button type="button" class="st-btn st-btn--primary" data-accept>Accept</button>
          </div>
        </section>`;
    }
    const m = c.ui.rota.mode;
    const prompt = m === 'from' ? 'Pick the shift to swap' : m === 'to' ? `Who should take ${c.ui.rota.from === beasShift() ? 'your' : `${esc(firstName(holder.get(c.ui.rota.from!)!))}’s`} shift?` : '';
    return `${top}<div class="st-h"><h2>${prompt || 'Tonight · Fri'}</h2><span>${m === 'from' ? 'Step 1 of 2' : m === 'to' && c.f.swap === 'open' ? 'Step 2 of 2' : m === 'to' ? `Yours: ${esc(shiftOf(c.ui.rota.from!).role)} ${time(shiftOf(c.ui.rota.from!))}` : `${SHIFTS.length} shifts`}</span></div>
      <ul class="st-shifts"${m !== 'idle' ? ` role="radiogroup" aria-label="${prompt}"` : ''} data-shifts>${SHIFTS.map((x) => row(c, x, meName)).join('')}</ul>
      ${!c.f.swap ? '<p class="st-foot-note">Swaps aren’t in the app yet. Ask the owner.</p>' : ''}`;
  },
  foot(c) {
    if (!c.f.swap) return '';
    if (!c.f.bea) return '<p class="st-dock-note">Staff ask for swaps from their own phones. You see each one here when it’s accepted.</p>';
    if (rotaPerson(c)) return `<div class="st-actions"><button type="button" class="st-btn st-btn--ghost st-btn--wide" data-back-bea>Back to Bea’s phone</button></div>`;
    const m = c.ui.rota.mode;
    const s = swap.current;
    if (m === 'from') {
      return `<div class="st-actions"><button type="button" class="st-btn st-btn--ghost" data-cancel>Cancel</button><button type="button" class="st-btn st-btn--primary" data-next${c.ui.rota.from ? '' : ' disabled'}>Next</button></div>`;
    }
    if (m === 'to') {
      const to = c.ui.rota.to;
      return `<div class="st-actions"><button type="button" class="st-btn st-btn--ghost" data-cancel>${c.f.swap === 'open' ? 'Back' : 'Cancel'}</button><button type="button" class="st-btn st-btn--primary" data-send${to ? '' : ' disabled'}>${to ? `Ask ${esc(firstName(holder.get(to)!))}` : 'Pick someone'}</button></div>`;
    }
    if (s?.status === 'pending') {
      const asked = firstName(holder.get(s.to)!);
      return `<div class="st-wait" role="status">
          <span class="st-wait-dot" aria-hidden="true"></span>
          <span class="st-wait-text"><b>Waiting for ${esc(asked)}</b><span>Sent ${hhmm(s.at)} · ${esc(shiftOf(s.from).role)} ↔ ${esc(shiftOf(s.to).role)}</span></span>
          <button type="button" class="st-btn st-btn--quiet" data-withdraw>Withdraw</button>
        </div>
        <button type="button" class="st-demo" data-as-other>${ICON.swap}Open ${esc(asked)}’s phone <span>made up</span></button>`;
    }
    return `<div class="st-actions"><button type="button" class="st-btn st-btn--primary st-btn--wide" data-ask>${ICON.swap}Ask to swap</button></div>`;
  },
  click(c, t) {
    const r = c.ui.rota;
    const pick = t.closest<HTMLElement>('[data-shift]');
    if (pick) {
      if (r.mode === 'from') r.from = pick.dataset.shift!;
      else if (r.mode === 'to') r.to = pick.dataset.shift!;
      c.paint();
      c.root.querySelector<HTMLElement>(`[data-shift="${pick.dataset.shift}"]`)?.focus({ preventScroll: true });
      return true;
    }
    if (t.closest('[data-ask]')) {
      if (c.f.swap === 'open') Object.assign(r, { mode: 'from', from: null, to: null });
      else Object.assign(r, { mode: 'to', from: beasShift(), to: null });
      c.paint();
      return true;
    }
    if (t.closest('[data-next]')) { if (r.from) { r.mode = 'to'; r.to = null; c.paint(); } return true; }
    if (t.closest('[data-cancel]')) {
      if (r.mode === 'to' && c.f.swap === 'open') r.mode = 'from';
      else Object.assign(r, { mode: 'idle', from: null, to: null });
      c.paint();
      return true;
    }
    if (t.closest('[data-send]')) {
      if (!r.from || !r.to) return true;
      swap.current = { from: r.from, to: r.to, by: 'Bea', status: 'pending', at: now() };
      const asked = firstName(holder.get(r.to)!);
      Object.assign(r, { mode: 'idle', from: null, to: null });
      c.paint();
      enter(c.root.querySelector('.st-wait'), { transform: 'translateY(8px)', opacity: 0 }, 220);
      c.announce(`Swap request sent to ${asked}.`);
      return true;
    }
    if (t.closest('[data-withdraw]')) {
      swap.current = null;
      c.paint();
      c.toast({ text: 'Request withdrawn', ms: 2200 });
      c.announce('Swap request withdrawn.');
      return true;
    }
    if (t.closest('[data-as-other]')) { r.asOther = true; c.paint(); return true; }
    if (t.closest('[data-back-bea]')) { r.asOther = false; c.paint(); return true; }
    const s = swap.current;
    if (s && t.closest('[data-accept]')) {
      const asked = firstName(holder.get(s.to)!);
      acceptSwap(s);
      r.asOther = false;
      c.paint();
      for (const id of [s.from, s.to]) enter(c.root.querySelector(`[data-key="${id}"]`), { transform: 'translateX(-8px)', opacity: 0 }, 240);
      c.toast({ kind: 'ok', text: `${asked} accepted`, sub: 'Both shifts moved', ms: 3600 });
      c.announce(`${asked} accepted. Both shifts moved.`);
      return true;
    }
    if (s && t.closest('[data-decline]')) {
      const asked = firstName(holder.get(s.to)!);
      s.status = 'declined';
      swap.current = null;
      r.asOther = false;
      c.paint();
      c.toast({ kind: 'note', text: `${asked} declined`, sub: 'Nothing moved', ms: 3200 });
      c.announce(`${asked} declined. Nothing moved.`);
      return true;
    }
  },
};

/** When the lesson arrives at a swap stage, show the step it talks about, unless the reader already made a swap. */
export function enterRota(c: Ctx) {
  const r = c.ui.rota;
  r.asOther = false;
  const s = swap.current;
  if (s && (s.status === 'pending' || s.status === 'accepted')) { Object.assign(r, { mode: 'idle', from: null, to: null }); return; }
  if (c.f.swap === 'open') Object.assign(r, { mode: 'from', from: SAMI_SHIFT, to: null });
  else if (c.f.swap === 'fixed') {
    const from = beasShift();
    Object.assign(r, { mode: 'to', from, to: from !== SAMI_SHIFT && from === BEA_SHIFT ? SAMI_SHIFT : null });
  } else Object.assign(r, { mode: 'idle', from: null, to: null });
}
