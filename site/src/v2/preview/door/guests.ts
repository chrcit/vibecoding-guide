/*
 * Tonight's list at the Lantern, all made up. Four lists: the two promoters' (Kai, Noor), the
 * club's own guest list and staff. Later lessons reuse these names: Ana Lopez is the guest the
 * agent tests with, "Zed" is on no list, and Lea Brandt and Rico Vance are kept off on purpose
 * (lesson 3 adds Lea through Kai's link, lesson 7 puts Rico on a do-not-admit list).
 */
export type ListId = 'kai' | 'noor' | 'guest' | 'staff';

export interface Guest {
  id: string;
  name: string;
  list: ListId;
  /** Plus-ones the guest is listed with. */
  plus: number;
  /** Staff only: what they do tonight. */
  role?: string;
}

export const LISTS: Record<ListId, { label: string; short: string }> = {
  kai: { label: 'Kai’s list', short: 'Kai' },
  noor: { label: 'Noor’s list', short: 'Noor' },
  guest: { label: 'Guest list', short: 'Guest list' },
  staff: { label: 'Staff', short: 'Staff' },
};

export const CAPACITY = 220;
/** The made-up clock starts here when the page first loads, in minutes after midnight (22:41). */
export const START_MIN = 22 * 60 + 41;

type Row = [name: string, plus?: number, role?: string];
const rows: Record<ListId, Row[]> = {
  kai: [
    ['Jonas Weber', 1], ['Mara Okonkwo'], ['Felix Brandauer', 2], ['Yuki Tanaka'], ['Leon Hartmann', 1],
    ['Sofia Marino'], ['Elif Demir', 1], ['Noah Fischer'], ['Inês Carvalho'], ['Mateo Ruiz', 1],
    ['Hanna Kowalczyk'], ['Ravi Menon'], ['Clara Vogt', 2], ['Tobias Lind'], ['Amara Diallo', 1],
    ['Nils Petersen'], ['Zoë Laurent'], ['Viktor Novak'], ['Freya Holm', 1], ['Omar Saleh'],
    ['Greta Maier'], ['Luca Romano', 1], ['Selin Aydın'], ['Paul Krämer'],
  ],
  noor: [
    ['Anaïs Fournier', 1], ['Karim Haddad'], ['Layla Nasser', 2], ['Jasper de Vries'], ['Mina Park'],
    ['Theo Brooks', 1], ['Aylin Kaya'], ['Rafael Costa'], ['Nadia Petrov', 1], ['Jun Watanabe'],
    ['Chiara Russo'], ['Idris Bello', 1], ['Malin Ek'], ['Dario Conti'], ['Leila Rahimi'],
    ['Oscar Lund', 1], ['Priya Raman'], ['Bruno Teixeira'], ['Sena Yılmaz'], ['Hugo Martin'],
  ],
  guest: [
    ['Ana Lopez'], ['Anastasia Volkova', 1], ['Ben Adeyemi'], ['Charlotte Hill'], ['David Moreau', 1],
    ['Ella Schmidt'], ['Farah Khan'], ['Gabriel Silva', 1], ['Helena Berg'], ['Isaac Cohen'],
    ['Julia Nowak'], ['Kofi Mensah', 2], ['Lucía Fernández'], ['Marta Šimić'], ['Niklas Braun'],
    ['Olivia Grant'], ['Pia Lorenz', 1], ['Quentin Dubois'],
  ],
  staff: [
    ['Sami Okoro', 0, 'Door'], ['Bea Lindqvist', 0, 'Bar'], ['Tariq Aziz', 0, 'Bar'], ['Rosa Ibáñez', 0, 'Bar'],
    ['Mila Horvat', 0, 'Cloakroom'], ['Jakob Stein', 0, 'Sound'], ['Finn Gallagher', 0, 'Security'],
    ['Marek Duda', 0, 'Security'], ['Ida Weiss', 0, 'Lights'], ['Kenji Mori', 0, 'Resident DJ'],
  ],
};

const slug = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z]+/g, '-');

export const GUESTS: Guest[] = (Object.keys(rows) as ListId[]).flatMap((list) =>
  rows[list].map(([name, plus = 0, role]) => ({ id: slug(name), name, list, plus, ...(role ? { role } : {}) })),
);

/** The test guest: listed, no plus-ones, so each tap adds exactly one to the count. */
export const ANA = 'ana-lopez';

/** Who is already in when the page loads: [id, 'HH:MM', plus-ones who came]. */
export const ALREADY_IN: [string, string, number][] = [
  ['jakob-stein', '21:20', 0], ['sami-okoro', '21:30', 0], ['bea-lindqvist', '21:42', 0], ['tariq-aziz', '21:45', 0],
  ['mila-horvat', '21:50', 0], ['finn-gallagher', '21:55', 0], ['marek-duda', '21:55', 0], ['rosa-ibanez', '22:02', 0],
  ['jonas-weber', '22:12', 1], ['yuki-tanaka', '22:15', 0], ['layla-nasser', '22:20', 2], ['mara-okonkwo', '22:24', 0],
  ['theo-brooks', '22:27', 1], ['ben-adeyemi', '22:30', 0], ['chiara-russo', '22:33', 0], ['kofi-mensah', '22:35', 1],
  ['elif-demir', '22:37', 1], ['mina-park', '22:39', 0],
];

/** People in who are on no list (paid at the door), so the count starts at 142. */
export const WALK_INS = 118;

// ---------- later in the story (lessons 7 and 8) ----------

/** Rico Vance, on Noor's list by 19:00 with one plus-one, and on nobody's door until lesson 7. */
export const RICO = 'rico-vance';
/** Guests who join tonight's lists later in the story. The door shows them only from the stage that adds them. */
export const LATER: Guest[] = [{ id: RICO, name: 'Rico Vance', list: 'noor', plus: 1 }];
