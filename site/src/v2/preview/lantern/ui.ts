/* Small pieces the Lantern's pages share: escaping, initials, icons, a made-up clock, entrances. */
export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
export const initials = (name: string) => { const w = name.trim().split(/\s+/); return ((w[0]?.[0] ?? '') + (w.length > 1 ? w[w.length - 1]![0]! : '')).toUpperCase(); };
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
/** An entrance for feedback: ease-out, short, transform and opacity only. */
export function enter(el: Element | null | undefined, from: Keyframe, ms = 200) {
  if (!el || reduced()) return;
  (el as HTMLElement).animate([from, { transform: 'none', opacity: 1 }], { duration: ms, easing: EASE });
}
export function shake(el: Element | null | undefined) {
  if (!el || reduced()) return;
  (el as HTMLElement).animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'translateX(0)' }], { duration: 260, easing: 'ease-out' });
}
const pad = (n: number) => String(n).padStart(2, '0');
export const hhmm = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
/** A made-up clock that starts at `start` (minutes after midnight) when the page first loads. */
export function clock(start: number) { const t0 = Date.now(); return () => start + Math.floor((Date.now() - t0) / 60_000); }

export const ICON = {
  lantern: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3.5h6M12 3.5V6M7.5 8.2 9 6h6l1.5 2.2v8.6L15 19H9l-1.5-2.2zM9.5 21h5"/><path class="ln-glow" d="M12 10.2c1.3 1.4 1.9 2.4 1.9 3.4a1.9 1.9 0 0 1-3.8 0c0-1 .6-2 1.9-3.4z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  full: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>',
};
export const brand = (title: string, sub: string, hue = '') => `<div class="ln-brand${hue ? ` ${hue}` : ''}"><span class="ln-lantern">${ICON.lantern}</span><span class="ln-brand-text"><b>${esc(title)}</b><span>${esc(sub)}</span></span></div>`;
export const notFound = (root: HTMLElement, path: string) => { root.className = 'ln ln--none'; root.innerHTML = `<pre>Cannot GET ${esc(path)}</pre>`; };
