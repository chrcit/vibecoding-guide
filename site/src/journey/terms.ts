// The guide's glossary: one name per thing, one plain sentence for it, and the wiki page that says
// more. Every lesson defines a term from here the first time it matters, and nowhere else.
//
//   In step text (an .astro page):
//     import Term from '../../components/journey/Term.astro';
//     <Term id="worktree" />                 the word, underlined; hover, focus or tap shows the sentence
//     <Term id="worktree">worktrees</Term>   your own wording of the same word
//
//   On the picture (a chapter script):
//     import { termLabel } from '../terms';
//     labels: [termLabel('mgate', 'check')]                     "check", or "typecheck · tests" for technical
//     labels: [termLabel('tank:a0', 'window', 'left', 'its window')]
//   or by hand: { at: 'mgate', term: 'check' }. The picture picks the word for the reader's level
//   when it draws, opens the wiki page in the side view, and shows the sentence on hover and focus.
//
//   In a script's text: term('check').word, term('check').def.
//
// `retire` lists the names the lessons used for the same thing; do not use them in new text.
// `label` gives the picture label per level when it should differ (plain sees what is done,
// technical sees the command or the mechanism, engineer the full detail).
import type { Level } from '../lib/levels';
import type { Label } from './picture';
import { rung } from './rungs';

export interface TermDef {
  /** The one name, as it reads mid-sentence. */
  word: string;
  /** One plain sentence. No numbers that expire, no product claims. */
  def: string;
  /** The wiki page that says more: `wiki/<slug>/`. Closest page when there is no own article yet. */
  wiki: string;
  /** False when the wiki has no article of its own for this term yet (the link goes to the closest). */
  own?: false;
  /** Names to stop using for this thing. */
  retire?: string[];
  /** The label on the picture, per level, when it should not just be `word`. */
  label?: Partial<Record<Level, string>>;
}

export const TERMS = {
  model: {
    word: 'model',
    def: 'The program that reads text and writes the next words, such as Opus 5.5 or GPT-6.2 Sol. On its own it only writes; it cannot run anything.',
    wiki: 'model',
    retire: ['"the model" for the whole agent', 'the AI', 'the brain'],
  },
  agent: {
    word: 'agent',
    def: 'A model with a window and tools, working in a loop: it reads, acts, reads the result and goes on until the job is done.',
    wiki: 'agent',
    retire: ['the AI', 'the bot', 'the assistant', 'builder', 'the model (when the tools are meant too)'],
  },
  window: {
    word: 'window',
    def: 'Everything the model can see while it writes: your messages, its replies, files it opened, results of commands. What is not in the window does not exist for it.',
    wiki: 'context-window',
    retire: ['context (as a noun for the window)', 'memory', 'the pile'],
    label: { technical: 'context window' },
  },
  'context-rot': {
    word: 'context rot',
    def: 'A model answers worse as its window fills with things that do not matter to the task, long before the window is full.',
    wiki: 'context-window',
    own: false,
    retire: ['window fatigue', 'attention dilution (plain level)'],
  },
  token: {
    word: 'token',
    def: 'A few characters of text, the unit a model reads, writes and is billed in.',
    wiki: 'token',
  },
  turn: {
    word: 'turn',
    def: 'One round of the loop: the model reads its whole window and writes one reply or one tool call.',
    wiki: 'agent-loop',
    retire: ['step (for a round of the loop)', 'iteration'],
  },
  tools: {
    word: 'tools',
    def: 'What an agent can do besides write: read a file, edit it, search, run a command. The harness carries each one out and puts the result in the window.',
    wiki: 'tool-call',
    retire: ['hands', 'actions'],
  },
  project: {
    word: 'your project',
    def: 'The folder with your app in it: its code, its files and its instruction file. Under Git it is a repository.',
    wiki: 'your-project',
    retire: ['the codebase', 'the repo (plain level)', 'the files'],
    label: { technical: 'your repository' },
  },
  instructions: {
    word: 'instruction file',
    def: 'A short plain-text file in your project, such as AGENTS.md or CLAUDE.md, that the agent reads at the start of every thread.',
    wiki: 'instruction-file',
    retire: ['memory file', 'project memory', 'rules file'],
    label: { plain: 'AGENTS.md' },
  },
  check: {
    word: 'check',
    def: 'Something that runs on its own before work counts as done, such as the type check and the tests, and sends the work back when it fails.',
    wiki: 'verification',
    retire: ['the gate', 'test gate', 'automated test gate', 'checkpoint'],
    label: { plain: 'check', technical: 'typecheck · tests', engineer: 'tsc --noEmit · npm test' },
  },
  main: {
    word: 'main',
    def: 'The branch that holds the version of your project that counts. Work lands there once it is finished and checked.',
    wiki: 'branch',
    retire: ['the main line', 'master', 'production (for main)'],
  },
  branch: {
    word: 'branch',
    def: 'A named line of changes beside main, so work can go on without touching main until it is merged.',
    wiki: 'branch',
  },
  commit: {
    word: 'commit',
    def: 'A saved step in your project’s history, with a message saying what changed. Any commit can be gone back to.',
    wiki: 'commit',
    retire: ['save point', 'snapshot'],
  },
  worktree: {
    word: 'worktree',
    def: 'Its own copy of your project: a second folder on its own branch, so two agents can work at once without overwriting each other.',
    wiki: 'worktree',
    retire: ['copy of the project (as a name)', 'sandbox', 'parallel checkout'],
    label: { plain: 'its own copy', technical: 'worktree', engineer: 'worktree · own branch' },
  },
  thread: {
    word: 'thread',
    def: 'One conversation with an agent, with a window of its own. A new thread starts with an empty window.',
    wiki: 'thread',
    retire: ['session', 'conversation', 'chat (for a thread inside a coding tool)'],
  },
  'pull-request': {
    word: 'pull request',
    def: 'A finished branch offered for merging into main, where the checks run and people read it before it lands.',
    wiki: 'pull-request',
    retire: ['PR (plain level)', 'merge request'],
  },
  brief: {
    word: 'brief',
    def: 'The message that starts a helper: what to do, what to leave alone, and what to send back. It is all the helper knows.',
    wiki: 'brief',
    retire: ['instructions (for a brief)', 'the prompt (for a brief)', 'handoff note'],
  },
  helper: {
    word: 'helper',
    def: 'An agent another agent starts with a brief and an empty window. It does one task and sends back a short report.',
    wiki: 'subagent',
    retire: ['subagent (plain level)', 'worker', 'builder', 'child agent'],
  },
  lead: {
    word: 'lead',
    def: 'The agent you talk to once others do the building: it splits the work, writes the briefs, and reads the reports.',
    wiki: 'orchestration',
    retire: ['orchestrator', 'main agent', 'the agent you talk to (once there is a lead)'],
  },
  fleet: {
    word: 'fleet',
    def: 'Many helpers run by a lead in a loop, from a queue of tasks, with a check in front of main.',
    wiki: 'fleet',
    retire: ['swarm', 'team (for a fleet)'],
  },
  job: {
    word: 'job',
    def: 'One piece of work you start and come back to: its own thread, its own copy of your project, and a card on your tray.',
    wiki: 'parallel-work',
    own: false,
    retire: ['task (for what you start yourself; a task is what a lead hands a helper)', 'run'],
  },
  harness: {
    word: 'harness',
    def: 'The program around the model that runs the loop: it sends the window, carries out the tools and asks your permission. Claude Code, Codex and T3 Code are harnesses.',
    wiki: 'harness',
    retire: ['the app (for the harness)', 'the wrapper', 'agent framework'],
  },
  plan: {
    word: 'plan',
    def: 'A monthly subscription: a fixed price for an allowance of use that refills over time.',
    wiki: 'subscription-plan',
    retire: ['subscription (as a second name)', 'seat'],
  },
  allowance: {
    word: 'allowance',
    def: 'How much a plan lets you use before it makes you wait for it to refill.',
    wiki: 'usage-window',
    retire: ['the tank', 'quota', 'usage limit (for the allowance itself)'],
  },
  api: {
    word: 'API',
    def: 'Paying per token instead of a plan: every token read and written goes on a bill.',
    wiki: 'api',
    retire: ['pay-as-you-go (as a second name)', 'the meter (for the API)'],
  },
  cache: {
    word: 'cache',
    def: 'The provider keeps the start of a window it has just read, so reading the same start again costs less. A change near the start breaks it.',
    wiki: 'prompt-caching',
    retire: ['prompt cache (plain level)'],
  },
  tray: {
    word: 'tray',
    def: 'The place beside you where an agent leaves what you need to look at: proof, a question, a plan. One card per thing.',
    wiki: 'tray',
    retire: ['the board', 'inbox', 'dashboard'],
  },
  'proof-card': {
    word: 'proof card',
    def: 'One piece of evidence that arrives with the work: a short summary, a test run, a screenshot or a link to try it.',
    wiki: 'proof-card',
    retire: ['artifact', 'review artifact', 'receipt'],
  },
  review: {
    word: 'review',
    def: 'Another reader, a second model or a person, goes over a change before it lands and sends back what is wrong.',
    wiki: 'review',
    retire: ['second opinion', 'audit (for a review)'],
  },
  'plan-mode': {
    word: 'plan mode',
    def: 'The agent writes a plan and waits for your go-ahead before it edits anything.',
    wiki: 'plan-mode',
  },
  'permission-mode': {
    word: 'permission mode',
    def: 'What the agent may do without asking you first: read only, edit files, or run commands too.',
    wiki: 'permission-mode',
    retire: ['approval mode', 'autonomy level'],
  },
} satisfies Record<string, TermDef>;

export type TermId = keyof typeof TERMS;

export function term(id: TermId): TermDef {
  const t = TERMS[id] as TermDef | undefined;
  if (!t) throw new Error(`terms: no term "${String(id)}"`);
  return t;
}

/** The word a picture label shows at this level. */
export function termText(id: TermId, level: Level): string {
  const t = term(id);
  const l = t.label ?? {};
  return level === 'engineer' ? l.engineer ?? l.technical ?? l.plain ?? t.word
    : level === 'technical' ? l.technical ?? l.plain ?? t.word
    : l.plain ?? t.word;
}

/** The site path of a term's wiki page (put through url() or the scene's base). */
export const termHref = (id: TermId) => `wiki/${term(id).wiki}/`;

/** What a label naming a term shows at this level: the word, the wiki link, the definition. */
export function resolveTerm(id: TermId, level: Level, text?: string): { text: string; side: string; def: string } {
  const t = term(id);
  const own = level === 'engineer' ? t.label?.engineer ?? t.label?.technical : level === 'technical' ? t.label?.technical : undefined;
  return { text: own ?? text ?? termText(id, level), side: termHref(id), def: t.def };
}

/**
 * A label on the picture for a term: the word for the reader's level (worked out when the picture
 * is drawn, so it follows a change of level), a link into the side view, and the definition on
 * hover and focus. `text` replaces the plain word ("its window"); levels above plain still get the
 * term's own label when it has one.
 */
export const termLabel = (at: Label['at'], id: TermId, place: Label['place'] = 'top', text?: string): Label => ({ at, term: id, place, text });

/** A lesson by name, as text: "Check, lesson 9". The same words as <LessonRef id>. */
export function lessonName(id: string): string {
  const r = rung(id);
  if (!r) throw new Error(`lessonName: no lesson "${id}"`);
  return `${r.short}, lesson ${r.n}`;
}
