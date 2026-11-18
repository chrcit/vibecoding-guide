// Fig. 3 geometry, built once at build time. A glass container (the context window) stands on a
// scale; layers drop into it as the agent works; a press above it comes down at compaction.
// Parts: plinth, scale body, pan, dial (ring and ticks), needle, glass, compaction mark, two posts,
// bar, rod, press plate, and the layers (eleven blocks over the whole run, never more than eight
// at once). The newest layer is the one lit part.
import * as k from '../kit/iso';
import { layers, STEPS, type Layer, type WindowInputs } from './model';

export const W = 640;
export const H = 420;

const PLINTH: k.Plan = { x: -66, y: -66, w: 132, d: 132, r: 10 };
const BODY: k.Plan = { x: -48, y: -48, w: 96, d: 96, r: 3 };
const BODY_H = 10;
const PAN: k.Plan = { x: -40, y: -40, w: 60, d: 60, r: 3 };
const PAN_TOP = BODY_H + 3;
const GLASS: k.Plan = { x: -36, y: -36, w: 52, d: 52, r: 0 };
const GLASS_H = 130;
const TOP = PAN_TOP + GLASS_H;
const INNER: k.Plan = k.inset(GLASS, 2);
const DIAL: k.Plane = [34, 34];
const POSTS: k.Plane[] = [[30, -44], [-44, 30]];
const POST_TOP = TOP + 40;
const BAR_Z = TOP + 30;
const HEAD: k.Plan = k.inset(GLASS, 3);
const HEAD_Z = TOP + 8;
const HEAD_H = 5;
const CX = GLASS.x + GLASS.w / 2, CY = GLASS.y + GLASS.d / 2;
/** How far a layer drops as it arrives. */
const DROP = 22;

const P = k.fit(
  [
    [PLINTH.x, PLINTH.y, -8], [PLINTH.x + PLINTH.w, PLINTH.y + PLINTH.d, -8],
    [PLINTH.x, PLINTH.y + PLINTH.d, -8], [PLINTH.x + PLINTH.w, PLINTH.y, -8],
    [POSTS[0]![0], POSTS[0]![1], POST_TOP], [POSTS[1]![0], POSTS[1]![1], POST_TOP],
  ],
  W, H, 22,
);

const zOf = (share: number) => PAN_TOP + share * GLASS_H;

function base() {
  return [
    k.halo(PLINTH, -8, P),
    k.solid(k.box(PLINTH, -8, 8, P), { tone: 'base' }),
    k.line(k.planLine(k.inset(PLINTH, 5), 0, P), 'faint'),
    k.solid(k.box(BODY, 0, BODY_H, P)),
    k.solid(k.box(PAN, BODY_H, PAN_TOP - BODY_H, P)),
  ];
}

function dial() {
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = ((-90 + i * 33) * Math.PI) / 180, [c, s] = [Math.cos(a), Math.sin(a)];
    return `M${(c * 7).toFixed(2)} ${(s * 7).toFixed(2)}L${(c * 9).toFixed(2)} ${(s * 9).toFixed(2)}`;
  }).join('');
  return [
    k.flat(k.ringLine(DIAL[0], DIAL[1], 10.5, BODY_H, P)),
    `<g transform="${k.planeMatrix(DIAL, BODY_H, P)}"><path class="k-line" d="${ticks}"/>` +
      `<g class="k-move" data-needle style="transform:rotate(-90deg)"><path class="k-line" data-tone="edge" d="M0 0L8 0"/></g>` +
      `<circle class="k-hub" r="1.4"/></g>`,
  ];
}

function posts() {
  return POSTS.map(([x, y]) => k.solid(k.cylinder(x, y, 3, 0, POST_TOP, P, 16)));
}

function bar() {
  const [a, b] = POSTS as [k.Plane, k.Plane];
  return k.solid(k.prism([[a[0] + 2.5, a[1] + 2.5], [b[0] + 2.5, b[1] + 2.5], [b[0] - 2.5, b[1] - 2.5], [a[0] - 2.5, a[1] - 2.5]], BAR_Z, 5, P));
}

/** The press: plate and rod, one group that moves down at compaction. */
function press() {
  return k.group(
    [k.solid(k.cylinder(CX, CY, 2.4, HEAD_Z + HEAD_H, BAR_Z + 12 - HEAD_Z - HEAD_H, P, 16)), k.solid(k.box(HEAD, HEAD_Z, HEAD_H, P))],
    { class: 'k-move', 'data-press': '' },
  );
}

/** One layer. Output layers carry fine lines, like a stack of printout. */
function layer(l: Layer, i: number, on: boolean, lit: boolean) {
  const z0 = zOf(l.from), h = zOf(l.to) - z0;
  const s = k.box(INNER, z0, h, P);
  const marks: string[] = [];
  if (l.kind === 'output') {
    const near = (z: number) => k.pathOf([[INNER.x + INNER.w, INNER.y, z], [INNER.x + INNER.w, INNER.y + INNER.d, z], [INNER.x, INNER.y + INNER.d, z]].map((p) => k.iso(p as k.Point3, P)));
    for (let z = z0 + 7; z < z0 + h - 3; z += 7) marks.push(k.line(near(z), 'faint'));
  }
  const up = k.shift([0, 0, DROP], P);
  return k.group([k.solid(s, { tone: lit ? 'lit' : 'part', 'data-layer-body': '' }), ...marks], {
    class: 'k-move',
    'data-layer': i,
    'data-step': l.step,
    style: on ? 'opacity:1;transform:translate(0px,0px)' : `opacity:0;transform:translate(${up[0].toFixed(1)}px,${up[1].toFixed(1)}px)`,
  });
}

export function drawWindowFills(x: WindowInputs) {
  const all = layers(x);
  const g = k.glass(GLASS, PAN_TOP, GLASS_H, P);
  const markZ = zOf(x.compactAt / x.windowTokens);
  const mark = k.pathOf([[GLASS.x + GLASS.w, GLASS.y, markZ], [GLASS.x + GLASS.w, GLASS.y + GLASS.d, markZ], [GLASS.x, GLASS.y + GLASS.d, markZ]].map((p) => k.iso(p as k.Point3, P)));
  // Paint lower layers first: each one hides the top face of the one beneath.
  const order = all.map((l, i) => ({ l, i })).sort((a, b) => a.l.from - b.l.from || a.i - b.i);
  const body = [
    ...base(),
    ...dial(),
    ...posts().slice(0, 1),
    `<path class="k-glass-back" d="${g.back}"/>`,
    ...order.map(({ l, i }) => layer(l, i, l.step === 0, l.step === 0)),
    `<path class="k-glass-front" d="${g.front}"/>`,
    `<path class="k-glass-edges" d="${g.edges}"/>`,
    k.line(mark, 'edge', { 'stroke-dasharray': '5 4' }),
    press(),
    bar(),
    ...posts().slice(1),
  ];
  const compactStep = STEPS.findIndex((st) => st.compact);
  const peak = Math.max(...all.filter((l) => l.step < compactStep).map((l) => l.to));
  const at = (p: k.Point3) => k.anchor(p, P, W, H);
  // The "newest" label sits to the right of the glass, at the middle of each layer.
  const side = (l: Layer) => at([GLASS.x + GLASS.w + 34, GLASS.y - 2, (zOf(l.from) + zOf(l.to)) / 2]);
  return {
    svg: k.svg(W, H, body),
    labels: [
      { name: 'Context window', id: 'window', at: at([GLASS.x - 30, GLASS.y + GLASS.d + 6, TOP - 6]) },
      { name: 'Compacts here', id: 'mark', at: at([GLASS.x + GLASS.w + 30, GLASS.y - 6, markZ + 8]) },
      { name: 'Compaction', id: 'press', at: at([CX, CY, POST_TOP + 14]) },
      { name: 'Sent every turn', id: 'scale', at: at([DIAL[0] + 26, DIAL[1] + 26, 0]) },
      { name: 'New: Instructions', id: 'newest', at: side(all[0]!) },
    ],
    motion: {
      newestAt: all.map(side),
      pressDown: k.shift([0, 0, -(HEAD_Z - zOf(peak))], P),
    },
  };
}

