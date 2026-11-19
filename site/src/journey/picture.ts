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
 * Coordinates are world units on the floor: +x runs down to the right, +y down to the left.
 */
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
}
export interface Tools { at: XY; ids: string[]; on?: string | null; off?: string[] }
export interface Gate { id: string; at: XY; axis: 'x' | 'y'; lamp?: Lamp }
export interface Label {
  /** An anchor name ("you", "a0", "tank:a0", "tools", "tool:run", "project", "rules", "skills", "main", a gate id) or a world point. */
  at: string | P3;
  text: string;
  place?: 'top' | 'left' | 'right' | 'bottom';
  /** A site path to open in the side view. */
  side?: string;
}
export interface SceneState {
  you?: XY | null;
  agents: Agent[];
  tools?: Tools | null;
  project?: Project | null;
  gates?: Gate[];
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
    out += S(k.box({ x: x - 10, y: y - 7, w: 20, d: 14, r: 2 }, 3, mark === 'edit' || mark === 'bad' ? 3 : 1.8, P), { crease: false, 'data-file': mark || undefined, tone: mark === 'edit' ? 'lit' : 'part' });
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
export interface PlacedLabel { key: string; text: string; x: number; y: number; place: 'top' | 'left' | 'right' | 'bottom'; side?: string }
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
  const a = s.agents.find((x) => x.id === key);
  if (a) { const m = a.scale ?? 1; return boxPts([a.at[0] + (a.tree ? 12 * m : 0), a.at[1]], (a.tree ? 36 : 22) * m, 22 * m, (TZ + TH + HEAD_H + 2) * m); }
  return [];
}

export interface Frame { w: number; h: number }

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
  if (s.project) {
    const p = s.project;
    const [x, y] = at(p.at);
    ents.push({ key: 'project', order: 10, sig: JSON.stringify([p.files, p.rules, p.skills, p.skillOut, p.commits?.slice(-10)]), html: () => projectMarkup(p), x, y, scale: 1, attrs: {} });
    if (p.rules && p.rules !== 'none') kinds.add('rules');
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
      attrs: { 'data-busy': a.busy ? '' : '-', 'data-lamp': a.lamp ?? 'off', 'data-model': a.model ?? 'a', 'data-tree': a.tree || '-', 'data-scan': a.scan ? '' : '-' },
    });
  }
  for (const g of s.gates ?? []) {
    const [x, y] = at(g.at);
    ents.push({ key: g.id, order: 520 + depth(g.at) / 100, sig: g.axis, html: () => gateMarkup(g), x, y, scale: 1, attrs: { 'data-lamp': g.lamp ?? 'off' } });
  }
  if (s.you) {
    const [x, y] = at(s.you);
    ents.push({ key: 'you', order: 600, sig: 'you', html: youMarkup, x, y, scale: 1, attrs: {} });
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
    labels.push({
      key: (typeof lab.at === 'string' ? lab.at : lab.at.join(',')) + '|' + lab.text,
      text: lab.text, place: lab.place ?? 'top', side: lab.side,
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
