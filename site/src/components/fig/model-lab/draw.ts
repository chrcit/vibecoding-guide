// Fig. 60 drawing: a flat scatter in real pixels on the axes the reader picked. One mark per model
// (circle or square by lab), the compared models ringed in the accent and always named, the rest
// named where there is room. Each mark is a button that opens the model's card in the side view.
import * as c from '../kit/chart';
import { has, metric, type LabModel, type MetricKey } from './model';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const n1 = (v: number) => String(Math.round(v * 10) / 10);
const LOG_TICKS = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5, 2e5, 5e5, 1e6, 2e6, 5e6, 1e7];
/** Rough width of a 13px mono character, for label collision. */
const CH = 7.9;

function scale(rows: LabModel[], key: MetricKey, range: [number, number], narrow: boolean): c.Scale {
  const m = metric(key);
  const vals = rows.map((r) => (r.cells[key] as { v: number }).v);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (m.log) {
    if (lo === hi) { lo /= 3; hi *= 3; } else { lo /= 1.8; hi *= 1.8; }
    const s = c.log([lo, hi], range);
    const t = LOG_TICKS.filter((v) => v >= lo && v <= hi);
    const keep = t.length > (narrow ? 4 : 7) ? t.filter((v) => Math.abs(Math.log10(v) - Math.round(Math.log10(v))) < 1e-9) : t;
    s.ticks = () => (keep.length >= 2 ? keep : t);
    return s;
  }
  if (key === 'released') {
    const pad = Math.max(10, (hi - lo) * 0.08);
    const s = c.linear([lo - pad, hi + pad], range);
    // Month starts as ticks.
    s.ticks = () => {
      const out: number[] = [];
      const d = new Date((lo - pad) * 864e5);
      d.setUTCDate(1);
      const step = (hi - lo) / 30 > (narrow ? 3 : 7) ? 3 : 1;
      while (d.getTime() / 864e5 <= hi + pad) {
        d.setUTCMonth(d.getUTCMonth() + 1);
        if (d.getUTCMonth() % step === 0) out.push(Math.round(d.getTime() / 864e5));
      }
      return out.filter((v) => v >= lo - pad && v <= hi + pad);
    };
    return s;
  }
  const pad = lo === hi ? 5 : (hi - lo) * 0.1;
  return c.linear([Math.floor((lo - pad) / 5) * 5, Math.ceil((hi + pad) / 5) * 5], range);
}

interface Box { x: number; y: number; w: number; h: number }
const hit = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

export function draw(rows: LabModel[], x: MetricKey, y: MetricKey, width: number, height: number, compared: string[]) {
  const narrow = width < 520;
  const m = { l: narrow ? 46 : 54, r: 16, t: 14, b: 40 };
  const on = rows.filter((r) => has(r.cells[x]) && has(r.cells[y]));
  if (!on.length) {
    return `<svg class="c-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true"><text class="c-label" x="${width / 2}" y="${height / 2}" text-anchor="middle">No model in the filter has both numbers</text></svg>`;
  }
  const sx = scale(on, x, [m.l, width - m.r], narrow);
  const sy = scale(on, y, [height - m.b, m.t], narrow);
  const mx = metric(x), my = metric(y);
  const labs = [...new Set(rows.map((r) => r.lab))];
  const tone = (lab: string) => (labs.indexOf(lab) === 0 ? 'ink' : 'blue');
  const xy = (r: LabModel): [number, number] => [sx((r.cells[x] as { v: number }).v), sy((r.cells[y] as { v: number }).v)];

  const grid = c.yAxis(sy, m.l, width - m.r, my.format, 6) + c.xAxis(sx, height - m.b, mx.format, 6);

  // Labels: compared models first, then the rest wherever they fit.
  const taken: Box[] = on.map((r) => { const [px, py] = xy(r); return { x: px - 7, y: py - 7, w: 14, h: 14 }; });
  const order = [...on].sort((a, b) => Number(compared.includes(b.id)) - Number(compared.includes(a.id)));
  const labels: string[] = [];
  for (const r of order) {
    const [px, py] = xy(r);
    const w = r.name.length * CH, h = 16;
    const tries: [number, number, string][] = [[px + 11, py - 11, 'start'], [px - 11, py - 11, 'end'], [px + 11, py + 20, 'start'], [px - 11, py + 20, 'end']];
    const mine = compared.includes(r.id);
    for (const [tx, ty, anchor] of tries) {
      const box = { x: anchor === 'start' ? tx : tx - w, y: ty - 12, w, h };
      if (box.x < 2 || box.x + box.w > width - 2 || box.y < 0 || box.y + box.h > height - m.b) continue;
      if (taken.some((t) => hit(t, box))) continue;
      taken.push(box);
      labels.push(`<text class="c-label ml-name"${mine ? ' data-on' : ''} x="${n1(tx)}" y="${n1(ty)}" text-anchor="${anchor}">${esc(r.name)}</text>`);
      break;
    }
  }

  const marks = on.map((r) => {
    const [px, py] = xy(r);
    const mine = compared.includes(r.id);
    const rr = mine ? 7 : 5.5;
    const shape = labs.indexOf(r.lab) === 0
      ? `<circle cx="${n1(px)}" cy="${n1(py)}" r="${rr}"/>`
      : `<rect x="${n1(px - rr * 0.9)}" y="${n1(py - rr * 0.9)}" width="${n1(rr * 1.8)}" height="${n1(rr * 1.8)}" rx="1.5"/>`;
    const label = `${r.name}: ${my.short} ${(r.cells[y] as { text: string }).text}, ${mx.short} ${(r.cells[x] as { text: string }).text}. Open its card`;
    return `<g class="ml-point" data-id="${esc(r.id)}" data-tone="${tone(r.lab)}"${mine ? ' data-on' : ''} data-side="${esc(r.card)}" tabindex="0" role="button" aria-label="${esc(label)}">` +
      `<circle class="ml-hit" cx="${n1(px)}" cy="${n1(py)}" r="18"/>${mine ? `<circle class="ml-ring" cx="${n1(px)}" cy="${n1(py)}" r="12"/>` : ''}${shape}</g>`;
  }).join('');

  return `<svg class="c-svg ml-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="display:block;width:100%;height:auto">` +
    grid + labels.join('') + marks + '</svg>';
}
