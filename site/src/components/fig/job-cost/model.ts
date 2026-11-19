// Fig. 61, what a job costs. The reader sets the size of a job and every model's price for it is
// worked out from the API list prices in src/data/models.ts.
//
// Facts (arrive as props): price in, price out and cache-read price per million tokens for each
// model; the output tokens Claude Opus 5.5 wrote over the whole Artificial Analysis index run at
// each effort level (benchmarks.ts).
//
// Assumptions (named here, listed on the board in the tile "How the bars are worked out"):

/** Job sizes for the presets. These are the guide's own illustrations, not measurements. */
export const PRESETS = [
  // A one-line fix: the agent reads a few files and writes a short change in a fresh session.
  { key: 'fix', name: 'One-line fix', input: 20_000, output: 1_000, cache: 0 },
  // A feature on the club list: a session of a few dozen turns. An agent resends the whole
  // conversation each turn, so most input repeats and can come from the prompt cache.
  { key: 'feature', name: 'A feature', input: 1_500_000, output: 40_000, cache: 85 },
  // A day of work in one long session: hundreds of turns over a large context.
  { key: 'day', name: 'A day’s session', input: 30_000_000, output: 400_000, cache: 92 },
  // A week-long run: an agent left to work through a large job, with subagents.
  { key: 'week', name: 'A week-long run', input: 400_000_000, output: 5_000_000, cache: 95 },
] as const;

/** Slider ends. The top ends go a step beyond the largest preset on purpose. */
export const RANGE = {
  input: [1_000, 5_000_000_000] as const,
  output: [100, 50_000_000] as const,
};

/**
 * The effort control scales output tokens by the ratio Opus 5.5 showed on the index run between a
 * level and `EFFORT_BASE`. Applying one model's ratio to every model is an assumption: no lab
 * publishes this ratio for its own models.
 */
export const EFFORT_BASE = 'medium';

// Cache writes are not counted: the bar prices cached input at the cache-read price and the rest
// at the input price. Batch, fast mode and long-prompt prices are not applied.

export interface PriceRow {
  id: string;
  name: string;
  lab: string;
  card: string;
  input: number;
  output: number;
  /** Missing when the data has no cache-read price for the model. */
  cacheRead?: number;
  /** Prompt length above which the model has dearer prices, if it has them. */
  longPrompt?: string;
}

export interface Job {
  input: number;
  output: number;
  /** Share of input served from the prompt cache, 0 to 100. */
  cache: number;
  /** Multiplier on output from the effort control. */
  effort: number;
}

export interface Bar {
  row: PriceRow;
  cost: number;
  /** True when the cache share was priced at the full input price for want of a cache price. */
  upper: boolean;
}

export function cost(r: PriceRow, j: Job): Bar {
  const cached = (j.input * j.cache) / 100;
  const fresh = j.input - cached;
  const upper = j.cache > 0 && r.cacheRead == null;
  const c = (fresh * r.input + cached * (r.cacheRead ?? r.input) + j.output * j.effort * r.output) / 1e6;
  return { row: r, cost: c, upper };
}

export const bars = (rows: PriceRow[], j: Job) => rows.map((r) => cost(r, j)).sort((a, b) => a.cost - b.cost);

export function money(v: number) {
  if (v >= 1000) return `$${Math.round(v).toLocaleString('en-GB')}`;
  if (v >= 10) return `$${v.toFixed(0)}`;
  if (v >= 0.995) return `$${v.toFixed(2)}`;
  if (v >= 0.01) return `${(v * 100).toFixed(v >= 0.1 ? 0 : 1)}¢`;
  return `${(v * 100).toFixed(2)}¢`;
}

export function tokens(v: number) {
  if (v >= 1e9) return `${Math.round(v / 1e8) / 10}B`;
  if (v >= 1e6) return `${Math.round(v / 1e5) / 10}M`;
  if (v >= 1e3) return `${Math.round(v / 100) / 10}K`;
  return String(Math.round(v));
}

/** Log slider position 0..1000 to a token count, rounded to two significant figures. */
export function fromSlider(p: number, [lo, hi]: readonly [number, number]) {
  const v = 10 ** (Math.log10(lo) + (p / 1000) * (Math.log10(hi) - Math.log10(lo)));
  const mag = 10 ** Math.floor(Math.log10(v) - 1);
  return Math.round(v / mag) * mag;
}
export const toSlider = (v: number, [lo, hi]: readonly [number, number]) =>
  Math.round(((Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * 1000);

/** The sentence under the bars: the range, from the data, in no voice of our own. */
export function finding(list: Bar[]) {
  if (!list.length) return '';
  const lo = list[0]!, hi = list[list.length - 1]!;
  const ratio = lo.cost > 0 ? Math.round(hi.cost / lo.cost) : 0;
  const upper = list.some((b) => b.upper) ? ' A dashed bar has no cache price in our data, so it is an upper bound.' : '';
  return `From ${money(lo.cost)} on ${lo.row.name} to ${money(hi.cost)} on ${hi.row.name}, ${ratio}× apart.${upper}`;
}
