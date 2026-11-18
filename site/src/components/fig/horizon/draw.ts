// Fig. 7, drawn as a flat chart at a given pixel width (see fig/sample/ for the pattern): once at
// build time for the no-JS frame, then again at the drawing's real width so labels stay 13 px.
import * as c from '../kit/chart';
import { year, short, type HorizonInputs, type Mode } from './model';

const n1 = (v: number) => String(Math.round(v * 10) / 10);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const text = (x: number, y: number, s: string, anchor: 'start' | 'middle' | 'end' = 'start', cls = 'c-label') =>
  `<text class="${cls}" x="${n1(x)}" y="${n1(y)}" text-anchor="${anchor}" dominant-baseline="middle">${esc(s)}</text>`;

const HOUR_STEPS = [1, 2, 4, 6, 8, 12, 24, 48];
const LOG_TICKS = [1 / 60, 10 / 60, 1, 10, 60, 600, 6000];

export function draw(x: HorizonInputs, width: number, mode: Mode) {
  const height = Math.round(Math.min(340, Math.max(250, width * 0.56)));
  const narrow = width < 480;
  const m = { l: narrow ? 46 : 56, r: 14, t: 14, b: 34 };
  const all = [...x.p50, ...x.p80];
  const years = all.map((p) => year(p.released));
  const sx = c.linear([Math.floor(Math.min(...years)), Math.max(...years) + 0.35], [m.l, width - m.r]);
  const top = Math.max(...all.map((p) => p.minutes));
  const lo = Math.min(...x.p50.map((p) => p.minutes)) / 2.5;
  const hi = Math.max(...x.p50.map((p) => p.high ?? p.minutes), x.unreliableAbove) * 1.3;
  const stepH = HOUR_STEPS.find((h) => (top * 1.08) / 60 / h <= 5) ?? 48;
  const sy = mode === 'log' ? c.log([lo, hi], [height - m.b, m.t]) : c.linear([0, top * 1.08], [height - m.b, m.t]);
  const [yMin, yMax] = sy.domain;
  const clampY = (v: number) => sy(Math.min(yMax, Math.max(yMin, v)));
  const ticks = mode === 'log'
    ? LOG_TICKS.filter((v) => v >= yMin && v <= yMax)
    : Array.from({ length: Math.floor((top * 1.08) / 60 / stepH) + 1 }, (_, i) => i * stepH * 60);

  const grid = ticks.map((v) => {
    const y = n1(sy(v));
    return `<path class="c-grid" d="M${m.l} ${y}H${n1(width - m.r)}"/>` + text(m.l - 8, sy(v), v === 0 ? '0' : short(v), 'end');
  }).join('');
  const yearStep = narrow ? 2 : 1;
  const [y0, y1] = sx.domain;
  const xTicks = [];
  for (let yr = Math.ceil(y0); yr <= y1; yr += yearStep) xTicks.push(yr);
  const xAxis = `<path class="c-axis" d="M${m.l} ${n1(height - m.b)}H${n1(width - m.r)}"/>` +
    xTicks.map((yr) => `<path class="c-axis" d="M${n1(sx(yr))} ${n1(height - m.b)}v5"/>` + `<text class="c-label" x="${n1(sx(yr))}" y="${n1(height - m.b + 21)}" text-anchor="middle">${yr}</text>`).join('');

  // METR's limit of trust, a dashed line, with its label above it on the left.
  const uy = sy(x.unreliableAbove);
  const limit = uy >= m.t
    ? `<path class="c-grid hz-limit" d="M${m.l} ${n1(uy)}H${n1(width - m.r)}"/>` + text(m.l + 6, uy - 10, `Above ${short(x.unreliableAbove)}: METR calls it unreliable`)
    : '';

  const ci = x.p50.filter((p) => p.low !== undefined && p.high !== undefined)
    .map((p) => `<path class="c-grid hz-ci" d="M${n1(sx(year(p.released)))} ${n1(clampY(p.low!))}V${n1(clampY(p.high!))}"/>`).join('');
  const p50 = x.p50.map((p) => [sx(year(p.released)), sy(p.minutes)] as [number, number]);
  const p80 = x.p80.map((p) => [sx(year(p.released)), sy(p.minutes)] as [number, number]);
  const last50 = p50[p50.length - 1]!, last80 = p80[p80.length - 1]!;

  return `<svg class="c-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" focusable="false" style="display:block;width:100%;height:auto">` +
    grid + limit + xAxis + ci +
    c.series(p80, 'blue') + c.points(p80, 'blue', 3.5) +
    c.series(p50) + c.points(p50.slice(0, -1)) + c.points([last50], 'lit', 5) +
    (mode === 'log'
      ? text(p50[p50.length - 6]![0] - 10, p50[p50.length - 6]![1] - 16, 'Half of tasks', 'end', 'c-label hz-key') +
        text(p80[0]![0] - 10, p80[0]![1] + 16, '4 in 5 tasks', 'end', 'c-label hz-key hz-key-80')
      : text(last50[0] - 12, last50[1] + 4, 'Half of tasks', 'end', 'c-label hz-key') +
        text(last80[0] - 12, last80[1] + 16, '4 in 5 tasks', 'end', 'c-label hz-key hz-key-80')) +
    '</svg>';
}
