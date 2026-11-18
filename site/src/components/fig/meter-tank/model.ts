// Fig. 8, a meter and a tank. The API bills every token; a plan is a tank that refills on a clock and
// draws on a weekly allowance. No provider publishes how much a window or a week holds, so the figure
// works in steps and relative levels: it shows what happens, in order, without inventing a quantity.
// Every number the words use (price, window length) comes in as an input from src/data/.

export interface MeterTankInputs {
  /** Currency symbol for the readout, such as "$". */
  currency: string;
  /** What the plan costs per month. */
  planPricePerMonth: number;
  /** Length of the plan's usage window, in hours. */
  windowHours: number;
}

export type Watch = 'meter' | 'tank' | 'week' | 'clock';

export interface Step {
  /** Share of the meter's full travel, 0 to 1: what the same work would have cost on the API, relative. */
  bill: number;
  /** Share of the window's allowance still in the tank, 0 to 1. */
  tank: number;
  /** Share of the week's allowance still in the trough, 0 to 1. */
  week: number;
  /** How far the refill clock has turned since the first message, in windows (1 = one full turn). */
  clock: number;
  /** Which labels to highlight. */
  watch: Watch[];
  says: (x: MeterTankInputs) => string;
}

const price = (x: MeterTankInputs) => `${x.currency}${x.planPricePerMonth}`;
const hours = (x: MeterTankInputs) => `${x.windowHours} hours`;

export const STEPS: Step[] = [
  {
    bill: 0, tank: 1, week: 1, clock: 0, watch: [],
    says: (x) => `Nothing has run yet. The API meter reads zero. On the ${price(x)} plan the tank is full, and so is the trough that holds the week.`,
  },
  {
    bill: 0.25, tank: 0.5, week: 0.82, clock: 0.4, watch: ['meter', 'tank'],
    says: (x) => `Two hours into building the club list. On the API the meter counts every token in and out, and the bill climbs. On the plan the same work drains the tank and the week drops with it, while the price stays ${price(x)} a month.`,
  },
  {
    bill: 0.42, tank: 0, week: 0.68, clock: 0.7, watch: ['tank', 'clock'],
    says: (x) => `The tank runs dry before the clock comes round. On the plan you stop and wait until ${hours(x)} after your first message. On the API nothing stops: the meter keeps counting for as long as you work.`,
  },
  {
    bill: 0.55, tank: 1, week: 0.68, clock: 1, watch: ['tank', 'week'],
    says: (x) => `${hours(x)[0]!.toUpperCase()}${hours(x).slice(1)} after the first message, the tank refills in full. The week does not: what you used stays used until the weekly reset.`,
  },
  {
    bill: 0.9, tank: 0, week: 0, clock: 3.5, watch: ['week'],
    says: () => 'Several windows later the week is empty. The tank stays dry even when the clock comes round, until the weekly reset at the fixed time assigned to your account.',
  },
  {
    bill: 1, tank: 0, week: 0, clock: 3.8, watch: ['meter'],
    says: (x) => `With usage credits turned on, work carries on past the limit and is billed at API rates. The meter is running again, and what it counts is on top of the ${price(x)}.`,
  },
];

export const describe = (i: number, x: MeterTankInputs) => STEPS[i]!.says(x);
