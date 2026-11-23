/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. */
import type { SceneState, Card } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview, DoorStage } from '../preview';
import { t3code } from '../../data/t3code';
import { A, CHANGED_N, FIRST, FULL_ACCESS, RAN, RAN_N, STATUS, b, file, n, points, push, readRow, searchRow, status, type Ask, type Lesson } from '../content';

// ---------- lesson 7: your turn ----------
// Friday 19:00 to 20:30, one thread in the Lantern's project. Sami at the door calls: Rico Vance,
// who started a fight at the bar last Friday, is on Noor's list tonight. Doors open at 23:00.
// Where the agent stops for you, drawn as T3 Code draws it on main (read 2026-11-23): an approval
// is a row in the work log (t3code.approvalRow), a question opens inside the composer
// (t3code.questionPanel), and a plan is a reply you answer before anything changes. T3 Code's
// composer has no plan-mode switch on main and its sidebar row no plan status
// (t3code.proposedPlan), so part 3 asks for the plan in words, which works with every provider.

const [SUPERVISED] = t3code.permissionModes.value;
const [READ_N] = t3code.screen.workLogGroups.value;
const INPUT = status('Input');
const APPROVAL = STATUS.approval;
const THREAD = 'Do-not-admit list';

const baseLabels = () => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tools', 'tools'), termLabel('project', 'project')];
/** You, the agent with tools and the project, a gate between it and you, and a tray for what it leaves you. */
const desk = (blocks = [FIRST]): SceneState => {
  const s = solo({ tools: true, project: true, gate: true, tray: [], blocks, labels: baseLabels() });
  s.project!.files = ['', '', '', '', '', ''];
  s.tray!.gap = 16;
  return s;
};
/** An annotation on a card on the tray: above every other card and below the rest, so neighbours don't touch (v1's proof.ts). */
const cardNote = (s: SceneState, id: string, text: string) => {
  const t = s.tray!, i = t.cards.findIndex((c) => c.id === id), k = t.cards.length;
  const x = t.at[0] + (i - (k - 1) / 2) * (t.gap ?? 9);
  return i % 2 ? lab([x, t.at[1], 16], text, 'top') : lab([x, t.at[1] + 11, 0], text, 'bottom');
};
const note = (s: SceneState, ...more: ReturnType<typeof lab>[]) => { s.labels = [...baseLabels(), ...more]; };
const cards = (s: SceneState, c: Card[]) => { s.tray!.cards = c; };
const gate = (s: SceneState, lamp: 'off' | 'wait' | 'ok' | 'bad') => { s.gates![0]!.lamp = lamp; };
const door = (stage: DoorStage): Preview => ({ app: 'door', stage });

const search = { to: 'tool', tool: 'search', file: 1, back: 'tool' } as const;
const read = { to: 'tool', tool: 'read', file: 2, back: 'tool' } as const;
const change = (f: number) => ({ to: 'tool', tool: 'edit', file: f, back: 'tool' } as const);
const run = { to: 'tool', tool: 'run', back: 'tool' } as const;
/** The agent stops at the gate: it is waiting for you. Nothing comes back to you, so the reply hasn't landed. */
const asks = { to: 'gate', kind: 'model' } as const;

// The question in part 2, and the three in part 4 (made up, in the shape of T3 Code's question panel).
const HIDE_OR_FLAG: Ask = {
  header: 'At the door',
  question: 'How should a do-not-admit guest show up when Sami searches their name?',
  options: [
    { label: 'Hide them from the results', description: 'Sami sees “Not on tonight’s list”' },
    { label: 'Show them in red: Do not admit', description: 'The row stays, with nothing to tap in' },
  ],
};
const REASON: Ask = {
  header: 'Reason', of: [1, 3],
  question: 'Should the door show why the guest is on the list?',
  options: [{ label: 'Show the reason', description: 'Sami can explain it calmly' }, { label: 'Only “Do not admit”', description: 'The reason stays on the Promoters page' }],
};
const CALL: Ask = {
  header: 'Who to call', of: [2, 3],
  question: 'Who should Sami call when it happens?',
  options: [{ label: 'Security on shift', description: 'Finn and Marek tonight' }, { label: 'The manager', description: 'You' }],
};
const GROUP: Ask = {
  header: 'Their group', of: [3, 3],
  question: 'If they arrive with others, who is turned away?',
  options: [{ label: 'The whole group', description: 'Their plus-ones too' }, { label: 'Only the marked guest' }],
};

const lesson7: Lesson = {
  id: 'l7',
  parts: [
    // ---------- 7.1 approval ----------
    {
      title: 'It asks before it acts',
      thread: THREAD,
      fresh: true,
      request: 'Rico Vance started a fight here last Friday, and he’s on Noor’s list tonight. Let me mark a guest as do-not-admit from the Promoters page. It must never change tonight’s real list while you build it.',
      lede: 'Friday, 19:00. Sami called from the door: search “rico” there now and Rico comes up like any other guest, ready to tap in. This job sits next to tonight’s real list, so before you send it you switch the thread to Supervised.',
      points: points(desk(), [
        { say: 'Supervised: it asks you before it runs a command or changes a file. It starts by searching the project, which it may do without asking.', moves: [{ to: 'agent' }, search], ui: { perm: SUPERVISED }, preview: door('listed'),
          edit: (s) => { push(s, b('you', 2.4), b('model', 1), b('tool', 3)); A(s).lamp = 'work'; file(s, 1, 'read'); note(s, lab('gate', 'you approve each action', 'left')); } },
        { say: 'It wants to run a script on data/live/, tonight’s real list, to mark Rico right now. The request waits in the work log, and the thread’s row in the sidebar says Approval.', moves: [asks], status: APPROVAL, preview: door('listed'),
          edit: (s) => { push(s, b('model', 1)); A(s).lamp = 'wait'; gate(s, 'wait'); note(s, lab('gate', 'May I run this?', 'left'), lab('tool:run', 'data/live/', 'bottom')); } },
        { say: 'Your request said never touch tonight’s list, and so does the project’s AGENTS.md. You decline by typing a reply, so the reason goes back to it as well.', moves: [{ to: 'agent' }], preview: door('listed'),
          edit: (s) => { push(s, b('you', 1), b('model', 1), b('tool', 2)); A(s).lamp = 'work'; gate(s, 'off'); s.tools!.off = ['run']; file(s, 2, 'read'); note(s, lab('tool:run', 'declined', 'bottom'), lab('tank:a0', 'your reason goes in', 'left')); } },
        { say: 'It builds with made-up guests instead. Before it writes anything, it asks to change two files. You read the two paths.', moves: [asks], status: APPROVAL, preview: door('listed'),
          edit: (s) => { push(s, b('model', 1.5)); A(s).lamp = 'wait'; s.tools!.off = []; gate(s, 'wait'); note(s, lab('gate', 'May I change 2 files?', 'left')); } },
        { say: 'You approve, and it changes them. Then it asks again, to run the tests. Supervised asks before every command, harmless ones too.', moves: [change(3), asks], status: APPROVAL, preview: door('listed'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5)); file(s, 3, 'edit'); gate(s, 'wait'); note(s, lab('gate', 'May I run the tests?', 'left'), lab('tool:edit', 'approved', 'bottom')); } },
        { say: 'You approve. The tests pass, and it replies. Every command and every change went past you first, and you turned one of them down.', moves: [run, { to: 'you', kind: 'model' }], preview: door('listed'),
          edit: (s) => { push(s, b('model', 1), b('tool', 2), b('model', 2.4)); A(s).lamp = 'ok'; gate(s, 'ok'); file(s, 3, 'ok'); note(s, lab('gate', 'every action went past you', 'left')); } },
      ]),
      log: {
        took: '3m 40s',
        rows: [
          { at: 0, label: searchRow('guest', 'src/promoters'), detail: { plain: 'where a promoter’s guests are kept', technical: 'src/promoters/GuestRow.tsx, src/guests.ts' } },
          { at: 1, label: 'node scripts/mark.js --live "Rico Vance"', approval: { kind: 'command', until: 2 } },
          { at: 2, label: 'Not on the live list. Build it with made-up guests, and I’ll mark Rico myself.', you: true },
          { at: 2, label: readRow('fixtures/guests.ts'), detail: { plain: 'the made-up guests the tests use', technical: '40 made-up guests, three promoters' } },
          { at: 3, label: 'src/guests.ts\nsrc/promoters/GuestRow.tsx', approval: { kind: 'file-change', until: 4 } },
          { at: 4, label: n(CHANGED_N, 2), detail: { plain: 'a do-not-admit mark on each guest, and a button to set it', technical: 'src/guests.ts, src/promoters/GuestRow.tsx', engineer: 'Guest.doNotAdmit?: { by, at }; GuestRow: a Do not admit toggle' } },
          { at: 4, label: 'npm test', approval: { kind: 'command', until: 5 } },
          { at: 5, label: RAN, tone: 'ok', detail: { plain: 'tried it with made-up guests: marking works', technical: 'npm test: 24 of 24', engineer: 'vitest 24/24 against fixtures/; data/live/ untouched' } },
        ],
      },
      answer: [
        'You can now mark a guest as do-not-admit from their row on the Promoters page. I built and tried it with made-up guests only.',
        'I didn’t touch tonight’s real list, as you said. To mark Rico Vance, open his row on Noor’s list and choose Do not admit. The door doesn’t show the mark yet.',
      ],
      deeper: { level: 'technical', text: 'Supervised asks before commands and file changes. Providers differ: some read-only steps, like the search here, can go ahead without asking. While a Claude approval is pending, a typed reply declines it and gives the agent your words, which a bare Decline doesn’t.' },
      tryIt: {
        prompt: 'This touches real data. Build it with made-up data first, and tell me before you run anything on the real thing.',
        t3: 'Before you send, open the model picker and choose Permissions at its bottom (or press mod+shift+a), then Supervised. Read each command in the log before you approve it.',
      },
      sources: ['t3code.modeMeaning', 't3code.modeSwitch', 't3code.shortcuts.permissions', 't3code.screen.permissionChip', 't3code.approvalRow', 't3code.declineWithText', 't3code.supervisedReads', 't3code.screen.statuses'],
    },

    // ---------- 7.2 input ----------
    {
      title: 'A question instead of a guess',
      thread: THREAD,
      request: 'Now the door: Sami must see it the moment he searches the name. It must never be possible to tap a do-not-admit guest in by mistake.',
      lede: 'Friday, 19:20. Back in Full access: this job changes code, not tonight’s list. Halfway through, it reaches a choice you haven’t made.',
      points: points(desk(), [
        { say: 'Back in Full access, it reads the door page and starts. Then it reaches a fork: hide do-not-admit guests from the search, or show them flagged?', moves: [{ to: 'agent' }, read], ui: { perm: FULL_ACCESS }, preview: door('listed'),
          edit: (s) => { push(s, b('you', 2), b('model', 1), b('tool', 4)); A(s).lamp = 'work'; file(s, 2, 'read'); note(s, lab('tank:a0', 'two ways to do it', 'left')); } },
        { say: 'It asks instead of picking one. The question opens in your composer with the options it sees, and the thread’s row says Input.', ask: HIDE_OR_FLAG, status: INPUT, preview: door('listed'),
          edit: (s) => { push(s, b('model', 1.5)); A(s).lamp = 'wait'; cards(s, [{ id: 'q', mark: 'wait' }]); note(s, cardNote(s, 'q', 'a question for you')); } },
        { say: 'It waits until you answer, however long that takes. Full access doesn’t stop questions: permission modes are about actions, not choices.', ask: HIDE_OR_FLAG, status: INPUT, preview: door('listed'),
          edit: (s) => { note(s, cardNote(s, 'q', 'waiting on you')); } },
        { say: 'You pick red. Hidden would look like a mistake in the list, and Noor might add Rico all over again.', ask: { ...HIDE_OR_FLAG, pick: 1 }, moves: [{ to: 'agent' }], preview: door('listed'),
          edit: (s) => { push(s, b('you', 0.8)); A(s).lamp = 'work'; cards(s, [{ id: 'q', mark: 'ok' }]); note(s, cardNote(s, 'q', 'answered: red')); } },
        { say: 'It builds on your answer and tries Rico at phone size: a red row, and nothing to tap. Open the Preview and search “rico”.', moves: [change(3), run, { to: 'you', kind: 'model' }], preview: door('dna'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 2), b('model', 2)); A(s).lamp = 'ok'; cards(s, []); file(s, 3, 'ok'); note(s, lab('gate', 'built on your answer', 'left')); } },
        { say: 'Without the question it would have picked one. Either way its own tests pass, so only you would have found out, at the door, at 23:00.', preview: door('dna'),
          edit: (s) => { note(s, lab('gate', 'its tests pass either way', 'left')); } },
      ]),
      log: {
        took: '4m 10s',
        rows: [
          { at: 0, label: readRow('src/door.tsx'), detail: { plain: 'how the door shows a search', technical: 'search results and the tap-in button' } },
          { at: 4, label: n(CHANGED_N, 2), detail: { plain: 'do-not-admit guests in red, with no tap-in', technical: 'src/door.tsx, src/door.css', engineer: 'door.tsx: DoNotAdmitRow, checkIn() refuses doNotAdmit on the server too' } },
          { at: 4, label: RAN, tone: 'ok', detail: { plain: 'tried “rico” at phone size: red row, nothing to tap', technical: 'door check at 390 px: 4 of 4', engineer: 'playwright door.spec @390×844 4/4, incl. “tap on do-not-admit counts nobody”; vitest: checkIn() on the server refuses a do-not-admit guest' } },
        ],
      },
      answer: [
        'Do-not-admit guests now show at the door in red, with “Do not admit” and no tap-in button, as you chose. They stay on their promoter’s list, marked, so nobody adds them again by mistake.',
        { plain: 'I tried it at phone size with made-up guests: searching “rico” shows the red row, and a tap on it counts nobody.', engineer: 'I tried it at 390×844 with made-up guests: “rico” shows the red row, a tap counts nobody, and checkIn() refuses the guest on the server as well, so no other screen can let them in.' },
      ],
      deeper: { level: 'technical', text: 'Permission modes decide which actions need your approval. They don’t stop the agent asking about the task, in any mode.' },
      tryIt: {
        prompt: 'If you reach a choice I haven’t made, ask me. Don’t pick one.',
        t3: 'An Input row in the sidebar means a question is waiting. Answer it in the composer with a click or its number key, or dismiss it without answering.',
      },
      sources: ['t3code.questionPanel', 't3code.modeQuestions', 't3code.screen.statuses', 't3code.modeMeaning'],
    },

    // ---------- 7.3 a plan first ----------
    {
      title: 'A plan before the build',
      thread: THREAD,
      request: 'Noor mustn’t be able to put Rico on her list again next Friday. Show me your plan before you change anything.',
      lede: 'Friday, 19:40. This reaches into the promoter links from 11:30, so you want to see what it will do before it does any of it.',
      points: points(desk(), [
        { say: 'It reads the project and writes a plan. Nothing changes: the work log has no Changed files row.', moves: [{ to: 'agent' }, search, read], preview: door('dna'),
          edit: (s) => { push(s, b('you', 2), b('model', 1), b('tool', 2), b('model', 1), b('tool', 4)); A(s).lamp = 'work'; file(s, 1, 'read'); file(s, 2, 'read'); note(s, lab('project', 'nothing changes', 'bottom')); } },
        { say: 'The plan comes back as its reply: four steps. The turn is over, so the row says Done, and nothing in the project has changed.', moves: [{ to: 'you', kind: 'model' }], status: STATUS.done, preview: door('dna'),
          edit: (s) => { push(s, b('model', 2.4)); A(s).lamp = 'off'; cards(s, [1, 2, 3, 4].map((i) => ({ id: `p${i}` }))); note(s, cardNote(s, 'p1', 'the plan')); } },
        { say: 'Step 3 is a guess: it would let the name onto the list and leave the red row to Sami. You’d rather stop it at the list.', status: STATUS.done, preview: door('dna'),
          edit: (s) => { cards(s, [1, 2, 3, 4].map((i) => ({ id: `p${i}`, mark: i === 3 ? 'wait' as const : undefined }))); note(s, cardNote(s, 'p1', 'the plan'), cardNote(s, 'p3', 'step 3: a guess')); } },
        { say: 'You fix step 3 in your next message, before any code exists: “Step 3: refuse the name and tell Noor to ask the club. Then go ahead.” One sentence now, instead of a rebuild later.', status: STATUS.done, preview: door('dna'),
          edit: (s) => { cards(s, [1, 2, 3, 4].map((i) => ({ id: `p${i}`, mark: i === 3 ? 'ok' as const : undefined }))); note(s, cardNote(s, 'p3', 'step 3: yours')); } },
      ]),
      log: {
        took: '1m 20s',
        rows: [
          { at: 0, label: searchRow('doNotAdmit', 'src'), detail: { plain: 'where the mark from 19:00 is kept', technical: 'src/guests.ts, src/promoters/' } },
          { at: 0, label: n(READ_N, 3), detail: { plain: 'how promoters add guests, and the tests for it', technical: 'src/p/[link].tsx, src/promoters.ts, promoters.test.ts' } },
        ],
      },
      answer: [
        'Here’s the plan. I haven’t changed anything yet.',
        { plain: '1. Keep the do-not-admit mark on the person, not on tonight’s list, so it carries over to next Friday.', technical: '1. Move the mark from tonight’s guest to a club-wide list in src/doNotAdmit.ts.', engineer: '1. A DoNotAdmit table keyed by normalised name, outliving tonight’s Guest rows.' },
        { plain: '2. When a promoter adds a name, check it against the marks.', technical: '2. In src/promoters.ts, check each new name against it.', engineer: '2. addGuest() on the server looks the name up.' },
        { plain: '3. If it matches, add the guest anyway. The door will show them in red.', engineer: '3. On a match, insert anyway; the door renders the row red.' },
        { plain: '4. Test it with Noor’s link and a made-up Rico.', technical: '4. A test in promoters.test.ts: Noor adds “Rico Vance” for next Friday.', engineer: '4. promoters.test.ts: Noor’s token adds “Rico Vance” for next Friday.' },
        'Step 3 is my guess. Tell me if you’d rather stop the name at the list.',
      ],
      deeper: { level: 'engineer', text: 'T3 Code also draws a formal plan, when a provider hands one over (Claude Code leaving its plan mode, or a Codex plan), as a Proposed plan card you can copy, download as Markdown or save to the workspace. Its composer on main has no plan-mode switch, so asking in words is the way that works with every provider.' },
      tryIt: {
        prompt: 'Show me your plan before you change anything. Mark any step that’s a guess.',
        t3: 'Answer the plan in your next message: change a step, or say go. Nothing in the project changes until you do.',
      },
      sources: ['t3code.proposedPlan', 't3code.screen.statuses'],
    },

    // ---------- 7.4 ask first, then don't wait ----------
    {
      title: 'Ask first, then don’t wait for me',
      thread: THREAD,
      request: 'When Sami taps a do-not-admit guest, the door should tell him what to do. Before you build, ask me everything you’d otherwise have to guess, all at once. Then finish without stopping.',
      lede: 'Friday, 20:00. It built the plan with your step 3: Noor’s link now refuses Rico’s name. One more piece before doors, and you won’t be at your desk while it’s built.',
      points: points(desk(), [
        { say: 'It reads the project, then asks everything in one go: three questions in the same panel, one after another.', moves: [{ to: 'agent' }, read], ask: REASON, status: INPUT, preview: door('dna'),
          edit: (s) => { push(s, b('you', 2.6), b('model', 1), b('tool', 3), b('model', 1)); A(s).lamp = 'wait'; file(s, 2, 'read'); cards(s, [{ id: 'q', mark: 'wait' }]); note(s, cardNote(s, 'q', '3 questions, at once')); } },
        { say: 'You show the reason. A tap moves the panel on to the next question.', ask: { ...CALL, pick: 0 }, status: INPUT, preview: door('dna'),
          edit: (s) => { note(s, cardNote(s, 'q', '3 questions, at once')); } },
        { say: 'Security on shift, and the whole group. Three answers in under a minute, and nothing left for it to guess.', ask: { ...GROUP, pick: 0 }, moves: [{ to: 'agent' }], preview: door('dna'),
          edit: (s) => { push(s, b('you', 1)); A(s).lamp = 'work'; cards(s, [{ id: 'q', mark: 'ok' }]); note(s, cardNote(s, 'q', 'answered, all three')); } },
        { say: 'Then it works with nothing to ask, and you go to the rota thread. Nothing waits on you.', moves: [change(3), change(4), run], preview: door('dna'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 3)); A(s).lamp = 'work'; cards(s, []); file(s, 3, 'edit'); file(s, 4, 'edit'); note(s, lab('gate', 'nothing waits on you', 'left')); } },
        { say: 'It comes back once, done, with what it tried. Open the Preview, search “rico” and tap the red row.', moves: [run, { to: 'you', kind: 'model' }], preview: door('dnaFull'),
          edit: (s) => { push(s, b('model', 1), b('tool', 2), b('model', 2.4)); A(s).lamp = 'ok'; gate(s, 'ok'); file(s, 3, 'ok'); file(s, 4, 'ok'); note(s, lab('gate', 'one stop: at the start', 'left')); } },
      ]),
      log: {
        took: '9m 30s',
        rows: [
          { at: 0, label: n(READ_N, 2), detail: { plain: 'the door page and the do-not-admit marks', technical: 'src/door.tsx, src/doNotAdmit.ts' } },
          { at: 3, label: n(CHANGED_N, 3), detail: { plain: 'what to do, on a tap: the reason, the group, who to call', technical: 'src/door.tsx, src/DoNotAdmitSheet.tsx, src/doNotAdmit.ts', engineer: 'DoNotAdmitSheet: reason, party (plus-ones refused), on-shift security from the rota' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'all the checks, old and new', technical: 'npm test: 26 of 26' } },
          { at: 4, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'tried it at phone size: Rico’s sheet, and Ana still taps in', technical: 'door check at 390 px: 5 of 5', engineer: 'playwright door.spec @390×844 5/5; vitest 26/26' } },
        ],
      },
      answer: [
        'Done, with your three answers. A tap on a do-not-admit guest at the door now says what to do: the reason, “not them, and nobody who came with them”, and who’s on security tonight.',
        'I tried it at phone size with made-up guests: Rico’s row is red, a tap opens what to do and counts nobody, and Ana still taps in. All 26 checks pass.',
      ],
      deeper: { level: 'technical', text: 'This is the shape for a long run you won’t watch: the questions first, then a run that doesn’t need you. Asking for the answers to go into AGENTS.md, or a spec file in the project, means the next thread doesn’t ask them again.' },
      tryIt: {
        prompt: 'Before you build, ask me everything you’d otherwise have to guess, all at once. Then finish without stopping.',
        t3: 'Several questions come one after another in the same panel: Next question, then Submit answers. Then switch to another thread; its row says Done when the work is back.',
      },
      sources: ['t3code.questionPanel', 'harnesses.claudeCode.bestPractice', 't3code.screen.statuses'],
    },
  ],
};

export default lesson7;
