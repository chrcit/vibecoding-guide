// Fig. 40, drawn: a working week as three lanes on one time axis, Monday to Friday night.
//   Work: one band per working day, as tall as the threads running. Ink where work runs, hatched
//     where the plan may have stopped it (inside a published range), accent hatch where it has.
//   Five-hour window: each window from the first message to its reset. A level rises in it only
//     where the provider publishes a size; elsewhere the window is drawn empty and says so.
//   API meter: what the same week costs on the API, climbing with every hour of work, against the
//     plan's flat price for the week.
// Drawn in real pixels at the drawing's width (see kit/chart.ts), so 13 px text is 13 px.
import { FONT_PX } from '../kit/chart';
import { ASSUME, crossover, usd, type Week } from './model';

export interface Sides { work: string; window: string; meter: string }

const n1 = (v: number) => String(Math.round(v * 10) / 10);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const HEIGHT = 352;

export function drawWeek(w: Week, width: number, uid: string, sides: Sides): string {
  const W = Math.max(300, Math.round(width));
  const narrow = W < 520;
  const x = (h: number) => (h / w.span) * W;
  const parts: string[] = [];
  const text = (tx: number, ty: number, s: string, cls = 'pw-t', anchor = 'start') =>
    `<text class="${cls}" x="${n1(tx)}" y="${n1(ty)}" text-anchor="${anchor}">${esc(s)}</text>`;

  // Days and nights.
  const days = Math.ceil(w.span / 24);
  for (let d = 0; d < days; d++) {
    const x0 = x(d * 24), x1 = x(Math.min(w.span, (d + 1) * 24));
    if (d > 0) parts.push(`<path class="pw-mid" d="M${n1(x0)} 22V${HEIGHT}"/>`);
    const name = narrow ? DAYS[d]!.slice(0, 1) : DAYS[d]!.slice(0, 3);
    if (x1 - x0 > 14) parts.push(text((x0 + x1) / 2, 14, name, 'pw-t pw-day', 'middle'));
  }

  // ---- Work lane ----
  const WORK_TOP = 48, WORK_H = 72, workBase = WORK_TOP + WORK_H;
  const threads = Math.max(1, Math.round(w.threadHours / w.workHours));
  const bandH = 12 + ((Math.min(16, threads) - 1) / 15) * (WORK_H - 12);
  const work: string[] = [text(0, WORK_TOP - 10, narrow ? `Work, ${threads} ×` : `Work: ${threads} ${threads === 1 ? 'thread' : 'threads'}`)];
  work.push(`<path class="pw-base" d="M0 ${workBase}H${W}"/>`);
  if (w.blocked) {
    work.push(text(W / 2, WORK_TOP + WORK_H / 2 + 5, w.blocked === 'agent' ? 'The coding agent is not on this plan' : 'This plan does not run this model', 'pw-t pw-ink', 'middle'));
  }
  for (const s of w.segments) {
    const x0 = x(s.from), x1 = Math.max(x(s.to), x0 + 1);
    work.push(`<rect class="pw-${s.state}" x="${n1(x0)}" y="${n1(workBase - bandH)}" width="${n1(x1 - x0)}" height="${n1(bandH)}" ${s.state === 'stop' ? `fill="url(#${uid}-stop)"` : s.state === 'maybe' ? `fill="url(#${uid}-maybe)"` : ''}/>`);
  }
  parts.push(`<g class="pw-lane" data-side="${esc(sides.work)}" tabindex="0" role="button" aria-label="Work lane: threads running each day. Open: running agents in parallel">${work.join('')}</g>`);

  // ---- Window lane ----
  const WIN_TOP = 160, WIN_H = 44, winBase = WIN_TOP + WIN_H;
  const win: string[] = [];
  const kind = w.plan.window.kind;
  const range = w.access?.kind === 'range' ? w.access : null;
  const winTitle = w.plan.provider === 'api' ? 'No windows on a key'
    : w.blocked ? 'Five-hour window'
    : kind === 'none' ? 'No five-hour limit'
    : w.access?.kind === 'credits' ? 'Outside the plan: credits'
    : range ? (narrow ? 'Window: OpenAI estimate' : `Five-hour window: ${range.lo.toLocaleString('en-GB')}–${range.hi.toLocaleString('en-GB')} messages, OpenAI's estimate`)
    : kind === 'elsewhere' ? (narrow ? 'Window: not in our data' : 'Five-hour window: estimates not in this guide\'s data')
    : w.plan.windowHours ? (narrow ? 'Window: size not published' : 'Five-hour window: size not published')
    : (narrow ? 'Short window: not published' : 'Short window: not published');
  win.push(text(0, WIN_TOP - 10, winTitle));
  win.push(`<path class="pw-base" d="M0 ${winBase}H${W}"/>`);
  for (const s of w.windows) {
    const x0 = x(s.from), x1 = x(s.to);
    const known = s.fill !== null;
    win.push(`<rect class="pw-win${known ? '' : ' pw-unknown'}" x="${n1(x0 + 0.5)}" y="${WIN_TOP}" width="${n1(Math.max(1, x1 - x0 - 1))}" height="${WIN_H}" rx="3"/>`);
    if (known) {
      // The high estimate (more room) as a faint line, the low one (less room) as the lit level.
      for (const k of [1, 0] as const) {
        const f = s.fill![k];
        const end = s.full[k] ?? s.last[k];
        const yTop = winBase - f * WIN_H;
        const d = `M${n1(x0)} ${winBase}L${n1(x(end))} ${n1(yTop)}L${n1(x1)} ${n1(yTop)}`;
        if (k === 0) win.push(`<path class="pw-fill" d="${d}V${winBase}Z"/>`);
        win.push(`<path class="${k === 0 ? 'pw-level' : 'pw-level-hi'}" d="${d}"/>`);
        if (s.full[k] !== null && k === 0) win.push(`<circle class="pw-full" cx="${n1(x(s.full[k]!))}" cy="${n1(yTop)}" r="3.5"/>`);
      }
    }
  }
  if (kind === 'none' && !w.blocked && w.plan.provider !== 'api') {
    win.push(`<rect class="pw-open" x="0" y="${WIN_TOP}" width="${W}" height="${WIN_H}" rx="3"/>`);
  }
  parts.push(`<g class="pw-lane" data-side="${esc(sides.window)}" tabindex="0" role="button" aria-label="Window lane: ${esc(winTitle)}. Open: the window and the week">${win.join('')}</g>`);

  // ---- Meter lane ----
  const MET_TOP = 244, MET_H = 92, metBase = MET_TOP + MET_H;
  const met: string[] = [];
  const plan = w.planWeek;
  const top = Math.max(w.apiWeek[1], plan?.[1] ?? 0, 0.01) * 1.04;
  const y = (v: number) => metBase - (v / top) * MET_H;
  met.push(text(0, MET_TOP - 10, narrow ? 'API meter' : 'API meter, this week'));
  met.push(`<path class="pw-base" d="M0 ${metBase}H${W}"/>`);
  // Cumulative cost through the week: rises during work, flat at night.
  const path = (k: 0 | 1) => {
    const pts: string[] = [`M0 ${metBase}`];
    let acc = 0;
    for (let d = 0; d < ASSUME.workdays; d++) {
      const hours = w.workHours / ASSUME.workdays;
      const s = d * 24 + ASSUME.dayStart;
      pts.push(`L${n1(x(s))} ${n1(y(acc))}`);
      acc += w.apiHour[k] * hours;
      pts.push(`L${n1(x(s + hours))} ${n1(y(acc))}`);
    }
    pts.push(`L${W} ${n1(y(acc))}`);
    return pts.join('');
  };
  const ranged = Math.abs(w.apiWeek[1] - w.apiWeek[0]) > 0.005;
  if (ranged) {
    const lo = path(0), hi = path(1);
    // Band between the two lines: the high path forwards, the low one back.
    const back = lo.replace(/^M/, 'L').split('L').filter(Boolean).reverse().map((p) => `L${p}`).join('');
    met.push(`<path class="pw-band" d="${hi}${back}Z"/>`);
    met.push(`<path class="pw-api pw-api-lo" d="${lo}"/>`);
  }
  met.push(`<path class="pw-api" d="${path(1)}"/>`);
  if (plan) {
    if (w.access?.kind === 'credits') {
      met.push(`<path class="pw-plan" d="M0 ${n1(y(plan[0] - w.apiWeek[0]))}H${W}"/>`);
    } else {
      met.push(`<path class="pw-plan" d="M0 ${n1(y(plan[0]))}H${W}"/>`);
      // The plan's label sits at the left, under its line if there is room, clear of the meter's rise.
      const py = y(plan[0]);
      met.push(text(4, py + 18 < metBase - 2 ? py + 18 : py - 8, `Plan ${usd(plan[0])} a week`, 'pw-t pw-ink'));
    }
    const xo = crossover(w);
    if (xo) {
      // Where the API, at its dearer reading, has cost as much as the plan's week.
      const at = xo[0];
      const d = Math.floor(at / (w.workHours / ASSUME.workdays));
      const into = at - d * (w.workHours / ASSUME.workdays);
      const t = d * 24 + ASSUME.dayStart + into;
      met.push(`<circle class="pw-cross" cx="${n1(x(t))}" cy="${n1(y(plan[0]))}" r="5"/>`);
    }
  }
  const endLabel = ranged ? `${usd(w.apiWeek[0])}–${usd(w.apiWeek[1])}` : usd(w.apiWeek[1]);
  met.push(text(W, Math.max(MET_TOP + 4, y(w.apiWeek[1]) - 8), endLabel, 'pw-t pw-lit', 'end'));
  parts.push(`<g class="pw-lane" data-side="${esc(sides.meter)}" tabindex="0" role="button" aria-label="API meter lane: the same week priced on the API, against the plan's price for a week. Open: two ways to pay">${met.join('')}</g>`);

  const defs = `<defs>
    <pattern id="${uid}-stop" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" class="pw-stop-bg"/><path d="M0 0V6" class="pw-stop-line"/></pattern>
    <pattern id="${uid}-maybe" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" class="pw-maybe-bg"/><path d="M0 0V6" class="pw-maybe-line"/></pattern>
  </defs>`;
  void FONT_PX;
  return `<svg class="pw-svg" viewBox="0 0 ${W} ${HEIGHT}" width="${W}" height="${HEIGHT}" aria-hidden="false" focusable="false">${defs}${parts.join('')}</svg>`;
}
