// The catalog of pictures the guide needs and does not have yet.
//
// Two kinds:
//   generation  the same prompt given to several models in a fresh folder, and
//               a screenshot of what each one built. These go into the guide
//               next to the prompt, and later feed a page that shows how
//               different models handle interface work.
//   screen      a screenshot of a tool (T3 Code, mostly) at a moment the
//               guide describes.
//
// Nothing here is generated yet: the owner asked for the list first. When a
// sample is made, save it under src/assets/samples/<id>/ (one WebP per model
// for a generation, named by model id), set `status: 'done'`, fill `made`,
// and record the harness and the exact prompt used. A sample is evidence, so
// it is never retouched and never re-run until it looks better: if a model
// did badly on the first run, that is the picture.
//
// How to run a generation: a new empty folder, a new thread, the reader-level
// first message from lib/start.ts (plain level), then the prompt, answering
// the agent's questions with "you decide". No other steering. Screenshot at
// the viewport given, light theme, after the first build and again after the
// change prompt.

import * as start from './start.ts';

/** Model ids as in src/data/models.ts. */
export const sampleModels = [
  'claude-fable-5-2', 'claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5',
  'gpt-6-2-astra', 'gpt-6-2-sol', 'gpt-6-1-terra', 'gpt-6-luna',
] as const;

export type Sample = {
  id: string;
  kind: 'generation' | 'screen';
  /** What the picture has to show. */
  shows: string;
  /** Site paths where it will be used. */
  usedOn: string[];
  viewport: [number, number];
  status: 'todo' | 'done';
  /** generation: the prompts, in order. */
  prompts?: string[];
  /** generation: which models to run. */
  models?: readonly string[];
  /** YYYY-MM-DD, and how it was made, once done. */
  made?: string;
  note?: string;
};

const generation = (id: string, build: start.BuildId, shows: string): Sample => ({
  id, kind: 'generation', shows,
  usedOn: ['start/', 'showcase/'],
  viewport: [1200, 800],
  status: 'todo',
  prompts: [start.describe[build], start.change[build]],
  models: sampleModels,
});

export const samples: Sample[] = [
  // What the three first-hour prompts produce, per model.
  generation('start-3d', '3d', 'The 3D landscape a model builds from the first-hour prompt, before and after the three changes.'),
  generation('start-app', 'app', 'The club list a model builds from the first-hour prompt, before and after the three changes.'),
  generation('start-site', 'site', 'The bakery page a model builds from the first-hour prompt, before and after the three changes.'),

  // Standing in for the three above on the start page until they exist.
  { id: 'start-pick-3d', kind: 'screen', shows: 'The showcase terrain table, as the picture for "A 3D thing".', usedOn: ['start/'], viewport: [1200, 800], status: 'done', made: '2026-11-18', note: 'Screenshot of the showcase piece, built from a longer brief. Replace with a start-3d result.' },
  { id: 'start-pick-app', kind: 'screen', shows: 'The showcase club list, as the picture for "A mini app".', usedOn: ['start/'], viewport: [1200, 800], status: 'done', made: '2026-11-18', note: 'Screenshot of the showcase piece, built from a longer brief. Replace with a start-app result.' },
  { id: 'start-pick-site', kind: 'screen', shows: 'The showcase bakery page, as the picture for "A website".', usedOn: ['start/'], viewport: [1200, 800], status: 'done', made: '2026-11-18', note: 'Screenshot of the showcase piece with the clock fixed to a Saturday morning. Replace with a start-site result.' },

  // The same request with and without context, for the context board.
  { id: 'context-bare-vs-briefed', kind: 'generation', shows: 'The club list built from one bare sentence, next to the club list built from the full first-hour prompt, same model.', usedOn: ['explain/context/'], viewport: [1200, 800], status: 'todo', prompts: ['Build a club list app.', start.describe.app], models: ['claude-sonnet-5-5', 'gpt-6-2-sol'] },

  // T3 Code at the moments the first hour describes.
  { id: 't3-welcome', kind: 'screen', shows: 'The Welcome page listing Codex and Claude Code, one ready and one not yet installed.', usedOn: ['start/', 't3-code/'], viewport: [1280, 800], status: 'todo' },
  { id: 't3-new-project', kind: 'screen', shows: 'The command palette open on "New project".', usedOn: ['start/'], viewport: [1280, 800], status: 'todo' },
  { id: 't3-mode', kind: 'screen', shows: 'The permission mode menu under the message box, with Supervised chosen.', usedOn: ['start/', 't3-code/'], viewport: [1280, 800], status: 'todo' },
  { id: 't3-approval', kind: 'screen', shows: 'An approval request for a command in Supervised mode.', usedOn: ['start/'], viewport: [1280, 800], status: 'todo' },
  { id: 't3-local-server', kind: 'screen', shows: 'The thread details listing a local server, and the app open in the browser panel.', usedOn: ['start/', 't3-code/'], viewport: [1440, 900], status: 'todo' },
  { id: 't3-diff', kind: 'screen', shows: 'The changed files under an answer, with one diff open.', usedOn: ['start/', 'explain/verification/'], viewport: [1440, 900], status: 'todo' },
  { id: 't3-edit-from-here', kind: 'screen', shows: '"Edit from here" under an earlier message.', usedOn: ['start/'], viewport: [1280, 800], status: 'todo' },
  { id: 't3-worktree', kind: 'screen', shows: 'The workspace menu with "New worktree".', usedOn: ['start/', 'explain/orchestration/'], viewport: [1280, 800], status: 'todo' },
  { id: 't3-two-models', kind: 'screen', shows: 'The model picker with two models selected for one prompt.', usedOn: ['start/', 'explain/orchestration/'], viewport: [1280, 800], status: 'todo' },
  { id: 't3-usage', kind: 'screen', shows: 'The Usage page after an hour of work.', usedOn: ['start/', 'explain/plans-and-api/'], viewport: [1440, 900], status: 'todo' },
  { id: 'agents-md-after', kind: 'screen', shows: 'The AGENTS.md the agent wrote from the first message, and the same file after the hour.', usedOn: ['start/', 'explain/context/'], viewport: [1000, 800], status: 'todo' },
];
