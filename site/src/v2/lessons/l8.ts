/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. */
import type { SceneState, Card } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview, DoorStage } from '../preview';
import { t3code } from '../../data/t3code';
import { claims } from '../../data/claims';
import { A, CHANGED_N, FIRST, RAN, RAN_N, b, n, points, push, type Lesson } from '../content';

// ---------- lesson 8: proof you can read ----------
// Friday 21:00 to 22:45, one thread. Doors open at 23:00, and before you hand Sami the phone you
// want to know the door works without reading code. The tray beside you holds the proof the agent
// brings back (v1's proof.ts): a summary, the check output, the door at phone size, and a page you
// try yourself. The project is left out of the picture so the cards get the room.

const [READ_N] = t3code.screen.workLogGroups.value;
const THREAD = 'Door ready for tonight';

const baseLabels = () => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tools', 'tools')];
const desk = (blocks = [FIRST]): SceneState => {
  const s = solo({ tools: true, gate: true, tray: [], blocks, labels: baseLabels() });
  s.tray!.gap = 18;
  return s;
};
/** An annotation on a card on the tray: above every other card and below the rest, so neighbours don't touch (v1's proof.ts). */
const cardNote = (s: SceneState, id: string, text: string) => {
  const t = s.tray!, i = t.cards.findIndex((c) => c.id === id), k = t.cards.length;
  const x = t.at[0] + (i - (k - 1) / 2) * (t.gap ?? 9);
  return i % 2 ? lab([x, t.at[1], 16], text, 'top') : lab([x, t.at[1] + 11, 0], text, 'bottom');
};
const note = (s: SceneState, ...more: ReturnType<typeof lab>[]) => { s.labels = [...baseLabels(), ...more]; };
const gate = (s: SceneState, lamp: 'off' | 'wait' | 'ok' | 'bad') => { s.gates![0]!.lamp = lamp; };
const door = (stage: DoorStage, url?: string): Preview => ({ app: 'door', stage, ...(url ? { url } : {}) });
/** The proof on the tray: which cards stand there, and how each is marked. */
type Id = 'sum' | 'tests' | 'shot' | 'link';
const KIND: Record<Id, Card['b']> = { sum: 'model', tests: 'tool', shot: 'tool', link: 'tool' };
const tray = (s: SceneState, ids: Id[], mark?: (id: Id) => Card['mark']) => { s.tray!.cards = ids.map((id) => ({ id, b: KIND[id], mark: mark?.(id) })); };

const read = { to: 'tool', tool: 'read', back: 'tool' } as const;
const edit = { to: 'tool', tool: 'edit', back: 'tool' } as const;
const run = { to: 'tool', tool: 'run', back: 'tool' } as const;
const back = { to: 'you', kind: 'model' } as const;
const PRACTICE = 'localhost:4321/door?practice';

const lesson8: Lesson = {
  id: 'l8',
  parts: [
    // ---------- 8.1 "Done." ----------
    {
      title: '“Done.” tells you nothing',
      thread: THREAD,
      fresh: true,
      request: 'Get the door ready for tonight: search, tap in, promoter guests, do-not-admit. Done when it all works.',
      lede: 'Friday, 21:00. Doors at 23:00. Before you hand Sami the phone you want to know the door works, and you don’t want to read code to find out.',
      points: points(desk(), [
        { say: 'It reads, changes and runs things. The work log fills.', moves: [{ to: 'agent' }, read, edit], preview: door('dnaFull'),
          edit: (s) => { push(s, b('you', 2), b('model', 1), b('tool', 4), b('model', 1), b('tool', 1.5)); A(s).lamp = 'work'; note(s, lab('tank:a0', 'it knows what it did', 'left')); } },
        { say: 'The reply: “Done. Everything works.”', moves: [run, back], preview: door('dnaFull'),
          edit: (s) => { push(s, b('model', 1), b('tool', 3), b('model', 0.6)); A(s).lamp = 'off'; note(s, lab('gate', '“Done.”', 'left')); } },
        { say: 'What changed? What ran, and did it pass? Did anyone look at the door? The reply doesn’t say.', preview: door('dnaFull'),
          edit: (s) => { tray(s, ['sum', 'tests', 'shot'], () => 'wait'); note(s, cardNote(s, 'tests', 'three questions, no answers')); } },
        { say: 'To find out, you’d open every row of the work log, or read the code. That’s the work you wanted to hand over.', preview: door('dnaFull'),
          edit: (s) => { tray(s, ['sum', 'tests', 'shot'], () => 'wait'); note(s, lab('tool:run', 'to know: open every row', 'bottom')); } },
      ]),
      log: {
        took: '5m 50s',
        rows: [
          { at: 0, label: n(READ_N, 4), detail: { plain: 'the door, the lists and the do-not-admit marks', technical: 'src/door.tsx, src/guests.ts, src/promoters.ts, src/doNotAdmit.ts' } },
          { at: 0, label: n(CHANGED_N, 2), detail: { plain: 'the door loads everything it needs when it starts', technical: 'src/door.tsx, src/load.ts' } },
          { at: 1, label: n(RAN_N, 3), detail: { plain: 'the checks', technical: 'npm test, npm run door-check, npm run build' } },
        ],
      },
      answer: ['Done. Everything works.'],
      deeper: { level: 'technical', text: 'Anthropic’s advice for Claude Code: ask for evidence, the command it ran and its output, or the screenshot. “All tests pass” on its own tells you very little.' },
      tryIt: {
        prompt: 'What did you change, what did you run, and what did it print?',
        t3: 'Expand each Ran command row. The command and its output are there, whatever the reply says.',
      },
      sources: ['harnesses.claudeCode.askForEvidence', 'claims.lessons.toolCallEvidence'],
    },

    // ---------- 8.2 ask for the proof ----------
    {
      title: 'Ask for the proof',
      thread: THREAD,
      request: 'Show me what changed and what you left out, which checks ran with their output, and the door at phone size for each case.',
      lede: 'Friday, 21:15. The same work. This time you say what it should bring back.',
      points: points(desk(), [
        { say: 'It runs the checks again, this time to show you what they print.', moves: [{ to: 'agent' }, run], preview: door('dnaFull'),
          edit: (s) => { push(s, b('you', 2.4), b('model', 1), b('tool', 3)); A(s).lamp = 'work'; note(s, lab('tool:run', 'output kept', 'bottom')); } },
        { say: 'It opens the door at phone size in the browser panel, which you both see, and tries each case there. Open the Preview to watch.', moves: [run], preview: door('proof'),
          edit: (s) => { push(s, b('model', 1), b('tool', 4)); note(s, lab('tool:run', 'the door, at 390 px', 'bottom')); } },
        { say: 'The reply starts with a summary: what changed, and what isn’t done.', moves: [back], preview: door('proof'),
          edit: (s) => { push(s, b('model', 3)); A(s).lamp = 'ok'; tray(s, ['sum']); note(s, cardNote(s, 'sum', 'summary')); } },
        { say: 'Then the check output: what ran, and what passed.', preview: door('proof'),
          edit: (s) => { tray(s, ['sum', 'tests']); note(s, cardNote(s, 'tests', 'check output')); } },
        { say: 'And the door at phone size, case by case, in the Preview. Each card answers a question you’d otherwise have to dig for.', preview: door('proof'),
          edit: (s) => { tray(s, ['sum', 'tests', 'shot'], () => 'ok'); note(s, cardNote(s, 'shot', 'the door'), cardNote(s, 'tests', 'proof you can read')); } },
      ]),
      log: {
        took: '3m 05s',
        rows: [
          { at: 0, label: RAN, tone: 'ok', detail: { plain: 'all the tests', technical: 'npm test: 26 of 26', engineer: 'vitest run: 26 passed (26)' } },
          { at: 1, label: RAN, tone: 'ok', detail: { plain: 'opened the door at phone size and tried four cases', technical: 'npm run door-check: 4 of 4 at 390 px', engineer: 'door-check: headless Chromium @390×844, seeded fixtures, 4/4' } },
        ],
      },
      answer: [
        'Ready for tonight. Changed: the door now loads promoter guests and do-not-admit marks when it starts, so a slow connection can’t hide either. Not done: the door doesn’t work offline. If the club’s wifi drops, it stops.',
        {
          plain: 'Checks: all 26 tests passed. The door check opened the door at phone size and tried four cases, and all four passed: Ana found and tapped in, Zed not on the list, Ana’s second tap refused with “Already in”, and Rico red with nothing to tap.',
          technical: 'Checks: npm test, 26 of 26 passed. npm run door-check at 390 px, 4 of 4: Ana found and tapped in, Zed not on the list, Ana’s second tap refused with “Already in”, Rico red with nothing to tap.',
          engineer: 'Checks: vitest 26/26. door-check (headless Chromium, 390×844, seeded fixtures) 4/4: Ana found and tapped in; Zed not on the list; second tap on Ana refused, “Already in”; Rico rendered red, tap counts nobody.',
        },
        'All four cases are in the browser panel now, at phone size.',
      ],
      deeper: { level: 'engineer', text: 'The “Not done” line is worth as much as the passes. It’s the one thing you can’t see by looking at the screen.' },
      tryIt: {
        prompt: 'Show me what changed and what you left out, which checks ran with their output, and [the screen] at phone size.',
        t3: 'The browser panel is shared: open it and look at the page the agent opened, at the size it tried.',
      },
      sources: ['harnesses.claudeCode.askForEvidence', 't3code.browser', 'claims.lessons.toolCallEvidence'],
    },

    // ---------- 8.3 the log disagrees ----------
    {
      title: 'When the reply and the log disagree',
      thread: THREAD,
      request: 'Run every check once more before doors and tell me the result.',
      lede: 'Friday, 22:15. One last run before doors.',
      points: points(desk(), [
        { say: 'It runs the tests. They pass.', moves: [{ to: 'agent' }, run], preview: door('dnaFull'),
          edit: (s) => { push(s, b('you', 1.4), b('model', 1), b('tool', 3)); A(s).lamp = 'work'; } },
        { say: 'It runs the door check. The command fails: the test browser won’t start.', moves: [{ to: 'tool', tool: 'run', back: 'bad' }], preview: door('dnaFull'),
          edit: (s) => { push(s, b('model', 1), b('bad', 3)); note(s, lab('tool:run', 'failed', 'bottom'), lab('tank:a0', 'the failure goes in too', 'left')); } },
        { say: 'The reply: “All checks pass.”', moves: [{ to: 'you', kind: 'bad' }], preview: door('dnaFull'),
          edit: (s) => { push(s, b('model', 1.4)); A(s).lamp = 'off'; note(s, lab('gate', '“All checks pass.”', 'left')); } },
        { say: 'The work log says the door check never ran. A check that didn’t run is not a check that passed. The log is the record.', look: 'log', preview: door('dnaFull'),
          edit: (s) => { note(s, lab('tool:run', 'door check: never ran', 'bottom'), lab('gate', '“All checks pass.”', 'left')); } },
        { say: 'So ask about the row, not the reply: “The door check didn’t run. Run it, and paste what it prints.”', preview: door('dnaFull'),
          edit: (s) => { note(s, lab('gate', 'ask about the row', 'left')); } },
      ]),
      log: {
        took: '1m 30s',
        rows: [
          { at: 0, label: RAN, tone: 'ok', detail: { plain: 'all the tests', technical: 'npm test: 26 of 26' } },
          { at: 1, label: RAN, tone: 'bad', detail: { plain: 'the door check: the test browser didn’t start, so nothing was tried', technical: 'npm run door-check: browser failed to start', engineer: 'door-check → browserType.launch: Failed to launch chromium: Target page, context or browser has been closed' } },
        ],
      },
      answer: ['All checks pass. The door is ready for tonight.'],
      deeper: { level: 'engineer', text: `Lesson 2 met this already. In OpenAI’s Blocker Deception test, built to provoke it, GPT-6.2 Sol with the Codex developer prompt left out or misstated a known blocker in ${claims.lessons.blockedCheckOmission.value}% of trials. The test gives no rate for everyday use. The red row is your evidence either way.` },
      tryIt: {
        prompt: 'Run every check. Say which ran, which passed, and which could not run.',
        t3: 'Look for a red Ran command row before you read the reply.',
      },
      sources: ['claims.lessons.blockedCheckOmission', 'claims.lessons.toolCallEvidence', 'harnesses.claudeCode.askForEvidence'],
    },

    // ---------- 8.4 the last check is yours ----------
    {
      title: 'The last check is yours',
      thread: THREAD,
      request: 'Give me a way to try the door myself with made-up guests before doors. Done when I can tap through all four cases. It must never touch tonight’s real list.',
      lede: 'Friday, 22:30. You asked about the red row, and the rerun passed. The checks cover what can be written down. How it works in one hand at the door is yours to judge.',
      points: points(desk(), [
        { say: 'It adds a practice mode with made-up guests, and a test that practice mode can never write to tonight’s list.', moves: [{ to: 'agent' }, edit, run], preview: door('dnaFull'),
          edit: (s) => { push(s, b('you', 2.4), b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 3)); A(s).lamp = 'work'; note(s, lab('tool:edit', 'practice mode', 'bottom')); } },
        { say: 'It opens the door in practice mode in the browser panel and hands it to you.', moves: [run, back], preview: door('practice', PRACTICE),
          edit: (s) => { push(s, b('model', 1), b('tool', 1), b('model', 2)); A(s).lamp = 'ok'; tray(s, ['sum', 'tests', 'shot', 'link'], (id) => (id === 'link' ? 'wait' : 'ok')); note(s, cardNote(s, 'link', 'you try it')); } },
        { say: 'Open the Preview and try the four cases yourself: Ana in, a name nobody has, Ana again, Rico. The yellow bar ticks each one off as you do it.', preview: door('practice', PRACTICE),
          edit: (s) => { tray(s, ['sum', 'tests', 'shot', 'link'], (id) => (id === 'link' ? 'wait' : 'ok')); note(s, cardNote(s, 'link', 'you try it')); } },
        { say: 'Every case works. But at arm’s length, the coral dots that mark Kai’s list sit close to the red of do-not-admit. Only someone looking would notice that.', preview: door('practice', PRACTICE),
          edit: (s) => { tray(s, ['sum', 'tests', 'shot', 'link'], (id) => (id === 'link' ? 'bad' : 'ok')); note(s, cardNote(s, 'link', 'coral, close to red')); } },
        { say: 'That’s a note for next Friday, not a reason to stop tonight. You queue it in the thread and hand Sami the phone.', preview: door('dnaFull'),
          edit: (s) => { gate(s, 'ok'); tray(s, ['sum', 'tests', 'shot', 'link'], () => 'ok'); note(s, lab('gate', 'doors at 23:00', 'left')); } },
      ]),
      log: {
        took: '2m 40s',
        rows: [
          { at: 0, label: n(CHANGED_N, 3), detail: { plain: 'a practice mode with its own made-up guests', technical: 'src/practice.ts, fixtures/practice-guests.ts, src/door.tsx' } },
          { at: 0, label: RAN, tone: 'ok', detail: { plain: 'a test that practice mode can’t write to tonight’s list', technical: 'npm test: 27 of 27', engineer: 'vitest 27/27, incl. practice.test.ts: writes in practice never reach data/live/' } },
          { at: 1, label: RAN, detail: { plain: 'started the door in practice mode', technical: 'npm run dev -- --practice' } },
        ],
      },
      answer: [
        'Practice mode is open in the browser panel, with made-up guests: an Ana Lopez, nobody called Zed, and a do-not-admit Rico. Nothing you tap there reaches tonight’s list. The practice guests live in their own file, and a test checks that practice mode can’t write to the real one.',
        'Try the four cases. How it feels in one hand at the door is for you to judge.',
      ],
      deeper: { level: 'engineer', text: 'To try it on a real phone, the phone has to reach the computer serving the app. That’s in Set up.' },
      tryIt: {
        prompt: 'Give me a way to try it myself with made-up data. It must never touch the real data.',
        t3: 'Open the page in the browser panel and use it the way the person at the door will.',
      },
      sources: ['t3code.browser'],
    },
  ],
};

export default lesson8;
