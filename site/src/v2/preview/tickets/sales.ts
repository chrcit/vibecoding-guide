/*
 * /sales: the owner's page on a phone. Sold so far, the day by hour, refunds and how many people to
 * expect at the door. Its first version counts refunded tickets at the door (it adds up every order
 * ever placed); in 'sales' nobody has refunded yet, so it can't show. 'refund-bug' makes one refund
 * (Lea's single ticket) and marks the card the review flagged.
 */
import { CAPACITY, PRICE, FIRST_HOUR, orders, sold, left, soldIgnoringRefunds, refunds, refund, byHour, saleNow, hhmm } from './state';
import { esc, euro, tickets, enter, ICON, tag } from './ui';

export type SalesStage = 'sales' | 'refund-bug';
export interface View { destroy(): void }

/** The hour the reader last tapped in the chart, kept across stages. */
let picked: number | null = null;

export function mountSales(host: HTMLElement, stage: SalesStage): View {
  if (stage === 'refund-bug' && !refunds().length) {
    const lea = orders.find((o) => o.seed && o.name === 'Lea Brandt');
    if (lea) refund(lea.id);
  }
  const root = document.createElement('div');
  root.className = 'tk-page tk-sales';
  root.dataset.stage = stage;
  host.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);
  let confirming: number | null = null;
  const clock = window.setInterval(() => { const c = $('[data-clock]'); if (c) c.textContent = hhmm(saleNow()); }, 15_000);

  function chart() {
    const bars = byHour();
    const max = Math.max(5, Math.ceil(Math.max(...bars) / 5) * 5);
    const total = bars.reduce((a, b) => a + b, 0);
    const now = bars.length - 1;
    const sel = picked ?? now;
    const grid = [max, max / 2].map((v) => `<span class="tk-grid" style="bottom:${(v / max) * 100}%"><i>${v}</i></span>`).join('');
    return `<section class="tk-card tk-chart" aria-labelledby="tk-chart-h">
      <div class="tk-card-head"><h2 class="tk-k" id="tk-chart-h">Today by hour</h2><span class="tk-card-aside">${tickets(total)}</span></div>
      <p class="tk-chart-read" data-read aria-live="polite">${readout(bars, sel, now)}</p>
      <div class="tk-bars" role="list">${grid}${bars.map((v, i) => `<button type="button" role="listitem" class="tk-bar" data-hour="${i}"${i === sel ? ' data-on' : ''}${i === now ? ' data-now' : ''} aria-label="${hhmm((FIRST_HOUR + i) * 60)}: ${tickets(v)}"><i style="height:${((v / max) * 100).toFixed(1)}%"></i></button>`).join('')}</div>
      <div class="tk-axis" aria-hidden="true">${bars.map((_, i) => `<span>${i % 3 === 0 ? `${FIRST_HOUR + i}:00` : ''}</span>`).join('')}</div>
    </section>`;
  }
  const readout = (bars: number[], i: number, now: number) =>
    `<b>${tickets(bars[i]!)}</b> <span>${hhmm((FIRST_HOUR + i) * 60)}–${hhmm((FIRST_HOUR + i + 1) * 60)}${i === now ? ' · so far' : ''}</span>`;

  function ordersHtml() {
    const latest = [...orders].sort((a, b) => b.id - a.id).slice(0, 5);
    return `<section class="tk-card tk-orders" aria-labelledby="tk-orders-h">
      <div class="tk-card-head"><h2 class="tk-k" id="tk-orders-h">Latest orders</h2></div>
      <ol>${latest.map((o) => `<li class="tk-order"${o.refunded ? ' data-refunded' : ''}>
        <span class="tk-order-who"><b>${esc(o.name)}</b><span>${tickets(o.codes.length)} · ${hhmm(o.at)}</span></span>
        <span class="tk-order-amt">${euro(o.codes.length * PRICE)}</span>
        ${o.refunded ? '<span class="tk-order-state">Refunded</span>'
          : `<button type="button" class="tk-order-btn" data-refund="${o.id}"${confirming === o.id ? ' data-confirm' : ''}>${confirming === o.id ? 'Confirm' : 'Refund'}</button>`}
      </li>`).join('')}</ol>
    </section>`;
  }

  function paint() {
    const s = sold();
    const r = refunds();
    const back = r.reduce((n, o) => n + o.codes.length, 0);
    // The first version: everyone who ever bought a ticket, refunded or not.
    const expected = soldIgnoringRefunds();
    const flagged = stage === 'refund-bug';
    root.innerHTML = `<div class="tk-scroll" data-scroll><div class="tk-sales-col">
      <header class="tk-sales-head">
        <span class="tk-mark">${ICON.lantern}</span>
        <span class="tk-sales-title"><b>Sales</b><span>Birthday Night · Fri 28 Nov</span></span>
        <span class="tk-live"><i aria-hidden="true"></i>Live · <time data-clock>${hhmm(saleNow())}</time></span>
      </header>
      <section class="tk-card tk-hero" aria-labelledby="tk-sold-h">
        <h2 class="tk-k" id="tk-sold-h">Sold so far</h2>
        <p class="tk-hero-n"><b data-sold>${s}</b><span>of ${CAPACITY}</span></p>
        <div class="tk-meter" aria-hidden="true"><i style="transform:scaleX(${Math.min(1, s / CAPACITY).toFixed(3)})"></i></div>
        <p class="tk-hero-sub"><span>${left()} left</span><span>${euro(s * PRICE)} taken</span></p>
      </section>
      <div class="tk-two">
        <section class="tk-card tk-stat">
          <h2 class="tk-k">Refunds</h2>
          <b class="tk-stat-n">${r.length}</b>
          <span class="tk-stat-sub">${r.length ? `${tickets(back)} · ${euro(back * PRICE)} back` : 'None yet'}</span>
        </section>
        <section class="tk-card tk-stat"${flagged ? ' data-flagged' : ''}>
          ${flagged ? tag('found by the review', 'review') : ''}
          <h2 class="tk-k">Expected at the door</h2>
          <b class="tk-stat-n">${expected}</b>
          <span class="tk-stat-sub">people with a ticket</span>
        </section>
      </div>
      ${flagged ? `<p class="tk-review-note"><b>Review:</b> refunded tickets are still counted here. ${tickets(back)} refunded, so it should say ${expected - back}.</p>` : ''}
      <div class="tk-sales-pair">${chart()}${ordersHtml()}</div>
    </div></div>`;
  }

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const bar = t.closest<HTMLElement>('[data-hour]');
    if (bar) {
      picked = Number(bar.dataset.hour);
      const bars = byHour();
      root.querySelectorAll('[data-hour]').forEach((b) => b.toggleAttribute('data-on', b === bar));
      const read = $('[data-read]');
      if (read) read.innerHTML = readout(bars, picked, bars.length - 1);
      return;
    }
    const rb = t.closest<HTMLElement>('[data-refund]');
    if (rb) {
      const id = Number(rb.dataset.refund);
      const sc = $('[data-scroll]')?.scrollTop ?? 0;
      if (confirming === id) { refund(id); confirming = null; } else confirming = id;
      paint();
      const s2 = $('[data-scroll]');
      if (s2) s2.scrollTop = sc;
      const again = $<HTMLElement>(`[data-refund="${id}"]`) ?? $(`.tk-order[data-refunded] .tk-order-state`);
      if (confirming === id) { again?.focus({ preventScroll: true }); enter(again, { opacity: 0.4 }, 160); }
      return;
    }
    if (confirming != null) { confirming = null; const sc = $('[data-scroll]')?.scrollTop ?? 0; paint(); const s2 = $('[data-scroll]'); if (s2) s2.scrollTop = sc; }
  });

  paint();
  return { destroy() { clearInterval(clock); root.remove(); } };
}
