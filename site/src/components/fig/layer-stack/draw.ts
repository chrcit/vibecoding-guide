// Fig. 65 geometry, built once at build time. Four plates step down from left to right, one per
// layer of the product: interface, context, harness, model. Governance is the checkpoint beside the
// harness (a gate and a lamp); emergence is the two other threads behind. 24 parts.
import * as k from '../kit/iso';
import { MAX_BLOCKS, type Spot } from './model';

export const W = 720;
export const H = 460;

/** Step between the plates: across (world x and -y) and down. */
const ACROSS = 96;
const DROP = 78;
const PW = 132, PD = 104, PT = 7;

const centre = (i: number): k.Point3 => [i * ACROSS, -i * ACROSS, (3 - i) * DROP];
const plan = (cx: number, cy: number, w: number, d: number, r = 3): k.Plan => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });

const [IX, IY, IZ] = centre(0);
const [CX, CY, CZ] = centre(1);
const [HX, HY, HZ] = centre(2);
const [MX, MY, MZ] = centre(3);
/** The checkpoint sits in front of the harness, on the floor of the model plate's level. */
const G: k.Point3 = [HX - 10, HY + 150, 0];
/** The other threads: two plates behind the interface. */
const GHOSTS: k.Point3[] = [[IX + 90, IY - 210, IZ], [IX + 200, IY - 290, IZ - 20]];
const GHOST_W = 84, GHOST_D = 64;

const TANK = plan(CX - 14, CY - 8, 70, 66, 2);
const TANK_H = 56;
const BLOCK_H = 6.4, BLOCK_GAP = 1;

const corners = (cx: number, cy: number, w: number, d: number, z0: number, z1: number): k.Point3[] => {
  const out: k.Point3[] = [];
  for (const x of [cx - w / 2, cx + w / 2]) for (const y of [cy - d / 2, cy + d / 2]) for (const z of [z0, z1]) out.push([x, y, z]);
  return out;
};

const P = k.fit(
  [
    ...[0, 1, 2, 3].flatMap((i) => { const [x, y, z] = centre(i); return corners(x, y, PW, PD, z - PT, z + 50); }),
    ...corners(G[0] + 8, G[1], 100, 66, 0, 40),
    ...GHOSTS.flatMap(([x, y, z]) => corners(x, y, GHOST_W, GHOST_D, z - 5, z + 30)),
  ],
  W, H, 18,
);

/** Where the request rests at each spot. */
export const SPOTS: Record<Spot, k.Point3> = {
  you: [IX + 34, IY + 24, IZ],
  context: [CX + 40, CY + 30, CZ],
  harness: [HX + 40, HY + 30, HZ],
  model: [MX - 14, MY - 6, MZ + 39],
  gate: [G[0] - 4, G[1], 7],
  check: [G[0] + 30, G[1] + 30, 7],
};

const PUCK_R = 8, PUCK_H = 6;

function plate(i: number) {
  const [x, y, z] = centre(i);
  const p = plan(x, y, PW, PD, 12);
  return [k.halo(p, z - PT, P), k.solid(k.box(p, z - PT, PT, P), { tone: 'base' })];
}

function iface() {
  // An upright screen at the back of the plate, a keyboard slab in front of it.
  const screen = k.box(plan(IX - 14, IY - 30, 80, 5, 1.5), IZ, 48, P);
  return [
    k.solid(screen),
    ...[11, 20, 29].map((h, n) => k.line(k.pathOf([k.iso([IX - 48, IY - 27.3, IZ + 48 - h], P), k.iso([IX + (n === 2 ? -12 : 16), IY - 27.3, IZ + 48 - h], P)]), 'faint')),
    k.solid(k.box(plan(IX - 10, IY + 8, 62, 26, 2), IZ, 4, P)),
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
    k.solid(k.box(plan(HX - 14, HY - 10, 64, 60, 3), HZ, 26, P)),
    k.solid(k.cylinder(HX - 14, HY - 10, 17, HZ + 26, 5, P)),
    k.line(k.ringLine(HX - 14, HY - 10, 9, HZ + 31, P), 'faint'),
    k.dots([k.iso([HX - 14, HY - 10, HZ + 31], P)], 2.2),
  ];
}

function model() {
  const at = [MX - 14, MY - 6] as const;
  return {
    rest: [k.solid(k.cylinder(at[0], at[1], 38, MZ, 7, P), { tone: 'base' })],
    core: k.solid(k.cylinder(at[0], at[1], 28, MZ + 7, 32, P), { tone: 'part' }),
    lit: k.solid(k.cylinder(at[0], at[1], 28, MZ + 7, 32, P), { tone: 'lit' }),
  };
}

function checkpoint() {
  const [x, y] = G;
  const p = plan(x + 8, y, 100, 66, 10);
  const a: k.Plane = [x - 16, y - 24], b: k.Plane = [x - 16, y + 24];
  const posts = [a, b].map(([px, py]) => k.solid(k.cylinder(px, py, 3.4, 7, 30, P, 14)));
  const bar = k.solid(k.prism([[a[0] - 2, a[1]], [b[0] - 2, b[1]], [b[0] + 2, b[1]], [a[0] + 2, a[1]]], 21, 4, P));
  return {
    base: [k.halo(p, 0, P), k.solid(k.box(p, 0, 7, P), { tone: 'base' })],
    posts,
    bar,
    lampBody: k.solid(k.box(plan(x + 30, y + 2, 26, 26, 2.5), 7, 10, P)),
    lamp: k.solid(k.cylinder(x + 30, y + 2, 9, 17, 11, P)),
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
    ], corners(G[0] + 8, G[1], 100, 66, 0, 34)),
    ...ghostRest.map((r, n) => k.group(puck('part'), { class: 'k-move', 'data-ghost': n, style: px(r) })),
    k.group(puck(), { 'data-puck': '', style: px(off(SPOTS.you)) }),
  ];

  const label = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, body),
    labels: {
      interface: label([IX - PW / 2 + 30, IY + PD / 2 - 10, IZ - 26]),
      context: label([CX - PW / 2 + 4, CY + PD / 2 + 4, CZ - 26]),
      harness: label([HX - PW / 2 + 4, HY + PD / 2 + 4, HZ - 26]),
      model: label([MX - PW / 2 + 4, MY + PD / 2 + 4, MZ - 26]),
      governance: label([G[0] - 40, G[1] + 40, -24]),
      emergence: label([GHOSTS[1]![0] + 10, GHOSTS[1]![1] - 10, GHOSTS[1]![2] + 56]),
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
