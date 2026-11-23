/*
 * Chapter 3, More agents (lessons 9 to 13): the pictures and words the five lessons share. Not a
 * lesson itself (lessons/index.ts picks up l*.ts only). The pictures are v1's: a lead with helpers
 * behind the bus (presets.team, as in v1's handoff.ts and team.ts), jobs side by side
 * (presets.jobs, as in jobs.ts), and a reviewer beside the gate (presets.solo, as in review.ts).
 * The club, its people and every number are made up; the script is planning/guide-v2/lessons-9-13.md.
 */
import { BUS_Y, SLOTS, SPOT, jobSpot, reverse, route, type Block, type Kind, type Label, type SceneState, type XY } from '../../journey/picture';
import { team, jobs, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import { t3code } from '../../data/t3code';
import { FIRST, b, fill, type Move, type StoryThread } from '../content';
import type { Preview } from '../preview';

// ---------- words from T3 Code ----------

const [, , , CREATED_N] = t3code.screen.workLogGroups.value;
const [READ_N] = t3code.screen.workLogGroups.value;
export const readN = (count: number) => fill(READ_N, { n: count });
export const createdN = (count: number) => fill(CREATED_N, { n: count });
/** "Delegated 3 tasks", or "Delegated 1 task" (t3code.screen.delegatedRow). */
export const delegated = (count: number) => fill(t3code.screen.delegatedRow.value, { count }).replace(/tasks$/, count === 1 ? 'task' : 'tasks');
const statusWord = (w: string) => { const s = t3code.screen.statuses.value.find((x) => x === w); if (!s) throw new Error(`v2: T3 Code has no status ${w}`); return s; };
/** The sidebar statuses this chapter uses, from T3 Code's own row labels. */
export const S = { working: statusWord('Working'), waiting: statusWord('Waiting'), approval: statusWord('Approval'), limited: statusWord('Limited'), done: statusWord('Done') };
export const SUPERVISED = t3code.permissionModes.value[0];
export const FULL = t3code.permissionModes.value[3];

/** A story thread's row in the sidebar. */
export const row = (title: string, status: string, part?: number): StoryThread => ({ title, status, part });

// ---------- a lead with helpers (team) ----------

export const helperAt = (i: number): XY => SLOTS[i]!;
/** A brief from the lead out to helper i, and its report back. */
export const toHelper = (i: number, kind: Kind = 'model'): Move => ({ to: 'path', path: route.agentToWorker(helperAt(i)), kind });
export const fromHelper = (i: number, kind: Kind = 'sum'): Move => ({ to: 'path', path: reverse(route.agentToWorker(helperAt(i))), kind });
/** Helper i's work along the bus to main (through the check in front of it, when there is one). */
export const helperToMain = (s: SceneState, i: number, kind: Kind = 'model'): Move => ({ to: 'path', path: route.workerToMain(helperAt(i), s.project!), kind });
export const all = (...moves: Move[]): Move => ({ to: 'all', moves });

export interface DeskOpts {
  /** The lead's window. */
  lead?: Block[];
  /** Each helper in a worktree of its own. */
  trees?: boolean;
  /** A check in front of main. */
  mgate?: boolean;
  /** Helpers on a second kind of model. */
  mixed?: boolean;
  /** A plan meter beside the agent, with this much left (0 to 1). */
  meter?: number;
  /** Who the agent at the desk is: "the agent" with helpers inside its thread, or "the lead" of threads. */
  who?: 'agent' | 'lead';
  labels?: Label[];
}
/** You, the agent and n helpers behind the bus, as v1's handoff.ts and team.ts draw them. */
export function desk(n: number, o: DeskOpts = {}): SceneState {
  const s = team(n, { lead: o.lead ?? [FIRST], trees: o.trees, mgate: o.mgate, mixed: o.mixed });
  const who = o.who ?? 'agent';
  s.labels = [lab('you', 'you', 'left'), termLabel('a0', who, 'top', `the ${who}`), ...(o.labels ?? [])];
  if (n <= 1) {
    // One helper or none: the agent at full size, as in v1's handoff, and no main branch yet.
    s.agents[0]!.scale = 1;
    if (n === 1) s.agents[1]!.scale = 0.85;
    s.project!.commits = undefined;
    s.tracks = s.tracks!.slice(0, n ? 3 : 1).concat(n ? [[[0, BUS_Y], [helperAt(0)[0], helperAt(0)[1] + 14]]] : []);
  }
  s.project!.files = ['', '', '', '', '', ''];
  if (o.meter != null) {
    s.meters = [{ id: 'm0', at: SPOT.meter, mode: 'plan', level: o.meter }];
    s.labels!.push(termLabel('meter:m0', 'plan', 'left', 'your plan'));
    s.tracks!.push([[SPOT.meter[0] + 14, 0], [-22, 0]]);
  }
  return s;
}
/** Helper i in the state (agents[0] is the agent or lead). */
export const H = (s: SceneState, i: number) => s.agents[i + 1]!;
export const lamp = (s: SceneState, i: number, l: 'off' | 'work' | 'ok' | 'bad' | 'wait') => { H(s, i).lamp = l; H(s, i).busy = l === 'work'; };
export const fillHelper = (s: SceneState, i: number, ...blocks: Block[]) => { (H(s, i).blocks ??= []).push(...blocks); };
/** The point's own annotations (at most two), after the picture's standing labels: glossary terms and "you". */
const STANDING = new Set(['you']);
/** A label that stays on every point of a picture (a job's name), not one of the point's annotations. */
export const stand = (l: Label): Label => { if (l.text) STANDING.add(l.text); return l; };
const standing = (l: Label) => !!l.term || STANDING.has(l.text ?? '');
export const note = (s: SceneState, ...more: Label[]) => { s.labels = [...(s.labels ?? []).filter(standing), ...more]; };
/** A window's worth of reading: the files a search turns up, read whole. */
export const reads = (sizes: number[]): Block[] => sizes.map((h) => b('tool', h));

// ---------- jobs side by side ----------

export const youToJob = (i: number, n: number, gap = 58): XY[] => { const [x] = jobSpot(i, n, gap); return [[0, 94], [0, 70], [x, 52], [x, 24]]; };
export const toJob = (i: number, n: number, kind: Kind = 'you', gap = 58): Move => ({ to: 'path', path: youToJob(i, n, gap), kind });
export const jobToYou = (i: number, n: number, kind: Kind = 'model', gap = 58): Move => ({ to: 'path', path: reverse(youToJob(i, n, gap)), kind });
/** A job's branch along the bus to main, and main back down to a job (bringing it up to date). */
export const jobToMain = (s: SceneState, i: number, n: number, kind: Kind = 'model', gap = 58): Move => {
  const [x] = jobSpot(i, n, gap);
  return { to: 'path', path: [[x, -16], [x, BUS_Y], [s.project!.at[0] - 46, BUS_Y]], kind };
};
export const mainToJob = (s: SceneState, i: number, n: number, kind: Kind = 'tool', gap = 58): Move => ({ to: 'path', path: reverse((jobToMain(s, i, n, kind, gap) as { path: XY[] }).path), kind });

export function sideBySide(n: number, labels: Label[] = [], o: { mgate?: boolean; models?: ('a' | 'b')[] } = {}): SceneState {
  const s = jobs(n, { projects: 'one', mgate: o.mgate, labels: [lab('you', 'you', 'left'), termLabel('main', 'main', 'bottom'), ...labels] });
  s.agents.forEach((a, i) => { a.blocks = [FIRST]; if (o.models?.[i]) a.model = o.models[i]; });
  for (const c of s.tray!.cards) c.mark = undefined;
  return s;
}
export const J = (s: SceneState, i: number) => s.agents[i]!;

/** The Preview at a stage, with the address the bar shows. */
export const app = (id: string, stage: string, url?: string): Preview => ({ app: id, stage, url });

/** The agent (or lead) out to the project along the bus, and back with what it found. */
export const toProject = (s: SceneState, kind: Kind = 'model'): Move => ({ to: 'path', path: [[0, -20], [0, BUS_Y], [s.project!.at[0] - 46, BUS_Y]], kind });
export const fromProject = (s: SceneState, kind: Kind = 'tool'): Move => ({ to: 'path', path: reverse((toProject(s) as { path: XY[] }).path), kind });
export const file = (s: SceneState, i: number, mark: '' | 'read' | 'edit' | 'ok' | 'bad') => { s.project!.files![i] = mark; };
