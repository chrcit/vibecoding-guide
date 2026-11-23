/*
 * The bar's running-low page, as the agent builds it in lesson 4. Staff tap what is running low;
 * a second tap the same night doesn't add it twice; in the morning the Order tab has one list,
 * with who tapped what and when. Built for a wet hand behind a dark bar: big tiles, who you are
 * chosen once at the top, undo for a wrong tap.
 *
 * Stages: 'none' (nothing at /bar yet), 'ready', and 'broken' (lesson 4, part 3: another thread's
 * half-done change in the same folder stops the app from building).
 *
 * The night is simulated from 23:20, like the door's. Bea, Tariq, Rosa and the taps are made up.
 */
import './lantern/lantern.css';
import type { MountApp } from './index';
import { esc, initials, enter, shake, hhmm, clock, brand, notFound, reduced } from './lantern/ui';

export const url = 'localhost:4321/bar';

type Kind = 'citrus' | 'leaf' | 'ice' | 'bottle' | 'can' | 'carton';
const ITEMS: [name: string, kind: Kind][] = [
  ['Lime', 'citrus'], ['Ice', 'ice'], ['Tonic', 'bottle'], ['Ginger beer', 'bottle'], ['Mint', 'leaf'], ['Lemons', 'citrus'],
  ['Soda', 'bottle'], ['Cola', 'can'], ['Oat milk', 'carton'], ['Prosecco', 'bottle'],
];
const STAFF = ['Bea Lindqvist', 'Tariq Aziz', 'Rosa Ibáñez'];
const first = (n: string) => n.split(' ')[0]!;

const svg = (d: string) => `<svg viewBox="0 0 24 24" aria-hidden="true" width="26" height="26">${d}</svg>`;
const GLYPH: Record<Kind, string> = {
  citrus: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5.2"/><path d="M12 6.8v10.4M6.8 12h10.4M8.3 8.3l7.4 7.4M15.7 8.3l-7.4 7.4"/>'),
  leaf: svg('<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z"/><path d="M5 19 13 11"/>'),
  ice: svg('<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9Z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>'),
  bottle: svg('<path d="M10 2.5h4M10.5 2.5v4.2c0 .8-.4 1.4-1 2-.9.9-1.5 2-1.5 3.3V20a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 16 20v-8c0-1.3-.6-2.4-1.5-3.3-.6-.6-1-1.2-1-2V2.5"/><path d="M8 14h8"/>'),
  can: svg('<rect x="6.5" y="3" width="11" height="18" rx="2.5"/><path d="M6.5 7h11M6.5 17h11"/>'),
  carton: svg('<path d="M7 8 9 3h6l2 5v12.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5Z"/><path d="M7 8h10M11 13h2"/>'),
};

// Tonight so far, shared by every mount: what is flagged, by whom, at what minute.
interface Flag { item: string; who: string; at: number; seq: number }
const now = clock(23 * 60 + 20);
let seq = 0;
const flags = new Map<string, Flag>([
  ['Ice', { item: 'Ice', who: 'Tariq Aziz', at: 23 * 60 + 5, seq: seq++ }],
  ['Lime', { item: 'Lime', who: 'Bea Lindqvist', at: 23 * 60 + 12, seq: seq++ }],
]);
let me = STAFF[0]!;

export const app: MountApp = (el, initial) => {
  let stage = initial;
  let tab: 'low' | 'order' = 'low';
  let toast: { title: string; sub: string; undo?: string } | null = null;
  let toastTimer = 0;
  let copied = false;

  const root = document.createElement('div');
  root.className = 'ln';
  el.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);

  function tile([name, kind]: [string, Kind]) {
    const f = flags.get(name);
    const state = f ? `Low · ${first(f.who)} ${hhmm(f.at)}` : 'Tap when it’s low';
    return `<button type="button" class="br-item ln-press" data-item="${esc(name)}"${f ? ' data-low' : ''} aria-label="${esc(name)}: ${f ? `on the morning list, flagged by ${esc(first(f.who))} at ${hhmm(f.at)}` : 'tap when it’s running low'}">
      <span style="color:${f ? 'var(--accent)' : 'var(--ink-2)'}">${GLYPH[kind]}</span>
      <span><span class="br-name">${esc(name)}</span><br><span class="br-state">${esc(state)}</span></span>
    </button>`;
  }

  function orderList(animateId = -1) {
    const list = [...flags.values()].sort((a, b) => a.seq - b.seq);
    const kind = (n: string) => ITEMS.find(([x]) => x === n)?.[1] ?? 'bottle';
    return `<section class="br-order">
      <div class="br-order-head"><div><h2>Order list</h2><p>For Saturday morning · ${list.length} item${list.length === 1 ? '' : 's'} from tonight</p></div>${list.length ? `<button type="button" class="br-copy ln-press" data-copy>${copied ? 'Copied' : 'Copy list'}</button>` : ''}</div>
      ${list.length ? `<ol class="br-lines">${list.map((f) => `<li class="br-line"${f.seq === animateId ? ' data-new' : ''}><span style="color:var(--accent)">${GLYPH[kind(f.item)]}</span><div><b>${esc(f.item)}</b><span>${esc(first(f.who))} · ${hhmm(f.at)}</span></div></li>`).join('')}</ol>` : '<p class="pr-empty">Nothing is running low yet tonight.</p>'}
    </section>`;
  }

  function paint() {
    if (stage === 'none') return notFound(root, '/bar');
    if (stage === 'broken') return broken();
    const scroll = $('.ln-body')?.scrollTop ?? 0;
    root.className = 'ln';
    root.innerHTML = `
      <header class="ln-head">${brand('Bar', `The Lantern · dev data · Fri ${hhmm(now())}`)}<span class="ln-tag"><i style="background:var(--bar)"></i>Running low</span></header>
      <div class="ln-body"><div class="ln-col">
        ${tab === 'low' ? `
          <div class="br-who" role="group" aria-label="Who is tapping">${STAFF.map((s) => `<button type="button" class="ln-press" data-me="${esc(s)}" aria-pressed="${s === me}"><span class="pr-av" aria-hidden="true">${esc(initials(s))}</span>${esc(first(s))}</button>`).join('')}</div>
          <div class="br-grid">${ITEMS.map(tile).join('')}</div>` : orderList()}
      </div></div>
      ${toast ? `<div class="br-toast" role="status"><div><b>${esc(toast.title)}</b><span>${esc(toast.sub)}</span></div>${toast.undo ? '<button type="button" data-undo>Undo</button>' : ''}</div>` : ''}
      <nav class="br-tabs" role="tablist" aria-label="Bar">
        <button type="button" role="tab" class="ln-press" data-tab="low" aria-selected="${tab === 'low'}">Running low</button>
        <button type="button" role="tab" class="ln-press" data-tab="order" aria-selected="${tab === 'order'}">Order${flags.size ? `<em>${flags.size}</em>` : ''}</button>
      </nav>`;
    const body = $('.ln-body');
    if (body) body.scrollTop = scroll;
  }

  function broken() {
    root.className = 'ln ln--error';
    root.innerHTML = `<div class="ln-body"><div class="ln-err" role="alert">
      <p class="ln-err-title">Build failed: Expected "}" but found end of file</p>
      <p class="ln-err-file">src/rota.tsx:41:3</p>
      <pre>39 |      {shifts.map((s) =&gt; (
40 |        &lt;Shift key={s.id} shift={s} /&gt;
41 |
   |   <mark>^</mark></pre>
      <p class="ln-err-tip">Imported by src/nav.tsx, which every page uses, so /bar can’t build either.</p>
    </div></div>`;
  }

  function showToast(t: typeof toast, ms: number) {
    if (toastTimer) clearTimeout(toastTimer);
    toast = t;
    paint();
    enter($('.br-toast'), { transform: 'translateY(8px)', opacity: 0 }, 200);
    toastTimer = window.setTimeout(() => { toast = null; toastTimer = 0; paint(); }, ms);
  }

  root.addEventListener('click', async (e) => {
    const t = e.target as HTMLElement;
    const item = t.closest<HTMLElement>('[data-item]');
    if (item) {
      const name = item.dataset.item!;
      const f = flags.get(name);
      if (f) {
        shake(item);
        showToast({ title: `${name} is already on the list`, sub: `${first(f.who)} flagged it at ${hhmm(f.at)} · not added again` }, 2600);
        return;
      }
      flags.set(name, { item: name, who: me, at: now(), seq: seq++ });
      showToast({ title: `${name} is on the morning list`, sub: `${first(me)} · ${hhmm(now())}`, undo: name }, 5000);
      const fresh = $(`[data-item="${CSS.escape(name)}"]`);
      if (fresh && !reduced()) fresh.animate([{ transform: 'scale(0.97)' }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
      return;
    }
    if (t.closest('[data-undo]') && toast?.undo) { flags.delete(toast.undo); showToast({ title: 'Undone', sub: `${toast.undo} is off the list` }, 1800); return; }
    const who = t.closest<HTMLElement>('[data-me]');
    if (who) { me = who.dataset.me!; paint(); return; }
    const tb = t.closest<HTMLElement>('[data-tab]');
    if (tb) { tab = tb.dataset.tab as typeof tab; copied = false; toast = null; paint(); return; }
    if (t.closest('[data-copy]')) {
      const text = [...flags.values()].sort((a, b) => a.seq - b.seq).map((f) => `${f.item} (${first(f.who)}, ${hhmm(f.at)})`).join('\n');
      try { await navigator.clipboard.writeText(`Order for Saturday:\n${text}`); copied = true; } catch { copied = false; }
      paint();
    }
  });

  paint();
  return {
    set(next: string) { if (next !== stage) { stage = next; toast = null; paint(); } },
    destroy() { if (toastTimer) clearTimeout(toastTimer); root.remove(); },
  };
};
