// Shared types for everything in src/data/. These files run in plain Node 22
// through type stripping (scripts/check-facts.mjs imports them directly), so:
// erasable TypeScript only, relative imports with the `.ts` extension, no
// path aliases, no import.meta.env.

/**
 * verified: checked against a primary source on the `verified` date.
 * observation: someone's dated, attributed measurement or estimate.
 * unverified: could not be confirmed; never rendered on a page.
 */
export type Status = 'verified' | 'observation' | 'unverified';

export interface Sourced<T> {
  value: T;
  /** URL of the page that says it. */
  source: string;
  /** YYYY-MM-DD, the day someone last read the source. */
  verified: string;
  status: Status;
  note?: string;
}

/** How a value is printed. Plain numbers and strings need no unit. */
export type Unit =
  | 'usd' // $4, $0.10, $24,000
  | 'tokens' // 1M tokens, 128K tokens
  | 'minutes' // a duration in minutes, printed as min or hours
  | 'days'
  | 'multiplier' // 5×
  | 'date' // YYYY-MM-DD, printed as 22 Sep 2026
  | 'percent'
  | 'wpm';

/** A sourced value plus the sentence it supports, for the sources page. */
export interface Fact<T = unknown> extends Sourced<T> {
  /** The claim in one plain sentence, as the sources page shows it. */
  claim: string;
  unit?: Unit;
}

/** The day of the last full check. */
export const CHECKED = '2026-11-18';

type Extra<T> = Partial<Omit<Fact<T>, 'value' | 'source' | 'claim'>>;

/** A verified fact read on the day of the last full check, unless `extra` says otherwise. */
export function fact<T>(value: T, claim: string, source: string, extra: Extra<T> = {}): Fact<T> {
  return { value, claim, source, verified: CHECKED, status: 'verified', ...extra };
}

/** A fact that could not be confirmed. Kept so it is visible, never rendered on a page. */
export function unverified<T>(value: T, claim: string, source: string, note: string, extra: Extra<T> = {}): Fact<T> {
  return { value, claim, source, verified: CHECKED, status: 'unverified', note, ...extra };
}

export function isFact(x: unknown): x is Fact {
  return !!x && typeof x === 'object' && 'value' in x && 'source' in x && 'status' in x && 'claim' in x;
}

/** A correction made when the facts were last re-checked. */
export interface Correction {
  date: string;
  /** What the guide said before. */
  was: string;
  /** What the source says now. */
  now: string;
  source: string;
  /** Ids of the facts that carry the corrected value. */
  facts?: string[];
}

/** A link the site uses more than once. */
export interface Link {
  label: string;
  url: string;
  /** YYYY-MM-DD, the day the link last answered. */
  checked: string;
  note?: string;
}

/** A person or project the guide builds on. */
export interface Credit {
  name: string;
  url: string;
  for: string;
  checked: string;
}
