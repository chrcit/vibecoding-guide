// Small HTML helpers for the v2 page: text by reader level, rendered so every level's words are in
// the page and CSS shows the reader's (styles/v2.css, [data-lv]).
import type { Lv } from './content';

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Every level's words, each in a span tagged with the levels it serves. */
export function lvHtml(t: Lv): string {
  if (typeof t === 'string') return esc(t);
  const tech = t.technical ?? t.plain;
  const eng = t.engineer ?? tech;
  const groups = new Map<string, string[]>();
  for (const [lv, text] of [['plain', t.plain], ['technical', tech], ['engineer', eng]] as const) groups.set(text, [...(groups.get(text) ?? []), lv]);
  if (groups.size === 1) return esc(t.plain);
  return [...groups].map(([text, lvs]) => `<span data-lv="${lvs.join(' ')}">${esc(text)}</span>`).join('');
}
