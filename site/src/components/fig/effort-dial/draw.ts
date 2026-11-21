// Fig. 11 drawing: two flat panels sharing one row of effort levels. Above, each model's index score
// at each level; below, the output tokens one model wrote over the whole test run. The selected
// level is a shaded column, its points and bar lit. Real pixels, redrawn at the drawing's width.
import * as c from '../kit/chart';
import type { EffortInputs } from './model';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const n1 = (v: number) => String(Math.round(v * 10) / 10);
const TONES = ['ink', 'blue'] as const;

/** Runs of consecutive non-null points, so a missing level leaves a gap. */
function runs(pts: ([number, number] | null)[]) {
  const out: [number, number][][] = [];
  let cur: [number, number][] = [];
  for (const p of pts) {
    if (p) cur.push(p);
    else if (cur.length) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
}

export function draw(x: EffortInputs, width: number, selected: number) {
  const m = { l: 46, r: 14, t: 26, b: 30 };
  const h1 = Math.round(Math.min(210, Math.max(170, width * 0.32)));
  const h2 = Math.round(h1 * 0.62);
  const gap = 40;
  const height = m.t + h1 + gap + h2 + m.b;
  const n = x.levels.length;
  const bw = (width - m.l - m.r) / n;
  const cx = (i: number) => m.l + (i + 0.5) * bw;

  const all = x.models.flatMap((s) => s.scores).filter((v): v is number => v != null);
  const lo = Math.floor((Math.min(...all) - 4) / 10) * 10, hi = Math.ceil((Math.max(...all) + 2) / 10) * 10;
  const top0 = m.t, top1 = m.t + h1;
  const y = c.linear([lo, hi], [top1, top0]);

  const tv = x.tokens.values.filter((v): v is number => v != null);
  const bot0 = top1 + gap, bot1 = bot0 + h2;
  const yt = c.linear([0, Math.max(...tv)], [bot1, bot0]);

  const band = `<rect class="ed-band" x="${n1(m.l + selected * bw + 2)}" y="${n1(top0 - 6)}" width="${n1(bw - 4)}" height="${n1(bot1 - top0 + 6)}" rx="6"/>`;

  const lines = x.models.map((s, k) => {
    const pts = s.scores.map((v, i) => (v == null ? null : ([cx(i), y(v)] as [number, number])));
    const segs = runs(pts).map((r) => c.series(r, TONES[k % 2])).join('');
    const dots = pts.map((p, i) => (p ? `<circle class="ed-dot" data-tone="${TONES[k % 2]}"${i === selected ? ' data-on' : ''} cx="${n1(p[0])}" cy="${n1(p[1])}" r="${i === selected ? 6 : 4}"/>` : '')).join('');
    return segs + dots;
  }).join('');

  const bars = x.tokens.values.map((v, i) => {
    if (v == null) return '';
    const w = Math.min(44, bw * 0.46);
    return `<rect class="ed-bar"${i === selected ? ' data-on' : ''} x="${n1(cx(i) - w / 2)}" y="${n1(yt(v))}" width="${n1(w)}" height="${n1(bot1 - yt(v))}" rx="2"/>`;
  }).join('');

  const fmtTok = (v: number) => (v === 0 ? '0' : `${Math.round(v / 1e6)}M`);
  const levelLabels = x.levels.map((l, i) =>
    `<text class="c-label${i === selected ? ' ed-on' : ''}" x="${n1(cx(i))}" y="${n1(bot1 + 8 + c.FONT_PX)}" text-anchor="middle">${esc(l)}</text>`).join('');

  return `<svg class="c-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" focusable="false" style="display:block;width:100%;height:auto">` +
    band +
    `<text class="c-label ed-title" x="${m.l - 38}" y="${n1(top0 - 12)}">Index score</text>` +
    c.yAxis(y, m.l, width - m.r, String, 6) +
    lines +
    `<text class="c-label ed-title" x="${m.l - 38}" y="${n1(bot0 - 12)}">Output tokens, ${esc(x.tokens.name)}</text>` +
    c.yAxis(yt, m.l, width - m.r, fmtTok, 3) +
    `<path class="c-axis" d="M${m.l} ${n1(bot1)}H${n1(width - m.r)}"/>` +
    bars + levelLabels +
    '</svg>';
}
