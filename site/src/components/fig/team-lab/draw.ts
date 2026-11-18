// Fig. 30: draws one run of the lab as lanes over time, in real pixels. Used at build time for the
// no-JS frame and again in the browser at the drawing's own width, so text is a true 13px.
// Colours come from classes styled in TeamLab.astro; nothing here names a colour.

import { FONT_PX, linear } from '../kit/chart';
import { hours, type Lane, type PatternId, type Run } from './model';

export const HEIGHT = 390;
const AXIS = 30;
const TOP = 24;
const GAP = 8;
const n1 = (v: number) => String(Math.round(v * 10) / 10);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export interface Target { group: Lane['group'] | 'you'; href: string; label: string }

/** Lane group names, by pattern where they differ. */
export function groupName(group: Lane['group'] | 'you', pattern: PatternId, count: number) {
  if (group === 'you') return 'You';
  if (group === 'planner') return 'Planner';
  if (group === 'lead') return 'Lead';
  if (group === 'reviewer') return 'Reviewer';
  if (pattern === 'lead') return 'Subagents';
  if (pattern === 'best') return 'Two models';
  return count > 1 ? 'Builders' : 'Builder';
}

/**
 * The timeline. `targets` maps a lane group to the page it opens in the side view.
 * `axisMax` fixes the time scale, so two runs can be compared at one scale.
 */
export function drawTimeline(run: Run, width: number, targets: Record<string, string>, axisMax?: number) {
  const narrow = width < 520;
  const labelW = narrow ? 78 : 104;
  const x0 = labelW, x1 = width - 12;
  const end = Math.max(1, axisMax ?? Math.max(run.stats.finish, run.stats.soloFinish) * 1.04);
  const x = linear([0, end], [x0, x1]);

  // Rows: you, then each agent lane, with a gap between groups.
  type Row = { group: Lane['group'] | 'you'; segs: { s: number; e: number; k: string }[] };
  const rows: Row[] = [{ group: 'you', segs: run.you }, ...run.lanes.map((l) => ({ group: l.group, segs: l.segs }))];
  const groups = rows.map((r) => r.group).filter((g, i, a) => a.indexOf(g) === i);
  const plotH = HEIGHT - AXIS - TOP - GAP * (groups.length - 1);
  const laneH = Math.min(46, plotH / rows.length);
  const barH = Math.max(6, Math.min(24, laneH * 0.72));

  let y = TOP;
  let prev: Row['group'] | null = null;
  const placed = rows.map((r) => {
    if (prev && prev !== r.group) y += GAP;
    prev = r.group;
    const at = y;
    y += laneH;
    return { ...r, y: at };
  });
  const bottom = y;

  const out: string[] = [];
  // Ticks and gridlines.
  const ticks = x.ticks(narrow ? 4 : 7).filter((v) => v > 0);
  const hourTicks = end > 180;
  const tickVals = hourTicks ? linear([0, end / 60], [x0, x1]).ticks(narrow ? 4 : 7).map((h) => h * 60) : ticks;
  for (const v of tickVals) {
    if (v <= 0 || v > end) continue;
    const tx = n1(x(v));
    out.push(`<path class="tl-grid" d="M${tx} ${TOP - 4}V${n1(bottom)}"/>`);
    out.push(`<text class="tl-tick" x="${tx}" y="${n1(bottom + 8 + FONT_PX)}" text-anchor="middle">${esc(hourTicks ? `${Math.round(v / 60)} h` : `${Math.round(v)} min`)}</text>`);
  }
  out.push(`<path class="tl-axis" d="M${x0} ${n1(bottom)}H${n1(x1)}"/>`);

  // Bars.
  const bars: string[] = [];
  for (const r of placed) {
    const cy = r.y + laneH / 2;
    bars.push(`<path class="tl-lane" d="M${x0} ${n1(cy)}H${n1(x1)}"/>`);
    for (const sg of r.segs) {
      const bx = x(sg.s), bw = Math.max(1.5, x(sg.e) - x(sg.s));
      const k = r.group === 'you' ? `you-${sg.k}` : sg.k;
      bars.push(`<rect class="tl-bar" data-k="${k}" x="${n1(bx)}" y="${n1(cy - barH / 2)}" width="${n1(bw)}" height="${n1(barH)}" rx="${barH > 10 ? 3 : 1.5}"/>`);
    }
  }
  out.push(`<g class="tl-bars">${bars.join('')}</g>`);

  // Group labels, each a button that opens its explanation.
  for (const g of groups) {
    const lanes = placed.filter((r) => r.group === g);
    const top = lanes[0]!.y, bot = lanes[lanes.length - 1]!.y + laneH;
    const name = groupName(g, run.settings.pattern, lanes.length);
    const label = lanes.length > 1 ? `${name}` : name;
    const count = lanes.length > 1 ? `×${lanes.length}` : '';
    const mid = (top + bot) / 2;
    const href = targets[g];
    const parts = [
      `<rect class="tl-hit" x="0" y="${n1(top)}" width="${labelW - 8}" height="${n1(bot - top)}"/>`,
      lanes.length > 1 ? `<path class="tl-brace" d="M${labelW - 10} ${n1(top + 2)}V${n1(bot - 2)}"/>` : '',
      `<text class="tl-name${g === 'you' ? ' tl-you' : ''}" x="0" y="${n1(count && bot - top > 34 ? mid - 3 : mid)}" dominant-baseline="middle">${esc(label)}</text>`,
      count && bot - top > 34 ? `<text class="tl-count" x="0" y="${n1(mid + FONT_PX + 1)}" dominant-baseline="middle">${count}</text>` : '',
    ].join('');
    out.push(href
      ? `<g class="tl-group" data-side="${esc(href)}" tabindex="0" role="button" aria-label="${esc(`${name}: what this role does`)}">${parts}</g>`
      : `<g class="tl-group">${parts}</g>`);
  }

  // The finish of this run, and of one agent alone for comparison.
  const marks: string[] = [];
  const fx = x(run.stats.finish), sx = x(run.stats.soloFinish);
  const showSolo = run.settings.pattern !== 'solo';
  const doneLabel = `Done ${hours(run.stats.finish)}`;
  const soloLabel = narrow ? `Alone ${hours(run.stats.soloFinish)}` : `One agent ${hours(run.stats.soloFinish)}`;
  const approx = (t: string) => t.length * FONT_PX * 0.6;
  marks.push(`<path class="tl-done" d="M${n1(fx)} ${TOP - 6}V${n1(bottom)}"/>`);
  const doneRight = fx + 6 + approx(doneLabel) < x1 || fx - approx(doneLabel) - 6 < x0;
  marks.push(`<text class="tl-mark tl-mark-done" x="${n1(doneRight ? fx + 5 : fx - 5)}" y="${TOP - 10}" text-anchor="${doneRight ? 'start' : 'end'}">${esc(doneLabel)}</text>`);
  if (showSolo) {
    marks.push(`<path class="tl-solo" d="M${n1(sx)} ${TOP - 6}V${n1(bottom)}"/>`);
    const clash = Math.abs(sx - fx) < approx(doneLabel) + approx(soloLabel) / 2 + 12;
    if (!clash || sx > fx) {
      const right = sx + 6 + approx(soloLabel) < x1;
      marks.push(`<text class="tl-mark" x="${n1(right ? sx + 5 : sx - 5)}" y="${TOP - 10}" text-anchor="${right ? 'start' : 'end'}">${esc(soloLabel)}</text>`);
    }
  }
  out.push(`<g class="tl-marks">${marks.join('')}</g>`);

  // The cover that slides off to play the run; the script moves it.
  out.push(`<rect class="tl-cover" data-cover x="${x0 - 1}" y="${TOP - 26}" width="${n1(x1 - x0 + 14)}" height="${n1(bottom - TOP + 27)}"/>`);
  out.push(`<path class="tl-head" data-head d="M${x0} ${TOP - 6}V${n1(bottom)}"/>`);

  return `<svg class="tl-svg" viewBox="0 0 ${width} ${HEIGHT}" width="${width}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="presentation">${out.join('')}</svg>`;
}

/** A small drawing of each pattern's shape, for its button. Nodes and who hands work to whom. */
export function glyph(id: PatternId) {
  type N = [number, number, 'you' | 'agent' | 'dim'];
  const shapes: Record<PatternId, { n: N[]; e: [number, number][] }> = {
    solo: { n: [[5, 14, 'you'], [37, 14, 'agent']], e: [[0, 1]] },
    review: { n: [[5, 14, 'you'], [21, 5, 'agent'], [37, 14, 'agent']], e: [[0, 1], [1, 2], [2, 0]] },
    plan: { n: [[4, 14, 'you'], [14, 14, 'agent'], [26, 5, 'agent'], [26, 14, 'agent'], [26, 23, 'agent'], [39, 14, 'agent']], e: [[0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [3, 5], [4, 5]] },
    parallel: { n: [[5, 14, 'you'], [37, 4, 'agent'], [37, 14, 'agent'], [37, 24, 'agent']], e: [[0, 1], [0, 2], [0, 3]] },
    lead: { n: [[4, 14, 'you'], [17, 14, 'agent'], [37, 4, 'agent'], [37, 14, 'agent'], [37, 24, 'agent']], e: [[0, 1], [1, 2], [1, 3], [1, 4]] },
    best: { n: [[5, 14, 'you'], [37, 6, 'agent'], [37, 22, 'dim']], e: [[0, 1], [0, 2]] },
  };
  const g = shapes[id];
  const lines = g.e.map(([a, b]) => {
    const [ax, ay] = g.n[a]!, [bx, by] = g.n[b]!;
    return `<path d="M${ax} ${ay}L${bx} ${by}"${g.n[b]![2] === 'dim' ? ' class="g-dim"' : ''}/>`;
  }).join('');
  const dots = g.n.map(([cx, cy, k]) => `<circle cx="${cx}" cy="${cy}" r="${k === 'you' ? 3.6 : 3}" class="g-${k}"/>`).join('');
  return `<svg class="glyph" viewBox="-1 -1 46 30" width="60" height="38" aria-hidden="true"><g class="g-lines">${lines}</g>${dots}</svg>`;
}
