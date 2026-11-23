/* Guide v2 lesson 9, A helper: see v2/content.ts for the types and lessons/ch3.ts for the shared pictures. */
import { lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import { A, CHANGED, CHANGED_N, FIRST, RAN, b, n, points, push, searchRow, type Lesson } from '../content';
import { FULL, H, S, SUPERVISED, all, app, desk, file, fillHelper, fromHelper, fromProject, lamp, note, readN, reads, toHelper, toProject } from './ch3';

// ---------- lesson 9: a helper ----------
// Monday 10:00, the week after lessons 1 to 8. The Lantern's birthday is on Friday. Made up.

const ASK = 'Next I want guests to give back their spot from their invite link. First find every place the app counts a guest’s spot. Change nothing yet.';
const MAP = 'Where a spot is counted';
const READ = reads([5, 7, 4, 8, 6, 5, 7, 4, 6]);
const project = termLabel('project', 'project');
const helper = (i = 0) => termLabel(`w${i}`, 'helper', 'top', i ? undefined : 'a helper');
const invite = (stage: string, url?: string) => app('giveback', stage, url);

const alone = () => { const s = desk(0, { labels: [project] }); return s; };
const withHelper = () => desk(1, { lead: [], labels: [project, helper()] });
const three = () => desk(3, { labels: [project], lead: [] });

const lesson9: Lesson = {
  id: 'l9',
  parts: [
    {
      title: 'Reading fills the window',
      thread: MAP,
      fresh: true,
      request: ASK,
      lede: 'Monday 10:00, the week after. Friday went fine, and next Friday is the Lantern’s birthday: the first night with tickets. A question first, with nothing to change.',
      points: points(alone(), [
        { say: 'Your question goes in. Thread details say the window is 4% used.', moves: [{ to: 'agent' }], ui: { model: true, perm: FULL, log: true, context: 4 },
          edit: (s) => { push(s, b('you', 2.4)); A(s).lamp = 'work'; note(s, lab('tank:a0', 'a question, no changes', 'right')); } },
        { say: 'It searches the project. Fourteen places mention a guest’s spot.', moves: [toProject(alone()), fromProject(alone())], ui: { context: 6 },
          edit: (s) => { push(s, b('model', 1), b('tool', 3)); file(s, 1, 'read'); note(s); } },
        { say: 'To answer, it opens the files and reads each one whole. Every file it reads stays in its window.', moves: [toProject(alone()), fromProject(alone())], ui: { context: 31 },
          edit: (s) => { push(s, ...READ); file(s, 0, 'read'); file(s, 2, 'read'); file(s, 4, 'read'); note(s, lab('tank:a0', '9 files, read whole', 'right')); } },
        { say: 'Three of those files matter, and the answer is eight lines long. All nine files stay in its window for the rest of this thread.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2.4)); A(s).lamp = 'off'; note(s, lab('tank:a0', '31% used for 8 lines', 'right')); } },
      ]),
      log: {
        took: '2m 40s',
        rows: [
          { at: 1, label: searchRow('spot', 'src'), detail: { plain: 'fourteen places mention a guest’s spot', technical: '14 matches in 9 files' } },
          { at: 2, label: readN(9), detail: { plain: 'the promoter lists, the door and the late list, and six more', technical: 'promoters.ts, door/count.ts, door/late.ts and 6 more' } },
        ],
      },
      answer: [
        { plain: 'A spot is counted in three places: the promoter’s limit, with plus-ones included; the door’s head count; and the late list. Giving back a spot has to change all three.', technical: 'A spot is counted in three places: the promoter’s limit in promoters.ts (plus-ones included), the door’s head count in door/count.ts, and the late list in door/late.ts. Giving back a spot has to change all three.' },
        'Nothing is changed yet.',
      ],
      deeper: { level: 'technical', text: 'Every file it read stays in this thread’s window, and each later turn reads them all again (lesson 5). A read-heavy question costs context for the rest of the session, which is the job helpers are for.' },
      tryIt: { prompt: 'Find every place [the thing] is used in this project. Change nothing yet.', t3: 'Open thread details and note the Context window before and after a question that makes it read a lot.' },
      sources: ['t3code.screen.contextWindow', 't3code.screen.searchRow', 't3code.screen.workLogGroups'],
    },
    {
      title: 'A helper with an empty window',
      thread: 'Give back a spot',
      fresh: true,
      request: `${ASK} Use a helper for the reading.`,
      lede: 'The same question in a new thread. This time the agent hands the reading to a helper.',
      points: points(withHelper(), [
        { say: 'A new thread, the same question, and one more sentence: use a helper for the reading.', moves: [{ to: 'agent' }], ui: { context: 3 },
          edit: (s) => { A(s).blocks = [FIRST, b('you', 3)]; A(s).lamp = 'work'; note(s); } },
        { say: 'The agent writes a short brief and starts a helper. A helper is a subagent: it runs inside this thread, not as a thread of its own.', moves: [toHelper(0)],
          edit: (s) => { push(s, b('model', 1.2)); fillHelper(s, 0, b('model', 2.4)); lamp(s, 0, 'work'); note(s, lab('tank:w0', 'its window: only the brief', 'right')); } },
        { say: 'The helper does the searching and reading. The files fill the helper’s window. The agent’s window stays as it was.', moves: [{ to: 'path', path: [[0, -84], [0, -46], [162, -46]], kind: 'model' }],
          edit: (s) => { fillHelper(s, 0, b('tool', 3), ...READ); file(s, 0, 'read'); file(s, 1, 'read'); file(s, 2, 'read'); note(s, lab('tank:w0', '9 files, in the helper’s window', 'right')); } },
        { say: 'Only its report comes back, eight lines. Everything the helper read stays behind in its own window.', moves: [fromHelper(0, 'sum')],
          edit: (s) => { push(s, b('sum', 2)); H(s, 0).blocks = []; lamp(s, 0, 'off'); note(s, lab('tank:a0', 'the report: 8 lines', 'right')); } },
        { say: 'The same answer as before, and this thread’s window is 7% used, not 31%.', moves: [{ to: 'you', kind: 'model' }], ui: { context: 7 },
          edit: (s) => { push(s, b('model', 2.4)); A(s).lamp = 'off'; note(s, lab('tank:a0', '7% used, not 31%', 'right')); } },
      ]),
      log: {
        took: '2m 55s',
        rows: [
          { at: 1, label: '', agents: [{ name: 'Find where a guest’s spot is counted', doing: 'searching and reading the project', detail: { plain: 'read 9 files · sent back 8 lines', technical: 'Read 9 files · report: promoters.ts, door/count.ts, door/late.ts' }, done: 3 }] },
        ],
      },
      answer: [
        { plain: 'A spot is counted in three places: the promoter’s limit, with plus-ones included; the door’s head count; and the late list. Giving back a spot has to change all three.', technical: 'A spot is counted in three places: the promoter’s limit in promoters.ts (plus-ones included), the door’s head count in door/count.ts, and the late list in door/late.ts. Giving back a spot has to change all three.' },
        'A helper did the reading. Its report is above. Nothing is changed yet.',
      ],
      deeper: { level: 'engineer', text: 'Claude Code starts each subagent with a fresh window that doesn’t see the conversation, the skills already used or the files already read, and returns only a summary. The helper’s reads still cost tokens: they moved to another window, they weren’t saved (part 4).' },
      tryIt: { prompt: 'Use a helper to find [what you need]. Bring back only what matters, in a few lines.', t3: 'In the thread, expand the subagent’s row to see what it was asked and what it sent back.' },
      sources: ['harnesses.claudeCode.subagents', 'harnesses.claudeCode.subagentFreshContext', 't3code.screen.subagents', 't3code.screen.subagentRow'],
    },
    {
      title: 'Three helpers check at once',
      thread: 'Give back a spot',
      request: 'Now build it. Done when you’ve tried it at phone size with made-up guests: a guest gives back their spot, and it frees up on the promoter’s list, at the door and on the late list, plus-ones included.',
      lede: 'Monday 10:40. The agent builds the give-back itself, then sends three helpers to check the three places at once.',
      points: points(three(), [
        { say: 'It builds the give-back page itself. Changing code stays in this thread, where the agent can see all of it.', ui: { context: 14 }, moves: [{ to: 'agent' }, toProject(three(), 'model'), fromProject(three())], preview: invite('invite'),
          edit: (s) => { A(s).blocks = [FIRST, b('you', 3), b('sum', 2), b('model', 2), b('you', 3), b('tool', 4)]; A(s).lamp = 'work'; file(s, 1, 'edit'); file(s, 2, 'edit'); file(s, 4, 'edit'); note(s, lab('project', 'the give-back page', 'bottom')); } },
        { say: 'Then three helpers start at once, one for each place a spot is counted. Each brief names its place and says plus-ones count.', moves: [all(toHelper(0), toHelper(1), toHelper(2))], preview: invite('invite'),
          edit: (s) => { for (const i of [0, 1, 2]) { fillHelper(s, i, b('model', 2.4)); lamp(s, i, 'work'); } A(s).lamp = 'wait'; note(s, lab('w1', '3 at once, one brief each', 'left')); } },
        { say: 'Each opens the app at phone size and gives back a made-up guest’s spot. Two report back: the promoter’s list and the late list are right.', moves: [all(fromHelper(0, 'sum'), fromHelper(2, 'sum'))], preview: invite('invite'),
          edit: (s) => { for (const i of [0, 1, 2]) fillHelper(s, i, b('tool', 5), b('model', 1.5)); push(s, b('sum', 1.2), b('sum', 1.2)); lamp(s, 0, 'ok'); lamp(s, 2, 'ok'); note(s, lab('w1', 'still checking', 'left')); } },
        { say: 'The door helper reports a problem: after Ana gives back her spot, the door still counts her plus-one.', moves: [fromHelper(1, 'bad')], preview: invite('door-bug', 'localhost:4321/door'),
          edit: (s) => { push(s, b('bad', 1.4)); lamp(s, 1, 'bad'); note(s, lab('w1', 'door: +1 still counted', 'left')); } },
        { say: 'The agent fixes the door’s count and runs the door check itself. All three places pass, and it replies.', moves: [toProject(three(), 'model'), fromProject(three()), { to: 'you', kind: 'model' }], preview: invite('fixed'),
          edit: (s) => { push(s, b('tool', 2), b('model', 2)); for (const i of [0, 1, 2]) { H(s, i).blocks = []; lamp(s, i, 'off'); } file(s, 2, 'ok'); A(s).lamp = 'ok'; note(s, lab('project', 'door check: 3 of 3', 'bottom')); } },
      ]),
      log: {
        took: '7m 10s',
        rows: [
          { at: 0, label: n(CHANGED_N, 3), detail: { plain: 'the invite page, giving back a spot, the counts', technical: 'src/i/[code].tsx (new), src/spots.ts, src/promoters.ts' } },
          { at: 1, label: '', agents: [
            { name: 'Check Kai’s list after a give-back', detail: { plain: 'spot and +1 back on the list', technical: 'Kai 20 → 18 of 20' }, done: 2 },
            { name: 'Check the door after a give-back', detail: { plain: 'the door still counts the +1', technical: 'door/count.ts: expected 212, should be 211' }, done: 3, tone: 'bad' },
            { name: 'Check the late list after a give-back', detail: { plain: 'Ana is off the late list', technical: 'door/late.ts: removed' }, done: 2 },
          ] },
          { at: 4, label: CHANGED, detail: { plain: 'the door’s count drops plus-ones too', technical: 'src/door/count.ts' } },
          { at: 4, label: RAN, tone: 'ok', detail: { plain: 'the door check at phone size: all three places pass', technical: 'npm run door-check: 3 of 3' } },
        ],
      },
      answer: [
        'Guests can now give back their spot from their invite. The spot and any plus-ones go back to their promoter, and the door’s count and the late list drop with them.',
        { plain: 'I tried it at phone size with made-up guests. Three helpers checked the promoter’s list, the door and the late list at the same time. The door helper found the plus-one still counted. I fixed that and ran the door check: all three pass.', engineer: 'I tried it at 390×844 with made-up guests. Three read-only helpers checked the promoter’s list, the door and the late list in parallel. The door helper found door/count.ts still counting the +1. I fixed it and ran the door check myself: 3 of 3.' },
      ],
      deeper: { level: 'technical', text: 'Helpers that only read and try can run side by side in one checkout. Helpers that edit the same files clash, as two threads did in lesson 4. With nothing configured, Claude Code runs a subagent in the background and its result arrives later; Codex waits for all of them and answers once.' },
      tryIt: { prompt: 'Check [these three things] at the same time, with a helper each. Each brief says [the rule they all need].', t3: 'With two or more, the subagents row says how many are working, done or failed. Expand it to see which one failed and why.' },
      sources: ['harnesses.claudeCode.subagentBackground', 'harnesses.codex.subagentResults', 't3code.screen.subagents', 't3code.screen.subagentStates', 'claims.lessons.toolCallEvidence'],
    },
    {
      title: 'Its questions and its usage are yours',
      thread: 'Give back a spot',
      request: 'Try the give-back on a copy of Friday’s real list before it goes live. It must never change the live list.',
      lede: 'Monday 11:30. This touches real guests, so you switch the thread to Supervised: it asks before commands and file changes.',
      replyAt: 3,
      points: points(desk(1, { lead: [], meter: 0.74, labels: [project, helper()] }), [
        { say: 'Supervised now. The agent starts a helper to try the give-back on a copy of Friday’s list.', moves: [{ to: 'agent' }, toHelper(0)], ui: { context: 18, perm: SUPERVISED, limits: [{ label: 'Weekly', left: 74 }] }, preview: invite('fixed'),
          edit: (s) => { A(s).blocks = [FIRST, b('you', 3), b('sum', 2), b('model', 2), b('you', 3), b('model', 1.2)]; fillHelper(s, 0, b('model', 2.4)); lamp(s, 0, 'work'); note(s, lab('tank:w0', 'tries it on a copy', 'right')); } },
        { say: 'The helper wants to run a command. You can’t message a helper, so its request comes to you here, and the thread’s row says Approval.', moves: [fromHelper(0, 'model'), { to: 'path', path: [[0, 22], [0, 94]], kind: 'model' }], status: S.approval, preview: invite('fixed'),
          edit: (s) => { lamp(s, 0, 'wait'); A(s).lamp = 'wait'; note(s, lab('w0', 'asks to run a command', 'right')); } },
        { say: 'The command reads a copy of the list and writes nothing back. You approve, and the helper goes on.', moves: [{ to: 'agent' }, toHelper(0, 'you')], preview: invite('trial', 'localhost:4321/i/lea?trial'),
          edit: (s) => { lamp(s, 0, 'work'); A(s).lamp = 'work'; fillHelper(s, 0, b('you', 1), b('tool', 6)); note(s, lab('w0', 'approved: a copy', 'right')); } },
        { say: 'Every helper sends its own requests to the model, and they come out of the same plan as this thread.', moves: [fromHelper(0, 'sum'), { to: 'you', kind: 'model' }], ui: { limits: [{ label: 'Weekly', left: 66 }] }, preview: invite('trial', 'localhost:4321/i/lea?trial'),
          edit: (s) => { push(s, b('sum', 1.6), b('model', 2)); H(s, 0).blocks = []; lamp(s, 0, 'off'); A(s).lamp = 'ok'; s.meters![0]!.level = 0.66; note(s, lab('meter:m0', 'one plan for all of them', 'bottom')); } },
      ]),
      log: {
        took: '3m 20s',
        rows: [
          { at: 0, label: '', agents: [{ name: 'Try the give-back on a copy of Friday’s list', doing: { plain: 'trying it on a copy of Friday’s list', technical: 'npm run trial -- --copy data/live/friday.json' }, detail: { plain: 'asked to run the trial on a copy · approved', technical: 'npm run trial -- --copy data/live/friday.json' }, done: 3 }] },
          { at: 1, label: 'npm run trial -- --copy data/live/friday.json', approval: { kind: 'command', until: 2 }, detail: 'asked by the helper “Try the give-back on a copy of Friday’s list”' },
        ],
      },
      answer: [
        'On a copy of Friday’s list, 14 made-up guests gave back their spots and every count dropped as it should. The live list wasn’t touched: the trial reads a copy and writes nothing back.',
        'You can try it yourself on the copy in the browser panel.',
      ],
      deeper: { level: 'technical', text: 'Helpers draw on the same usage as the main conversation; in Claude Code, /usage shows what share went to subagents. A helper can run on a smaller model, and Anthropic’s cost advice suggests Haiku for simple subagent tasks (lesson 13).' },
      tryIt: { prompt: 'Use a helper for [the reading or the checking]. Ask me before it runs anything that touches real data.', t3: 'An Approval row on a thread can be one of its helpers asking. Answer it in that thread: helpers the agent started can’t take messages.' },
      sources: ['t3code.subagentRequests', 't3code.screen.permissionChip', 't3code.modeMeaning', 'plans.claude.limits.subagentsDraw', 'harnesses.claudeCode.subagentAttribution', 'harnesses.claudeCode.smallSubagentModel', 't3code.screen.usageLimits'],
    },
  ],
};

export default lesson9;
