/*
 * The Lantern's staff app, weeks after the first Friday. Everything here is made up: the staff,
 * the guests, the promoters' numbers, the stock, the euros and the times.
 *
 * Kai's and Noor's lists are last Friday's, for Payouts: Kai has 20 guests in with 9 plus-ones
 * (29 people, €145), Noor 12 with 4 (16 people, €80). Lea Brandt came in on Kai's list and was
 * turned away at 00:20 and refunded: once refunds stop counting (lesson 14.3), Kai drops to €140.
 */
export type Promoter = 'kai' | 'noor';
export type ListId = Promoter | 'guest';

export const LIST_LABEL: Record<ListId, string> = { kai: 'Kai', noor: 'Noor', guest: 'Guest list' };

/** € per person in, plus-ones included. */
export const RATE = 5;

// ---------- payouts: last Friday ----------

export interface PayoutGuest {
  name: string;
  /** Plus-ones who came in with them. */
  plus: number;
  /** 'HH:MM' they came in, or null for a no-show. */
  in: string | null;
  /** Turned away after coming in, and refunded. */
  refunded?: string;
}

type P = [name: string, plus: number, inAt: string | null, refunded?: string];
const pg = (rows: P[]): PayoutGuest[] => rows.map(([name, plus, inAt, refunded]) => ({ name, plus, in: inAt, ...(refunded ? { refunded } : {}) }));

export const PAYOUT_GUESTS: Record<Promoter, PayoutGuest[]> = {
  // 20 in, 9 plus-ones in, 4 no-shows.
  kai: pg([
    ['Ana Lopez', 0, '23:40'], ['Lea Brandt', 0, '00:12', '00:20'], ['Leon Hartmann', 1, null], ['Jonas Weber', 1, '22:12'],
    ['Mara Okonkwo', 0, '22:24'], ['Felix Brandauer', 2, '23:05'], ['Yuki Tanaka', 0, '22:15'], ['Sofia Marino', 0, '23:18'], ['Elif Demir', 1, '22:37'],
    ['Noah Fischer', 0, '23:52'], ['Inês Carvalho', 0, null], ['Mateo Ruiz', 1, '00:05'], ['Hanna Kowalczyk', 0, '23:31'],
    ['Clara Vogt', 2, '23:47'], ['Tobias Lind', 0, null], ['Amara Diallo', 1, '00:14'], ['Nils Petersen', 0, '23:09'],
    ['Freya Holm', 1, null], ['Omar Saleh', 0, '00:31'], ['Greta Maier', 0, '23:26'],
    ['Luca Romano', 1, '00:48'], ['Selin Aydın', 0, '01:02'], ['Paul Krämer', 0, '22:58'], ['Zoë Laurent', 0, '23:36'],
  ]),
  // 12 in, 4 plus-ones in, 3 no-shows.
  noor: pg([
    ['Anaïs Fournier', 1, '23:02'], ['Karim Haddad', 0, '22:48'], ['Layla Nasser', 2, '22:20'], ['Jasper de Vries', 0, null],
    ['Mina Park', 0, '22:39'], ['Theo Brooks', 1, '22:27'], ['Aylin Kaya', 0, '23:15'], ['Rafael Costa', 0, null],
    ['Jun Watanabe', 0, '23:44'], ['Chiara Russo', 0, '22:33'], ['Idris Bello', 0, '00:09'], ['Malin Ek', 0, '23:58'],
    ['Dario Conti', 0, null], ['Leila Rahimi', 0, '00:26'], ['Priya Raman', 0, '00:40'],
  ]),
};

export const PAYOUT_NIGHT = 'Last Friday';

// ---------- tonight's list ----------

export interface TonightGuest {
  id: string;
  name: string;
  list: ListId;
  plus: number;
  /** Table booked tonight, if any. */
  table?: number;
}

type T = [name: string, list: ListId, plus?: number, table?: number];
const slug = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z]+/g, '-');
const tg = (rows: T[]): TonightGuest[] =>
  rows.map(([name, list, plus = 0, table]) => ({ id: slug(name), name, list, plus, ...(table ? { table } : {}) }))
    .sort((a, b) => a.name.localeCompare(b.name));

export const TONIGHT: TonightGuest[] = tg([
  ['Ana Lopez', 'kai', 0, 4], ['Amara Diallo', 'kai', 1], ['Anaïs Fournier', 'noor', 1], ['Ben Adeyemi', 'guest'],
  ['Charlotte Hill', 'guest', 0, 2], ['Clara Vogt', 'kai', 2], ['David Moreau', 'guest', 1, 6], ['Elif Demir', 'kai', 1],
  ['Farah Khan', 'guest'], ['Felix Brandauer', 'kai', 2, 1], ['Helena Berg', 'guest'], ['Idris Bello', 'noor', 1],
  ['Jonas Weber', 'kai', 1], ['Karim Haddad', 'noor'], ['Kofi Mensah', 'guest', 2, 3], ['Layla Nasser', 'noor', 2, 5],
  ['Lea Brandt', 'kai'], ['Malin Ek', 'noor'], ['Mara Okonkwo', 'kai'], ['Mina Park', 'noor'],
  ['Nils Petersen', 'kai'], ['Olivia Grant', 'guest'], ['Priya Raman', 'noor'], ['Sofia Marino', 'kai'],
  ['Theo Brooks', 'noor', 1], ['Yuki Tanaka', 'kai'],
]);
export const ANA = 'ana-lopez';
export const CAPACITY = 220;
/** People in tonight who are on no list. */
export const WALK_INS = 64;
/** Already in when the page loads: [id, 'HH:MM', plus-ones who came]. */
export const TONIGHT_IN: [string, string, number][] = [
  ['jonas-weber', '22:12', 1], ['layla-nasser', '22:20', 2], ['theo-brooks', '22:27', 1], ['mina-park', '22:39', 0],
  ['ben-adeyemi', '22:44', 0], ['karim-haddad', '22:48', 0], ['charlotte-hill', '22:55', 0], ['elif-demir', '23:01', 1],
  ['felix-brandauer', '23:05', 2], ['yuki-tanaka', '23:07', 0],
];
/** The made-up clock: minutes after midnight when the page first loads (23:10). */
export const START_MIN = 23 * 60 + 10;

// ---------- bar ----------

export interface BarItem { id: string; name: string; lastWeek: number; unit: string; par: number; count: number; delivery: string }
export const BAR: BarItem[] = [
  { id: 'lime', name: 'Lime', lastWeek: 22, unit: 'limes', par: 60, count: 14, delivery: 'Tue 10:40' },
  { id: 'tonic', name: 'Tonic', lastWeek: 9, unit: 'bottles', par: 48, count: 36, delivery: 'Mon 09:15' },
  { id: 'ice', name: 'Ice', lastWeek: 19, unit: 'bags', par: 20, count: 4, delivery: 'Wed 16:05' },
  { id: 'ginger', name: 'Ginger beer', lastWeek: 14, unit: 'bottles', par: 36, count: 22, delivery: 'Mon 09:15' },
  { id: 'soda', name: 'Soda', lastWeek: 8, unit: 'bottles', par: 48, count: 41, delivery: 'Mon 09:15' },
  { id: 'mint', name: 'Mint', lastWeek: 4, unit: 'bunches', par: 10, count: 2, delivery: 'Tue 10:40' },
];
/** Taps already made tonight: [item, who, 'HH:MM']. */
export const BAR_TAPS: [string, string, string][] = [['lime', 'Tariq', '22:58'], ['ice', 'Rosa', '23:04']];

// ---------- rota ----------

export interface Shift { id: string; who: string; role: string; from: string; to: string }
export const SHIFTS: Shift[] = [
  { id: 's-jakob', who: 'Jakob Stein', role: 'Sound', from: '21:00', to: '05:00' },
  { id: 's-bea', who: 'Bea Lindqvist', role: 'Bar', from: '21:00', to: '03:00' },
  { id: 's-tariq', who: 'Tariq Aziz', role: 'Bar', from: '21:00', to: '03:00' },
  { id: 's-sami', who: 'Sami Okoro', role: 'Door', from: '22:00', to: '04:00' },
  { id: 's-finn', who: 'Finn Gallagher', role: 'Security', from: '22:00', to: '04:00' },
  { id: 's-mila', who: 'Mila Horvat', role: 'Cloakroom', from: '22:00', to: '04:30' },
  { id: 's-rosa', who: 'Rosa Ibáñez', role: 'Bar', from: '23:00', to: '05:00' },
];
export const BEA_SHIFT = 's-bea';
export const SAMI_SHIFT = 's-sami';

// ---------- gate ----------

export const ALLOWED = ['bea@thelantern.example', 'owner@thelantern.example'];

// ---------- report: last Friday ----------

export const REPORT = {
  night: 'Last Friday',
  generated: 'Sat 10:00',
  /** Arrivals per hour from 22:00 to 04:00. */
  hours: [['22', 38], ['23', 96], ['00', 124], ['01', 71], ['02', 33], ['03', 12]] as [string, number][],
  peak: { n: 212, at: '00:50' },
  taps: [['Lime', 9], ['Ice', 7], ['Ginger ale', 5], ['Mint', 3]] as [string, number][],
  payouts: [['Kai', 29, 145], ['Noor', 16, 80]] as [string, number, number][],
};
