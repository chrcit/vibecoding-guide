// Fig. 62 drawing: release dates on one line, in real pixels. Models in the current data above the
// line, lit; METR's state-of-the-art models since 2019 below it, faint. Names go in lanes so they do
// not overlap; a name that finds no lane is left to the mark's own label. Each mark opens in the
// side view (a model card, or the METR row on the sources page).
import * as c from '../kit/chart';

export interface Release { name: string; day: number; kind: 'current' | 'metr'; href: string }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const n1 = (v: number) => String(Math.round(v * 10) / 10);
const CH = 7.9;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function draw(all: Release[], from: number, to: number, width: number) {
  const items = all.filter((r) => r.day >= from && r.day <= to).sort((a, b) => a.day - b.day);
  const lanes = 3;
  const laneH = 20;
  const mid = 16 + lanes * laneH + 10;
  const height = mid + 10 + lanes * laneH + 30;
  const m = { l: 14, r: 14 };
  const x = c.linear([from, to], [m.l, width - m.r]);
  const span = to - from;

  // Ticks: years for a long span, months for a short one.
  const ticks: { day: number; text: string }[] = [];
  const d = new Date(from * 864e5);
  d.setUTCDate(1);
  const yearly = span > 800;
  if (yearly) d.setUTCMonth(0);
  while (d.getTime() / 864e5 <= to) {
    yearly ? d.setUTCFullYear(d.getUTCFullYear() + 1) : d.setUTCMonth(d.getUTCMonth() + 1);
    const day = Math.round(d.getTime() / 864e5);
    if (day > to) break;
    const every = yearly ? (width < 520 ? 2 : 1) : width < 520 ? 3 : span > 400 ? 2 : 1;
    const idx = yearly ? d.getUTCFullYear() : d.getUTCMonth();
    if (idx % every === 0) ticks.push({ day, text: yearly || d.getUTCMonth() === 0 ? String(d.getUTCFullYear()) : MONTHS[d.getUTCMonth()]! });
  }
  const axis = `<path class="c-axis" d="M${m.l} ${mid}H${width - m.r}"/>` + ticks.map((t) =>
    `<path class="c-grid" d="M${n1(x(t.day))} ${mid - 4}V${mid + 4}"/><text class="c-label" x="${n1(x(t.day))}" y="${height - 8}" text-anchor="middle">${esc(t.text)}</text>`).join('');

  const used: { up: boolean; lane: number; x0: number; x1: number }[] = [];
  const marks = items.map((r) => {
    const px = x(r.day);
    const up = r.kind === 'current';
    const w = r.name.length * CH;
    let label = '';
    for (let lane = 0; lane < lanes; lane++) {
      const anchorEnd = px + w > width - 4;
      const x0 = anchorEnd ? px - w : px, x1 = anchorEnd ? px : px + w;
      if (used.some((u) => u.up === up && u.lane === lane && x0 < u.x1 + 8 && u.x0 < x1 + 8)) continue;
      used.push({ up, lane, x0, x1 });
      const ty = up ? mid - 14 - lane * laneH : mid + 26 + lane * laneH;
      const ly = up ? ty + 4 : ty - 13;
      label = `<path class="rl-stem" d="M${n1(px)} ${mid}V${n1(ly)}"/><text class="c-label rl-name" x="${n1(px + (anchorEnd ? -3 : 3))}" y="${n1(ty)}" text-anchor="${anchorEnd ? 'end' : 'start'}">${esc(r.name)}</text>`;
      break;
    }
    return `<g class="rl-point" data-kind="${r.kind}" data-side="${esc(r.href)}" tabindex="0" role="button" aria-label="${esc(`${r.name}, released ${new Date(r.day * 864e5).toUTCString().slice(5, 16)}`)}"><title>${esc(r.name)}</title>${label}<circle class="rl-hit" cx="${n1(px)}" cy="${mid}" r="12"/><circle class="rl-dot" cx="${n1(px)}" cy="${mid}" r="${up ? 5.5 : 4}"/></g>`;
  }).join('');

  return `<svg class="c-svg rl-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="display:block;width:100%;height:auto">${axis}${marks}</svg>`;
}
