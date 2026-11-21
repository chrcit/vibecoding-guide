// Fig. 4, the same request with and without context, for the three running examples. Each piece
// of context the reader switches on answers one or more of the questions the agent would otherwise
// guess at. The guesses are written to show the kind of guess an agent makes, not recorded from a
// run. Token sizes of the context items are estimates (the long read says so).

export interface Item {
  id: string;
  name: string;
  /** Estimated size in tokens. */
  tokens: number;
}
export interface Row {
  q: string;
  guess: string;
  told: string;
  /** The item that answers it. */
  by: string;
}
export interface Example {
  id: string;
  name: string;
  prompt: string;
  items: Item[];
  rows: Row[];
}

export const EXAMPLES: Example[] = [
  {
    id: 'club',
    name: 'Club list',
    prompt: 'Build an app for our football club to track who has paid.',
    items: [
      { id: 'users', name: 'Who uses it', tokens: 60 },
      { id: 'file', name: 'Instruction file', tokens: 150 },
      { id: 'example', name: 'An example row', tokens: 60 },
      { id: 'private', name: 'What stays private', tokens: 50 },
      { id: 'done', name: 'What done means', tokens: 90 },
    ],
    rows: [
      { q: 'Who signs in?', guess: 'Anyone can make an account', told: 'The treasurer and two coaches', by: 'users' },
      { q: 'What is a season?', guess: 'The calendar year', told: 'August to May', by: 'file' },
      { q: 'Where is the data kept?', guess: 'A new hosted database', told: 'The SQLite file the club already has', by: 'file' },
      { q: 'What is in a record?', guess: 'Name, and paid: yes or no', told: 'Name, team, amount, date paid, how', by: 'example' },
      { q: 'Who can see the list?', guess: 'Anyone with the link', told: 'Only people signed in', by: 'private' },
      { q: 'When is it done?', guess: 'When the page loads', told: 'A test signs in, adds a member, marks them paid', by: 'done' },
    ],
  },
  {
    id: 'hours',
    name: 'Holiday hours',
    prompt: 'The opening hours are wrong on holidays. Fix it.',
    items: [
      { id: 'list', name: 'The holiday list', tokens: 300 },
      { id: 'shot', name: 'A screenshot of the page', tokens: 1_500 },
      { id: 'file', name: 'Instruction file', tokens: 150 },
      { id: 'done', name: 'What done means', tokens: 90 },
      { id: 'limits', name: 'What not to touch', tokens: 50 },
    ],
    rows: [
      { q: 'Which days are holidays?', guess: 'Only 25 December', told: 'The days in data/holidays.csv', by: 'list' },
      { q: 'What should the page say?', guess: 'Closed on every holiday', told: 'Closed 25 Dec, 9:00 to 13:00 on Easter Monday', by: 'list' },
      { q: 'Which part of the page?', guess: 'The footer of every page', told: 'The opening-hours box on the visit page', by: 'shot' },
      { q: 'How does it check?', guess: 'Reads the code and says fixed', told: 'Runs pnpm test', by: 'file' },
      { q: 'When is it done?', guess: 'After one edit', told: 'Tests for 25 Dec, Easter Monday and a Tuesday pass', by: 'done' },
      { q: 'What may it change?', guess: 'Adds a date library', told: 'No new library; normal hours stay as they are', by: 'limits' },
    ],
  },
  {
    id: 'tidy',
    name: 'Contact tidy',
    prompt: 'Clean up contacts.csv.',
    items: [
      { id: 'dupes', name: 'The duplicate rule', tokens: 40 },
      { id: 'dates', name: 'The date rule', tokens: 40 },
      { id: 'example', name: 'Rows before and after', tokens: 200 },
      { id: 'output', name: 'Where to write, what to print', tokens: 60 },
      { id: 'file', name: 'Instruction file', tokens: 120 },
    ],
    rows: [
      { q: 'Which rows are duplicates?', guess: 'Rows with the same name', told: 'Same email, ignoring case', by: 'dupes' },
      { q: 'Which way round are dates?', guess: 'Month first, US style', told: 'Day first in; write 2026-12-25 out', by: 'dates' },
      { q: 'What is stray whitespace?', guess: 'Every double space, names too', told: 'Spaces at the start and end of a cell', by: 'example' },
      { q: 'Where does the result go?', guess: 'Over contacts.csv', told: 'contacts-clean.csv, original kept', by: 'output' },
      { q: 'What does it print?', guess: 'All 25,000 rows', told: 'Counts: rows in, rows out, duplicates', by: 'output' },
      { q: 'How does it run the script?', guess: 'Installs a new package first', told: 'node tidy.ts, nothing new installed', by: 'file' },
    ],
  },
];

export function tally(ex: Example, on: Set<string>) {
  const guesses = ex.rows.filter((r) => !on.has(r.by)).length;
  const tokens = ex.items.filter((i) => on.has(i.id)).reduce((a, i) => a + i.tokens, 0);
  return { guesses, tokens };
}

export function finding(ex: Example, on: Set<string>, window: number): string {
  const { guesses, tokens } = tally(ex, on);
  const share = tokens / window;
  const pct = share === 0 ? '0%' : share < 0.001 ? 'under 0.1%' : `${(share * 100).toFixed(1)}%`;
  if (guesses === ex.rows.length) return `With the prompt alone, the agent guesses <b>${guesses} of ${ex.rows.length}</b> things, and each guess can be wrong.`;
  if (guesses === 0) return `Nothing left to guess. The context cost <b>${tokens.toLocaleString('en-GB')} tokens</b>, ${pct} of the window.`;
  return `<b>${guesses} of ${ex.rows.length}</b> still guessed, for ${tokens.toLocaleString('en-GB')} tokens of context so far.`;
}
