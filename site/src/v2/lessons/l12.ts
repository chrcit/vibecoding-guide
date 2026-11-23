/* Guide v2 lesson 12, A second model: see v2/content.ts for the types and lessons/ch3.ts for the shared pictures. */
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import { route, reverse, type SceneState } from '../../journey/picture';
import { models } from '../../data/models';
import { A, CHANGED_N, FIRST, MODEL, RAN, b, file, n, points, push, type Lesson, type Move } from '../content';
import { J, S, all, app, delegated, jobToYou, note, row, sideBySide, stand, toJob } from './ch3';

// ---------- lesson 12: a second model ----------
// Thursday 16:00. The checkout takes money tomorrow. Made up; which model finds what is made up too.

const SOL = models['gpt-6-2-sol'].name;
const REVIEW = 'Review the ticket checkout';
const tickets = (stage: string, url?: string) => app('tickets', stage, url);
/** The builder with its tools and the project, a gate in front of you, and a reviewer beside the gate. */
const bench = (other: boolean): SceneState => {
  const s = solo({ tools: true, project: true, gate: true, reviewer: true, blocks: [FIRST], labels: [lab('you', 'you', 'left'), termLabel('a0', 'model', 'top', MODEL), termLabel('r0', 'review', 'top', other ? SOL : `${MODEL}, fresh`), termLabel('gate', 'check', 'bottom')] });
  s.agents[1]!.model = other ? 'b' : 'a';
  s.project!.files = ['', '', '', '', '', ''];
  return s;
};
const R = (s: SceneState) => s.agents[1]!;
const toReviewer: Move[] = [{ to: 'gate', kind: 'model' }, { to: 'path', path: route.gateToReviewer(), kind: 'model' }];
const fromReviewer = (kind: 'bad' | 'sum' | 'model' = 'sum'): Move => ({ to: 'path', path: reverse(route.gateToReviewer()), kind });
const fix: Move[] = [{ to: 'tool', tool: 'edit', file: 2, back: 'tool' }, { to: 'tool', tool: 'run', back: 'tool' }];
const built = (s: SceneState) => { A(s).blocks = [FIRST, b('you', 2.4), b('tool', 5), b('model', 2), b('tool', 4), b('model', 2)]; };

const lesson12: Lesson = {
  id: 'l12',
  parts: [
    {
      title: 'Fresh eyes, same model',
      thread: REVIEW,
      fresh: true,
      request: 'Before tomorrow, have a helper that hasn’t seen the checkout code review it.',
      lede: 'Thursday 16:00. The ticket checkout takes real money tomorrow. You want it read by something that didn’t write it.',
      points: points(bench(false), [
        { say: 'The agent starts a helper to review the change. The helper gets the change and a brief, not the conversation that wrote it.', ui: { context: 4 }, moves: [{ to: 'agent' }, ...toReviewer],
          edit: (s) => { built(s); push(s, b('you', 2)); A(s).lamp = 'work'; R(s).blocks = [b('model', 2), b('tool', 5)]; R(s).lamp = 'work'; R(s).busy = true; note(s, lab('r0', 'the change and a brief', 'bottom')); } },
        { say: 'It finds one thing: a refund doesn’t free the door’s count, so the door still expects the guest.', moves: [fromReviewer('bad')], preview: tickets('refund-bug', 'localhost:4321/sales'),
          edit: (s) => { R(s).lamp = 'bad'; R(s).busy = false; push(s, b('bad', 1.4)); s.gates![0]!.lamp = 'bad'; note(s, lab('r0', '1 found: refunds', 'bottom')); } },
        { say: 'The agent fixes it, runs the checks and replies.', moves: [...fix, { to: 'you', kind: 'model' }], preview: tickets('refund-bug', 'localhost:4321/sales'),
          edit: (s) => { push(s, b('tool', 2), b('model', 2)); file(s, 2, 'ok'); s.gates![0]!.lamp = 'ok'; R(s).lamp = 'off'; R(s).blocks = []; A(s).lamp = 'ok'; note(s); } },
        { say: 'A fresh window helps because it never saw the builder’s reasoning. It’s still the same model, so it tends to miss what the builder missed.',
          edit: (s) => { note(s, lab('r0', 'same model: same blind spots', 'bottom')); } },
      ]),
      log: {
        took: '5m 30s',
        rows: [
          { at: 0, label: '', agents: [{ name: 'Review the ticket checkout', doing: 'reading the change', detail: { plain: '1 problem: a refund doesn’t free the door’s count', technical: 'refund(): door.expected not decremented' }, done: 1, model: MODEL }] },
          { at: 2, label: n(CHANGED_N, 2), detail: { plain: 'a refund now frees the door’s count, with a test', technical: 'src/tickets/refund.ts, refund.test.ts' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'all checks pass', technical: 'npm test: 33 of 33' } },
        ],
      },
      answer: [
        'A helper that hadn’t seen the checkout code reviewed it and found one problem: a refund didn’t free the door’s count, so the door still expected the guest. I fixed it and added a test. All 33 checks pass.',
      ],
      deeper: { level: 'technical', text: 'By default a Claude Code subagent is the same model on the same task: you get a fresh pair of eyes, not a smarter answer. In a terminal, Claude Code’s /code-review does this with a background subagent that never saw the conversation.' },
      tryIt: { prompt: 'Have a helper that hasn’t seen this code review it. Give it the change and what it’s for, not our conversation.', t3: 'The review is a subagent row in this thread. Its model is in the row’s hover card.' },
      sources: ['harnesses.claudeCode.sameModelReviewer', 'harnesses.claudeCode.codeReview', 'harnesses.claudeCode.subagentFreshContext', 't3code.screen.subagentRow'],
    },
    {
      title: 'A different model reads it',
      thread: REVIEW,
      request: `Now have ${SOL} review the checkout in a thread of its own. Find the three most likely ways it’s wrong, and show how to see each one fail. Skip style.`,
      lede: 'Thursday 16:30. A different model, from a different provider, with a brief that asks for failures you can see.',
      points: points(bench(true), [
        { say: `The thread hands the review to Codex running ${SOL}: a child thread with the change and your brief, and none of this conversation.`, ui: { context: 8 }, moves: [{ to: 'agent' }, ...toReviewer], status: S.waiting,
          edit: (s) => { built(s); push(s, b('you', 2), b('bad', 1.4), b('tool', 2), b('model', 2), b('you', 3)); A(s).lamp = 'wait'; R(s).blocks = [b('you', 2.4), b('tool', 5)]; R(s).lamp = 'work'; R(s).busy = true; note(s, lab('r0', 'the change and your brief', 'bottom')); } },
        { say: 'It finds a race: two phones buying the last ticket at the same moment both get it. That’s 401 tickets for 400 places.', moves: [fromReviewer('bad')], status: S.waiting, preview: tickets('race', 'localhost:4321/tickets'),
          edit: (s) => { R(s).lamp = 'bad'; push(s, b('bad', 1.4)); s.gates![0]!.lamp = 'bad'; note(s, lab('r0', 'the last ticket, sold twice', 'bottom')); } },
        { say: 'And a refund paid twice when the button is tapped twice. Each finding comes with a way to see it fail.', moves: [fromReviewer('bad')], preview: tickets('race', 'localhost:4321/tickets'),
          edit: (s) => { push(s, b('bad', 1.2)); R(s).busy = false; R(s).blocks = []; R(s).lamp = 'off'; A(s).lamp = 'work'; note(s, lab('r0', '2 found, each shown failing', 'bottom')); } },
        { say: 'The builder fixes both and adds a test for each, written from the reviewer’s way of seeing it fail.', moves: fix, preview: tickets('race-fixed', 'localhost:4321/tickets'),
          edit: (s) => { push(s, b('tool', 3), b('model', 1.5)); file(s, 2, 'ok'); file(s, 3, 'ok'); s.gates![0]!.lamp = 'ok'; note(s, lab('r0', '2 tests, from its findings', 'bottom')); } },
        { say: 'It replies with both findings, the fixes and the tests.', moves: [{ to: 'you', kind: 'model' }], preview: tickets('race-fixed', 'localhost:4321/tickets'),
          edit: (s) => { push(s, b('model', 2)); A(s).lamp = 'ok'; note(s); } },
      ]),
      log: {
        took: '12m 50s',
        rows: [
          { at: 0, label: delegated(1), detail: { plain: `to Codex with ${SOL}, with the change and your brief`, technical: `delegate_task: provider codex, model ${SOL}`, engineer: `delegate_task { provider: "codex", model: "${SOL}", mode: "wait" }` } },
          { at: 0, label: '', agents: [{ name: 'Review the ticket checkout: three ways it’s wrong', doing: 'reading the change, trying it', detail: { plain: '2 problems, each with a way to see it fail', technical: 'race on the last ticket · double refund on a double tap' }, done: 2, model: SOL }] },
          { at: 3, label: n(CHANGED_N, 3), detail: { plain: 'the last ticket goes to one buyer only; a refund happens once; a test for each', technical: 'src/tickets/buy.ts (reserve in one transaction), refund.ts (idempotent), checkout.test.ts' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'all checks pass, including both new ones', technical: 'npm test: 35 of 35' } },
        ],
      },
      answer: [
        `${SOL} found two problems, and showed each one failing. Two phones buying the last ticket at the same moment both got it: 401 tickets for 400 places. And tapping Refund twice paid twice.`,
        'Both are fixed. The last ticket now goes to one buyer, and the other phone sees “Sold out”. A refund happens once, however often it’s tapped. Each has a test made from the reviewer’s steps, and all 35 checks pass.',
      ],
      deeper: { level: 'engineer', text: 'T3 Code lets an agent hand a task to another provider’s agent with delegate_task, and the README’s own example is Claude handing a task to Codex. A model from another lab was trained differently, so its blind spots differ. A brief that asks for a way to see each failure turns findings into tests, and leaves out opinions.' },
      tryIt: { prompt: 'Have [another model] review this in its own thread. Find the three most likely ways it’s wrong, and show how to see each one fail. Skip style.', t3: 'Typing @ and a model name in the composer names that model for the agent, without changing the thread’s own model.' },
      sources: ['t3code.delegate', 't3code.crossProvider', 't3code.delegateChild', 't3code.screen.delegatedRow', 't3code.waitingOnChild'],
    },
    {
      title: 'Tell it when to stop',
      thread: REVIEW,
      request: 'Review it again.',
      lede: 'Thursday 17:15. A third round, with the same brief.',
      points: points(bench(true), [
        { say: 'Each round is a new child with a fresh window. It hasn’t seen the last review either.', ui: { context: 10 }, moves: [{ to: 'agent' }, ...toReviewer], status: S.waiting,
          edit: (s) => { built(s); push(s, b('you', 1.4)); A(s).lamp = 'wait'; R(s).blocks = [b('you', 2.4), b('tool', 5)]; R(s).lamp = 'work'; R(s).busy = true; note(s, lab('r0', 'round 3, fresh', 'bottom')); } },
        { say: 'Nothing breaks any more. It still sends back five things: a name, a comment, the order of the imports.', moves: [fromReviewer('model')],
          edit: (s) => { push(s, b('model', 2.4)); R(s).busy = false; R(s).lamp = 'ok'; s.gates![0]!.lamp = 'ok'; note(s, lab('r0', 'only taste left', 'bottom')); } },
        { say: 'A reviewer asked to find problems will always find something. Fixing taste can go on as long as you let it.',
          edit: (s) => { note(s, lab('r0', 'round 3: nothing breaks', 'bottom')); } },
        { say: 'It changes nothing and replies. Next time, the brief says when to stop: only what breaks, three rounds at most.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { R(s).blocks = []; R(s).lamp = 'off'; A(s).lamp = 'ok'; note(s, atStop()); } },
      ]),
      log: {
        took: '6m 05s',
        rows: [
          { at: 0, label: delegated(1), detail: { plain: `a new review by ${SOL}, the same brief`, technical: `delegate_task: provider codex, model ${SOL}` } },
          { at: 0, label: '', agents: [{ name: 'Review the ticket checkout again', doing: 'reading the change', detail: { plain: 'nothing that breaks · 5 style notes', technical: '0 defects · 5 style notes (naming, comments, import order)' }, done: 1, model: SOL }] },
        ],
      },
      answer: [
        `${SOL} found nothing that breaks this round. It sent five style notes: a variable name, two comments, the order of the imports and a function it would split. I haven’t changed anything.`,
        'If you want another round later, a brief that says “report only what breaks, three rounds at most” would stop here.',
      ],
      deeper: { level: 'technical', text: 'Anthropic’s best practices warn that a reviewer asked to find problems will always find something, and suggest telling it to report only gaps that affect correctness and to skip style. A round limit stops a loop that the reviewer and the builder would otherwise keep feeding.' },
      tryIt: { prompt: 'Review it again. Report only what breaks: correctness, security, data loss. Skip style. If you find nothing, say so.', t3: 'Each review round can be a new delegated thread, so no round sees the last one’s opinions.' },
      sources: ['harnesses.claudeCode.reviewerAlwaysFinds', 't3code.delegate'],
    },
    {
      title: 'Two models, one prompt',
      thread: `${MODEL.split(' ')[0]}: ticket page`,
      fresh: true,
      request: 'Redesign the ticket page for the birthday night. It must stay easy to use with one hand.',
      lede: 'Thursday 18:00. A job where taste matters and two attempts are cheap: you send it to two models at once.',
      replyAt: 3,
      points: points(sideBySide(2, [stand(lab('j0', MODEL, 'top')), stand(lab('j1', SOL, 'top'))], { models: ['a', 'b'] }), [
        { say: 'In a new thread you Shift-click two models. The same prompt goes to each, in a thread and worktree of its own.', ui: { context: 3 }, moves: [all(toJob(0, 2), toJob(1, 2))], threads: [row(`${MODEL.split(' ')[0]}: ticket page`, S.working, 3), row(`${SOL.split(' ').at(-1)}: ticket page`, S.working)],
          edit: (s) => { for (const i of [0, 1]) { J(s, i).blocks!.push(b('you', 2.4)); J(s, i).lamp = 'work'; J(s, i).busy = true; s.tray!.cards[i]!.mark = 'work'; } note(s, lab('tray', 'one prompt, two models', 'bottom')); } },
        { say: 'Two designs come back. This one keeps the Buy button at the bottom, in reach of a thumb.', threads: [row(`${MODEL.split(' ')[0]}: ticket page`, S.done, 3), row(`${SOL.split(' ').at(-1)}: ticket page`, S.done)], preview: tickets('design-a', 'localhost:4323/tickets'),
          edit: (s) => { for (const i of [0, 1]) { J(s, i).blocks!.push(b('tool', 5), b('model', 2)); J(s, i).lamp = 'ok'; J(s, i).busy = false; s.tray!.cards[i]!.mark = 'wait'; } note(s, lab('tray', 'first: Buy at the bottom', 'bottom')); } },
        { say: 'The other is beautiful, and puts Buy at the top, out of a thumb’s reach. Both are real options. You waited once, and your plans paid for two runs.', threads: [row(`${MODEL.split(' ')[0]}: ticket page`, S.done, 3), row(`${SOL.split(' ').at(-1)}: ticket page`, S.done)], preview: tickets('design-b', 'localhost:4324/tickets'),
          edit: (s) => { note(s, lab('tray', 'second: Buy at the top', 'bottom')); } },
        { say: 'You keep the first and close the other thread. Picking is your job: neither thread saw the other’s design.', moves: [jobToYou(0, 2)], threads: [row(`${MODEL.split(' ')[0]}: ticket page`, S.done, 3)], preview: tickets('design-a', 'localhost:4323/tickets'),
          edit: (s) => { J(s, 1).lamp = 'off'; J(s, 1).blocks = []; s.tray!.cards[0]!.mark = 'ok'; s.tray!.cards[1]!.mark = undefined; note(s, lab('tray', 'you choose', 'bottom')); } },
      ]),
      log: {
        took: '15m 40s',
        rows: [
          { at: 1, label: n(CHANGED_N, 4), detail: { plain: 'the new ticket page, in this worktree', technical: 'src/tickets/page.tsx, poster.svg, buy-bar.tsx, tickets.css' } },
          { at: 1, label: RAN, tone: 'ok', detail: { plain: 'tried at phone size, one-handed: Buy within thumb reach', technical: 'playwright tickets.spec @390×844: 6 of 6' } },
        ],
      },
      answer: [
        'The birthday ticket page is ready in this worktree. A big poster for the night, the price and what’s included, and the Buy button pinned at the bottom of the screen, where a thumb reaches it.',
        'I tried it at phone size: buying four tickets takes three taps with one hand.',
      ],
      deeper: { level: 'technical', text: 'In a Git project on web or desktop, Shift-clicking several models in a new thread’s model picker sends the same prompt to each, and every selection starts its own thread and worktree. T3 Code doesn’t compare the results for you.' },
      tryIt: { prompt: 'Redesign [the page]. It must [the one thing that matters].', t3: 'In a new thread, Shift-click two models in the model picker before you send. Each gets its own thread and worktree.' },
      sources: ['t3code.manyModels', 't3code.worktrees'],
    },
  ],
};

function atStop() { return lab('r0', 'only what breaks, 3 rounds at most', 'bottom'); }

export default lesson12;
