/* Small things every ticket page shares: escaping, motion, icons and the code's square pattern. */

export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;
export const euro = (n: number) => `€${n.toLocaleString('en-GB')}`;
export const tickets = (n: number) => `${n} ticket${n === 1 ? '' : 's'}`;
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

/** An entrance: from a small offset and transparent to rest, ease-out, never from scale(0). */
export function enter(el: Element | null | undefined, from: Keyframe, ms = 220, delay = 0) {
  if (!el || reduced()) return;
  (el as HTMLElement).animate([from, { transform: 'none', opacity: 1 }], { duration: ms, easing: EASE, delay, fill: 'backwards' });
}

export const ICON = {
  lantern: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3.5h6M12 3.5V6M7.5 8.2 9 6h6l1.5 2.2v8.6L15 19H9l-1.5-2.2zM9.5 21h5"/><path class="tk-glow" d="M12 10.2c1.3 1.4 1.9 2.4 1.9 3.4a1.9 1.9 0 0 1-3.8 0c0-1 .6-2 1.9-3.4z"/></svg>',
  check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8.4 6.4 11.5 12.8 4.6"/></svg>',
  stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>',
  again: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v6M12 16.6v.4"/><circle cx="12" cy="12" r="9"/></svg>',
  minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>',
  scan: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M7 12h10"/></svg>',
  keys: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};

/** A worktree or review label in a corner: what the lesson points at, not part of the app. */
export const tag = (text: string, kind: 'tree' | 'bug' | 'review' | 'test' = 'tree') =>
  `<span class="tk-tag" data-kind="${kind}">${esc(text)}</span>`;

/**
 * The square on a ticket: a QR-like pattern drawn from the code. Decorative (no reader decodes it):
 * three corner finders and modules picked by a hash of the code, so the same code always draws the
 * same square.
 */
export function codeSquare(code: string, cls = 'tk-qr') {
  const N = 21;
  let h = 2166136261;
  for (const ch of code) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  const finder = (x: number, y: number) => {
    const inside = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    for (const [ox, oy] of [[0, 0], [N - 7, 0], [0, N - 7]] as const) {
      if (inside(ox, oy)) {
        const dx = x - ox, dy = y - oy;
        const ring = dx === 0 || dy === 0 || dx === 6 || dy === 6;
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return ring || core ? 1 : 0;
      }
      if (x >= ox - 1 && x <= ox + 7 && y >= oy - 1 && y <= oy + 7) return 0; // separator
    }
    return -1;
  };
  let d = '';
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const f = finder(x, y);
      const on = f === -1 ? (x === 6 || y === 6 ? (x + y) % 2 === 0 : rand() < 0.48) : f === 1;
      if (on) d += `M${x + 1} ${y + 1}h1v1h-1z`;
    }
  }
  return `<svg class="${cls}" viewBox="0 0 ${N + 2} ${N + 2}" shape-rendering="crispEdges" aria-hidden="true"><rect width="${N + 2}" height="${N + 2}" fill="var(--qr-bg, #fff)"/><path d="${d}" fill="var(--qr-ink, #000)"/></svg>`;
}
