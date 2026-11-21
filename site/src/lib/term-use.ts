// Which lessons use which glossary terms (src/journey/terms.ts), worked out at build time from the
// lesson pages and their scripts. A lesson "defines" a term when it marks it with <Term id>,
// termLabel() or { term }; it "uses" it when the word is in its step text. The library shows both.
import { TERMS, type TermId } from '../journey/terms';
import { rungs } from '../journey/rungs';

const pages = import.meta.glob('../pages/journey/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const scripts = import.meta.glob('../journey/chapters/*.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const file = (all: Record<string, string>, id: string, ext: string) =>
  Object.entries(all).find(([p]) => p.endsWith(`/${id}.${ext}`))?.[1] ?? '';
/** Step text only: the page without its frontmatter, tags and expressions. */
const words = (astro: string) => astro.replace(/^---[\s\S]*?---/, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\{[^}]*\}/g, ' ');
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export interface TermUse { defines: string[]; uses: string[] }

let cache: { byTerm: Record<TermId, TermUse>; byLesson: Record<string, TermId[]> } | null = null;

export function termUse() {
  if (cache) return cache;
  const ids = Object.keys(TERMS) as TermId[];
  const byTerm = Object.fromEntries(ids.map((t) => [t, { defines: [], uses: [] }])) as Record<TermId, TermUse>;
  const byLesson: Record<string, TermId[]> = {};
  for (const r of rungs) {
    const page = file(pages, r.id, 'astro');
    const script = file(scripts, r.id, 'ts');
    const text = words(page);
    byLesson[r.id] = [];
    for (const t of ids) {
      const marked = new RegExp(`<Term\\s+id=["']${escape(t)}["']|term:\\s*['"]${escape(t)}['"]|termLabel\\([^)]*['"]${escape(t)}['"]`).test(page + script);
      const stem = TERMS[t].word.replace(/s$/, '');
      const said = new RegExp(`\\b${escape(stem)}(s|es)?\\b`, 'i').test(text);
      if (marked) byTerm[t].defines.push(r.id);
      else if (said) byTerm[t].uses.push(r.id);
      if (marked || said) byLesson[r.id].push(t);
    }
  }
  cache = { byTerm, byLesson };
  return cache;
}
