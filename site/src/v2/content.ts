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
 *
 * This file holds the table of contents, the types and the shared helpers. Each lesson lives in its
 * own file, v2/lessons/l<N>.ts, and v2/lessons/index.ts collects them (LESSONS, uiAt).
 */
import type { SceneState, Block, Kind, P3, XY } from '../journey/picture';
import { lab } from '../journey/presets';
import type { Level } from '../lib/levels';
import type { Preview } from './preview';
import { t3code } from '../data/t3code';
import { models } from '../data/models';

// ---------- words from T3 Code (sourced in data/t3code.ts) ----------

export const [, , , FULL_ACCESS] = t3code.permissionModes.value;
export const [, , CHANGED, RAN] = t3code.screen.workLog.value;
export const [, CHANGED_N, RAN_N] = t3code.screen.workLogGroups.value;
export const fill = (tpl: string, vars: Record<string, string | number>) => tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
export const n = (tpl: string, count: number) => fill(tpl, { n: count });
/** "Read src/guests.ts": the row names the file (t3code.screen.readRow). */
export const readRow = (path: string) => fill(t3code.screen.readRow.value, { path });
/** "Searched guest in src" (t3code.screen.searchRow). */
export const searchRow = (query: string, target: string) => fill(t3code.screen.searchRow.value, { query, target });
export const MODEL = models['claude-opus-5-5'].name.replace(/^Claude /, '');
export const status = (word: string) => { const w = t3code.screen.statuses.value.find((x) => x === word); if (!w) throw new Error(`v2: T3 Code has no status ${word}`); return w; };
/** The sidebar row labels the lessons use, from T3 Code's own list. */
export const STATUS = { working: status('Working'), approval: status('Approval'), done: status('Done'), /* lesson 3 */ goal: status('Goal') };
export const worked = (d: string) => t3code.screen.workedFor.value.replace('{duration}', d);

// ---------- the table of contents ----------

/** `plays` is set by v2/lessons/index.ts: true when the lesson has a file there. */
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
        return { id: setup ? `s-${t.toLowerCase().replace(/\W+/g, '-')}` : `l${num}`, n: num, title: t, plays: false };
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
  | { to: 'gate'; kind: Kind; through?: boolean }
  /**
   * A puck along any route on the floor (journey/picture's `route.*`, or points of your own), for
   * scenes beyond one agent and its tools: a meter, the gate before main, other people, machines.
   * Added for lessons 14–17.
   */
  | { to: 'path'; path: XY[]; kind: Kind; ms?: number };

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
  /**
   * Thread details: the provider's usage limits, as T3 Code's "{label}: {left}% left" rows
   * (t3code.screen.usageLimits, limitWindows), with example numbers. Lesson 14 teaches them. An
   * empty list hides them again.
   */
  limits?: { label: string; left: number }[];
  /**
   * The model chip's words when they aren't the default model's name (lesson 14 shows the model and
   * effort a job was started on). An empty string goes back to the default.
   */
  modelName?: string;
  /** The "Run on" picker under the composer (t3code.screen.runOn): the machine the thread runs on. Lesson 17 teaches it; an empty string hides it. */
  env?: string;
  /**
   * Lesson 4: the workspace and branch controls under the composer (t3code.screen.workspace).
   * `label` is "Current checkout" or the worktree's folder; `branch` adds the branch control.
   */
  checkout?: { label: string; worktree?: boolean; branch?: string };
}

/**
 * Lesson 4: a story thread in the sidebar, drawn under the lesson's row with its own status.
 * `part` is the part of this lesson that opens it when clicked (none: the row only shows).
 */
export interface StoryThread { title: string; status?: string; part?: number }

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
  /**
   * Where this point sends the reader's eye in the chat, when it is not the newest row: 'log' marks
   * the failed rows of the turn's work log (a point after the reply that says "read the log").
   */
  look?: 'log';
  /**
   * Lesson 7: a question the agent is asking at this point, drawn as T3 Code's question panel
   * inside the composer (t3code.questionPanel). Left out when nothing is being asked.
   */
  ask?: Ask;
  /**
   * Lesson 4: every story thread in the sidebar at this point, each with its own status. Without
   * it the sidebar shows the lesson's threads so far, the newest one live (lesson 1).
   */
  threads?: StoryThread[];
}

/** A question in T3 Code's question panel: its header, the question and the options to pick from. */
export interface Ask {
  header: string;
  question: string;
  options: { label: string; description?: string }[];
  /** The option you picked, shown selected at this point. */
  pick?: number;
  /** This question's number and how many there are, when the agent asks several ("1/3"). */
  of?: [number, number];
}

export interface Row {
  at: number;
  label: Lv;
  detail?: Lv;
  tone?: 'bad' | 'ok';
  /**
   * Lesson 7: a pending approval, drawn as T3 Code draws it in the work log (t3code.approvalRow):
   * the command or the files, "Waiting for approval", Decline and Approve. It shows from `at` until
   * the point you answer (`until`), then leaves the log; what happens next is in the rows after it.
   */
  approval?: { kind: 'command' | 'file-change'; until: number };
  /** A message you send while the turn runs (a text reply that declines an approval). `label` is your words. */
  you?: boolean;
}

export interface Part {
  title: string;
  /** The request: the same sentence at every level. */
  request: string;
  /** Something attached to the request (a pasted list). */
  attach?: string;
  /** The part starts a new thread: earlier turns leave the chat. */
  fresh?: boolean;
  /** Lesson 4: with `fresh`, the chat switches to a story thread that already exists, so it isn't labelled a new thread. */
  resumes?: boolean;
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
  /**
   * Lesson 4: a turn of the same thread that is still running when this part starts. It shows
   * above the request, its rows appear at their points and its reply lands at point `ends`.
   */
  running?: { request: string; took: string; rows: Row[]; answer: Lv[]; ends: number };
  /**
   * Lesson 4: the request was sent while that turn ran, so it waits as a queued message (T3 Code's
   * dashed bubble, t3code.screen.queued) until point `at`, when it is sent.
   */
  queued?: { at: number };
  /**
   * Lesson 3: a /goal is set. The goal line at the end of the thread says "Pursuing goal" until
   * point `met`, then "Goal complete"; `checks[i]` is its count of checks at point i.
   */
  goal?: { objective: string; met: number; checks: number[] };
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

export type Step = Omit<Point, 'state' | 'moves'> & { moves?: Move[]; edit?: (s: SceneState) => void };

/** Points from a starting state: each step changes a copy of the state before it. */
export function points(start: SceneState, steps: Step[]): Point[] {
  let s = start;
  return steps.map(({ edit, moves = [], ...rest }) => {
    s = structuredClone(s);
    if (s.agents[0]) { s.agents[0].busy = false; s.agents[0].scan = false; }
    edit?.(s);
    return { ...rest, moves, state: s };
  });
}
export const A = (s: SceneState) => s.agents[0]!;
export const push = (s: SceneState, ...b: Block[]) => { (A(s).blocks ??= []).push(...b); };
export const file = (s: SceneState, i: number, mark: 'read' | 'edit' | 'ok' | 'bad') => { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[i] = mark; };
export const b = (t: Kind, h: number): Block => ({ t, h });
/** An annotation beside you. The 'you' anchor already carries your name, so this one hangs off a point near it. */
export const atYou = (text: string, place: 'right' | 'left' = 'right') => lab([0, 104, 16] as P3, text, place);
/** What sits in every window before your first word: the harness's instructions and tool definitions. */
export const FIRST = b('rules', 1.6);

/** Where a lesson sits: its chapter and number. */
export function whereIs(id: string): { chapter: TocChapter; lesson: TocLesson } {
  for (const chapter of TOC) for (const lesson of chapter.lessons) if (lesson.id === id) return { chapter, lesson };
  throw new Error(`v2: no lesson ${id}`);
}
