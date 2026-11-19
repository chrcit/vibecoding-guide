// Fig. 66 geometry, built once at build time. A round track on a plate with the model at its hub,
// three stations outside the track (read, act, check), a spur to a done tray. 16 parts.
import * as k from '../kit/iso';
import { ANGLE, EXIT, angleOf, type Step } from './model';

export const W = 480;
export const H = 330;

const HALF = 118;
const PLATE: k.Plan = { x: -HALF, y: -HALF, w: 2 * HALF, d: 2 * HALF, r: 16 };
const R0 = 50, R1 = 70, RT = (R0 + R1) / 2;
const SR = 96; // station distance from the centre
const BLOCK = 34, BLOCK_H = 13;
const PUCK_R = 8, PUCK_H = 6;

const rad = (d: number) => (d * Math.PI) / 180;
const polar = (deg: number, r: number): k.Plane => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const sq = ([x, y]: k.Plane, s: number, r = 3): k.Plan => ({ x: x - s / 2, y: y - s / 2, w: s, d: s, r });

const P = k.fit(
  [[-HALF, -HALF, -9], [HALF, HALF, -9], [-HALF, HALF, -9], [HALF, -HALF, -9], [-HALF, -HALF, 40], ...[ANGLE.act].map((a) => [...polar(a, SR), 64] as k.Point3)],
  W, H, 14,
);

const READ = polar(ANGLE.read, SR), ACT = polar(ANGLE.act, SR), CHECK = polar(ANGLE.check, SR), TRAY = polar(EXIT, SR + 4);

function plate() {
  return [
    k.halo(PLATE, -9, P),
    k.solid(k.box(PLATE, -9, 9, P), { tone: 'base' }),
    k.flat(k.annulus(0, 0, R0, R1, 0, P)),
    ...[120, 210, 330].map((a) => k.flat(k.arrow(polar(a, RT), rad(a + 90), 9, 0, P), 'faint')),
    k.flat(k.onPlane([polar(EXIT - 8, R1 - 1), polar(EXIT - 4, SR - 14), polar(EXIT + 4, SR - 14), polar(EXIT + 8, R1 - 1)], 0, P, true)),
  ];
}

const hub = () => [k.solid(k.cylinder(0, 0, 22, 0, 16, P)), k.line(k.ringLine(0, 0, 13, 16, P), 'faint')];

function read() {
  const [x, y] = READ;
  return [
    k.solid(k.box(sq(READ, BLOCK), 0, BLOCK_H, P)),
    k.solid(k.box({ x: x - 11, y: y - 13, w: 22, d: 26, r: 1 }, BLOCK_H, 1.4, P), { crease: false }),
    ...[0, 1, 2, 3].map((i) => k.line(k.onPlane([[x - 7, y - 8 + i * 5.5], [x + (i === 3 ? 1 : 7), y - 8 + i * 5.5]], BLOCK_H + 1.4, P))),
  ];
}

function act() {
  const [x, y] = ACT;
  return {
    still: [k.solid(k.box(sq(ACT, BLOCK), 0, BLOCK_H, P)), k.solid(k.cylinder(x - 10, y - 10, 2.8, BLOCK_H, 42, P, 14))],
    head: k.solid(k.box({ x: x - 11, y: y - 11, w: 24, d: 24, r: 2 }, BLOCK_H + 22, 8, P)),
  };
}

function check() {
  const [x, y] = CHECK;
  return {
    still: [k.solid(k.box(sq(CHECK, BLOCK), 0, BLOCK_H, P)), k.solid(k.cylinder(x, y, 11, BLOCK_H, 4, P))],
    lamp: k.solid(k.cylinder(x, y, 7.5, BLOCK_H + 4, 10, P)),
  };
}

const tray = () => [k.solid(k.box(sq(TRAY, 34, 4), 0, 5, P)), k.flat(k.planLine(k.inset(sq(TRAY, 34, 4), 4), 5, P))];

const puck = () => [k.halo({ x: -PUCK_R, y: -PUCK_R, w: 2 * PUCK_R, d: 2 * PUCK_R, r: PUCK_R }, 0, P), k.solid(k.cylinder(0, 0, PUCK_R, 0, PUCK_H, P), { tone: 'lit' })];

function puckAt(deg: number | 'tray'): k.Flat {
  const [x, y] = deg === 'tray' ? TRAY : polar(deg, RT);
  return k.shift([x, y, deg === 'tray' ? 5 : 0], P);
}

/** Screen keyframes for the move from one step to the next. */
export function pathBetween(from: Step, to: Step): k.Flat[] {
  const a = angleOf(from), b = angleOf(to);
  const out: k.Flat[] = [];
  for (let d = a; d < b; d += 15) out.push(puckAt(d));
  out.push(puckAt(b));
  if (to.at === 'done') out.push(puckAt('tray'));
  return out;
}
export const restOf = (s: Step) => (s.at === 'done' ? puckAt('tray') : puckAt(angleOf(s)));

export function drawLoopRun() {
  const a = act(), c = check();
  // Back to front by depth: the act station is furthest back.
  const body = [
    ...plate(),
    ...a.still,
    k.group(a.head, { class: 'k-move', 'data-press': '' }),
    ...read(),
    ...hub(),
    ...c.still,
    k.group(c.lamp, { 'data-lamp': 'off' }),
    ...tray(),
    k.group(puck(), { 'data-puck': '' }),
  ];
  const label = (p: k.Point3) => k.anchor(p, P, W, H);
  return {
    svg: k.svg(W, H, body),
    labels: [
      { id: 'read', name: 'Read', at: label([READ[0] - 4, READ[1] + 30, 0]) },
      { id: 'act', name: 'Act', at: label([ACT[0], ACT[1], 78]) },
      { id: 'check', name: 'Check', at: label([CHECK[0] + 30, CHECK[1] - 4, 0]) },
      { id: 'in', name: 'Model', at: label([0, 0, 40]) },
      { id: 'done', name: 'Done', at: label([TRAY[0] + 30, TRAY[1] + 14, 0]) },
    ],
    press: k.shift([0, 0, -20], P),
  };
}
