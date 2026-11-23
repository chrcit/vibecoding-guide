/*
 * /tickets: the buy flow. Three looks share one working form: 'base' is the page the agent builds
 * first (warm paper, a serif headline, a small club's own page); 'a' and 'b' are two models'
 * redesigns from the same prompt. A is a poster with the Buy button docked in the thumb zone; B is
 * editorial, with Buy right under the poster at the top of the screen, out of the thumb's reach.
 */
import { CAPACITY, PRICE, MAX_PER_ORDER, sold, left, buy, orders, type Order } from './state';
import { esc, firstName, euro, tickets, enter, ICON, tag, codeSquare } from './ui';

export type Variant = 'base' | 'a' | 'b';
export interface View { destroy(): void }

/** The form as the reader left it, and the order each look is showing, if any. */
const draft = { name: 'Ana Lopez', n: 2 };
const showing: Record<Variant, number | null> = { base: null, a: null, b: null };

const POSTER_ART = `<svg class="tk-poster-art" viewBox="0 0 200 200" aria-hidden="true">
  <circle cx="100" cy="100" r="96" class="tk-ring tk-ring-1"/>
  <circle cx="100" cy="100" r="74" class="tk-ring tk-ring-2"/>
  <circle cx="100" cy="100" r="52" class="tk-ring tk-ring-3"/>
  <circle cx="100" cy="100" r="30" class="tk-sun"/>
</svg>`;

export function mountSale(host: HTMLElement, variant: Variant): View {
  const root = document.createElement('div');
  root.className = `tk-page tk-sale tk-sale--${variant}`;
  host.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);
  let busy = 0;

  const current = (): Order | null => {
    const id = showing[variant];
    return id == null ? null : orders.find((o) => o.id === id) ?? null;
  };
  const maxNow = () => Math.max(1, Math.min(MAX_PER_ORDER, left()));
  const clampN = () => { draft.n = Math.max(1, Math.min(maxNow(), draft.n)); };

  // ---------- pieces shared by all three looks ----------

  const meter = () => {
    const s = sold();
    return `<div class="tk-left" data-left>
      <p class="tk-left-row"><span><b>${s}</b> of ${CAPACITY} sold</span><span class="tk-left-n">${left() ? `${left()} left` : 'Sold out'}</span></p>
      <div class="tk-meter" aria-hidden="true"><i style="transform:scaleX(${Math.min(1, s / CAPACITY).toFixed(3)})"></i></div>
    </div>`;
  };
  const stepper = () => `<div class="tk-qty" role="group" aria-label="Number of tickets">
      <button type="button" class="tk-qty-btn" data-qty="-1" aria-label="One ticket fewer"${draft.n <= 1 ? ' disabled' : ''}>${ICON.minus}</button>
      <output class="tk-qty-n" data-n aria-live="polite">${draft.n}</output>
      <button type="button" class="tk-qty-btn" data-qty="1" aria-label="One ticket more"${draft.n >= maxNow() ? ' disabled' : ''}>${ICON.plus}</button>
    </div>`;
  const nameField = (label: string, cls = 'tk-field') => `<label class="${cls}">
      <span class="tk-field-label">${label}</span>
      <input data-name type="text" autocomplete="name" autocapitalize="words" spellcheck="false" maxlength="60" value="${esc(draft.name)}">
    </label>`;
  const buyLabel = () => variant === 'base' ? `Buy ${tickets(draft.n)} · ${euro(draft.n * PRICE)}` : `Buy · ${euro(draft.n * PRICE)}`;
  const buyButton = () => `<button type="button" class="tk-buy-btn" data-buy${draft.name.trim() ? '' : ' disabled'}><span data-buy-label>${buyLabel()}</span>${variant === 'a' ? ICON.arrow : ''}</button>`;
  const soldOut = () => `<div class="tk-soldout" role="status"><b>Sold out</b><span>All ${CAPACITY} tickets have gone. See you at the door next time.</span></div>`;

  function stub(o: Order, i: number) {
    const c = o.codes[i]!;
    return `<li class="tk-stub">
      <div class="tk-stub-top"><span>Birthday Night</span><span>Fri 28 Nov · 23:00</span></div>
      <div class="tk-stub-body">
        ${codeSquare(c)}
        <div class="tk-stub-text">
          <span class="tk-stub-n">Ticket ${i + 1} of ${o.codes.length}</span>
          <b class="tk-stub-name">${esc(o.name)}</b>
          <span class="tk-code">${c}</span>
        </div>
      </div>
      <p class="tk-stub-foot">Show this at the door</p>
    </li>`;
  }
  const confirmation = (o: Order) => `<section class="tk-done" aria-labelledby="tk-done-title">
      <div class="tk-done-head">
        <span class="tk-done-check">${ICON.check}</span>
        <h2 id="tk-done-title" class="tk-done-title">You’re in, ${esc(firstName(o.name))}</h2>
        <p class="tk-done-sub">${tickets(o.codes.length)} for Friday 28 November, doors 23:00. Each one lets one person in.</p>
      </div>
      <ol class="tk-stubs">${o.codes.map((_, i) => stub(o, i)).join('')}</ol>
      <button type="button" class="tk-again" data-again>Buy more tickets</button>
    </section>`;

  // ---------- the three looks ----------

  function base(o: Order | null) {
    return `<div class="tk-scroll" data-scroll><div class="tk-sale-grid">
      <header class="tk-topbar"><span class="tk-mark">${ICON.lantern}</span><b>The Lantern</b><span class="tk-topbar-sub">Tickets</span></header>
      <section class="tk-poster">
        ${POSTER_ART}
        <p class="tk-eyebrow">Friday 28 November</p>
        <h1 class="tk-title">The Lantern’s <em>birthday night</em></h1>
        <dl class="tk-facts">
          <div><dt>Doors</dt><dd>23:00</dd></div>
          <div><dt>Until</dt><dd>Late</dd></div>
          <div><dt>Hosts</dt><dd>Kai &amp; Noor</dd></div>
        </dl>
        <p class="tk-blurb">The first night we have ever sold tickets for. ${CAPACITY} of them, one price, no fees.</p>
      </section>
      <section class="tk-buy" aria-label="${o ? 'Your tickets' : 'Buy tickets'}">
        ${o ? confirmation(o) : `
        ${meter()}
        ${left() ? `
        <div class="tk-type"><span><b>General admission</b><span>One person per ticket · up to four</span></span><b class="tk-price">${euro(PRICE)}</b></div>
        <div class="tk-qty-row"><span class="tk-field-label">Tickets</span>${stepper()}</div>
        ${nameField('Name for the door')}
        ${buyButton()}
        <p class="tk-fine">Every ticket gets its own code. Bring one per person.</p>` : soldOut()}`}
      </section>
    </div></div>`;
  }

  function posterA(o: Order | null) {
    return `${tag('worktree: t3/ticket-page')}
    <div class="tk-scroll" data-scroll>
      ${o ? `<div class="tk-a-done">${confirmation(o)}</div>` : `
      <section class="tk-a-poster">
        <div class="tk-a-top"><span>The Lantern</span><span>Birthday</span></div>
        <svg class="tk-a-sun" viewBox="0 0 200 200" aria-hidden="true">${Array.from({ length: 24 }, (_, i) => `<rect x="98" y="2" width="4" height="34" rx="2" transform="rotate(${i * 15} 100 100)"/>`).join('')}<circle cx="100" cy="100" r="52"/></svg>
        <h1 class="tk-a-title"><span>Birth</span><span>day</span><span>night</span></h1>
        <div class="tk-a-date"><b>28.11</b><span>Friday<br>Doors 23:00<br>Until late</span></div>
        ${left() ? `<p class="tk-a-sticker"><b>${left()}</b> left</p>` : ''}
      </section>
      <section class="tk-a-info">
        <p><b>Kai &amp; Noor</b> all night</p>
        <p>${CAPACITY} tickets · ${euro(PRICE)} · no fees</p>
        <p>One code per person</p>
      </section>`}
    </div>
    ${o ? '' : `<footer class="tk-a-dock">
      ${left() ? `${nameField('Tickets for', 'tk-field tk-a-name')}
      <div class="tk-a-row">${stepper()}${buyButton()}</div>` : soldOut()}
    </footer>`}`;
  }

  function editorialB(o: Order | null) {
    return `${tag('worktree: t3/ticket-page-2')}
    <div class="tk-scroll" data-scroll>${o ? `<div class="tk-b-done">${confirmation(o)}</div>` : `
      <div class="tk-b-grid">
        <header class="tk-b-mast"><span>The Lantern</span><i aria-hidden="true"></i><span>Nº 1</span></header>
        <div class="tk-b-lead">
          <figure class="tk-b-poster">
            <svg viewBox="0 0 320 150" aria-hidden="true">
              ${Array.from({ length: 13 }, (_, i) => { const a = (-90 + (i - 6) * 13) * Math.PI / 180; return `<line x1="${(160 + Math.cos(a) * 46).toFixed(1)}" y1="${(118 + Math.sin(a) * 46).toFixed(1)}" x2="${(160 + Math.cos(a) * (i % 2 ? 92 : 112)).toFixed(1)}" y2="${(118 + Math.sin(a) * (i % 2 ? 92 : 112)).toFixed(1)}"/>`; }).join('')}
              <path d="M146 72h28M160 72v8M150 84l-6 9v26l6 9h20l6-9V93l-6-9z"/>
              <path class="tk-b-flame" d="M160 98c4 4.5 6 7.6 6 10.6a6 6 0 0 1-12 0c0-3 2-6.1 6-10.6z"/>
              <path d="M150 138h20"/>
            </svg>
            <figcaption><span>Friday 28 November</span><em>Birthday Night</em></figcaption>
          </figure>
          <section class="tk-b-buy" aria-label="Buy tickets">${left() ? `
            <div class="tk-b-row">${stepper()}${buyButton()}</div>
            ${nameField('Name for the door', 'tk-field tk-b-name')}
            <p class="tk-b-count">${sold()} of ${CAPACITY} taken · ${euro(PRICE)} each, no fees</p>` : soldOut()}
          </section>
        </div>
        <article class="tk-b-text">
          <p class="tk-b-dek">One room, every lantern lit, and the first night we have ever sold tickets for.</p>
          <p>Doors open at eleven. Kai takes the first half of the night, Noor the second, and the bar keeps the birthday prices until one.</p>
          <h2 class="tk-b-h">Programme</h2>
          <ol class="tk-b-prog">
            <li><time>23:00</time><span>Doors</span></li>
            <li><time>00:30</time><span>Kai</span></li>
            <li><time>02:30</time><span>Noor</span></li>
            <li><time>05:00</time><span>Lights up</span></li>
          </ol>
          <p class="tk-b-fine">${CAPACITY} tickets, one price. Each ticket carries its own code; bring one per person.</p>
        </article>
      </div>`}
    </div>`;
  }

  function paint(animateDone = false) {
    clampN();
    const o = current();
    root.dataset.done = o ? 'yes' : 'no';
    root.innerHTML = variant === 'a' ? posterA(o) : variant === 'b' ? editorialB(o) : base(o);
    if (animateDone && o) {
      // Movement only: the tickets are readable from the first frame, even if a frame is caught mid-way.
      enter($('.tk-done-head'), { transform: 'translateY(8px)' }, 240);
      root.querySelectorAll('.tk-stub').forEach((s, i) => enter(s, { transform: 'translateY(14px)' }, 260, i * 40));
      const sc = $('[data-scroll]');
      if (sc) sc.scrollTop = 0;
    }
  }

  /** Refresh the bits that depend on the form without rebuilding the input being typed into. */
  function refreshForm() {
    clampN();
    const n = $('[data-n]');
    if (n) n.textContent = String(draft.n);
    const minus = $<HTMLButtonElement>('[data-qty="-1"]'), more = $<HTMLButtonElement>('[data-qty="1"]');
    if (minus) minus.disabled = draft.n <= 1;
    if (more) more.disabled = draft.n >= maxNow();
    const b = $<HTMLButtonElement>('[data-buy]');
    if (b && !busy) b.disabled = !draft.name.trim();
    const l = $('[data-buy-label]');
    if (l && !busy) l.textContent = buyLabel();
  }

  function purchase() {
    if (busy || !draft.name.trim() || !left()) return;
    const b = $<HTMLButtonElement>('[data-buy]');
    const l = $('[data-buy-label]');
    if (b) { b.disabled = true; b.dataset.busy = ''; }
    if (l) l.textContent = 'Buying…';
    busy = window.setTimeout(() => {
      busy = 0;
      const o = buy(draft.name, draft.n);
      showing[variant] = o.id;
      paint(true);
    }, 420);
  }

  root.addEventListener('input', (e) => {
    const t = e.target as HTMLElement;
    if (t.matches('[data-name]')) { draft.name = (t as HTMLInputElement).value; refreshForm(); }
  });
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const q = t.closest<HTMLButtonElement>('[data-qty]');
    if (q) { draft.n += Number(q.dataset.qty); refreshForm(); return; }
    if (t.closest('[data-buy]')) return purchase();
    if (t.closest('[data-again]')) { showing[variant] = null; paint(); $<HTMLElement>('[data-buy]')?.focus({ preventScroll: true }); }
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).matches('[data-name]')) { e.preventDefault(); purchase(); }
  });

  paint();
  return {
    destroy() {
      if (busy) clearTimeout(busy);
      root.remove();
    },
  };
}
