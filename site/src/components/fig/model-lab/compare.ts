// The compare table beside Fig. 60, as an HTML string so the build and the browser render the same
// thing. Each number links to its row on the sources page and opens there in the side view; a gap
// says why it is a gap.
import { COMPARE_ROWS, type LabModel } from './model';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
/** Same rule as anchor() in lib/facts.ts. */
const anchor = (id: string) => `f-${id.replace(/[^A-Za-z0-9_.-]/g, '-')}`;

export function compareTable(rows: LabModel[], ids: string[], base: string) {
  const pick = ids.map((id) => rows.find((r) => r.id === id)).filter((r): r is LabModel => !!r);
  if (!pick.length) return '<p class="ml-empty">Pick up to three models.</p>';
  const head = pick.map((r) => `<th scope="col"><a href="${esc(r.card)}" data-side>${esc(r.name)}</a></th>`).join('');
  const body = COMPARE_ROWS.map((row) => {
    const cells = pick.map((r) => {
      const c = row.get(r);
      if (!c) return '<td><span class="gap">not published</span></td>';
      if ('gap' in c) return `<td><span class="gap">${c.gap}</span></td>`;
      if (c.id) return `<td><a class="ml-src" href="${base}sources/#${anchor(c.id)}" data-side>${esc(c.text)}</a></td>`;
      return `<td>${esc(c.text)}</td>`;
    }).join('');
    return `<tr><th scope="row">${row.name}</th>${cells}</tr>`;
  }).join('');
  return `<table class="ml-compare" data-n="${pick.length}"><thead><tr><td></td>${head}</tr></thead><tbody>${body}</tbody></table>`;
}
