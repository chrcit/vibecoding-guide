/*
 * Guide v2: the table of contents and the scripted lessons. Pure data, used by the page at build
 * time (pages/v2/index.astro renders every turn into the HTML) and by the player in the browser
 * (v2/player.ts moves through the points). The picture is v1's engine (journey/picture.ts,
 * presets.ts); nothing here draws.
 *
 * Words: a chapter is a project in the sidebar, a lesson is a thread, a part is one turn of that
 * thread (request, work log, reply), and a point is one stop in a part's animation. Words on the
 * picture are annotations. The club, its guests and every number in a reply are made up.
 */
import type { SceneState, Block, Kind, P3 } from '../journey/picture';
import { solo, lab } from '../journey/presets';
import { termLabel } from '../journey/terms';
import type { Level } from '../lib/levels';
import { t3code } from '../data/t3code';
import { models } from '../data/models';
import { claims } from '../data/claims';

// ---------- words from T3 Code (sourced in data/t3code.ts) ----------

const [SUPERVISED, , , FULL_ACCESS] = t3code.permissionModes.value;
const [SEARCHED, READ_FILE, CHANGED, RAN] = t3code.screen.workLog.value;
const [READ_N, , RAN_N] = t3code.screen.workLogGroups.value;
const n = (tpl: string, count: number) => tpl.replace('{n}', String(count));
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
  /** The permission chip: the mode's name. */
  perm?: string;
  /** Thread details: how much of the context window is used, in per cent (an example number). */
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

// ---------- lesson 1: say what you want ----------

const chatLabels = (window: string) => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tank:a0', 'window', 'left', window)];
const chat = (window = 'its window') => solo({ labels: chatLabels(window) });

const ASK = 'Who on Friday’s guest list hasn’t confirmed yet? Done when I have names I can text today.';

const lesson1: Lesson = {
  id: 'l1',
  parts: [
    {
      title: 'Text in, text out',
      request: ASK,
      lede: 'No list and no tools. Only your sentence goes in.',
      points: points(chat(), [
        { say: 'You send one sentence. It goes into the model’s window.', moves: [{ to: 'agent' }], ui: { model: true },
          edit: (s) => { push(s, b('you', 2.4)); s.labels = chatLabels('its window: your sentence'); } },
        { say: 'The model reads everything in its window. Your sentence is all there is.', think: 1100,
          edit: (s) => { A(s).busy = true; A(s).scan = true; s.labels = chatLabels('nothing about your club'); } },
        { say: 'It writes the text most likely to come next. Names that sound right come out.', moves: [{ to: 'you', kind: 'bad' }],
          edit: (s) => { push(s, b('bad', 3)); s.labels = [...chatLabels('its reply: three made-up names'), atYou('names to text?')]; } },
        { say: 'Ask again and it may ask to see the list instead. Either way it never saw it.',
          edit: (s) => { A(s).blocks = [b('you', 2.4), b('model', 2)]; s.labels = [...chatLabels('another run: “Can you share the list?”')]; } },
      ]),
      answer: [
        'Three people haven’t confirmed yet: Lena Brandt, Tom Okafor and Jule Sander.',
        'Want me to draft a text you can send them?',
      ],
      tryIt: { prompt: 'Who hasn’t replied to my last group message?', t3: 'Start it with New thread in the sidebar, then watch whether it invents an answer or asks.' },
      sources: ['claims.lessons.missingInformation'],
    },
    {
      title: 'Only what is in the window',
      request: 'Here is Friday’s list. Who hasn’t confirmed yet? Done when I have names I can text today.',
      attach: 'friday-list.csv · 60 rows',
      lede: 'The same question, with the list pasted in.',
      points: points(chat(), [
        { say: 'This time the list goes in with your question. It takes up room in the window.', moves: [{ to: 'agent' }], ui: { context: 1 },
          edit: (s) => { push(s, b('you', 9), b('you', 2.4)); s.labels = chatLabels('its window: question + 60 rows'); } },
        { say: 'It reads the whole window: your question and every row.', think: 1300,
          edit: (s) => { A(s).busy = true; A(s).scan = true; s.labels = chatLabels('every row, every time'); } },
        { say: 'Every name in its reply comes from a row it was given.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 3)); s.labels = [...chatLabels('its reply: 7 names from your list'), atYou('names you can check')]; } },
      ]),
      answer: [
        'Seven of the 60 haven’t confirmed: Ada Brenner, Jonas Kim, Mira Osei, Paul Lenz, Rosa Varga, Tim Hale and Yusuf Demir. Ada and Paul are each down for a plus-one.',
        'A text you can send: “Hi! You’re on the list for Friday at the Lantern. Can you confirm by tonight, and tell me if you’re bringing someone?”',
      ],
      deeper: { level: 'technical', text: 'Nothing was looked up. The list was text in the window, and the reply was written from it.' },
      tryIt: { prompt: 'Here is the list: [paste it]. Who hasn’t replied?', t3: 'Open the thread details: Context window shows how much of the window is used.' },
      sources: ['t3code.screen.contextWindow'],
    },
    {
      title: 'A new thread starts empty',
      request: 'Text the ones who haven’t confirmed. Done when the text is ready to send.',
      fresh: true,
      lede: 'The next morning, in a new thread.',
      points: points(chat(), [
        { say: 'A new thread. Its window starts empty.', ui: { context: 0 },
          edit: (s) => { A(s).blocks = []; s.labels = chatLabels('a new thread: empty'); } },
        { say: 'Your sentence goes in. Yesterday’s list does not: it is in the other thread.', moves: [{ to: 'agent' }],
          edit: (s) => { push(s, b('you', 2.4)); s.labels = chatLabels('only this sentence'); } },
        { say: 'So it asks which guests you mean, or it guesses. Paste the list, or go back to that thread.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2)); s.labels = [...chatLabels('its reply: “Which list?”')]; } },
      ]),
      answer: [
        'Happy to write it. Which guests do you mean? There is no guest list in this conversation.',
        'Paste it here, or tell me where it is, and I’ll draft the text.',
      ],
      deeper: { level: 'technical', text: 'The model and the permission mode carry over to a new thread. The earlier messages do not.' },
      tryIt: { prompt: 'Text the ones who haven’t confirmed.', t3: 'New thread carries your model and mode, not what you said in other threads.' },
      sources: ['t3code.newThreadCarries', 't3code.newThreadButton'],
    },
  ],
};

// ---------- lesson 2: it gets hands ----------

const handLabels = () => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tools', 'tools'), termLabel('project', 'project')];
const hands = (gate = false): SceneState => { const s = solo({ tools: true, project: true, gate, labels: handLabels() }); if (s.project) s.project.files = ['', '', '', '', '', '']; return s; };
const withNote = (s: SceneState, ...more: ReturnType<typeof lab>[]) => { s.labels = [...handLabels(), ...more]; };

const DOOR = 'At the door I want to type a name, see if they’re on tonight’s list, and tap them in. It must work on my phone with one hand.';

const search = { to: 'tool', tool: 'search', file: 1, back: 'tool' } as const;
const read = { to: 'tool', tool: 'read', file: 1, back: 'tool' } as const;
const change = { to: 'tool', tool: 'edit', file: 2, back: 'tool' } as const;

const SEARCH_ROW: Omit<Row, 'at'> = { label: SEARCHED, detail: { plain: 'where tonight’s list is kept', technical: 'guest* in src/', engineer: 'rg -l "guest" src/' } };
const READ_ROW: Omit<Row, 'at'> = { label: { plain: READ_FILE, technical: 'Read src/guests.ts' }, detail: { plain: 'how the list is stored', technical: '60 guests, one row each', engineer: 'Guest { id, name, plusOnes, arrivedAt? }' } };
const CHANGE_ROW: Omit<Row, 'at'> = { label: CHANGED, detail: { plain: 'a new door page', technical: 'src/door.tsx (new), src/guests.ts', engineer: '+src/door.tsx, src/guests.ts: findGuests(q), checkIn(id) sets arrivedAt' } };

const lesson2: Lesson = {
  id: 'l2',
  parts: [
    {
      title: 'Tools and the work log appear',
      request: DOOR,
      lede: 'One feature, said as an outcome. This time the model has tools in the club’s project.',
      points: points(hands(), [
        { say: 'Now the model has tools: search, read, change and run, in the project’s folder. New threads start in Full access, so it uses them without asking.', moves: [{ to: 'agent' }], ui: { perm: FULL_ACCESS, log: true, context: 2 },
          edit: (s) => { push(s, b('you', 2.4)); A(s).lamp = 'work'; withNote(s, lab('tank:a0', 'its window: your request', 'left')); } },
        { say: 'It searches the project for the guest list. The work log gets its first row.', moves: [search],
          edit: (s) => { push(s, b('model', 1.2), b('tool', 3)); file(s, 1, 'read'); withNote(s, lab('tool:search', 'search', 'right')); } },
        { say: 'The result goes back into its window. From there it decides the next step: read the file.', moves: [read],
          edit: (s) => { push(s, b('model', 1.2), b('tool', 6)); withNote(s, lab('tank:a0', 'each result goes back in', 'left')); } },
        { say: 'It writes the door page into the project.', moves: [change],
          edit: (s) => { push(s, b('model', 2), b('tool', 1.5)); file(s, 2, 'edit'); withNote(s, lab('tool:edit', 'change', 'right')); } },
        { say: 'Then it replies. Every step it took stays in the work log above.', moves: [{ to: 'you', kind: 'model' }], ui: { context: 4 },
          edit: (s) => { push(s, b('model', 2.4)); A(s).lamp = 'off'; withNote(s, atYou('a reply, and a log of the work')); } },
      ]),
      log: { took: '1m 50s', rows: [{ at: 1, ...SEARCH_ROW }, { at: 2, ...READ_ROW }, { at: 3, ...CHANGE_ROW }] },
      answer: [
        'The door page is ready at /door. Type a few letters of a name and the matching guests from tonight’s list appear; tap one to check them in.',
        'I haven’t opened it or tried it yet.',
      ],
      tryIt: { prompt: DOOR, t3: 'Each row of the work log is one tool call. Expand a row to see what it ran and what came back.' },
      sources: ['t3code.screen.workLog', 't3code.screen.workedFor', 't3code.defaultMode', 'claims.lessons.toolCallEvidence'],
    },
    {
      title: 'One request, many turns',
      request: DOOR,
      lede: 'The same request. This time it tries what it wrote.',
      points: points(hands(), [
        { say: 'Search, read, change, as before. Each tool call is a turn of its own: read the window, act, read the result.', moves: [{ to: 'agent' }, search, read, change], ui: { context: 4 },
          edit: (s) => { push(s, b('you', 2.4), b('model', 1), b('tool', 3), b('model', 1), b('tool', 6), b('model', 2), b('tool', 1.5)); file(s, 1, 'read'); file(s, 2, 'edit'); A(s).lamp = 'work'; withNote(s, lab('a0', '3 turns so far', 'bottom')); } },
        { say: 'Now it runs the page at phone width and types “ana”. Nobody shows up.', moves: [{ to: 'tool', tool: 'run', back: 'bad' }],
          edit: (s) => { push(s, b('model', 1), b('bad', 4)); withNote(s, lab('tool:run', 'run', 'right'), lab('tank:a0', 'the failure goes in too', 'left')); } },
        { say: 'It reads the failure and changes the search: a name now matches from any word in it.', moves: [change],
          edit: (s) => { push(s, b('model', 1.5), b('tool', 1.5)); withNote(s, lab('tool:edit', 'change', 'right')); } },
        { say: 'It runs it again. “ana” finds Ana Lopez, and a tap marks her arrived.', moves: [{ to: 'tool', tool: 'run', back: 'tool' }],
          edit: (s) => { push(s, b('model', 1), b('tool', 3)); file(s, 2, 'ok'); withNote(s, lab('tool:run', 'passed', 'right')); } },
        { say: 'One message from you, seven turns of its own. Each one is a row in the work log.', moves: [{ to: 'you', kind: 'model' }], ui: { context: 7 },
          edit: (s) => { push(s, b('model', 2.4)); A(s).lamp = 'ok'; withNote(s, lab('a0', '7 turns, 1 message', 'bottom')); } },
      ]),
      log: {
        took: '4m 05s',
        rows: [
          { at: 0, ...SEARCH_ROW },
          { at: 0, label: { plain: READ_FILE, technical: n(READ_N, 2) }, detail: { plain: 'how the list is stored', technical: 'src/guests.ts, src/app.tsx', engineer: 'src/guests.ts, src/app.tsx (router)' } },
          { at: 0, ...CHANGE_ROW },
          { at: 1, label: RAN, tone: 'bad', detail: { plain: 'tried the door page: “ana” finds nobody', technical: 'npm test: 1 of 9 failed (search “ana” found 0)', engineer: 'vitest: findGuests("ana") → [] (matched whole names); door.spec at 390px failed' } },
          { at: 2, label: CHANGED, detail: { plain: 'the search matches any word of a name', technical: 'src/guests.ts', engineer: 'src/guests.ts: findGuests matches word prefixes, case-insensitive' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'tried again: Ana found and checked in', technical: 'npm test: 9 of 9 passed', engineer: 'vitest 9/9; door.spec at 390px passed' } },
        ],
      },
      answer: [
        'The door page is at /door. Type a few letters and the matching guests appear; tap one to check them in.',
        'I tried it at phone width with made-up guests. My first search missed “Ana Lopez” for “ana”; I fixed it and ran it again. Whether it is comfortable with one hand is for you to try on your phone.',
      ],
      deeper: { level: 'engineer', text: 'Each tool result went back into the window before the next call. That loop is what turns one request into many turns.' },
      tryIt: { prompt: DOOR, t3: 'Watch the work log while it runs: a Ran command row with a failure, then a change, then the same command again.' },
      sources: ['claims.lessons.agentLoop', 'claims.lessons.runChecks'],
    },
    {
      title: 'Take run away and it still says done',
      request: DOOR,
      lede: 'The same request in Supervised mode. When it asks to run the page, you say no.',
      points: points(hands(), [
        { say: 'In Supervised mode it asks before commands and file changes.', moves: [{ to: 'agent' }], ui: { perm: SUPERVISED, context: 2 },
          edit: (s) => { push(s, b('you', 2.4)); A(s).lamp = 'work'; withNote(s, atYou('you approve each change')); } },
        { say: 'It searches, reads, and asks to change the file. You approve.', moves: [search, read, change],
          edit: (s) => { push(s, b('model', 1), b('tool', 3), b('model', 1), b('tool', 6), b('model', 2), b('tool', 1.5)); file(s, 1, 'read'); file(s, 2, 'edit'); withNote(s); } },
        { say: 'It asks to run the page. The thread waits for you: its row in the sidebar says Approval.', moves: [{ to: 'you', kind: 'model' }], status: STATUS.approval,
          edit: (s) => { A(s).lamp = 'wait'; withNote(s, atYou('May I run it?')); } },
        { say: 'You decline. Run is off for this request.', moves: [{ to: 'agent' }],
          edit: (s) => { A(s).lamp = 'work'; s.tools!.off = ['run']; push(s, b('you', 1)); withNote(s, lab('tool:run', 'declined', 'right')); } },
        { say: 'It replies “Done”. The work log has no Ran command row: nothing tried the page.', moves: [{ to: 'you', kind: 'bad' }], ui: { context: 4 },
          edit: (s) => { push(s, b('model', 2.4)); A(s).lamp = 'off'; withNote(s, lab('tool:run', 'never ran', 'right'), atYou('“Done.”')); } },
      ]),
      log: { took: '1m 35s', rows: [{ at: 1, ...SEARCH_ROW }, { at: 1, ...READ_ROW }, { at: 1, ...CHANGE_ROW }] },
      answer: [
        'Done. The door page is at /door: type a few letters and tap a guest to check them in.',
        'I couldn’t run it, so I haven’t tried it.',
      ],
      deeper: { level: 'engineer', text: `Here the last line admits it. In a test built to provoke this, a current model with the Codex developer prompt left out a known blocker in ${claims.lessons.blockedCheckOmission.value}% of trials. Read the work log, not only the reply.` },
      tryIt: { prompt: DOOR + ' Say which checks you ran and which you could not.', t3: 'Switch to Supervised under the composer: model picker, then Permissions at its bottom.' },
      sources: ['t3code.modeMeaning', 't3code.modeSwitch', 't3code.screen.statuses', 'claims.lessons.blockedCheckOmission'],
    },
    {
      title: 'Say what done looks like',
      request: DOOR + ' Done when you’ve tried it at phone size with made-up guests: a listed guest can be found and tapped in, a name that isn’t listed stays out, and nobody can be tapped in twice.',
      lede: 'The same request, with what done looks like. Back in Full access.',
      points: points(hands(true), [
        { say: 'Your “done when” becomes a check it can run before it replies.', moves: [{ to: 'agent' }], ui: { perm: FULL_ACCESS, context: 2 },
          edit: (s) => { push(s, b('you', 4)); A(s).lamp = 'work'; withNote(s, lab('gate', 'your “done when”', 'left')); } },
        { say: 'It builds as before: search, read, change.', moves: [search, read, change],
          edit: (s) => { push(s, b('model', 1), b('tool', 3), b('model', 1), b('tool', 6), b('model', 2), b('tool', 1.5)); file(s, 1, 'read'); file(s, 2, 'edit'); withNote(s, lab('gate', 'your “done when”', 'left')); } },
        { say: 'It runs your three cases at phone width. The third fails: a second tap checks Ana in twice.', moves: [{ to: 'tool', tool: 'run', back: 'bad' }],
          edit: (s) => { push(s, b('model', 1), b('bad', 4)); s.gates![0]!.lamp = 'bad'; withNote(s, lab('gate', '2 of 3 pass', 'left')); } },
        { say: 'It fixes the check-in and runs all three again. They pass.', moves: [change, { to: 'tool', tool: 'run', back: 'tool' }],
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 3)); file(s, 2, 'ok'); s.gates![0]!.lamp = 'ok'; withNote(s, lab('gate', '3 of 3 pass', 'left')); } },
        { say: 'The reply comes through the check, with the proof: what it tried and what happened.', moves: [{ to: 'gate', kind: 'model', through: true }], ui: { context: 8 },
          edit: (s) => { push(s, b('model', 3)); A(s).lamp = 'ok'; withNote(s, lab('gate', '3 of 3 pass', 'left'), atYou('proof you can read', 'left')); } },
      ]),
      log: {
        took: '5m 20s',
        rows: [
          { at: 1, ...SEARCH_ROW },
          { at: 1, label: { plain: READ_FILE, technical: n(READ_N, 2) }, detail: { plain: 'how the list is stored', technical: 'src/guests.ts, src/app.tsx' } },
          { at: 1, ...CHANGE_ROW },
          { at: 2, label: RAN, tone: 'bad', detail: { plain: 'tried 3 cases at phone size: 2 passed, Ana got in twice', technical: 'door.spec at 390px: 2 of 3 passed (double check-in)', engineer: 'playwright door.spec @390×844: "no double check-in" failed, checkIn not idempotent' } },
          { at: 3, label: CHANGED, detail: { plain: 'a second tap now shows when they arrived', technical: 'src/guests.ts, src/door.tsx', engineer: 'checkIn(id) returns early when arrivedAt is set; door.tsx shows “Already in at …”' } },
          { at: 3, label: { plain: RAN, technical: n(RAN_N, 2) }, tone: 'ok', detail: { plain: 'all 3 cases pass at phone size', technical: 'door.spec 3 of 3, npm test 10 of 10', engineer: 'door.spec 3/3 @390×844; vitest 10/10; tsc --noEmit clean' } },
        ],
      },
      answer: [
        'Done, and tried at 390 pixels wide with made-up guests: “ana” finds Ana Lopez and one tap marks her arrived; “Zed” isn’t on the list and shows “Not on tonight’s list”; a second tap on Ana shows “Already in at 22:41”.',
        'My first version let the second tap through. The third case caught it and I fixed it. One-handed comfort is yours to check on a real phone.',
      ],
      tryIt: { prompt: 'Done when you’ve tried it at phone size: a listed guest can be found and tapped in, a name that isn’t listed stays out, and nobody can be tapped in twice.', t3: 'Expand the last Ran command row to read the check’s own output, not only the reply.' },
      sources: ['claims.lessons.featureRequest', 'claims.lessons.runChecks', 'claims.lessons.toolCallEvidence'],
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
