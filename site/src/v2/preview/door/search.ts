/*
 * The door search: every typed word must start some word of the name, ignoring case and accents,
 * so "ana" finds Ana Lopez and Anaïs Fournier but not Juliana, and "de vr" finds Jasper de Vries.
 */
import type { Guest } from './guests';

export const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const split = (s: string) => s.split(/[\s\-‐'’]+/).filter(Boolean);

export const tokensOf = (q: string) => split(fold(q));

interface Indexed { guest: Guest; words: string[]; folded: string[] }
const cache = new WeakMap<Guest, Indexed>();
function index(g: Guest): Indexed {
  let i = cache.get(g);
  if (!i) { const words = split(g.name); i = { guest: g, words, folded: words.map(fold) }; cache.set(g, i); }
  return i;
}

export interface Hit { guest: Guest; score: number; /** Per word of the name: how many leading letters matched. */ marks: number[] }

export function find(guests: Guest[], q: string): Hit[] {
  const tokens = tokensOf(q);
  if (!tokens.length) return [];
  const hits: Hit[] = [];
  for (const g of guests) {
    const { folded } = index(g);
    const marks = folded.map(() => 0);
    let score = 0, ok = true;
    for (const t of tokens) {
      let best = -1;
      for (let w = 0; w < folded.length; w++) if (folded[w]!.startsWith(t) && (best < 0 || marks[w]! < marks[best]!)) best = w;
      if (best < 0) { ok = false; break; }
      marks[best] = Math.max(marks[best]!, t.length);
      score += (folded[best] === t ? 4 : 2) + (best === 0 ? 1 : 0);
    }
    if (ok) hits.push({ guest: g, score, marks });
  }
  // Stable order for a query: best match first, then by first name. Arriving doesn't reorder rows,
  // so nothing moves under the thumb after a tap.
  return hits.sort((a, b) => b.score - a.score || a.guest.name.localeCompare(b.guest.name));
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** The name as HTML with each word's matched start wrapped in <mark>. */
export function highlight(g: Guest, marks: number[]): string {
  const { words } = index(g);
  // Keep the name's own separators: walk the original string word by word.
  let out = '', rest = g.name;
  words.forEach((word, w) => {
    const at = rest.indexOf(word);
    out += esc(rest.slice(0, at));
    rest = rest.slice(at + word.length);
    const n = marks[w] ?? 0;
    if (!n) { out += esc(word); return; }
    // Map n folded letters back to the original word (an accented letter folds to one letter).
    let cut = 0, len = 0;
    for (const ch of word) { if (len >= n) break; len += fold(ch).length; cut += ch.length; }
    out += `<mark>${esc(word.slice(0, cut))}</mark>${esc(word.slice(cut))}`;
  });
  return out + esc(rest);
}
