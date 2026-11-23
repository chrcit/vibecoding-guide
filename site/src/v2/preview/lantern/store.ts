/*
 * The promoters' guests at the Lantern tonight, shared by the promoter pages (../promoters.ts) and
 * the door (../door.ts), so a guest the reader adds through Kai's link turns up at the door. All
 * made up: the promoters, the guests, the phone numbers (from the UK's range set aside for drama,
 * +44 7700 900xxx) and the times.
 *
 * Kai's 20 guests bring 9 plus-ones, so 29 people on a limit of 20 once plus-ones count (lesson 3,
 * part 3). Noor's 11 bring 3: 14 on 15. Ids are the door's (door/guests.ts), so a guest who is
 * already in at the door shows as in.
 */
import type { Guest } from '../door/guests';

export type PromoterId = 'kai' | 'noor';
export interface Promoter { id: PromoterId; name: string; /** The numbered link before lesson 3 part 2. */ num: number; /** The random link after it. */ token: string }
export const PROMOTERS: Record<PromoterId, Promoter> = {
  kai: { id: 'kai', name: 'Kai', num: 7, token: 'h4Tq9wLz2cNp' },
  noor: { id: 'noor', name: 'Noor', num: 8, token: 'q7Xk2mVd9TfR' },
};

export interface PGuest { id: string; name: string; plus: number; phone: string; by: PromoterId; at: string; /** Added by the reader in the page. */ mine?: boolean }

type Seed = [name: string, plus: number, at: string];
export const SEED: Record<PromoterId, Seed[]> = {
  kai: [
    ['Jonas Weber', 1, '11:41'], ['Mara Okonkwo', 0, '11:41'], ['Felix Brandauer', 2, '11:42'], ['Yuki Tanaka', 0, '11:42'],
    ['Leon Hartmann', 1, '11:42'], ['Sofia Marino', 0, '11:43'], ['Elif Demir', 1, '11:43'], ['Noah Fischer', 0, '11:43'],
    ['Inês Carvalho', 0, '11:44'], ['Mateo Ruiz', 1, '11:44'], ['Hanna Kowalczyk', 0, '11:44'], ['Ravi Menon', 0, '11:45'],
    ['Clara Vogt', 2, '11:45'], ['Tobias Lind', 0, '11:45'], ['Amara Diallo', 1, '11:46'], ['Nils Petersen', 0, '11:46'],
    ['Zoë Laurent', 0, '11:46'], ['Viktor Novak', 0, '11:47'], ['Freya Holm', 0, '11:47'], ['Lea Brandt', 0, '11:47'],
  ],
  noor: [
    ['Anaïs Fournier', 1, '11:48'], ['Karim Haddad', 0, '11:48'], ['Layla Nasser', 1, '11:48'], ['Jasper de Vries', 0, '11:49'],
    ['Mina Park', 0, '11:49'], ['Theo Brooks', 1, '11:49'], ['Aylin Kaya', 0, '11:50'], ['Rafael Costa', 0, '11:50'],
    ['Nadia Petrov', 0, '11:50'], ['Jun Watanabe', 0, '11:51'], ['Chiara Russo', 0, '11:51'],
  ],
};

export const slug = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
const phoneOf = (i: number) => `+44 7700 900${String(100 + i * 37).slice(-3)}`;

const seeded: PGuest[] = (['kai', 'noor'] as const).flatMap((by, k) =>
  SEED[by].map(([name, plus, at], i) => ({ id: slug(name), name, plus, at, by, phone: phoneOf(i + k * 20) })),
);

// ---------- what the reader changed, kept while the lesson moves on ----------

const added: PGuest[] = [];
const removed = new Set<string>();
const limits: Record<PromoterId, number> = { kai: 20, noor: 15 };
let epoch = '';

/**
 * The agent's test run starts from its own made-up data: when the story moves to a stage built on
 * a different seed, the reader's own additions for that seed are dropped.
 */
export function useSeed(name: string) {
  if (name === epoch) return;
  epoch = name;
  added.length = 0;
  removed.clear();
}

export const limitOf = (p: PromoterId) => limits[p];
export function setLimit(p: PromoterId, n: number) { limits[p] = Math.max(1, Math.min(99, n)); }

/** A promoter's guests, newest first. `seed: false` is the page before the agent's test run filled it. */
export function guestsOf(p: PromoterId, seed = true): PGuest[] {
  return [...(seed ? seeded.filter((g) => g.by === p) : []), ...added.filter((g) => g.by === p)].filter((g) => !removed.has(g.id)).reverse();
}
export const heads = (gs: PGuest[]) => gs.reduce((n, g) => n + 1 + g.plus, 0);

export function addGuest(p: PromoterId, name: string, plus: number, phone: string, at: string): PGuest {
  let id = `${slug(name) || 'guest'}-${p}`;
  while (seeded.some((g) => g.id === id) || added.some((g) => g.id === id)) id += '-x';
  const g: PGuest = { id, name, plus, phone, by: p, at, mine: true };
  added.push(g);
  return g;
}
export function removeGuest(id: string) { removed.add(id); const i = added.findIndex((g) => g.id === id); if (i >= 0) added.splice(i, 1); }

/** For the door: every promoter's guest as a door guest, on that promoter's list. */
export function doorGuests(): Guest[] {
  return [...guestsOf('kai'), ...guestsOf('noor')].map((g) => ({ id: g.id, name: g.name, list: g.by, plus: g.plus }));
}
