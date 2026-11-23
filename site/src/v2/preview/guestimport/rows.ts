/*
 * What the import makes of the three sources at each stage, and the search over it.
 *   'partial': Noor's importer keeps "+1" in the name and reads no plus-ones; nothing is merged.
 *   'fixed':   every row read right; rows with the same name are found but kept apart.
 *   'merged':  one row per guest, keeping every source it came from and the larger plus-ones.
 */
import { ENTRIES, SOURCE_IDS, fold, keyOf, type Entry, type SourceId } from './data';

export type ImportStage = 'partial' | 'fixed' | 'merged';

export interface Row {
  key: string;
  /** Same guest when equal. */
  match: string;
  name: string;
  /** Index of the first word of `name` that isn't part of the name (Noor's "+1"), or -1. */
  badFrom: number;
  plus: number;
  /** The plus-ones the source wrote were lost. */
  lostPlus: boolean;
  entries: Entry[];
  dna: boolean;
}

const order = (s: SourceId) => SOURCE_IDS.indexOf(s);
export const words = (s: string) => s.split(/[\s\-‐'’]+/).filter(Boolean);

function single(e: Entry, stage: ImportStage): Row {
  const broken = stage === 'partial' && e.source === 'noor';
  const name = broken ? e.raw : e.name;
  const lostPlus = broken && e.raw !== e.name;
  return {
    key: e.id, match: keyOf(e.name), name, plus: broken ? 0 : e.plus, lostPlus,
    badFrom: lostPlus ? words(e.name).length : -1, entries: [e], dna: !!e.dna,
  };
}

const cache = new Map<ImportStage, Row[]>();
export function rowsFor(stage: ImportStage): Row[] {
  let rows = cache.get(stage);
  if (rows) return rows;
  if (stage === 'merged') {
    const groups = new Map<string, Entry[]>();
    for (const e of ENTRIES) { const k = keyOf(e.name); groups.set(k, [...(groups.get(k) ?? []), e]); }
    rows = [...groups].map(([match, es]) => {
      es.sort((a, b) => order(a.source) - order(b.source));
      // A promoter's spelling wins over what a buyer typed at checkout (Inês, not Ines).
      return { key: `g-${match}`, match, name: es[0]!.name, badFrom: -1, plus: Math.max(...es.map((e) => e.plus)), lostPlus: false, entries: es, dna: es.some((e) => e.dna) };
    });
  } else rows = ENTRIES.map((e) => single(e, stage));
  rows.sort((a, b) => a.match.localeCompare(b.match) || keyOf(a.name).localeCompare(keyOf(b.name)) || order(a.entries[0]!.source) - order(b.entries[0]!.source));
  cache.set(stage, rows);
  return rows;
}

/** Guests on two lists: before the merge, the match keys found more than once; after, the merged rows. */
export function twice(stage: ImportStage): Set<string> {
  const rows = rowsFor(stage);
  if (stage === 'merged') return new Set(rows.filter((r) => r.entries.length > 1).map((r) => r.match));
  if (stage === 'partial') return new Set();
  const seen = new Map<string, number>();
  for (const r of rows) seen.set(r.match, (seen.get(r.match) ?? 0) + 1);
  return new Set([...seen].filter(([, n]) => n > 1).map(([k]) => k));
}

// ---------- search: every typed word starts a word of the name, or the order number ----------

export const tokensOf = (q: string) => words(fold(q));

export interface Hit { row: Row; marks: number[] }

export function search(rows: Row[], q: string): Hit[] {
  const tokens = tokensOf(q);
  if (!tokens.length) return rows.map((row) => ({ row, marks: [] }));
  const hits: Hit[] = [];
  for (const row of rows) {
    const ws = words(row.name).map(fold);
    const refs = row.entries.flatMap((e) => (e.ref ? [fold(e.ref), fold(e.ref.slice(4))] : []));
    const marks = ws.map(() => 0);
    let ok = true;
    for (const t of tokens) {
      const w = ws.findIndex((x, i) => x.startsWith(t) && marks[i]! < t.length);
      if (w >= 0) { marks[w] = t.length; continue; }
      if (ws.some((x) => x.startsWith(t)) || refs.some((r) => r.startsWith(t))) continue;
      ok = false; break;
    }
    if (ok) hits.push({ row, marks });
  }
  return hits;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** The name as HTML: matched starts in <mark>, the words that aren't the name in a "bad" span. */
export function nameHtml(row: Row, marks: number[]): string {
  const ws = words(row.name);
  let out = '', rest = row.name;
  ws.forEach((word, w) => {
    const at = rest.indexOf(word);
    const gap = esc(rest.slice(0, at));
    rest = rest.slice(at + word.length);
    const n = marks[w] ?? 0;
    let cut = 0, len = 0;
    for (const ch of word) { if (len >= n) break; len += fold(ch).length; cut += ch.length; }
    const html = n ? `<mark>${esc(word.slice(0, cut))}</mark>${esc(word.slice(cut))}` : esc(word);
    if (row.badFrom >= 0 && w >= row.badFrom) out += `<span class="gi-bad">${gap}${html}</span>`;
    else out += gap + html;
  });
  return out + esc(rest);
}
