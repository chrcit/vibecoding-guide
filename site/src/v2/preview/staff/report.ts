/*
 * Report: last Friday on one screen, written every Saturday at 10:00 by the office mini PC.
 * Arrivals by hour (CSS bars), the peak, what ran low at the bar and each promoter's payout.
 */
import { CAPACITY, REPORT } from './data';
import { esc, euro, ICON } from './ui';
import { emptyState, type Screen } from './ctx';

export const report: Screen = {
  title: 'Report',
  html(c) {
    if (c.f.bea) return emptyState(ICON.lock, 'Owners only', 'The night report has the door count and the payouts. Bea’s account can’t see it.');
    if (!c.f.report) return emptyState(ICON.wrench, 'Not built yet', 'A report of each night will live here: arrivals by hour, what ran low and the payouts.');
    const R = REPORT;
    const total = R.hours.reduce((n, [, v]) => n + v, 0);
    const max = Math.max(...R.hours.map(([, v]) => v));
    const top = R.hours.find(([, v]) => v === max)![0];
    const pay = R.payouts.reduce((n, [, , e]) => n + e, 0);
    const tapMax = Math.max(...R.taps.map(([, v]) => v));
    return `<header class="st-rep-head">
        <p class="st-over">Night report</p>
        <h2 class="st-rep-title">${esc(R.night)}</h2>
        <p class="st-muted">Written ${esc(R.generated)} on office · every Saturday</p>
      </header>
      <section class="st-kpis" aria-label="The night in numbers">
        <div class="st-kpi"><span class="st-kpi-n">${total}</span><span class="st-kpi-l">people in</span></div>
        <div class="st-kpi"><span class="st-kpi-n">${R.peak.n}<small>/${CAPACITY}</small></span><span class="st-kpi-l">peak at ${R.peak.at}</span></div>
        <div class="st-kpi"><span class="st-kpi-n">${euro(pay)}</span><span class="st-kpi-l">payouts</span></div>
      </section>
      <section class="st-card st-rep-card" aria-labelledby="st-rep-arr">
        <div class="st-rep-card-head"><h3 id="st-rep-arr">Arrivals by hour</h3><span>busiest ${top}:00</span></div>
        <ol class="st-chart" aria-label="Arrivals per hour, 22:00 to 04:00">
          ${R.hours.map(([h, v]) => `<li${v === max ? ' class="is-peak"' : ''} aria-label="${h}:00, ${v} arrivals"><span class="st-chart-v" aria-hidden="true">${v}</span><span class="st-chart-bar" aria-hidden="true" style="height:${((v / max) * 100).toFixed(1)}%"></span><span class="st-chart-h" aria-hidden="true">${h}</span></li>`).join('')}
        </ol>
      </section>
      <div class="st-rep-grid">
        <section class="st-card st-rep-card" aria-labelledby="st-rep-bar">
          <div class="st-rep-card-head"><h3 id="st-rep-bar">Ran low at the bar</h3><span>taps</span></div>
          <ul class="st-hbars">${R.taps.map(([name, v]) => `<li><span class="st-hbars-name">${esc(name)}</span><span class="st-hbars-track" aria-hidden="true"><i style="transform:scaleX(${(v / tapMax).toFixed(3)})"></i></span><b>${v}</b></li>`).join('')}</ul>
        </section>
        <section class="st-card st-rep-card" aria-labelledby="st-rep-pay">
          <div class="st-rep-card-head"><h3 id="st-rep-pay">Payouts</h3><span>€5 a person in</span></div>
          <ul class="st-rep-pay">${R.payouts.map(([p, people, e]) => `<li class="st-l-${p.toLowerCase()}"><span><i class="st-dot"></i>${esc(p)}</span><span class="st-muted">${people} in</span><b>${euro(e)}</b></li>`).join('')}
            <li class="st-rep-pay-total"><span>Total</span><span></span><b>${euro(pay)}</b></li></ul>
        </section>
      </div>`;
  },
};
