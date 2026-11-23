/*
 * /tickets with one ticket left, on two phones at once. The first version checks "is there one
 * left?" and then writes the sale, two steps: when both phones ask at the same moment, both see one
 * left and both sell it (401 of 400). The fix takes the ticket in one step, so the second phone
 * finds none. Tapped one after the other, both versions behave; only "at once" shows the race.
 * This is a test setup the agent made, kept apart from the real sale's numbers.
 */
import { CAPACITY, PRICE } from './state';
import { esc, euro, enter, reduced, ICON, tag } from './ui';

export type RaceStage = 'race' | 'race-fixed';
export interface View { destroy(): void }

type Phone = 'A' | 'B';
type PState = 'idle' | 'buying' | 'in' | 'soldout';
const WHO: Record<Phone, string> = { A: 'Lea Brandt', B: 'Ana Lopez' };
const CODE: Record<Phone, string> = { A: 'LTN-R4CE', B: 'LTN-W8NX' };

export function mountRace(host: HTMLElement, stage: RaceStage): View {
  const fixed = stage === 'race-fixed';
  const root = document.createElement('div');
  root.className = 'tk-page tk-race';
  root.dataset.stage = stage;
  host.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);

  let server = CAPACITY - 1;
  const phone: Record<Phone, PState> = { A: 'idle', B: 'idle' };
  let log: { who: Phone | 'S'; text: string; bad?: boolean }[] = [];
  let timers: number[] = [];
  let io: IntersectionObserver | null = null;
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const later = (ms: number, f: () => void) => { if (reduced()) f(); else timers.push(window.setTimeout(f, ms)); };

  function reset() {
    clear();
    server = CAPACITY - 1;
    phone.A = phone.B = 'idle';
    log = [];
  }

  // ---------- painting ----------

  function screen(p: Phone) {
    const s = phone[p];
    const leftNow = Math.max(0, CAPACITY - server);
    let body = '';
    if (s === 'in') {
      body = `<div class="tk-ph-res tk-ph-res--in"><span class="tk-ph-icon">${ICON.check}</span><b>You’re in</b><span>1 ticket</span><code>${CODE[p]}</code></div>`;
    } else if (s === 'soldout') {
      body = `<div class="tk-ph-res tk-ph-res--out"><b>Sold out</b><span>The last ticket just went</span></div>`;
    } else {
      body = `<span class="tk-ph-name"><span>Name</span>${esc(WHO[p])}</span>
        <button type="button" class="tk-ph-buy" data-buy="${p}"${s === 'buying' ? ' data-busy disabled' : ''}>${s === 'buying' ? 'Buying…' : `Buy 1 · ${euro(PRICE)}`}</button>`;
    }
    return `<div class="tk-phone" data-phone="${p}" data-s="${s}">
      <p class="tk-phone-label">Phone ${p}</p>
      <div class="tk-ph-screen">
        <p class="tk-ph-status"><span>21:59</span><span>localhost</span></p>
        <p class="tk-ph-eyebrow">Fri 28 Nov · 23:00</p>
        <p class="tk-ph-title">Birthday <em>night</em></p>
        <p class="tk-ph-left"${s === 'idle' || s === 'buying' ? '' : ' data-dim'}>${s === 'idle' || s === 'buying' ? `${Math.max(0, leftNow)} left` : `${Math.min(server, 999)} of ${CAPACITY} sold`}</p>
        <div class="tk-ph-body" data-body>${body}</div>
      </div>
    </div>`;
  }

  function paint() {
    const over = server > CAPACITY;
    root.dataset.over = over ? 'yes' : 'no';
    root.innerHTML = `<div class="tk-scroll" data-scroll><div class="tk-race-col">
      <div class="tk-race-top">
        <div class="tk-race-title">${tag(fixed ? 'test: one ticket left · fixed' : 'test: one ticket left', 'test')}<p>Two phones buy the last ticket at the same moment.</p></div>
        <div class="tk-server" aria-live="polite"><span class="tk-k">Sold</span><b data-server>${server}</b><span class="tk-server-of">of ${CAPACITY}</span></div>
      </div>
      <div class="tk-phones">${screen('A')}${screen('B')}</div>
      <ol class="tk-log" aria-label="What the server did">${log.length ? log.map((l) => `<li${l.bad ? ' data-bad' : ''}><span class="tk-log-who" data-who="${l.who}">${l.who === 'S' ? 'server' : l.who}</span><span>${esc(l.text)}</span></li>`).join('') : '<li class="tk-log-empty"><span>Tap Buy on one phone, or on both at once.</span></li>'}</ol>
      <div class="tk-race-foot">
        <button type="button" class="tk-race-btn" data-both>Buy on both at once</button>
      </div>
    </div></div>`;
  }

  function step(f: () => void) { f(); paint(); const last = $('.tk-log li:last-child'); enter(last, { transform: 'translateY(6px)', opacity: 0 }, 200); }

  // ---------- the two versions ----------

  /** One phone alone: the check sees what the other already wrote. */
  function single(p: Phone) {
    if (phone[p] !== 'idle') return;
    clear();
    phone[p] = 'buying';
    paint();
    later(260, () => step(() => {
      const ok = server < CAPACITY;
      if (ok) { server++; phone[p] = 'in'; log.push({ who: p, text: fixed ? `takes the last ticket → ${server} sold` : `sees 1 left, sells it → ${server} sold` }); }
      else { phone[p] = 'soldout'; log.push({ who: p, text: 'sees 0 left → sold out' }); }
    }));
  }

  function both() {
    reset();
    phone.A = phone.B = 'buying';
    paint();
    if (!fixed) {
      later(220, () => step(() => log.push({ who: 'A', text: `checks: ${server} sold, 1 left` })));
      later(440, () => step(() => log.push({ who: 'B', text: `checks: ${server} sold, 1 left` })));
      later(660, () => step(() => { server++; phone.A = 'in'; log.push({ who: 'A', text: `sells it → ${server} sold` }); }));
      later(880, () => step(() => { server++; phone.B = 'in'; log.push({ who: 'B', text: `sells it too → ${server} sold`, bad: true }); }));
    } else {
      later(260, () => step(() => { server++; phone.A = 'in'; log.push({ who: 'A', text: `takes the last ticket in one step → ${server} sold` }); }));
      later(520, () => step(() => { phone.B = 'soldout'; log.push({ who: 'B', text: 'tries to take one: none left → sold out' }); }));
    }
    later(fixed ? 540 : 900, () => {
      const n = $('[data-server]');
      enter(n, { transform: 'translateY(30%)', opacity: 0 }, 220);
    });
  }

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const b = t.closest<HTMLElement>('[data-buy]');
    if (b) return single(b.dataset.buy as Phone);
    if (t.closest('[data-both]')) both();
  });

  // Play it once when the page comes into view; the button replays it.
  reset();
  paint();
  if (reduced() || typeof IntersectionObserver === 'undefined') both();
  else {
    io = new IntersectionObserver((es) => {
      if (!es.some((x) => x.isIntersecting)) return;
      io?.disconnect(); io = null;
      timers.push(window.setTimeout(both, 350));
    }, { threshold: 0.4 });
    io.observe(root);
  }

  return {
    destroy() {
      io?.disconnect();
      clear();
      root.remove();
    },
  };
}
