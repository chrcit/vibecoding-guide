/*
 * The staff app's stages, in story order, and what the app can do at each one. A stage turns on
 * everything built before it, so a tab the reader opens shows that tab as it was at that point.
 */
export type Tab = 'tonight' | 'bar' | 'rota' | 'payouts' | 'report';

export const STAGES = [
  'starter', // Set up: the new project's first page
  'bar', 'bar-ale', // 14.1
  'payouts', // 14.2 (and 15.3 once fixed)
  'bar-sorted', 'payouts-why', // 14.3
  'tables-missing', 'tables', // 15.1, 15.2
  'payouts-broken', // 15.3
  'swap-open', 'swap', // 16.1, 16.2
  'gate', 'stock', 'stock-delivery', // 16.3, 16.4
  'report', // 17
] as const;
export type Stage = (typeof STAGES)[number] | 'none';

export interface Features {
  stage: Stage;
  /** The page the tab bar opens on at this stage. */
  front: Tab;
  /** 'Ginger beer' is 'Ginger ale'. */
  ale: boolean;
  /** Running-low items ordered by taps. */
  sorted: boolean;
  payouts: boolean;
  /** Each payout row says why it counts; refunds don't. */
  why: boolean;
  /** Mid-refactor: plus-ones counted twice. */
  broken: boolean;
  tables: boolean;
  /** Mark where Ana's table should be (15.1). */
  tablesMarker: boolean;
  swap: 'open' | 'fixed' | null;
  stock: boolean;
  delivery: boolean;
  report: boolean;
  /** Signed in as Bea (bar) instead of you, the owner. */
  bea: boolean;
}

export function normalize(s: string): { stage: Stage; missing: string } {
  if (s === 'none' || s.startsWith('none-')) return { stage: 'none', missing: s === 'none' ? '/payouts' : `/${s.slice(5)}` };
  return { stage: (STAGES as readonly string[]).includes(s) ? (s as Stage) : 'tables', missing: '' };
}

export function features(stage: Stage): Features {
  const i = (s: Stage) => STAGES.indexOf(s as (typeof STAGES)[number]);
  const at = i(stage);
  const from = (s: Stage) => at >= i(s);
  const front: Tab =
    stage.startsWith('bar') || stage === 'gate' || stage.startsWith('stock') ? 'bar'
      : stage.startsWith('payouts') ? 'payouts'
        : stage.startsWith('swap') ? 'rota'
          : stage === 'report' ? 'report' : 'tonight';
  return {
    stage, front,
    ale: from('bar-ale'),
    sorted: from('bar-sorted'),
    payouts: from('payouts'),
    why: from('payouts-why') && stage !== 'payouts-broken',
    broken: stage === 'payouts-broken',
    tables: from('tables'),
    tablesMarker: stage === 'tables-missing',
    swap: stage === 'swap-open' ? 'open' : from('swap') ? 'fixed' : null,
    stock: from('gate'),
    delivery: from('stock-delivery'),
    report: from('report'),
    bea: ['swap-open', 'swap', 'gate', 'stock', 'stock-delivery'].includes(stage),
  };
}
