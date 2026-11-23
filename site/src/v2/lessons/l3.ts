/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. */
import type { SceneState, Block, Lamp } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { route, reverse } from '../../journey/picture';
import { termLabel } from '../../journey/terms';
import type { Preview } from '../preview';
import { t3code } from '../../data/t3code';
import { A, CHANGED, CHANGED_N, FIRST, RAN, RAN_N, STATUS, b, file, n, points, push, searchRow, type Lesson } from '../content';

// ---------- lesson 3: done when ----------
// Friday 11:30 to 12:40, one thread in the Lantern's project: promoters Kai and Noor get their own
// links. Doors open at 23:00. Kai, Noor, Lea Brandt and every number here are made up.

const READ_N = t3code.screen.workLogGroups.value[0];
const THREAD = 'Promoter links';

const labels = () => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tools', 'tools'), termLabel('project', 'project')];
/** You, the agent with its tools, the project and the check between the agent and you. */
const base = (blocks: Block[] = [FIRST]): SceneState => {
  const s = solo({ tools: true, project: true, gate: true, blocks, labels: labels() });
  s.project!.files = ['', '', '', '', '', ''];
  return s;
};
const note = (s: SceneState, ...more: ReturnType<typeof lab>[]) => { s.labels = [...labels(), ...more]; };
/** A note for you, under your figure, where nothing else is drawn. */
const belowYou = (text: string) => lab([0, 112, 0], text, 'bottom');
const gate = (s: SceneState, lamp: Lamp) => { s.gates![0]!.lamp = lamp; };
/** Where each turn leaves the window: the turns before it, as slabs. */
const after = (turns: number) => {
  const blocks: Block[] = [FIRST];
  for (let i = 0; i < turns; i++) blocks.push(b('you', 1.6), b('model', 1), b('tool', 3), b('model', 1), b('tool', 4), b('model', 1.6));
  const s = base(blocks);
  s.project!.files = ['', 'read', 'ok', 'ok', '', ''];
  return s;
};

const promoters = (stage: string, url?: string): Preview => ({ app: 'promoters', stage, ...(url ? { url } : {}) });
const door = (stage: string): Preview => ({ app: 'door', stage });
const KAI = 'localhost:4321/p/7';
const NOOR_GUESSED = 'localhost:4321/p/8';
const NOOR_TOKEN = 'localhost:4321/p/q7Xk2mVd9TfR';
const OVERVIEW = 'localhost:4321/promoters';

const search = { to: 'tool', tool: 'search', file: 1, back: 'tool' } as const;
const read = { to: 'tool', tool: 'read', file: 1, back: 'tool' } as const;
const change = { to: 'tool', tool: 'edit', file: 2, back: 'tool' } as const;
const writeTest = { to: 'tool', tool: 'edit', file: 3, back: 'tool' } as const;
const runOk = { to: 'tool', tool: 'run', back: 'tool' } as const;
const runBad = { to: 'tool', tool: 'run', back: 'bad' } as const;

const lesson3: Lesson = {
  id: 'l3',
  parts: [
    {
      title: 'A check that stays',
      thread: THREAD,
      fresh: true,
      request: 'Each promoter gets their own link to add guests for tonight, up to the limit I set for them. Done when you’ve tried it at phone size with made-up promoters: a promoter can add guests until the limit and the next one is refused, and their guests show up at the door.',
      lede: 'Friday, 11:30. From now on the promoters, Kai and Noor, add their own guests. This request is the size of a product slice, and its done-when holds two checks.',
      points: points(base(), [
        { say: 'Your done-when has two checks in it. Before it builds anything, it writes them down as tests in the project.', moves: [{ to: 'agent' }, search, writeTest], preview: door('fixed'),
          edit: (s) => { push(s, b('you', 3.4), b('model', 1), b('tool', 2), b('model', 1), b('tool', 1.5)); A(s).lamp = 'work'; file(s, 1, 'read'); file(s, 3, 'edit'); note(s, lab('gate', '2 checks', 'left')); } },
        { say: 'It builds a page for each promoter, a limit for each, and a tag on every guest saying who added them.', moves: [read, change], preview: promoters('kai-new', KAI),
          edit: (s) => { push(s, b('model', 1), b('tool', 4), b('model', 1), b('tool', 2)); file(s, 2, 'edit'); file(s, 4, 'edit'); note(s, lab('gate', '2 checks', 'left'), lab('tool:edit', 'a page each', 'right')); } },
        { say: 'It runs both checks. The second one fails: guests Kai added don’t show up at the door.', moves: [runBad], preview: door('promo-missing'),
          edit: (s) => { push(s, b('model', 1), b('bad', 3)); file(s, 3, 'bad'); gate(s, 'bad'); note(s, lab('gate', '1 of 2 pass', 'left')); } },
        { say: 'It fixes the door search and runs both checks again. Both pass.', moves: [change, runOk], preview: door('promo'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 2.5)); file(s, 2, 'ok'); file(s, 3, 'ok'); file(s, 4, 'ok'); gate(s, 'ok'); note(s, lab('gate', '2 of 2 pass', 'left')); } },
        { say: 'It replies. The two checks stay in the project as tests, so every later change runs them again, whoever makes it.', moves: [{ to: 'you', kind: 'model' }], preview: promoters('kai-full', KAI),
          edit: (s) => { push(s, b('model', 2.4)); A(s).lamp = 'ok'; gate(s, 'ok'); note(s, lab('project', 'the checks stay', 'top'), belowYou('two checks to read')); } },
      ]),
      log: {
        took: '6m 40s',
        rows: [
          { at: 0, label: searchRow('guest', 'src'), detail: { plain: 'where the guests and the door page live', technical: 'src/guests.ts, src/door.tsx' } },
          { at: 0, label: CHANGED, detail: { plain: 'your two checks, written as tests first', technical: 'src/promoters.test.ts (new)', engineer: '+src/promoters.test.ts: limit is enforced (21st add refused); promoter guests are found at /door' } },
          { at: 1, label: n(READ_N, 3), detail: { plain: 'how guests are stored and searched', technical: 'src/guests.ts, src/door.tsx, src/app.tsx' } },
          { at: 1, label: n(CHANGED_N, 4), detail: { plain: 'promoter pages, limits, and who added each guest', technical: 'src/promoters.ts, src/p/[link].tsx, src/guests.ts, src/app.tsx', engineer: '+src/promoters.ts, +src/p/[link].tsx; Guest.addedBy; addGuest() checks the limit on the server' } },
          { at: 2, label: RAN, tone: 'bad', detail: { plain: 'tried both checks at phone size: Kai’s guests missing at the door', technical: 'npm test: 1 of 2 failed (promoter guests not found at /door)', engineer: 'vitest + playwright @390×844: “promoter guests are found at /door” failed; findGuests() reads the old list only' } },
          { at: 3, label: CHANGED, detail: { plain: 'the door search now includes promoters’ guests', technical: 'src/door.tsx', engineer: 'findGuests() merges promoter guests; door rows show the list they came from' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'both checks pass at phone size', technical: 'npm test: 12 of 12', engineer: 'vitest 10/10; playwright promoters.spec 2/2 @390×844' } },
        ],
      },
      answer: [
        'Each promoter now has their own link. It shows tonight’s list, how many spots are left and an Add guest button. You set each promoter’s limit on the new Promoters page.',
        { plain: 'I tried it at phone size with two made-up promoters. Kai, with a limit of 20, added 20 guests, and the 21st was refused with “Your list for tonight is full”. Kai’s guests show up at the door under “Kai’s list”. My first version left them off the door list, and the second check caught it.', engineer: 'I tried it at 390×844 with two made-up promoters. Kai, with a limit of 20, added 20 guests, and the 21st was refused with “Your list for tonight is full”. Kai’s guests show up at the door under “Kai’s list”. My first version left them off the door list, and the second check caught it. The limit is enforced in addGuest() on the server, not only by disabling the button.' },
        'Both checks are now tests in the project, so the next change runs them too.',
      ],
      deeper: { level: 'technical', text: 'A check it can run, that comes back pass or fail, is what lets it keep going without you. Here the failing run sent it back to the door search before it replied.' },
      tryIt: {
        prompt: 'Each [person] gets their own link to [add things] up to a limit I set. Done when you’ve tried it with made-up people: they can add until the limit, the next one is refused, and what they add shows up where I need it.',
        t3: 'Expand the last Ran command row and find a test named after each part of your done-when.',
      },
      sources: ['claims.lessons.featureRequest', 'claims.lessons.runChecks', 'harnesses.claudeCode.checkToRun', 'claims.lessons.toolCallEvidence', 't3code.screen.workLogGroups'],
    },
    {
      title: 'Must never',
      thread: THREAD,
      request: 'One more rule: it must never let a promoter see another promoter’s guests. Prove that with a test that tries.',
      lede: 'Friday, 11:50. A must-never is a check too. To test it, the agent has to work out what breaking it would look like.',
      points: points(after(1), [
        { say: 'A must-never is a check too. First it works out what a leak would look like here.', moves: [{ to: 'agent' }, search], preview: promoters('kai-full', KAI),
          edit: (s) => { push(s, b('you', 1.6), b('model', 1), b('tool', 2)); A(s).lamp = 'work'; gate(s, 'off'); note(s, lab('gate', 'must never', 'left')); } },
        { say: 'It writes the test before any fix: open Noor’s list using Kai’s link.', moves: [writeTest], preview: promoters('kai-full', KAI),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5)); file(s, 3, 'edit'); note(s, lab('gate', 'must never', 'left'), lab('tool:edit', 'a test that tries', 'right')); } },
        { say: 'The test fails. Change one character of Kai’s link and Noor’s list opens.', moves: [runBad], preview: promoters('leak', NOOR_GUESSED),
          edit: (s) => { push(s, b('model', 1), b('bad', 3)); file(s, 3, 'bad'); gate(s, 'bad'); note(s, lab('gate', 'leak found', 'left')); } },
        { say: 'It makes the links long and random, and checks on every request that the link belongs to the promoter. The test passes.', moves: [change, runOk], preview: promoters('sealed', NOOR_GUESSED),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 2)); file(s, 2, 'ok'); file(s, 3, 'ok'); gate(s, 'ok'); note(s, lab('gate', 'passes now', 'left')); } },
        { say: 'It runs the earlier checks too, and replies with what it tried and what it didn’t cover.', moves: [runOk, { to: 'you', kind: 'model' }], preview: promoters('noor', NOOR_TOKEN),
          edit: (s) => { push(s, b('model', 1), b('tool', 2), b('model', 2.4)); A(s).lamp = 'ok'; gate(s, 'ok'); note(s, lab('gate', '3 of 3 pass', 'left'), belowYou('read “Not covered”')); } },
      ]),
      log: {
        took: '4m 50s',
        rows: [
          { at: 0, label: searchRow('link', 'src'), detail: { plain: 'how a promoter’s page finds its list', technical: 'src/p/[link].tsx: links are numbered, /p/7 is Kai', engineer: 'src/p/[link].tsx: getPromoter(Number(link)); no check on who asks' } },
          { at: 1, label: CHANGED, detail: { plain: 'a test that opens Noor’s list with Kai’s link', technical: 'src/promoters.test.ts', engineer: 'promoters.test.ts: “Kai’s link changed by one character opens no list” expects 404' } },
          { at: 2, label: RAN, tone: 'bad', detail: { plain: 'with Kai’s link changed by one character, Noor’s guests show', technical: 'npm test: /p/8 opened Noor’s list', engineer: 'vitest: GET /p/8 → 200 with Noor’s guests, expected 404 (insecure direct object reference)' } },
          { at: 3, label: n(CHANGED_N, 2), detail: { plain: 'long random links, and a check on every request', technical: 'src/promoters.ts, src/p/[link].tsx', engineer: 'links are 128-bit random tokens; every request checks the token belongs to the promoter' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'the must-never test passes', technical: 'npm test: “can’t open another promoter’s list” passes' } },
          { at: 4, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'all three checks pass at phone size', technical: 'npm test 13 of 13, playwright 3 of 3', engineer: 'vitest 11/11; playwright promoters.spec 3/3 @390×844' } },
        ],
      },
      answer: [
        'Promoters can only open their own list. Links are now long random codes, and every request checks that the link belongs to the promoter asking.',
        'I tried it at phone size. With Kai’s link changed by one character, the page says “This link doesn’t open a list”. Before the fix it opened Noor’s list. That check now runs with the others.',
        'Not covered: anyone who gets hold of Kai’s real link can see Kai’s list. If promoters forward their links, they’ll need to sign in. Should I add that?',
      ],
      deeper: { level: 'engineer', text: 'Numbered ids with no ownership check are an insecure direct object reference, one of the most common web flaws. The test asserts a 404 for another promoter’s token, so the fix stays fixed when someone touches the routing later.' },
      tryIt: { prompt: '… It must never let one [person] see another’s [data]. Prove that with a test that tries.', t3: 'In the work log, find the row where the must-never test first failed. That red row is the evidence that the test can catch the leak.' },
      sources: ['claims.lessons.featureRequest', 'claims.lessons.toolCallEvidence', 't3code.screen.searchRow'],
    },
    {
      title: 'What nobody wrote down',
      thread: THREAD,
      request: 'Show me where each promoter’s list stands for tonight. Done when I can see, per promoter, the guests added, their limit and how many have arrived, at phone size.',
      lede: 'Friday, 12:10. Every check passes. You still find a problem, by looking.',
      points: points(after(2), [
        { say: 'It builds the overview and runs every check, old and new. All pass.', moves: [{ to: 'agent' }, read, change, runOk], preview: promoters('overview', OVERVIEW),
          edit: (s) => { push(s, b('you', 1.6), b('model', 1), b('tool', 3), b('model', 1), b('tool', 2), b('model', 1), b('tool', 2)); A(s).lamp = 'work'; gate(s, 'ok'); note(s, lab('gate', 'all pass', 'left')); } },
        { say: 'It replies: the overview is there and all 14 checks pass.', moves: [{ to: 'you', kind: 'model' }], preview: promoters('overview', OVERVIEW),
          edit: (s) => { push(s, b('model', 2)); A(s).lamp = 'ok'; note(s, lab('gate', 'all pass', 'left'), belowYou('“All 14 checks pass”')); } },
        { say: 'You look. Kai’s 20 guests bring 9 plus-ones, so 29 people come in on a limit of 20.', preview: promoters('overview-look', OVERVIEW),
          edit: (s) => { note(s, lab('gate', 'all pass', 'left'), belowYou('you meant 20 people')); } },
        { say: 'No check caught it, because no check said it. The checks only know what you wrote down.', preview: promoters('overview-look', OVERVIEW),
          edit: (s) => { note(s, lab('gate', 'nobody asked', 'left'), belowYou('you meant 20 people')); } },
        { say: 'One sentence would have made it a check: a plus-one counts toward the limit. Your next request carries it.', preview: promoters('overview-look', OVERVIEW),
          edit: (s) => { note(s, lab('gate', 'nobody asked', 'left'), belowYou('next: plus-ones count')); } },
      ]),
      log: {
        took: '3m 05s',
        rows: [
          { at: 0, label: n(READ_N, 2), detail: { plain: 'the promoters and the door', technical: 'src/promoters.ts, src/door.tsx' } },
          { at: 0, label: n(CHANGED_N, 2), detail: { plain: 'the Promoters page', technical: 'src/promoters/page.tsx (new), src/app.tsx', engineer: '+src/promoters/page.tsx: per promoter, guests.length / limit, plus-ones, arrived' } },
          { at: 0, label: RAN, tone: 'ok', detail: { plain: 'every check, old and new: all pass', technical: 'npm test: 14 of 14', engineer: 'vitest 12/12; playwright 2/2 @390×844 (overview renders, counts match seed data)' } },
        ],
      },
      answer: [
        'The overview is at /promoters. It has one row per promoter: guests added, their limit and how many have arrived. It updates when the door taps someone in.',
        'I tried it at phone size with made-up data. All 14 checks pass, including the ones from your last two requests.',
      ],
      deeper: { level: 'technical', text: 'Adding “before you say done, list anything you had to assume” to the request would probably have surfaced it: did a plus-one count? Lesson 7 comes back to questions like that.' },
      tryIt: { prompt: '… Before you say done, list anything you had to assume.', t3: 'Open the app in the browser panel and look at the result yourself before you read the reply.' },
      sources: ['harnesses.claudeCode.bestPractice', 't3code.browser'],
    },
    {
      title: 'Keep going until done',
      thread: THREAD,
      request: '/goal Plus-ones count toward each promoter’s limit, and every promoter check passes at phone size with made-up promoters.',
      lede: 'Friday, 12:30. A goal is a done-when that stays set: the agent keeps working until it judges the goal met.',
      goal: { objective: 'Plus-ones count toward each promoter’s limit, and every promoter check passes at phone size with made-up promoters.', met: 4, checks: [0, 0, 1, 1, 2] },
      points: points(after(3), [
        { say: 'A goal is a done-when that stays set. While the agent works on it, the thread’s row says Goal and a goal line sits at the end of the thread.', moves: [{ to: 'agent' }], status: STATUS.goal, preview: promoters('overview-look', OVERVIEW),
          edit: (s) => { push(s, b('you', 2)); A(s).lamp = 'work'; gate(s, 'wait'); note(s, lab('gate', 'goal set', 'left')); } },
        { say: 'It makes plus-ones count, then runs the checks. Two older checks fail: Kai’s list is already over the limit.', moves: [change, runBad], status: STATUS.goal, preview: promoters('over', OVERVIEW),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('bad', 3)); file(s, 2, 'edit'); file(s, 3, 'bad'); gate(s, 'bad'); note(s, lab('gate', '2 fail', 'left')); } },
        { say: 'It doesn’t hand back to you with a list of failures. It checks the goal, sees it isn’t met, and keeps going.', moves: [{ to: 'path', path: reverse(route.agentToGate()), kind: 'bad', ms: 480 }], status: STATUS.goal, preview: promoters('over', OVERVIEW),
          edit: (s) => { push(s, b('model', 1.4)); gate(s, 'bad'); note(s, lab('gate', 'goal not met', 'left'), lab('a0', 'goes again', 'top')); } },
        { say: 'It closes new adds while a list is over, keeps the guests already on it, and runs every check again. All pass.', moves: [change, runOk], status: STATUS.goal, preview: promoters('capped', OVERVIEW),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 3)); file(s, 2, 'ok'); file(s, 3, 'ok'); gate(s, 'ok'); note(s, lab('gate', 'all pass', 'left')); } },
        { say: 'It judges the goal met, replies, and the row goes to Done. “Met” is its own judgement. The checks you wrote are what make that judgement worth something.', moves: [{ to: 'you', kind: 'model' }], status: STATUS.done, preview: promoters('capped', OVERVIEW),
          edit: (s) => { push(s, b('model', 2.6)); A(s).lamp = 'ok'; gate(s, 'ok'); note(s, lab('a0', 'met: its judgement', 'top'), lab('gate', 'by your checks', 'left')); } },
      ]),
      log: {
        took: '7m 30s',
        rows: [
          { at: 1, label: CHANGED, detail: { plain: 'plus-ones now count toward the limit', technical: 'src/promoters.ts', engineer: 'headCount(promoter) = Σ(1 + plusOnes); addGuest() compares heads, not rows' } },
          { at: 1, label: RAN, tone: 'bad', detail: { plain: '2 checks failed: Kai’s list is already over the limit', technical: 'npm test: 2 of 15 failed (Kai over the limit)', engineer: 'vitest: “seeded lists are within limit” and “overview shows room left” failed: kai 29/20' } },
          { at: 3, label: n(CHANGED_N, 2), detail: { plain: 'a list that’s over takes no new guests until it’s under', technical: 'src/promoters.ts, src/promoters/page.tsx', engineer: 'over-limit lists are closed to adds; existing guests kept; overview shows “closed until n drop out”' } },
          { at: 3, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'all 15 checks pass at phone size', technical: 'npm test 15 of 15, playwright 3 of 3', engineer: 'vitest 12/12; playwright promoters.spec 3/3 @390×844' } },
        ],
      },
      answer: [
        { plain: 'Goal met. Plus-ones now count toward each promoter’s limit, and all 15 checks pass at phone size with made-up promoters.', engineer: 'Goal met. Plus-ones now count toward each promoter’s limit, and all 15 checks pass at 390×844 with made-up promoters.' },
        'Kai was already over: 20 guests and 9 plus-ones on a limit of 20. I left all 29 on the list and closed new adds until Kai is under 20. If you’d rather drop the most recent ones, tell me.',
        'My first change broke two older checks, and the goal kept me going until they passed.',
      ],
      deeper: { level: 'engineer', text: 'Stopping Claude ends the current turn and leaves the goal set; stopping Codex or OpenCode pauses it, and Codex also pauses when its work ends with the goal unmet. Keeping Kai’s 29 was a call about your guests, the kind lesson 7 says an agent should ask about. It made the call, and at least it said so.' },
      tryIt: { prompt: '/goal [what done means, as checks it can run]', t3: 'Send /goal on its own to see the current goal, and /goal clear to remove it. It works with Codex, Claude, and OpenCode 2.2.5 or later.' },
      sources: ['t3code.goal', 't3code.screen.goalLine', 't3code.screen.statuses', 'harnesses.claudeCode.checkToRun'],
    },
  ],
};

export default lesson3;
