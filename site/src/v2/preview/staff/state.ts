/*
 * What the reader did in the staff app, kept at module level so it survives `set()` and a
 * remount while the lesson moves on: who is checked in tonight, what was tapped at the bar, the
 * stock counts, a swap that was made, and whether the private preview's gate was passed.
 */
import { BAR, BAR_TAPS, BEA_SHIFT, SHIFTS, START_MIN, TONIGHT_IN, WALK_INS } from './data';

const t0 = Date.now();
/** The club's made-up clock, in minutes after midnight; it moves with real minutes. */
export const now = () => START_MIN + Math.floor((Date.now() - t0) / 60_000);
const pad = (n: number) => String(n).padStart(2, '0');
export const hhmm = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
const toMin = (s: string) => { const [h, m] = s.split(':').map(Number); return h! * 60 + m!; };

// ---------- tonight ----------

export interface Arrival { at: number; plus: number }
export const arrivals = new Map<string, Arrival>(TONIGHT_IN.map(([id, at, plus]) => [id, { at: toMin(at), plus }]));
export const headCount = () => WALK_INS + [...arrivals.values()].reduce((n, a) => n + 1 + a.plus, 0);

// ---------- bar ----------

export interface Tap { who: string; at: number; mine: boolean }
export const taps = new Map<string, Tap>(BAR_TAPS.map(([id, who, at]) => [id, { who, at: toMin(at), mine: false }]));
export const stock = new Map<string, number>(BAR.map((b) => [b.id, b.count]));

// ---------- rota ----------

export type SwapStatus = 'pending' | 'accepted' | 'declined';
export interface Swap { from: string; to: string; by: string; status: SwapStatus; at: number }
export const swap: { current: Swap | null } = { current: null };
/** Who works which shift now: shift id → person. Starts as the rota says. */
export const holder = new Map<string, string>(SHIFTS.map((s) => [s.id, s.who]));
export function acceptSwap(s: Swap) {
  const a = holder.get(s.from)!, b = holder.get(s.to)!;
  holder.set(s.from, b);
  holder.set(s.to, a);
  s.status = 'accepted';
}
/** Bea's shift tonight, after any swap. */
export const beasShift = () => [...holder].find(([, who]) => who === 'Bea Lindqvist')?.[0] ?? BEA_SHIFT;

// ---------- gate ----------

export const gate: { passed: string | null } = { passed: null };
