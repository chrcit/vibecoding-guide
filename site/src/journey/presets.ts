// The standing arrangements of the picture. Chapters start from one of these and change it.
import { SPOT, SLOTS, BUS_Y, type SceneState, type Agent, type Block, type Label, type Project, type XY, type Lamp } from './picture';

export const TOOLS = ['read', 'edit', 'run', 'search'];

export const lab = (at: Label['at'], text: string, place: Label['place'] = 'top', side?: string): Label => ({ at, text, place, side });

export interface SoloOpts {
  tools?: boolean | string[];
  project?: boolean | Partial<Project>;
  gate?: boolean | Lamp;
  blocks?: Block[];
  labels?: Label[];
  focus?: SceneState['focus'];
  zoomMax?: number;
}
/** You and one agent, with whatever it has been given so far. */
export function solo(o: SoloOpts = {}): SceneState {
  const tracks: XY[][] = [[[0, 94], [0, 22]]];
  if (o.tools) tracks.push([[20, 0], [56, 0]]);
  if (o.tools && o.project) tracks.push([[88, 0], [120, 0]]);
  return {
    you: SPOT.you,
    agents: [{ id: 'a0', at: SPOT.agent, blocks: o.blocks ?? [] }],
    tools: o.tools ? { at: SPOT.tools, ids: Array.isArray(o.tools) ? o.tools : TOOLS } : null,
    project: o.project ? { at: SPOT.project, rules: 'none', ...(o.project === true ? {} : o.project) } : null,
    gates: o.gate ? [{ id: 'gate', at: SPOT.gate, axis: 'y', lamp: o.gate === true ? 'off' : o.gate }] : [],
    tracks,
    labels: o.labels ?? [],
    focus: o.focus,
    zoomMax: o.zoomMax,
  };
}

export interface TeamOpts {
  trees?: boolean;
  gate?: boolean;
  mgate?: boolean;
  lead?: Block[];
  project?: Partial<Project>;
  labels?: Label[];
  focus?: SceneState['focus'];
  /** A second kind of model for the workers. */
  mixed?: boolean;
}
/** The agent as a lead with n workers behind the bus. */
export function team(n: number, o: TeamOpts = {}): SceneState {
  const size = n <= 5 ? 0.7 : 0.55;
  const workers: Agent[] = SLOTS.slice(0, n).map((at, i) => ({ id: `w${i}`, at, scale: size, blocks: [], tree: o.trees ? 'own' : false, model: o.mixed ? 'b' : 'a' }));
  const xs = workers.map((w) => w.at[0]);
  const main = SPOT.main;
  const tracks: XY[][] = [[[0, 94], [0, 22]], [[0, -20], [0, BUS_Y]], [[Math.min(0, ...xs), BUS_Y], [main[0] - 46, BUS_Y]]];
  for (const x of new Set(xs)) tracks.push([[x, BUS_Y], [x, Math.min(...workers.filter((w) => w.at[0] === x).map((w) => w.at[1])) + 14]]);
  return {
    you: SPOT.you,
    agents: [{ id: 'a0', at: SPOT.agent, scale: 0.85, blocks: o.lead ?? [] }, ...workers],
    tools: null,
    project: { at: main, rules: 'plain', commits: [], ...o.project },
    gates: [
      ...(o.gate ? [{ id: 'gate', at: SPOT.gate, axis: 'y' as const }] : []),
      ...(o.mgate ? [{ id: 'mgate', at: SPOT.mgate, axis: 'x' as const }] : []),
    ],
    tracks,
    labels: o.labels ?? [],
    focus: o.focus,
  };
}

/** A window after some work, for chapters that start part-way in. */
export const worked = (n: number, rules = false): Block[] => {
  const out: Block[] = rules ? [{ t: 'rules', h: 4 }] : [];
  const pattern: Block[] = [{ t: 'you', h: 2 }, { t: 'model', h: 1.5 }, { t: 'tool', h: 5 }, { t: 'model', h: 1.5 }, { t: 'tool', h: 3 }, { t: 'model', h: 2 }, { t: 'tool', h: 6 }, { t: 'model', h: 2.5 }];
  for (let i = 0; i < n; i++) out.push({ ...pattern[i % pattern.length]! });
  return out;
};
