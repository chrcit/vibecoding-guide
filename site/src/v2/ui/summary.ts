/*
 * The inline thread summary under a request: T3 Code's "Worked for {duration}" line with grouped
 * counts in its own group words ("Read 2 files", "Ran 2 commands"). Only rows that have happened
 * count, so a group appears when its first row does.
 */
import type { Row } from '../content';
import { t3code } from '../../data/t3code';

const [SEARCHED, READ_FILE, CHANGED] = t3code.screen.workLog.value;
const [READ_N, CHANGED_N, RAN_N] = t3code.screen.workLogGroups.value;
/** The words a row's label starts with, from T3 Code's row templates ("Searched {query} in {target}", "Read {path}"). */
const lead = (tpl: string) => tpl.split(/[\s{]/)[0]!;
const STARTS: [Kind, string[]][] = [
  ['search', [lead(SEARCHED), lead(t3code.screen.searchRow.value)]],
  ['read', [lead(READ_FILE), lead(t3code.screen.readRow.value)]],
  ['change', [lead(CHANGED)]],
];
const plain = (t: Row['label']) => (typeof t === 'string' ? t : t.plain);

export type Kind = 'search' | 'read' | 'change' | 'run';

export function kindOf(r: Row): Kind {
  const first = plain(r.label).split(' ')[0]!;
  return STARTS.find(([, words]) => words.includes(first))?.[0] ?? 'run';
}

export interface Group { kind: Kind; text: string; tone?: 'bad' | 'ok'; now: boolean }

/**
 * The groups for the rows done by `point`. A group's tone is its latest row's; `now` marks a group
 * with a row at this point.
 */
export function groups(rows: Row[], point: number): Group[] {
  const done = rows.filter((r) => r.at <= point);
  const of = (k: Kind) => done.filter((r) => kindOf(r) === k);
  // How many a row stands for: "Ran 2 commands" is two, "Ran command" one.
  const num = (r: Row) => Number(/\b(\d+)\b/.exec(plain(r.label))?.[1] ?? 1);
  const many: Partial<Record<Kind, string>> = { read: READ_N, change: CHANGED_N, run: RAN_N };
  return (['search', 'read', 'change', 'run'] as const).filter((k) => of(k).length).map((k) => {
    const mine = of(k);
    // A group of one reads as the row itself; more read as T3 Code's group, with the count.
    const text = mine.length === 1 || !many[k] ? plain(mine.at(-1)!.label) : many[k]!.replace('{n}', String(mine.reduce((a, r) => a + num(r), 0)));
    return { kind: k, text, tone: mine.at(-1)!.tone, now: mine.some((r) => r.at === point) };
  });
}
