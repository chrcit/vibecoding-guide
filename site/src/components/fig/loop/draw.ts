// Fig. 2 geometry, built once at build time. 18 parts: plate, track, four arrows, hub, three
// station blocks, the sheet, the press (post and head), the lamp, the tray, the gate and the puck.
import * as k from '../kit/iso';
import { STEPS, angleOf, EXIT, ANGLE, type Step } from './model';

export const W = 640;
export const H = 420;

const PLATE: k.Plan = { x: -100, y: -100, w: 200, d: 200, r: 14 };
const R0 = 52, R1 = 70, RT = (R0 + R1) / 2; // track band and the puck's path
const ST = 72; // station centre distance along each axis
const BLOCK = 34, BLOCK_H = 14;
const PUCK_R = 7.5, PUCK_H = 6;
const TRAY = { x: ST - 17, y: ST - 17, w: 34, d: 34, r: 4 };

const P = k.fit([...cornersOf(PLATE, -10, 0), [-ST, -ST, 62]], W, H, 28);

function cornersOf({ x, y, w, d }: k.Plan, z0: number, z1: number): k.Point3[] {
  const out: k.Point3[] = [];
  for (const px of [x, x + w]) for (const py of [y, y + d]) for (const z of [z0, z1]) out.push([px, py, z]);
  return out;
}

const rad = (deg: number) => (deg * Math.PI) / 180;
const onTrack = (deg: number, r = RT): k.Plane => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const centre = (x: number, y: number, s: number): k.Plan => ({ x: x - s / 2, y: y - s / 2, w: s, d: s, r: 2.5 });

function plate() {
  return [
    k.halo(PLATE, -10, P),
    k.solid(k.box(PLATE, -10, 10, P), { tone: 'base' }),
    k.flat(k.annulus(0, 0, R0, R1, 0, P)),
    ...[180, 270, 0, 90].map((a) => k.flat(k.arrow(onTrack(a), rad(a + 90), 9, 0, P), 'faint')),
    // the spur from the track to the tray
    k.flat(k.onPlane([onTrack(EXIT - 7, R1 - 1), [ST - 6, ST - 22], [ST - 22, ST - 6], onTrack(EXIT + 7, R1 - 1)], 0, P, true)),
  ];
}

function hub() {
  return [
    k.solid(k.cylinder(0, 0, 20, 0, 12, P)),
    k.line(k.ringLine(0, 0, 13, 12, P), 'faint'),
    k.dots([k.iso([0, 0, 12], P)], 2),
  ];
}

function read() {
  const [x, y] = [-ST, ST];
  const sheet: k.Plan = { x: x - 11, y: y - 13, w: 22, d: 26, r: 1 };
  return [
    k.solid(k.box(centre(x, y, BLOCK), 0, BLOCK_H, P)),
    k.solid(k.box(sheet, BLOCK_H, 1.2, P), { crease: false }),
    ...[0, 1, 2, 3].map((i) => k.line(k.onPlane([[x - 7, y - 8 + i * 5.5], [x + (i === 3 ? 1 : 7), y - 8 + i * 5.5]], BLOCK_H + 1.2, P))),
  ];
}

function act() {
  const [x, y] = [-ST, -ST];
  return {
    still: [
      k.solid(k.box(centre(x, y, BLOCK), 0, BLOCK_H, P)),
      k.solid(k.box(centre(x + 2, y + 2, 20), BLOCK_H, 2, P)),
      k.solid(k.cylinder(x - 9, y - 9, 2.6, BLOCK_H, 44, P, 16)),
    ],
    head: k.solid(k.box({ x: x - 10, y: y - 10, w: 24, d: 24, r: 2 }, BLOCK_H + 22, 8, P)),
  };
}

function check() {
  const [x, y] = [ST, -ST];
  return {
    still: [k.solid(k.box(centre(x, y, BLOCK), 0, BLOCK_H, P)), k.solid(k.cylinder(x, y, 10, BLOCK_H, 4, P))],
    lamp: k.solid(k.cylinder(x, y, 7, BLOCK_H + 4, 9, P), { 'data-lamp-body': '' }),
  };
}

function tray() {
  return [
    k.solid(k.box(TRAY, 0, 5, P)),
    k.flat(k.planLine(k.inset(TRAY, 4), 5, P)),
  ];
}

/** The gate across the spur: two posts and a bar that lifts when the check passes. */
function gate() {
  const a = onTrack(EXIT - 16, R1 + 6), b = onTrack(EXIT + 16, R1 + 6);
  const posts = [a, b].map(([x, y]) => k.solid(k.cylinder(x, y, 2.4, 0, 16, P, 14)));
  const bar = k.solid(k.prism(
    [[a[0] + 1.5, a[1] - 1.5], [b[0] + 1.5, b[1] - 1.5], [b[0] - 1.5, b[1] + 1.5], [a[0] - 1.5, a[1] + 1.5]], 8, 3, P,
  ));
  return { posts, bar };
}

function puck() {
  return [k.halo({ x: -PUCK_R, y: -PUCK_R, w: 2 * PUCK_R, d: 2 * PUCK_R, r: PUCK_R }, 0, P), k.solid(k.cylinder(0, 0, PUCK_R, 0, PUCK_H, P), { tone: 'lit' })];
}

/** Screen offset of the puck for a world angle, or the tray. */
function puckAt(deg: number | 'tray'): k.Flat {
  const [x, y] = deg === 'tray' ? [ST, ST] : onTrack(deg);
  return k.shift([x, y, deg === 'tray' ? 5 : 0], P);
}

/** Keyframes (screen offsets) for the move into step i from step i - 1. */
function pathInto(i: number): k.Flat[] {
  const from = angleOf(STEPS[i - 1]!), to = angleOf(STEPS[i]!);
  const out: k.Flat[] = [];
  for (let a = from; a < to; a += 15) out.push(puckAt(a));
  out.push(puckAt(to));
  if (STEPS[i]!.at === 'done') out.push(puckAt('tray'));
  return out;
}

const restOf = (s: Step) => (s.at === 'done' ? puckAt('tray') : puckAt(angleOf(s)));

export function drawLoop() {
  const a = act(), c = check(), g = gate();
  const lift = k.shift([0, 0, 14], P), press = k.shift([0, 0, -20], P);
  const body = [
    ...plate(),
    // back to front: the act station is furthest back, then the hub, the side stations, the gate and tray
    ...a.still,
    k.group(a.head, { class: 'k-move', 'data-press': '', style: 'transform:translate(0px,0px)' }),
    ...hub(),
    ...read(),
    ...c.still,
    k.group(c.lamp, { 'data-lamp': 'off' }),
    g.posts[0]!,
    k.group(g.bar, { class: 'k-move', 'data-gate': '' }),
    g.posts[1]!,
    ...tray(),
    k.group(puck(), { 'data-puck': '', style: `transform:translate(${restOf(STEPS[0]!).map((v) => v.toFixed(1) + 'px').join(',')})` }),
  ];
  const label = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, body),
    labels: [
      { name: 'Read', id: 'read', at: label([-ST, ST, 40]) },
      { name: 'Act', id: 'act', at: label([-ST, -ST, 72]) },
      { name: 'Check', id: 'check', at: label([ST, -ST, 46]) },
      { name: 'Model', id: 'model', at: label([0, 0, 34]) },
      { name: 'Done', id: 'done', at: label([ST + 24, ST + 24, 0]) },
    ],
    motion: {
      rest: STEPS.map(restOf),
      paths: STEPS.map((_, i) => (i ? pathInto(i) : [])),
      lift,
      press,
    },
  };
}

export { ANGLE };
