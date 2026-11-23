/*
 * Bar: "Running low" is one tap per item per night; whoever taps it puts it on tomorrow's order,
 * and the tile says who and when. A second tap doesn't list it twice. From 'bar-ale' Ginger beer
 * is Ginger ale with its taps (they're stored by item id); from 'bar-sorted' the most-tapped items
 * come first. From the preview stages on, a Stock view counts what's behind the bar.
 */
import { BAR, type BarItem } from './data';
import { hhmm, now, stock, taps } from './state';
import { enter, esc, flip, ICON, measure, nudge, plural } from './ui';
import type { Ctx, Screen } from './ctx';

const nameOf = (c: Ctx, b: BarItem) => (b.id === 'ginger' && c.f.ale ? 'Ginger ale' : b.name);
const score = (b: BarItem) => b.lastWeek + (taps.has(b.id) ? 1 : 0);
const ordered = (c: Ctx) => (c.f.sorted ? [...BAR].sort((a, b) => score(b) - score(a) || BAR.indexOf(a) - BAR.indexOf(b)) : BAR);
const isLow = (b: BarItem) => (stock.get(b.id) ?? 0) < b.par * 0.35;

function tile(c: Ctx, b: BarItem) {
  const t = taps.get(b.id);
  const name = nameOf(c, b);
  const label = t ? `${name}: listed by ${t.who === 'You' ? 'you' : t.who} at ${hhmm(t.at)}` : `${name} is running low`;
  return `<li data-key="${b.id}"><button type="button" class="st-item" data-item="${b.id}" data-on="${t ? 'yes' : 'no'}" aria-label="${esc(label)}">
    <span class="st-item-top"><span class="st-item-name">${esc(name)}</span>${t ? `<span class="st-item-tick">${ICON.check}</span>` : ''}</span>
    <span class="st-item-week"><b>${b.lastWeek + (c.f.sorted && t ? 1 : 0)}</b> ${c.f.sorted ? 'taps incl. tonight' : 'taps last week'}</span>
    <span class="st-item-who" data-who>${t ? `${esc(t.who)} · ${hhmm(t.at)}` : 'Tap if low'}</span>
  </button></li>`;
}

function lowView(c: Ctx) {
  const items = ordered(c);
  const listed = items.filter((b) => taps.has(b.id));
  return `<div class="st-h"><h2>Running low</h2><span>${c.f.sorted ? '<span class="st-sorted">Most tapped first</span>' : 'One tap puts it on tomorrow’s order'}</span></div>
    <ul class="st-items" data-items>${items.map((b) => tile(c, b)).join('')}</ul>
    <section class="st-card st-order" aria-label="Tomorrow’s order">
      <div class="st-order-head"><b>Tomorrow’s order</b><span>${plural(listed.length, 'item')}</span></div>
      ${listed.length
        ? `<ul class="st-order-list">${listed.map((b) => `<li>${esc(nameOf(c, b))}<span>${esc(taps.get(b.id)!.who)} · ${hhmm(taps.get(b.id)!.at)}</span></li>`).join('')}</ul>`
        : '<p class="st-muted">Nothing yet. What’s tapped tonight is ordered tomorrow at 10:00.</p>'}
    </section>`;
}

function stockView(c: Ctx) {
  const low = BAR.filter(isLow).length;
  return `<div class="st-h"><h2>Stock behind the bar</h2><span>${low ? `<span class="st-pill st-pill--low">${low} low</span>` : '<span class="st-pill st-pill--ok">All fine</span>'}</span></div>
    <ul class="st-stock">${BAR.map((b) => {
      const n = stock.get(b.id) ?? 0;
      const lowNow = isLow(b);
      const name = nameOf(c, b);
      return `<li class="st-stock-row" data-low="${lowNow ? 'yes' : 'no'}">
        <div class="st-stock-main">
          <span class="st-stock-name">${esc(name)}<span class="st-pill ${lowNow ? 'st-pill--low' : 'st-pill--ok'}">${lowNow ? 'Low' : 'OK'}</span></span>
          <span class="st-stock-sub"><b data-count="${b.id}">${n}</b> ${esc(b.unit)} · keep ${b.par}</span>
          <span class="st-meter st-meter--stock" aria-hidden="true"><i style="transform:scaleX(${Math.min(1, n / b.par).toFixed(3)})"></i></span>
          ${c.f.delivery ? `<span class="st-stock-delivery">Last delivery: ${esc(b.delivery)}</span>` : ''}
        </div>
        <div class="st-stepper" role="group" aria-label="${esc(name)}: ${n} ${esc(b.unit)}">
          <button type="button" data-step="-1" data-id="${b.id}" aria-label="One fewer ${esc(name)}"${n <= 0 ? ' disabled' : ''}>${ICON.minus}</button>
          <button type="button" data-step="1" data-id="${b.id}" aria-label="One more ${esc(name)}">${ICON.plus}</button>
        </div>
      </li>`;
    }).join('')}</ul>
    <p class="st-foot-note">Counted by ${esc(c.me().short === 'You' ? 'you' : c.me().short)} tonight. Low means under a third of what we keep.</p>`;
}

export const bar: Screen = {
  title: 'Bar',
  html(c) {
    const seg = c.f.stock
      ? `<div class="st-seg" role="group" aria-label="Bar view">
          <button type="button" data-view="low" aria-pressed="${c.ui.barView === 'low'}">Running low</button>
          <button type="button" data-view="stock" aria-pressed="${c.ui.barView === 'stock'}">Stock</button>
        </div>`
      : '';
    return seg + (c.f.stock && c.ui.barView === 'stock' ? stockView(c) : lowView(c));
  },
  click(c, t) {
    const v = t.closest<HTMLElement>('[data-view]');
    if (v) { if (c.ui.barView !== v.dataset.view) { c.ui.barView = v.dataset.view as 'low' | 'stock'; c.paint(); } return true; }
    const step = t.closest<HTMLButtonElement>('[data-step]');
    if (step) {
      const id = step.dataset.id!;
      const b = BAR.find((x) => x.id === id)!;
      const n = Math.max(0, (stock.get(id) ?? 0) + Number(step.dataset.step));
      const wasLow = isLow(b);
      stock.set(id, n);
      c.paint();
      // Keep focus on the same button after the re-render.
      c.root.querySelector<HTMLElement>(`[data-step="${step.dataset.step}"][data-id="${id}"]`)?.focus({ preventScroll: true });
      enter(c.root.querySelector(`[data-count="${id}"]`), { transform: 'translateY(30%)', opacity: 0 }, 180);
      c.announce(`${nameOf(c, b)}: ${n} ${b.unit}${isLow(b) !== wasLow ? (isLow(b) ? ', now low' : ', no longer low') : ''}.`);
      return true;
    }
    const item = t.closest<HTMLElement>('[data-item]');
    if (item) { tapItem(c, item.dataset.item!); return true; }
  },
};

function tapItem(c: Ctx, id: string) {
  const b = BAR.find((x) => x.id === id)!;
  const name = nameOf(c, b);
  const t = taps.get(id);
  if (t) {
    const who = t.who === 'You' ? 'you' : t.who;
    c.toast({ kind: 'note', text: `${name} is already listed`, sub: `By ${who} at ${hhmm(t.at)} · not added twice`, ms: 3000 });
    c.announce(`${name} is already listed, by ${who} at ${hhmm(t.at)}. Not added twice.`);
    nudge(c.root.querySelector(`[data-item="${id}"]`));
    return;
  }
  const scope = c.root.querySelector('[data-items]');
  const before = scope ? measure(scope, '[data-key]') : new Map();
  taps.set(id, { who: c.me().short, at: now(), mine: true });
  c.paint({ foot: false });
  const after = c.root.querySelector('[data-items]');
  if (after) flip(after, '[data-key]', before);
  enter(c.root.querySelector(`[data-item="${id}"] [data-who]`), { transform: 'translateY(4px)', opacity: 0 }, 220);
  c.toast({
    kind: 'ok', text: `${name} is on tomorrow’s order`, sub: `Listed at ${hhmm(now())}`, ms: 5000,
    action: { label: 'Undo', run: () => { taps.delete(id); c.paint(); c.announce(`Undone. ${name} is off tomorrow’s order.`); } },
  });
  c.announce(`${name} listed as running low at ${hhmm(now())}.`);
}
