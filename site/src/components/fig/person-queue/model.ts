// Fig. 31, you are the queue. Runs the lab's model (../team-lab/model.ts) for one to sixteen
// agents with everything else as the reader set it, and finds where more agents stop helping.
// One agent alone has nothing to sweep, so that way is shown as parallel worktrees.
import { simulate, type Settings } from '../team-lab/model';

export const MAX = 16;
export interface Row { n: number; finish: number; busy: number; waiting: number }

export function sweep(s: Settings): Row[] {
  const pattern = s.pattern === 'solo' ? 'parallel' : s.pattern;
  return Array.from({ length: MAX }, (_, i) => {
    const r = simulate({ ...s, pattern, agents: i + 1 }, false);
    return { n: i + 1, finish: r.stats.finish, busy: r.stats.you / Math.max(1, r.stats.finish), waiting: r.stats.waiting };
  });
}

/** The fewest agents that finish within 10% of the best time on this sweep. */
export function knee(rows: Row[]) {
  const best = Math.min(...rows.map((r) => r.finish));
  return rows.find((r) => r.finish <= best * 1.1)!;
}

export function describe(rows: Row[]) {
  const k = knee(rows);
  const last = rows[rows.length - 1]!;
  if (k.n >= rows.length - 1) return `Up to ${rows.length} agents still finish sooner here: the work is large and separable enough.`;
  const why = last.busy > 0.55
    ? `you are busy ${Math.round(last.busy * 100)}% of the run`
    : 'the pieces wait on each other';
  return `Past ${k.n} agent${k.n === 1 ? '' : 's'} the finish barely moves: ${why}.`;
}
