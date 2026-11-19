// The standing arrangements of the picture. Chapters start from one of these and change it.
import { SPOT, SLOTS, BUS_Y, USERS, jobSpot, type SceneState, type Agent, type Block, type Label, type Project, type XY, type Lamp, type Meter, type Card, type Person, type Zone } from './picture';

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
  /** Part two. What the model draws from: one meter, or one per provider. */
  meter?: Meter['mode'] | Meter[];
  /** A second model beside the gate, as agent `r0`. Needs `gate`. */
  reviewer?: boolean;
  /** The tray beside you, with what stands on it. */
  tray?: Card[];
}
/** You and one agent, with whatever it has been given so far. */
export function solo(o: SoloOpts = {}): SceneState {
  const tracks: XY[][] = [[[0, 94], [0, 22]]];
  if (o.tools) tracks.push([[20, 0], [56, 0]]);
  if (o.tools && o.project) tracks.push([[88, 0], [120, 0]]);
  if (o.meter) tracks.push([[SPOT.meter[0] + 14, 0], [-22, 0]]);
  if (o.reviewer) tracks.push([[-16, SPOT.gate[1]], [SPOT.reviewer[0] + 20, SPOT.gate[1]]]);
  return {
    you: SPOT.you,
    agents: [{ id: 'a0', at: SPOT.agent, blocks: o.blocks ?? [] }, ...(o.reviewer ? [{ id: 'r0', at: SPOT.reviewer, scale: 0.8, blocks: [], model: 'b' as const }] : [])],
    meters: !o.meter ? [] : Array.isArray(o.meter) ? o.meter : [{ id: 'm0', at: SPOT.meter, mode: o.meter, level: o.meter === 'plan' ? 1 : 0 }],
    tray: o.tray ? { at: SPOT.tray, cards: o.tray } : null,
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

// ---------- part two ----------

export interface JobsOpts {
  /** One project that every job pushes to along the bus, or a project of its own behind each job. */
  projects?: 'one' | 'many';
  /** Space between jobs. Default 58; use 84 when each stands on a machine of its own. */
  gap?: number;
  /** Which machine each job runs on, in order. Draws a slab under each. */
  machines?: Zone['kind'][];
  cards?: Card[];
  labels?: Label[];
  focus?: SceneState['focus'];
  mgate?: boolean;
}
/** Several jobs at once: agents `j0`, `j1`, ... in a row, one of you, and a tray with a card per job. */
export function jobs(n: number, o: JobsOpts = {}): SceneState {
  const gap = o.gap ?? 58;
  const spots = Array.from({ length: n }, (_, i) => jobSpot(i, n, gap));
  const one = (o.projects ?? 'one') === 'one';
  const agents: Agent[] = spots.map((at, i) => ({ id: `j${i}`, at, scale: 0.7, blocks: [], tree: one ? 'own' : false }));
  const left = Math.min(0, ...spots.map((s) => s[0]));
  const mainAt: XY = [Math.max(SPOT.main[0], spots[n - 1]![0] + 100), BUS_Y];
  const tracks: XY[][] = one
    ? [[[left, BUS_Y], [mainAt[0] - 46, BUS_Y]], ...spots.map(([x]) => [[x, -16], [x, BUS_Y]] as XY[])]
    : spots.map(([x]) => [[x, -16], [x, -78]] as XY[]);
  return {
    you: SPOT.you,
    agents,
    tools: null,
    project: one ? { at: mainAt, rules: 'plain', commits: [] } : null,
    projects: one ? [] : spots.map(([x], i) => ({ id: `${i}`, at: [x, -98] as XY, scale: 0.5, rules: 'plain' as const })),
    gates: o.mgate && one ? [{ id: 'mgate', at: [mainAt[0] - 84, BUS_Y], axis: 'x' }] : [],
    zones: (o.machines ?? []).slice(0, n).map((kind, i) => ({ id: `${i}`, kind, rect: [spots[i]![0] - 24, -28, Math.min(70, gap - 14), 56] as Zone['rect'] })),
    tray: { at: SPOT.tray, cards: o.cards ?? spots.map((_, i) => ({ id: `j${i}`, mark: 'work' as const })) },
    tracks,
    labels: o.labels ?? [],
    focus: o.focus,
  };
}

export interface ShipOpts extends TeamOpts {
  /** Who stands around main: a colleague at the gate, a client in front of main, users beyond it. */
  people?: ('peer' | 'client' | 'users')[];
}
/** The agent, the bus, a gate and main, with other people around main. */
export function ship(n: number, o: ShipOpts = {}): SceneState {
  const s = team(n, { mgate: true, ...o });
  const who = o.people ?? [];
  const people: Person[] = [];
  if (who.includes('peer')) people.push({ id: 'peer', at: SPOT.peer, who: 'peer' });
  if (who.includes('client')) people.push({ id: 'client', at: SPOT.client, who: 'client' });
  if (who.includes('users')) USERS.forEach((at, i) => people.push({ id: `user${i}`, at, who: 'user', scale: 0.85 }));
  s.people = people;
  return s;
}
