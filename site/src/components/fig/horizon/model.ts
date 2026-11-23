// Fig. 7, how long a task can be. METR's time horizons arrive as props from src/data/benchmarks.ts;
// this module only turns them into words and positions. No number is written here.

export type Mode = 'linear' | 'log';

export interface HorizonDatum {
  name: string;
  /** YYYY-MM-DD */
  released: string;
  /** Minutes of a skilled person's time. */
  minutes: number;
  low?: number;
  high?: number;
}

export interface HorizonInputs {
  p50: HorizonDatum[];
  p80: HorizonDatum[];
  /** METR's fitted doubling time of the 50% horizon, in days. */
  doublingDays: number;
  /** Above this many minutes METR calls its estimates unreliable. */
  unreliableAbove: number;
}

/** Decimal year of a YYYY-MM-DD date. */
export function year(d: string) {
  const [y, m, day] = d.split('-').map(Number) as [number, number, number];
  return y + (m - 1) / 12 + (day - 1) / 365;
}

/** 0.6 → "36 seconds", 45 → "45 minutes", 718 → "12 hours". */
export function duration(min: number) {
  if (min < 1) return `${Math.round(min * 60)} seconds`;
  if (min < 90) return `${Math.round(min)} minutes`;
  const h = min / 60;
  return `${h < 10 ? Math.round(h * 10) / 10 : Math.round(h)} hours`;
}

/** Short axis label: 1 s, 10 min, 4 h. */
export function short(min: number) {
  if (min < 1) return `${Math.round(min * 60)} s`;
  if (min < 60) return `${Math.round(min)} min`;
  return `${Math.round(min / 60)} h`;
}

const monthYear = (d: string) => {
  const [y, m] = d.split('-').map(Number) as [number, number];
  return `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${y}`;
};

export function describe(mode: Mode, x: HorizonInputs) {
  const last = x.p50[x.p50.length - 1]!;
  const first = x.p50[0]!;
  const last80 = x.p80.find((p) => p.name === last.name) ?? x.p80[x.p80.length - 1]!;
  const tail = `At 80% reliability the same model manages tasks of about ${duration(last80.minutes)}.`;
  if (mode === 'log')
    return `Log scale: each gridline step multiplies the length. The points fall close to a straight line, which means steady doubling, about every ${Math.round(x.doublingDays)} days by METR's fit. ${tail}`;
  return `Linear scale: for years the line hugs the floor, then climbs. ${first.name} managed tasks of ${duration(first.minutes)}; ${last.name}, released in ${monthYear(last.released)}, half of tasks that take a skilled person about ${duration(last.minutes)}. ${tail}`;
}
