/*
 * Flat chart helpers for the data figures (time horizon, score against cost, effort).
 * Same frame, tokens and stroke language as the isometric figures; see ../FIGURES.md.
 *
 * Charts are drawn in real pixels: the client script measures the drawing's width and redraws, so a
 * 13 px label is 13 px on screen. The build-time render uses DEFAULT_WIDTH for the no-JS frame.
 */

export const DEFAULT_WIDTH = 640;
export const FONT_PX = 13;

export interface Scale {
  (v: number): number;
  domain: [number, number];
  range: [number, number];
  ticks: (count?: number) => number[];
}

/** Round step: 1, 2 or 5 times a power of ten. */
function step(span: number, count: number) {
  const raw = span / Math.max(1, count);
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m >= 5 ? 10 : m >= 2 ? 5 : m >= 1 ? 2 : 1) * p;
}

export function linear(domain: [number, number], range: [number, number]): Scale {
  const [d0, d1] = domain, [r0, r1] = range;
  const f = ((v: number) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0)) as Scale;
  f.domain = domain;
  f.range = range;
  f.ticks = (count = 5) => {
    const s = step(d1 - d0, count), out: number[] = [];
    for (let v = Math.ceil(d0 / s) * s; v <= d1 + s * 1e-9; v += s) out.push(Math.round(v / s) * s);
    return out;
  };
  return f;
}

export function log(domain: [number, number], range: [number, number]): Scale {
  const [l0, l1] = [Math.log10(domain[0]), Math.log10(domain[1])], [r0, r1] = range;
  const f = ((v: number) => r0 + ((Math.log10(v) - l0) / (l1 - l0 || 1)) * (r1 - r0)) as Scale;
  f.domain = domain;
  f.range = range;
  f.ticks = () => {
    const out: number[] = [];
    for (let e = Math.ceil(l0); e <= Math.floor(l1); e++) out.push(10 ** e);
    return out;
  };
  return f;
}

const n1 = (v: number) => String(Math.round(v * 10) / 10);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const polyline = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${n1(x)} ${n1(y)}`).join('');

/** Gridlines across the plot and labels on the left. `format` turns a value into its label. */
export function yAxis(s: Scale, x0: number, x1: number, format: (v: number) => string, count = 5) {
  return s.ticks(count).map((v) => {
    const y = n1(s(v));
    return `<path class="c-grid" d="M${n1(x0)} ${y}H${n1(x1)}"/><text class="c-label" x="${n1(x0 - 8)}" y="${y}" text-anchor="end" dominant-baseline="middle">${esc(format(v))}</text>`;
  }).join('');
}

/** The baseline and tick labels along the bottom. */
export function xAxis(s: Scale, y: number, format: (v: number) => string, count = 5) {
  const [r0, r1] = s.range;
  return `<path class="c-axis" d="M${n1(r0)} ${n1(y)}H${n1(r1)}"/>` +
    s.ticks(count).map((v) => `<path class="c-axis" d="M${n1(s(v))} ${n1(y)}v5"/><text class="c-label" x="${n1(s(v))}" y="${n1(y + 8 + FONT_PX)}" text-anchor="middle">${esc(format(v))}</text>`).join('');
}

/** A data line; `tone` is `ink` (default), `lit` (the one to look at), `green` or `blue`. */
export const series = (pts: [number, number][], tone: 'ink' | 'lit' | 'green' | 'blue' = 'ink') =>
  `<path class="c-series" data-tone="${tone}" d="${polyline(pts)}"/>`;

/** Data points. */
export const points = (pts: [number, number][], tone: 'ink' | 'lit' | 'green' | 'blue' = 'ink', r = 4) =>
  `<g class="c-points" data-tone="${tone}">${pts.map(([x, y]) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}"/>`).join('')}</g>`;
