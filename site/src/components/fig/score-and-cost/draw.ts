// Fig. 10 drawing: a flat scatter in real pixels. Price on a log scale along the bottom, index score
// up the side, a faint line joining each lab's family from cheapest to dearest, and the selected
// model lit and named. Drawn once at build time and redrawn at the drawing's real width.
import * as c from '../kit/chart';
import type { ScorePoint } from './model';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const n1 = (v: number) => String(Math.round(v * 10) / 10);
const CANDIDATES = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];

/** Shape per lab, in order of first appearance: circle, then square. */
function mark(shape: number, x: number, y: number, r: number) {
  if (shape === 0) return `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}"/>`;
  const s = r * 0.9;
  return `<rect x="${n1(x - s)}" y="${n1(y - s)}" width="${n1(2 * s)}" height="${n1(2 * s)}" rx="1.5"/>`;
}

export function draw(points: ScorePoint[], width: number, selected: number) {
  const narrow = width < 480;
  const height = Math.round(Math.min(380, Math.max(280, width * 0.62)));
  const m = { l: 40, r: 18, t: 14, b: 36 };
  const outs = points.map((p) => p.output), scores = points.map((p) => p.score);
  const x = c.log([Math.min(...outs) / 1.7, Math.max(...outs) * 1.7], [m.l, width - m.r]);
  const ticks = CANDIDATES.filter((v) => v >= x.domain[0] && v <= x.domain[1]);
  x.ticks = () => (narrow ? ticks.filter((_, i) => i % 2 === 0) : ticks);
  const lo = Math.floor((Math.min(...scores) - 4) / 10) * 10, hi = Math.ceil((Math.max(...scores) + 4) / 10) * 10;
  const y = c.linear([lo, hi], [height - m.b, m.t]);
  const labs = [...new Set(points.map((p) => p.lab))];
  const tone = (lab: string) => (labs.indexOf(lab) === 0 ? 'ink' : 'blue');
  const xy = (p: ScorePoint): [number, number] => [x(p.output), y(p.score)];

  const families = labs.map((lab) => {
    const pts = points.filter((p) => p.lab === lab).sort((a, b) => a.output - b.output).map(xy);
    return pts.length > 1 ? `<path class="sc-family" data-tone="${tone(lab)}" d="${c.polyline(pts)}"/>` : '';
  }).join('');

  const marks = points.map((p, i) => {
    const [px, py] = xy(p);
    const shape = labs.indexOf(p.lab) === 0 ? 0 : 1;
    return `<g class="sc-point" data-i="${i}" data-tone="${tone(p.lab)}"${i === selected ? ' data-on' : ''}>` +
      `<circle class="sc-hit" cx="${n1(px)}" cy="${n1(py)}" r="16"/>${mark(shape, px, py, i === selected ? 7 : 5)}</g>`;
  }).join('');

  let label = '';
  const s = points[selected];
  if (s) {
    const [px, py] = xy(s);
    const right = px < width * 0.62;
    const above = py > m.t + 30;
    label = `<text class="c-label sc-name" x="${n1(px + (right ? 11 : -11))}" y="${n1(py + (above ? -11 : 22))}" text-anchor="${right ? 'start' : 'end'}">${esc(s.name)}</text>`;
  }

  return `<svg class="c-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" focusable="false" style="display:block;width:100%;height:auto">` +
    c.yAxis(y, m.l, width - m.r, String, 6) +
    c.xAxis(x, height - m.b, (v) => (v < 1 ? `$${v.toFixed(2)}` : `$${v}`)) +
    families + marks + label +
    '</svg>';
}
