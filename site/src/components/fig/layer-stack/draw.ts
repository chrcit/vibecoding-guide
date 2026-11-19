// Fig. 65 geometry, built once at build time. Four plates step down from left to right, one per
// layer of the product: interface, context, harness, model. Governance is the checkpoint beside the
// harness (a gate and a lamp); emergence is the two other threads behind. 24 parts.
import * as k from '../kit/iso';
import { MAX_BLOCKS, type Spot } from './model';

export const W = 760;
export const H = 440;

/** Step between the plates: across (world x and -y) and down. */
const ACROSS = 66;
const DROP = 50;
const PW = 150, PD = 112, PT = 7;

const centre = (i: number): k.Point3 => [i * ACROSS, -i * ACROSS, (3 - i) * DROP];
const plan = (cx: number, cy: number, w: number, d: number, r = 3): k.Plan => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });

const [IX, IY, IZ] = centre(0);
const [CX, CY, CZ] = centre(1);
const [HX, HY, HZ] = centre(2);
const [MX, MY, MZ] = centre(3);
/** The checkpoint sits in front of the harness, on the floor of the model plate's level. */
const G: k.Point3 = [HX + 6, HY + 112, 0];
/** The other threads: two plates behind the interface. */
const GHOSTS: k.Point3[] = [[IX + 6, IY - 150, IZ + 12], [IX + 12, IY - 282, IZ + 24]];
const GHOST_W = 96, GHOST_D = 74;

const TANK = plan(CX - 22, CY - 6, 58, 58, 2);
const TANK_H = 46;
const BLOCK_H = 5.2, BLOCK_GAP = 0.9;

const corners = (cx: number, cy: number, w: number, d: number, z0: number, z1: number): k.Point3[] => {
  const out: k.Point3[] = [];
  for (const x of [cx - w / 2, cx + w / 2]) for (const y of [cy - d / 2, cy + d / 2]) for (const z of [z0, z1]) out.push([x, y, z]);
  return out;
};

const P = k.fit(
  [
    ...[0, 1, 2, 3].flatMap((i) => { const [x, y, z] = centre(i); return corners(x, y, PW, PD, z - PT, z + 50); }),
    ...corners(G[0], G[1], 70, 50, -6, 30),
    ...GHOSTS.flatMap(([x, y, z]) => corners(x, y, GHOST_W, GHOST_D, z - 5, z + 30)),
  ],
  W, H, 18,
);

/** Where the request rests at each spot. */
export const SPOTS: Record<Spot, k.Point3> = {
  you: [IX + 34, IY + 24, IZ],
  context: [CX + 40, CY + 30, CZ],
  harness: [HX + 40, HY + 30, HZ],
  model: [MX - 14, MY - 6, MZ + 30],
  gate: [G[0] - 2, G[1], 0],
  check: [G[0] + 22, G[1] + 2, 0],
};

const PUCK_R = 8, PUCK_H = 6;

function plate(i: number) {
  const [x, y, z] = centre(i);
  const p = plan(x, y, PW, PD, 12);
  return [k.halo(p, z - PT, P), k.solid(k.box(p, z - PT, PT, P), { tone: 'base' })];
}

function iface() {
  // An upright screen at the back of the plate, a keyboard slab in front of it.
  const screen = k.box(plan(IX - 18, IY - 34, 66, 5, 1.5), IZ, 40, P);
  return [
    k.solid(screen),
    ...[10, 18, 26].map((h, n) => k.line(k.pathOf([k.iso([IX - 44, IY - 31.3, IZ + 40 - h], P), k.iso([IX + (n === 2 ? -14 : 8), IY - 31.3, IZ + 40 - h], P)]), 'faint')),
    k.solid(k.box(plan(IX - 12, IY + 4, 52, 22, 2), IZ, 3, P)),
  ];
}

function context() {
  const g = k.glass(TANK, CZ, TANK_H, P);
  const inner = k.inset(TANK, 3.5);
  const blocks = Array.from({ length: MAX_BLOCKS }, (_, n) => {
    const z = CZ + 1 + n * (BLOCK_H + BLOCK_GAP);
    return k.group(k.solid(k.box(inner, z, BLOCK_H, P), { tone: n === 0 ? 'base' : 'part' }), {
      class: 'k-move ls-block', 'data-block': n, style: 'opacity:0',
    });
  });
  return [
    `<path class="k-glass-back" d="${g.back}"/>`,
    ...blocks,
    `<path class="k-glass-front" d="${g.front}"/>`,
    `<path class="k-glass-edges" d="${g.edges}"/>`,
  ];
}

function harness() {
  // A housing with a valve wheel: the program that turns the model's words into actions.
  return [
    k.solid(k.box(plan(HX - 18, HY - 10, 50, 50, 3), HZ, 22, P)),
    k.solid(k.cylinder(HX - 18, HY - 10, 13, HZ + 22, 4, P)),
    k.line(k.ringLine(HX - 18, HY - 10, 7, HZ + 26, P), 'faint'),
    k.dots([k.iso([HX - 18, HY - 10, HZ + 26], P)], 2),
  ];
}

function model() {
  const at = [MX - 14, MY - 6] as const;
  return {
    rest: [k.solid(k.cylinder(at[0], at[1], 30, MZ, 6, P), { tone: 'base' })],
    core: k.solid(k.cylinder(at[0], at[1], 22, MZ + 6, 24, P)),
    lit: k.solid(k.cylinder(at[0], at[1], 22, MZ + 6, 24, P), { tone: 'lit' }),
  };
}

function checkpoint() {
  const [x, y] = G;
  const p = plan(x + 6, y, 74, 48, 8);
  const a: k.Plane = [x - 10, y - 18], b: k.Plane = [x - 10, y + 18];
  const posts = [a, b].map(([px, py]) => k.solid(k.cylinder(px, py, 2.6, 6, 22, P, 14)));
  const bar = k.solid(k.prism([[a[0] - 1.6, a[1]], [b[0] - 1.6, b[1]], [b[0] + 1.6, b[1]], [a[0] + 1.6, a[1]]], 15, 3.2, P));
  return {
    base: [k.halo(p, 0, P), k.solid(k.box(p, 0, 6, P), { tone: 'base' })],
    posts,
    bar,
    lampBody: k.solid(k.box(plan(x + 24, y + 2, 18, 18, 2), 6, 8, P)),
    lamp: k.solid(k.cylinder(x + 24, y + 2, 6.5, 14, 8, P)),
  };
}

function ghost([x, y, z]: k.Point3) {
  const p = plan(x, y, GHOST_W, GHOST_D, 10);
  return [
    k.solid(k.box(p, z - 5, 5, P), { tone: 'base' }),
    k.solid(k.box(plan(x - 12, y - 22, 44, 4, 1.5), z, 26, P)),
  ];
}

function puck(tone: 'lit' | 'part' = 'lit') {
  return [
    k.halo({ x: -PUCK_R, y: -PUCK_R, w: 2 * PUCK_R, d: 2 * PUCK_R, r: PUCK_R }, 0, P),
    k.solid(k.cylinder(0, 0, PUCK_R, 0, PUCK_H, P), { tone }),
  ];
}

const off = (p: k.Point3): k.Flat => k.shift(p, P);
const px = ([x, y]: k.Flat) => `transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;

/** The hit area of a layer: the silhouette of its plate and what stands on it. */
const hit = (pts: k.Point3[]) => k.pathOf(k.hull(pts.map((p) => k.iso(p, P))), true);

export function drawStack() {
  const m = model(), c = checkpoint();
  const layer = (id: string, body: string[], area: k.Point3[]) =>
    k.group([`<path class="ls-hit" d="${hit(area)}"/>`, ...body], { class: 'ls-layer', 'data-layer': id });

  // Ghost pucks rest on their own plates and move to you when their threads finish.
  const ghostRest = GHOSTS.map(([x, y, z]) => off([x + 18, y + 14, z]));
  const ghostHome = [off([IX + 52, IY + 6, IZ]), off([IX + 16, IY + 42, IZ])];

  const body = [
    // back to front
    layer('emergence', GHOSTS.flatMap(ghost), GHOSTS.flatMap(([x, y, z]) => corners(x, y, GHOST_W, GHOST_D, z - 5, z + 26))),
    layer('interface', [...plate(0), ...iface()], corners(IX, IY, PW, PD, IZ - PT, IZ + 40)),
    layer('context', [...plate(1), ...context()], corners(CX, CY, PW, PD, CZ - PT, CZ + TANK_H)),
    layer('harness', [...plate(2), ...harness()], corners(HX, HY, PW, PD, HZ - PT, HZ + 26)),
    layer('model', [
      ...plate(3), ...m.rest, m.core,
      k.group(m.lit, { class: 'k-move', 'data-core': '', style: 'opacity:0' }),
    ], corners(MX, MY, PW, PD, MZ - PT, MZ + 30)),
    layer('governance', [
      ...c.base, c.posts[0]!, k.group(c.bar, { class: 'k-move', 'data-gate': '' }), c.posts[1]!, c.lampBody,
      k.group(c.lamp, { 'data-lamp': 'off' }),
    ], corners(G[0] + 6, G[1], 74, 48, 0, 26)),
    ...ghostRest.map((r, n) => k.group(puck('part'), { class: 'k-move', 'data-ghost': n, style: px(r) })),
    k.group(puck(), { 'data-puck': '', style: px(off(SPOTS.you)) }),
  ];

  const label = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, body),
    labels: {
      interface: label([IX - 50, IY - 40, IZ + 58]),
      context: label([CX - 40, CY - 40, CZ + 64]),
      harness: label([HX - 40, HY - 40, HZ + 44]),
      model: label([MX + 34, MY + 64, MZ - 4]),
      governance: label([G[0] + 6, G[1] + 46, -4]),
      emergence: label([GHOSTS[1]![0] - 10, GHOSTS[1]![1] - 30, GHOSTS[1]![2] + 52]),
    },
    motion: {
      spots: Object.fromEntries(Object.entries(SPOTS).map(([id, p]) => [id, off(p)])) as Record<Spot, k.Flat>,
      /** Lift at the top of a hop between two spots. */
      hop: off([0, 0, 34]),
      gate: off([0, 0, 14]),
      drop: off([0, 0, 26]),
      ghostRest,
      ghostHome,
    },
  };
}
