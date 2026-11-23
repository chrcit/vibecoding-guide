/* Small helpers for the staff app: escaping, names, motion and icons. */

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export const initials = (name: string) => { const w = name.split(' '); return (w[0]![0]! + (w.length > 1 ? w[w.length - 1]![0]! : '')).toUpperCase(); };
export const firstName = (name: string) => name.split(' ')[0]!;
export const euro = (n: number) => `€${n.toLocaleString('en-GB')}`;
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const split = (s: string) => s.split(/[\s\-‐'’]+/).filter(Boolean);
export const tokensOf = (q: string) => split(fold(q));

/** Every typed word must start a word of the name. Returns per-word matched lengths, or null. */
export function match(name: string, tokens: string[]): number[] | null {
  const words = split(name).map(fold);
  const marks = words.map(() => 0);
  for (const t of tokens) {
    let best = -1;
    for (let w = 0; w < words.length; w++) if (words[w]!.startsWith(t) && (best < 0 || marks[w]! < marks[best]!)) best = w;
    if (best < 0) return null;
    marks[best] = Math.max(marks[best]!, t.length);
  }
  return marks;
}
/** The name as HTML with each word's matched start in <mark>. */
export function highlight(name: string, marks: number[] | null): string {
  if (!marks || !marks.some(Boolean)) return esc(name);
  const words = split(name);
  let out = '', rest = name;
  words.forEach((word, w) => {
    const at = rest.indexOf(word);
    out += esc(rest.slice(0, at));
    rest = rest.slice(at + word.length);
    const n = marks[w] ?? 0;
    if (!n) { out += esc(word); return; }
    let cut = 0, len = 0;
    for (const ch of word) { if (len >= n) break; len += fold(ch).length; cut += ch.length; }
    out += `<mark>${esc(word.slice(0, cut))}</mark>${esc(word.slice(cut))}`;
  });
  return out + esc(rest);
}

// ---------- motion: feedback only, transform and opacity, ease-out, under 300 ms ----------

export const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
export const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export function enter(el: Element | null | undefined, from: Keyframe, ms = 200, delay = 0) {
  if (!el || reduced()) return;
  (el as HTMLElement).animate([from, { transform: 'none', opacity: 1 }], { duration: ms, easing: EASE, delay, fill: 'backwards' });
}
export function nudge(el: Element | null | undefined) {
  if (!el || reduced()) return;
  (el as HTMLElement).animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(-1px)' }, { transform: 'translateX(0)' }],
    { duration: 240, easing: 'ease-out' },
  );
}
/** FLIP: remember where keyed children are, then after a re-render slide them from there. */
export function measure(scope: Element, sel: string): Map<string, DOMRect> {
  const m = new Map<string, DOMRect>();
  for (const el of scope.querySelectorAll<HTMLElement>(sel)) m.set(el.dataset.key!, el.getBoundingClientRect());
  return m;
}
export function flip(scope: Element, sel: string, before: Map<string, DOMRect>) {
  if (reduced()) return;
  for (const el of scope.querySelectorAll<HTMLElement>(sel)) {
    const a = before.get(el.dataset.key!);
    if (!a) continue;
    const b = el.getBoundingClientRect();
    const dx = a.left - b.left, dy = a.top - b.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 260, easing: EASE });
  }
}

// ---------- icons ----------

const svg = (body: string, box = 24) => `<svg viewBox="0 0 ${box} ${box}" aria-hidden="true">${body}</svg>`;
export const ICON = {
  lantern: svg('<path class="st-lantern-frame" d="M9 3.5h6M12 3.5V6M7.5 8.2 9 6h6l1.5 2.2v8.6L15 19H9l-1.5-2.2zM9.5 21h5"/><path class="st-lantern-glow" d="M12 10.2c1.3 1.4 1.9 2.4 1.9 3.4a1.9 1.9 0 0 1-3.8 0c0-1 .6-2 1.9-3.4z"/>'),
  tonight: svg('<path d="M4 6.5h16M4 12h16M4 17.5h10"/>'),
  bar: svg('<path d="M6 4h12l-1.6 6.2a4.5 4.5 0 0 1-8.8 0z"/><path d="M12 14.8V20M8.5 20h7"/>'),
  rota: svg('<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M7.5 13.5h3M7.5 16.5h6"/>'),
  payouts: svg('<path d="M17.5 6.2A7 7 0 1 0 17.5 17.8"/><path d="M4 10h9M4 14h9"/>'),
  report: svg('<path d="M4 20h16"/><path d="M7 16v-4M12 16V7M17 16v-7"/>'),
  search: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>'),
  clear: svg('<path d="M7 7l10 10M17 7 7 17"/>'),
  check: svg('<path d="M3.2 8.4 6.4 11.5 12.8 4.6"/>', 16),
  plus: svg('<path d="M8 3.5v9M3.5 8h9"/>', 16),
  minus: svg('<path d="M3.5 8h9"/>', 16),
  chev: svg('<path d="m6 4 4 4-4 4"/>', 16),
  lock: svg('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
  swap: svg('<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>'),
  table: svg('<path d="M2.5 6h11M4.5 6v6.5M11.5 6v6.5M6 9h4"/>', 16),
  wrench: svg('<path d="M14.5 6.5a4 4 0 0 0-5.3 5L4 16.7 7.3 20l5.2-5.2a4 4 0 0 0 5-5.3l-2.4 2.4-2.6-.7-.7-2.6z"/>'),
  mail: svg('<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 6 7.5-6"/>'),
};
