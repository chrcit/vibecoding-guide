// Fig. 35, what belongs in an instruction file: lines for the bakery site's file, sorted between
// "In the file" and "Left out". The line counts are illustrative; the 200-line advice and the cost
// per line come from the page (a fact and the lab's TOKENS_PER_LINE).

export interface Line {
  id: string;
  text: string;
  /** Lines it takes in the file. */
  lines: number;
  belongs: boolean;
  /** Shown when it sits on the wrong side. Short. */
  why: string;
  /** Added by "Add a lesson", not there at the start. */
  lesson?: boolean;
}

export const LINES: Line[] = [
  { id: 'test', text: 'Test: pnpm test', lines: 1, belongs: true, why: 'It cannot guess the command' },
  { id: 'types', text: 'Type check: pnpm typecheck', lines: 1, belongs: true, why: 'It cannot guess the command' },
  { id: 'hours', text: 'Hours come from src/hours.ts', lines: 1, belongs: true, why: 'Saves a search every thread' },
  { id: 'dates', text: 'Holiday list dates are written 25/12/2026', lines: 1, belongs: true, why: 'The code hides this' },
  { id: 'live', text: "Never edit the live site's settings; ask", lines: 1, belongs: true, why: 'A rule the code cannot show' },
  { id: 'byhand', text: 'The holiday list is edited by hand each December', lines: 1, belongs: true, why: 'Written down nowhere else' },
  { id: 'tour', text: 'A tour of every folder', lines: 60, belongs: false, why: 'It can list folders itself' },
  { id: 'clean', text: 'Write clean, readable code', lines: 8, belongs: false, why: 'Changes nothing it does' },
  { id: 'style', text: 'The full style guide', lines: 140, belongs: false, why: 'The linter enforces it' },
  { id: 'easter', text: 'Steps for the Easter Monday fix', lines: 20, belongs: false, why: 'One task: put it in the prompt' },
  { id: 'readme', text: 'The README, pasted in', lines: 180, belongs: false, why: 'It can read the README' },
  { id: 'apidocs', text: 'Docs for the date library, pasted in', lines: 900, belongs: false, why: 'Point to them; read on demand' },
  { id: 'onetest', text: 'One test file: pnpm vitest run <file>', lines: 1, belongs: true, why: 'Learned the hard way', lesson: true },
  { id: 'nolib', text: 'Do not add a date library', lines: 1, belongs: true, why: 'Corrected twice', lesson: true },
  { id: 'askcsv', text: 'Ask before changing data/holidays.csv', lines: 1, belongs: true, why: 'Corrected twice', lesson: true },
  { id: 'tz', text: 'Times are Europe/London', lines: 1, belongs: true, why: 'Corrected twice', lesson: true },
  { id: 'shot', text: 'Screenshot a page: pnpm shot /visit', lines: 1, belongs: true, why: 'Learned the hard way', lesson: true },
];

/** In the file at the start: a file that grew without pruning, with two useful lines missing. */
export const START_IN = ['test', 'types', 'hours', 'dates', 'tour', 'clean', 'style', 'easter', 'readme', 'apidocs'];
