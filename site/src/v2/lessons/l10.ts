/* Guide v2 lesson 10, Side by side: see v2/content.ts for the types and lessons/ch3.ts for the shared pictures. */
import { lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import { jobSpot, type SceneState } from '../../journey/picture';
import { CHANGED_N, RAN, RAN_N, b, n, points, type Lesson, type StoryThread } from '../content';
import { FULL, J, S, all, app, jobToMain, jobToYou, mainToJob, note, row, sideBySide, stand, toJob } from './ch3';

// ---------- lesson 10: side by side ----------
// Tuesday 11:00. Three threads, three worktrees, one main. Made up.

const SALE = 'Ticket sale', SCAN = 'Door scan', SALES = 'Ticket sales';
const names = () => [stand(lab('j0', 'sale', 'top')), stand(lab('j1', 'scan', 'top')), stand(lab('j2', 'sales', 'top'))];
const tree = () => termLabel([jobSpot(2, 3)[0] + 30, 12, 2], 'worktree', 'right');
const floor = (mgate = false) => sideBySide(3, mgate ? names() : [...names(), tree()], { mgate });
const tickets = (stage: string, url?: string) => app('tickets', stage, url);
const work = (s: SceneState, i: number, on = true) => { J(s, i).lamp = on ? 'work' : 'off'; J(s, i).busy = on; s.tray!.cards[i]!.mark = on ? 'work' : undefined; };
const done = (s: SceneState, i: number) => { J(s, i).lamp = 'ok'; J(s, i).busy = false; s.tray!.cards[i]!.mark = 'wait'; };
const three = (a: string, c: string, d: string): StoryThread[] => [row(SALE, a, 0), row(SCAN, c), row(SALES, d)];

const lesson10: Lesson = {
  id: 'l10',
  parts: [
    {
      title: 'Three jobs, three worktrees',
      thread: SALE,
      fresh: true,
      request: 'People can buy up to four tickets for Friday on their phone, and get each ticket as a code to show at the door. Done when you’ve tried it at phone size with made-up buyers.',
      lede: 'Tuesday 11:00. Friday sells tickets. That’s three pieces: a sale page, the door scanning tickets, and a sales page for you. They look separate, so each gets its own thread, in New worktree.',
      replyAt: 3,
      points: points(floor(), [
        { say: 'You send the sale page in a new thread, in New worktree: its own copy of the project, on its own branch.', moves: [toJob(0, 3)], ui: { perm: FULL, context: 3 }, threads: [row(SALE, S.working, 0)],
          edit: (s) => { J(s, 0).blocks!.push(b('you', 3)); work(s, 0); note(s, lab('j0', 't3/ticket-sale', 'right')); } },
        { say: 'Mod+Enter sends a prompt in the background and opens a fresh one. You start the door scan and the sales page the same way, each in New worktree.', moves: [all(toJob(1, 3), toJob(2, 3))], threads: three(S.working, S.working, S.working),
          edit: (s) => { J(s, 1).blocks!.push(b('you', 3)); J(s, 2).blocks!.push(b('you', 2.4)); work(s, 1); work(s, 2); note(s, lab('tray', '3 threads, nothing waits for you', 'bottom')); } },
        { say: 'Each thread has its own window and its own copy of the project. None of them knows the other two exist.', threads: three(S.working, S.working, S.working),
          edit: (s) => { for (const i of [0, 1, 2]) J(s, i).blocks!.push(b('tool', 4), b('model', 1.5), b('tool', 3)); note(s, lab('tank:j1', 'its own window', 'right')); } },
        { say: 'By lunch all three are Done. Each one passed its own checks, in its own copy.', moves: [jobToYou(0, 3)], threads: three(S.done, S.done, S.done), preview: tickets('sale', 'localhost:4321/tickets'),
          edit: (s) => { for (const i of [0, 1, 2]) { J(s, i).blocks!.push(b('model', 2)); done(s, i); } note(s, lab('tray', 'pass, each on its own', 'bottom')); } },
        { say: 'The sale page writes codes like LTN-7K2Q. The door scan expects codes that start with “lantern:”. Nobody said what a ticket is.', threads: three(S.done, S.done, S.done), preview: tickets('scan-own', 'localhost:4322/door/scan'),
          edit: (s) => { note(s, lab('j0', 'LTN-7K2Q', 'right'), lab('j1', 'lantern:…', 'left')); } },
      ]),
      log: {
        took: '24m 10s',
        rows: [
          { at: 2, label: n(CHANGED_N, 5), detail: { plain: 'the sale page, tickets and their codes', technical: 'src/tickets/*.tsx, src/tickets/code.ts (LTN-xxxx)' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'tried at phone size with made-up buyers: all pass, in this worktree', technical: 'npm test: 12 of 12 (worktree t3/ticket-sale)' } },
        ],
      },
      answer: [
        'Tickets are on sale at /tickets, in this worktree on branch t3/ticket-sale. An order has up to four tickets, and each ticket is a code like LTN-7K2Q, with a QR to show at the door.',
        'I tried it at phone size with made-up buyers. All 12 checks pass here.',
      ],
      deeper: { level: 'technical', text: 'Each thread is its own session with its own window, and each worktree is a separate working directory on its own branch. That’s what lets them run at once without breaking each other’s test runs (lesson 4). It also means no check has yet run on all three together.' },
      tryIt: { prompt: 'Start each separate piece in its own thread, in New worktree. Done when [each piece’s check].', t3: 'In a new thread, choose New worktree before you send. Mod+Enter sends in the background and opens another fresh thread.' },
      sources: ['t3code.worktrees', 't3code.branchPrefix', 't3code.shortcuts.background', 'observations.experience.parallelThreads'],
    },
    {
      title: 'Bring them back',
      thread: SALE,
      request: 'Merge the three branches into main one at a time, and run every check on main after each merge.',
      lede: 'Tuesday 13:30. Three branches, one main.',
      replyAt: 3,
      points: points(floor(true), [
        { say: 'The sale branch goes first. Every check passes on main.', ui: { context: 9 }, moves: [{ to: 'path', path: [[0, 94], [-58, 52], [-58, 24]], kind: 'you' }, jobToMain(floor(true), 0, 3)], threads: three(S.working, S.done, S.done), preview: tickets('sale', 'localhost:4321/tickets'),
          edit: (s) => { for (const i of [0, 1, 2]) { J(s, i).blocks!.push(b('tool', 4), b('model', 2)); done(s, i); } work(s, 0); s.project!.commits = ['ok']; s.gates![0]!.lamp = 'ok'; s.tray!.cards[0]!.mark = 'ok'; note(s, lab('mgate', 'checks on main: pass', 'top')); } },
        { say: 'Then the door scan. The merge itself is clean: the two branches changed different files.', moves: [jobToMain(floor(true), 1, 3)], threads: three(S.working, S.done, S.done),
          edit: (s) => { s.gates![0]!.lamp = 'work'; note(s, lab('mgate', 'no conflicts', 'top')); } },
        { say: 'The checks on main fail. The door scan rejects every ticket the sale page makes.', threads: three(S.working, S.done, S.done), preview: tickets('mismatch', 'localhost:4321/door/scan'),
          edit: (s) => { s.gates![0]!.lamp = 'bad'; J(s, 1).lamp = 'bad'; note(s, lab('mgate', 'scan: “not a Lantern ticket”', 'top')); } },
        { say: 'It undoes that merge and replies. Main keeps the sale page, and nothing broken.', moves: [mainToJob(floor(true), 1, 3, 'bad'), jobToYou(0, 3)], threads: three(S.done, S.done, S.done), preview: tickets('mismatch', 'localhost:4321/door/scan'),
          edit: (s) => { s.gates![0]!.lamp = 'off'; J(s, 0).lamp = 'ok'; J(s, 0).busy = false; note(s, lab('main', 'two ideas of a ticket', 'bottom')); } },
        { say: 'Each check passed in its own copy because each tested its own idea of a ticket. A clean merge only means the lines don’t overlap.', look: 'log', threads: three(S.done, S.done, S.done), preview: tickets('mismatch', 'localhost:4321/door/scan'),
          edit: (s) => { note(s, lab('main', 'two ideas of a ticket', 'bottom'), lab('j1', 'lantern:…', 'left')); } },
      ]),
      log: {
        took: '3m 50s',
        rows: [
          { at: 0, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'merged the sale page; all checks pass on main', technical: 'git merge t3/ticket-sale · npm test: 12 of 12', engineer: 'git merge --no-ff t3/ticket-sale · npm test: 12/12 on main' } },
          { at: 1, label: RAN, tone: 'ok', detail: { plain: 'merged the door scan, no conflicts', technical: 'git merge t3/door-scan: no conflicts' } },
          { at: 2, label: RAN, tone: 'bad', detail: { plain: 'checks on main: the scan rejects the sale page’s tickets', technical: 'npm test: scan.spec “accepts a sold ticket” failed: LTN-7K2Q is not a Lantern ticket' } },
          { at: 3, label: RAN, detail: { plain: 'undid the door scan merge', technical: 'git reset --hard HEAD~1 (main back to the sale page)', engineer: 'git reset --hard ORIG_HEAD on main; t3/door-scan untouched' } },
        ],
      },
      answer: [
        'The sale page is on main, and all checks pass there. I didn’t keep the door scan merge: on main it rejects every ticket the sale page makes.',
        'The sale page writes codes like LTN-7K2Q, and the scan expects codes that start with “lantern:”. Each passed its own checks because each tested its own idea of a ticket.',
        'The sales page isn’t merged yet. Should I make the scan read the sale page’s codes?',
      ],
      deeper: { level: 'engineer', text: 'A clean merge means Git found no overlapping changes, nothing more. The ticket format was an implicit contract in two branches, so each branch’s tests encoded its own assumption. Checks on main after each merge are what find it.' },
      tryIt: { prompt: 'Merge the branches into main one at a time, and run every check on main after each merge. Stop at the first failure.', t3: 'Each thread’s diff view shows what its branch changed. Read them before you merge.' },
      sources: ['t3code.worktrees', 'claims.lessons.toolCallEvidence'],
    },
    {
      title: 'Agree the shape first',
      thread: SALE,
      request: 'Write down what a ticket is in one place on main, with a test. Then bring the scan and sales branches up to date with main, make them use it, and merge them one at a time.',
      lede: 'Tuesday 14:00. The one thing all three pieces share, written once, before anything else merges.',
      replyAt: 3,
      points: points(floor(true), [
        { say: 'One small change on main first: what a ticket is, with a test.', ui: { context: 12 }, moves: [{ to: 'path', path: [[0, 94], [-58, 52], [-58, 24]], kind: 'you' }, jobToMain(floor(true), 0, 3)], threads: three(S.working, S.done, S.done),
          edit: (s) => { for (const i of [0, 1, 2]) { J(s, i).blocks!.push(b('tool', 4), b('model', 2)); done(s, i); } work(s, 0); s.project!.commits = ['ok', 'ok']; s.gates![0]!.lamp = 'ok'; note(s, lab('main', 'a ticket, defined once', 'bottom')); } },
        { say: 'The scan and sales branches are brought up to date with main, and changed to use that one definition.', moves: [all(mainToJob(floor(true), 1, 3), mainToJob(floor(true), 2, 3))], threads: three(S.working, S.working, S.working),
          edit: (s) => { work(s, 1); work(s, 2); J(s, 1).blocks!.push(b('tool', 2)); J(s, 2).blocks!.push(b('tool', 2)); note(s, lab('j1', 'up to date with main', 'left')); } },
        { say: 'Then merged one at a time, with every check after each. All pass on main.', moves: [jobToMain(floor(true), 1, 3), jobToMain(floor(true), 2, 3)], threads: three(S.working, S.done, S.done), preview: tickets('together', 'localhost:4321/door/scan'),
          edit: (s) => { done(s, 1); done(s, 2); s.project!.commits = ['ok', 'ok', 'ok', 'ok']; s.gates![0]!.lamp = 'ok'; for (const c of s.tray!.cards) c.mark = 'ok'; note(s, lab('mgate', 'all pass on main', 'top')); } },
        { say: 'Split work where the pieces don’t touch. Write the parts they share first. Bring them back one at a time, with checks on main.', moves: [jobToYou(0, 3)], threads: three(S.done, S.done, S.done), preview: tickets('sales', 'localhost:4321/sales'),
          edit: (s) => { J(s, 0).lamp = 'ok'; J(s, 0).busy = false; note(s, lab('main', 'shared first, then split', 'bottom')); } },
      ]),
      log: {
        took: '9m 30s',
        rows: [
          { at: 0, label: n(CHANGED_N, 2), detail: { plain: 'what a ticket is, and a test for it', technical: 'src/tickets/ticket.ts, src/tickets/ticket.test.ts' } },
          { at: 1, label: RAN, detail: { plain: 'brought the scan and sales branches up to date with main', technical: 'git -C ../door-scan merge main · git -C ../ticket-sales merge main' } },
          { at: 1, label: n(CHANGED_N, 3), detail: { plain: 'the scan and the sales page read the shared ticket', technical: 'src/door/scan.tsx, src/sales/count.ts, src/door/scan.spec.ts' } },
          { at: 2, label: n(RAN_N, 4), tone: 'ok', detail: { plain: 'merged both, one at a time; all checks pass on main', technical: 'git merge t3/door-scan · npm test 26/26 · git merge t3/ticket-sales · npm test 31/31' } },
        ],
      },
      answer: [
        'A ticket is now defined once, in tickets/ticket.ts, with a test. The sale page writes it, the door scan reads it, and the sales page counts it.',
        { plain: 'I brought the scan and sales branches up to date with main and merged them one at a time, running every check after each. All 31 pass on main. At phone size, a ticket bought on /tickets scans as valid at the door, and a second scan says when it was first scanned.', engineer: 'Both branches merged main first, then went in one at a time with the full suite after each: 31/31 on main. At 390×844 a ticket bought on /tickets scans valid at /door/scan; a second scan shows “Already scanned at 23:04”.' },
      ],
      deeper: { level: 'technical', text: 'Threads side by side save your waiting, not the joining-up. In the guide’s own use, past three to five parallel threads the agents start waiting on you and review quality drops. That is an observation, not a measurement.' },
      tryIt: { prompt: 'Before we split this, write the parts every piece shares on main, with a test. Then split the rest into separate threads.', t3: 'Start each independent piece in New worktree. Merge them back one at a time and run the checks on main after each.' },
      sources: ['t3code.worktrees', 't3code.branchPrefix', 'observations.experience.parallelThreads'],
    },
  ],
};

export default lesson10;
