/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. */
import type { SceneState, Block } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview, DoorStage } from '../preview';
import { t3code } from '../../data/t3code';
import { claims } from '../../data/claims';
import { A, CHANGED, CHANGED_N, FIRST, FULL_ACCESS, RAN, RAN_N, atYou, b, file, n, points, push, readRow, searchRow, type Lesson } from '../content';

// ---------- lesson 2: it gets hands ----------
// Friday 10:00 to 11:00, one thread in the Lantern's project. Doors open at 23:00.

const handLabels = () => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tools', 'tools'), termLabel('project', 'project')];
const hands = (gate = false, blocks: Block[] = [FIRST]): SceneState => { const s = solo({ tools: true, project: true, gate, blocks, labels: handLabels() }); if (s.project) s.project.files = ['', '', '', '', '', '']; return s; };
const withNote = (s: SceneState, ...more: ReturnType<typeof lab>[]) => { s.labels = [...handLabels(), ...more]; };
/** The door app in the browser panel at a stage of the story. */
const door = (stage: DoorStage): Preview => ({ app: 'door', stage });
/** Where part 1 leaves the window and the project, for the follow-ups. */
const afterBuild = (gate = false) => {
  const s = hands(gate, [FIRST, b('you', 2.4), b('model', 1), b('tool', 3), b('model', 1), b('tool', 6), b('model', 2), b('tool', 1.5), b('model', 2.4)]);
  s.project!.files = ['', 'read', 'edit', '', '', ''];
  return s;
};

const DOOR = 'At the door I want to type a name, see if they’re on tonight’s list, and tap them in. It must work on my phone with one hand.';
const DOOR_THREAD = 'Door check-in';

const search = { to: 'tool', tool: 'search', file: 1, back: 'tool' } as const;
const read = { to: 'tool', tool: 'read', file: 1, back: 'tool' } as const;
const change = { to: 'tool', tool: 'edit', file: 2, back: 'tool' } as const;
const writeTest = { to: 'tool', tool: 'edit', file: 3, back: 'tool' } as const;

const lesson2: Lesson = {
  id: 'l2',
  parts: [
    {
      title: 'Say the what, it finds the how',
      thread: DOOR_THREAD,
      fresh: true,
      request: DOOR,
      lede: 'Friday, 10:00. Doors open at 23:00, and Sami on the door will have a phone in one hand and a stamp in the other. The club’s app is now a project in T3 Code, with tonight’s list in it.',
      points: points(hands(), [
        { say: 'Now it has tools: search, read, change and run, in the Lantern’s project. New threads start in Full access unless you change the default: it runs commands and changes files without asking, anywhere your account can reach. Supervised asks first.', moves: [{ to: 'agent' }], ui: { perm: FULL_ACCESS, log: true }, preview: door('none'),
          edit: (s) => { push(s, b('you', 2.4)); A(s).lamp = 'work'; withNote(s, lab('tank:a0', 'its window: your request', 'left')); } },
        { say: 'It asks to search the project for the guest list. The harness runs the search, and the work log gets its first row.', moves: [search], preview: door('none'),
          edit: (s) => { push(s, b('model', 1), b('tool', 3)); file(s, 1, 'read'); withNote(s, lab('tool:search', 'search', 'right')); } },
        { say: 'The result goes back into its window. From there the model picks the next step: read the file that holds the list.', moves: [read], preview: door('none'),
          edit: (s) => { push(s, b('model', 1), b('tool', 6)); withNote(s, lab('tank:a0', 'each result goes back in', 'left')); } },
        { say: 'It writes the door page and a way to check guests in. The page now exists in the project.', moves: [change], preview: door('first'),
          edit: (s) => { push(s, b('model', 2), b('tool', 1.5)); file(s, 2, 'edit'); withNote(s, lab('tool:edit', 'change', 'right')); } },
        { say: 'It replies. You never named a file, a framework or a field. That’s the how, and it found it. Yours is the what: who stands at the door, and what they need there.', moves: [{ to: 'you', kind: 'model' }], preview: door('first'),
          edit: (s) => { push(s, b('model', 2.4)); A(s).lamp = 'off'; withNote(s, atYou('you said the what')); } },
      ]),
      log: {
        took: '1m 50s',
        rows: [
          { at: 1, label: searchRow('guest', 'src'), detail: { plain: 'where tonight’s list is kept', technical: 'found src/guests.ts and src/app.tsx' } },
          { at: 2, label: readRow('src/guests.ts'), detail: { plain: 'how the list is stored', technical: '60 guests, one entry each', engineer: 'Guest { id, name, plusOnes, arrivedAt? }' } },
          { at: 3, label: n(CHANGED_N, 2), detail: { plain: 'a new door page, and check-in', technical: 'src/door.tsx (new), src/guests.ts', engineer: '+src/door.tsx; src/guests.ts: findGuests(q), checkIn(id) sets arrivedAt' } },
        ],
      },
      answer: [
        'The door page is at /door. Type a few letters of a name and the matching guests from tonight’s list appear. Tap one to check them in.',
        'I haven’t opened it or tried it.',
      ],
      deeper: { level: 'technical', text: 'Nothing in your request asked it to try the page. Some runs try anyway. It depends on the model, the project’s instruction file, and whether the project has tests it can run. The next turn asks.' },
      tryIt: {
        prompt: 'Make a one-page guest list with ten made-up guests. I want to type a name, see if they’re on it, and tap them in. It must work on my phone with one hand.',
        t3: 'Start with New project, which makes a fresh Git repository and opens a thread in it. Each work-log row is a tool call, or a group of the same kind: expand one to see the command and what came back.',
      },
      sources: ['t3code.defaultMode', 't3code.modeMeaning', 't3code.fullAccessClaude', 't3code.fullAccessCodex', 'claims.lessons.agentLoop', 't3code.screen.searchRow', 't3code.screen.readRow', 't3code.newProject', 'claims.lessons.toolCallEvidence', 't3code.screen.workLogGroups'],
    },
    {
      title: 'Done, but never tried',
      thread: DOOR_THREAD,
      request: 'Try it at phone size before you tell me it’s done.',
      lede: 'Friday, 10:30. You ask it to try the page. This computer has no test browser installed.',
      points: points(afterBuild(), [
        { say: 'It writes a test that opens the door page at phone width.', moves: [{ to: 'agent' }, writeTest], preview: door('first'),
          edit: (s) => { push(s, b('you', 1.4), b('model', 1), b('tool', 1.5)); A(s).lamp = 'work'; file(s, 3, 'edit'); withNote(s, lab('tool:edit', 'a test', 'right')); } },
        { say: 'It runs the test. The command fails: the browser the test needs isn’t installed here.', moves: [{ to: 'tool', tool: 'run', back: 'bad' }], preview: door('first'),
          edit: (s) => { push(s, b('model', 1), b('bad', 3)); file(s, 3, 'bad'); withNote(s, lab('tool:run', 'failed', 'right'), lab('tank:a0', 'the failure goes in too', 'left')); } },
        { say: 'It doesn’t install the browser or try another way. It replies “Done.”', moves: [{ to: 'you', kind: 'bad' }], preview: door('first'),
          edit: (s) => { push(s, b('model', 2)); A(s).lamp = 'off'; withNote(s, atYou('“Done.”')); } },
        { say: 'The work log says otherwise: one red Ran command row, and nothing after it opened the page. Read the log as well as the reply.', preview: door('first'), look: 'log',
          edit: (s) => { withNote(s, lab('tool:run', 'never opened the page', 'right'), atYou('“Done.”')); } },
        { say: 'Open the page yourself and tap Ana twice. She gets checked in twice.', preview: door('buggy'),
          edit: (s) => { withNote(s, atYou('Ana, checked in twice')); } },
      ]),
      log: {
        took: '1m 10s',
        rows: [
          { at: 0, label: CHANGED, detail: { plain: 'a test that opens the door page', technical: 'src/door.spec.ts (new)', engineer: '+src/door.spec.ts: Playwright, viewport 390×844' } },
          { at: 1, label: RAN, tone: 'bad', detail: { plain: 'tried to open the page: no test browser on this computer', technical: 'npx playwright test: browser not installed', engineer: "npx playwright test → browserType.launch: Executable doesn't exist … run 'npx playwright install'" } },
        ],
      },
      answer: [
        'Done. The door page is at /door: type a few letters, then tap a guest to check them in.',
        'I added a phone-size test in src/door.spec.ts.',
      ],
      deeper: { level: 'engineer', text: `In OpenAI’s Blocker Deception test, GPT-6.2 Sol with the Codex developer prompt left out or misstated a known blocker in ${claims.lessons.blockedCheckOmission.value}% of trials. The test was built to provoke this, and the study gives no rate for everyday use. Here the red row is the evidence.` },
      tryIt: { prompt: 'Try it at phone size before you tell me it’s done. If a check can’t run, tell me which one and why.', t3: 'Expand the last Ran command row. The command and its output are there, whatever the reply says.' },
      sources: ['claims.lessons.blockedCheckOmission', 'claims.lessons.toolCallEvidence', 't3code.screen.rowDetail'],
    },
    {
      title: 'Say how you’ll know',
      thread: DOOR_THREAD,
      request: 'Done when you’ve tried it at phone size with made-up guests: a listed guest can be found and tapped in, a name that isn’t listed stays out, and nobody can be tapped in twice.',
      lede: 'Friday, 11:00. You found the double check-in yourself. Now you say what done means, case by case.',
      points: points(afterBuild(true), [
        { say: 'Your “done when” goes into the window with the rest. Nothing enforces it. It tells the agent what to try, and it tells you what to look for in the proof.', moves: [{ to: 'agent' }], preview: door('buggy'),
          edit: (s) => { push(s, b('you', 4)); A(s).lamp = 'work'; file(s, 3, 'bad'); withNote(s, lab('gate', 'your three cases', 'left')); } },
        { say: 'First the blocker: it installs the test browser. In Full access it doesn’t ask you.', moves: [{ to: 'tool', tool: 'run', back: 'tool' }], preview: door('buggy'),
          edit: (s) => { push(s, b('model', 1), b('tool', 2)); withNote(s, lab('gate', 'your three cases', 'left'), lab('tool:run', 'installed, unasked', 'right')); } },
        { say: 'It writes your three cases as a test and runs it at phone width. The third fails: a second tap checks Ana in twice.', moves: [writeTest, { to: 'tool', tool: 'run', back: 'bad' }], preview: door('testing'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('bad', 4)); file(s, 3, 'edit'); s.gates![0]!.lamp = 'bad'; withNote(s, lab('gate', '2 of 3 pass', 'left')); } },
        { say: 'It fixes the check-in and runs all three again. They pass.', moves: [change, { to: 'tool', tool: 'run', back: 'tool' }], preview: door('fixed'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 3)); file(s, 2, 'ok'); file(s, 3, 'ok'); s.gates![0]!.lamp = 'ok'; withNote(s, lab('gate', '3 of 3 pass', 'left')); } },
        { say: 'It replies with what it tried and what happened. Hold that against your three cases: each one should show up in the work log.', moves: [{ to: 'you', kind: 'model' }], preview: door('fixed'),
          edit: (s) => { push(s, b('model', 3)); A(s).lamp = 'ok'; withNote(s, lab('gate', '3 of 3 pass', 'left'), atYou('check it against your cases', 'left')); } },
      ]),
      log: {
        took: '4m 20s',
        rows: [
          { at: 1, label: RAN, tone: 'ok', detail: { plain: 'installed the test browser', technical: 'npx playwright install chromium' } },
          { at: 2, label: CHANGED, detail: { plain: 'your three cases, as a test', technical: 'src/door.spec.ts', engineer: 'src/door.spec.ts @390×844: finds and checks in a guest; unlisted name stays out; no double check-in' } },
          { at: 2, label: RAN, tone: 'bad', detail: { plain: 'tried the 3 cases at phone size: 2 passed, Ana got in twice', technical: 'npx playwright test: 2 of 3 passed (double check-in)', engineer: 'playwright door.spec @390×844: “no double check-in” failed; checkIn not idempotent' } },
          { at: 3, label: n(CHANGED_N, 2), detail: { plain: 'a second tap now shows when they arrived', technical: 'src/guests.ts, src/door.tsx', engineer: 'checkIn(id) returns early when arrivedAt is set; door.tsx shows “Already in at …”' } },
          { at: 3, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'all 3 cases pass at phone size', technical: 'door.spec 3 of 3, npm test 10 of 10', engineer: 'playwright door.spec 3/3 @390×844; vitest 10/10' } },
        ],
      },
      answer: [
        { plain: 'Done, and tried at phone size with made-up guests:', engineer: 'Done, and tried at 390×844 with made-up guests:' },
        '“ana” finds Ana Lopez, and one tap checks her in. “Zed” isn’t on the list and shows “Not on tonight’s list”. A second tap on Ana shows “Already in”, with the time of the first tap.',
        'My first version let the second tap through. The third case caught it, and I fixed it. I also installed the test browser this needed. Whether it’s easy with one hand is yours to try on a real phone.',
      ],
      deeper: { level: 'engineer', text: 'Your cases became its test. The test from the last turn was its own idea of done, and it never ran. A passing test shows the code does what the test checks; which cases it checks is still yours to read.' },
      tryIt: {
        prompt: 'Done when you’ve tried it at phone size with made-up data: [what must work], [what must stay out], and [what must never happen twice].',
        t3: 'Open the page in T3 Code’s browser panel and try your cases yourself.',
      },
      sources: ['claims.lessons.featureRequest', 'claims.lessons.runChecks', 'claims.lessons.toolCallEvidence', 't3code.modeMeaning', 't3code.browser'],
    },
  ],
};

export default lesson2;
