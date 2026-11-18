// Fig. 8, a meter and a tank. The API bills every token; a plan is a tank that refills every few
// hours and sits inside a weekly allowance. Every number comes in as an input; nothing is hard-coded.

export interface MeterTankInputs {
  /** Currency symbol for the readout, such as "$". */
  currency: string;
  /** API price per million tokens (a blended rate). */
  apiPricePerMillion: number;
  /** Tokens a steady session of agent work uses per hour. */
  tokensPerHour: number;
  /** What the plan costs per month. */
  planPricePerMonth: number;
  /** Length of the plan's usage window, in hours. */
  windowHours: number;
  /** Tokens one window allows. */
  windowTokens: number;
  /** Tokens one week allows. */
  weeklyTokens: number;
}

export type Status = 'idle' | 'working' | 'tank-dry' | 'week-dry';

export interface MeterTankState {
  hours: number;
  /** What the meter has billed so far. */
  bill: number;
  /** Share of the current window still available, 0 to 1. */
  tankLeft: number;
  /** Share of the week still available, 0 to 1. */
  weekLeft: number;
  /** Which window this is, from 1. */
  window: number;
  status: Status;
  /** Hours until the tank refills (0 when it is not dry). */
  refillIn: number;
}

/** Work at a steady pace for `hours`. The API meter never stops; the plan stops when a tank is dry. */
export function stateAt(hours: number, x: MeterTankInputs): MeterTankState {
  const bill = (x.tokensPerHour * hours * x.apiPricePerMillion) / 1e6;
  const index = Math.floor(hours / x.windowHours + 1e-9);
  let used = 0;
  for (let w = 0; w < index; w++) used += Math.min(x.windowTokens, x.tokensPerHour * x.windowHours, x.weeklyTokens - used);
  const into = hours - index * x.windowHours;
  const cap = Math.min(x.windowTokens, x.weeklyTokens - used);
  const now = Math.min(x.tokensPerHour * into, cap);
  used += now;
  const weekLeft = Math.max(0, 1 - used / x.weeklyTokens);
  const tankLeft = weekLeft <= 1e-9 ? 0 : Math.max(0, 1 - now / x.windowTokens);
  const dry = x.tokensPerHour * into >= cap - 1e-6 && hours > 0;
  const status: Status = hours === 0 ? 'idle' : weekLeft <= 1e-9 ? 'week-dry' : dry ? 'tank-dry' : 'working';
  return { hours, bill, tankLeft, weekLeft, window: index + 1, status, refillIn: status === 'tank-dry' ? x.windowHours - into : 0 };
}

/** A slider range that runs a little past the point where the week is used up. */
export function maxHours(x: MeterTankInputs) {
  for (let t = 0; t < 24 * 7; t += 0.5) if (stateAt(t, x).status === 'week-dry') return Math.ceil(t + x.windowHours / 2);
  return 24 * 7;
}

const hrs = (h: number) => {
  const v = Math.round(h * 10) / 10;
  return `${v} hour${v === 1 ? '' : 's'}`;
};
const pct = (v: number) => `${Math.round(v * 100)}%`;

export function describe(s: MeterTankState, x: MeterTankInputs) {
  const money = `${x.currency}${s.bill.toFixed(2)}`;
  if (s.status === 'idle') return `No work yet. The meter reads ${x.currency}0.00. The tank is full, and so is the week.`;
  const head = `${hrs(s.hours)} of steady work. The meter reads ${money} and is still counting.`;
  if (s.status === 'week-dry') return `${head} On the plan, the week is used up: the tank stays empty until the weekly reset.`;
  if (s.status === 'tank-dry') return `${head} On the plan, the tank is dry; it refills in ${hrs(s.refillIn)}. ${pct(1 - s.weekLeft)} of the week is used.`;
  return `${head} On the plan, the tank is ${pct(s.tankLeft)} full in window ${s.window}, and ${pct(1 - s.weekLeft)} of the week is used.`;
}
