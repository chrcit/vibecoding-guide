// Fig. 60, the model lab. A pure module shared by the build and the browser: the shape of a model
// row, the axes the reader can choose, and the sentences the board writes as the controls move.
// Every number arrives in the rows from src/data/ (see components/models/lab-data.ts). Nothing here
// holds a value of its own and nothing here is an assumption: the lab only places published numbers.

/** A published number with the id of its fact, or a gap with the reason. Never a zero. */
export type Cell = { v: number; id: string; text: string } | { gap: 'not published' | 'not confirmed' };
export const has = (c: Cell): c is { v: number; id: string; text: string } => 'v' in c;

export type MetricKey = 'score' | 'input' | 'output' | 'cacheRead' | 'context' | 'maxOutput' | 'released';
/** Place in its lab's current line-up, by price per output token. */
export type Klass = 'dearest' | 'middle' | 'cheapest' | 'older';

export interface LabModel {
  id: string;
  name: string;
  lab: string;
  klass: Klass;
  /** The model card, as a full path. */
  card: string;
  cells: Record<MetricKey, Cell>;
  /** The effort level the index score was measured at, if the source says. */
  scoreEffort?: string;
  text: {
    effortLevels: Cell;
    apiDefault: Cell;
    harness?: { text: string; id: string };
  };
  longPrompt?: { id: string; text: string };
}

export interface Metric {
  key: MetricKey;
  /** The name on the axis and in the select. */
  name: string;
  /** Short name for the compare rows. */
  short: string;
  log: boolean;
  format: (v: number) => string;
}

const usd = (v: number) => (v >= 1 && Number.isInteger(v) ? `$${v}` : v >= 1 ? `$${v.toFixed(2)}` : v >= 0.1 ? `$${v.toFixed(2)}` : `$${v.toFixed(3).replace(/0+$/, '')}`);
const tok = (v: number) => (v >= 1e6 ? `${Math.round(v / 1e5) / 10}M` : v >= 1e3 ? `${Math.round(v / 100) / 10}K` : String(v));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const dayText = (d: number, withDay = false) => {
  const t = new Date(d * 864e5);
  return `${withDay ? `${t.getUTCDate()} ` : ''}${MONTHS[t.getUTCMonth()]} ${t.getUTCFullYear()}`;
};

export const METRICS: Metric[] = [
  { key: 'score', name: 'Intelligence Index score', short: 'Index score', log: false, format: (v) => String(Math.round(v)) },
  { key: 'output', name: 'Price out, $ per million tokens', short: 'Price out', log: true, format: usd },
  { key: 'input', name: 'Price in, $ per million tokens', short: 'Price in', log: true, format: usd },
  { key: 'cacheRead', name: 'Cache read, $ per million tokens', short: 'Cache read', log: true, format: usd },
  { key: 'context', name: 'Context window, tokens', short: 'Context', log: true, format: tok },
  { key: 'maxOutput', name: 'Longest reply, tokens', short: 'Longest reply', log: true, format: tok },
  { key: 'released', name: 'Released', short: 'Released', log: false, format: (v) => dayText(v) },
];
export const metric = (k: MetricKey) => METRICS.find((m) => m.key === k)!;

export const KLASSES: { key: Klass; name: string }[] = [
  { key: 'dearest', name: 'Dearest' },
  { key: 'middle', name: 'Middle' },
  { key: 'cheapest', name: 'Cheapest' },
  { key: 'older', name: 'Older' },
];

export interface Filter { labs: string[]; klasses: Klass[] }
export const visible = (rows: LabModel[], f: Filter) => rows.filter((r) => f.labs.includes(r.lab) && f.klasses.includes(r.klass));

/** Split the visible rows into those with both numbers and those missing one, with the reason. */
export function place(rows: LabModel[], x: MetricKey, y: MetricKey) {
  const on: LabModel[] = [];
  const off: { row: LabModel; why: string }[] = [];
  for (const r of rows) {
    const cx = r.cells[x], cy = r.cells[y];
    if (has(cx) && has(cy)) on.push(r);
    else {
      const miss = [!has(cx) && `${metric(x).short.toLowerCase()} ${cx.gap}`, !has(cy) && `${metric(y).short.toLowerCase()} ${(cy as { gap: string }).gap}`].filter(Boolean);
      off.push({ row: r, why: miss.join(', ') });
    }
  }
  return { on, off };
}

const spread = (vals: number[], m: Metric) => {
  const lo = Math.min(...vals), hi = Math.max(...vals);
  if (lo === hi) return `all at ${m.format(lo)}`;
  const ratio = !m.log || m.key === 'released' ? '' : `, ${Math.round(hi / lo)}×`;
  return `${m.format(lo)} to ${m.format(hi)}${ratio}`;
};

/** The sentence under the chart. Counts and ranges only; no ranking in the guide's voice. */
export function finding(rows: LabModel[], x: MetricKey, y: MetricKey) {
  const { on, off } = place(rows, x, y);
  if (!on.length) return `No model in the filter has both numbers. ${off.length} left off.`;
  const mx = metric(x), my = metric(y);
  const xs = on.map((r) => (r.cells[x] as { v: number }).v), ys = on.map((r) => (r.cells[y] as { v: number }).v);
  const left = off.length ? ` ${off.length} left off for a missing number.` : '';
  return `${on.length} models placed. ${my.short}: ${spread(ys, my)}. ${mx.short}: ${spread(xs, mx)}.${left}`;
}

/** Ready-made comparisons, picked by a rule on the data so the guide does not choose favourites. */
export function presets(rows: LabModel[]) {
  const labs = [...new Set(rows.map((r) => r.lab))];
  const current = rows.filter((r) => r.klass !== 'older');
  const byLab = (k: Klass) => labs.map((l) => current.find((r) => r.lab === l && r.klass === k)?.id).filter((x): x is string => !!x);
  // Two models from different labs with the same output price, if the data has such a pair.
  let same: string[] = [];
  for (const a of current) {
    const b = current.find((o) => o.lab !== a.lab && has(o.cells.output) && has(a.cells.output) && o.cells.output.v === a.cells.output.v);
    if (b) { same = [a.id, b.id]; break; }
  }
  return [
    { key: 'dearest', name: 'Dearest of each lab', ids: byLab('dearest') },
    { key: 'cheapest', name: 'Cheapest of each lab', ids: byLab('cheapest') },
    { key: 'same', name: 'Same price out', ids: same },
  ].filter((p) => p.ids.length > 1);
}

/** The rows of the compare tile. */
export const COMPARE_ROWS: { name: string; get: (r: LabModel) => Cell | { text: string; id?: string } | undefined }[] = [
  { name: 'Index score', get: (r) => r.cells.score },
  { name: 'Measured at', get: (r) => (r.scoreEffort ? { text: `${r.scoreEffort} effort` } : has(r.cells.score) ? { text: 'not stated' } : undefined) },
  { name: 'Price in', get: (r) => r.cells.input },
  { name: 'Price out', get: (r) => r.cells.output },
  { name: 'Cache read', get: (r) => r.cells.cacheRead },
  { name: 'Context', get: (r) => r.cells.context },
  { name: 'Longest reply', get: (r) => r.cells.maxOutput },
  { name: 'Released', get: (r) => r.cells.released },
  { name: 'Effort levels', get: (r) => r.text.effortLevels },
  { name: 'API default', get: (r) => r.text.apiDefault },
  { name: 'Runs in', get: (r) => r.text.harness },
];
