/*
 * The journey's one picture. A scene state goes in; the parts to draw, the labels and the camera
 * come out. Pure: the pages call it at build time for the first frame and the engine (scene.ts)
 * calls it in the browser for every frame after. The concept is in site/JOURNEY.md.
 *
 * The floor plan never changes, so a part keeps its place from the first chapter to the last:
 *
 *   you (0,104) -> gate (0,54) -> the agent (0,0) -> tools (72,0) -> the project (166,0)
 *
 * and once the agent has help, a bus runs along y = -46 behind it, with up to twenty workers on a
 * 5 x 4 grid beyond the bus, and a second gate on the bus in front of the project.
 *
 * Part two widens the same floor. A meter stands beside the model (-64, 0), a reviewer beside the
 * gate (-70, 54), a tray beside you (46, 104) for what comes back and what waits for you, other
 * people stand at the gate in front of main and beyond it, and slabs under the floor mark which
 * machine a station runs on. Several jobs stand in a row along y = 0.
 * Coordinates are world units on the floor: +x runs down to the right, +y down to the left.
 */
import { resolveTerm, type TermId } from './terms';
import type { Level } from '../lib/levels';
import * as k from '../components/fig/kit/iso';

export type XY = [number, number];
export type P3 = k.Point3;

const P: k.Projection = { origin: [0, 0], scale: 1 };
export const flat = (x: number, y: number, z = 0): k.Flat => k.iso([x, y, z], P);

/** What a slab in a window, or a puck on the floor, is made of. */
export type Kind = 'rules' | 'you' | 'model' | 'tool' | 'sum' | 'bad';
export interface Block { t: Kind; h: number }
export type Lamp = 'off' | 'work' | 'ok' | 'bad' | 'wait';

export interface Agent {
  id: string;
  at: XY;
  scale?: number;
  /** The window's contents, oldest first. Heights are in the same unit as `cap`. */
  blocks?: Block[];
  /** How much the window holds. Default 60. */
  cap?: number;
  busy?: boolean;
  /** The model is reading the whole window: the slabs flash in turn. */
  scan?: boolean;
  lamp?: Lamp;
  /** A copy of the project of its own, beside it. `bad` marks a clash. */
  tree?: 'own' | 'bad' | false;
  /** Which model sits on top: only a tone, so two kinds can be told apart. */
  model?: 'a' | 'b';
  /** Its machine is asleep: drawn faint. */
  off?: boolean;
}
export type FileMark = '' | 'read' | 'edit' | 'bad' | 'ok';
export interface Project {
  at: XY;
  files?: FileMark[];
  /** The instructions file: absent, there, or being read right now. */
  rules?: 'none' | 'plain' | 'lit';
  skills?: number;
  /** A skill that has been taken off the shelf. */
  skillOut?: number;
  /** What has landed on the main branch, oldest first. */
  commits?: ('ok' | 'bad')[];
  /** How much has been built on each file tile, in layers. The project grows upwards. */
  stacks?: number[];
  /** Layers on each tile that nothing uses any more: copies, dead code. */
  junk?: number[];
}
/** What you pay with. A plan is an allowance that drains and refills; the API is a bill that grows. */
export interface Meter {
  id: string;
  at: XY;
  mode: 'plan' | 'api';
  /** plan: how much of the allowance is left, 0 to 1. api: coins spent so far. */
  level: number;
  lamp?: Lamp;
}
/** Something standing on the tray beside you: a piece of proof, a question, a plan, a job. */
export interface Card {
  id: string;
  /** Its colour, by what it is made of. Default 'model'. */
  b?: Kind;
  mark?: 'new' | 'ok' | 'bad' | 'wait' | 'work';
  /** A card that fills as the work goes on (a progress file): how far it has got, 0 to 1. */
  fill?: number;
}
/** `gap`: space between cards, default 9. Wider when each card carries a label. */
export interface Tray { at: XY; cards: Card[]; gap?: number }
export interface Person { id: string; at: XY; who?: 'peer' | 'client' | 'user'; scale?: number }
/** The machine a part of the floor runs on. `off` is a closed lid. */
export interface Zone { id: string; rect: [x: number, y: number, w: number, d: number]; kind: 'laptop' | 'box' | 'cloud'; off?: boolean }
export interface Tools { at: XY; ids: string[]; on?: string | null; off?: string[] }
export interface Gate { id: string; at: XY; axis: 'x' | 'y'; lamp?: Lamp }
export interface Label {
  /** An anchor name ("you", "a0", "tank:a0", "tools", "tool:run", "project", "rules", "skills", "main", a gate id,
   *  "meter:<id>", "tray", "card:<id>", a person id, "zone:<id>", "p:<id>") or a world point. */
  at: string | P3;
  /** The words on the label. May be left out when `term` is set. */
  text?: string;
  place?: 'top' | 'left' | 'right' | 'bottom';
  /** A site path to open in the side view. */
  side?: string;
  /** One sentence shown on hover and focus, and read by screen readers. Set by `term`. */
  def?: string;
  /** A glossary term (terms.ts). The picture fills in the word for the reader's level, the wiki
   *  link and the definition; `text` then replaces the plain word only ("its window"). */
  term?: TermId;
}
export interface SceneState {
  you?: XY | null;
  agents: Agent[];
  tools?: Tools | null;
  project?: Project | null;
  gates?: Gate[];
  meters?: Meter[];
  tray?: Tray | null;
  people?: Person[];
  zones?: Zone[];
  /** More projects than one, for work in several at once. Keys are `p:<id>`. */
  projects?: (Project & { id: string; scale?: number })[];
  /** Pucks standing still on the floor: work waiting its turn. Keys are `rest:<id>`. */
  rest?: { id: string; at: XY; b: Kind }[];
  /** Grooves on the floor, as polylines. */
  tracks?: XY[][];
  labels?: Label[];
  /** What the camera frames: entity keys or world points. Default: everything. */
  focus?: (string | P3)[];
  zoomMax?: number;
}

// ---------- the floor plan ----------

export const CAP = 60;
export const BUS_Y = -46;
export const SPOT = {
  you: [0, 104] as XY,
  gate: [0, 54] as XY,
  agent: [0, 0] as XY,
  tools: [72, 0] as XY,
  project: [166, 0] as XY,
  mgate: [124, BUS_Y] as XY,
  main: [208, BUS_Y] as XY,
  meter: [-64, 0] as XY,
  reviewer: [-70, 54] as XY,
  tray: [46, 104] as XY,
  /** A colleague, at the gate in front of main. */
  peer: [124, -10] as XY,
  /** A client, in front of main. */
  client: [208, 28] as XY,
};
/** Where users stand, beyond main. */
export const USERS: XY[] = [[288, -68], [300, -46], [288, -24]];
/** Where job i of n stands when several run at once, and where you stand to attend to it. */
export const jobSpot = (i: number, n: number, gap = 58): XY => [(i - (n - 1) / 2) * gap, 0];
export const attendSpot = (i: number, n: number, gap = 58): XY => [(i - (n - 1) / 2) * gap, 58];
export const cardSpot = (tray: Tray, id: string): XY => {
  const i = Math.max(0, tray.cards.findIndex((c) => c.id === id));
  return [tray.at[0] + (i - (tray.cards.length - 1) / 2) * (tray.gap ?? 9), tray.at[1]];
};
/** Worker slot i (0..4) across, j (0..3) back. */
export const slot = (i: number, j: number): XY => [-88 + 44 * i, -98 - 52 * j];
/** The order twenty workers are added in: the row nearest the bus first, from the middle out. */
export const SLOTS: XY[] = [0, 1, 2, 3].flatMap((j) => [2, 1, 3, 0, 4].map((i) => slot(i, j)));

export const toolSpot = (tools: Tools, id: string): XY => {
  const i = Math.max(0, tools.ids.indexOf(id));
  return [tools.at[0], tools.at[1] + (i - (tools.ids.length - 1) / 2) * 15];
};
const FILE_AT: XY[] = [[-26, -21], [-2, -21], [22, -21], [-26, -3], [-2, -3], [22, -3]];
export const fileSpot = (project: Project, i: number): XY => {
  const [x, y] = FILE_AT[i % FILE_AT.length]!;
  return [project.at[0] + x, project.at[1] + y];
};
export const rulesSpot = (project: Project): XY => [project.at[0] - 24, project.at[1] + 19];

/** Routes a puck can take, as polylines on the floor. */
export const route = {
  youToAgent: (): XY[] => [[0, 94], [0, 22]],
  agentToTool: (tools: Tools, id: string): XY[] => [[20, 0], [tools.at[0] - 16, 0], toolSpot(tools, id)],
  toolToFile: (tools: Tools, id: string, project: Project, file: number): XY[] => [toolSpot(tools, id), [tools.at[0] + 16, 0], [project.at[0] - 46, 0], fileSpot(project, file)],
  agentToRules: (project: Project): XY[] => [[20, 0], [project.at[0] - 46, 0], rulesSpot(project)],
  agentToWorker: (at: XY): XY[] => [[0, -20], [0, BUS_Y], [at[0], BUS_Y], [at[0], at[1] + 14]],
  workerToMain: (at: XY, project: Project): XY[] => [[at[0], at[1] + 14], [at[0], BUS_Y], [project.at[0] - 46, BUS_Y]],
  /** From the agent down to the gate, and from the gate on to you. */
  agentToGate: (): XY[] => [[0, 22], [0, SPOT.gate[1] - 10]],
  gateToYou: (): XY[] => [[0, SPOT.gate[1] + 10], [0, 94]],
  /** From the gate sideways to the reviewer standing beside it. */
  gateToReviewer: (): XY[] => [[0, SPOT.gate[1]], [SPOT.reviewer[0] + 20, SPOT.gate[1]]],
  meterToAgent: (): XY[] => [[SPOT.meter[0] + 14, 0], [-22, 0]],
  /** From the agent to the tray beside you: what comes back as proof, or a question. */
  agentToTray: (tray: Tray): XY[] => [[14, 18], [tray.at[0], 40], [tray.at[0], tray.at[1] - 14]],
  /** From the agent along the bus to the gate in front of main, and through it. */
  agentToMgate: (): XY[] => [[0, -20], [0, BUS_Y], [SPOT.mgate[0] - 12, BUS_Y]],
  mgateToMain: (project: Project): XY[] => [[SPOT.mgate[0] + 12, BUS_Y], [project.at[0] - 46, BUS_Y]],
  /** What people beyond main send back to you. */
  backToYou: (from: XY): XY[] => [[from[0], from[1]], [from[0], 40], [30, 40], [30, 104], [12, 104]],
};
const back = (pts: XY[]) => [...pts].reverse();
export const reverse = back;

// ---------- parts, drawn around their own origin ----------

const S = k.solid;
const BASE: k.Plan = { x: -22, y: -22, w: 44, d: 44, r: 7 };
const TANK: k.Plan = { x: -14, y: -14, w: 28, d: 28, r: 4 };
const SLAB: k.Plan = { x: -12, y: -12, w: 24, d: 24, r: 2.5 };
const HEAD: k.Plan = { x: -16.5, y: -16.5, w: 33, d: 33, r: 5.5 };
const TZ = 4, TH = 62, HEAD_H = 7;
const TREE: k.Plan = { x: 27, y: -13, w: 22, d: 26, r: 4 };

const memo = new Map<string, string>();
const once = (key: string, make: () => string) => memo.get(key) ?? (memo.set(key, make()), memo.get(key)!);

function stackMarkup(blocks: Block[], cap: number, freshFrom: number) {
  const total = blocks.reduce((a, b) => a + b.h, 0);
  const f = (CAP / cap) * (total > cap ? cap / total : 1);
  let z = 0;
  let out = '';
  blocks.forEach((b, i) => {
    const h = Math.max(1.3, b.h * f);
    out += S(k.box(SLAB, TZ + 0.4 + z, h - 0.5, P), { crease: false, 'data-b': b.t, 'data-fresh': i >= freshFrom ? '' : undefined, style: `--i:${i}` });
    z += h;
  });
  return out;
}

function agentMarkup(a: Agent, freshFrom: number) {
  const glass = once('glass', () => JSON.stringify(k.glass(TANK, TZ, TH, P)));
  const g = JSON.parse(glass) as ReturnType<typeof k.glass>;
  const under = once('agent-under', () => k.halo(BASE, 0, P) + S(k.box(BASE, 0, TZ, P), { tone: 'base' }) + `<path class="k-glass-back" d="${g.back}"/>`);
  const over = once('agent-over', () =>
    `<path class="k-glass-front" d="${g.front}"/><path class="k-glass-edges" d="${g.edges}"/>` +
    S(k.box(HEAD, TZ + TH, HEAD_H, P), { 'data-part': 'head' }) +
    k.flat(k.ringLine(0, 0, 6.5, TZ + TH + HEAD_H + 0.05, P), 'inlay', { 'data-part': 'lens' }) +
    S(k.cylinder(16, 16, 3.4, TZ, 2.6, P, 14), { 'data-part': 'lamp', crease: false }));
  const tree = a.tree
    ? once('tree', () => S(k.box(TREE, 0, 2.6, P), { tone: 'base' }) +
        S(k.box({ x: 31, y: -9, w: 14, d: 7, r: 1.5 }, 2.6, 1.6, P), { 'data-part': 'leaf', crease: false }) +
        S(k.box({ x: 31, y: 1, w: 14, d: 7, r: 1.5 }, 2.6, 1.6, P), { 'data-part': 'leaf', crease: false }))
    : '';
  return tree + under + stackMarkup(a.blocks ?? [], a.cap ?? CAP, freshFrom) + over;
}

const youMarkup = () => once('you', () =>
  k.halo({ x: -9, y: -9, w: 18, d: 18, r: 9 }, 0, P) +
  S(k.cylinder(0, 0, 8.5, 0, 3, P), { tone: 'base' }) +
  S(k.cylinder(0, 0, 5, 3, 13, P), { 'data-part': 'body' }) +
  S(k.cylinder(0, 0, 4.4, 17.5, 6.5, P), { 'data-part': 'body' }));

function toolsMarkup(t: Tools) {
  const n = t.ids.length;
  const span = n * 15 + 6;
  let out = S(k.box({ x: -10, y: -span / 2, w: 20, d: span, r: 6 }, 0, 3, P), { tone: 'base' });
  t.ids.forEach((id, i) => {
    const y = (i - (n - 1) / 2) * 15;
    out += S(k.box({ x: -5.5, y: y - 5.5, w: 11, d: 11, r: 2.5 }, 3, 10, P), {
      tone: t.on === id ? 'lit' : 'part', 'data-tool': id, 'data-off': t.off?.includes(id) ? '' : undefined,
    });
  });
  return out;
}

const PLATE: k.Plan = { x: -44, y: -36, w: 88, d: 72, r: 9 };
function projectMarkup(p: Project) {
  let out = k.halo(PLATE, 0, P) + S(k.box(PLATE, 0, 3, P), { tone: 'base' });
  const files = p.files ?? ['', '', '', '', '', ''];
  FILE_AT.forEach(([x, y], i) => {
    const mark = files[i] ?? '';
    const built = (p.stacks?.[i] ?? 0) * 1.7;
    const h = (mark === 'edit' || mark === 'bad' ? 3 : 1.8) + built;
    out += S(k.box({ x: x - 10, y: y - 7, w: 20, d: 14, r: 2 }, 3, h, P), { crease: false, 'data-file': mark || undefined, tone: mark === 'edit' ? 'lit' : 'part' });
    for (let j = 0; j < (p.junk?.[i] ?? 0); j++) {
      out += S(k.box({ x: x - 9 + (j % 2) * 2.5, y: y - 6, w: 15.5, d: 12, r: 2 }, 3 + h + j * 1.9, 1.7, P), { crease: false, 'data-b': 'sum' });
    }
  });
  if (p.rules && p.rules !== 'none') {
    out += S(k.box({ x: -36, y: 10, w: 24, d: 18, r: 3 }, 3, p.rules === 'lit' ? 6 : 3.2, P), { crease: false, 'data-b': 'rules', 'data-lit': p.rules === 'lit' ? '' : undefined });
  }
  for (let i = 0; i < (p.skills ?? 0); i++) {
    if (i === p.skillOut) continue;
    out += S(k.box({ x: -2 + i * 8, y: 10, w: 4, d: 18, r: 1 }, 3, 12, P), { crease: false, 'data-b': 'rules' });
  }
  (p.commits ?? []).slice(-10).forEach((c, i) => {
    out += S(k.cylinder(-34 + i * 8, 31, 3, 3, 2, P, 12), { crease: false, 'data-commit': c });
  });
  return out;
}

function gateMarkup(g: Gate) {
  const sw = (pl: k.Plan): k.Plan => (g.axis === 'y' ? pl : { x: pl.y, y: pl.x, w: pl.d, d: pl.w, r: pl.r });
  return S(k.box(sw({ x: -15.5, y: -2.5, w: 5, d: 5, r: 1 }), 0, 24, P)) +
    S(k.box(sw({ x: 10.5, y: -2.5, w: 5, d: 5, r: 1 }), 0, 24, P)) +
    S(k.box(sw({ x: -16.5, y: -3, w: 33, d: 6, r: 2 }), 24, 5, P)) +
    S(k.box(sw({ x: -6, y: -3, w: 12, d: 6, r: 2 }), 29, 2.4, P), { 'data-part': 'lamp', crease: false });
}

const METER_BASE: k.Plan = { x: -13, y: -13, w: 26, d: 26, r: 6 };
const METER_TANK: k.Plan = { x: -8, y: -8, w: 16, d: 16, r: 3 };
const METER_H = 34;
function meterMarkup(m: Meter) {
  let out = k.halo(METER_BASE, 0, P) + S(k.box(METER_BASE, 0, 3, P), { tone: 'base' });
  if (m.mode === 'plan') {
    const g = k.glass(METER_TANK, 3, METER_H, P);
    const left = Math.max(0, Math.min(1, m.level));
    out += `<path class="k-glass-back" d="${g.back}"/>`;
    if (left > 0.01) out += S(k.box({ x: -6.5, y: -6.5, w: 13, d: 13, r: 2 }, 3.3, (METER_H - 1) * left, P), { crease: false, 'data-part': 'allowance' });
    out += `<path class="k-glass-front" d="${g.front}"/><path class="k-glass-edges" d="${g.edges}"/>`;
  } else {
    const coins = Math.min(40, Math.round(m.level));
    for (let i = 0; i < coins; i++) out += S(k.cylinder(i % 2 ? 0.8 : -0.8, 0, 6.5, 3 + i * 1.5, 1.3, P, 14), { crease: false, 'data-part': 'coin' });
  }
  return out + S(k.cylinder(10.5, 10.5, 2.4, 3, 2, P, 12), { 'data-part': 'lamp', crease: false });
}

function trayMarkup(t: Tray) {
  const gap = t.gap ?? 9;
  const w = Math.max(40, t.cards.length * gap + 12);
  let out = S(k.box({ x: -w / 2, y: -11, w, d: 22, r: 5 }, 0, 2.2, P), { tone: 'base' });
  t.cards.forEach((c, i) => {
    const x = (i - (t.cards.length - 1) / 2) * gap;
    const h = c.fill !== undefined ? 1.5 + 13.5 * Math.max(0, Math.min(1, c.fill)) : c.mark === 'new' ? 15 : 12.5;
    out += S(k.box({ x: x - 2.2, y: -8, w: 4.4, d: 16, r: 1 }, 2.2, h, P), { crease: false, 'data-b': c.b ?? 'model', 'data-card': c.mark ?? '-', 'data-lit': c.mark === 'new' || c.mark === 'wait' ? '' : undefined });
  });
  return out;
}

const personMarkup = (who: string) => once('person:' + who, () =>
  S(k.cylinder(0, 0, 7.5, 0, 2.6, P), { tone: 'base' }) +
  S(k.cylinder(0, 0, 4.4, 2.6, 11.5, P), { 'data-part': 'body', 'data-who': who }) +
  S(k.cylinder(0, 0, 3.9, 15.4, 5.8, P), { 'data-part': 'body', 'data-who': who }));

function zoneMarkup(z: Zone) {
  const [x, y, w, d] = z.rect;
  const plan: k.Plan = { x, y, w, d, r: 12 };
  if (z.kind === 'cloud') return k.halo({ x: x + 6, y: y + 6, w, d, r: 12 }, -16, P) + S(k.box(plan, -3.4, 3, P), { crease: false, 'data-zone': z.kind });
  return S(k.box(plan, z.kind === 'laptop' ? -5.4 : -10.4, z.kind === 'laptop' ? 5 : 10, P), { crease: false, 'data-zone': z.kind });
}

export const puckMarkup = (kind: Kind) => S(k.cylinder(0, 0, 4, 0.6, 2.6, P, 16), { crease: false, 'data-b': kind });

// ---------- the picture ----------

export interface Ent {
  key: string;
  /** Paint order, back to front. Fixed for the life of a key. */
  order: number;
  /** A signature of the markup: the engine redraws a part only when this changes. */
  sig: string;
  html: () => string;
  x: number; y: number; scale: number;
  attrs: Record<string, string>;
}
export interface PlacedLabel { key: string; text: string; x: number; y: number; place: 'top' | 'left' | 'right' | 'bottom'; side?: string; def?: string }
export interface Camera { s: number; tx: number; ty: number }
export interface Picture { ents: Ent[]; labels: PlacedLabel[]; cam: Camera; kinds: Kind[] }

const depth = ([x, y]: XY) => x + y;
const blockSig = (blocks?: Block[]) => (blocks ?? []).map((b) => b.t[0] + b.h.toFixed(1)).join('');

function anchorOf(s: SceneState, name: string): P3 | null {
  const [what, id] = name.split(':') as [string, string | undefined];
  const agent = (aid: string) => s.agents.find((a) => a.id === aid);
  if (what === 'you' && s.you) return [s.you[0], s.you[1], 27];
  if (what === 'tank' && id) { const a = agent(id); return a ? [a.at[0] - 14 * (a.scale ?? 1), a.at[1] + 14 * (a.scale ?? 1), 34 * (a.scale ?? 1)] : null; }
  if (what === 'tools' && s.tools) return [s.tools.at[0], s.tools.at[1] - (s.tools.ids.length * 15) / 2, 15];
  if (what === 'tool' && id && s.tools) { const [x, y] = toolSpot(s.tools, id); return [x, y, 15]; }
  if (s.project) {
    const [x, y] = s.project.at;
    if (what === 'project') return [x - 40, y - 32, 5];
    if (what === 'rules') return [x - 36, y + 28, 3];
    if (what === 'skills') return [x + 30, y + 28, 3];
    if (what === 'main') return [x + 10, y + 36, 3];
  }
  const gate = s.gates?.find((g) => g.id === what);
  if (gate) return [gate.at[0], gate.at[1], 34];
  if (what === 'meter') { const m = s.meters?.find((x) => x.id === id) ?? s.meters?.[0]; return m ? [m.at[0], m.at[1], m.mode === 'plan' ? METER_H + 6 : 8 + Math.min(40, m.level) * 1.5] : null; }
  if (what === 'tray' && s.tray) return [s.tray.at[0], s.tray.at[1] + 13, 2];
  if (what === 'card' && id && s.tray) { const [x, y] = cardSpot(s.tray, id); return [x, y, 18]; }
  if (what === 'zone' && id) { const z = s.zones?.find((x) => x.id === id); return z ? [z.rect[0] + 10, z.rect[1] + z.rect[3], 0] : null; }
  if (what === 'p' && id) { const p = s.projects?.find((x) => x.id === id); return p ? [p.at[0] - 40 * (p.scale ?? 1), p.at[1] - 32 * (p.scale ?? 1), 5] : null; }
  const person = s.people?.find((x) => x.id === name);
  if (person) return [person.at[0], person.at[1], 24 * (person.scale ?? 1)];
  if (what === 'gear' && id) return gearAnchor(s, id);
  const a = agent(name);
  if (a) return [a.at[0], a.at[1], (TZ + TH + HEAD_H + 3) * (a.scale ?? 1)];
  return null;
}

/** Corner points of a part, for the camera. */
function extent(s: SceneState, key: string): P3[] {
  const boxPts = ([x, y]: XY, rx: number, ry: number, h: number): P3[] => [
    [x - rx, y - ry, 0], [x + rx, y - ry, 0], [x - rx, y + ry, 0], [x + rx, y + ry, 0], [x - rx, y - ry, h], [x + rx, y + ry, h], [x - rx, y + ry, h], [x + rx, y - ry, h],
  ];
  if (key === 'you' && s.you) return boxPts(s.you, 9, 9, 26);
  if (key === 'tools' && s.tools) return boxPts(s.tools.at, 10, s.tools.ids.length * 7.5 + 3, 14);
  if (key === 'project' && s.project) return boxPts(s.project.at, 44, 36, 14);
  const gate = s.gates?.find((g) => g.id === key);
  if (gate) return boxPts(gate.at, 17, 17, 32);
  const [what, id] = key.split(':') as [string, string | undefined];
  if (what === 'meter') { const m = s.meters?.find((x) => x.id === id); if (m) return boxPts(m.at, 13, 13, METER_H + 6); }
  if (key === 'tray' && s.tray) return boxPts(s.tray.at, Math.max(20, s.tray.cards.length * (s.tray.gap ?? 9) / 2 + 6), 11, 18);
  if (what === 'zone') { const z = s.zones?.find((x) => x.id === id); if (z) { const [x, y, w, d] = z.rect; return [[x, y, 0], [x + w, y, 0], [x, y + d, -8], [x + w, y + d, -8]]; } }
  if (what === 'p') { const p = s.projects?.find((x) => x.id === id); if (p) return boxPts(p.at, 44 * (p.scale ?? 1), 36 * (p.scale ?? 1), 14); }
  const person = s.people?.find((x) => x.id === key);
  if (person) return boxPts(person.at, 8, 8, 24);
  if (what === 'gear') { const g = s.gear?.find((x) => x.id === id); if (g) return boxPts(g.at, 15 * (g.scale ?? 1), 13 * (g.scale ?? 1), GEAR_H[g.kind] * (g.scale ?? 1)); }
  const a = s.agents.find((x) => x.id === key);
  if (a) { const m = a.scale ?? 1; return boxPts([a.at[0] + (a.tree ? 12 * m : 0), a.at[1]], (a.tree ? 36 : 22) * m, 22 * m, (TZ + TH + HEAD_H + 2) * m); }
  return [];
}

export interface Frame { w: number; h: number; /** The reader's level, for labels that name a term. Default plain. */ level?: Level }

/**
 * Turn a scene state into parts, labels and a camera for a drawing of the given size. `prev` is
 * the state drawn before, so slabs that are new can drop in.
 */
export function picture(s: SceneState, frame: Frame, prev?: SceneState): Picture {
  const ents: Ent[] = [];
  const at = ([x, y]: XY) => flat(x, y);
  const kinds = new Set<Kind>();

  if (s.tracks?.length) {
    const d = s.tracks.map((t) => k.onPlane(t, 0.1, P)).join('');
    ents.push({ key: 'tracks', order: 0, sig: d, html: () => `<path class="j-track" d="${d}"/>`, x: 0, y: 0, scale: 1, attrs: {} });
  }
  for (const z of s.zones ?? []) {
    ents.push({ key: 'zone:' + z.id, order: -10 + depth([z.rect[0], z.rect[1]]) / 1000, sig: JSON.stringify([z.rect, z.kind]), html: () => zoneMarkup(z), x: 0, y: 0, scale: 1, attrs: { 'data-asleep': z.off ? '' : '-' } });
  }
  const projSig = (p: Project) => JSON.stringify([p.files, p.rules, p.skills, p.skillOut, p.commits?.slice(-10), p.stacks, p.junk]);
  if (s.project) {
    const p = s.project;
    const [x, y] = at(p.at);
    ents.push({ key: 'project', order: 10, sig: projSig(p), html: () => projectMarkup(p), x, y, scale: 1, attrs: {} });
    if (p.rules && p.rules !== 'none') kinds.add('rules');
  }
  for (const p of s.projects ?? []) {
    const [x, y] = at(p.at);
    ents.push({ key: 'p:' + p.id, order: 10 + (depth(p.at) + 600) / 1000, sig: projSig(p), html: () => projectMarkup(p), x, y, scale: p.scale ?? 1, attrs: {} });
  }
  for (const m of s.meters ?? []) {
    const [x, y] = at(m.at);
    ents.push({ key: 'meter:' + m.id, order: 100 + Math.round(depth(m.at) + 400) / 10, sig: m.mode + (m.mode === 'plan' ? m.level.toFixed(3) : Math.round(m.level)), html: () => meterMarkup(m), x, y, scale: 1, attrs: { 'data-lamp': m.lamp ?? 'off', 'data-mode': m.mode } });
  }
  for (const r of s.rest ?? []) {
    const [x, y] = at(r.at);
    kinds.add(r.b);
    ents.push({ key: 'rest:' + r.id, order: 100 + Math.round(depth(r.at) + 400) / 10 + 0.05, sig: r.b, html: () => puckMarkup(r.b), x, y, scale: 1, attrs: {} });
  }
  if (s.tools) {
    const t = s.tools;
    const [x, y] = at(t.at);
    ents.push({ key: 'tools', order: 20, sig: JSON.stringify([t.ids, t.on, t.off]), html: () => toolsMarkup(t), x, y, scale: 1, attrs: {} });
  }
  for (const a of s.agents) {
    const [x, y] = at(a.at);
    const before = prev?.agents.find((b) => b.id === a.id);
    const freshFrom = before ? (before.blocks ?? []).length : Infinity;
    const lead = a.id === 'a0';
    for (const b of a.blocks ?? []) kinds.add(b.t);
    ents.push({
      key: a.id,
      order: lead ? 500 : 100 + Math.round(depth(a.at) + 400) / 10,
      sig: blockSig(a.blocks) + '|' + (a.cap ?? CAP) + '|' + (a.tree ? 1 : 0),
      html: () => agentMarkup(a, freshFrom),
      x, y, scale: a.scale ?? 1,
      attrs: { 'data-busy': a.busy ? '' : '-', 'data-lamp': a.lamp ?? 'off', 'data-model': a.model ?? 'a', 'data-tree': a.tree || '-', 'data-scan': a.scan ? '' : '-', 'data-asleep': a.off ? '' : '-' },
    });
  }
  for (const g of s.gates ?? []) {
    const [x, y] = at(g.at);
    ents.push({ key: g.id, order: 520 + depth(g.at) / 100, sig: g.axis, html: () => gateMarkup(g), x, y, scale: 1, attrs: { 'data-lamp': g.lamp ?? 'off' } });
  }
  for (const person of s.people ?? []) {
    const [x, y] = at(person.at);
    const who = person.who ?? 'peer';
    ents.push({ key: person.id, order: 560 + depth(person.at) / 100, sig: who, html: () => personMarkup(who), x, y, scale: person.scale ?? 1, attrs: {} });
  }
  for (const g of s.gear ?? []) ents.push(gearEnt(g));
  if (s.you) {
    const [x, y] = at(s.you);
    ents.push({ key: 'you', order: 600, sig: 'you', html: youMarkup, x, y, scale: 1, attrs: {} });
  }
  if (s.tray) {
    const t = s.tray;
    const [x, y] = at(t.at);
    ents.push({ key: 'tray', order: 610, sig: JSON.stringify(t.cards), html: () => trayMarkup(t), x, y, scale: 1, attrs: {} });
    for (const c of t.cards) kinds.add(c.b ?? 'model');
  }

  // Camera: fit what is in focus, leaving room for labels.
  const focus = s.focus ?? ents.filter((e) => e.key !== 'tracks').map((e) => e.key);
  const pts = focus.flatMap((f) => (typeof f === 'string' ? extent(s, f) : [f])).map((p) => k.iso(p, P));
  const cam: Camera = { s: 1, tx: frame.w / 2, ty: frame.h / 2 };
  if (pts.length) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const [l, r, t, b] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const padX = Math.min(90, frame.w * 0.11), padTop = 64, padBottom = 44;
    cam.s = Math.min((frame.w - padX * 2) / Math.max(1, r - l), (frame.h - padTop - padBottom) / Math.max(1, b - t), s.zoomMax ?? 5);
    cam.tx = frame.w / 2 - ((l + r) / 2) * cam.s;
    cam.ty = padTop + (frame.h - padTop - padBottom) / 2 - ((t + b) / 2) * cam.s;
  }

  const labels: PlacedLabel[] = [];
  for (const lab of s.labels ?? []) {
    const p = typeof lab.at === 'string' ? anchorOf(s, lab.at) : lab.at;
    if (!p) continue;
    const [x, y] = k.iso(p, P);
    const t = lab.term ? resolveTerm(lab.term, frame.level ?? 'plain', lab.text) : lab;
    labels.push({
      key: (typeof lab.at === 'string' ? lab.at : lab.at.join(',')) + '|' + (t.side ? 'a' : 's'),
      text: t.text ?? '', place: lab.place ?? 'top', side: t.side, def: t.def,
      x: x * cam.s + cam.tx, y: y * cam.s + cam.ty,
    });
  }
  return { ents, labels, cam, kinds: [...kinds] };
}

/** The first frame as an SVG string, for the page before its script runs. */
export function poster(s: SceneState, frame: Frame = { w: 800, h: 600 }): string {
  const pic = picture(s, frame);
  const body = [...pic.ents].sort((a, b) => a.order - b.order).map((e) =>
    `<g class="j-ent" data-key="${e.key}"${Object.entries(e.attrs).map(([n, v]) => ` ${n}="${v}"`).join('')} style="transform:translate(${e.x.toFixed(1)}px,${e.y.toFixed(1)}px) scale(${e.scale})">${e.html()}</g>`).join('');
  return `<svg class="j-svg" viewBox="0 0 ${frame.w} ${frame.h}" aria-hidden="true" focusable="false"><g class="j-cam" style="transform:translate(${pic.cam.tx.toFixed(1)}px,${pic.cam.ty.toFixed(1)}px) scale(${pic.cam.s.toFixed(3)})">${body}</g></svg>`;
}

// ---------- part one: the machines you work on and the machines that serve ----------

/**
 * A device drawn on the floor: the laptop, desktop PC or phone you work from, or a server and a
 * database that a site runs on. Keys are `gear:<id>`; a label anchors to `gear:<id>`.
 * `off` draws it faint (a closed lid, a lost laptop); `lamp` lights its small lamp.
 */
export interface Gear { id: string; at: XY; kind: 'laptop' | 'desktop' | 'phone' | 'server' | 'db'; scale?: number; off?: boolean; lamp?: Lamp }
export interface SceneState {
  /** Part one: devices and servers on the floor. */
  gear?: Gear[];
}
const GEAR_H: Record<Gear['kind'], number> = { laptop: 16, desktop: 24, phone: 15, server: 28, db: 18 };

function gearMarkup(g: Gear) {
  return once('gear:' + g.kind, () => {
    const lamp = (x: number, y: number, z: number) => S(k.cylinder(x, y, 1.8, z, 1.6, P, 12), { 'data-part': 'lamp', crease: false });
    switch (g.kind) {
      case 'laptop':
        return k.halo({ x: -13, y: -10, w: 26, d: 20, r: 3 }, 0, P) +
          S(k.box({ x: -12, y: -9, w: 24, d: 18, r: 2 }, 0, 1.6, P), { tone: 'base' }) +
          S(k.box({ x: -12, y: -10.4, w: 24, d: 1.4, r: 0.6 }, 1.6, 15, P), { 'data-part': 'screen', crease: false }) +
          lamp(9, 6, 1.6);
      case 'desktop':
        return k.halo({ x: -15, y: -10, w: 40, d: 22, r: 3 }, 0, P) +
          S(k.cylinder(0, -6.5, 2.2, 0, 5, P, 12), { tone: 'base', crease: false }) +
          S(k.box({ x: -14, y: -8, w: 28, d: 1.6, r: 0.6 }, 5, 17, P), { 'data-part': 'screen', crease: false }) +
          S(k.box({ x: -10, y: 2, w: 20, d: 6, r: 1 }, 0, 1.2, P), { tone: 'base', crease: false }) +
          S(k.box({ x: 17, y: -9, w: 8, d: 17, r: 1.2 }, 0, 22, P)) +
          lamp(21, 6, 22);
      case 'phone':
        return k.halo({ x: -5, y: -3, w: 10, d: 6, r: 2 }, 0, P) +
          S(k.box({ x: -4, y: -1, w: 8, d: 1.4, r: 0.7 }, 0, 14, P), { 'data-part': 'screen', crease: false });
      case 'server':
        return k.halo({ x: -11, y: -11, w: 22, d: 22, r: 3 }, 0, P) +
          S(k.box({ x: -10, y: -10, w: 20, d: 20, r: 2 }, 0, 9, P)) +
          S(k.box({ x: -10, y: -10, w: 20, d: 20, r: 2 }, 9.4, 9, P)) +
          S(k.box({ x: -10, y: -10, w: 20, d: 20, r: 2 }, 18.8, 9, P)) +
          lamp(7, 10.4, 25);
      case 'db':
        return k.halo({ x: -10, y: -10, w: 20, d: 20, r: 10 }, 0, P) +
          [0, 6, 12].map((z) => S(k.cylinder(0, 0, 9, z, 5.4, P, 24), { crease: false, 'data-part': 'disc' })).join('') +
          lamp(7, 6, 15);
    }
  });
}
function gearEnt(g: Gear): Ent {
  const [x, y] = flat(g.at[0], g.at[1]);
  return { key: 'gear:' + g.id, order: 590 + depth(g.at) / 100, sig: g.kind, html: () => gearMarkup(g), x, y, scale: g.scale ?? 1, attrs: { 'data-asleep': g.off ? '' : '-', 'data-lamp': g.lamp ?? 'off', 'data-gear': g.kind } };
}
function gearAnchor(s: SceneState, id: string): P3 | null {
  const g = s.gear?.find((x) => x.id === id);
  return g ? [g.at[0], g.at[1], (GEAR_H[g.kind] + 3) * (g.scale ?? 1)] : null;
}
