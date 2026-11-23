/* Guide v2 lesson 11, A lead: see v2/content.ts for the types and lessons/ch3.ts for the shared pictures. */
import { lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { SceneState } from '../../journey/picture';
import { A, CHANGED_N, FIRST, RAN, RAN_N, b, n, points, push, type Lesson } from '../content';
import { FULL, H, S, all, app, delegated, desk, file, fillHelper, fromHelper, fromProject, helperToMain, lamp, note, readN, toHelper, toProject } from './ch3';

// ---------- lesson 11: a lead ----------
// Wednesday 14:00. One thread starts three more and checks their work together. Made up.

const LIST = 'Friday’s guest list';
const floor = () => desk(3, { trees: true, mgate: true, who: 'lead', lead: [FIRST], labels: [termLabel('project', 'main'), termLabel('mgate', 'check')] });
const imports = (stage: string) => app('guestimport', stage);
const thread = (s: SceneState) => { A(s).blocks = [FIRST, b('you', 3), b('tool', 3), b('model', 2), b('sum', 1.2), b('sum', 1.2), b('sum', 1.2), b('model', 2)]; };

const lesson11: Lesson = {
  id: 'l11',
  parts: [
    {
      title: 'One thread starts the others',
      thread: LIST,
      fresh: true,
      request: 'Bring Kai’s list, Noor’s list and the ticket sales into one guest list for Friday. Split the work across threads with a short brief each, and tell me what each one did before anything is merged.',
      lede: 'Wednesday 14:00. Kai keeps his guests in a spreadsheet, Noor in a sheet of her own, and the tickets come from yesterday’s sale page. You talk to one thread. It starts the others.',
      points: points(floor(), [
        { say: 'The lead reads a few rows of each list to see their shapes. It imports nothing itself.', moves: [{ to: 'agent' }, toProject(floor()), fromProject(floor())], ui: { perm: FULL, context: 3 }, preview: imports('sources'),
          edit: (s) => { push(s, b('you', 3), b('tool', 3)); A(s).lamp = 'work'; file(s, 0, 'read'); file(s, 1, 'read'); file(s, 3, 'read'); note(s, lab('tank:a0', 'three lists, three shapes', 'left')); } },
        { say: 'It writes a short brief for each list and hands each to a thread of its own, in its own worktree.', moves: [all(toHelper(0), toHelper(1), toHelper(2))], preview: imports('sources'),
          edit: (s) => { push(s, b('model', 2)); for (const i of [0, 1, 2]) { fillHelper(s, i, b('model', 2.4)); lamp(s, i, 'work'); } note(s, lab('w1', 'a brief each, own worktree', 'left')); } },
        { say: 'While they work, the lead waits for them. Its row in the sidebar says Waiting: still this turn, not finished.', status: S.waiting, preview: imports('sources'),
          edit: (s) => { A(s).lamp = 'wait'; for (const i of [0, 1, 2]) fillHelper(s, i, b('tool', 5), b('model', 1.5)); note(s, lab('tank:a0', 'Waiting on its threads', 'left')); } },
        { say: 'Each child thread starts with its brief, not the lead’s conversation. What it reads stays in its own window.', status: S.waiting, preview: imports('sources'),
          edit: (s) => { for (const i of [0, 1, 2]) fillHelper(s, i, b('tool', 6), b('model', 1.5), b('tool', 4)); note(s, lab('tank:w2', 'its brief, then its own work', 'right')); } },
        { say: 'Reports come back, a few lines each. The lead’s window holds the briefs and the reports, not the work behind them.', moves: [all(fromHelper(0), fromHelper(1), fromHelper(2))], preview: imports('sources'),
          edit: (s) => { thread(s); A(s).lamp = 'work'; for (const i of [0, 1, 2]) lamp(s, i, 'ok'); note(s, lab('tank:a0', 'reports: a few lines each', 'left')); } },
        { say: 'It replies with what each one did. Nothing is merged yet.', moves: [{ to: 'you', kind: 'model' }], preview: imports('sources'),
          edit: (s) => { A(s).lamp = 'off'; note(s); } },
      ]),
      log: {
        took: '14m 20s',
        rows: [
          { at: 0, label: readN(3), detail: { plain: 'a few rows of each list', technical: 'imports/kai.csv, imports/noor.xlsx (as CSV), tickets export' } },
          { at: 1, label: delegated(3), detail: { plain: 'one brief per list, each in its own worktree', technical: 'delegate_task × 3, isolation: worktree', engineer: 'delegate_task × 3 { isolation: "worktree", mode: "wait" }' } },
          { at: 1, label: '', agents: [
            { name: 'Import Kai’s spreadsheet', doing: 'building an importer for 42 rows', detail: { plain: '42 rows · its tests pass', technical: 'kai.csv: 42 rows, name;plus · 6 of 6' }, done: 4 },
            { name: 'Import Noor’s sheet', doing: 'building an importer for 31 rows', detail: { plain: '31 rows · its tests pass', technical: 'noor sheet: 31 rows · 5 of 5' }, done: 4 },
            { name: 'Import the ticket sales', doing: 'building an importer for 118 orders', detail: { plain: '118 buyers · its tests pass', technical: 'tickets: 118 orders, 1–4 each · 7 of 7' }, done: 4 },
          ] },
        ],
      },
      answer: [
        'Three threads built one importer each, in their own worktrees: Kai’s spreadsheet (42 rows), Noor’s sheet (31 rows) and the ticket sales (118 buyers). Each says its own tests pass.',
        'Nothing is merged yet. Next I’d check all three together, with made-up rows from each list.',
      ],
      deeper: { level: 'engineer', text: 'T3 Code gives the agent a delegate_task tool. Each call starts a child with only its task and no parent history; with isolation set to worktree it gets its own checkout, and it can run on another provider. The children live inside the lead’s view, not in the sidebar’s thread list.' },
      tryIt: { prompt: 'Split this across threads with a short brief each. Tell me what each one did before anything is merged.', t3: 'The lead’s row reads Waiting while it waits on its threads. Open any child from its row in the lead’s thread: it opens in the right panel.' },
      sources: ['t3code.delegate', 't3code.delegateChild', 't3code.screen.delegatedRow', 't3code.waitingOnChild', 't3code.screen.subagents'],
    },
    {
      title: 'The lead checks before main',
      thread: LIST,
      request: 'Check all three together, with made-up rows from each list, before anything reaches main.',
      lede: 'Wednesday 14:30. Each child said its tests pass. Each test only saw one list.',
      points: points(floor(), [
        { say: 'The lead imports made-up rows from all three lists at once. The check fails: Noor’s guests have no plus-ones.', ui: { context: 11 }, moves: [{ to: 'agent' }, toProject(floor()), fromProject(floor(), 'bad')], preview: imports('partial'),
          edit: (s) => { thread(s); push(s, b('you', 2), b('bad', 2)); A(s).lamp = 'work'; s.gates![0]!.lamp = 'bad'; note(s, lab('project', '31 guests, 0 plus-ones', 'bottom')); } },
        { say: 'Noor writes a plus-one after the name. Her importer read “Lea Brandt +1” as a name, and its own test had no plus-ones in it.', preview: imports('partial'),
          edit: (s) => { lamp(s, 1, 'bad'); note(s, lab('w1', '“Lea Brandt +1” read as a name', 'left')); } },
        { say: 'The lead hands the fix to a new child, with the failing row in its brief, and waits again.', moves: [toHelper(1, 'bad')], status: S.waiting, preview: imports('partial'),
          edit: (s) => { A(s).lamp = 'wait'; H(s, 1).blocks = [b('bad', 2.4)]; lamp(s, 1, 'work'); note(s, lab('w1', 'the failing row, in its brief', 'left')); } },
        { say: 'It’s fixed and reported back. The check on all three passes.', moves: [fromHelper(1)], preview: imports('fixed'),
          edit: (s) => { push(s, b('sum', 1.2)); lamp(s, 1, 'ok'); A(s).lamp = 'work'; s.gates![0]!.lamp = 'ok'; note(s, lab('project', 'all three together: pass', 'bottom')); } },
        { say: 'Then the three importers go through the check into main, one at a time, and it replies.', moves: [helperToMain(floor(), 0), helperToMain(floor(), 1), helperToMain(floor(), 2), { to: 'you', kind: 'model' }], preview: imports('fixed'),
          edit: (s) => { s.project!.commits = ['ok', 'ok', 'ok']; for (const i of [0, 1, 2]) { H(s, i).blocks = []; lamp(s, i, 'off'); } A(s).lamp = 'ok'; note(s, lab('project', '3 importers on main', 'bottom')); } },
      ]),
      log: {
        took: '8m 40s',
        rows: [
          { at: 0, label: RAN, tone: 'bad', detail: { plain: 'all three lists together: Noor’s guests have no plus-ones', technical: 'import check: Noor 31 guests, 0 plus-ones (expected 6)' } },
          { at: 2, label: delegated(1), detail: { plain: 'the fix, with the failing row in the brief', technical: 'delegate_task: “Noor writes +1 after the name: Lea Brandt +1”' } },
          { at: 2, label: '', agents: [{ name: 'Fix plus-ones in Noor’s importer', doing: 'fixing the failing row', detail: { plain: 'reads “+1” after a name · test added', technical: 'parseNoorRow: trailing +n → plusOnes · 6 of 6' }, done: 3 }] },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'all three lists together: pass', technical: 'import check: 187 rows, plus-ones 41 of 41' } },
          { at: 4, label: n(RAN_N, 3), tone: 'ok', detail: { plain: 'merged the three importers into main, checks after each', technical: 'git merge × 3 · npm test 38 of 38' } },
        ],
      },
      answer: [
        'All three importers are on main. My check on the three together found Noor’s plus-ones missing: her sheet writes “Lea Brandt +1”, and the importer read that as a name. A child thread fixed it with that row as its test.',
        'All 38 checks pass on main. Some guests are now on the list twice, once from each list they came from. That needs all three lists at once, so I’d do it here.',
      ],
      deeper: { level: 'technical', text: 'Each child’s “tests pass” covered only what its brief showed it. The lead’s check on all three together is the one that knows how they meet, so it goes in front of main. A child’s “done” is a report, not proof.' },
      tryIt: { prompt: 'Check the threads’ work together, with made-up data from each, before anything reaches main. Send failures back with the failing case.', t3: 'Expand the lead’s red Ran command row to see which list failed and why.' },
      sources: ['t3code.delegate', 't3code.screen.delegatedRow', 't3code.waitingOnChild', 'claims.lessons.toolCallEvidence'],
    },
    {
      title: 'The part only the lead can do',
      thread: LIST,
      request: 'Some guests are on two lists. Keep each person once, with every list they came from.',
      lede: 'Wednesday 15:00. One job needs all three lists at once.',
      points: points(floor(), [
        { say: 'Ana Lopez is on Kai’s list and also bought two tickets. No child thread could see that: each one saw a single list.', ui: { context: 13 }, moves: [{ to: 'agent' }], preview: imports('fixed'),
          edit: (s) => { thread(s); push(s, b('you', 2)); A(s).lamp = 'work'; s.project!.commits = ['ok', 'ok', 'ok']; note(s, lab('tank:a0', 'needs all three lists', 'left')); } },
        { say: 'So the lead does this part itself, on main, where the three lists meet.', moves: [toProject(floor()), fromProject(floor())], preview: imports('fixed'),
          edit: (s) => { push(s, b('tool', 3), b('model', 1.5)); file(s, 2, 'edit'); file(s, 5, 'edit'); note(s, lab('project', 'where the lists meet', 'bottom')); } },
        { say: 'Each guest on two lists becomes one guest who keeps both. The checks pass.', moves: [toProject(floor()), fromProject(floor())], preview: imports('merged'),
          edit: (s) => { push(s, b('tool', 2)); file(s, 2, 'ok'); file(s, 5, 'ok'); s.project!.commits = ['ok', 'ok', 'ok', 'ok']; note(s, lab('project', '4 people kept once', 'bottom')); } },
        { say: 'You read one reply. The child threads sit inside this one: open any of them from its row. Stopping this thread stops them too.', moves: [{ to: 'you', kind: 'model' }], preview: imports('merged'),
          edit: (s) => { push(s, b('model', 2)); A(s).lamp = 'ok'; note(s, lab('tank:a0', 'one reply, four threads behind it', 'left')); } },
      ]),
      log: {
        took: '4m 10s',
        rows: [
          { at: 1, label: n(CHANGED_N, 2), detail: { plain: 'one guest per person, keeping every list they came from', technical: 'src/guests/merge.ts, src/guests/merge.test.ts' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'the whole list with made-up rows: nobody twice', technical: 'npm test: 41 of 41 · 4 people on two lists, kept once' } },
        ],
      },
      answer: [
        'Friday’s guest list now takes Kai’s sheet, Noor’s sheet and the ticket sales: 187 people, nobody twice, plus-ones kept. Four guests were on two lists. Each is kept once, with both lists shown, so Ana Lopez reads “Kai · Ticket”.',
        'Three threads built the importers, one fixed Noor’s plus-ones, and I did the merging and the checks. All 41 pass on main.',
      ],
      deeper: { level: 'engineer', text: 'Keep for the lead the work that needs every part at once: the joins, the checks across parts and the final merge. Short briefs out and short reports back keep its window small enough to hold the whole job. Lesson 13 shows what happens when reports are long.' },
      tryIt: { prompt: 'Split it across threads, check their work together before main, and do the parts that need everything yourself. Give me one reply.', t3: 'Stopping a thread also stops the subagents it delegated to.' },
      sources: ['t3code.delegate', 't3code.stopStopsSubagents', 't3code.delegateChild'],
    },
  ],
};

export default lesson11;
