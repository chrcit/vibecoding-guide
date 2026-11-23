/*
 * The three sources for the Lantern's birthday night (Fri 28 Nov), all made up: Kai's spreadsheet
 * (a CSV, name;plus), Noor's sheet (plus-ones written after the name, "Lea Brandt +1") and the
 * orders from the club's own sale page (one buyer, 1–4 tickets). Four guests are on two of them:
 * Ana Lopez (Kai, Tickets), Inês Carvalho (Kai, and "Ines Carvalho" on Tickets), Yuki Tanaka (Kai,
 * Noor) and Theo Brooks (Noor, Tickets). Rico Vance bought a ticket and is on the do-not-admit list.
 */
export type SourceId = 'kai' | 'noor' | 'tickets';
export const SOURCE_IDS: SourceId[] = ['kai', 'noor', 'tickets'];

export interface Source {
  label: string;
  short: string;
  file: string;
  format: string;
  /** The file's first line, when it has one. */
  header?: string;
  updated: string;
}

export const SOURCES: Record<SourceId, Source> = {
  kai: { label: 'Kai’s spreadsheet', short: 'Kai', file: 'kai-friday.csv', format: 'CSV · columns name;plus', header: 'name;plus', updated: 'Tue 21:14' },
  noor: { label: 'Noor’s sheet', short: 'Noor', file: 'Sheet · Fri 28.11', format: 'One name per row · plus-ones after the name', updated: 'Wed 09:52' },
  tickets: { label: 'Ticket sales', short: 'Tickets', file: 'Sale page export', format: 'Orders · order, name, tickets', header: 'order, name, tickets', updated: 'Wed 14:00' },
};

/** One row of one source, as it was written and as it should be read. */
export interface Entry {
  id: string;
  source: SourceId;
  /** Line in the file, counting a header line. */
  line: number;
  raw: string;
  name: string;
  plus: number;
  ref?: string;
  tickets?: number;
  /** On the do-not-admit list. */
  dna?: boolean;
}

type Listed = [name: string, plus?: number];

const KAI: Listed[] = [
  ['Ana Lopez', 1], ['Jonas Weber', 1], ['Mara Okonkwo'], ['Felix Brandauer', 2], ['Yuki Tanaka'], ['Leon Hartmann', 1],
  ['Sofia Marino'], ['Elif Demir', 1], ['Noah Fischer'], ['Inês Carvalho'], ['Mateo Ruiz', 1], ['Hanna Kowalczyk'],
  ['Ravi Menon'], ['Clara Vogt', 2], ['Tobias Lind'], ['Amara Diallo', 1], ['Nils Petersen'], ['Zoë Laurent'],
  ['Viktor Novak'], ['Freya Holm', 1], ['Omar Saleh'], ['Greta Maier'], ['Luca Romano', 1], ['Selin Aydın'],
  ['Paul Krämer'], ['Bram Visser'], ['Carla Mendes', 1], ['Dominik Wolf'], ['Esther Abebe'], ['Fabian Roth', 1],
  ['Ilse Jansen'], ['Kwame Asante'], ['Lotte Smit', 1], ['Marius Pop'], ['Nora Lindgren'], ['Pablo Herrera', 2],
  ['Rhea Kapoor'], ['Simon Frey'], ['Tessa Gruber', 1], ['Ugo Bianchi'], ['Wanda Zielińska'], ['Yusuf Erdem'],
];

const NOOR: Listed[] = [
  ['Lea Brandt', 1], ['Karim Haddad'], ['Layla Nasser', 2], ['Anaïs Fournier'], ['Jasper de Vries'], ['Mina Park'],
  ['Theo Brooks', 1], ['Aylin Kaya'], ['Rafael Costa'], ['Nadia Petrov', 1], ['Jun Watanabe'], ['Chiara Russo'],
  ['Idris Bello'], ['Malin Ek'], ['Yuki Tanaka'], ['Dario Conti'], ['Leila Rahimi'], ['Oscar Lund', 1],
  ['Priya Raman'], ['Bruno Teixeira'], ['Sena Yılmaz'], ['Hugo Martin'], ['Adaeze Obi'], ['Camille Roux'],
  ['Emil Strand'], ['Hira Qureshi'], ['Joel Mäkinen'], ['Katya Orlova'], ['Lior Ben-David'], ['Sanne Bakker'],
  ['Vera Sousa'],
];

/** Buyers placed at a fixed position in the order export: [index, name, tickets, ref?, dna?]. */
const PLACED: [number, string, number, string?, boolean?][] = [
  [0, 'Ana Lopez', 2, 'LTN-7K2Q'],
  [41, 'Theo Brooks', 2],
  [63, 'Maximiliane von Hohenstein-Albrecht', 3],
  [77, 'Ines Carvalho', 1],
  [93, 'Rico Vance', 1, undefined, true],
];
const TICKET_BUYERS = 118;

const FIRST = ['Anton', 'Bianca', 'Caspar', 'Daria', 'Eli', 'Elena', 'Emre', 'Fatima', 'Finn', 'Gloria',
  'Hamid', 'Ivy', 'Jana', 'Karla', 'Lars', 'Leonie', 'Lina', 'Luis', 'Maja', 'Malik', 'Marie', 'Matteo', 'Mia', 'Milan',
  'Nico', 'Olga', 'Pia', 'Quinn', 'Rania', 'Ruben', 'Sara', 'Sven', 'Tara', 'Timo', 'Uma', 'Valentin', 'Wiebke', 'Xenia',
  'Yara', 'Zeno'];
const LAST = ['Albers', 'Baptiste', 'Castillo', 'Dahl', 'Engel', 'Ferreira', 'Gashi', 'Haas', 'Iversen', 'Jovanović',
  'Keller', 'Lang', 'Moreno', 'Nakamura', 'Okafor', 'Pereira', 'Quist', 'Richter', 'Sauer', 'Thiel', 'Ulrich', 'Vidal',
  'Winter', 'Yamamoto', 'Zeller', 'Kovač', 'Lehmann', 'Murphy', 'Nyberg', 'Osei', 'Popescu', 'Schuster', 'Takács',
  'Varga', 'Wójcik', 'Becker', 'Duarte', 'Larsen'];

/** A small seeded generator, so the made-up orders are the same on every load. */
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').replace(/ı/g, 'i').toLowerCase();
/** Two rows are the same guest when their names match ignoring case and accents. */
export const keyOf = (name: string) => fold(name).replace(/\s+/g, ' ').trim();

function buildTickets(): [string, number, string, boolean][] {
  const rand = rng(1128);
  const taken = new Set([...KAI, ...NOOR, ...PLACED.map((p) => [p[1]] as Listed)].map(([n]) => keyOf(n)));
  const refs = new Set(PLACED.flatMap((p) => (p[3] ? [p[3]] : [])));
  const ALPHA = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
  const ref = () => {
    for (;;) {
      let r = 'LTN-';
      for (let i = 0; i < 4; i++) r += ALPHA[Math.floor(rand() * ALPHA.length)];
      if (!refs.has(r)) { refs.add(r); return r; }
    }
  };
  const count = () => { const x = rand(); return x < 0.6 ? 1 : x < 0.88 ? 2 : x < 0.96 ? 3 : 4; };
  const out: [string, number, string, boolean][] = [];
  const placed = new Map(PLACED.map((p) => [p[0], p]));
  for (let i = 0; i < TICKET_BUYERS; i++) {
    const p = placed.get(i);
    if (p) { out.push([p[1], p[2], p[3] ?? ref(), !!p[4]]); continue; }
    let name = '';
    do name = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`;
    while (taken.has(keyOf(name)));
    taken.add(keyOf(name));
    out.push([name, count(), ref(), false]);
  }
  return out;
}

export const ENTRIES: Entry[] = [
  ...KAI.map(([name, plus = 0], i): Entry => ({ id: `kai-${i + 1}`, source: 'kai', line: i + 2, raw: `${name};${plus}`, name, plus })),
  ...NOOR.map(([name, plus = 0], i): Entry => ({ id: `noor-${i + 1}`, source: 'noor', line: i + 1, raw: plus ? `${name} +${plus}` : name, name, plus })),
  ...buildTickets().map(([name, tickets, ref, dna], i): Entry => ({
    id: `tickets-${i + 1}`, source: 'tickets', line: i + 2, raw: `${ref}, ${name}, ${tickets}`, name, plus: tickets - 1, ref, tickets,
    ...(dna ? { dna } : {}),
  })),
];

export const countOf = (s: SourceId) => ENTRIES.filter((e) => e.source === s).length;
