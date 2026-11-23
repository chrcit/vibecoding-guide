/*
 * Payouts: what each promoter is owed for last Friday. €5 a person in, plus-ones count, no-shows
 * don't. From 'payouts-why' refunds don't count either and every guest row says why; at
 * 'payouts-broken' (mid-refactor) plus-ones are counted twice and the lesson marks the totals.
 */
import { LIST_LABEL, PAYOUT_GUESTS, PAYOUT_NIGHT, RATE, type PayoutGuest, type Promoter } from './data';
import { enter, esc, euro, ICON, initials, plural } from './ui';
import { emptyState, marker, type Ctx, type Screen } from './ctx';

interface Sum { guests: number; plus: number; people: number; total: number; noShows: number; refunded: number }

const counts = (c: Ctx, g: PayoutGuest) => !!g.in && !(c.f.why && g.refunded);
const plusOf = (c: Ctx, g: PayoutGuest) => g.plus * (c.f.broken ? 2 : 1);

function sum(c: Ctx, p: Promoter): Sum {
  const rows = PAYOUT_GUESTS[p];
  const inRows = rows.filter((g) => counts(c, g));
  const guests = inRows.length;
  const plus = inRows.reduce((n, g) => n + plusOf(c, g), 0);
  return {
    guests, plus, people: guests + plus, total: (guests + plus) * RATE,
    noShows: rows.filter((g) => !g.in).length,
    refunded: c.f.why ? rows.filter((g) => g.in && g.refunded).length : 0,
  };
}

function guestRow(c: Ctx, g: PayoutGuest) {
  const ok = counts(c, g);
  const amount = ok ? (1 + plusOf(c, g)) * RATE : 0;
  let line: string, state: 'in' | 'out' | 'refund';
  if (!g.in) { state = 'out'; line = c.f.why ? 'No-show · doesn’t count' : 'No-show'; }
  else if (c.f.why && g.refunded) { state = 'refund'; line = `Turned away ${g.refunded} · refunded`; }
  else { state = 'in'; line = `In ${g.in}${c.f.why ? ' · counts' : ''}`; }
  return `<li class="st-pg" data-state="${state}">
    <span class="st-pg-who"><span class="st-pg-name">${esc(g.name)}${g.plus ? `<span class="st-plus">+${g.plus}</span>` : ''}</span><span class="st-pg-why">${line}</span></span>
    <span class="st-pg-amt">${ok ? euro(amount) : '—'}</span>
  </li>`;
}

function card(c: Ctx, p: Promoter) {
  const s = sum(c, p);
  const open = c.ui.open.has(p);
  const rows = PAYOUT_GUESTS[p];
  const broken = c.f.broken;
  const name = LIST_LABEL[p];
  return `<section class="st-card st-promo st-l-${p}${open ? ' is-open' : ''}" aria-label="${esc(name)}">
    <button type="button" class="st-promo-head" data-promo="${p}" aria-expanded="${open}" aria-controls="st-pg-${p}">
      <span class="st-av" aria-hidden="true">${initials(name)}</span>
      <span class="st-promo-who"><b>${esc(name)}</b><span>${plural(rows.length, 'name')} on the list</span></span>
      <span class="st-promo-total"><b${broken ? ' class="is-wrong"' : ''}>${euro(s.total)}</b><span>${plural(s.people, 'person', 'people')} in</span></span>
      <span class="st-chev" aria-hidden="true">${ICON.chev}</span>
    </button>
    ${broken ? `<span class="st-wrong" role="note">Doesn’t add up</span>` : ''}
    <dl class="st-sum">
      <div><dt>Guests in</dt><dd>${s.guests}</dd></div>
      <div${broken ? ' class="st-marker st-marker--tight"' : ''}><dt>Plus-ones</dt><dd>${s.plus}</dd>${broken && p === 'kai' ? marker('the break, made up') : ''}</div>
      <div><dt>${c.f.why ? 'Not paid' : 'No-shows'}</dt><dd>${s.noShows + s.refunded}</dd></div>
      <div><dt>× ${euro(RATE)}</dt><dd>${euro(s.total)}</dd></div>
    </dl>
    <ol class="st-pgs" id="st-pg-${p}"${open ? '' : ' hidden'}>${open ? rows.map((g) => guestRow(c, g)).join('') : ''}</ol>
  </section>`;
}

export const payouts: Screen = {
  title: 'Payouts',
  html(c) {
    if (c.f.bea) return emptyState(ICON.lock, 'Owners only', 'Payouts show what each promoter is owed. Bea’s account can’t see them.');
    if (!c.f.payouts) return emptyState(ICON.wrench, 'Not built yet', 'Promoter payouts will live here: guests in, plus-ones and what each promoter is owed.');
    const k = sum(c, 'kai'), n = sum(c, 'noor');
    return `<div class="st-pay-top">
        <div><p class="st-over">${PAYOUT_NIGHT}</p><p class="st-pay-total${c.f.broken ? ' is-wrong' : ''}">${euro(k.total + n.total)}</p><p class="st-muted">to pay · ${plural(k.people + n.people, 'person', 'people')} in on 2 lists</p></div>
        <span class="st-rate">${euro(RATE)}<small>a person</small></span>
      </div>
      ${card(c, 'kai')}${card(c, 'noor')}`;
  },
  foot(c) {
    if (c.f.bea || !c.f.payouts) return '';
    return `<p class="st-rule"><b>The rule</b> €5 per person in, plus-ones count, no-shows don’t${c.f.why ? ', refunds don’t' : ''}.</p>`;
  },
  click(c, t) {
    const h = t.closest<HTMLElement>('[data-promo]');
    if (!h) return;
    const p = h.dataset.promo as Promoter;
    if (c.ui.open.has(p)) c.ui.open.delete(p); else c.ui.open.add(p);
    c.paint({ foot: false });
    c.root.querySelector<HTMLElement>(`[data-promo="${p}"]`)?.focus({ preventScroll: true });
    if (c.ui.open.has(p)) c.root.querySelectorAll(`#st-pg-${p} > li`).forEach((li, i) => { if (i < 10) enter(li, { transform: 'translateY(-4px)', opacity: 0 }, 200, i * 14); });
    return true;
  },
};
