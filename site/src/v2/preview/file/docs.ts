/*
 * The Lantern's instruction files, as lesson 6 shows them in the file viewer (preview/file.ts) and
 * counts them in its replies (lessons/l6.ts). One source, so the line counts in the chat and the
 * lines on the page agree. Everything in them is made up: the club, its rules, its commands.
 */

/** AGENTS.md as the agent first writes it (lesson 6, part 2). */
export const AGENTS_V1: string[] = [
  '# The Lantern: guest and door app',
  '',
  '- Before you say done, run `npm test` and `npm run door-check` (the door at 390 px). Paste what they printed.',
  '- Times are 24-hour: 22:41.',
  '- A guest’s phone number never appears on any door screen.',
  '- Promoters only ever see their own list.',
  '- Tests use made-up guests from `fixtures/guests.ts`. Never read or change `data/live/`.',
  '- Door staff use one hand: large tap targets, and the search box within thumb reach.',
];

/** The rule lesson 6, part 3 adds: one line. */
export const RED_RULE = '- Red on the door means do not admit. Nothing else is red.';
/** Where it goes: under the phone-number rule, with the other door-screen rules. */
export const RED_AT = 5;
export const AGENTS_V2: string[] = [...AGENTS_V1.slice(0, RED_AT), RED_RULE, ...AGENTS_V1.slice(RED_AT)];
/** The number the reply gives: the rules in the file (its list items). */
export const rules = (lines: string[]) => lines.filter((l) => l.startsWith('- ')).length;

/** The line the long file's door-check rule sits on (lesson 6, part 4). */
export const MISSED_LINE = 131;
export const LONG_LINES = 240;
/** How long AGENTS.md is once the procedures move into skills. */
export const SHORT_LINES = 64;

const DOOR_CHECK_RULE = '- Before you say done on any /door page, run the door check below and paste the line it prints.';

// Weeks of "add that to AGENTS.md", section by section. The door-check procedure is in the middle,
// and its rule is on line 131.
const head: string[] = [
  '# The Lantern: guest and door app',
  '',
  'Read this before any change. Rules first, then how we do things.',
  '',
  '## Checks',
  '- Before you say done, run `npm test`. Paste what it printed.',
  '- Run `npm run typecheck` after any change to `src/`.',
  '- New pages get a test in `tests/`, named after the page.',
  '- Never skip or delete a test to make a run pass.',
  '- If a check can’t run, say which one and why.',
  '',
  '## Time',
  '- Times are 24-hour: 22:41.',
  '- A Friday night runs from 21:00 to 05:00. A check-in at 01:30 belongs to Friday.',
  '- Store times with their date. Show only the time at the door.',
  '',
  '## Door screens',
  '- A guest’s phone number never appears on any door screen.',
  '- Red on the door means do not admit. Nothing else is red.',
  '- Door staff use one hand: large tap targets, and the search box within thumb reach.',
  '- The door works offline for ten minutes and syncs when the signal is back.',
  '- Never show a guest’s full list history at the door, only tonight.',
  '- The head count is the biggest number on the screen.',
  '- Plus-ones are counted at the door, not when the promoter adds them.',
  '',
];

const middle: string[] = [
  '## Promoters',
  '- Promoters only ever see their own list.',
  '- A promoter’s limit is checked on the server, in `addGuest()`, not only in the page.',
  '- A guest added after 22:00 on Friday is marked late-added.',
  '- Promoter links never expire during a night. They change on Monday.',
  '- Promoters can’t see who has arrived until after 02:00.',
  '- Running late is set by the promoter, cleared at the door.',
  '- Never send a promoter another promoter’s numbers.',
  '',
  '## Guests',
  '- Names are shown as the guest typed them. Don’t capitalise or shorten them.',
  '- Search matches any part of a name, ignoring accents: “ines” finds Inês.',
  '- A regular has come three Fridays in a row. The star is gold.',
  '- Never merge two guests with the same name without asking.',
  '- Under-18s are refused at the door. The app never stores a date of birth.',
  '',
  '## Bar',
  '- Running-low taps go into one list for the morning order.',
  '- A tap on the same item within ten minutes counts once.',
  '- Items: lime, tonic, ice, ginger beer, soda, mint, lemons, cola, oat milk, cups.',
  '- The order list shows who tapped and when, newest last.',
  '- The bar list is cleared at 06:00, after it has been sent.',
  '',
  '## Rota',
  '- The rota is per night. A shift belongs to the night it starts in.',
  '- Never show a staff member’s phone number to another staff member in the app.',
  '- Swaps need both people to tap Accept.',
  '- The rota page loads in under a second on the bar’s old tablet.',
  '',
  '## Data',
  '- Tests use made-up guests from `fixtures/guests.ts`. Never read or change `data/live/`.',
  '- Never log names, phone numbers or emails. Log guest ids only.',
  '- Migrations go in `db/migrations/`, one change per file, never edited after they ran.',
  '- Back up `data/live/` before any migration. `npm run backup` does it.',
  '- Phone numbers are stored with the country code, as entered.',
  '- Delete a guest’s phone number on the Monday after their night.',
  '',
  '## Code',
  '- TypeScript, strict. No `any` in `src/`.',
  '- Pages in `src/pages/`, one file each. Shared parts in `src/ui/`.',
  '- No new dependency without saying why in the reply.',
  '- Styles in the page’s own `.css` file. Colours only from `src/ui/colors.css`.',
  '- Every button has a text label or an aria-label.',
  '- Keep functions short. If you add a flag argument, split the function instead.',
  '',
  '## Words',
  '- “Guest”, never “customer”.',
  '- “Promoter”, never “partner”.',
  '- “Door”, never “entrance” or “front”.',
  '- “Running late”, never “delayed”.',
  '- Buttons say what happens: “Check in”, not “OK”.',
  '',
  '## Copy at the door',
  '- Short. Sami reads it at arm’s length, in the dark.',
  '- Never blame the guest: “Not on tonight’s list”, not “Invalid guest”.',
  '- Numbers as digits: 3 plus-ones, not three.',
  '',
  '## Git',
  '- One change per commit, with a message that says why.',
  '- Never push to `main` directly. Open a pull request.',
  '- Never commit anything from `data/live/`.',
  '',
  '## Deploy',
  '- Deploys happen before 18:00 on Fridays, never after.',
  '- After a deploy, open /door on a phone and check in a made-up guest.',
  '- Roll back with `npm run rollback` if the door breaks. Ask later.',
  '',
  '## Accessibility',
  '- Every page works with the text size at 200%.',
  '- Contrast at least 4.5:1, also on the dark door theme.',
  '- Nothing moves on its own for more than 5 seconds.',
  '',
  '## Door check',
  '',
  'The door check is how done is checked for anything under /door. It takes about two minutes.',
  '',
];

const doorSteps: string[] = [
  '',
  '1. Start the dev server with made-up guests: `npm run dev:fixtures`.',
  '2. Run `npm run door-check`. It opens every /door page at 390 × 844.',
  '3. On /door, search “ana”, tap Ana Lopez in, then tap her again. The second tap must say “Already in”.',
  '4. Search “zed”. It must say “Not on tonight’s list”.',
  '5. On /door/late, no phone number may appear. The check fails if one does.',
  '6. On /door/close, tick every item. The last tick must show the lock-up time.',
  '7. Every tap target is at least 44 px.',
  '8. Paste the summary line it prints: `door-check: 12 of 12 at 390×844`.',
  '9. If a step can’t run, stop and say which step and why. Don’t say done.',
  '',
];

const tail: string[] = [
  '## Closing',
  '- The closing checklist lives at /door/close.',
  '- Only the last person on the door can tick “Doors locked”.',
  '- Lock-up time is written to the night’s log.',
  '',
  '## Fixtures',
  'Made-up guests in `fixtures/guests.ts`. Use these names in tests and examples:',
  '',
];

const FIXTURES = ['Ana Lopez', 'Lea Brandt', 'Ben Adeyemi', 'Mina Park', 'Jonas Weber', 'Mara Okonkwo', 'Felix Brandauer', 'Yuki Tanaka', 'Layla Nasser', 'Jun Watanabe', 'Karim Haddad', 'Clara Vogt', 'Theo Brooks', 'Sofia Marino', 'Idris Bello', 'Freya Holm', 'Rafael Costa', 'Chiara Russo', 'Noah Fischer', 'Hanna Kowalczyk', 'Ravi Menon', 'Amara Diallo', 'Nils Petersen', 'Zoë Laurent', 'Viktor Novak', 'Elif Demir', 'Mateo Ruiz', 'Inês Carvalho', 'Leon Hartmann', 'Tobias Lind'];
const fixtureLines = FIXTURES.map((n, i) => `- ${n}${i === 0 ? ' (a regular)' : i === 1 ? ' (Kai’s list)' : ''}`);

const glossary: string[] = [
  '',
  '## Pages',
  '- /door: search and check in.',
  '- /door/late: promoter guests not in by 00:00.',
  '- /door/close: the closing checklist.',
  '- /promoters: limits and numbers per promoter.',
  '- /p/<link>: one promoter’s own list.',
  '- /bar: running low.',
  '- /rota: who works which night.',
];

/** The long AGENTS.md: exactly LONG_LINES lines, the door-check rule on MISSED_LINE. */
export const AGENTS_LONG: string[] = (() => {
  const doorAt = middle.indexOf('## Door check');
  const pre = [...head, ...middle.slice(0, doorAt)];
  const door = middle.slice(doorAt);
  // Stock words fill the space before the door-check section, so the rule lands on its line.
  const items = ['Lime', 'Tonic', 'Ice', 'Ginger beer', 'Soda', 'Mint', 'Lemons', 'Cola', 'Oat milk', 'Cups', 'Straws', 'Napkins', 'Oranges', 'Sugar syrup', 'Bitters', 'Cucumber', 'Coffee beans', 'Milk', 'Tea', 'Water bottles', 'Wristbands', 'Stamp ink', 'Earplugs', 'Bin bags', 'Ice buckets', 'Glass-washer salt', 'Candles', 'Coat tickets'];
  const need = MISSED_LINE - 1 - pre.length - door.length;
  const stock = ['## Stock words', ...items.map((x) => `- ${x}: counted ${/s$/.test(x) ? 'by the box' : 'by the unit'}.`)].slice(0, Math.max(0, need - 1));
  while (stock.length < need - 1) stock.push('');
  const out = [...pre, ...stock, ...(need > 0 ? [''] : []), ...door, DOOR_CHECK_RULE, ...doorSteps, ...tail, ...fixtureLines, ...glossary];
  const more = ['- Keep this file up to date when a rule changes.', '- Ask before adding a rule that only one job needs.', '- Newest rules go at the end of their section.'];
  for (let k = 0; out.length < LONG_LINES; k++) out.push(more[k % more.length]!);
  return out.slice(0, LONG_LINES);
})();

/** The door-check skill (lesson 6, part 4), where Claude Code looks for project skills. */
export const SKILL_PATH = '.claude/skills/door-check/SKILL.md';
export const SKILL: string[] = [
  '---',
  'name: door-check',
  'description: Check the door pages at phone size before saying done on anything under /door. Use after any change to /door, /door/late or /door/close.',
  '---',
  '',
  '# Door check',
  '',
  'Run this before you say done on a change to a door page. It takes about two minutes.',
  ...doorSteps,
];
