// Fig. 36, a new thread is cheaper than a long one. Every turn sends the whole window, so the
// tokens sent over a run of tasks are the area under the window's size. One long thread carries
// every earlier task; a fresh thread per task starts from the instructions each time.
// Sizes reuse the lab's assumptions (context-lab/model.ts); the compaction point and the price are
// passed in from src/data/.
import { HARNESS_TOKENS, TOKENS_PER_LINE, FILE_TOKENS, MESSAGE_TOKENS, RESULT_TOKENS, SUMMARY_TOKENS } from '../context-lab/model';

/** Instructions before the task: the harness plus a 120-line instruction file. */
export const FIXED = HARNESS_TOKENS + 120 * TOKENS_PER_LINE;
/** Files each task reads when it starts. */
export const TASK_FILES = 10 * FILE_TOKENS;
export const PER_TURN = MESSAGE_TOKENS + RESULT_TOKENS.typical;
/** What a compaction leaves besides the instructions: the summary and five files re-read. */
export const AFTER_COMPACT = SUMMARY_TOKENS + 5 * FILE_TOKENS;

export const LIMITS = { tasks: [1, 12], turns: [10, 120] } as const;

export function series(tasks: number, turns: number, compactAt: number) {
  const long: number[] = [];
  const fresh: number[] = [];
  let w = FIXED;
  let compactions = 0;
  for (let t = 0; t < tasks; t++) {
    w += TASK_FILES;
    let f = FIXED + TASK_FILES;
    for (let i = 0; i < turns; i++) {
      w += PER_TURN;
      f += PER_TURN;
      if (w >= compactAt) {
        w = FIXED + AFTER_COMPACT;
        compactions++;
      }
      long.push(w);
      fresh.push(f);
    }
  }
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
  return { long, fresh, totalLong: sum(long), totalFresh: sum(fresh), compactions };
}

export function k(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return String(Math.round(n));
}

export function finding(s: ReturnType<typeof series>, tasks: number) {
  const r = s.totalLong / s.totalFresh;
  if (tasks === 1) return 'One task: the two are the same thread.';
  return `${tasks} tasks in one thread send <b>${r.toFixed(1)}×</b> the tokens of a fresh thread for each${s.compactions ? `, and it compacted ${s.compactions === 1 ? 'once' : `${s.compactions} times`} on the way` : ''}.`;
}

/** The chart at a pixel width. Text at real size. */
export function chart(s: ReturnType<typeof series>, W: number, turnsPerTask: number) {
  const H = 230;
  const m = { l: 46, r: 10, t: 12, b: 30 };
  const n = s.long.length;
  const top = Math.max(...s.long, ...s.fresh) * 1.08;
  const x = (i: number) => m.l + (i / Math.max(1, n - 1)) * (W - m.l - m.r);
  const y = (v: number) => H - m.b - (v / top) * (H - m.t - m.b);
  const path = (a: number[]) => a.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('');
  const area = (a: number[]) => `${path(a)}L${x(n - 1).toFixed(1)} ${y(0)}L${x(0).toFixed(1)} ${y(0)}Z`;
  const ticks = [0, 0.5, 1].map((f) => top * f * 0.9);
  const out: string[] = [];
  for (const v of ticks)
    out.push(`<path class="ft-grid" d="M${m.l} ${y(v).toFixed(1)}H${W - m.r}"/><text class="ft-tick" x="${m.l - 6}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${k(v)}</text>`);
  const tasks = n / turnsPerTask;
  const every = Math.ceil(tasks / Math.max(1, Math.floor((W - m.l) / 60)));
  for (let t = 1; t < tasks; t++) out.push(`<path class="ft-task" d="M${x(t * turnsPerTask).toFixed(1)} ${m.t}V${H - m.b}"/>`);
  for (let t = 0; t < tasks; t += every)
    out.push(`<text class="ft-tick" x="${x(t * turnsPerTask + turnsPerTask / 2).toFixed(1)}" y="${H - 10}" text-anchor="middle">Task ${t + 1}</text>`);
  out.push(`<path class="ft-area-long" d="${area(s.long)}"/><path class="ft-area-fresh" d="${area(s.fresh)}"/>`);
  out.push(`<path class="ft-long" d="${path(s.long)}"/><path class="ft-fresh" d="${path(s.fresh)}"/>`);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`;
}
