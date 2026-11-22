/*
 * Guide v2: the table of contents and the scripted lessons. Pure data, used by the page at build
 * time (pages/v2/index.astro renders every turn into the HTML) and by the player in the browser
 * (v2/player.ts moves through the points). The picture is v1's engine (journey/picture.ts,
 * presets.ts); nothing here draws.
 *
 * Words: a chapter is a project in the sidebar, a lesson is a thread, a part is one turn of that
 * thread (request, work log, reply), and a point is one stop in a part's animation. Words on the
 * picture are annotations. Inside a turn the agent takes steps (tool calls); "turn" never means a
 * step. The club (the Lantern), its staff, its guests, the files and every number in a reply are
 * made up. The story continues in planning/guide-v2/lessons-3-8.md.
 */
import type { SceneState, Block, Kind, P3 } from '../journey/picture';
import { solo, lab } from '../journey/presets';
import { termLabel } from '../journey/terms';
import type { Level } from '../lib/levels';
import type { Preview, DoorStage } from './preview';
import { t3code } from '../data/t3code';
import { models } from '../data/models';
import { claims } from '../data/claims';

// ---------- words from T3 Code (sourced in data/t3code.ts) ----------

const [, , , FULL_ACCESS] = t3code.permissionModes.value;
const [, , CHANGED, RAN] = t3code.screen.workLog.value;
const [, CHANGED_N, RAN_N] = t3code.screen.workLogGroups.value;
const fill = (tpl: string, vars: Record<string, string | number>) => tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
const n = (tpl: string, count: number) => fill(tpl, { n: count });
/** "Read src/guests.ts": the row names the file (t3code.screen.readRow). */
const readRow = (path: string) => fill(t3code.screen.readRow.value, { path });
/** "Searched guest in src" (t3code.screen.searchRow). */
const searchRow = (query: string, target: string) => fill(t3code.screen.searchRow.value, { query, target });
export const MODEL = models['claude-opus-5-5'].name.replace(/^Claude /, '');
const status = (word: string) => { const w = t3code.screen.statuses.value.find((x) => x === word); if (!w) throw new Error(`v2: T3 Code has no status ${word}`); return w; };
/** The sidebar row labels the lessons use, from T3 Code's own list. */
export const STATUS = { working: status('Working'), approval: status('Approval'), done: status('Done') };
export const worked = (d: string) => t3code.screen.workedFor.value.replace('{duration}', d);

// ---------- the table of contents ----------

export interface TocLesson { id: string; n?: number; title: string; plays: boolean }
export interface TocChapter { id: string; n?: number; title: string; lessons: TocLesson[] }

const toc = (chapters: [string, string[]][]): TocChapter[] => {
  let i = 0;
  return chapters.map(([title, lessons], c) => {
    const setup = title === 'Set up';
    return {
      id: setup ? 'setup' : `c${c + 1}`,
      n: setup ? undefined : c + 1,
      title,
      lessons: lessons.map((t) => {
        const num = setup ? undefined : ++i;
        return { id: setup ? `s-${t.toLowerCase().replace(/\W+/g, '-')}` : `l${num}`, n: num, title: t, plays: num === 1 || num === 2 };
      }),
    };
  });
};

/** The relay's proposed order (BRIEF.md, "The new order"), not yet confirmed by the owner. */
export const TOC: TocChapter[] = toc([
  ['Hand it over', ['Say what you want', 'It gets hands', 'Done when', 'Start another']],
  ['Why it goes wrong', ['The window fills', 'Write it down', 'Your turn', 'Proof you can read']],
  ['More agents', ['A helper', 'Side by side', 'A lead', 'A second model', 'A fleet']],
  ['The work around it', ['Cost', 'The project grows', 'Other people', 'Other machines']],
  ['Set up', ['Providers', 'Git and hosting', 'First setup']],
]);

// ---------- what a lesson is made of ----------

/** Text that can differ by reader level. A missing level falls back to the one below it. */
export type Lv = string | { plain: string; technical?: string; engineer?: string };
export const atLevel = (t: Lv, level: Level): string =>
  typeof t === 'string' ? t : level === 'engineer' ? (t.engineer ?? t.technical ?? t.plain) : level === 'technical' ? (t.technical ?? t.plain) : t.plain;

/** A puck on its way to this point: into the window, back to you, or out to a tool and back. */
export type Move =
  | { to: 'agent' }
  | { to: 'you'; kind: Kind }
  | { to: 'tool'; tool: string; file?: number; back: Kind }
  | { to: 'gate'; kind: Kind; through?: boolean };

/** The parts of the app a lesson teaches. Each appears at the point that teaches it and stays. */
export interface Ui {
  /** The model chip under the dock. */
  model?: boolean;
  /** The permission chip: the mode's name. T3 Code labels the control "Permissions: {mode}" (t3code.screen.permissionChip). */
  perm?: string;
  /**
   * Thread details: how much of the context window is used, in per cent (an example number).
   * Lesson 5, "The window fills", teaches it; lessons 1 and 2 never set it.
   */
  context?: number;
  /** The work log above the reply. */
  log?: boolean;
}

export interface Point {
  say: string;
  state: SceneState;
  moves: Move[];
  /** Milliseconds the model is shown reading its window before the point lands. */
  think?: number;
  /** The lesson thread's status in the sidebar at this point, when not Working. */
  status?: string;
  ui?: Ui;
  /**
   * What the browser panel shows at this point: the app being built, at a stage of the story.
   * Set on every point of a part that builds an app; left out where there is no app yet.
   */
  preview?: Preview;
}

export interface Row { at: number; label: Lv; detail?: Lv; tone?: 'bad' | 'ok' }

export interface Part {
  title: string;
  /** The request: the same sentence at every level. */
  request: string;
  /** Something attached to the request (a pasted list). */
  attach?: string;
  /** The part starts a new thread: earlier turns leave the chat. */
  fresh?: boolean;
  /**
   * The story thread this turn is sent in, by its title in the sidebar (made up, as T3 Code would
   * title it from the first message). Parts with the same title share one thread and follow each
   * other in it; a part with a new title (and `fresh`) opens a new row in the sidebar.
   */
  thread?: string;
  lede: string;
  points: Point[];
  /** The work log, when the lesson has taught it: rows appear at their point. */
  log?: { took: string; rows: Row[] };
  /** What the agent answered. */
  answer: Lv[];
  /** Shown to technical and engineer readers under the answer. */
  deeper?: { level: 'technical' | 'engineer'; text: string };
  /** The prompt to try, and the one thing to do in T3 Code. */
  tryIt: { prompt: string; t3: string };
  /** Fact ids this part rests on, linked to the sources page. */
  sources: string[];
}

export interface Lesson { id: string; parts: Part[] }

// ---------- building points ----------

type Step = Omit<Point, 'state' | 'moves'> & { moves?: Move[]; edit?: (s: SceneState) => void };

/** Points from a starting state: each step changes a copy of the state before it. */
function points(start: SceneState, steps: Step[]): Point[] {
  let s = start;
  return steps.map(({ edit, moves = [], ...rest }) => {
    s = structuredClone(s);
    if (s.agents[0]) { s.agents[0].busy = false; s.agents[0].scan = false; }
    edit?.(s);
    return { ...rest, moves, state: s };
  });
}
const A = (s: SceneState) => s.agents[0]!;
const push = (s: SceneState, ...b: Block[]) => { (A(s).blocks ??= []).push(...b); };
const file = (s: SceneState, i: number, mark: 'read' | 'edit' | 'ok' | 'bad') => { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[i] = mark; };
const b = (t: Kind, h: number): Block => ({ t, h });
/** An annotation beside you. The 'you' anchor already carries your name, so this one hangs off a point near it. */
const atYou = (text: string, place: 'right' | 'left' = 'right') => lab([0, 104, 16] as P3, text, place);
/** What sits in every window before your first word: the harness's instructions and tool definitions. */
const FIRST = b('rules', 1.6);

// ---------- lesson 1: say what you want ----------
// Thursday 22:00 and Friday 09:00. No project and no tools in the picture: the model alone.

const chatLabels = (window: string) => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tank:a0', 'window', 'left', window)];
const chat = (window = 'its window', blocks: Block[] = [FIRST]) => solo({ labels: chatLabels(window), blocks });

const ASK = 'Who on Friday’s guest list hasn’t confirmed yet? Done when I have names I can text tonight.';
const GUESTS = 'Who hasn’t confirmed';

const lesson1: Lesson = {
  id: 'l1',
  parts: [
    {
      title: 'Only what’s in the window',
      thread: GUESTS,
      request: ASK,
      lede: 'You run the Lantern, a small club. Friday is two days away, and the guest list lives in the club’s little app. For this lesson, picture the model on its own: text goes in, text comes out. Lesson 2 gives it tools.',
      points: points(chat(), [
        { say: 'You send one sentence. It goes into the model’s window, after the instructions every thread starts with.', moves: [{ to: 'agent' }], ui: { model: true },
          edit: (s) => { push(s, b('you', 2.4)); s.labels = chatLabels('its window: instructions + your sentence'); } },
        { say: 'The model reads its whole window. Nothing in it is about your club.', think: 1100,
          edit: (s) => { A(s).busy = true; A(s).scan = true; s.labels = chatLabels('nothing about the Lantern'); } },
        { say: 'Here it asks for the list. It can’t answer from a list it never saw.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2)); s.labels = chatLabels('its reply: “Can you share the list?”'); } },
        { say: 'Another run can fill the gap instead, with names that sound right and read as confidently as real ones. Only you can tell a real guest from a made-up one. Here, your “done when” is a check only you can make.', moves: [{ to: 'you', kind: 'bad' }],
          edit: (s) => { A(s).blocks = [FIRST, b('you', 2.4), b('bad', 3)]; s.labels = [...chatLabels('another run: three names it made up'), atYou('names to text?')]; } },
      ]),
      answer: [
        'I don’t have Friday’s guest list, so I can’t tell who hasn’t confirmed.',
        'Paste it here, or export it from the app, and I’ll pick out everyone who hasn’t replied.',
      ],
      deeper: { level: 'engineer', text: 'The model predicts the next tokens from what is in its window. Tuning pushes it to ask for input it lacks, and nothing guarantees that it will. With no list in the window, a few plausible names are still a possible output.' },
      tryIt: { prompt: 'Who hasn’t replied to my last group message?', t3: 'Start a New thread from the sidebar, send it, and see whether it asks or makes up an answer.' },
      sources: ['claims.lessons.missingInformation', 't3code.newThreadButton'],
    },
    {
      title: 'Paste the list',
      thread: GUESTS,
      request: 'Here’s the list, exported from the app. Don’t name anyone who isn’t on it.',
      attach: 'friday-list.csv · 60 rows',
      lede: 'It asked for the list, so you paste it into the same thread. Every guest here is made up.',
      points: points(chat('its window', [FIRST, b('you', 2.4), b('model', 2)]), [
        { say: 'The list goes into the window with your message. Whatever you paste also goes to the model’s provider.', moves: [{ to: 'agent' }],
          edit: (s) => { push(s, b('you', 9)); s.labels = chatLabels('its window: + 60 rows'); } },
        { say: 'It reads the whole window again: last night’s question, its own reply and every row.', think: 1300,
          edit: (s) => { A(s).busy = true; A(s).scan = true; s.labels = chatLabels('the whole thread, every time'); } },
        { say: 'Now the names come from the rows. You can check each one against the list.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 3)); s.labels = [...chatLabels('its reply: 7 names from your list'), atYou('names you can check')]; } },
      ]),
      answer: [
        'Seven of the 60 haven’t confirmed: Ada Brenner, Jonas Kim, Mira Osei, Paul Lenz, Rosa Varga, Tim Hale and Yusuf Demir. Ada and Paul each have a plus-one.',
        'A text you can send: “Hi! You’re on the list for Friday at the Lantern. Can you confirm by noon tomorrow, and tell me if you’re bringing someone?”',
      ],
      deeper: { level: 'engineer', text: 'Pasting is the simplest way to put data in the window. Sixty rows fit easily. With thousands, a tool that searches works better (lesson 2), and a full window has costs of its own (lesson 5). Rows in view don’t guarantee a correct count, so check the names.' },
      tryIt: { prompt: 'Here is the list: [paste a made-up list]. Who hasn’t replied? Don’t name anyone who isn’t on it.', t3: 'What you paste goes to your provider, not to T3. Use made-up data, or only what your plan and your employer allow.' },
      sources: ['t3code.codeNotToT3', 'claims.privacy.claudeConsumer', 'claims.privacy.openaiApi'],
    },
    {
      title: 'A new thread doesn’t know the last one',
      thread: 'Text unconfirmed guests',
      fresh: true,
      request: 'Text the ones who haven’t confirmed. Done when the text is ready to send.',
      lede: 'Friday, 09:00. You start a new thread for the texts.',
      points: points(chat('its window', []), [
        { say: 'A new thread. Last night’s conversation stays in the other one.',
          edit: (s) => { A(s).blocks = []; s.labels = chatLabels('a new thread'); } },
        { say: 'Some things come along: your model and permission mode, and the instructions every thread starts with. In a project, Claude Code and Codex also load its instruction file.',
          edit: (s) => { A(s).blocks = [FIRST]; s.labels = chatLabels('already there: its instructions'); } },
        { say: 'Your sentence goes in. The list doesn’t. It’s in last night’s thread.', moves: [{ to: 'agent' }],
          edit: (s) => { push(s, b('you', 2.4)); s.labels = chatLabels('no list'); } },
        { say: 'So it asks which guests you mean. Paste the list again, go back to that thread, or keep the list in a project where every thread can find it.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2)); s.labels = chatLabels('its reply: “Which guests?”'); } },
      ]),
      answer: [
        'Happy to write it. Which guests do you mean? There’s no guest list in this conversation.',
        'Paste it here, or tell me where it’s kept, and I’ll draft the text.',
      ],
      deeper: { level: 'engineer', text: 'The window isn’t blank. The harness’s system prompt and tool definitions are there before your first word, and Claude Code and Codex add the project’s instruction file. Last night’s messages aren’t. Not every provider loads that file at the start: in the guide’s own test, Antigravity under T3 Code didn’t.' },
      tryIt: { prompt: 'Text the ones who haven’t confirmed.', t3: 'A new thread carries your model and mode, and it can read the project’s files. It doesn’t carry what you said in other threads.' },
      sources: ['t3code.newThreadCarries', 'lineup.cacheExactPrefix', 'harnesses.claudeCode.startupContext', 'harnesses.codex.contextFile', 'observations.experience.antigravityContextFiles'],
    },
  ],
};

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
        { say: 'The work log says otherwise: one red Ran command row, and nothing after it opened the page. Read the log as well as the reply.', preview: door('first'),
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

export const LESSONS: Record<string, Lesson> = { l1: lesson1, l2: lesson2 };

/** Where a lesson sits: its chapter and number. */
export function whereIs(id: string): { chapter: TocChapter; lesson: TocLesson } {
  for (const chapter of TOC) for (const lesson of chapter.lessons) if (lesson.id === id) return { chapter, lesson };
  throw new Error(`v2: no lesson ${id}`);
}

/** The order lessons are taught in, for features that stay once taught. */
export const ORDER = TOC.flatMap((c) => c.lessons.map((l) => l.id));

/** What the app shows at a point: everything taught up to and including it. */
export function uiAt(lessonId: string, part: number, point: number): Ui {
  const ui: Ui = {};
  for (const id of ORDER) {
    const lesson = LESSONS[id];
    if (!lesson) { if (id === lessonId) return ui; continue; }
    for (let p = 0; p < lesson.parts.length; p++) {
      const pts = lesson.parts[p]!.points;
      for (let i = 0; i < pts.length; i++) {
        if (id === lessonId && (p > part || (p === part && i > point))) return ui;
        Object.assign(ui, pts[i]!.ui);
      }
    }
    if (id === lessonId) return ui;
  }
  return ui;
}
