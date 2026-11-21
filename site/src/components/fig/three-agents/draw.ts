// Fig. 1 geometry, built once at build time. 20 parts: the desk; three terminals, each a foot, a
// neck and a body with a screen; three flags, each a mast on the terminal and a flag that pops up
// when that agent is done and waiting; your seat, its cap and the
// arm (the one lit part). Screen lines and lane grooves are marks, not parts.
import * as k from '../kit/iso';
import { MOMENTS, LINES, LANES } from './model';

export const W = 640;
export const H = 420;

const DESK: k.Plan = { x: -100, y: -100, w: 150, d: 150, r: 14 };
const PIVOT: k.Plane = [22, 22];
const SEAT_R = 10, SEAT_H = 12;
const ARM_Z = SEAT_H + 3;
const ARM_LEN = 52;

const BODY_W = 50, BODY_D = 8, BODY_Z = 13, BODY_H = 34;
const FLAG_UP = 22, FLAG_DROP = 9;

interface Terminal { c: k.Plane; n: k.Plane }
const S = Math.SQRT1_2;
/** Left, back and right of you, each facing your seat. */
export const TERMINALS: Terminal[] = [
  { c: [-66, 32], n: [1, 0] },
  { c: [-42, -42], n: [S, S] },
  { c: [32, -66], n: [0, 1] },
];

/** The direction along a screen that reads left to right for the viewer. */
const along = ([nx, ny]: k.Plane): k.Plane => [ny, -nx];

const pt = (t: Terminal, s: number, off: number): k.Plane => {
  const u = along(t.n);
  return [t.c[0] + u[0] * s + t.n[0] * off, t.c[1] + u[1] * s + t.n[1] * off];
};

/** A rectangle in plan, w along the screen and d front to back, centred on the terminal. */
function rect(t: Terminal, w: number, d: number, s0 = 0, off0 = 0): k.Plane[] {
  return [
    pt(t, s0 - w / 2, off0 - d / 2), pt(t, s0 + w / 2, off0 - d / 2),
    pt(t, s0 + w / 2, off0 + d / 2), pt(t, s0 - w / 2, off0 + d / 2),
  ];
}

/** A path on the front face of a terminal: (s, z) pairs. */
function onFace(t: Terminal, pts: [number, number][], P: k.Projection, closed = false) {
  return k.pathOf(pts.map(([s, z]) => { const [x, y] = pt(t, s, BODY_D / 2 + 0.05); return k.iso([x, y, z], P); }), closed);
}

const deskPoints: k.Point3[] = [
  [DESK.x, DESK.y, -10], [DESK.x + DESK.w, DESK.y + DESK.d, -10], [DESK.x, DESK.y + DESK.d, -10], [DESK.x + DESK.w, DESK.y, -10],
  [-42, -42, BODY_Z + BODY_H + FLAG_UP + 22], [-66, 32, BODY_Z + BODY_H], [32, -66, BODY_Z + BODY_H],
];
const P = k.fit(deskPoints, W, H, 26);

const angleTo = (i: number) => {
  const [x, y] = TERMINALS[i]!.c;
  const a = (Math.atan2(y - PIVOT[1], x - PIVOT[0]) * 180) / Math.PI;
  // Keep the three angles in one sweep so the arm never swings the long way round.
  return a > 90 ? a - 360 : a;
};
export const ANGLES = [0, 1, 2].map(angleTo);

/** Code-like line lengths on a screen, top to bottom. */
const LINE_LEN = [30, 22, 34, 16];

function terminal(t: Terminal, i: number) {
  const screen = onFace(t, [[-21, BODY_Z + 4], [21, BODY_Z + 4], [21, BODY_Z + BODY_H - 4], [-21, BODY_Z + BODY_H - 4]], P, true);
  const lines = LINE_LEN.map((len, j) => {
    const z = BODY_Z + BODY_H - 10 - j * 6.2;
    const s0 = -16 + (j === 1 || j === 2 ? 5 : 0);
    return k.group(k.line(onFace(t, [[s0, z], [s0 + len - (j === 1 || j === 2 ? 5 : 0), z]], P), 'edge'), {
      class: 'k-move', 'data-line': `${i}-${j}`, style: `opacity:${j < MOMENTS[0]!.lines[i]! ? 1 : 0}`,
    });
  });
  return [
    k.solid(k.prism(rect(t, 28, 18), 0, 3, P)),
    k.solid(k.cylinder(t.c[0], t.c[1], 2.6, 3, BODY_Z - 3, P, 14)),
    k.solid(k.prism(rect(t, BODY_W, BODY_D), BODY_Z, BODY_H, P)),
    k.flat(screen),
    ...lines,
  ];
}

/** A short mast on the terminal's top corner; the flag on it pops up when the agent is done. */
function flag(t: Terminal, i: number) {
  const top = BODY_Z + BODY_H;
  const [x, y] = pt(t, BODY_W / 2 - 5, 0);
  const post = k.solid(k.cylinder(x, y, 1.4, top, FLAG_UP, P, 12));
  const u = along(t.n);
  const ring: k.Plane[] = [
    [x + u[0] * 1.2 - t.n[0] * 0.8, y + u[1] * 1.2 - t.n[1] * 0.8],
    [x + u[0] * 15 - t.n[0] * 0.8, y + u[1] * 15 - t.n[1] * 0.8],
    [x + u[0] * 15 + t.n[0] * 0.8, y + u[1] * 15 + t.n[1] * 0.8],
    [x + u[0] * 1.2 + t.n[0] * 0.8, y + u[1] * 1.2 + t.n[1] * 0.8],
  ];
  const down = k.shift([0, 0, -FLAG_DROP], P);
  const cloth = k.group(k.solid(k.prism(ring, top + FLAG_UP - 10, 10, P), { crease: false }), {
    class: 'k-move', 'data-flag': i, style: `opacity:0;transform:translate(${down[0].toFixed(1)}px,${down[1].toFixed(1)}px)`,
  });
  return [post, cloth];
}

function desk() {
  const lanes = TERMINALS.map((t) => {
    const [x, y] = pt(t, 0, 14);
    return k.line(k.onPlane([[PIVOT[0], PIVOT[1]], [x, y]], 0, P), 'faint', { 'stroke-dasharray': '3 4' });
  });
  return [k.halo(DESK, -10, P), k.solid(k.box(DESK, -10, 10, P), { tone: 'base' }), k.line(k.planLine(k.inset(DESK, 6), 0, P), 'faint'), ...lanes];
}

function you() {
  const arm =
    `M6 -4.2L${ARM_LEN - 8} -4.2L${ARM_LEN} 0L${ARM_LEN - 8} 4.2L6 4.2A4.2 4.2 0 0 1 6 -4.2Z`;
  return [
    k.halo({ x: PIVOT[0] - SEAT_R, y: PIVOT[1] - SEAT_R, w: SEAT_R * 2, d: SEAT_R * 2, r: SEAT_R }, 0, P),
    k.solid(k.cylinder(PIVOT[0], PIVOT[1], SEAT_R, 0, SEAT_H, P)),
    k.solid(k.cylinder(PIVOT[0], PIVOT[1], 5, SEAT_H, 3, P, 18)),
    // The arm has a body: a darker copy just below the lit top, turning with it.
    `<g transform="${k.planeMatrix(PIVOT, ARM_Z - 3, P)}"><g class="k-move" data-arm style="transform:rotate(${ANGLES[MOMENTS[0]!.you]!.toFixed(1)}deg)">` +
      `<path class="fig-arm-side" d="${arm}"/></g></g>` +
    `<g transform="${k.planeMatrix(PIVOT, ARM_Z, P)}"><g class="k-move" data-arm style="transform:rotate(${ANGLES[MOMENTS[0]!.you]!.toFixed(1)}deg)">` +
      `<path class="k-flat" data-tone="lit" d="${arm}"/><path class="k-line" data-tone="lit" d="${arm}"/></g>` +
      `<circle class="k-hub" r="2.2"/></g>`,
  ];
}

export function drawThreeAgents() {
  const items = TERMINALS.map((t, i) => ({ at: [t.c[0], t.c[1], 0] as k.Point3, svg: [...terminal(t, i), ...flag(t, i)] }));
  const body = [
    ...desk(),
    ...k.byDepth(items, (it) => it.at).flatMap((it) => it.svg),
    ...you(),
  ];
  const label = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, body),
    labels: [
      ...TERMINALS.map((t, i) => ({ name: LANES[i]!, id: `lane-${i}`, at: label([t.c[0], t.c[1], BODY_Z + BODY_H + FLAG_UP + 12]) })),
      { name: 'You', id: 'you', at: label([PIVOT[0] + 20, PIVOT[1] + 20, 0]) },
    ],
    motion: { angles: ANGLES, flagUp: [0, 0] as k.Flat, flagDown: k.shift([0, 0, -FLAG_DROP], P), lines: LINES },
  };
}
