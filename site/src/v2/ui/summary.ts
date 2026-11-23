/*
 * What kind of work-log row a row is (search, read, change or run), from the words its label
 * starts with in T3 Code's own row templates. The page picks the row's icon by it.
 */
import type { Row } from '../content';
import { t3code } from '../../data/t3code';

const [SEARCHED, READ_FILE, CHANGED] = t3code.screen.workLog.value;
/** The words a row's label starts with, from T3 Code's row templates ("Searched {query} in {target}", "Read {path}"). */
const lead = (tpl: string) => tpl.split(/[\s{]/)[0]!;
const STARTS: [Kind, string[]][] = [
  ['search', [lead(SEARCHED), lead(t3code.screen.searchRow.value)]],
  ['read', [lead(READ_FILE), lead(t3code.screen.readRow.value)]],
  ['change', [lead(CHANGED)]],
  // Chapter 3: "Delegated {count} tasks" (t3code.screen.delegatedRow).
  ['delegate', [lead(t3code.screen.delegatedRow.value)]],
  // Lesson 6: "Skill: {name}" rows get the skill icon.
  ['skill', [lead(t3code.screen.skillRow.value)]],
];
const plain = (t: Row['label']) => (typeof t === 'string' ? t : t.plain);

export type Kind = 'search' | 'read' | 'change' | 'run' | 'delegate' | 'skill';

export function kindOf(r: Row): Kind {
  const first = plain(r.label).split(' ')[0]!;
  return STARTS.find(([, words]) => words.includes(first))?.[0] ?? 'run';
}
