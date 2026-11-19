// Fig. 31: two small charts on one axis of agents, drawn in real pixels.
import { FONT_PX, linear, series, points } from '../kit/chart';
import { knee, MAX, type Row } from './model';

export const HEIGHT = 250;
const n1 = (v: number) => String(Math.round(v * 10) / 10);

export function drawQueue(rows: Row[], current: number, width: number) {
  const x0 = 44, x1 = width - 10;
  const x = linear([1, MAX], [x0, x1]);
  const k = knee(rows);
  const out: string[] = [];
  const panel = (top: number, h: number, title: string, max: number, val: (r: Row) => number, fmt: (v: number) => string, tone: 'ink' | 'lit') => {
    const y = linear([0, max], [top + h, top + 30]);
    out.push(`<text class="pq-title" x="${x0}" y="${top + FONT_PX}">${title}</text>`);
    for (const v of [0, max / 2, max]) {
      out.push(`<path class="c-grid" d="M${x0} ${n1(y(v))}H${n1(x1)}"/><text class="c-label" x="${x0 - 6}" y="${n1(y(v))}" text-anchor="end" dominant-baseline="middle">${fmt(v)}</text>`);
    }
    const pts = rows.map((r) => [x(r.n), y(val(r))] as [number, number]);
    out.push(series(pts, tone));
    out.push(points([[x(k.n), y(val(k))]], 'ink', 3.5));
  };
  const maxH = Math.max(...rows.map((r) => r.finish)) / 60;
  const step = maxH > 20 ? 10 : maxH > 8 ? 5 : maxH > 4 ? 2 : 1;
  const top = Math.ceil(maxH / step) * step;
  panel(0, 100, 'Time to finish', top, (r) => r.finish / 60, (v) => `${Math.round(v)} h`, 'ink');
  panel(110, 104, 'Your share of the run', 1, (r) => r.busy, (v) => `${Math.round(v * 100)}%`, 'lit');
  // Shared axis of agents.
  out.push(`<path class="c-axis" d="M${x0} 214H${n1(x1)}"/>`);
  for (const v of [1, 4, 8, 12, 16]) out.push(`<text class="c-label" x="${n1(x(v))}" y="${214 + 6 + FONT_PX}" text-anchor="middle">${v}</text>`);
  out.push(`<text class="c-label" x="${n1(x1)}" y="${HEIGHT - 2}" text-anchor="end">agents</text>`);
  out.push(`<path class="pq-now" d="M${n1(x(current))} 16V214"/>`);
  return `<svg class="pq-svg" viewBox="0 0 ${width} ${HEIGHT}" width="${width}" height="${HEIGHT}" role="presentation">${out.join('')}</svg>`;
}
