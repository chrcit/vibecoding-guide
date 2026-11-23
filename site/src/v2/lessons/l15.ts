/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. Script: planning/guide-v2/lessons-14-17-setup.md. */
import type { SceneState, Label, P3 } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview } from '../preview';
import { t3code } from '../../data/t3code';
import { A, CHANGED, CHANGED_N, FIRST, RAN, RAN_N, atYou, b, file, n, points, push, searchRow, type Lesson } from '../content';

// ---------- lesson 15: the project grows ----------
// Week 5: Monday. Five weeks of features, each built on its own day by whichever thread was free.
// Like v1's grow.ts, the file tiles carry what has been built (stacks) and what nothing uses any
// more (junk). The heights and percentages are made up: the picture shows the mechanism.

const [READ_N] = t3code.screen.workLogGroups.value;
const staff = (stage: string, path: string): Preview => ({ app: 'staff', stage, url: `localhost:4321${path}` });

/** Tile 0 is tonight's list, the page most features go through; tile 2 holds the old copy nothing uses. */
const GROWN = { stacks: [6, 3, 4, 3, 2, 3], junk: [1, 0, 3, 0, 1, 0] };
const CLEAN = { stacks: [6, 3, 4, 3, 2, 3], junk: [0, 0, 0, 0, 0, 0] };
const EVEN = { stacks: [4, 4, 4, 3, 4, 2], junk: [0, 0, 0, 0, 0, 0] };

const frame = (): Label[] => [lab('you', 'you', 'left'), termLabel('a0', 'agent', 'top', 'the agent'), termLabel('gate', 'check', 'left'), termLabel('project', 'project', 'top', 'the Lantern’s app')];
function floor(p: { stacks: number[]; junk: number[] }, commits = 14): SceneState {
  const s = solo({ tools: true, gate: true, project: { rules: 'plain', stacks: [...p.stacks], junk: [...p.junk], commits: Array(commits).fill('ok'), files: ['', '', '', '', '', ''] }, blocks: [FIRST], labels: frame() });
  return s;
}
const note = (s: SceneState, ...more: Label[]) => { s.labels = [...frame(), ...more]; };
/** Beside the check, below the agent's base: clear of the gate's own label and of the window. */
const byGate = (text: string) => lab([26, 84, 0] as P3, text, 'right');
const gate = (s: SceneState, lamp: 'off' | 'ok' | 'bad') => { s.gates![0]!.lamp = lamp; };
const proj = (s: SceneState, p: { stacks: number[]; junk: number[] }) => { s.project!.stacks = [...p.stacks]; s.project!.junk = [...p.junk]; };

const search = { to: 'tool', tool: 'search', file: 0, back: 'tool' } as const;
const read = (f = 0) => ({ to: 'tool', tool: 'read', file: f, back: 'tool' }) as const;
const edit = (f: number) => ({ to: 'tool', tool: 'edit', file: f, back: 'tool' }) as const;
const run = (back: 'tool' | 'bad' = 'tool') => ({ to: 'tool', tool: 'run', back }) as const;
/** Stopped at the check: a reply through it goes straight to you (`to: 'you'` passes the gate on its way). */
const toGate = (kind: 'model' | 'bad' = 'model', through = true) => ({ to: 'gate', kind, through }) as const;

const TABLES = 'Guests with a table booking show their table number on tonight’s list. Done when Ana Lopez shows “Table 4” on tonight’s list at phone size.';

const lesson15: Lesson = {
  id: 'l15',
  parts: [
    {
      title: 'It reads more before it starts',
      thread: 'Table numbers',
      fresh: true,
      request: TABLES,
      lede: 'Week 5, Monday. The app has a door, promoter links, the bar, the rota, payouts and a do-not-admit list, each built on its own day by whichever thread was free. Now: table bookings.',
      points: points(floor(GROWN), [
        { say: 'The same size of request as the door page in lesson 2. First it has to find where guests live, and the project has more than one answer.', moves: [{ to: 'agent' }, search], ui: { context: 18, modelName: '' }, preview: staff('tables-missing', '/tonight'),
          edit: (s) => { push(s, b('you', 2), b('model', 0.8), b('tool', 3)); A(s).lamp = 'work'; s.project!.files = ['read', '', 'read', '', '', '']; note(s, lab([30, -30, 34] as P3, 'five weeks of features', 'right')); } },
        { say: 'It reads fourteen files before its first edit. On the first Friday it read two.', moves: [read(0), read(2)], ui: { context: 41 }, preview: staff('tables-missing', '/tonight'),
          edit: (s) => { push(s, b('model', 1), b('tool', 6), b('model', 1), b('tool', 7)); s.project!.files = ['read', 'read', 'read', 'read', 'read', 'read']; note(s, lab([30, -30, 34] as P3, 'read before the first edit', 'right')); } },
        { say: 'It changes the guest list it found first: an old copy that nothing in the app uses any more.', moves: [edit(2)], ui: { context: 44 }, preview: staff('tables-missing', '/tonight'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5)); s.project!.files = ['', '', 'edit', '', '', '']; note(s, lab([200, 36, 0] as P3, 'an old copy, unused', 'bottom')); } },
        { say: 'Its test passes, because the test reads the old copy too. It says done.', moves: [run(), { to: 'you', kind: 'model' }], ui: { context: 46 }, preview: staff('tables-missing', '/tonight'),
          edit: (s) => { push(s, b('model', 1), b('tool', 2), b('model', 1.6)); gate(s, 'ok'); A(s).lamp = 'off'; note(s, lab([200, 36, 0] as P3, 'an old copy, unused', 'bottom'), atYou('“Done.”')); } },
        { say: 'You open tonight’s list: no table numbers. The change went into a file that no page shows.', preview: staff('tables-missing', '/tonight'),
          edit: (s) => { gate(s, 'ok'); note(s, byGate('passed: the wrong file'), atYou('no table numbers')); } },
      ]),
      log: {
        took: '3m 30s',
        rows: [
          { at: 0, label: searchRow('guest', 'src'), detail: { plain: 'three places that hold a guest list', technical: 'src/guests.ts, src/guests-list.tsx, src/tonight.tsx', engineer: 'rg -l "guest" src: 23 files; 3 define a list' } },
          { at: 1, label: n(READ_N, 14), detail: { plain: 'before its first edit', technical: 'guests, promoters, door, payouts, tonight, tests…' } },
          { at: 2, label: n(CHANGED_N, 2), detail: { plain: 'a table number on the guest list it found', technical: 'src/guests-list.tsx, src/guests-list.test.ts', engineer: 'guests-list.tsx: imported by nothing since week 2 (tonight.tsx replaced it)' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'its own test passes', technical: 'npm test: 18 of 18' } },
        ],
      },
      answer: [
        'Tonight’s list now shows a table number next to any guest with a booking. I added it in src/guests-list.tsx, with a test that checks Ana Lopez shows “Table 4”.',
        'All 18 checks pass.',
      ],
      deeper: { level: 'engineer', text: 'Two files render a guest list, and one is imported by nothing. Nothing marks a file dead until something reads the import graph, so dead code costs twice: once in reading, and again when a test pins it and makes it look alive.' },
      tryIt: { prompt: 'Before you say done, open the page I’ll look at and show me the change there.', t3: 'Open the turn’s diff and check that each changed file is one the page actually uses. Open the page in the browser panel before you read the reply.' },
      sources: ['t3code.worktrees', 't3code.screen.contextWindow', 'claims.research.contextRot', 't3code.screen.workLogGroups'],
    },
    {
      title: 'A clean-up is its own job',
      thread: 'Remove unused code',
      fresh: true,
      request: 'Remove what nothing in the app uses: old copies, functions nothing calls, tests for pages that are gone. Change nothing else. Done when every check passes before and after, and the app looks the same. It must never touch tonight’s real list.',
      lede: 'Monday 11:00. A job that builds no feature. It makes the next one cheaper and less likely to land in the wrong file.',
      points: points(floor(GROWN), [
        { say: 'First it runs every check, so “after” has a “before” to match.', moves: [{ to: 'agent' }, run()], ui: { context: 9 }, preview: staff('tables-missing', '/tonight'),
          edit: (s) => { push(s, b('you', 3), b('model', 0.8), b('tool', 2)); A(s).lamp = 'work'; gate(s, 'ok'); note(s, byGate('before: 18 pass')); } },
        { say: 'It looks for what nothing imports or calls: the old guest list, a second search function, a test for a page that’s gone.', moves: [search, read(2)], ui: { context: 24 }, preview: staff('tables-missing', '/tonight'),
          edit: (s) => { push(s, b('model', 1), b('tool', 4), b('model', 1), b('tool', 3)); s.project!.files = ['read', '', 'read', '', 'read', '']; note(s, lab([200, 36, 0] as P3, 'nothing uses these', 'bottom')); } },
        { say: 'It removes them, runs every check again and replies. Same app, less to read.', moves: [edit(2), run(), { to: 'you', kind: 'model' }], ui: { context: 31 }, preview: staff('tables-missing', '/tonight'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 2), b('model', 1.6)); proj(s, CLEAN); s.project!.files = ['', '', 'ok', '', 'ok', '']; gate(s, 'ok'); A(s).lamp = 'off'; note(s, byGate('after: 17 pass')); } },
        { say: 'Later, the table request again, in a fresh thread. It reads five files, changes the one tonight’s list uses, and Ana shows Table 4.', moves: [{ to: 'agent' }, read(0), edit(0), run()], ui: { context: 12 }, preview: staff('tables', '/tonight'),
          edit: (s) => { A(s).blocks = [FIRST, b('you', 2), b('model', 0.8), b('tool', 4), b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 2)]; proj(s, CLEAN); s.project!.stacks![0]! += 1; s.project!.files = ['ok', '', '', '', '', '']; gate(s, 'ok'); note(s, lab([30, -30, 34] as P3, 'read: 5 files', 'right')); } },
      ]),
      log: {
        took: '2m 50s',
        rows: [
          { at: 0, label: RAN, tone: 'ok', detail: { plain: 'before: every check, 18 of 18', technical: 'npm test: 18 of 18' } },
          { at: 1, label: t3code.screen.workLog.value[0], detail: { plain: 'what nothing imports or calls', technical: 'unused exports and files', engineer: 'knip --reporter compact: 4 files, 2 exports' } },
          { at: 1, label: n(READ_N, 6), detail: { plain: 'each one, to be sure' } },
          { at: 2, label: n(CHANGED_N, 5), detail: { plain: '4 files and 2 functions removed', technical: '−src/guests-list.tsx, −src/guests-list.test.ts, −src/search-old.ts, −src/lineup.tsx; door.ts' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'after: 17 of 17 pass (one test was the old list’s)', technical: 'npm test: 17 of 17' } },
        ],
      },
      answer: [
        'Removed 4 files and 2 functions that nothing in the app used, and the old guest list’s test with them. Nothing else changed: every check passes before and after, 18 then 17, the 17 that are left.',
        'I didn’t touch any data. The app looks the same.',
      ],
      deeper: { level: 'technical', text: 'A clean-up mixed into a feature hides the feature in its diff. As its own job it has one check, “same behaviour”: the same checks, run before and after.' },
      tryIt: { prompt: 'Remove what nothing uses. Change nothing else. Done when every check passes before and after.', t3: 'Run it in its own thread, and in a new worktree if another thread is working in the project.' },
      sources: ['claims.lessons.runChecks', 't3code.worktrees', 't3code.screen.contextWindow'],
    },
    {
      title: 'A new shape, kept honest',
      thread: 'One guest store',
      fresh: true,
      request: 'Guests are stored in one place, not three. Done when everything works as before and every check passes, with made-up guests.',
      lede: 'Monday 14:00. A refactor changes the shape and keeps the behaviour. What says it kept the behaviour is the checks you wrote weeks ago.',
      points: points(floor(CLEAN), [
        { say: 'It moves the three guest stores into one. The same features, a new shape.', moves: [{ to: 'agent' }, edit(0), edit(1)], ui: { context: 22 }, preview: staff('payouts-why', '/payouts'),
          edit: (s) => { push(s, b('you', 1.8), b('model', 1), b('tool', 2), b('model', 1), b('tool', 2)); A(s).lamp = 'work'; proj(s, EVEN); s.project!.files = ['edit', 'edit', 'edit', '', 'edit', '']; note(s, lab([196, 36, 0] as P3, 'same features, new shape', 'bottom')); } },
        { say: 'It runs every check. The promoter checks from lesson 3 fail: Kai’s plus-ones are now counted twice, and so is the money for them.', moves: [run('bad'), toGate('bad', false)], ui: { context: 27 }, preview: staff('payouts-broken', '/payouts'),
          edit: (s) => { push(s, b('model', 1), b('bad', 3)); proj(s, EVEN); gate(s, 'bad'); s.project!.files = ['', 'bad', '', '', '', '']; note(s, byGate('an old check caught it')); } },
        { say: 'It fixes the count and runs everything again. All pass.', moves: [edit(1), run()], ui: { context: 31 }, preview: staff('payouts-why', '/payouts'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 2)); proj(s, EVEN); gate(s, 'ok'); s.project!.files = ['', 'ok', '', '', '', '']; note(s, byGate('17 of 17 pass')); } },
        { say: 'It adds one line to AGENTS.md: where guests live now. The next thread finds them in one look, not fourteen.', moves: [{ to: 'tool', tool: 'edit', back: 'tool' }, { to: 'you', kind: 'model' }], ui: { context: 33 }, preview: staff('payouts-why', '/payouts'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1), b('model', 2)); proj(s, EVEN); gate(s, 'ok'); s.project!.rules = 'lit'; s.project!.files = ['', '', '', '', '', '']; A(s).lamp = 'ok'; note(s, lab('rules', 'one line in AGENTS.md', 'left')); } },
      ]),
      log: {
        took: '5m 10s',
        rows: [
          { at: 0, label: n(CHANGED_N, 6), detail: { plain: 'one guest store; the pages read from it', technical: 'src/guests.ts and 5 pages that read guests', engineer: 'guests.ts: one Guest store; door, promoters, payouts, tonight, bar import it' } },
          { at: 1, label: RAN, tone: 'bad', detail: { plain: 'the promoter checks fail: plus-ones counted twice', technical: 'npm test: promoters.test.ts 2 failed', engineer: 'promoters.test.ts: limit and payout off by plusOnes (counted in Guest and in Arrival)' } },
          { at: 2, label: CHANGED, detail: { plain: 'plus-ones counted once', technical: 'src/guests.ts' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'every check passes, 17 of 17', technical: 'npm test: 17 of 17' } },
          { at: 3, label: CHANGED, detail: { plain: 'AGENTS.md: where guests live', technical: 'AGENTS.md (+1 line)' } },
        ],
      },
      answer: [
        'Guests now live in one store, src/guests.ts. The door, promoter pages, payouts and tonight’s list all read from it.',
        'The promoter checks caught one break on the way: plus-ones were counted twice after the move, so every promoter’s payout came out too high. Fixed; all 17 checks pass. I added one line to AGENTS.md saying where guests live.',
      ],
      deeper: { level: 'engineer', text: 'Without the promoter checks nothing would have failed, and Friday’s payouts would have come out too high. Before a refactor, ask for a test of the current behaviour where none exists, run it on the old shape, then refactor.' },
      tryIt: { prompt: 'Same behaviour, new shape: [what to change]. Run every check before and after, and add a test first wherever a behaviour has none.', t3: 'Expand the red Ran command row: the failing test names the old rule it protects.' },
      sources: ['claims.lessons.runChecks', 'claims.lessons.toolCallEvidence', 'harnesses.claudeCode.claudeMdLines'],
    },
  ],
};

export default lesson15;
