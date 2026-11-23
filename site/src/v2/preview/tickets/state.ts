/*
 * The ticket sale for the Lantern's birthday night, all made up: 400 tickets at €15, up to four per
 * order, one code per person. Lives at module level so a purchase on /tickets is still there on
 * /door/scan and /sales, across stage changes and remounts.
 */

export const CAPACITY = 400;
export const PRICE = 15;
export const MAX_PER_ORDER = 4;
/** What the sales page says was sold before the reader arrives (the seed orders below included). */
const SEED_SOLD = 312;

export interface Order {
  id: number;
  name: string;
  codes: string[];
  /** Minutes after midnight on the day of the sale. */
  at: number;
  refunded: boolean;
  /** One of the made-up orders that were there before the reader. */
  seed: boolean;
}

// ---------- codes: LTN- and four characters nobody misreads at a dark door ----------

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** The reader's first codes are fixed so the lesson can name them (Ana's is LTN-7K2Q); then seeded. */
const firstQueue = ['LTN-7K2Q', 'LTN-9P4D', 'LTN-4XH8', 'LTN-M3TB'];
const used = new Set<string>(firstQueue);
const userRand = prng(0x1a7e);
const seedRand = prng(0x0b1e);
function code(rand: () => number, first: string[] = []): string {
  const fixed = first.shift();
  if (fixed) return fixed;
  for (;;) {
    const c = `LTN-${Array.from({ length: 4 }, () => ALPHABET[Math.floor(rand() * ALPHABET.length)]).join('')}`;
    if (!used.has(c)) { used.add(c); return c; }
  }
}

// ---------- orders ----------

const hm = (h: number, m: number) => h * 60 + m;
let nextId = 1;
export const orders: Order[] = [];
const SEEDS: [string, number, number][] = [
  ['Jonas Weber', 4, hm(20, 52)],
  ['Mira Okafor', 2, hm(21, 9)],
  ['Tomás Reyes', 3, hm(21, 24)],
  ['Lea Brandt', 1, hm(21, 31)],
];
for (const [name, n, at] of SEEDS) {
  orders.push({ id: nextId++, name, codes: Array.from({ length: n }, () => code(seedRand)), at, refunded: false, seed: true });
}
const BACKGROUND = SEED_SOLD - orders.reduce((n, o) => n + o.codes.length, 0);

/** The made-up clock on the sale's last evening: it starts at 21:38 and runs with real time. */
const t0 = Date.now();
const SALE_START = hm(21, 38);
export const saleNow = () => SALE_START + Math.floor((Date.now() - t0) / 60_000);
/** And the door's clock on the night: 23:04. */
const NIGHT_START = hm(23, 4);
export const nightNow = () => NIGHT_START + Math.floor((Date.now() - t0) / 60_000);

const pad = (n: number) => String(n).padStart(2, '0');
export const hhmm = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;

/** Tickets sold, refunds taken off. */
export const sold = () => BACKGROUND + orders.reduce((n, o) => n + (o.refunded ? 0 : o.codes.length), 0);
/** Every ticket ever sold, refunded or not: the sales page's first version counts these at the door. */
export const soldIgnoringRefunds = () => BACKGROUND + orders.reduce((n, o) => n + o.codes.length, 0);
export const left = () => Math.max(0, CAPACITY - sold());
export const refunds = () => orders.filter((o) => o.refunded);

export function buy(name: string, n: number): Order {
  const count = Math.max(1, Math.min(MAX_PER_ORDER, left(), Math.round(n)));
  const o: Order = { id: nextId++, name: name.trim() || 'Guest', codes: Array.from({ length: count }, () => code(userRand, firstQueue)), at: saleNow(), refunded: false, seed: false };
  orders.push(o);
  return o;
}

export function refund(id: number) {
  const o = orders.find((x) => x.id === id);
  if (o) o.refunded = true;
}

/** The order the lesson calls "Ana's": the reader's latest. If they bought nothing, Ana buys two now. */
export function anasOrder(): Order {
  for (let i = orders.length - 1; i >= 0; i--) if (!orders[i]!.seed) return orders[i]!;
  return buy('Ana Lopez', 2);
}

export function findCode(c: string): { order: Order; index: number } | null {
  const k = c.trim().toUpperCase();
  for (const order of orders) {
    const index = order.codes.indexOf(k);
    if (index >= 0) return { order, index };
  }
  return null;
}

/** Codes scanned at the door, with the minute they went in. */
export const scans = new Map<string, number>();

/** Tickets sold today by hour, 10:00 to 21:00, the reader's own purchases added to the last hour. */
const TODAY = [3, 2, 5, 4, 7, 6, 4, 8, 11, 9, 14, 10];
export const FIRST_HOUR = 10;
export function byHour(): number[] {
  const bars = [...TODAY];
  for (const o of orders) {
    if (o.seed) continue;
    const h = Math.floor(o.at / 60) - FIRST_HOUR;
    bars[Math.max(0, Math.min(bars.length - 1, h))]! += o.codes.length;
  }
  return bars;
}
