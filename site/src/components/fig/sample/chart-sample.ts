import * as c from '../kit/chart';

export type Point = [number, number];

/** The whole chart as an SVG string at `width` real pixels. */
export function draw(points: Point[], width: number, mode: 'linear' | 'log') {
  const height = Math.round(Math.min(320, Math.max(220, width * 0.5)));
  const m = { l: 52, r: 16, t: 12, b: 36 };
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const x = c.linear([Math.min(...xs), Math.max(...xs)], [m.l, width - m.r]);
  const top = Math.max(...ys);
  const y = mode === 'log'
    ? c.log([10 ** Math.floor(Math.log10(Math.min(...ys))), 10 ** Math.ceil(Math.log10(top))], [height - m.b, m.t])
    : c.linear([0, top], [height - m.b, m.t]);
  const xy = points.map(([a, b]) => [x(a), y(b)] as Point);
  const fmt = (v: number) => (v >= 1000 ? `${v / 1000}k` : String(v));
  return `<svg class="c-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" focusable="false" style="display:block;width:100%;height:auto">` +
    c.yAxis(y, m.l, width - m.r, fmt, 4) +
    c.xAxis(x, height - m.b, String, Math.max(4, Math.floor(width / 110))) +
    c.series(xy, 'lit') + c.points(xy.slice(-1), 'lit') + c.points(xy.slice(0, -1)) +
    '</svg>';
}
