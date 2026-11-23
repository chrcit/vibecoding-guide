/*
 * The Lantern's ticket sale for its birthday night (Fri 28 Nov, 400 tickets at a made-up €15), the
 * door scanning those tickets, and the owner's sales page: the app chapter 3's lessons build with
 * several agents at once. A real, working page: buying adds tickets, the door scans them, refunds
 * change the numbers. Each stage picks the page and the version of it.
 *
 *   'none'        the dev server's 404 at /tickets
 *   'sale'        /tickets: pick how many, name, Buy, one ticket per person with its code
 *   'scan-own'    /door/scan in the scan thread's worktree: its own test code scans fine
 *   'mismatch'    /door/scan on main after the merge: a real code is "Not a Lantern ticket"
 *   'together'    /door/scan fixed: real codes scan, a second scan says when
 *   'sales'       /sales: sold, by hour, refunds, expected at the door
 *   'refund-bug'  /sales after one refund: the door count didn't drop (what the review found)
 *   'race'        /tickets on two phones, one ticket left, both buy: 401 of 400
 *   'race-fixed'  the same, fixed: one gets it, the other is told it just went
 *   'design-a'    one model's redesign: a poster, Buy docked in the thumb zone
 *   'design-b'    another model's: editorial, Buy at the top under the poster
 *
 * Orders, refunds and scans live at module level (./tickets/state), so they survive `set()` and a
 * remount. Everything here is made up.
 */
import './tickets.css';
import type { MountApp } from './index';
import { mountSale, type View } from './tickets/sale';
import { mountScan } from './tickets/scan';
import { mountSales } from './tickets/sales';
import { mountRace } from './tickets/race';

export type TicketsStage =
  | 'none' | 'sale' | 'scan-own' | 'mismatch' | 'together' | 'sales' | 'refund-bug'
  | 'race' | 'race-fixed' | 'design-a' | 'design-b';
const STAGES: readonly TicketsStage[] = ['none', 'sale', 'scan-own', 'mismatch', 'together', 'sales', 'refund-bug', 'race', 'race-fixed', 'design-a', 'design-b'];

export const url = 'localhost:4321/tickets';

export const tickets: MountApp = (el, initial) => {
  const normalize = (s: string): TicketsStage => (STAGES.includes(s as TicketsStage) ? (s as TicketsStage) : 'sale');
  let stage = normalize(initial);
  let view: View | null = null;

  const root = document.createElement('div');
  root.className = 'tk';
  el.append(root);

  function show(s: TicketsStage) {
    view?.destroy();
    view = null;
    stage = s;
    root.dataset.stage = s;
    root.classList.toggle('tk--none', s === 'none');
    root.innerHTML = '';
    switch (s) {
      case 'none': root.innerHTML = '<pre class="tk-404">Cannot GET /tickets</pre>'; break;
      case 'sale': view = mountSale(root, 'base'); break;
      case 'design-a': view = mountSale(root, 'a'); break;
      case 'design-b': view = mountSale(root, 'b'); break;
      case 'scan-own': case 'mismatch': case 'together': view = mountScan(root, s); break;
      case 'sales': case 'refund-bug': view = mountSales(root, s); break;
      case 'race': case 'race-fixed': view = mountRace(root, s); break;
    }
  }

  show(stage);
  return {
    set(next: string) {
      const s = normalize(next);
      if (s !== stage) show(s);
    },
    destroy() {
      view?.destroy();
      view = null;
      root.remove();
    },
  };
};

export const app = tickets;
